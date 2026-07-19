import { pgTable, serial, text, integer, boolean, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { companiesTable } from "./companies";

export const workflowsTable = pgTable("workflows", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workflowStepsTable = pgTable("workflow_steps", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull().references(() => workflowsTable.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  departmentId: integer("department_id").notNull(),
  assigneeId: integer("assignee_id"),
  slaHours: integer("sla_hours").notNull().default(48),
  isParallel: boolean("is_parallel").notNull().default(false),
  isRequired: boolean("is_required").notNull().default(true),
  requiredDocuments: json("required_documents").$type<string[]>().default([]),
  escalationHours: integer("escalation_hours").notNull().default(168),
  condition: text("condition"),
});

export const insertWorkflowSchema = createInsertSchema(workflowsTable).omit({ id: true, createdAt: true });
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflowsTable.$inferSelect;
export type WorkflowStep = typeof workflowStepsTable.$inferSelect;
