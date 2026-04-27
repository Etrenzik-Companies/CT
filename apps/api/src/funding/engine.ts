// ── Funding Intelligence — Engine ─────────────────────────────────────────
// For documentation and diligence purposes only.
// Not financial advice. All program matches are potential only.
// Committed = contractually documented; potential = preliminary match.

import type {
  FundingIntelligenceResult,
  FundingMatchResult,
  FundingProgram,
  FundingReadinessStatus,
  ReadinessScore,
  SubmissionPacket,
} from "./types.js";

// ── Built-in program catalog ──────────────────────────────────────────────
export const BUILTIN_FUNDING_PROGRAMS: FundingProgram[] = [
  {
    id: "construction-loan-regional",
    name: "Regional Bank Construction Loan",
    programType: "construction_loan",
    lenderOrSource: "Regional Commercial Bank (illustrative)",
    jurisdiction: "national",
    minProjectCost: 5_000_000,
    maxProjectCost: 100_000_000,
    minLtvRatio: 0.55,
    maxLtvRatio: 0.80,
    typicalRate: "SOFR + 200–350 bps (indicative only — not a quote)",
    typicalTerm: "18–36 months construction period",
    description:
      "Senior secured construction loan covering hard and soft costs. Typical for ground-up commercial and mixed-use projects.",
    requirements: [
      { requirementType: "appraisal", description: "As-built appraisal (FIRREA compliant)", met: "unknown" },
      { requirementType: "sponsor_equity", description: "20–35% sponsor equity injection", met: "unknown" },
      { requirementType: "general_contractor", description: "Licensed GC with bonding", met: "unknown" },
      { requirementType: "title_insurance", description: "Title insurance and title report", met: "unknown" },
      { requirementType: "pof", description: "Verified proof of funds for equity", met: "unknown" },
      { requirementType: "permits", description: "Building permits issued or ready to issue", met: "unknown" },
    ],
    isPotential: true,
  },
  {
    id: "bridge-loan-hard-money",
    name: "Bridge / Hard Money Loan",
    programType: "bridge_loan",
    lenderOrSource: "Private Credit / Bridge Lender (illustrative)",
    jurisdiction: "national",
    minProjectCost: 2_000_000,
    maxProjectCost: 50_000_000,
    minLtvRatio: 0.60,
    maxLtvRatio: 0.75,
    typicalRate: "9–14% fixed (indicative only)",
    typicalTerm: "6–24 months",
    description:
      "Short-term bridge financing for acquisition, pre-construction, or value-add projects. Higher cost, faster close.",
    requirements: [
      { requirementType: "asset_value", description: "Clear asset value established (appraisal or BPO)", met: "unknown" },
      { requirementType: "exit_strategy", description: "Documented exit strategy (refi, sale, perm)", met: "unknown" },
      { requirementType: "title_report", description: "Clean title report", met: "unknown" },
    ],
    isPotential: true,
  },
  {
    id: "cpace-georgia",
    name: "C-PACE (Commercial Property Assessed Clean Energy) — Georgia",
    programType: "cpace",
    lenderOrSource: "Ygrene / Georgia PACE Authority (illustrative)",
    jurisdiction: "GA",
    minProjectCost: 250_000,
    typicalTerm: "10–30 years",
    description:
      "Long-term, low-cost financing for energy efficiency, solar, water, and resilience improvements. Repaid via property tax assessment. Does not require owner equity.",
    requirements: [
      { requirementType: "property_in_ga", description: "Property located in a participating Georgia county", met: "unknown" },
      { requirementType: "eligible_improvements", description: "HVAC, solar, insulation, water, or resilience upgrades", met: "unknown" },
      { requirementType: "lender_consent", description: "Mortgage lender consent required", met: "unknown" },
      { requirementType: "energy_audit", description: "Energy audit or engineering report", met: "unknown" },
    ],
    esgBonus: "C-PACE directly funds qualifying ESG improvements. May stack with 179D and utility rebates.",
    isPotential: true,
  },
  {
    id: "green-bank-financing",
    name: "Green Bank / Climate Finance",
    programType: "green_bank",
    lenderOrSource: "Coalfield Development / Georgia Green Bank / NCGB (illustrative)",
    jurisdiction: "national",
    description:
      "Mission-driven lending and investment for projects with measurable environmental and community benefits. May offer below-market rates for qualified ESG profiles.",
    requirements: [
      { requirementType: "esg_baseline", description: "ESG baseline assessment and targets", met: "unknown" },
      { requirementType: "community_benefit", description: "Documented community benefit (jobs, affordable units)", met: "unknown" },
      { requirementType: "environmental_impact", description: "Quantified environmental impact (energy, carbon, water)", met: "unknown" },
    ],
    esgBonus: "Higher ESG score (60+) typically improves access and rate.",
    isPotential: true,
  },
  {
    id: "hud-221d4",
    name: "HUD 221(d)(4) FHA Multifamily Construction Loan",
    programType: "construction_loan",
    lenderOrSource: "HUD / FHA",
    jurisdiction: "national",
    minProjectCost: 3_000_000,
    maxLtvRatio: 0.87,
    typicalRate: "Fixed rate at time of commitment (non-recourse)",
    typicalTerm: "Up to 40 years (construction + permanent)",
    description:
      "FHA-insured mortgage for new construction or substantial rehab of multifamily rental housing. Non-recourse, long-term, below-market rates for qualifying projects.",
    requirements: [
      { requirementType: "multifamily_residential", description: "5+ unit multifamily rental project", met: "unknown" },
      { requirementType: "fha_appraisal", description: "HUD/FHA appraisal", met: "unknown" },
      { requirementType: "market_study", description: "HUD-compliant market study", met: "unknown" },
      { requirementType: "architect_plans", description: "HUD-compliant architectural plans", met: "unknown" },
      { requirementType: "mip", description: "Mortgage insurance premium (MIP) applies", met: "unknown" },
    ],
    isPotential: true,
  },
  {
    id: "new-markets-tax-credit",
    name: "New Markets Tax Credit (NMTC)",
    programType: "tax_credit",
    lenderOrSource: "CDFI Fund / Certified CDFIs",
    jurisdiction: "national",
    description:
      "Federal tax credit program for investments in low-income communities. Can reduce effective borrowing cost by 20–25% over 7 years for qualified projects.",
    requirements: [
      { requirementType: "qualified_census_tract", description: "Project in a qualified low-income census tract", met: "unknown" },
      { requirementType: "community_development_purpose", description: "Documented community development impact", met: "unknown" },
      { requirementType: "cdfi_partnership", description: "Partnership with a CDFI allocation recipient", met: "unknown" },
    ],
    isPotential: true,
  },
];

function computeMatchScore(program: FundingProgram): {
  score: number;
  met: string[];
  unmet: string[];
  unknown: string[];
} {
  const met: string[] = [];
  const unmet: string[] = [];
  const unknown: string[] = [];

  for (const req of program.requirements) {
    if (req.met === true) {
      met.push(req.description);
    } else if (req.met === false) {
      unmet.push(req.description);
    } else {
      unknown.push(req.description);
    }
  }

  const total = program.requirements.length;
  if (total === 0) return { score: 50, met, unmet, unknown };
  const score = Math.round(((met.length + unknown.length * 0.4) / total) * 100);
  return { score, met, unmet, unknown };
}

function matchProgram(program: FundingProgram, _packet: SubmissionPacket): FundingMatchResult {
  const { score, met, unmet, unknown } = computeMatchScore(program);

  const status: FundingMatchResult["status"] =
    unmet.length > met.length ? "likely_ineligible" : score >= 30 ? "potential" : "needs_info";

  const nextSteps: string[] = [
    "Engage qualified real estate finance counsel to evaluate program fit",
    ...unknown.map((r) => `Confirm: ${r}`),
    ...(program.esgBonus ? [`ESG Opportunity: ${program.esgBonus}`] : []),
  ];

  return {
    programId: program.id,
    programName: program.name,
    programType: program.programType,
    status,
    matchScore: score,
    metRequirements: met,
    unmetRequirements: unmet,
    unknownRequirements: unknown,
    recommendedNextSteps: nextSteps,
    reviewNote:
      "This is a potential match only — not a commitment or pre-approval. All financing requires qualified legal and financial review.",
  };
}

function computeReadinessScore(packet: SubmissionPacket): ReadinessScore {
  const rwa =
    packet.rwaReadinessStatus === "lender_ready"
      ? 100
      : packet.rwaReadinessStatus === "needs_review"
      ? 60
      : packet.rwaReadinessStatus === "needs_evidence"
      ? 30
      : 0;

  const pof =
    packet.pofStatus === "lender_ready"
      ? 100
      : packet.pofStatus === "internally_ready"
      ? 70
      : packet.pofStatus === "evidence_missing"
      ? 30
      : 0;

  const esg = packet.esgScore ?? 0;

  const incentiveAlignment = Math.min(100, (packet.incentiveMatchCount ?? 0) * 15);

  const overall = Math.round((rwa * 0.3 + pof * 0.35 + esg * 0.2 + incentiveAlignment * 0.15));

  return { overall, rwa, pof, esg, incentiveAlignment };
}

export function assessFundingIntelligence(packet: SubmissionPacket): FundingIntelligenceResult {
  const readinessScore = computeReadinessScore(packet);
  const allMatches = BUILTIN_FUNDING_PROGRAMS.map((p) => matchProgram(p, packet));

  const potentialMatches = allMatches.filter((m) => m.status === "potential" || m.status === "needs_info");
  const committedMatches: FundingMatchResult[] = []; // empty until contractually confirmed

  const totalCommitted = (packet.capitalStack ?? [])
    .filter((e) => e.committed)
    .reduce((s, e) => s + e.amount, 0);
  const capitalGap = Math.max(0, packet.projectCost - totalCommitted);

  const blockedReasons: string[] = [];
  if (capitalGap > 0) blockedReasons.push(`Capital gap of $${capitalGap.toLocaleString()} — committed capital does not cover project cost`);
  if (readinessScore.rwa === 0) blockedReasons.push("RWA readiness is 0 — asset documentation not ready");
  if (readinessScore.pof === 0) blockedReasons.push("PoF readiness is 0 — proof of funds not ready");

  let status: FundingReadinessStatus;
  if (blockedReasons.length > 0 && readinessScore.overall < 20) {
    status = "blocked";
  } else if (capitalGap > 0) {
    status = "gaps_to_resolve";
  } else if (readinessScore.overall >= 80) {
    status = "submission_ready";
  } else if (readinessScore.overall >= 50) {
    status = "internally_ready";
  } else {
    status = "needs_review";
  }

  const nextBestSteps = [
    "Complete RWA asset documentation and evidence checklist",
    "Resolve any capital gap with verified (non-estimated) funds",
    "Prepare PoF packet with bank statements and lender authorization letters",
    "Engage ESG consultant to complete certification documentation",
    "Confirm tax incentive eligibility with qualified tax professional",
    "Engage a real estate finance attorney for program selection and term negotiation",
    ...(capitalGap > 0 ? [`Identify $${capitalGap.toLocaleString()} in additional committed capital`] : []),
  ];

  const reviewNotes = [
    "All funding program matches are potential only — not commitments, pre-approvals, or term sheets.",
    "Potential and committed are strictly separated. A program is committed only after executed documentation.",
    "All financing decisions require review by qualified real estate finance, tax, and legal counsel.",
    "Estimated incentive amounts (grants, tax credits, rebates) are never counted as committed capital.",
  ];

  return {
    projectId: packet.projectId,
    status,
    readinessScore,
    potentialMatches,
    committedMatches,
    capitalGap,
    nextBestSteps,
    blockedReasons,
    reviewNotes,
  };
}
