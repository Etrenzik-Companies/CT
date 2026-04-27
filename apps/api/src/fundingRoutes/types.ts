// ── Funding Routes Matrix — Types ───────────────────────────────────────
// Routes are separated from obligations and evidence gating is mandatory.

export const FUNDING_ROUTE_TYPES = [
  "senior_construction_loan",
  "bridge_loan",
  "mini_perm",
  "permanent_debt",
  "sponsor_equity",
  "preferred_equity",
  "mezzanine_debt",
  "private_credit",
  "grant",
  "utility_rebate",
  "state_tax_credit",
  "federal_tax_credit",
  "federal_tax_deduction",
  "transferable_tax_credit",
  "hotel_local_taxes_obligation",
  "tax_abatement",
  "tif",
  "economic_development_bond",
  "redevelopment_support",
  "cpace_monitor_only",
  "brownfield_funding",
  "workforce_training_grant",
  "equipment_financing",
  "ff_and_e_financing",
  "receivable_financing",
  "rwa_private_credit",
  "rwa_private_equity",
  "xrpl_proof_reference",
  "tokenized_security_review_only",
] as const;

export type FundingRouteType = (typeof FUNDING_ROUTE_TYPES)[number];

export const FUNDING_STAGE_VALUES = ["estimated", "submitted", "awarded", "verified", "obligation_only", "not_counted"] as const;
export type FundingStageValue = (typeof FUNDING_STAGE_VALUES)[number];

export interface FundingRouteRequirement {
  id: string;
  label: string;
  required: boolean;
  satisfied: boolean;
}

export interface FundingRouteDefinition {
  id: FundingRouteType;
  label: string;
  description: string;
  fundsUse: string;
  approvalAuthority: string;
  requiredDocuments: string[];
  riskNotes: string[];
  blockingConditions: string[];
  countsAsVerifiedFundsWhenSatisfied: boolean;
}

export interface FundingRouteInput {
  routeId: FundingRouteType;
  stage: FundingStageValue;
  amount: number;
  hasAwardLetter: boolean;
  hasTaxAccountingMemo: boolean;
  hasLegalMemo: boolean;
  hasPublicBodyApproval: boolean;
  hasLocalAuthorization: boolean;
  hasLenderConsent: boolean;
  evidence: Record<string, boolean>;
}

export interface FundingRouteAssessment {
  routeId: FundingRouteType;
  label: string;
  stage: FundingStageValue;
  amount: number;
  status: "lender_ready" | "needs_review" | "blocked" | "obligation_only";
  countsAsVerifiedFunds: boolean;
  missingRequirements: string[];
  nextBestAction: string;
  risks: string[];
  explanation: string;
}

export interface FundingRouteMatrixResult {
  assessments: FundingRouteAssessment[];
  totals: {
    verifiedFunding: number;
    estimatedFunding: number;
    obligations: number;
    awardedFunding: number;
    submittedFunding: number;
    notCounted: number;
  };
  blockedCount: number;
  nextBestActions: string[];
}
