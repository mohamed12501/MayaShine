import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { join } from "path";
import express from "express";
import { sessionMiddleware, requireAuth, login, logout, getCurrentUser } from "./auth";

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    // Check if the file is an image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  
  // Add session middleware
  app.use(sessionMiddleware);
  
  // Auth routes
  app.post('/api/login', login);
  app.post('/api/logout', logout);
  app.get('/api/user', getCurrentUser);
  
  // Order submission endpoint
  app.post('/api/orders', upload.single('image'), async (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, jewelryType, description } = req.body;
      
      // Validate required fields
      if (!fullName || !email || !phone || !jewelryType || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Process image upload if present
      let imagePath = undefined;
      if (req.file) {
        try {
          imagePath = await storage.saveImage(req.file.buffer, req.file.originalname);
        } catch (err) {
          console.error("Error saving image:", err);
          return res.status(500).json({ message: "Failed to save image" });
        }
      }
      
      // Create order
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
  
  // Get all orders (admin only)
  app.get('/api/orders', requireAuth, async (_req: Request, res: Response) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  
  // Get specific order (admin only)
  app.get('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
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
  
  // Delete an order (admin only)
  app.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
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
  
  const httpServer = createServer(app);
  
  return httpServer;
}
