// ── XRPL Readiness Layer — Types ───────────────────────────────────────────
// SIMULATION AND DOCUMENTATION ONLY.
// No live XRPL transactions, wallet generation, token issuance, trustline
// changes, escrow, DEX operations, or payments are executed here.
// All outputs require human/legal/compliance review before any real action.

export const XRPL_ASSET_CLASSES = [
  "documentation_only",
  "settlement_reference",
  "proof_reference",
  "tokenization_candidate",
  "blocked",
] as const;

export type XrplAssetClass = (typeof XRPL_ASSET_CLASSES)[number];

export const XRPL_ACTION_TYPES = [
  "issuer_setup",
  "trustline_change",
  "token_issuance",
  "escrow",
  "dex_trade",
  "payment",
  "wallet_generation",
  "account_set",
  "offer_create",
  "offer_cancel",
  "check_create",
] as const;

export type XrplActionType = (typeof XRPL_ACTION_TYPES)[number];

export const XRPL_COMPLIANCE_WARNING_CODES = [
  "no_investment_advice",
  "no_price_guarantee",
  "no_custody_guarantee",
  "no_redemption_guarantee",
  "securities_review_required",
  "legal_counsel_required",
  "live_action_blocked",
  "approval_required",
] as const;

export type XrplComplianceWarningCode = (typeof XRPL_COMPLIANCE_WARNING_CODES)[number];

export interface XrplAssetReference {
  rwaAssetId: string;
  assetName: string;
  proposedCurrencyCode?: string; // 3-char or hex — for documentation only
  proposedIssuerLabel?: string;
  evidenceIds: string[];
}

export interface XrplIssuerProfile {
  issuerLabel: string;
  walletType: "documentation_only" | "approval_required";
  requiresLegalReview: true;
  requiresSecuritiesReview: true;
  requiresComplianceApproval: true;
}

export interface XrplTrustlinePolicy {
  currencyCode: string;
  issuerLabel: string;
  requiresHumanApproval: true;
  blockedUntilLegalReview: true;
}

export interface XrplComplianceWarning {
  code: XrplComplianceWarningCode;
  message: string;
}

export interface XrplActionSimulation {
  actionType: XrplActionType;
  status: "simulated" | "approval_required" | "blocked";
  approvalRequiredReason: string;
  complianceWarnings: XrplComplianceWarning[];
}

export interface XrplSettlementReadiness {
  rwaAssetId: string;
  assetClass: XrplAssetClass;
  assetReference: XrplAssetReference;
  issuerProfile?: XrplIssuerProfile;
  trustlinePolicy?: XrplTrustlinePolicy;
  complianceWarnings: XrplComplianceWarning[];
  simulatedActions: XrplActionSimulation[];
  blockedReasons: string[];
  reviewNotes: string[];
}
