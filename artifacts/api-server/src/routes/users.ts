import { Router } from "express";
import { eq, and, like, count } from "drizzle-orm";
import { db, usersTable, departmentsTable, requestsTable } from "@workspace/db";
import { getAuth } from "@clerk/express";
import {
  CreateUserBody,
  UpdateUserBody,
  GetUserParams,
  UpdateUserParams,
  ListUsersQueryParams,
} from "@workspace/api-zod";

const router = Router();
const DEFAULT_COMPANY_ID = 1;

async function enrichUser(u: any) {
  let departmentName: string | null = null;
  if (u.departmentId) {
    const [dept] = await db.select().from(departmentsTable).where(eq(departmentsTable.id, u.departmentId));
    departmentName = dept?.name ?? null;
  }
  const [activeReqRow] = await db
    .select({ count: count() })
    .from(requestsTable)
    .where(eq(requestsTable.currentAssigneeId, u.id));
  return {
    id: u.id,
    companyId: u.companyId,
    clerkUserId: u.clerkUserId ?? null,
    email: u.email,
    name: u.name,
    avatar: u.avatar ?? null,
    role: u.role,
    departmentId: u.departmentId ?? null,
    departmentName,
    status: u.status,
    activeRequests: Number(activeReqRow?.count ?? 0),
    createdAt: u.createdAt.toISOString(),
  };
}

router.get("/users/me", async (req, res): Promise<void> => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, auth.userId));
  if (!user) {
    // Return a default user for demo purposes
    const [firstUser] = await db.select().from(usersTable).where(eq(usersTable.companyId, DEFAULT_COMPANY_ID)).limit(1);
    if (firstUser) {
      res.json(await enrichUser(firstUser));
      return;
    }
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(await enrichUser(user));
});

router.get("/users", async (req, res): Promise<void> => {
  const params = ListUsersQueryParams.safeParse(req.query);
  let query = db.select().from(usersTable).where(eq(usersTable.companyId, DEFAULT_COMPANY_ID));
  const users = await db.select().from(usersTable).where(eq(usersTable.companyId, DEFAULT_COMPANY_ID));
  const filtered = users.filter(u => {
    if (params.success && params.data.departmentId && u.departmentId !== params.data.departmentId) return false;
    if (params.success && params.data.role && u.role !== params.data.role) return false;
    if (params.success && params.data.search) {
      const search = params.data.search.toLowerCase();
      if (!u.name.toLowerCase().includes(search) && !u.email.toLowerCase().includes(search)) return false;
    }
    return true;
  });
  const result = await Promise.all(filtered.map(enrichUser));
  res.json(result);
});

router.post("/users", async (req, res): Promise<void> => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db.insert(usersTable).values({
    ...parsed.data,
    companyId: DEFAULT_COMPANY_ID,
  }).returning();
  res.status(201).json(await enrichUser(user));
});

router.get("/users/:userId", async (req, res): Promise<void> => {
  const params = GetUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(await enrichUser(user));
});

router.patch("/users/:userId", async (req, res): Promise<void> => {
  const params = UpdateUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db.update(usersTable).set(parsed.data as any).where(eq(usersTable.id, params.data.userId)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(await enrichUser(user));
});

export default router;
