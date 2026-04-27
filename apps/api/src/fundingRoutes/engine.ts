import type {
  FundingRouteAssessment,
  FundingRouteDefinition,
  FundingRouteInput,
  FundingRouteMatrixResult,
} from "./types.js";

const ROUTES: FundingRouteDefinition[] = [
  {
    id: "senior_construction_loan",
    label: "Senior Construction Loan",
    description: "Primary lender debt for construction.",
    fundsUse: "Hard/soft construction costs",
    approvalAuthority: "Lender credit committee",
    requiredDocuments: ["appraisal", "budget", "permits", "gc_package", "equity_proof"],
    riskNotes: ["Will not close without permits, title, and equity evidence."],
    blockingConditions: ["missing appraisal", "missing permits", "missing GC package"],
    countsAsVerifiedFundsWhenSatisfied: true,
  },
  {
    id: "bridge_loan",
    label: "Bridge Loan",
    description: "Short-term debt to bridge timing gaps.",
    fundsUse: "Interim coverage",
    approvalAuthority: "Bridge lender",
    requiredDocuments: ["term_sheet", "exit_strategy", "collateral"],
    riskNotes: ["High pricing and refinance risk."],
    blockingConditions: ["missing exit strategy"],
    countsAsVerifiedFundsWhenSatisfied: true,
  },
  {
    id: "sponsor_equity",
    label: "Sponsor Equity",
    description: "Sponsor contributed capital.",
    fundsUse: "Base equity stack",
    approvalAuthority: "Sponsor/investor subscription",
    requiredDocuments: ["bank_or_escrow_proof", "operating_agreement"],
    riskNotes: ["Pledged but unverified capital does not count."],
    blockingConditions: ["missing bank/escrow evidence"],
    countsAsVerifiedFundsWhenSatisfied: true,
  },
  {
    id: "grant",
    label: "Grant",
    description: "Federal/state/local grant support.",
    fundsUse: "Program-specific scope",
    approvalAuthority: "Grant authority",
    requiredDocuments: ["application", "award_letter", "program_terms"],
    riskNotes: ["Application and submission are not equivalent to awarded cash."],
    blockingConditions: ["missing award letter"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "state_tax_credit",
    label: "State Tax Credit",
    description: "State incentive credit path.",
    fundsUse: "Tax liability reduction if monetizable",
    approvalAuthority: "State agency + tax advisor",
    requiredDocuments: ["program_approval", "tax_memo"],
    riskNotes: ["Estimated value never counts as verified funds."],
    blockingConditions: ["missing tax/accounting review"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "federal_tax_credit",
    label: "Federal Tax Credit",
    description: "Federal clean-energy or qualifying tax credit.",
    fundsUse: "Tax-equity/transferability pathway",
    approvalAuthority: "IRS rules + tax advisor",
    requiredDocuments: ["eligible_scope_docs", "tax_memo"],
    riskNotes: ["Requires legal and tax/accounting treatment."],
    blockingConditions: ["missing tax/accounting review"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "federal_tax_deduction",
    label: "Federal Tax Deduction",
    description: "Federal deduction such as 179D.",
    fundsUse: "Tax efficiency only",
    approvalAuthority: "IRS rules + tax advisor",
    requiredDocuments: ["certification", "tax_memo"],
    riskNotes: ["Deduction is not direct project cash."],
    blockingConditions: ["missing tax memo"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "hotel_local_taxes_obligation",
    label: "Hotel + Local Taxes (Obligation)",
    description: "Hotel and local tax obligations that must be paid but are not a funding source.",
    fundsUse: "Obligation only",
    approvalAuthority: "Jurisdictional tax authority",
    requiredDocuments: ["tax_memo"],
    riskNotes: ["Tax obligations cannot be counted as spendable funding."],
    blockingConditions: ["treated as funding"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "tif",
    label: "Tax Increment Financing",
    description: "Public finance tied to incremental taxes.",
    fundsUse: "Eligible public/redevelopment improvements",
    approvalAuthority: "Public body",
    requiredDocuments: ["public_body_approval", "tif_analysis"],
    riskNotes: ["Potential until formally approved and structured."],
    blockingConditions: ["missing public-body approval"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "economic_development_bond",
    label: "Economic Development Bond",
    description: "Conduit/public bond financing route.",
    fundsUse: "Public-interest or eligible economic development scope",
    approvalAuthority: "Public body + bond counsel",
    requiredDocuments: ["public_body_approval", "bond_counsel_memo"],
    riskNotes: ["Complex legal and repayment structure."],
    blockingConditions: ["missing public-body approval"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "cpace_monitor_only",
    label: "C-PACE (Monitor Only)",
    description: "Assessment-based clean-energy finance where authorized.",
    fundsUse: "Energy improvements",
    approvalAuthority: "Local authorization + lender consent",
    requiredDocuments: ["local_authorization", "lender_consent"],
    riskNotes: ["Monitor-only unless both authorization and consent exist."],
    blockingConditions: ["missing local authorization", "missing lender consent"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "xrpl_proof_reference",
    label: "XRPL Proof Reference",
    description: "Proof/reference layer only.",
    fundsUse: "Evidence traceability",
    approvalAuthority: "Human/legal/compliance review",
    requiredDocuments: ["legal_memo", "human_approval_log"],
    riskNotes: ["Not a spendable funding source."],
    blockingConditions: ["treated as funding"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
  {
    id: "tokenized_security_review_only",
    label: "Tokenized Security (Review Only)",
    description: "Legal review route for potential securities structure.",
    fundsUse: "Structuring review only",
    approvalAuthority: "Securities counsel",
    requiredDocuments: ["securities_counsel_memo", "legal_memo"],
    riskNotes: ["Requires securities-law compliance analysis."],
    blockingConditions: ["missing legal review"],
    countsAsVerifiedFundsWhenSatisfied: false,
  },
];

const ROUTE_MAP = new Map(ROUTES.map((route) => [route.id, route]));

function findMissing(input: FundingRouteInput, requiredDocs: string[]): string[] {
  return requiredDocs.filter((doc) => !input.evidence[doc]);
}

function assess(input: FundingRouteInput): FundingRouteAssessment {
  const route = ROUTE_MAP.get(input.routeId);
  if (!route) {
    return {
      routeId: input.routeId,
      label: input.routeId,
      stage: input.stage,
      amount: input.amount,
      status: "blocked",
      countsAsVerifiedFunds: false,
      missingRequirements: ["unknown route"],
      nextBestAction: "Map route definition before using in lender stack.",
      risks: ["Unknown route configuration."],
      explanation: "Route is undefined.",
    };
  }

  const missing = findMissing(input, route.requiredDocuments);
  let status: FundingRouteAssessment["status"] = "needs_review";
  let countsAsVerifiedFunds = false;

  const obligationOnlyRoute = route.id === "xrpl_proof_reference" || route.id === "hotel_local_taxes_obligation";
  if (obligationOnlyRoute) status = "obligation_only";

  if (route.id === "grant" && !input.hasAwardLetter) {
    missing.push("award_letter");
  }

  if (["state_tax_credit", "federal_tax_credit", "federal_tax_deduction", "transferable_tax_credit"].includes(route.id) && !input.hasTaxAccountingMemo) {
    missing.push("tax/accounting review");
  }

  if (["tokenized_security_review_only", "xrpl_proof_reference"].includes(route.id) && !input.hasLegalMemo) {
    missing.push("legal review");
  }

  if (["tif", "economic_development_bond", "redevelopment_support", "tax_abatement"].includes(route.id) && !input.hasPublicBodyApproval) {
    missing.push("public-body approval");
  }

  if (route.id === "cpace_monitor_only") {
    if (!input.hasLocalAuthorization) missing.push("local authorization");
    if (!input.hasLenderConsent) missing.push("lender consent");
  }

  if (input.stage === "obligation_only") {
    status = "obligation_only";
    countsAsVerifiedFunds = false;
  } else if (missing.length > 0) {
    status = "blocked";
  } else if (input.stage === "verified" && route.countsAsVerifiedFundsWhenSatisfied) {
    status = "lender_ready";
    countsAsVerifiedFunds = true;
  } else {
    status = "needs_review";
  }

  if (input.stage === "estimated") countsAsVerifiedFunds = false;
  if (route.id === "xrpl_proof_reference") countsAsVerifiedFunds = false;

  return {
    routeId: route.id,
    label: route.label,
    stage: input.stage,
    amount: input.amount,
    status,
    countsAsVerifiedFunds,
    missingRequirements: [...new Set(missing)],
    nextBestAction: missing.length > 0 ? `Provide: ${[...new Set(missing)].join(", ")}` : "Advance route to lender packet with reviewed evidence.",
    risks: route.riskNotes,
    explanation: `${route.description} Approval authority: ${route.approvalAuthority}.`,
  };
}

export function assessFundingRoutes(routes: FundingRouteInput[]): FundingRouteMatrixResult {
  const assessments = routes.map(assess);

  const totals = {
    verifiedFunding: assessments.filter((item) => item.countsAsVerifiedFunds).reduce((sum, item) => sum + item.amount, 0),
    estimatedFunding: assessments.filter((item) => item.stage === "estimated").reduce((sum, item) => sum + item.amount, 0),
    obligations: assessments.filter((item) => item.status === "obligation_only").reduce((sum, item) => sum + item.amount, 0),
    awardedFunding: assessments.filter((item) => item.stage === "awarded").reduce((sum, item) => sum + item.amount, 0),
    submittedFunding: assessments.filter((item) => item.stage === "submitted").reduce((sum, item) => sum + item.amount, 0),
    notCounted: assessments.filter((item) => !item.countsAsVerifiedFunds).reduce((sum, item) => sum + item.amount, 0),
  };

  return {
    assessments,
    totals,
    blockedCount: assessments.filter((item) => item.status === "blocked").length,
    nextBestActions: [
      "Move blocked routes to evidence-complete state before counting in lender readiness.",
      "Keep obligations and proof-reference routes outside spendable-funding totals.",
      "Obtain legal/tax/public-body approvals for special routes before monetization assumptions.",
    ],
  };
}

export function getFundingRouteCatalog(): FundingRouteDefinition[] {
  return ROUTES;
}
