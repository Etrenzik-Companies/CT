import type {
  RwaFundingRoutesResult,
  RwaRouteAssessment,
  RwaRouteDefinition,
  RwaRouteInput,
} from "./types.js";

const ROUTES: RwaRouteDefinition[] = [
  {
    id: "asset_registry_only",
    description: "Asset metadata and evidence index route.",
    allowedUse: "Documentation and diligence indexing.",
    prohibitedUse: ["No live issuance", "No live payments", "No redemption promises"],
    requiredEvidence: ["asset_registry", "title_docs"],
    lenderRelevance: "medium",
    riskLevel: "low",
  },
  {
    id: "evidence_backed_lender_packet",
    description: "Structured lender packet with evidence references.",
    allowedUse: "Lender diligence support.",
    prohibitedUse: ["No investment offer", "No token sale", "No custody claim"],
    requiredEvidence: ["pof_packet", "title_docs", "permit_status"],
    lenderRelevance: "high",
    riskLevel: "medium",
  },
  {
    id: "proof_of_funds_reference",
    description: "Reference-only proof-of-funds linkage.",
    allowedUse: "Evidence pointer.",
    prohibitedUse: ["Not spendable funding", "No draw disbursement instruction"],
    requiredEvidence: ["bank_evidence", "authorization_letter"],
    lenderRelevance: "medium",
    riskLevel: "medium",
  },
  {
    id: "proof_of_ownership_reference",
    description: "Ownership evidence referencing.",
    allowedUse: "Title and ownership tracing.",
    prohibitedUse: ["No transfer execution", "No legal conclusion without counsel"],
    requiredEvidence: ["deed", "title_commitment"],
    lenderRelevance: "high",
    riskLevel: "medium",
  },
  {
    id: "document_hash_attestation",
    description: "Hash attestation and audit trail route.",
    allowedUse: "Integrity proof of documents.",
    prohibitedUse: ["No cash-equivalent claim", "No issuance claim"],
    requiredEvidence: ["hash_record", "source_document"],
    lenderRelevance: "low",
    riskLevel: "low",
  },
  {
    id: "xrpl_wallet_reference",
    description: "Wallet reference mapping.",
    allowedUse: "Identity and reference metadata.",
    prohibitedUse: ["No custody claim", "No payment execution"],
    requiredEvidence: ["wallet_ownership_proof", "legal_review"],
    lenderRelevance: "low",
    riskLevel: "medium",
  },
  {
    id: "xrpl_issued_asset_review",
    description: "Issued-asset legal/compliance review route.",
    allowedUse: "Design review only.",
    prohibitedUse: ["No live issuance", "No trustline changes", "No DEX activity"],
    requiredEvidence: ["legal_memo", "compliance_memo", "human_approval_log"],
    lenderRelevance: "low",
    riskLevel: "high",
  },
  {
    id: "private_credit_rwa_package",
    description: "Private credit RWA package assembly.",
    allowedUse: "Private lender diligence workflows.",
    prohibitedUse: ["No public offering", "No security token issuance"],
    requiredEvidence: ["risk_disclosure", "capital_stack", "legal_memo"],
    lenderRelevance: "high",
    riskLevel: "medium",
  },
  {
    id: "private_equity_rwa_package",
    description: "Private equity RWA package assembly.",
    allowedUse: "Private diligence and negotiation support.",
    prohibitedUse: ["No public solicitation", "No tokenized securities sale"],
    requiredEvidence: ["offering_controls", "legal_memo", "tax_memo"],
    lenderRelevance: "medium",
    riskLevel: "medium",
  },
  {
    id: "tokenized_security_legal_review",
    description: "Tokenized security legal review path.",
    allowedUse: "Counsel-led analysis only.",
    prohibitedUse: ["No launch", "No distribution", "No live market activity"],
    requiredEvidence: ["securities_counsel_memo", "investor_controls", "kyc_aml_controls"],
    lenderRelevance: "low",
    riskLevel: "high",
  },
  {
    id: "settlement_reference_only",
    description: "Settlement reference and audit marker route.",
    allowedUse: "Reference metadata.",
    prohibitedUse: ["No payment rail", "No escrow execution"],
    requiredEvidence: ["off_chain_settlement_record"],
    lenderRelevance: "low",
    riskLevel: "medium",
  },
  {
    id: "blocked_live_transaction",
    description: "Explicitly blocked route for live transaction execution.",
    allowedUse: "None without dedicated legal and compliance approval flow.",
    prohibitedUse: ["No live issuance", "No trustline changes", "No DEX", "No escrow", "No payment execution"],
    requiredEvidence: ["legal_memo", "compliance_memo", "human_approval_log"],
    lenderRelevance: "low",
    riskLevel: "high",
  },
];

const ROUTE_MAP = new Map(ROUTES.map((route) => [route.id, route]));

function evaluate(input: RwaRouteInput): RwaRouteAssessment {
  const route = ROUTE_MAP.get(input.routeId);
  if (!route) {
    return {
      routeId: input.routeId,
      status: "blocked",
      description: "Unknown route",
      allowedUse: "None",
      prohibitedUse: ["Unknown route is blocked"],
      requiredEvidence: [],
      missingEvidence: ["route definition"],
      legalComplianceRequired: true,
      lenderRelevance: "low",
      riskLevel: "high",
      countsAsSpendableFunding: false,
      notes: ["Route is undefined."],
    };
  }

  const missingEvidence = route.requiredEvidence.filter((item) => !input.evidence[item]);
  const legalComplianceRequired = route.riskLevel !== "low" || route.id.includes("legal") || route.id.includes("xrpl");

  let status: RwaRouteAssessment["status"] = "needs_review";
  if (route.id === "blocked_live_transaction" || input.requestedLiveExecution) {
    status = "blocked";
  } else if (missingEvidence.length > 0) {
    status = "needs_review";
  } else if (legalComplianceRequired && (!input.legalReviewComplete || !input.complianceReviewComplete || !input.humanApprovalComplete)) {
    status = "approval_required";
  } else {
    status = "allowed";
  }

  return {
    routeId: route.id,
    status,
    description: route.description,
    allowedUse: route.allowedUse,
    prohibitedUse: route.prohibitedUse,
    requiredEvidence: route.requiredEvidence,
    missingEvidence,
    legalComplianceRequired,
    lenderRelevance: route.lenderRelevance,
    riskLevel: route.riskLevel,
    countsAsSpendableFunding: false,
    notes: [
      "RWA and XRPL routes in this module are non-spendable evidence/compliance paths.",
      "Live execution remains blocked unless separately approved by legal/compliance controls.",
    ],
  };
}

export function assessRwaFundingRoutes(inputs: RwaRouteInput[]): RwaFundingRoutesResult {
  const assessments = inputs.map(evaluate);
  return {
    assessments,
    blockedCount: assessments.filter((item) => item.status === "blocked").length,
    approvalRequiredCount: assessments.filter((item) => item.status === "approval_required").length,
    nextBestActions: [
      "Complete legal/compliance/human approvals for high-risk RWA routes.",
      "Do not treat any RWA/XRPL reference route as spendable funding.",
      "Keep live XRPL transaction paths blocked unless an explicit approved workflow is added.",
    ],
  };
}

export function getRwaFundingRouteCatalog(): RwaRouteDefinition[] {
  return ROUTES;
}
