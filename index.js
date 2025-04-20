var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertOrderSchema: () => insertOrderSchema,
  insertUserSchema: () => insertUserSchema,
  jewelryTypes: () => jewelryTypes,
  orderFormSchema: () => orderFormSchema,
  orders: () => orders,
  users: () => users
});
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  jewelryType: text("jewelry_type").notNull(),
  description: text("description").notNull(),
  imagePath: text("image_path"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull()
});
var insertOrderSchema = createInsertSchema(orders).pick({
  fullName: true,
  email: true,
  phone: true,
  jewelryType: true,
  description: true,
  imagePath: true
});
var orderFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Phone number is required"),
  jewelryType: z.string().min(1, "Please select a jewelry type"),
  description: z.string().min(10, "Please provide a detailed description"),
  image: z.instanceof(File).optional()
});
var jewelryTypes = ["Ring", "Necklace", "Bracelet", "Earrings", "Other"];

// server/storage.ts
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
async function initializeDatabase() {
  const adminUser = await db.select().from(users).where(eq(users.username, "admin"));
  if (adminUser.length === 0) {
    await db.insert(users).values({
      username: "admin",
      password: "admin123"
      // In a real app, this would be hashed
    });
    console.log("Admin user created");
  }
  const uploadDir = join(process.cwd(), "uploads");
  if (!existsSync(uploadDir)) {
    mkdir(uploadDir, { recursive: true }).catch((err) => {
      console.error("Failed to create uploads directory:", err);
    });
  }
}
initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err);
});
var DatabaseStorage = class {
  uploadDir;
  constructor() {
    this.uploadDir = join(process.cwd(), "uploads");
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async createOrder(insertOrder) {
    const orderData = {
      ...insertOrder,
      imagePath: insertOrder.imagePath || null
    };
    const [order] = await db.insert(orders).values(orderData).returning();
    return order;
  }
  async getOrders() {
    return db.select().from(orders).orderBy(orders.submittedAt, "desc");
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || void 0;
  }
  async deleteOrder(id) {
    const result = await db.delete(orders).where(eq(orders.id, id)).returning();
    return result.length > 0;
  }
  async saveImage(buffer, originalName) {
    const timestamp2 = Date.now();
    const fileExt = originalName.split(".").pop();
    const filename = `${timestamp2}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = join(this.uploadDir, filename);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import multer from "multer";
import { join as join2 } from "path";
import express from "express";

// server/auth.ts
import session from "express-session";
import MemoryStore from "memorystore";
var MemoryStoreSession = MemoryStore(session);
var sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "maya-jewelry-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1e3,
    // 24 hours
    secure: process.env.NODE_ENV === "production"
  },
  store: new MemoryStoreSession({
    checkPeriod: 864e5
    // prune expired entries every 24h
  })
});
var requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
var login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try {
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.userId = user.id;
    req.session.username = user.username;
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};
var logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
};
var getCurrentUser = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({
    id: req.session.userId,
    username: req.session.username
  });
};

// server/routes.ts
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});
async function registerRoutes(app2) {
  app2.use("/uploads", express.static(join2(process.cwd(), "uploads")));
  app2.use(sessionMiddleware);
  app2.post("/api/login", login);
  app2.post("/api/logout", logout);
  app2.get("/api/user", getCurrentUser);
  app2.post("/api/orders", upload.single("image"), async (req, res) => {
    try {
      const { fullName, email, phone, jewelryType, description } = req.body;
      if (!fullName || !email || !phone || !jewelryType || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }
      let imagePath = void 0;
      if (req.file) {
        try {
          imagePath = await storage.saveImage(req.file.buffer, req.file.originalname);
        } catch (err) {
          console.error("Error saving image:", err);
          return res.status(500).json({ message: "Failed to save image" });
        }
      }
      const order = await storage.createOrder({
        fullName,
        email,
        phone,
        jewelryType,
        description,
        imagePath
      });
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders", requireAuth, async (_req, res) => {
    try {
      const orders2 = await storage.getOrders();
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  app2.delete("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      const success = await storage.deleteOrder(id);
      if (!success) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ message: "Failed to delete order" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
var plugins = [
  react(),
  runtimeErrorOverlay(),
  themePlugin()
];
if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0) {
  const cartographer = __require("@replit/vite-plugin-cartographer").cartographer;
  plugins.push(cartographer());
}
var vite_config_default = defineConfig({
  base: "/MayaShine/",
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
