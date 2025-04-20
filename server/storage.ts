import { orders, type Order, type InsertOrder, users, type User, type InsertUser } from "@shared/schema";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // Image handling
  saveImage(buffer: Buffer, originalName: string): Promise<string>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  private userCurrentId: number;
  private orderCurrentId: number;
  private uploadDir: string;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.userCurrentId = 1;
    this.orderCurrentId = 1;
    this.uploadDir = join(process.cwd(), "uploads");
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
    
    // Ensure uploads directory exists
    if (!existsSync(this.uploadDir)) {
      mkdir(this.uploadDir, { recursive: true }).catch(err => {
        console.error("Failed to create uploads directory:", err);
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const submittedAt = new Date();
    const order: Order = { ...insertOrder, id, submittedAt };
    this.orders.set(id, order);
    return order;
  }
  
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      b.submittedAt.getTime() - a.submittedAt.getTime()
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }
  
  async saveImage(buffer: Buffer, originalName: string): Promise<string> {
    // Create a unique filename
    const timestamp = Date.now();
    const fileExt = originalName.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = join(this.uploadDir, filename);
    
    // Ensure the directory exists
    await mkdir(dirname(filePath), { recursive: true });
    
    // Write the file
    await writeFile(filePath, buffer);
    
    // Return the relative path
    return `/uploads/${filename}`;
  }
}

export const storage = new MemStorage();
