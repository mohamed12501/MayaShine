import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

// Setup storage for uploaded images
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage2,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: Function) => {
  const { username, password } = req.body;
  
  if (req.session && req.session.authenticated) {
    return next();
  }
  
  return res.status(401).json({ message: "Authentication required" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a session middleware
  const session = require('express-session');
  const MemoryStore = require('memorystore')(session);
  
  app.use(session({
    cookie: { maxAge: 86400000 }, // 24 hours
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    saveUninitialized: false,
    secret: 'maya-jewelry-secret'
  }));
  
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));
  
  // API Routes
  // Submit an order
  app.post("/api/orders", upload.single('designImage'), async (req, res) => {
    try {
      const orderData = JSON.parse(req.body.orderData);
      
      // Validate order data
      const validatedData = insertOrderSchema.parse(orderData);
      
      // Add image URL if uploaded
      if (req.file) {
        validatedData.designImageUrl = `/uploads/${req.file.filename}`;
      }
      
      // Create order in storage
      const order = await storage.createOrder(validatedData);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Order submission error:", error);
      res.status(400).json({ message: "Invalid order data", error: error });
    }
  });
  
  // Login admin
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find admin by username
      const admin = await storage.getAdminByUsername(username);
      
      // Check if admin exists and password matches
      if (admin && admin.password === password) {
        // Set session data
        req.session.authenticated = true;
        req.session.admin = {
          id: admin.id,
          username: admin.username
        };
        
        res.status(200).json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed", error: error });
    }
  });
  
  // Get all orders (protected)
  app.get("/api/orders", async (req, res) => {
    try {
      // Authentication check
      if (!req.session.authenticated) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const orders = await storage.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders", error: error });
    }
  });
  
  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      res.status(200).json({ message: "Logout successful" });
    });
  });
  
  // Check authentication status
  app.get("/api/auth/check", (req, res) => {
    if (req.session.authenticated) {
      return res.status(200).json({ 
        authenticated: true,
        admin: req.session.admin
      });
    }
    
    return res.status(200).json({ authenticated: false });
  });

  const httpServer = createServer(app);
  return httpServer;
}
