// ── Evidence Inbox — Types ───────────────────────────────────────────────
// Evidence intake metadata only. No raw file content is stored here.
// Uploaded does NOT mean accepted. Accepted requires human review.

export const EVIDENCE_FILE_TYPES = [
  "pdf",
  "image",
  "spreadsheet",
  "word_document",
  "email",
  "text",
  "unknown",
] as const;
export type EvidenceFileType = (typeof EVIDENCE_FILE_TYPES)[number];

export const EVIDENCE_SOURCE_TYPES = [
  "user_upload",
  "internal_file",
  "lender_request",
  "contractor_submission",
  "government_source",
  "utility_source",
  "tax_accounting_source",
  "legal_source",
  "blockchain_reference",
  "other",
] as const;
export type EvidenceSourceType = (typeof EVIDENCE_SOURCE_TYPES)[number];

export const EVIDENCE_CLASSIFICATION_STATUSES = [
  "unclassified",
  "classified",
  "reclassified",
  "unrecognized",
] as const;
export type EvidenceClassificationStatus =
  (typeof EVIDENCE_CLASSIFICATION_STATUSES)[number];

export const EVIDENCE_REVIEW_STATUSES = [
  "received",
  "classified",
  "mapped",
  "needs_review",
  "accepted",
  "rejected",
  "expired",
  "blocked",
] as const;
export type EvidenceReviewStatus = (typeof EVIDENCE_REVIEW_STATUSES)[number];

export const EVIDENCE_SECURITY_LEVELS = [
  "public",
  "internal",
  "confidential",
  "financial",
  "legal",
  "tax",
  "identity_sensitive",
  "secret_prohibited",
] as const;
export type EvidenceSecurityLevel = (typeof EVIDENCE_SECURITY_LEVELS)[number];

export const EVIDENCE_MAPPING_TARGETS = [
  "contractorMatrix",
  "fundingRoutes",
  "rwaFundingRoutes",
  "lenderPacket",
  "incentives",
  "indianaPrograms",
  "pof",
  "esg",
  "permits",
  "codeCompliance",
] as const;
export type EvidenceMappingTarget = (typeof EVIDENCE_MAPPING_TARGETS)[number];

/** Metadata submitted by the caller. No raw file bytes are stored. */
export interface EvidenceInboxItem {
  id: string;
  filename: string;
  fileType: EvidenceFileType;
  source: EvidenceSourceType;
  /** Free-text label provided by the submitter. */
  submittedLabel: string;
  /** Optional keywords/patterns detected in the filename or provided label. */
  detectedKeywords?: string[];
  /** Size in bytes — metadata only. */
  sizeBytes?: number;
  submittedAt: string; // ISO 8601
}

export interface EvidenceIntakeResult {
  id: string;
  filename: string;
  fileType: EvidenceFileType;
  source: EvidenceSourceType;
  classificationStatus: EvidenceClassificationStatus;
  reviewStatus: EvidenceReviewStatus;
  securityLevel: EvidenceSecurityLevel;
  suggestedMappingTargets: EvidenceMappingTarget[];
  /** True when the item contains patterns that look like secrets. BLOCKED. */
  secretDetected: boolean;
  secretBlockers: string[];
  /** Warnings that do not block intake but require attention. */
  warnings: string[];
  /** Intake is always received — NEVER auto-accepted. */
  autoAccepted: false;
  nextAction: string;
}
