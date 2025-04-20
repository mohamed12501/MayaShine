import { orders, type Order, type InsertOrder, users, type User, type InsertUser } from "@shared/schema";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

// Initialize DB with admin user if needed
async function initializeDatabase() {
  const adminUser = await db.select().from(users).where(eq(users.username, "admin"));
  
  if (adminUser.length === 0) {
    await db.insert(users).values({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
    console.log("Admin user created");
  }
  
  // Ensure uploads directory exists
  const uploadDir = join(process.cwd(), "uploads");
  if (!existsSync(uploadDir)) {
    mkdir(uploadDir, { recursive: true }).catch(err => {
      console.error("Failed to create uploads directory:", err);
    });
  }
}

// Initialize database on import
initializeDatabase().catch(err => {
  console.error("Failed to initialize database:", err);
});

export class DatabaseStorage implements IStorage {
  private uploadDir: string;

  constructor() {
    this.uploadDir = join(process.cwd(), "uploads");
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    // Ensure imagePath is null, not undefined
    const orderData = {
      ...insertOrder,
      imagePath: insertOrder.imagePath || null
    };
    
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();
    return order;
  }
  
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(orders.submittedAt, 'desc');
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }
  
  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id)).returning();
    return result.length > 0;
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

export const storage = new DatabaseStorage();
