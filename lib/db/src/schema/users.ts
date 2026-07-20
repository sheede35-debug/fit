import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { companiesTable } from "./companies";
import { departmentsTable } from "./departments";

export const roleEnum = pgEnum("role", ["super_admin", "company_admin", "manager", "department_manager", "employee"]);
export const userStatusEnum = pgEnum("user_status", ["active", "inactive", "pending"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
  clerkUserId: text("clerk_user_id").unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  role: roleEnum("role").notNull().default("employee"),
  departmentId: integer("department_id").references(() => departmentsTable.id),
  status: userStatusEnum("status").notNull().default("active"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
