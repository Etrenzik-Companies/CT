// ── Incentive Evidence Mapping — Types ───────────────────────────────────
// Incentive values must be separated into estimated, submitted, awarded, and verified.
// Estimated incentive values never count as verified funds.

import type { EvidenceDocument } from "../evidence/types.js";

export const INCENTIVE_EVIDENCE_STATUSES = [
  "estimated",
  "application_ready",
  "submitted",
  "awarded",
  "verified",
  "rejected",
  "expired",
] as const;

export type IncentiveEvidenceStatus = (typeof INCENTIVE_EVIDENCE_STATUSES)[number];

export interface IncentiveEvidenceRequirement {
  id: string;
  label:
    | "tax_credit_estimate"
    | "rebate_application"
    | "grant_application"
    | "utility_documentation"
    | "energy_audit"
    | "contractor_scope"
    | "equipment_specification"
    | "proof_of_installation"
    | "owner_eligibility_docs"
    | "accounting_review";
  requiredFor: "application_ready" | "submitted" | "awarded" | "verified";
}

export interface IncentiveEvidenceInput {
  projectId: string;
  incentiveId: string;
  incentiveName: string;
  estimatedValue: number;
  documents: EvidenceDocument[];
}

export interface IncentiveEvidenceResult {
  projectId: string;
  incentiveId: string;
  incentiveName: string;
  status: IncentiveEvidenceStatus;
  requirements: IncentiveEvidenceRequirement[];
  missingRequirements: string[];
  reviewRequiredDocumentIds: string[];
  countsAsVerifiedFunds: boolean;
  reviewNotes: string[];
}