// ── XRPL Readiness Engine ─────────────────────────────────────────────────
// SIMULATION AND DOCUMENTATION ONLY.
// No live XRPL execution. All actions are classified as simulated or
// approval-required. Legal, securities, and compliance review is required
// before any real-world XRPL operations.

import type {
  XrplActionSimulation,
  XrplActionType,
  XrplAssetClass,
  XrplAssetReference,
  XrplComplianceWarning,
  XrplSettlementReadiness,
} from "./types.js";

const ALWAYS_APPROVAL_REQUIRED: XrplActionType[] = [
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
];

const STANDARD_COMPLIANCE_WARNINGS: XrplComplianceWarning[] = [
  {
    code: "no_investment_advice",
    message: "This output is not investment advice. No returns, appreciation, or performance are implied.",
  },
  {
    code: "no_price_guarantee",
    message: "No price guarantee is provided for any referenced asset or token.",
  },
  {
    code: "no_custody_guarantee",
    message: "No custody guarantee is provided. Consult a qualified custodian.",
  },
  {
    code: "no_redemption_guarantee",
    message: "No redemption guarantee unless backed by executed legal documentation.",
  },
  {
    code: "securities_review_required",
    message: "Any tokenization of real assets may constitute a securities offering. Legal counsel required.",
  },
  {
    code: "legal_counsel_required",
    message: "All XRPL issuer, trustline, and settlement steps require legal and compliance review.",
  },
];

function classifyAsset(ref: XrplAssetReference): XrplAssetClass {
  if (ref.evidenceIds.length === 0) return "blocked";
  if (!ref.proposedCurrencyCode && !ref.proposedIssuerLabel) return "documentation_only";
  if (ref.proposedCurrencyCode && !ref.proposedIssuerLabel) return "proof_reference";
  if (ref.proposedCurrencyCode && ref.proposedIssuerLabel) return "settlement_reference";
  return "documentation_only";
}

function simulateAction(actionType: XrplActionType): XrplActionSimulation {
  const isBlocked = ALWAYS_APPROVAL_REQUIRED.includes(actionType);
  return {
    actionType,
    status: isBlocked ? "approval_required" : "simulated",
    approvalRequiredReason: isBlocked
      ? `${actionType} requires human approval, legal review, and compliance sign-off before execution`
      : "Simulation only — no action taken",
    complianceWarnings: [
      {
        code: "live_action_blocked",
        message: `Live ${actionType} is blocked. This is a simulation only.`,
      },
      {
        code: "approval_required",
        message: `Human and legal approval required before ${actionType} can proceed.`,
      },
    ],
  };
}

export function assessXrplReadiness(ref: XrplAssetReference): XrplSettlementReadiness {
  const assetClass = classifyAsset(ref);
  const blockedReasons: string[] = [];

  if (assetClass === "blocked") {
    blockedReasons.push("No evidence IDs attached — asset cannot proceed to any XRPL layer");
  }
  if (assetClass === "tokenization_candidate" || ref.proposedIssuerLabel) {
    blockedReasons.push("Tokenization requires securities/legal review and compliance approval");
    blockedReasons.push("Issuer setup is blocked pending human approval");
  }

  const simulatedActions: XrplActionSimulation[] = ALWAYS_APPROVAL_REQUIRED.map(simulateAction);

  const reviewNotes = [
    "SIMULATION ONLY — no XRPL transactions have been created or submitted.",
    "No wallets, tokens, trustlines, escrows, or payments have been created.",
    "All XRPL operations require human approval, legal review, and compliance sign-off.",
    "Tokenization of real-world assets may be subject to securities laws. Consult qualified legal counsel.",
    "This output is for internal documentation and diligence purposes only.",
  ];

  return {
    rwaAssetId: ref.rwaAssetId,
    assetClass,
    assetReference: ref,
    issuerProfile:
      ref.proposedIssuerLabel
        ? {
            issuerLabel: ref.proposedIssuerLabel,
            walletType: "approval_required",
            requiresLegalReview: true,
            requiresSecuritiesReview: true,
            requiresComplianceApproval: true,
          }
        : undefined,
    trustlinePolicy:
      ref.proposedCurrencyCode && ref.proposedIssuerLabel
        ? {
            currencyCode: ref.proposedCurrencyCode,
            issuerLabel: ref.proposedIssuerLabel,
            requiresHumanApproval: true,
            blockedUntilLegalReview: true,
          }
        : undefined,
    complianceWarnings: STANDARD_COMPLIANCE_WARNINGS,
    simulatedActions,
    blockedReasons,
    reviewNotes,
  };
}
