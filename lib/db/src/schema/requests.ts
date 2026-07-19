import { pgTable, serial, text, integer, real, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { companiesTable } from "./companies";
import { workflowsTable } from "./workflows";

export const requestStatusEnum = pgEnum("request_status", ["pending", "active", "completed", "rejected", "escalated"]);
export const requestPriorityEnum = pgEnum("request_priority", ["low", "medium", "high", "critical"]);
export const delayRiskEnum = pgEnum("delay_risk", ["low", "medium", "high", "critical"]);

export const requestsTable = pgTable("requests", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
  workflowId: integer("workflow_id").references(() => workflowsTable.id),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  status: requestStatusEnum("status").notNull().default("pending"),
  priority: requestPriorityEnum("priority").notNull().default("medium"),
  currentStepIndex: integer("current_step_index").notNull().default(0),
  currentDepartmentId: integer("current_department_id"),
  currentAssigneeId: integer("current_assignee_id"),
  creatorId: integer("creator_id").notNull(),
  delayRisk: delayRiskEnum("delay_risk").notNull().default("low"),
  aiRiskScore: real("ai_risk_score"),
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const timelineEventsTable = pgTable("timeline_events", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => requestsTable.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  description: text("description").notNull(),
  departmentId: integer("department_id"),
  userId: integer("user_id"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => requestsTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const attachmentsTable = pgTable("attachments", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => requestsTable.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: text("file_type").notNull(),
  url: text("url").notNull(),
  uploadedById: integer("uploaded_by_id").notNull(),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
});

export const insertRequestSchema = createInsertSchema(requestsTable).omit({ id: true, createdAt: true, updatedAt: true, completedAt: true });
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requestsTable.$inferSelect;
export type TimelineEvent = typeof timelineEventsTable.$inferSelect;
export type Comment = typeof commentsTable.$inferSelect;
export type Attachment = typeof attachmentsTable.$inferSelect;
