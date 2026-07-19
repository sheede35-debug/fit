import { Router } from "express";
import { eq, and, desc, sql } from "drizzle-orm";
import { db, requestsTable, timelineEventsTable, commentsTable, attachmentsTable, usersTable, departmentsTable, workflowsTable, workflowStepsTable, notificationsTable } from "@workspace/db";
import {
  CreateRequestBody,
  UpdateRequestBody,
  GetRequestParams,
  UpdateRequestParams,
  ListRequestsQueryParams,
  AdvanceRequestParams,
  AdvanceRequestBody,
  RejectRequestParams,
  RejectRequestBody,
} from "@workspace/api-zod";
import { computeDelayPrediction } from "../lib/aiEngine";

const router = Router();
const DEFAULT_COMPANY_ID = 1;
const DEFAULT_USER_ID = 1;

function computeWaitingHours(createdAt: Date): number {
  return Math.round((Date.now() - createdAt.getTime()) / (1000 * 60 * 60) * 10) / 10;
}

function computeProgressPercent(currentStepIndex: number, totalSteps: number): number {
  if (totalSteps === 0) return 100;
  return Math.round((currentStepIndex / totalSteps) * 100);
}

async function enrichRequest(r: any) {
  let currentDepartmentName: string | null = null;
  let currentAssigneeName: string | null = null;
  let workflowName: string | null = null;
  let totalSteps = 0;

  if (r.currentDepartmentId) {
    const [dept] = await db.select().from(departmentsTable).where(eq(departmentsTable.id, r.currentDepartmentId));
    currentDepartmentName = dept?.name ?? null;
  }
  if (r.currentAssigneeId) {
    const [assignee] = await db.select().from(usersTable).where(eq(usersTable.id, r.currentAssigneeId));
    currentAssigneeName = assignee?.name ?? null;
  }
  if (r.workflowId) {
    const [wf] = await db.select().from(workflowsTable).where(eq(workflowsTable.id, r.workflowId));
    workflowName = wf?.name ?? null;
    const steps = await db.select().from(workflowStepsTable).where(eq(workflowStepsTable.workflowId, r.workflowId));
    totalSteps = steps.length;
  }

  const [creator] = await db.select().from(usersTable).where(eq(usersTable.id, r.creatorId));
  const waitingHours = computeWaitingHours(r.createdAt);
  const progressPercent = r.status === "completed" ? 100 : computeProgressPercent(r.currentStepIndex || 0, totalSteps);

  return {
    id: r.id,
    companyId: r.companyId,
    workflowId: r.workflowId ?? null,
    workflowName,
    title: r.title,
    description: r.description ?? null,
    category: r.category ?? null,
    status: r.status,
    priority: r.priority,
    progressPercent,
    currentDepartmentId: r.currentDepartmentId ?? null,
    currentDepartmentName,
    currentAssigneeId: r.currentAssigneeId ?? null,
    currentAssigneeName,
    creatorId: r.creatorId,
    creatorName: creator?.name ?? "Unknown",
    waitingHours,
    remainingSlaHours: Math.max(0, 48 - waitingHours),
    delayRisk: r.delayRisk,
    aiRiskScore: r.aiRiskScore ?? null,
    estimatedCompletionDate: r.estimatedCompletionDate?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    completedAt: r.completedAt?.toISOString() ?? null,
  };
}

router.get("/requests", async (req, res): Promise<void> => {
  const params = ListRequestsQueryParams.safeParse(req.query);
  const allReqs = await db.select().from(requestsTable).where(eq(requestsTable.companyId, DEFAULT_COMPANY_ID)).orderBy(desc(requestsTable.createdAt));

  const filtered = allReqs.filter(r => {
    if (!params.success) return true;
    const p = params.data;
    if (p.status && r.status !== p.status) return false;
    if (p.departmentId && r.currentDepartmentId !== p.departmentId) return false;
    if (p.assigneeId && r.currentAssigneeId !== p.assigneeId) return false;
    if (p.priority && r.priority !== p.priority) return false;
    if (p.delayRisk && r.delayRisk !== p.delayRisk) return false;
    if (p.search && !r.title.toLowerCase().includes(p.search.toLowerCase())) return false;
    if (p.dateFrom && new Date(r.createdAt) < new Date(p.dateFrom)) return false;
    if (p.dateTo && new Date(r.createdAt) > new Date(p.dateTo)) return false;
    return true;
  });

  const result = await Promise.all(filtered.map(enrichRequest));
  res.json(result);
});

router.post("/requests", async (req, res): Promise<void> => {
  const parsed = CreateRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Get first step of workflow to set current department
  let currentDepartmentId: number | null = null;
  let currentAssigneeId: number | null = null;
  if (parsed.data.workflowId) {
    const [firstStep] = await db.select().from(workflowStepsTable)
      .where(eq(workflowStepsTable.workflowId, parsed.data.workflowId))
      .orderBy(workflowStepsTable.order)
      .limit(1);
    if (firstStep) {
      currentDepartmentId = firstStep.departmentId;
      currentAssigneeId = firstStep.assigneeId ?? null;
    }
  }

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 5);

  const [request] = await db.insert(requestsTable).values({
    ...parsed.data,
    companyId: DEFAULT_COMPANY_ID,
    creatorId: DEFAULT_USER_ID,
    status: "active",
    currentDepartmentId,
    currentAssigneeId,
    delayRisk: "low",
    aiRiskScore: 25,
    estimatedCompletionDate: estDate,
  }).returning();

  // Create timeline event
  await db.insert(timelineEventsTable).values({
    requestId: request.id,
    eventType: "created",
    description: `Request "${request.title}" was created`,
    userId: DEFAULT_USER_ID,
  });

  res.status(201).json(await enrichRequest(request));
});

router.get("/requests/:requestId", async (req, res): Promise<void> => {
  const params = GetRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [request] = await db.select().from(requestsTable).where(eq(requestsTable.id, params.data.requestId));
  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  const baseRequest = await enrichRequest(request);

  // Load timeline
  const timeline = await db.select().from(timelineEventsTable)
    .where(eq(timelineEventsTable.requestId, request.id))
    .orderBy(timelineEventsTable.createdAt);

  const enrichedTimeline = await Promise.all(timeline.map(async (t) => {
    let deptName: string | null = null;
    let userName: string | null = null;
    if (t.departmentId) {
      const [dept] = await db.select().from(departmentsTable).where(eq(departmentsTable.id, t.departmentId));
      deptName = dept?.name ?? null;
    }
    if (t.userId) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, t.userId));
      userName = user?.name ?? null;
    }
    return {
      id: t.id,
      requestId: t.requestId,
      eventType: t.eventType,
      description: t.description,
      departmentId: t.departmentId ?? null,
      departmentName: deptName,
      userId: t.userId ?? null,
      userName,
      metadata: t.metadata ?? null,
      createdAt: t.createdAt.toISOString(),
    };
  }));

  // Load comments
  const comments = await db.select().from(commentsTable)
    .where(eq(commentsTable.requestId, request.id))
    .orderBy(commentsTable.createdAt);

  const enrichedComments = await Promise.all(comments.map(async (c) => {
    const [author] = await db.select().from(usersTable).where(eq(usersTable.id, c.authorId));
    return {
      id: c.id,
      requestId: c.requestId,
      content: c.content,
      authorId: c.authorId,
      authorName: author?.name ?? "Unknown",
      authorAvatar: author?.avatar ?? null,
      createdAt: c.createdAt.toISOString(),
    };
  }));

  // Load attachments
  const attachments = await db.select().from(attachmentsTable)
    .where(eq(attachmentsTable.requestId, request.id));

  const enrichedAttachments = await Promise.all(attachments.map(async (a) => {
    const [uploader] = await db.select().from(usersTable).where(eq(usersTable.id, a.uploadedById));
    return {
      id: a.id,
      requestId: a.requestId,
      fileName: a.fileName,
      fileSize: a.fileSize,
      fileType: a.fileType,
      url: a.url,
      uploadedById: a.uploadedById,
      uploadedByName: uploader?.name ?? "Unknown",
      uploadedAt: a.uploadedAt.toISOString(),
    };
  }));

  // AI prediction
  const aiPrediction = computeDelayPrediction(
    request.id,
    baseRequest.waitingHours,
    request.priority,
    48
  );

  res.json({
    ...baseRequest,
    timeline: enrichedTimeline,
    comments: enrichedComments,
    attachments: enrichedAttachments,
    aiPrediction,
  });
});

router.patch("/requests/:requestId", async (req, res): Promise<void> => {
  const params = UpdateRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [request] = await db.update(requestsTable)
    .set({ ...(parsed.data as any), updatedAt: new Date() })
    .where(eq(requestsTable.id, params.data.requestId))
    .returning();
  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }
  res.json(await enrichRequest(request));
});

router.post("/requests/:requestId/advance", async (req, res): Promise<void> => {
  const params = AdvanceRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AdvanceRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [request] = await db.select().from(requestsTable).where(eq(requestsTable.id, params.data.requestId));
  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  const nextStepIndex = (request.currentStepIndex || 0) + 1;
  let nextDeptId: number | null = null;
  let nextAssigneeId: number | null = null;
  let newStatus: "active" | "completed" = "active";

  if (request.workflowId) {
    const steps = await db.select().from(workflowStepsTable)
      .where(eq(workflowStepsTable.workflowId, request.workflowId))
      .orderBy(workflowStepsTable.order);

    if (nextStepIndex >= steps.length) {
      newStatus = "completed";
    } else {
      const nextStep = steps[nextStepIndex];
      nextDeptId = nextStep.departmentId;
      nextAssigneeId = nextStep.assigneeId ?? null;
    }
  }

  const [updated] = await db.update(requestsTable).set({
    currentStepIndex: nextStepIndex,
    currentDepartmentId: newStatus === "completed" ? null : nextDeptId,
    currentAssigneeId: newStatus === "completed" ? null : nextAssigneeId,
    status: newStatus,
    completedAt: newStatus === "completed" ? new Date() : undefined,
    updatedAt: new Date(),
  }).where(eq(requestsTable.id, request.id)).returning();

  // Add timeline event
  await db.insert(timelineEventsTable).values({
    requestId: request.id,
    eventType: newStatus === "completed" ? "completed" : "advanced",
    description: newStatus === "completed"
      ? `Request completed. ${parsed.data.comment}`
      : `Advanced to next department. ${parsed.data.comment}`,
    departmentId: nextDeptId,
    userId: DEFAULT_USER_ID,
  });

  // Add comment if provided
  if (parsed.data.comment) {
    await db.insert(commentsTable).values({
      requestId: request.id,
      content: parsed.data.comment,
      authorId: DEFAULT_USER_ID,
    });
  }

  res.json(await enrichRequest(updated));
});

router.post("/requests/:requestId/reject", async (req, res): Promise<void> => {
  const params = RejectRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = RejectRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db.update(requestsTable).set({
    status: "rejected",
    updatedAt: new Date(),
  }).where(eq(requestsTable.id, params.data.requestId)).returning();

  if (!updated) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  await db.insert(timelineEventsTable).values({
    requestId: updated.id,
    eventType: "rejected",
    description: `Request rejected: ${parsed.data.reason}`,
    userId: DEFAULT_USER_ID,
  });

  await db.insert(commentsTable).values({
    requestId: updated.id,
    content: `Rejection reason: ${parsed.data.reason}`,
    authorId: DEFAULT_USER_ID,
  });

  res.json(await enrichRequest(updated));
});

export default router;
