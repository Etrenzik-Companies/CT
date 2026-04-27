// ── Tax Incentive Intelligence — Engine ───────────────────────────────────
// For identification and diligence purposes only.
// Estimated incentive amounts are never verified funds.
// All outputs require review by a qualified tax professional.

import type {
  IncentiveMatchResult,
  IncentiveMatchStatus,
  IncentiveProgram,
  Jurisdiction,
} from "./types.js";

export interface IncentiveMatchInput {
  jurisdiction: Jurisdiction;
  projectScope: string[]; // e.g. ["hvac", "solar", "led_lighting", "insulation", "new_construction"]
  assetTypes: string[]; // e.g. ["construction_project", "real_estate"]
  estimatedProjectCost: number;
  buildingType?: string; // e.g. "multifamily", "commercial", "mixed_use"
  newConstruction?: boolean;
  energyEfficiencyUpgrade?: boolean;
  solarInstall?: boolean;
}

// ── Built-in program catalog (Indiana + Federal, hotel construction focus) ──
export const BUILTIN_PROGRAMS: IncentiveProgram[] = [
  {
    id: "irs-179d",
    name: "IRS Section 179D — Energy Efficient Commercial Building Deduction",
    source: "irs_federal",
    category: "deduction",
    jurisdiction: { country: "US", state: "*" },
    description:
      "Federal tax deduction for energy-efficient commercial building improvements including HVAC, lighting, and building envelope.",
    irsSection: "179D",
    eligibilityRules: [
      { description: "Commercial or multifamily 4+ stories", met: "unknown" },
      { description: "Energy model certification required (ASHRAE 90.1)", met: "unknown" },
      { description: "Placed in service after 12/31/2022 qualifies for enhanced deductions", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "energy_model", description: "ASHRAE 90.1 energy model", required: true },
      { documentType: "certification_letter", description: "Qualified engineer certification", required: true },
      { documentType: "cost_segregation_study", description: "Optional but recommended", required: false },
    ],
    estimatedBenefit: {
      minAmount: 0.5,
      maxAmount: 5.65,
      unit: "per_sqft",
      note: "Estimated only. Actual benefit depends on energy model, asset type, and prevailing wage compliance.",
    },
    applicationDeadline: { type: "rolling", note: "Deducted on federal income tax return" },
    referenceUrl: "https://www.irs.gov/credits-deductions/businesses/energy-efficient-commercial-buildings-deduction",
  },
  {
    id: "irs-48e",
    name: "IRS Section 48E — Clean Electricity Investment Credit",
    source: "irs_federal",
    category: "federal_tax_credit",
    jurisdiction: { country: "US", state: "*" },
    description:
      "Federal tax credit pathway for qualifying clean-electric generation and storage systems installed as part of a commercial project.",
    irsSection: "48E",
    eligibilityRules: [
      { description: "Qualifying solar, storage, or other clean-electric equipment included in scope", met: "unknown" },
      { description: "Tax basis and placed-in-service timing confirmed", met: "unknown" },
      { description: "Prevailing wage / apprenticeship analysis completed where applicable", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "renewable_system_design", description: "Renewable or storage system design package", required: true },
      { documentType: "cost_basis_schedule", description: "Tax basis and cost segregation support", required: true },
      { documentType: "tax_memo", description: "Tax counsel or CPA memo", required: true },
    ],
    estimatedBenefit: {
      minAmount: 6,
      maxAmount: 30,
      unit: "percent",
      note: "Estimated credit percentage only. Actual benefit depends on technology, basis, prevailing wage compliance, transferability, and tax structuring.",
    },
    applicationDeadline: { type: "rolling", note: "Claimed or transferred under current federal tax rules after placed-in-service" },
    referenceUrl: "https://www.irs.gov/credits-deductions/clean-electricity-investment-credit",
  },
  {
    id: "doe-better-buildings",
    name: "DOE Better Buildings Initiative — Technical Assistance",
    source: "doe_federal",
    category: "other",
    jurisdiction: { country: "US", state: "*" },
    description:
      "DOE technical assistance and resources for commercial buildings pursuing energy efficiency retrofits and new construction.",
    eligibilityRules: [
      { description: "Commercial or institutional building", met: "unknown" },
      { description: "Commitment to energy benchmarking", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "energy_benchmark_report", description: "ENERGY STAR Portfolio Manager report", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Non-monetary — technical assistance, peer learning, recognition.",
    },
    applicationDeadline: { type: "rolling" },
    referenceUrl: "https://betterbuildingssolutioncenter.energy.gov/",
  },
  {
    id: "in-hbitc",
    name: "Indiana Hoosier Business Investment Tax Credit",
    source: "state_revenue_dept",
    category: "state_tax_credit",
    jurisdiction: { country: "US", state: "IN" },
    description:
      "Indiana state tax credit program that may support qualified capital investment, job creation, and business expansion with IEDC approval.",
    eligibilityRules: [
      { description: "Indiana project with qualifying capital investment and economic development fit", met: "unknown" },
      { description: "IEDC approval and negotiated incentive terms obtained before closing", met: "unknown" },
      { description: "Employment and investment thresholds documented", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "capital_investment_schedule", description: "Capital investment schedule and sources/uses", required: true },
      { documentType: "jobs_plan", description: "Job creation and wage plan", required: true },
      { documentType: "iedc_application", description: "IEDC incentive application / approval record", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Estimated benefit varies by negotiated award, tax liability, and IEDC approval terms. Do not model as verified funds until awarded and monetization is confirmed.",
    },
    applicationDeadline: { type: "rolling", note: "IEDC application and approval timing must be confirmed directly with the state" },
    referenceUrl: "https://iedc.in.gov/",
  },
  {
    id: "in-skills-enhancement-fund",
    name: "Indiana Skills Enhancement Fund",
    source: "other",
    category: "grant",
    jurisdiction: { country: "US", state: "IN" },
    description:
      "Indiana workforce support that may offset a portion of pre-opening hotel training and workforce development costs when approved through the state.",
    eligibilityRules: [
      { description: "Indiana employer with qualifying workforce training plan", met: "unknown" },
      { description: "Training scope, curriculum, and eligible job categories documented", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "training_plan", description: "Pre-opening training plan and staffing model", required: true },
      { documentType: "budget", description: "Training budget and reimbursement assumptions", required: true },
    ],
    estimatedBenefit: {
      minAmount: 25_000,
      maxAmount: 250_000,
      unit: "dollar",
      note: "Illustrative only. Actual grant amount and reimbursements depend on program approval, training scope, and current Indiana funding availability.",
    },
    applicationDeadline: { type: "rolling", note: "Confirm current program window and reimbursement terms with Indiana" },
    referenceUrl: "https://iedc.in.gov/",
  },
  {
    id: "in-local-tif-abatement",
    name: "Carmel / Hamilton County Redevelopment Support (TIF or Tax Abatement)",
    source: "local_government",
    category: "property_tax_exemption_abatement",
    jurisdiction: { country: "US", state: "IN", county: "Hamilton", city: "Carmel" },
    description:
      "Potential local redevelopment support for Clay Terrace through tax increment financing, economic development area support, or property tax abatement subject to local authority approval.",
    eligibilityRules: [
      { description: "Project is located in Carmel / Hamilton County and qualifies under local redevelopment policy", met: "unknown" },
      { description: "Redevelopment commission, council, or assessor approvals obtained", met: "unknown" },
      { description: "Increment, assessed value impact, and public benefit case documented", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "site_map", description: "Site map, parcel detail, and district / zoning evidence", required: true },
      { documentType: "financial_impact_memo", description: "Increment, assessed value, and public benefit memo", required: true },
      { documentType: "local_application", description: "Local incentive application and hearing materials", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Local support depends on district status, policy fit, and negotiated approvals. Do not count as committed capital until formally approved.",
    },
    applicationDeadline: { type: "rolling", note: "Driven by Carmel / Hamilton County meeting and hearing calendars" },
  },
  {
    id: "in-cpace-monitor",
    name: "Indiana C-PACE Monitor",
    source: "state_energy_office",
    category: "cpace_financing",
    jurisdiction: { country: "US", state: "IN" },
    description:
      "Monitor-only entry for Indiana C-PACE or comparable assessment-based clean-energy financing. Treat as unavailable until current statutory and administrator availability is confirmed.",
    eligibilityRules: [
      { description: "Current Indiana enabling framework and active administrator verified", met: "unknown" },
      { description: "Project includes qualifying energy, resiliency, or water conservation scope", met: "unknown" },
      { description: "Senior lender consent and assessment mechanics confirmed", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "program_confirmation", description: "Current program availability confirmation", required: true },
      { documentType: "energy_scope", description: "Energy or resiliency scope package", required: true },
      { documentType: "lender_consent", description: "Senior lender consent analysis", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Monitor-only. Do not underwrite as available capital unless the Indiana program path is verified for the specific jurisdiction and transaction.",
    },
    applicationDeadline: { type: "unknown", note: "Verify directly before modeling" },
    referenceUrl: "https://www.in.gov/energy/",
  },
  {
    id: "utility-duke-indiana",
    name: "Duke Energy Indiana Business Efficiency Incentives",
    source: "utility_rebate",
    category: "rebate",
    jurisdiction: { country: "US", state: "IN" },
    description:
      "Potential utility incentive stack for HVAC, controls, lighting, and related efficiency measures if Clay Terrace is in Duke Energy Indiana service territory.",
    eligibilityRules: [
      { description: "Confirmed Duke Energy Indiana commercial service territory", met: "unknown" },
      { description: "Qualifying efficiency measures and incentive tiers confirmed", met: "unknown" },
      { description: "Program pre-approval completed before procurement where required", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "equipment_specs", description: "Equipment model/efficiency specifications", required: true },
      { documentType: "invoice", description: "Contractor invoice", required: true },
      { documentType: "rebate_application", description: "Utility incentive application and pre-approval package", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Program benefit varies by measure type, utility territory, and pre-approval status. Treat as estimated until incentive reservation or payment is issued.",
    },
    applicationDeadline: { type: "rolling", note: "Verify incentive deadlines and reservation windows with Duke Energy Indiana" },
    referenceUrl: "https://www.duke-energy.com/",
  },
  {
    id: "utility-aes-indiana",
    name: "AES Indiana Business Energy Rebates",
    source: "utility_rebate",
    category: "rebate",
    jurisdiction: { country: "US", state: "IN" },
    description:
      "Potential utility rebates for lighting, HVAC, controls, and related upgrades if the site falls within AES Indiana service territory instead of Duke Energy Indiana.",
    eligibilityRules: [
      { description: "Confirmed AES Indiana commercial service territory", met: "unknown" },
      { description: "Qualifying efficiency measures and rebate schedule confirmed", met: "unknown" },
      { description: "Required pre-approval and installation documentation preserved", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "equipment_specs", description: "Equipment specifications and cut sheets", required: true },
      { documentType: "invoice", description: "Installation invoice and proof of payment", required: true },
      { documentType: "rebate_application", description: "AES Indiana rebate application / reservation package", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Estimated only. Use only after utility territory is confirmed and current AES Indiana measure schedules are reviewed.",
    },
    applicationDeadline: { type: "rolling", note: "Confirm active program rules directly with AES Indiana" },
    referenceUrl: "https://www.aesindiana.com/",
  },
];

function programMatchesJurisdiction(program: IncentiveProgram, input: IncentiveMatchInput): boolean {
  if (program.jurisdiction.state === "*") return true;
  return program.jurisdiction.state === input.jurisdiction.state;
}

function programMatchesScope(program: IncentiveProgram, input: IncentiveMatchInput): boolean {
  const scope = input.projectScope.map((s) => s.toLowerCase());
  const desc = program.description.toLowerCase() + " " + program.name.toLowerCase();

  const energyKeywords = ["hvac", "solar", "lighting", "efficiency", "energy", "renewable"];
  const assetKeywords = ["construction", "commercial", "multifamily", "residential", "building"];

  const hasEnergyScope = scope.some((s) => energyKeywords.some((k) => s.includes(k)));
  const hasAssetScope =
    input.assetTypes.some((a) => assetKeywords.some((k) => a.includes(k))) ||
    input.newConstruction === true ||
    input.energyEfficiencyUpgrade === true;

  if (program.source === "utility_rebate") {
    return hasEnergyScope || scope.includes("hvac") || scope.includes("led_lighting");
  }
  if (program.id === "irs-48e") {
    return (
      input.solarInstall === true ||
      scope.some((item) => item.includes("solar") || item.includes("battery") || item.includes("renewable"))
    );
  }
  if (program.id === "in-cpace-monitor") {
    return hasEnergyScope || input.energyEfficiencyUpgrade === true || input.solarInstall === true;
  }
  if (program.id === "in-hbitc") {
    return input.newConstruction === true || input.assetTypes.some((a) => ["construction_project", "real_estate"].includes(a));
  }
  if (program.id === "in-skills-enhancement-fund") {
    return ["hospitality", "commercial", "mixed_use"].includes((input.buildingType ?? "").toLowerCase());
  }
  if (program.id === "in-local-tif-abatement") {
    return input.newConstruction === true || input.assetTypes.some((a) => ["construction_project", "real_estate"].includes(a));
  }

  return hasEnergyScope || hasAssetScope || desc.includes("commercial") || desc.includes("construction");
}

function classifyStatus(program: IncentiveProgram, _input: IncentiveMatchInput): IncentiveMatchStatus {
  const unknownRules = program.eligibilityRules.filter((r) => r.met === "unknown").length;
  const totalRules = program.eligibilityRules.length;

  if (unknownRules === 0) return "likely_match";
  if (unknownRules < totalRules) return "possible_match";
  if (unknownRules === totalRules && totalRules > 0) return "needs_review";
  return "needs_review";
}

export function matchIncentivePrograms(input: IncentiveMatchInput): {
  matches: IncentiveMatchResult[];
  reviewNote: string;
} {
  const matches: IncentiveMatchResult[] = [];

  for (const program of BUILTIN_PROGRAMS) {
    if (!programMatchesJurisdiction(program, input)) continue;
    if (!programMatchesScope(program, input)) continue;

    const status: IncentiveMatchStatus = classifyStatus(program, input);
    const missingEligibilityInfo = program.eligibilityRules
      .filter((r) => r.met === "unknown")
      .map((r) => r.description);

    const taxReviewRequired =
      program.source === "irs_federal" ||
      program.source === "state_revenue_dept" ||
      program.category === "state_tax_credit" ||
      program.category === "federal_tax_credit" ||
      program.category === "deduction";

    const requiredNextSteps = [
      taxReviewRequired
        ? "Engage a qualified tax professional to confirm eligibility"
        : "Confirm eligibility directly with the program administrator and project counsel",
      ...program.requiredDocuments.filter((d) => d.required).map((d) => `Obtain ${d.description}`),
    ];

    matches.push({
      programId: program.id,
      programName: program.name,
      status,
      matchReason: `Matched based on project scope, jurisdiction, and asset type`,
      estimatedBenefit: program.estimatedBenefit,
      missingEligibilityInfo,
      requiredNextSteps,
      reviewNote:
        "Estimated benefits are never verified funds. Engage a qualified tax professional before claiming any incentive.",
    });
  }

  return {
    matches,
    reviewNote:
      "All incentive matches are preliminary only. Actual eligibility and benefit amounts must be confirmed by a qualified tax professional. Estimated incentives are never counted as verified capital.",
  };
}
