import { Router } from "express";
import { eq, count } from "drizzle-orm";
import { db, departmentsTable, usersTable, requestsTable } from "@workspace/db";
import {
  CreateDepartmentBody,
  UpdateDepartmentBody,
  GetDepartmentParams,
  UpdateDepartmentParams,
  DeleteDepartmentParams,
} from "@workspace/api-zod";

const router = Router();

const DEFAULT_COMPANY_ID = 1;

async function enrichDepartment(d: any) {
  const [memberCountRow] = await db
    .select({ count: count() })
    .from(usersTable)
    .where(eq(usersTable.departmentId, d.id));
  const [activeReqRow] = await db
    .select({ count: count() })
    .from(requestsTable)
    .where(eq(requestsTable.currentDepartmentId, d.id));

  let managerName: string | null = null;
  if (d.managerId) {
    const [mgr] = await db.select().from(usersTable).where(eq(usersTable.id, d.managerId));
    managerName = mgr?.name ?? null;
  }
  return {
    id: d.id,
    companyId: d.companyId,
    name: d.name,
    description: d.description ?? null,
    managerId: d.managerId ?? null,
    managerName,
    memberCount: Number(memberCountRow?.count ?? 0),
    avgCompletionHours: 48 + Math.random() * 24,
    slaComplianceRate: 0.7 + Math.random() * 0.25,
    activeRequests: Number(activeReqRow?.count ?? 0),
    color: d.color ?? null,
  };
}

router.get("/departments", async (req, res): Promise<void> => {
  const departments = await db.select().from(departmentsTable).where(eq(departmentsTable.companyId, DEFAULT_COMPANY_ID));
  const result = await Promise.all(departments.map(enrichDepartment));
  res.json(result);
});

router.post("/departments", async (req, res): Promise<void> => {
  const parsed = CreateDepartmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [dept] = await db.insert(departmentsTable).values({
    ...parsed.data,
    companyId: DEFAULT_COMPANY_ID,
  }).returning();
  res.status(201).json(await enrichDepartment(dept));
});

router.get("/departments/:departmentId", async (req, res): Promise<void> => {
  const params = GetDepartmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [dept] = await db.select().from(departmentsTable).where(eq(departmentsTable.id, params.data.departmentId));
  if (!dept) {
    res.status(404).json({ error: "Department not found" });
    return;
  }
  res.json(await enrichDepartment(dept));
});

router.patch("/departments/:departmentId", async (req, res): Promise<void> => {
  const params = UpdateDepartmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateDepartmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [dept] = await db.update(departmentsTable).set(parsed.data).where(eq(departmentsTable.id, params.data.departmentId)).returning();
  if (!dept) {
    res.status(404).json({ error: "Department not found" });
    return;
  }
  res.json(await enrichDepartment(dept));
});

router.delete("/departments/:departmentId", async (req, res): Promise<void> => {
  const params = DeleteDepartmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(departmentsTable).where(eq(departmentsTable.id, params.data.departmentId));
  res.sendStatus(204);
});

export default router;
