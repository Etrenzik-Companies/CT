// ── Lender Packet Builder — Types ────────────────────────────────────────
// Lender-ready status requires reviewed evidence, resolved funding gaps, and human approvals.

import type { EvidenceDocumentType, EvidenceReviewResult } from "../evidence/types.js";
import type { IncentiveEvidenceStatus } from "../incentiveEvidence/types.js";

export const LENDER_PACKET_SECTION_KEYS = [
  "executive_summary",
  "sponsor_profile",
  "project_overview",
  "rwa_asset_summary",
  "capital_stack",
  "proof_of_funds",
  "construction_budget",
  "contractor_bids",
  "appraisal_title_insurance",
  "tax_incentives",
  "esg_green_financing",
  "permits_compliance",
  "xrpl_proof_references",
  "risk_register",
  "human_approval_log",
] as const;

export type LenderPacketSectionKey = (typeof LENDER_PACKET_SECTION_KEYS)[number];

export const LENDER_SUBMISSION_STATUSES = ["draft", "internally_ready", "not_lender_ready", "lender_ready", "blocked"] as const;
export type LenderSubmissionStatus = (typeof LENDER_SUBMISSION_STATUSES)[number];

export interface LenderUseAuthorization {
  lenderName: string;
  authorizedAmount: number;
  currency: string;
  evidenceId?: string;
  expiresAt?: string;
  isApproved: boolean;
}

export interface LenderPacketRequirement {
  id: string;
  section: LenderPacketSectionKey;
  label: string;
  requiredDocumentTypes: EvidenceDocumentType[];
  required: boolean;
}

export interface LenderPacketSection {
  key: LenderPacketSectionKey;
  title: string;
  status: "complete" | "needs_review" | "missing" | "blocked";
  documentIds: string[];
}

export interface LenderPacketGap {
  requirementId: string;
  reason:
    | "missing_evidence"
    | "review_required"
    | "pof_gap_unresolved"
    | "missing_lender_authorization"
    | "blockchain_off_chain_review"
    | "estimated_incentives"
    | "legal_accounting_review_incomplete";
}

export interface LenderPacketReadiness {
  score: number;
  status: LenderSubmissionStatus;
  missingRequiredDocs: string[];
  reviewRequiredDocs: string[];
  blockedReasons: string[];
}

export interface PacketExportSummary {
  totalSections: number;
  completeSections: number;
  blockedSections: number;
}

export interface LenderPacketInput {
  projectId: string;
  projectName: string;
  evidenceReview: EvidenceReviewResult;
  pofCapitalGap: number;
  lenderUseAuthorizations: LenderUseAuthorization[];
  incentiveStatuses: Array<{ incentiveId: string; status: IncentiveEvidenceStatus; countsAsVerifiedFunds: boolean }>;
}

export interface LenderPacket {
  projectId: string;
  projectName: string;
  requirements: LenderPacketRequirement[];
  sections: LenderPacketSection[];
  gaps: LenderPacketGap[];
  readiness: LenderPacketReadiness;
  exportSummary: PacketExportSummary;
}