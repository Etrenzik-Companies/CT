import {
  AgentPolicy,
  BidPackage,
  CodeFact,
  ContractorProfile,
  EstimateLineItem,
  IncentiveRecord,
  MappedToolAction,
  PermitRecord,
  ProjectInstance,
  ProjectTemplate,
  RagAnswer
} from "./types.js";

export function validateContractorProfile(profile: ContractorProfile): { ok: boolean; reason: string } {
  if (!profile.tradeCategories.length) {
    return { ok: false, reason: "Contractor requires at least one trade category" };
  }
  return { ok: true, reason: "valid" };
}

export function canEngageVendor(profile: ContractorProfile): { ok: boolean; reason: string } {
  if (profile.quoteStatus !== "approved") {
    return { ok: false, reason: "Quote must be approved before engagement" };
  }
  if (!profile.signedEngagementEvidenceId) {
    return { ok: false, reason: "Signed engagement evidence is required" };
  }
  return { ok: true, reason: "engagement allowed" };
}

export function calculateEstimateVariance(item: EstimateLineItem): number {
  return item.currentEstimate - item.originalBudget;
}

export function canAwardBidPackage(pkg: BidPackage): { ok: boolean; reason: string } {
  if (!pkg.approvedBidId) return { ok: false, reason: "Approved bid is required" };
  return { ok: true, reason: "award allowed" };
}

export function answerCodeQuestion(question: string, citations: string[]): { status: "answered" | "unknown"; text: string } {
  if (!citations.length) {
    return {
      status: "unknown",
      text: "unknown / needs verification - AHJ verification required"
    };
  }
  return {
    status: "answered",
    text: `${question} - requires professional/code official verification`
  };
}

export function hasCodeFactMetadata(fact: CodeFact): boolean {
  return Boolean(fact.jurisdiction && fact.version && fact.effectiveDate && fact.sourceUrl);
}

export function canApprovePermit(record: PermitRecord): { ok: boolean; reason: string } {
  if (!record.evidenceArtifactId) return { ok: false, reason: "Permit approval requires evidence artifact" };
  return { ok: true, reason: "permit approval allowed" };
}

export function canConfirmIncentiveFunding(record: IncentiveRecord): { ok: boolean; reason: string } {
  const approvedState = record.status === "approved" || record.status === "awarded" || record.status === "monetized";
  if (!approvedState || !record.approvalEvidenceId) {
    return { ok: false, reason: "Incentive not confirmed without approval evidence" };
  }
  return { ok: true, reason: "incentive confirmed" };
}

export function requiresTaxProfessionalReview(record: IncentiveRecord): boolean {
  return record.type === "tax" && record.requiresCpaReview;
}

export function ragAnswerHasCitations(answer: RagAnswer): boolean {
  return answer.citations.length > 0;
}

export function isMcpActionAuthorized(action: MappedToolAction, allowlist: Record<string, string[]>): boolean {
  const roleTools = allowlist[action.role] || [];
  return roleTools.includes(action.toolName);
}

export function canAgentUseTool(policy: AgentPolicy, toolName: string): boolean {
  if (policy.forbiddenTools.includes(toolName)) return false;
  return policy.allowedTools.includes(toolName);
}

export function createProjectFromTemplate(template: ProjectTemplate, input: Omit<ProjectInstance, "templateId">): ProjectInstance {
  return {
    ...input,
    templateId: template.id
  };
}

export function isClayTerraceProjectInstanceValid(projects: ProjectInstance[]): boolean {
  const primaries = projects.filter((p) => p.isPrimaryClayTerrace);
  return primaries.length === 1 && primaries[0]?.name.includes("Clay Terrace");
}

export function requiresHumanReviewForHighRisk(riskLevel: "low" | "medium" | "high"): boolean {
  return riskLevel === "high";
}
