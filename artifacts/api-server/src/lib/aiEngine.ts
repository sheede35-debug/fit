/**
 * AI Engine — deterministic simulation of AI features for FlowIQ demo
 * In production this would call LLM APIs. For demo it returns realistic computed data.
 */

export function computeDelayPrediction(requestId: number, waitingHours: number, priority: string, departmentAvgHours: number) {
  // Simulate AI delay prediction based on inputs
  const baseRisk = Math.min(0.95, (waitingHours / (departmentAvgHours || 48)) * 0.7);
  const priorityBoost = priority === "critical" ? 0.15 : priority === "high" ? 0.08 : 0;
  const delayProbability = Math.min(0.97, baseRisk + priorityBoost);
  const riskLevel = delayProbability > 0.7 ? "critical" : delayProbability > 0.5 ? "high" : delayProbability > 0.3 ? "medium" : "low";
  const estimatedRemainingDays = Math.max(1, Math.round((departmentAvgHours - waitingHours) / 24));
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + estimatedRemainingDays);

  return {
    requestId,
    delayProbability: Math.round(delayProbability * 100) / 100,
    estimatedCompletionDate: estimatedDate.toISOString(),
    estimatedRemainingDays,
    riskLevel,
    confidenceScore: 0.87,
    factors: [
      waitingHours > departmentAvgHours ? "Exceeds department average processing time" : "Within normal processing range",
      priority === "critical" || priority === "high" ? "High priority escalation risk" : "Standard priority queue",
      "Cross-department dependency detected",
      "Peak workload period for current department",
    ].filter(Boolean),
  };
}

export function computeAiInsights(departments: any[], requests: any[], users: any[]) {
  const bottlenecks = departments.map((d) => {
    const deptRequests = requests.filter((r) => r.currentDepartmentId === d.id);
    const avgWait = deptRequests.length > 0
      ? deptRequests.reduce((sum: number, r: any) => sum + (r.waitingHours || 0), 0) / deptRequests.length
      : 0;
    const severity = avgWait > 72 ? "critical" : avgWait > 48 ? "high" : avgWait > 24 ? "medium" : "low";
    return {
      departmentId: d.id,
      departmentName: d.name,
      avgWaitHours: Math.round(avgWait * 10) / 10,
      affectedRequests: deptRequests.length,
      severity,
      confidenceScore: 0.91,
    };
  }).filter((b) => b.affectedRequests > 0).sort((a, b) => b.avgWaitHours - a.avgWaitHours);

  const overloaded = users.map((u) => {
    const userRequests = requests.filter((r) => r.currentAssigneeId === u.id);
    const capacityUsed = Math.min(1.5, userRequests.length / 5);
    return {
      userId: u.id,
      userName: u.name,
      departmentName: u.departmentName || "Unknown",
      activeRequests: userRequests.length,
      capacityUsed: Math.round(capacityUsed * 100) / 100,
    };
  }).filter((u) => u.activeRequests > 2).sort((a, b) => b.activeRequests - a.activeRequests).slice(0, 5);

  const rootCauses = [
    { cause: "Missing required documents", occurrences: 14, confidenceScore: 0.93, affectedRequests: 8 },
    { cause: "Waiting for senior approval", occurrences: 11, confidenceScore: 0.88, affectedRequests: 7 },
    { cause: "High employee workload", occurrences: 9, confidenceScore: 0.85, affectedRequests: 6 },
    { cause: "Cross-department dependency", occurrences: 7, confidenceScore: 0.79, affectedRequests: 5 },
    { cause: "Incomplete information provided", occurrences: 5, confidenceScore: 0.76, affectedRequests: 4 },
  ];

  const totalDelayed = requests.filter((r) => r.delayRisk === "high" || r.delayRisk === "critical").length;
  const riskScore = Math.min(100, Math.round((totalDelayed / Math.max(1, requests.length)) * 100 * 1.2));

  return {
    riskScore,
    bottlenecks: bottlenecks.slice(0, 5),
    overloadedEmployees: overloaded,
    rootCauses,
    topRecommendations: [
      "Redistribute workload in Legal department — 40% above capacity",
      "Add parallel approval step for Finance reviews under $10k",
      "Enable auto-escalation for requests exceeding 48h SLA",
      "Implement document validation before request submission",
      "Schedule cross-training for Sales → Operations handoff",
    ],
    peakWorkloadTimes: [
      { label: "Mon 9am", value: 82 },
      { label: "Mon 2pm", value: 67 },
      { label: "Tue 10am", value: 91 },
      { label: "Wed 9am", value: 78 },
      { label: "Thu 11am", value: 85 },
      { label: "Fri 9am", value: 59 },
    ],
  };
}

export function generateWeeklySummary(stats: any) {
  const trend = stats.completedRequests > stats.delayedRequests ? "improving" : "declining";
  return {
    periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    periodEnd: new Date().toISOString(),
    period: "weekly" as const,
    bestPerformingDepartment: "Sales Operations",
    bestDepartment: "Sales Operations",
    slowestDepartment: "Legal Review",
    completedRequests: stats.completedRequests || 24,
    delayedRequests: stats.delayedRequests || 7,
    newRequests: stats.newRequests || 18,
    avgCompletionHours: 68.4,
    slaComplianceRate: 0.74,
    topDelayedCategories: ["Contract Review", "Budget Approval", "HR Onboarding"],
    mainDelayCauses: [
      "Document validation failures (31%)",
      "Senior approval backlog (24%)",
      "Cross-team dependencies (19%)",
    ],
    performanceTrend: trend as "improving" | "declining" | "stable",
    departmentSummary: [
      { departmentName: "Sales Operations", completedRequests: 12, avgHours: 36, slaRate: 0.92, score: 88 },
      { departmentName: "Finance", completedRequests: 8, avgHours: 52, slaRate: 0.81, score: 76 },
      { departmentName: "Legal Review", completedRequests: 4, avgHours: 96, slaRate: 0.58, score: 51 },
      { departmentName: "HR", completedRequests: 6, avgHours: 44, slaRate: 0.85, score: 82 },
    ],
    topIssues: [
      { issue: "Legal department 3 reviewers handling 9 active requests simultaneously", impact: "high" as const, count: 9 },
      { issue: "Finance approval queue backed up — avg wait 52h vs 36h SLA", impact: "medium" as const, count: 6 },
      { issue: "Document rejection rate at 23% causing resubmissions", impact: "medium" as const, count: 14 },
    ],
    recommendations: [
      "Hire 1-2 additional Legal reviewers to address 40% SLA miss rate",
      "Implement automated document checklist before submission",
      "Create fast-track lane for requests under $5k value",
      "Weekly bottleneck review meeting with department heads",
    ],
    generatedAt: new Date().toISOString(),
  };
}

export function generateMonthlyReport(requests: any[], departments: any[]) {
  const completed = requests.filter((r) => r.status === "completed");
  const delayed = requests.filter((r) => r.delayRisk === "high" || r.delayRisk === "critical");
  const avgHours = 68.4;
  const slaRate = Math.round((1 - delayed.length / Math.max(1, requests.length)) * 100) / 100;

  const deptSummary = departments.map((d, i) => ({
    departmentName: d.name,
    completedRequests: 8 + Math.floor((d.id * 7) % 20),
    avgHours: Math.round(24 + ((d.id * 13) % 72)),
    slaRate: Math.round((0.6 + ((d.id * 0.07) % 0.35)) * 100) / 100,
    score: 55 + ((d.id * 11) % 40),
  }));

  return {
    periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    periodEnd: new Date().toISOString(),
    period: "monthly" as const,
    bestPerformingDepartment: deptSummary.sort((a, b) => b.score - a.score)[0]?.departmentName ?? "Sales",
    bestDepartment: deptSummary.sort((a, b) => b.score - a.score)[0]?.departmentName ?? "Sales",
    slowestDepartment: deptSummary.sort((a, b) => a.score - b.score)[0]?.departmentName ?? "Legal",
    completedRequests: completed.length || 89,
    delayedRequests: delayed.length || 24,
    newRequests: requests.length || 103,
    avgCompletionHours: avgHours,
    slaComplianceRate: slaRate,
    topDelayedCategories: ["Contract Review", "Budget Approval", "Vendor Onboarding"],
    mainDelayCauses: [
      "Document validation failures (28%)",
      "Senior approval backlog (22%)",
      "Cross-team dependencies (17%)",
      "Incomplete submissions (15%)",
    ],
    performanceTrend: slaRate > 0.75 ? "improving" as const : "declining" as const,
    departmentSummary: departments.map((d) => ({
      departmentName: d.name,
      completedRequests: 8 + Math.floor((d.id * 7) % 20),
      avgHours: Math.round(24 + ((d.id * 13) % 72)),
      slaRate: Math.round((0.6 + ((d.id * 0.07) % 0.35)) * 100) / 100,
      score: 55 + ((d.id * 11) % 40),
    })),
    topIssues: [
      { issue: "Legal department SLA miss rate reached 42% this month", impact: "high" as const, count: 16 },
      { issue: "Finance queue grew 18% month-over-month", impact: "high" as const, count: 12 },
      { issue: "Document rejection causing 23% of resubmissions", impact: "medium" as const, count: 24 },
    ],
    recommendations: [
      "Expand Legal team capacity — department is consistently 40% over target",
      "Introduce auto-classification to reduce misrouted requests by est. 25%",
      "Implement mandatory pre-submission checklist for Finance requests",
      "Create SLA dashboard visible to all department heads for accountability",
      "Launch quarterly cross-training program for Operations/Sales handoff",
    ],
    generatedAt: new Date().toISOString(),
  };
}

export function analyzeRequestJourney(request: any, timelineEvents: any[], workflowSteps: any[]) {
  const now = Date.now();
  const SLA_PER_STEP_HOURS = 24;

  // Build stage analysis from timeline events
  const stages = timelineEvents.map((event, i) => {
    const nextEvent = timelineEvents[i + 1];
    const startTime = new Date(event.createdAt).getTime();
    const endTime = nextEvent ? new Date(nextEvent.createdAt).getTime() : now;
    const durationHours = Math.round((endTime - startTime) / (1000 * 60 * 60) * 10) / 10;
    const slaHours = workflowSteps[i]?.slaHours || SLA_PER_STEP_HOURS;
    const isOverSla = durationHours > slaHours;
    const isActive = !nextEvent;

    return {
      stageName: event.departmentName || event.description?.split(" ").slice(0, 3).join(" ") || `Stage ${i + 1}`,
      departmentName: event.departmentName || "Processing",
      assigneeName: event.userName || null,
      eventType: event.eventType,
      startedAt: event.createdAt,
      completedAt: nextEvent ? nextEvent.createdAt : null,
      durationHours,
      slaHours,
      slaUsagePercent: Math.min(150, Math.round((durationHours / slaHours) * 100)),
      isOverSla,
      isActive,
      delayHours: isOverSla ? Math.round((durationHours - slaHours) * 10) / 10 : 0,
      status: isActive ? "active" : isOverSla ? "delayed" : "completed",
    };
  });

  // Identify bottleneck stage (longest delay relative to SLA)
  const bottleneckStage = stages
    .filter((s) => s.isOverSla)
    .sort((a, b) => b.delayHours - a.delayHours)[0] ?? null;

  const totalDelayHours = stages.reduce((sum, s) => sum + s.delayHours, 0);
  const totalDurationHours = stages.reduce((sum, s) => sum + s.durationHours, 0);

  // Generate improvement tips based on the journey
  const tips: string[] = [];
  if (bottleneckStage) {
    tips.push(`${bottleneckStage.departmentName} stage exceeded SLA by ${bottleneckStage.delayHours}h — consider assigning additional reviewers.`);
  }
  if (totalDelayHours > 48) {
    tips.push("Total accumulated delay exceeds 2 days. Escalation to department manager recommended.");
  }
  const longestStage = [...stages].sort((a, b) => b.durationHours - a.durationHours)[0];
  if (longestStage && stages.length > 1) {
    tips.push(`${longestStage.stageName} is the longest stage (${longestStage.durationHours}h). Pre-validating requirements before handoff could reduce this by 30%.`);
  }
  if (tips.length === 0) {
    tips.push("Request is progressing within expected timeframes. No immediate action required.");
  }

  const overallRisk = totalDelayHours > 72 ? "critical" : totalDelayHours > 24 ? "high" : totalDelayHours > 0 ? "medium" : "low";

  return {
    requestId: request.id,
    requestTitle: request.title,
    totalStages: stages.length,
    completedStages: stages.filter((s) => !s.isActive).length,
    totalDurationHours,
    totalDelayHours,
    overallRisk,
    bottleneckStageName: bottleneckStage?.stageName ?? null,
    stages,
    improvementTips: tips,
    analysisGeneratedAt: new Date().toISOString(),
  };
}

export function simulateWhatIf(scenario: string, additionalEmployees: number = 2, departmentName: string = "Legal") {
  const improvementFactor = Math.min(0.45, additionalEmployees * 0.15);
  return {
    scenario,
    currentMetrics: {
      avgCompletionHours: 72.4,
      slaComplianceRate: 0.74,
      bottleneckCount: 3,
      delayedRequestsPercent: 0.28,
    },
    simulatedMetrics: {
      avgCompletionHours: Math.round(72.4 * (1 - improvementFactor) * 10) / 10,
      slaComplianceRate: Math.min(0.99, 0.74 + improvementFactor * 0.8),
      bottleneckCount: Math.max(1, 3 - additionalEmployees),
      delayedRequestsPercent: Math.max(0.05, 0.28 - improvementFactor),
    },
    improvements: [
      {
        metric: "Average Completion Time",
        currentValue: 72.4,
        simulatedValue: Math.round(72.4 * (1 - improvementFactor) * 10) / 10,
        changePercent: -Math.round(improvementFactor * 100),
      },
      {
        metric: "SLA Compliance Rate",
        currentValue: 74,
        simulatedValue: Math.min(99, Math.round((0.74 + improvementFactor * 0.8) * 100)),
        changePercent: Math.round(improvementFactor * 80),
      },
      {
        metric: "Delayed Requests",
        currentValue: 28,
        simulatedValue: Math.max(5, Math.round((0.28 - improvementFactor) * 100)),
        changePercent: -Math.round(improvementFactor * 100),
      },
    ],
  };
}

export function classifyRequest(description: string, title: string = "") {
  const text = `${title} ${description}`.toLowerCase();
  let category = "General";
  let priority = "medium";
  let requiredDepartments = ["Operations"];
  let expectedHours = 48;
  let suggestedWorkflowId: number | null = null;
  let suggestedDepartment = "Operations";
  let suggestedEmployee = "Operations Manager";
  let nextAction = "Submit request to Operations team for initial review";

  if (text.includes("legal") || text.includes("contract") || text.includes("compliance")) {
    category = "Legal & Compliance";
    requiredDepartments = ["Legal", "Management"];
    priority = "high";
    expectedHours = 96;
    suggestedWorkflowId = 1;
    suggestedDepartment = "Legal";
    suggestedEmployee = "Sarah Chen";
    nextAction = "Prepare all supporting documents and contract drafts before submission";
  } else if (text.includes("finance") || text.includes("budget") || text.includes("payment") || text.includes("invoice")) {
    category = "Finance";
    requiredDepartments = ["Finance", "Management"];
    priority = "high";
    expectedHours = 72;
    suggestedWorkflowId = 2;
    suggestedDepartment = "Finance";
    suggestedEmployee = "Michael Torres";
    nextAction = "Include budget code and cost center in the request description";
  } else if (text.includes("hr") || text.includes("hire") || text.includes("onboard") || text.includes("employee")) {
    category = "Human Resources";
    requiredDepartments = ["HR", "Management"];
    priority = "medium";
    expectedHours = 120;
    suggestedDepartment = "HR";
    suggestedEmployee = "Aisha Patel";
    nextAction = "Prepare offer letter and department confirmation before HR review";
  } else if (text.includes("it") || text.includes("software") || text.includes("access") || text.includes("system")) {
    category = "IT & Systems";
    requiredDepartments = ["IT", "Security"];
    priority = "medium";
    expectedHours = 24;
    suggestedDepartment = "IT";
    suggestedEmployee = "James Wilson";
    nextAction = "Include system name, access level needed, and business justification";
  } else if (text.includes("urgent") || text.includes("critical") || text.includes("emergency")) {
    priority = "critical";
    expectedHours = 12;
    nextAction = "Mark as critical and notify department manager directly for expedited processing";
  }

  return {
    category,
    priority,
    expectedCompletionHours: expectedHours,
    requiredDepartments,
    confidence: 0.84,
    suggestedWorkflowId,
    suggestedDepartment,
    suggestedEmployee,
    nextAction,
  };
}

export function generateAiChatResponse(message: string, data: any) {
  const lower = message.toLowerCase();
  let response = "";

  if (lower.includes("create") && (lower.includes("request") || lower.includes("new"))) {
    response = `I can help you create a new request! Here's what I recommend:\n\n1. **Go to Requests → New Request** from the sidebar\n2. Select the workflow that best matches your need\n3. Write a clear title — be specific (e.g. "Legal review for Vendor Contract - Acme Corp Q3 2026")\n4. Click **AI Auto-Classify** to let me suggest the priority and workflow automatically\n\nWould you like tips for a specific type of request (Legal, Finance, HR, IT)?`;
  } else if (lower.includes("status") || (lower.includes("request") && lower.includes("#"))) {
    const match = message.match(/#(\d+)/);
    const reqNum = match ? match[1] : "102";
    response = `Request #${reqNum} is currently in the **Legal Review** stage, assigned to Sarah Chen. It has been waiting **52 hours** against a 48-hour SLA (108% elapsed). Delay factors: pending external counsel review and missing signatory page on attachment.\n\n**Recommended action:** Escalate to department manager and request document resubmission.`;
  } else if (lower.includes("delayed") || lower.includes("delay")) {
    response = `Based on current data, there are **${data.delayedRequests || 7} delayed requests** in the system. The primary bottleneck is the **${data.currentBottleneckDepartment || "Legal Review"}** department, which is processing requests at 40% below expected capacity. I recommend reviewing SLA policies and considering additional resources for that team.`;
  } else if (lower.includes("bottleneck")) {
    response = `The current bottleneck is **${data.currentBottleneckDepartment || "Legal Review"}** with an average wait time of 68 hours — 42% above SLA target. Contributing factors include: high workload (8 active requests vs. capacity of 5), 2 senior approvers on leave, and a 23% document rejection rate requiring resubmission.`;
  } else if (lower.includes("performance") || lower.includes("this week")) {
    response = `This week's performance summary:\n\n- **Completed:** ${data.completedRequests || 24} requests\n- **New:** ${data.activeRequests || 18} requests\n- **SLA Compliance:** ${Math.round((data.slaComplianceRate || 0.74) * 100)}%\n- **AI Risk Score:** ${data.aiRiskScore || 67}/100\n\nOverall trend is **${data.slaComplianceRate > 0.8 ? "improving" : "declining"}** compared to last week. Focus area: Finance department approval times.`;
  } else if (lower.includes("step") || lower.includes("process") || lower.includes("approval")) {
    response = `**How workflow approvals work in FlowIQ:**\n\n1. You submit a request → it enters the first department's queue\n2. The assigned reviewer approves or requests changes\n3. On approval, it automatically advances to the next department\n4. You receive notifications at each stage change\n5. Once all stages are approved, the request is marked Complete\n\nMost requests go through 2-4 departments. Legal and Finance reviews typically take the longest (48-96h SLA).`;
  } else if (lower.includes("recommend") || lower.includes("improve")) {
    response = `Top AI recommendations for this period:\n\n1. **Redistribute Legal workload** — move 3 low-priority requests to junior reviewers\n2. **Enable parallel Finance approvals** for requests under $10k\n3. **Implement document validation** — 31% of delays stem from incomplete submissions\n4. **Auto-escalate at 80% SLA** — current policy triggers at 100%, too late to intervene\n5. **Cross-train Sales team** on Operations handoff requirements`;
  } else {
    response = `I've analyzed your request across ${data.totalRequests || 89} active workflows. Here's what I found:\n\n- System health: **${data.aiRiskScore > 70 ? "Attention needed" : "Good"}** (Risk score: ${data.aiRiskScore || 67}/100)\n- Most impacted area: **${data.currentBottleneckDepartment || "Legal"} department**\n- Highest risk request type: **${data.mostDelayedRequestType || "Contract Reviews"}**\n\nI can help you check a request status (#ID), create a new request, understand approval steps, or review recommendations. What would you like to do?`;
  }

  return {
    message: response,
    conversationId: `conv_${Date.now()}`,
    relatedRequestIds: [],
    dataReferences: ["dashboard_stats", "department_performance"],
  };
}
