import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, companiesTable, usersTable } from "@workspace/db";
import {
  CreateCompanyBody,
  UpdateCompanyBody,
  GetCompanyParams,
  UpdateCompanyParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/companies", async (req, res): Promise<void> => {
  const companies = await db.select().from(companiesTable).orderBy(companiesTable.name);
  const result = await Promise.all(
    companies.map(async (c) => {
      const [countRow] = await db
        .select({ count: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.companyId, c.id));
      return {
        ...c,
        employeeCount: c.employeeCount,
        createdAt: c.createdAt.toISOString(),
      };
    })
  );
  res.json(result);
});

router.post("/companies", async (req, res): Promise<void> => {
  const parsed = CreateCompanyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { adminEmail, adminName, ...companyData } = parsed.data;
  const [company] = await db.insert(companiesTable).values(companyData).returning();
  res.status(201).json({ ...company, createdAt: company.createdAt.toISOString() });
});

router.get("/companies/:companyId", async (req, res): Promise<void> => {
  const params = GetCompanyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, params.data.companyId));
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json({ ...company, createdAt: company.createdAt.toISOString() });
});

router.patch("/companies/:companyId", async (req, res): Promise<void> => {
  const params = UpdateCompanyParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateCompanyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [company] = await db
    .update(companiesTable)
    .set(parsed.data)
    .where(eq(companiesTable.id, params.data.companyId))
    .returning();
  if (!company) {
    res.status(404).json({ error: "Company not found" });
    return;
  }
  res.json({ ...company, createdAt: company.createdAt.toISOString() });
});

export default router;
