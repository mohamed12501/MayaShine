import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Jewelry order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  jewelryType: text("jewelry_type").notNull(),
  description: text("description").notNull(),
  imagePath: text("image_path"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  fullName: true,
  email: true,
  phone: true,
  jewelryType: true,
  description: true,
  imagePath: true,
});

export const orderFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Phone number is required"),
  jewelryType: z.string().min(1, "Please select a jewelry type"),
  description: z.string().min(10, "Please provide a detailed description"),
  image: z.instanceof(File).optional(),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type OrderFormValues = z.infer<typeof orderFormSchema>;

// Jewelry types for dropdown
export const jewelryTypes = ["Ring", "Necklace", "Bracelet", "Earrings", "Other"];
