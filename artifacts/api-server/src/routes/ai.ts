import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, requestsTable, departmentsTable, usersTable } from "@workspace/db";
import {
  PredictRequestDelayParams,
  OptimizeWorkflowParams,
  ChatWithAiBody,
  RunWhatIfSimulationBody,
  ClassifyRequestBody,
} from "@workspace/api-zod";
import {
  computeDelayPrediction,
  computeAiInsights,
  generateWeeklySummary,
  simulateWhatIf,
  classifyRequest,
  generateAiChatResponse,
} from "../lib/aiEngine";

const router = Router();
const DEFAULT_COMPANY_ID = 1;

router.get("/ai/insights", async (req, res): Promise<void> => {
  const departments = await db.select().from(departmentsTable).where(eq(departmentsTable.companyId, DEFAULT_COMPANY_ID));
  const requests = await db.select().from(requestsTable).where(eq(requestsTable.companyId, DEFAULT_COMPANY_ID));
  const users = await db.select().from(usersTable).where(eq(usersTable.companyId, DEFAULT_COMPANY_ID));
  res.json(computeAiInsights(departments, requests, users));
});

router.get("/ai/predict/:requestId", async (req, res): Promise<void> => {
  const params = PredictRequestDelayParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [request] = await db.select().from(requestsTable).where(eq(requestsTable.id, params.data.requestId));
  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }
  const waitingHours = Math.round((Date.now() - request.createdAt.getTime()) / (1000 * 60 * 60) * 10) / 10;
  res.json(computeDelayPrediction(request.id, waitingHours, request.priority, 48));
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = ChatWithAiBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const requests = await db.select().from(requestsTable).where(eq(requestsTable.companyId, DEFAULT_COMPANY_ID));
  const departments = await db.select().from(departmentsTable).where(eq(departmentsTable.companyId, DEFAULT_COMPANY_ID));
  const stats = {
    totalRequests: requests.length,
    activeRequests: requests.filter(r => r.status === "active").length,
    completedRequests: requests.filter(r => r.status === "completed").length,
    delayedRequests: requests.filter(r => r.delayRisk === "high" || r.delayRisk === "critical").length,
    slaComplianceRate: 0.74,
    aiRiskScore: 67,
    currentBottleneckDepartment: departments[0]?.name ?? "Legal",
    mostDelayedRequestType: "Contract Review",
  };
  res.json(generateAiChatResponse(parsed.data.message, stats));
});

router.get("/ai/weekly-summary", async (req, res): Promise<void> => {
  const requests = await db.select().from(requestsTable).where(eq(requestsTable.companyId, DEFAULT_COMPANY_ID));
  const stats = {
    completedRequests: requests.filter(r => r.status === "completed").length,
    delayedRequests: requests.filter(r => r.delayRisk === "high" || r.delayRisk === "critical").length,
  };
  res.json(generateWeeklySummary(stats));
});

router.get("/ai/optimize/:workflowId", async (req, res): Promise<void> => {
  const params = OptimizeWorkflowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json({
    workflowId: params.data.workflowId,
    currentAvgHours: 120,
    optimizedAvgHours: 84,
    improvementPercent: 30,
    suggestions: [
      { type: "merge_approvals", description: "Merge Finance and Legal review into parallel approval", estimatedImprovementPercent: 18, confidence: 0.88 },
      { type: "remove_step", description: "Remove redundant VP signature for requests under $5k", estimatedImprovementPercent: 12, confidence: 0.79 },
      { type: "reorder_steps", description: "Move document validation to step 1 to catch issues early", estimatedImprovementPercent: 9, confidence: 0.83 },
      { type: "add_resources", description: "Add second Legal reviewer to handle peak load", estimatedImprovementPercent: 15, confidence: 0.91 },
    ],
  });
});

router.post("/ai/simulate", async (req, res): Promise<void> => {
  const parsed = RunWhatIfSimulationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { scenario, additionalEmployees } = parsed.data;
  res.json(simulateWhatIf(scenario, additionalEmployees ?? 2));
});

router.post("/ai/classify", async (req, res): Promise<void> => {
  const parsed = ClassifyRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json(classifyRequest(parsed.data.description, parsed.data.title ?? ""));
});

export default router;
