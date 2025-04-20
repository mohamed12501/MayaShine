import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define jewelry types
export const JewelryTypes = [
  "Ring",
  "Necklace",
  "Bracelet",
  "Earrings",
  "Other",
] as const;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  jewelryType: text("jewelry_type").notNull(),
  description: text("description").notNull(),
  designImageUrl: text("design_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Insert schemas and types
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
}).extend({
  jewelryType: z.enum(JewelryTypes),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
