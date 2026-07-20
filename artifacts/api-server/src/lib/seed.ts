/**
 * Seed script — creates realistic demo data for FlowIQ.
 * Idempotent: truncates all tables before inserting.
 */
import { eq, sql } from "drizzle-orm";
import {
  db,
  companiesTable,
  departmentsTable,
  usersTable,
  workflowsTable,
  workflowStepsTable,
  requestsTable,
  timelineEventsTable,
  notificationsTable,
} from "@workspace/db";

function daysAgo(n: number, hoursOffset = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - hoursOffset);
  return d;
}

export async function seedDatabase(): Promise<void> {
  console.log("🌱 Seeding FlowIQ demo database…");

  // 1. Wipe everything (cascade)
  await db.execute(sql`TRUNCATE TABLE companies RESTART IDENTITY CASCADE`);

  // 2. Company
  const [company] = await db
    .insert(companiesTable)
    .values({
      name: "Meridian Group",
      slug: "meridian-group",
      industry: "Professional Services",
      plan: "enterprise",
      employeeCount: 420,
    })
    .returning();

  // 3. Departments (no manager yet — set after users)
  const [legalDept, financeDept, hrDept, itDept] = await db
    .insert(departmentsTable)
    .values([
      { companyId: company.id, name: "Legal",   description: "Contract review and compliance",            color: "#7C3AED" },
      { companyId: company.id, name: "Finance",  description: "Budget approvals and financial oversight",  color: "#059669" },
      { companyId: company.id, name: "HR",       description: "Human resources and employee lifecycle",    color: "#D97706" },
      { companyId: company.id, name: "IT",       description: "Systems access and technical provisioning", color: "#2563EB" },
    ])
    .returning();

  // 4. Users
  const insertedUsers = await db
    .insert(usersTable)
    .values([
      { companyId: company.id, name: "Shahad Al-Rashidi", email: "shahad@meridian.demo",  role: "company_admin" as const,       departmentId: null },
      { companyId: company.id, name: "Sarah Chen",         email: "sarah@meridian.demo",   role: "department_manager" as const,  departmentId: legalDept.id },
      { companyId: company.id, name: "Michael Torres",     email: "michael@meridian.demo", role: "department_manager" as const,  departmentId: financeDept.id },
      { companyId: company.id, name: "Aisha Patel",        email: "aisha@meridian.demo",   role: "department_manager" as const,  departmentId: hrDept.id },
      { companyId: company.id, name: "James Wilson",       email: "james@meridian.demo",   role: "department_manager" as const,  departmentId: itDept.id },
      { companyId: company.id, name: "Omar Hassan",        email: "omar@meridian.demo",    role: "employee" as const,            departmentId: legalDept.id },
      { companyId: company.id, name: "Priya Singh",        email: "priya@meridian.demo",   role: "employee" as const,            departmentId: financeDept.id },
      { companyId: company.id, name: "David Kim",          email: "david@meridian.demo",   role: "employee" as const,            departmentId: hrDept.id },
    ])
    .returning();

  const [shahad, sarah, michael, aisha, james] = insertedUsers;

  // 5. Assign department managers
  await Promise.all([
    db.update(departmentsTable).set({ managerId: sarah.id   }).where(eq(departmentsTable.id, legalDept.id)),
    db.update(departmentsTable).set({ managerId: michael.id }).where(eq(departmentsTable.id, financeDept.id)),
    db.update(departmentsTable).set({ managerId: aisha.id   }).where(eq(departmentsTable.id, hrDept.id)),
    db.update(departmentsTable).set({ managerId: james.id   }).where(eq(departmentsTable.id, itDept.id)),
  ]);

  // 6. Workflows
  const [wfLegal, wfFinance, wfHR, wfIT] = await db
    .insert(workflowsTable)
    .values([
      { companyId: company.id, name: "Legal Contract Review",   description: "Standard contract review and approval process",   isActive: true },
      { companyId: company.id, name: "Finance Budget Approval", description: "Multi-stage budget and spend approval",           isActive: true },
      { companyId: company.id, name: "HR Employee Onboarding",  description: "New hire onboarding and system access setup",     isActive: true },
      { companyId: company.id, name: "IT Access Request",       description: "System access and software provisioning",        isActive: true },
    ])
    .returning();

  // 7. Workflow steps
  await db.insert(workflowStepsTable).values([
    // Legal Contract Review: Legal (96h) → Finance (48h)
    { workflowId: wfLegal.id,   order: 0, departmentId: legalDept.id,   assigneeId: sarah.id,   slaHours: 96 },
    { workflowId: wfLegal.id,   order: 1, departmentId: financeDept.id, assigneeId: michael.id, slaHours: 48 },
    // Finance Budget Approval: Finance (72h) → Legal (96h)
    { workflowId: wfFinance.id, order: 0, departmentId: financeDept.id, assigneeId: michael.id, slaHours: 72 },
    { workflowId: wfFinance.id, order: 1, departmentId: legalDept.id,   assigneeId: sarah.id,   slaHours: 96 },
    // HR Employee Onboarding: HR (120h) → IT (48h)
    { workflowId: wfHR.id,      order: 0, departmentId: hrDept.id,      assigneeId: aisha.id,   slaHours: 120 },
    { workflowId: wfHR.id,      order: 1, departmentId: itDept.id,      assigneeId: james.id,   slaHours: 48 },
    // IT Access Request: IT only (24h)
    { workflowId: wfIT.id,      order: 0, departmentId: itDept.id,      assigneeId: james.id,   slaHours: 24 },
  ]);

  // 8. Requests helper
  type SeedRequest = {
    title: string; description: string; category: string;
    workflowId: number;
    status: "pending"|"active"|"completed"|"rejected"|"escalated";
    priority: "low"|"medium"|"high"|"critical";
    currentStepIndex: number;
    currentDepartmentId: number|null; currentAssigneeId: number|null;
    delayRisk: "low"|"medium"|"high"|"critical"; aiRiskScore: number;
    createdAt: Date; completedAt?: Date;
    events: Array<{ eventType: string; description: string; departmentId?: number|null; userId?: number|null; createdAt: Date }>;
    notifs?: Array<{ userId: number; type: "assigned"|"sla_warning"|"sla_exceeded"|"completed"|"rejected"|"escalated"|"ai_alert"; title: string; message: string }>;
  };

  const createRequest = async (p: SeedRequest) => {
    const estDate = new Date(p.createdAt);
    estDate.setDate(estDate.getDate() + 7);
    const [req] = await db.insert(requestsTable).values({
      companyId: company.id, workflowId: p.workflowId, title: p.title,
      description: p.description, category: p.category, status: p.status,
      priority: p.priority, currentStepIndex: p.currentStepIndex,
      currentDepartmentId: p.currentDepartmentId, currentAssigneeId: p.currentAssigneeId,
      creatorId: shahad.id, delayRisk: p.delayRisk, aiRiskScore: p.aiRiskScore,
      estimatedCompletionDate: estDate, createdAt: p.createdAt, completedAt: p.completedAt ?? null,
    }).returning();
    if (p.events.length) {
      await db.insert(timelineEventsTable).values(
        p.events.map(e => ({ requestId: req.id, eventType: e.eventType, description: e.description,
          departmentId: e.departmentId ?? null, userId: e.userId ?? null, createdAt: e.createdAt }))
      );
    }
    if (p.notifs?.length) {
      await db.insert(notificationsTable).values(
        p.notifs.map(n => ({ userId: n.userId, type: n.type, title: n.title, message: n.message,
          requestId: req.id, requestTitle: p.title, isRead: false }))
      );
    }
    return req;
  };

  // ── Active requests ────────────────────────────────────────────────────────

  // 1. High-risk vendor contract in Legal (SLA exceeded)
  await createRequest({
    title: "Vendor Contract — Acme Corp Q3 2026",
    description: "Annual service agreement for cloud infrastructure and SLA terms. Requires legal review before Finance counter-signature.",
    category: "Legal & Compliance", workflowId: wfLegal.id, status: "active",
    priority: "high", currentStepIndex: 0, currentDepartmentId: legalDept.id,
    currentAssigneeId: sarah.id, delayRisk: "high", aiRiskScore: 78, createdAt: daysAgo(5, 11),
    events: [
      { eventType: "created",  description: "Request submitted by Shahad Al-Rashidi",         userId: shahad.id, departmentId: null,         createdAt: daysAgo(5, 11) },
      { eventType: "assigned", description: "Assigned to Legal department for initial review", userId: sarah.id,  departmentId: legalDept.id, createdAt: daysAgo(5, 10) },
    ],
    notifs: [
      { userId: sarah.id,  type: "assigned",    title: "New request assigned", message: "Vendor Contract — Acme Corp Q3 2026 requires your review" },
      { userId: shahad.id, type: "sla_warning", title: "SLA Warning",          message: "Vendor Contract — Acme Corp Q3 2026 has exceeded its SLA target" },
    ],
  });

  // 2. Marketing budget in Finance
  await createRequest({
    title: "Budget Approval — Q4 Marketing Campaign",
    description: "Requesting AED 280,000 budget allocation for Q4 digital marketing across paid search, social media, and events.",
    category: "Finance", workflowId: wfFinance.id, status: "active",
    priority: "high", currentStepIndex: 0, currentDepartmentId: financeDept.id,
    currentAssigneeId: michael.id, delayRisk: "medium", aiRiskScore: 52, createdAt: daysAgo(3, 4),
    events: [
      { eventType: "created",  description: "Request submitted by Shahad Al-Rashidi", userId: shahad.id,  departmentId: null,          createdAt: daysAgo(3, 4) },
      { eventType: "assigned", description: "Assigned to Finance for budget review",  userId: michael.id, departmentId: financeDept.id, createdAt: daysAgo(3, 3) },
    ],
    notifs: [
      { userId: michael.id, type: "assigned", title: "New request assigned", message: "Budget Approval — Q4 Marketing Campaign requires your review" },
    ],
  });

  // 3. Employee onboarding in IT (HR already approved, step 1)
  await createRequest({
    title: "Employee Onboarding — Layla Mahmoud",
    description: "New hire in Engineering. HR formalities complete; IT access provisioning required for dev tools and VPN.",
    category: "Human Resources", workflowId: wfHR.id, status: "active",
    priority: "medium", currentStepIndex: 1, currentDepartmentId: itDept.id,
    currentAssigneeId: james.id, delayRisk: "low", aiRiskScore: 22, createdAt: daysAgo(9, 2),
    events: [
      { eventType: "created",  description: "Request submitted by Shahad Al-Rashidi",                       userId: shahad.id, departmentId: null,        createdAt: daysAgo(9, 2) },
      { eventType: "assigned", description: "Assigned to HR for onboarding review",                         userId: aisha.id,  departmentId: hrDept.id,   createdAt: daysAgo(9, 1) },
      { eventType: "advanced", description: "HR review approved — advancing to IT for system provisioning", userId: aisha.id,  departmentId: itDept.id,   createdAt: daysAgo(7, 3) },
    ],
    notifs: [
      { userId: james.id, type: "assigned", title: "New request assigned", message: "Employee Onboarding — Layla Mahmoud requires IT provisioning" },
    ],
  });

  // 4. CRITICAL software license — Legal step 1 (Finance already approved)
  await createRequest({
    title: "Annual Software License Renewal — Adobe & Salesforce",
    description: "Enterprise license renewals totalling AED 940,000. Finance approved; Legal must review vendor SLA changes before counter-signature.",
    category: "Legal & Compliance", workflowId: wfFinance.id, status: "active",
    priority: "critical", currentStepIndex: 1, currentDepartmentId: legalDept.id,
    currentAssigneeId: sarah.id, delayRisk: "critical", aiRiskScore: 91, createdAt: daysAgo(11, 6),
    events: [
      { eventType: "created",  description: "Request submitted by Shahad Al-Rashidi",                            userId: shahad.id,  departmentId: null,          createdAt: daysAgo(11, 6) },
      { eventType: "assigned", description: "Assigned to Finance for initial review",                            userId: michael.id, departmentId: financeDept.id, createdAt: daysAgo(11, 5) },
      { eventType: "advanced", description: "Finance review approved — advancing to Legal for contract terms",   userId: michael.id, departmentId: legalDept.id,   createdAt: daysAgo(9, 2) },
    ],
    notifs: [
      { userId: sarah.id,  type: "sla_exceeded", title: "SLA Exceeded",   message: "Annual Software License Renewal has exceeded SLA by 48h" },
      { userId: shahad.id, type: "ai_alert",      title: "AI Risk Alert", message: "Critical delay risk detected for Annual Software License Renewal" },
    ],
  });

  // 5. CRM access in IT (new, low risk)
  await createRequest({
    title: "CRM System Access — Sales Team (3 users)",
    description: "Requesting Salesforce CRM access for 3 new Sales Associates joining the MENA regional team.",
    category: "IT & Systems", workflowId: wfIT.id, status: "active",
    priority: "medium", currentStepIndex: 0, currentDepartmentId: itDept.id,
    currentAssigneeId: james.id, delayRisk: "low", aiRiskScore: 15, createdAt: daysAgo(1, 3),
    events: [
      { eventType: "created",  description: "Request submitted by Shahad Al-Rashidi", userId: shahad.id, departmentId: null,      createdAt: daysAgo(1, 3) },
      { eventType: "assigned", description: "Assigned to IT for access provisioning", userId: james.id,  departmentId: itDept.id, createdAt: daysAgo(1, 2) },
    ],
    notifs: [
      { userId: james.id, type: "assigned", title: "New request assigned", message: "CRM System Access — Sales Team (3 users) requires provisioning" },
    ],
  });

  // 6. Escalated — Legal SLA breach
  await createRequest({
    title: "Emergency Supplier Agreement — TechParts Ltd",
    description: "Urgent supplier agreement required before end of quarter. Escalated due to SLA breach — 48h overdue.",
    category: "Legal & Compliance", workflowId: wfLegal.id, status: "escalated",
    priority: "critical", currentStepIndex: 0, currentDepartmentId: legalDept.id,
    currentAssigneeId: sarah.id, delayRisk: "critical", aiRiskScore: 95, createdAt: daysAgo(7, 8),
    events: [
      { eventType: "created",   description: "Request submitted by Shahad Al-Rashidi",               userId: shahad.id, departmentId: null,         createdAt: daysAgo(7, 8) },
      { eventType: "assigned",  description: "Assigned to Legal for review",                         userId: sarah.id,  departmentId: legalDept.id, createdAt: daysAgo(7, 7) },
      { eventType: "escalated", description: "SLA breached by 48h — escalated to department head",  userId: sarah.id,  departmentId: legalDept.id, createdAt: daysAgo(5, 0) },
    ],
    notifs: [
      { userId: shahad.id, type: "escalated", title: "Request Escalated", message: "Emergency Supplier Agreement has been escalated due to SLA breach" },
      { userId: sarah.id,  type: "escalated", title: "Escalation Alert",  message: "Emergency Supplier Agreement requires immediate attention" },
    ],
  });

  // ── Completed requests ────────────────────────────────────────────────────

  // 7. Fast IT completion (2 days — within 24h SLA)
  await createRequest({
    title: "VPN Access — Remote Engineering Team",
    description: "VPN certificate provisioning for 5 remote engineers joining a client project.",
    category: "IT & Systems", workflowId: wfIT.id, status: "completed",
    priority: "medium", currentStepIndex: 1, currentDepartmentId: null,
    currentAssigneeId: null, delayRisk: "low", aiRiskScore: 10,
    createdAt: daysAgo(8, 4), completedAt: daysAgo(6, 2),
    events: [
      { eventType: "created",   description: "Request submitted by Shahad Al-Rashidi",               userId: shahad.id, departmentId: null,      createdAt: daysAgo(8, 4) },
      { eventType: "assigned",  description: "Assigned to IT for provisioning",                      userId: james.id,  departmentId: itDept.id, createdAt: daysAgo(8, 3) },
      { eventType: "completed", description: "VPN access granted — all 5 certificates provisioned",  userId: james.id,  departmentId: itDept.id, createdAt: daysAgo(6, 2) },
    ],
    notifs: [
      { userId: shahad.id, type: "completed", title: "Request Completed", message: "VPN Access — Remote Engineering Team has been completed" },
    ],
  });

  // 8. HR Onboarding full 2-step (6 days)
  await createRequest({
    title: "Employee Onboarding — Rami Al-Farsi",
    description: "Senior Software Engineer onboarding — HR documentation, access provisioning, and equipment setup.",
    category: "Human Resources", workflowId: wfHR.id, status: "completed",
    priority: "medium", currentStepIndex: 2, currentDepartmentId: null,
    currentAssigneeId: null, delayRisk: "low", aiRiskScore: 18,
    createdAt: daysAgo(20, 6), completedAt: daysAgo(14, 2),
    events: [
      { eventType: "created",   description: "Request submitted",                                      userId: shahad.id, departmentId: null,       createdAt: daysAgo(20, 6) },
      { eventType: "assigned",  description: "Assigned to HR for onboarding",                         userId: aisha.id,  departmentId: hrDept.id,  createdAt: daysAgo(20, 5) },
      { eventType: "advanced",  description: "HR review complete — advancing to IT for provisioning", userId: aisha.id,  departmentId: itDept.id,  createdAt: daysAgo(16, 3) },
      { eventType: "completed", description: "IT provisioning complete — onboarding finished",        userId: james.id,  departmentId: itDept.id,  createdAt: daysAgo(14, 2) },
    ],
    notifs: [
      { userId: shahad.id, type: "completed", title: "Onboarding Complete", message: "Employee Onboarding — Rami Al-Farsi has been completed" },
    ],
  });

  // 9. Legal Contract 2-step (9 days)
  await createRequest({
    title: "NDA Review — Global Partners International",
    description: "Mutual non-disclosure agreement for joint venture discussions with Global Partners International.",
    category: "Legal & Compliance", workflowId: wfLegal.id, status: "completed",
    priority: "high", currentStepIndex: 2, currentDepartmentId: null,
    currentAssigneeId: null, delayRisk: "low", aiRiskScore: 30,
    createdAt: daysAgo(25, 8), completedAt: daysAgo(16, 4),
    events: [
      { eventType: "created",   description: "Request submitted",                                                userId: shahad.id,  departmentId: null,          createdAt: daysAgo(25, 8) },
      { eventType: "assigned",  description: "Assigned to Legal for review",                                    userId: sarah.id,   departmentId: legalDept.id,  createdAt: daysAgo(25, 6) },
      { eventType: "advanced",  description: "Legal approved — advancing to Finance for counter-signature",     userId: sarah.id,   departmentId: financeDept.id, createdAt: daysAgo(20, 3) },
      { eventType: "completed", description: "Finance counter-signature complete — NDA executed",               userId: michael.id, departmentId: financeDept.id, createdAt: daysAgo(16, 4) },
    ],
    notifs: [],
  });

  // 10. Finance Budget 2-step (10 days)
  await createRequest({
    title: "Q3 Office Renovation Budget",
    description: "Budget for Dubai office renovation: collaboration spaces, ergonomic furniture, AV equipment. Total: AED 185,000.",
    category: "Finance", workflowId: wfFinance.id, status: "completed",
    priority: "medium", currentStepIndex: 2, currentDepartmentId: null,
    currentAssigneeId: null, delayRisk: "low", aiRiskScore: 25,
    createdAt: daysAgo(28, 10), completedAt: daysAgo(18, 6),
    events: [
      { eventType: "created",   description: "Request submitted",                              userId: shahad.id,  departmentId: null,          createdAt: daysAgo(28, 10) },
      { eventType: "assigned",  description: "Assigned to Finance",                           userId: michael.id, departmentId: financeDept.id, createdAt: daysAgo(28, 9) },
      { eventType: "advanced",  description: "Finance approved — advancing to Legal",         userId: michael.id, departmentId: legalDept.id,   createdAt: daysAgo(23, 4) },
      { eventType: "completed", description: "Legal approved — budget allocated",             userId: sarah.id,   departmentId: legalDept.id,   createdAt: daysAgo(18, 6) },
    ],
    notifs: [],
  });

  // ── Rejected ──────────────────────────────────────────────────────────────

  // 11. Rejected — incomplete submission
  await createRequest({
    title: "Vendor Onboarding — QuickSupply Co",
    description: "New vendor registration. Missing compliance certifications and tax registration documents.",
    category: "Legal & Compliance", workflowId: wfLegal.id, status: "rejected",
    priority: "medium", currentStepIndex: 0, currentDepartmentId: null,
    currentAssigneeId: null, delayRisk: "low", aiRiskScore: 40, createdAt: daysAgo(13, 5),
    events: [
      { eventType: "created",  description: "Request submitted",                                                          userId: shahad.id, departmentId: null,         createdAt: daysAgo(13, 5) },
      { eventType: "assigned", description: "Assigned to Legal for vendor review",                                        userId: sarah.id,  departmentId: legalDept.id, createdAt: daysAgo(13, 4) },
      { eventType: "rejected", description: "Rejected — missing compliance certificates and tax registration (VAT301)",   userId: sarah.id,  departmentId: legalDept.id, createdAt: daysAgo(11, 2) },
    ],
    notifs: [
      { userId: shahad.id, type: "rejected", title: "Request Rejected", message: "Vendor Onboarding — QuickSupply Co was rejected: missing compliance documents" },
    ],
  });

  // 12. New request just submitted (low risk)
  await createRequest({
    title: "Service Agreement — Apex Consulting",
    description: "12-month consulting services agreement for digital transformation advisory. Estimated value: AED 420,000.",
    category: "Legal & Compliance", workflowId: wfLegal.id, status: "active",
    priority: "high", currentStepIndex: 0, currentDepartmentId: legalDept.id,
    currentAssigneeId: sarah.id, delayRisk: "low", aiRiskScore: 20, createdAt: daysAgo(0, 5),
    events: [
      { eventType: "created",  description: "Request submitted by Shahad Al-Rashidi", userId: shahad.id, departmentId: null,         createdAt: daysAgo(0, 5) },
      { eventType: "assigned", description: "Assigned to Legal for initial review",   userId: sarah.id,  departmentId: legalDept.id, createdAt: daysAgo(0, 4) },
    ],
    notifs: [
      { userId: sarah.id, type: "assigned", title: "New request assigned", message: "Service Agreement — Apex Consulting requires your review" },
    ],
  });

  console.log("✅ Seed complete — 1 company, 4 depts, 8 users, 4 workflows, 12 requests.");
}

/** Returns true if DB is empty (no companies inserted yet) */
export async function isDatabaseEmpty(): Promise<boolean> {
  const rows = await db.select().from(companiesTable).limit(1);
  return rows.length === 0;
}
