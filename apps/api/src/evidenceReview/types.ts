// -- Evidence Review -- Types ------------------------------------------------

export const EVIDENCE_REVIEW_DECISIONS = [
  "accept",
  "reject",
  "needs_more_info",
  "expire",
  "mark_duplicate",
  "mark_wrong_document",
  "block",
] as const;
export type EvidenceReviewDecision = (typeof EVIDENCE_REVIEW_DECISIONS)[number];

export const EVIDENCE_REVIEWER_ROLES = [
  "project_admin",
  "lender_reviewer",
  "legal_reviewer",
  "tax_reviewer",
  "accounting_reviewer",
  "construction_reviewer",
  "code_reviewer",
  "esg_reviewer",
  "public_finance_reviewer",
] as const;
export type EvidenceReviewerRole = (typeof EVIDENCE_REVIEWER_ROLES)[number];

export const EVIDENCE_REVIEW_OUTCOMES = [
  "accepted",
  "rejected",
  "needs_more_info",
  "expired",
  "blocked",
  "duplicate",
  "wrong_document",
  "review_required",
] as const;
export type EvidenceReviewOutcomeType = (typeof EVIDENCE_REVIEW_OUTCOMES)[number];

export type EvidenceDocumentClass =
  | "general"
  | "legal"
  | "tax"
  | "lender"
  | "contractor"
  | "code_permit"
  | "esg"
  | "incentive"
  | "blockchain_reference";

export interface EvidenceReviewChecklist {
  requiresRole: EvidenceReviewerRole[];
  requiresLenderAuthorization: boolean;
  requiresOffChainReview: boolean;
}

export interface EvidenceAcceptancePolicy {
  documentClass: EvidenceDocumentClass;
  checklist: EvidenceReviewChecklist;
}

export interface EvidenceReviewAuditEntry {
  timestamp: string;
  actor: EvidenceReviewerRole;
  evidenceId: string;
  action: string;
  details: string;
}

export interface EvidenceReviewInput {
  evidenceId: string;
  documentClass: EvidenceDocumentClass;
  reviewerRole: EvidenceReviewerRole;
  decision: EvidenceReviewDecision;
  reason?: string;
  reviewedAt: string;
  lenderUseAuthorized?: boolean;
  secretDetected?: boolean;
  claimType?: "tax_credit" | "esg" | "other";
}

export interface EvidenceReviewOutcome {
  evidenceId: string;
  outcome: EvidenceReviewOutcomeType;
  accepted: boolean;
  blockerReasons: string[];
  auditEntry?: EvidenceReviewAuditEntry;
}
