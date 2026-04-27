// ── Evidence Mapping — Types ─────────────────────────────────────────────
// Maps evidence files to specific requirements across all modules.
// Mapping does NOT constitute acceptance. Human review is always required.

export const REQUIREMENT_IDS = [
  "gc_insurance",
  "gc_bid",
  "gc_license",
  "gc_scope_of_work",
  "gc_w9",
  "trade_license",
  "trade_scope",
  "trade_bid",
  "trade_w9",
  "appraisal",
  "title_search",
  "survey",
  "permit_set",
  "zoning_confirmation",
  "utility_confirmation",
  "bank_statement",
  "escrow_letter",
  "lender_term_sheet",
  "grant_award_letter",
  "tax_credit_estimate",
  "energy_model",
  "certification_179d",
  "equipment_specs_48e",
  "ev_charging_specs",
  "bond_tif_public_body_approval",
  "city_county_support_letter",
  "legal_memo",
  "tax_memo",
  "accounting_memo",
  "human_approval_log",
  "pof_document",
  "rwa_legal_review",
  "xrpl_proof_reference",
  "esg_certification",
  "code_compliance_report",
  "fire_life_safety_report",
] as const;
export type RequirementId = (typeof REQUIREMENT_IDS)[number];

export const MAPPING_CONFIDENCE_LEVELS = ["high", "medium", "low", "manual_required"] as const;
export type MappingConfidenceLevel = (typeof MAPPING_CONFIDENCE_LEVELS)[number];

export const MAPPING_REVIEW_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "needs_clarification",
  "expired",
] as const;
export type MappingReviewStatus = (typeof MAPPING_REVIEW_STATUSES)[number];

export interface EvidenceMappingInput {
  evidenceId: string;
  filename: string;
  submittedLabel: string;
  fileType: string;
  detectedKeywords?: string[];
}

export interface EvidenceMappingResult {
  evidenceId: string;
  requirementId: RequirementId;
  targetModule: string;
  confidence: MappingConfidenceLevel;
  reviewStatus: MappingReviewStatus;
  missingFields: string[];
  blockers: string[];
  nextAction: string;
}

export interface EvidenceMappingReport {
  evidenceId: string;
  filename: string;
  mappings: EvidenceMappingResult[];
  unmappedWarning: boolean;
}
