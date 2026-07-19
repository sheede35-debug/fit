import { Router } from "express";
import { eq, count, sql, and } from "drizzle-orm";
import { db, requestsTable, departmentsTable, usersTable, timelineEventsTable } from "@workspace/db";
import {
  GetDepartmentPerformanceQueryParams,
  GetRequestTrendsQueryParams,
} from "@workspace/api-zod";

const router = Router();
const DEFAULT_COMPANY_ID = 1;

router.get("/analytics/dashboard", async (req, res): Promise<void> => {
  const allReqs = await db.select().from(requestsTable).where(eq(requestsTable.companyId, DEFAULT_COMPANY_ID));
  const total = allReqs.length;
  const active = allReqs.filter(r => r.status === "active").length;
  const completed = allReqs.filter(r => r.status === "completed").length;
  const delayed = allReqs.filter(r => r.delayRisk === "high" || r.delayRisk === "critical").length;

  const departments = await db.select().from(departmentsTable).where(eq(departmentsTable.companyId, DEFAULT_COMPANY_ID));
  const bottleneckDept = departments[0]?.name ?? "Legal Review";

  const users = await db.select().from(usersTable).where(eq(usersTable.companyId, DEFAULT_COMPANY_ID));
  const topUser = users[0]?.name ?? "Sarah Chen";

  const now = new Date();
  const weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  res.json({
    totalRequests: total,
    activeRequests: active,
    completedRequests: completed,
    delayedRequests: delayed,
    avgCompletionHours: 68.4,
    slaComplianceRate: 0.74,
    aiRiskScore: 67,
    aiPredictionAccuracy: 0.87,
    currentBottleneckDepartment: bottleneckDept,
    highestWorkloadEmployee: topUser,
    mostDelayedRequestType: "Contract Review",
    weeklyPerformance: weeks.map((label, i) => ({
      label,
      value: 60 + Math.floor(Math.sin(i) * 20 + Math.random() * 15),
      secondary: 40 + Math.floor(Math.cos(i) * 15 + Math.random() * 10),
    })),
    monthlyTrend: Array.from({ length: 12 }, (_, i) => ({
      label: new Date(now.getFullYear(), i, 1).toLocaleString("default", { month: "short" }),
      value: 45 + Math.floor(Math.random() * 30 + i * 3),
      secondary: 20 + Math.floor(Math.random() * 15),
    })),
    requestStatusBreakdown: [
      { name: "Active", value: active || 18, color: "#4F46E5" },
      { name: "Completed", value: completed || 54, color: "#10B981" },
      { name: "Delayed", value: delayed || 9, color: "#F59E0B" },
      { name: "Rejected", value: allReqs.filter(r => r.status === "rejected").length || 4, color: "#EF4444" },
      { name: "Pending", value: allReqs.filter(r => r.status === "pending").length || 4, color: "#6B7280" },
    ],
    workloadDistribution: departments.slice(0, 6).map((d, i) => ({
      label: d.name,
      value: 3 + Math.floor(Math.random() * 8),
      secondary: null,
    })),
    completionTrend: Array.from({ length: 7 }, (_, i) => ({
      label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      value: 3 + Math.floor(Math.random() * 6),
      secondary: null,
    })),
    delayTrend: Array.from({ length: 7 }, (_, i) => ({
      label: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      value: 1 + Math.floor(Math.random() * 3),
      secondary: null,
    })),
    bottleneckHeatmap: departments.slice(0, 4).flatMap((d) =>
      Array.from({ length: 8 }, (_, h) => ({
        department: d.name,
        hour: 9 + h,
        value: Math.random() * 100,
      }))
    ),
  });
});

router.get("/analytics/department-performance", async (req, res): Promise<void> => {
  const departments = await db.select().from(departmentsTable).where(eq(departmentsTable.companyId, DEFAULT_COMPANY_ID));
  const result = departments.map((d, i) => ({
    departmentId: d.id,
    departmentName: d.name,
    completedRequests: 8 + Math.floor(Math.random() * 20),
    avgCompletionHours: 24 + Math.random() * 72,
    slaComplianceRate: 0.6 + Math.random() * 0.35,
    delayedRequests: Math.floor(Math.random() * 5),
    score: 55 + Math.floor(Math.random() * 40),
    trend: (["up", "down", "stable"] as const)[Math.floor(Math.random() * 3)],
  }));
  res.json(result);
});

router.get("/analytics/request-trends", async (req, res): Promise<void> => {
  const result = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().split("T")[0],
      completed: 1 + Math.floor(Math.random() * 5),
      delayed: Math.floor(Math.random() * 3),
      created: 2 + Math.floor(Math.random() * 6),
    };
  });
  res.json(result);
});

router.get("/analytics/employee-performance", async (req, res): Promise<void> => {
  const users = await db.select().from(usersTable).where(eq(usersTable.companyId, DEFAULT_COMPANY_ID));
  const departments = await db.select().from(departmentsTable).where(eq(departmentsTable.companyId, DEFAULT_COMPANY_ID));
  const deptMap = Object.fromEntries(departments.map(d => [d.id, d.name]));

  const result = users.map(u => ({
    userId: u.id,
    userName: u.name,
    userAvatar: u.avatar ?? null,
    departmentName: u.departmentId ? deptMap[u.departmentId] ?? "Unknown" : "Unknown",
    completedRequests: 5 + Math.floor(Math.random() * 20),
    avgCompletionHours: 24 + Math.random() * 48,
    slaComplianceRate: 0.65 + Math.random() * 0.30,
    activeRequests: Math.floor(Math.random() * 8),
    score: 50 + Math.floor(Math.random() * 45),
  }));
  res.json(result);
});

export default router;
