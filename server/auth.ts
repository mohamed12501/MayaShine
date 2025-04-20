import { Request, Response, NextFunction } from "express";
import session from "express-session";
import { storage } from "./storage";
import MemoryStore from "memorystore";

// Set up session store
const MemoryStoreSession = MemoryStore(session);

// Configure session middleware
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "maya-jewelry-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === "production",
  },
  store: new MemoryStoreSession({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
});

// Authentication middleware for admin routes
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  res.status(401).json({ message: "Unauthorized" });
};

// Login handler
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  
  try {
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // In a real app, we would compare hashed passwords here
    
    // Set user in session
    req.session.userId = user.id;
    req.session.username = user.username;
    
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// Logout handler
export const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    
    res.json({ message: "Logged out successfully" });
  });
};

// Get current user
export const getCurrentUser = (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  res.json({
    id: req.session.userId,
    username: req.session.username,
  });
};
