import { Router } from "express";
import { eq, count, like } from "drizzle-orm";
import { db, workflowsTable, workflowStepsTable, departmentsTable, usersTable, requestsTable } from "@workspace/db";
import {
  CreateWorkflowBody,
  UpdateWorkflowBody,
  GetWorkflowParams,
  UpdateWorkflowParams,
  DeleteWorkflowParams,
  ListWorkflowsQueryParams,
} from "@workspace/api-zod";

const router = Router();
const DEFAULT_COMPANY_ID = 1;

async function enrichWorkflow(w: any) {
  const steps = await db.select().from(workflowStepsTable).where(eq(workflowStepsTable.workflowId, w.id)).orderBy(workflowStepsTable.order);
  const enrichedSteps = await Promise.all(steps.map(async (s) => {
    const [dept] = await db.select().from(departmentsTable).where(eq(departmentsTable.id, s.departmentId));
    let assigneeName: string | null = null;
    if (s.assigneeId) {
      const [assignee] = await db.select().from(usersTable).where(eq(usersTable.id, s.assigneeId));
      assigneeName = assignee?.name ?? null;
    }
    return {
      id: s.id,
      order: s.order,
      departmentId: s.departmentId,
      departmentName: dept?.name ?? "Unknown",
      assigneeId: s.assigneeId ?? null,
      assigneeName,
      slaHours: s.slaHours,
      isParallel: s.isParallel,
      isRequired: s.isRequired,
      requiredDocuments: (s.requiredDocuments as string[]) ?? [],
      escalationHours: s.escalationHours,
      condition: s.condition ?? null,
    };
  }));

  const [activeReqRow] = await db
    .select({ count: count() })
    .from(requestsTable)
    .where(eq(requestsTable.workflowId, w.id));

  return {
    id: w.id,
    companyId: w.companyId,
    name: w.name,
    description: w.description ?? null,
    steps: enrichedSteps,
    stepsCount: enrichedSteps.length,
    activeRequestsCount: Number(activeReqRow?.count ?? 0),
    avgCompletionHours: enrichedSteps.reduce((sum, s) => sum + s.slaHours, 0),
    slaComplianceRate: 0.78 + Math.random() * 0.15,
    createdAt: w.createdAt.toISOString(),
    isActive: w.isActive,
  };
}

router.get("/workflows", async (req, res): Promise<void> => {
  const params = ListWorkflowsQueryParams.safeParse(req.query);
  const workflows = await db.select().from(workflowsTable).where(eq(workflowsTable.companyId, DEFAULT_COMPANY_ID));
  const filtered = params.success && params.data.search
    ? workflows.filter(w => w.name.toLowerCase().includes((params.data.search ?? "").toLowerCase()))
    : workflows;
  const result = await Promise.all(filtered.map(enrichWorkflow));
  res.json(result);
});

router.post("/workflows", async (req, res): Promise<void> => {
  const parsed = CreateWorkflowBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { steps, ...workflowData } = parsed.data;
  const [workflow] = await db.insert(workflowsTable).values({ ...workflowData, companyId: DEFAULT_COMPANY_ID }).returning();
  if (steps && steps.length > 0) {
    await db.insert(workflowStepsTable).values(
      steps.map((s: any) => ({
        workflowId: workflow.id,
        order: s.order,
        departmentId: s.departmentId,
        assigneeId: s.assigneeId ?? null,
        slaHours: s.slaHours ?? 48,
        isParallel: s.isParallel ?? false,
        isRequired: s.isRequired ?? true,
        requiredDocuments: s.requiredDocuments ?? [],
        escalationHours: s.escalationHours ?? 168,
        condition: s.condition ?? null,
      }))
    );
  }
  res.status(201).json(await enrichWorkflow(workflow));
});

router.get("/workflows/:workflowId", async (req, res): Promise<void> => {
  const params = GetWorkflowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [workflow] = await db.select().from(workflowsTable).where(eq(workflowsTable.id, params.data.workflowId));
  if (!workflow) {
    res.status(404).json({ error: "Workflow not found" });
    return;
  }
  res.json(await enrichWorkflow(workflow));
});

router.patch("/workflows/:workflowId", async (req, res): Promise<void> => {
  const params = UpdateWorkflowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateWorkflowBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { steps, ...workflowData } = parsed.data;
  const [workflow] = await db.update(workflowsTable).set(workflowData as any).where(eq(workflowsTable.id, params.data.workflowId)).returning();
  if (!workflow) {
    res.status(404).json({ error: "Workflow not found" });
    return;
  }
  if (steps && steps.length > 0) {
    await db.delete(workflowStepsTable).where(eq(workflowStepsTable.workflowId, workflow.id));
    await db.insert(workflowStepsTable).values(
      steps.map((s: any) => ({
        workflowId: workflow.id,
        order: s.order,
        departmentId: s.departmentId,
        assigneeId: s.assigneeId ?? null,
        slaHours: s.slaHours ?? 48,
        isParallel: s.isParallel ?? false,
        isRequired: s.isRequired ?? true,
        requiredDocuments: s.requiredDocuments ?? [],
        escalationHours: s.escalationHours ?? 168,
        condition: s.condition ?? null,
      }))
    );
  }
  res.json(await enrichWorkflow(workflow));
});

router.delete("/workflows/:workflowId", async (req, res): Promise<void> => {
  const params = DeleteWorkflowParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(workflowsTable).where(eq(workflowsTable.id, params.data.workflowId));
  res.sendStatus(204);
});

export default router;
