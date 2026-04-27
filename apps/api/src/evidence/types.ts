// ── Evidence Intake Registry — Types ─────────────────────────────────────
// Evidence records are for diligence and submission preparation only.
// Uploaded files are never accepted automatically; human review is required.

export const EVIDENCE_DOCUMENT_TYPES = [
  "bank_statement",
  "escrow_letter",
  "lender_term_sheet",
  "appraisal",
  "title_report",
  "insurance_certificate",
  "operating_agreement",
  "purchase_agreement",
  "construction_budget",
  "contractor_bid",
  "permit",
  "utility_bill",
  "energy_audit",
  "tax_credit_estimate",
  "rebate_application",
  "grant_application",
  "grant_award",
  "environmental_report",
  "esg_report",
  "xrpl_wallet_reference",
  "blockchain_proof_reference",
  "legal_opinion",
  "accounting_review",
  "other",
] as const;

export type EvidenceDocumentType = (typeof EVIDENCE_DOCUMENT_TYPES)[number];

export const EVIDENCE_STATUSES = [
  "missing",
  "uploaded",
  "classified",
  "needs_review",
  "accepted",
  "rejected",
  "expired",
  "blocked",
] as const;

export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];

export const EVIDENCE_AREAS = ["rwa", "pof", "esg", "incentive", "funding"] as const;
export type EvidenceArea = (typeof EVIDENCE_AREAS)[number];

export const EVIDENCE_REVIEW_ROLES = ["human", "legal", "accounting", "lender", "off_chain"] as const;
export type EvidenceReviewRole = (typeof EVIDENCE_REVIEW_ROLES)[number];

export interface EvidenceSource {
  sourceType: "upload" | "email" | "generated" | "external_reference" | "manual_entry";
  sourceLabel: string;
  sourceId?: string;
  receivedAt: string;
}

export interface EvidenceDocument {
  id: string;
  title: string;
  fileName?: string;
  documentType?: EvidenceDocumentType;
  status: EvidenceStatus;
  uploadedAt: string;
  expiryDate?: string;
  reviewCompletedAt?: string;
  source: EvidenceSource;
  notes?: string;
}

export interface EvidenceRequirement {
  id: string;
  area: EvidenceArea;
  label: string;
  requiredDocumentTypes: EvidenceDocumentType[];
  reviewRoles: EvidenceReviewRole[];
  required: boolean;
}

export interface EvidenceClassification {
  documentId: string;
  documentType: EvidenceDocumentType;
  confidence: "explicit" | "inferred" | "fallback";
  mappedAreas: EvidenceArea[];
  reviewRequired: EvidenceReviewRole[];
  isExpired: boolean;
  isAccepted: boolean;
}

export interface EvidenceGap {
  requirementId: string;
  area: EvidenceArea;
  label: string;
  reason: "missing" | "expired" | "needs_review";
  relatedDocumentIds: string[];
}

export interface EvidenceLink {
  documentId: string;
  requirementId: string;
  area: EvidenceArea;
  linkStatus: "mapped" | "review_required" | "expired";
}

export interface EvidenceReviewInput {
  projectId: string;
  documents: EvidenceDocument[];
}

export interface EvidenceReviewResult {
  projectId: string;
  requirements: EvidenceRequirement[];
  classifications: EvidenceClassification[];
  gaps: EvidenceGap[];
  links: EvidenceLink[];
  acceptedDocuments: string[];
  reviewRequiredDocuments: string[];
  expiredDocuments: string[];
  blockedReasons: string[];
}