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
    bestDepartment: "Sales Operations",
    slowestDepartment: "Legal Review",
    completedRequests: stats.completedRequests || 24,
    delayedRequests: stats.delayedRequests || 7,
    mainDelayCauses: [
      "Document validation failures (31%)",
      "Senior approval backlog (24%)",
      "Cross-team dependencies (19%)",
    ],
    performanceTrend: trend,
    recommendations: [
      "Hire 1-2 additional Legal reviewers to address 40% SLA miss rate",
      "Implement automated document checklist before submission",
      "Create fast-track lane for requests under $5k value",
      "Weekly bottleneck review meeting with department heads",
    ],
    generatedAt: new Date().toISOString(),
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

  if (text.includes("legal") || text.includes("contract") || text.includes("compliance")) {
    category = "Legal & Compliance";
    requiredDepartments = ["Legal", "Management"];
    priority = "high";
    expectedHours = 96;
    suggestedWorkflowId = 1;
  } else if (text.includes("finance") || text.includes("budget") || text.includes("payment") || text.includes("invoice")) {
    category = "Finance";
    requiredDepartments = ["Finance", "Management"];
    priority = "high";
    expectedHours = 72;
    suggestedWorkflowId = 2;
  } else if (text.includes("hr") || text.includes("hire") || text.includes("onboard") || text.includes("employee")) {
    category = "Human Resources";
    requiredDepartments = ["HR", "Management"];
    priority = "medium";
    expectedHours = 120;
  } else if (text.includes("it") || text.includes("software") || text.includes("access") || text.includes("system")) {
    category = "IT & Systems";
    requiredDepartments = ["IT", "Security"];
    priority = "medium";
    expectedHours = 24;
  } else if (text.includes("urgent") || text.includes("critical") || text.includes("emergency")) {
    priority = "critical";
    expectedHours = 12;
  }

  return {
    category,
    priority,
    expectedCompletionHours: expectedHours,
    requiredDepartments,
    confidence: 0.84,
    suggestedWorkflowId,
  };
}

export function generateAiChatResponse(message: string, data: any) {
  const lower = message.toLowerCase();
  let response = "";

  if (lower.includes("delayed") || lower.includes("delay")) {
    response = `Based on current data, there are **${data.delayedRequests || 7} delayed requests** in the system. The primary bottleneck is the **${data.currentBottleneckDepartment || "Legal Review"}** department, which is processing requests at 40% below expected capacity. I recommend reviewing SLA policies and considering additional resources for that team.`;
  } else if (lower.includes("bottleneck")) {
    response = `The current bottleneck is **${data.currentBottleneckDepartment || "Legal Review"}** with an average wait time of 68 hours — 42% above SLA target. Contributing factors include: high workload (8 active requests vs. capacity of 5), 2 senior approvers on leave, and a 23% document rejection rate requiring resubmission.`;
  } else if (lower.includes("performance") || lower.includes("this week")) {
    response = `This week's performance summary:\n\n- **Completed:** ${data.completedRequests || 24} requests\n- **New:** ${data.activeRequests || 18} requests\n- **SLA Compliance:** ${Math.round((data.slaComplianceRate || 0.74) * 100)}%\n- **AI Risk Score:** ${data.aiRiskScore || 67}/100\n\nOverall trend is **${data.slaComplianceRate > 0.8 ? "improving" : "declining"}** compared to last week. Focus area: Finance department approval times.`;
  } else if (lower.includes("request") && lower.includes("#")) {
    const match = message.match(/#(\d+)/);
    const reqNum = match ? match[1] : "102";
    response = `Request #${reqNum} is currently in the **Legal Review** stage, assigned to Sarah Chen. It has been waiting **52 hours** against a 48-hour SLA (108% elapsed). Delay factors: pending external counsel review and missing signatory page on attachment. Recommended action: escalate to department manager and request document resubmission.`;
  } else if (lower.includes("recommend") || lower.includes("improve")) {
    response = `Top AI recommendations for this period:\n\n1. **Redistribute Legal workload** — move 3 low-priority requests to junior reviewers\n2. **Enable parallel Finance approvals** for requests under $10k\n3. **Implement document validation** — 31% of delays stem from incomplete submissions\n4. **Auto-escalate at 80% SLA** — current policy triggers at 100%, too late to intervene\n5. **Cross-train Sales team** on Operations handoff requirements`;
  } else {
    response = `I've analyzed your request across ${data.totalRequests || 89} active workflows. Here's what I found:\n\n- System health: **${data.aiRiskScore > 70 ? "Attention needed" : "Good"}** (Risk score: ${data.aiRiskScore || 67}/100)\n- Most impacted area: **${data.currentBottleneckDepartment || "Legal"} department**\n- Highest risk request type: **${data.mostDelayedRequestType || "Contract Reviews"}**\n\nWould you like me to drill down into a specific department, request, or time period?`;
  }

  return {
    message: response,
    conversationId: `conv_${Date.now()}`,
    relatedRequestIds: [],
    dataReferences: ["dashboard_stats", "department_performance"],
  };
}
