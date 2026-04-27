// ── RWA Funding Routes — Types ──────────────────────────────────────────
// Routes in this module are documentation and compliance oriented.

export const RWA_ROUTE_TYPES = [
  "asset_registry_only",
  "evidence_backed_lender_packet",
  "proof_of_funds_reference",
  "proof_of_ownership_reference",
  "document_hash_attestation",
  "xrpl_wallet_reference",
  "xrpl_issued_asset_review",
  "private_credit_rwa_package",
  "private_equity_rwa_package",
  "tokenized_security_legal_review",
  "settlement_reference_only",
  "blocked_live_transaction",
] as const;

export type RwaRouteType = (typeof RWA_ROUTE_TYPES)[number];

export interface RwaRouteInput {
  routeId: RwaRouteType;
  legalReviewComplete: boolean;
  complianceReviewComplete: boolean;
  humanApprovalComplete: boolean;
  requestedLiveExecution: boolean;
  evidence: Record<string, boolean>;
}

export interface RwaRouteDefinition {
  id: RwaRouteType;
  description: string;
  allowedUse: string;
  prohibitedUse: string[];
  requiredEvidence: string[];
  lenderRelevance: "low" | "medium" | "high";
  riskLevel: "low" | "medium" | "high";
}

export interface RwaRouteAssessment {
  routeId: RwaRouteType;
  status: "allowed" | "needs_review" | "approval_required" | "blocked";
  description: string;
  allowedUse: string;
  prohibitedUse: string[];
  requiredEvidence: string[];
  missingEvidence: string[];
  legalComplianceRequired: boolean;
  lenderRelevance: "low" | "medium" | "high";
  riskLevel: "low" | "medium" | "high";
  countsAsSpendableFunding: false;
  notes: string[];
}

export interface RwaFundingRoutesResult {
  assessments: RwaRouteAssessment[];
  blockedCount: number;
  approvalRequiredCount: number;
  nextBestActions: string[];
}
