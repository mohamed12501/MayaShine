import { orders, type Order, type InsertOrder, admins, type Admin, type InsertAdmin } from "@shared/schema";

export interface IStorage {
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Admin operations
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
}

export class MemStorage implements IStorage {
  private orders: Map<number, Order>;
  private admins: Map<number, Admin>;
  private orderCurrentId: number;
  private adminCurrentId: number;

  constructor() {
    this.orders = new Map();
    this.admins = new Map();
    this.orderCurrentId = 1;
    this.adminCurrentId = 1;
    
    // Create a default admin account
    this.createAdmin({
      username: "admin",
      password: "admin123" // In a real app, this would be hashed
    });
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => {
      // Sort by created date, newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderCurrentId++;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id,
      createdAt: now
    };
    this.orders.set(id, order);
    return order;
  }

  // Admin operations
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username,
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.adminCurrentId++;
    const admin: Admin = { ...insertAdmin, id };
    this.admins.set(id, admin);
    return admin;
  }
}

export const storage = new MemStorage();
