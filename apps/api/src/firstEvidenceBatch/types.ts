// -- First Evidence Batch -- Types -------------------------------------------
// Phase 10 models the first lender-critical evidence batch as metadata/checklist.

export const FIRST_EVIDENCE_BATCH_CATEGORIES = [
  "appraisal",
  "title_search",
  "gc_insurance",
  "bank_statement",
  "lender_term_sheet",
] as const;
export type FirstEvidenceBatchCategory = (typeof FIRST_EVIDENCE_BATCH_CATEGORIES)[number];

export const FIRST_EVIDENCE_BATCH_STATUSES = [
  "missing",
  "requested",
  "received",
  "registered",
  "mapped",
  "review_required",
  "accepted",
  "rejected",
  "blocked",
  "expired",
] as const;
export type FirstEvidenceBatchStatus = (typeof FIRST_EVIDENCE_BATCH_STATUSES)[number];

export const FIRST_EVIDENCE_BATCH_PRIORITIES = ["critical", "high", "medium"] as const;
export type FirstEvidenceBatchPriority = (typeof FIRST_EVIDENCE_BATCH_PRIORITIES)[number];

export const FIRST_EVIDENCE_BATCH_REVIEWER_ROLES = [
  "lender_reviewer",
  "legal_reviewer",
  "tax_reviewer",
  "accounting_reviewer",
  "construction_reviewer",
  "title_reviewer",
  "insurance_reviewer",
  "project_admin",
] as const;
export type FirstEvidenceBatchReviewerRole = (typeof FIRST_EVIDENCE_BATCH_REVIEWER_ROLES)[number];

export interface FirstEvidenceBatchReviewerAssignment {
  role: FirstEvidenceBatchReviewerRole;
  reviewFocus: string;
  required: boolean;
}

export interface FirstEvidenceBatchRequirement {
  category: FirstEvidenceBatchCategory;
  title: string;
  priority: FirstEvidenceBatchPriority;
  confidential: boolean;
  classification: "general" | "financial_confidential" | "lender_confidential" | "legal_title" | "insurance" | "valuation";
  requiresLenderUseAuthorization: boolean;
  reviewerAssignments: FirstEvidenceBatchReviewerAssignment[];
}

export interface FirstEvidenceBatchItem {
  category: FirstEvidenceBatchCategory;
  title: string;
  status: FirstEvidenceBatchStatus;
  priority: FirstEvidenceBatchPriority;
  confidential: boolean;
  classification: FirstEvidenceBatchRequirement["classification"];
  requiresLenderUseAuthorization: boolean;
  reviewerAssignments: FirstEvidenceBatchReviewerAssignment[];
  autoAccepted: false;
  notes: string[];
}

export interface FirstEvidenceBatchReadiness {
  totalItems: number;
  missingCount: number;
  receivedCount: number;
  reviewRequiredCount: number;
  acceptedCount: number;
  blockedCount: number;
  lenderUseAuthorized: boolean;
  lenderReady: boolean;
}

export interface FirstEvidenceBatchResult {
  items: FirstEvidenceBatchItem[];
  readiness: FirstEvidenceBatchReadiness;
  nextBestActions: string[];
  warnings: string[];
}

export interface FirstEvidenceBatchInput {
  statusByCategory?: Partial<Record<FirstEvidenceBatchCategory, FirstEvidenceBatchStatus>>;
  lenderUseAuthorized: boolean;
}
