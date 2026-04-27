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

// ── Built-in program catalog (Georgia + Federal, construction focus) ───────
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
    id: "irs-45l",
    name: "IRS Section 45L — New Energy Efficient Home Credit",
    source: "irs_federal",
    category: "federal_tax_credit",
    jurisdiction: { country: "US", state: "*" },
    description:
      "Federal tax credit for qualified new energy-efficient homes or apartments. Up to $5,000 per unit for ZERH-certified or $2,500 for ENERGY STAR.",
    irsSection: "45L",
    eligibilityRules: [
      { description: "Residential units (apartments, condos, townhomes)", met: "unknown" },
      { description: "ENERGY STAR or ZERH certification", met: "unknown" },
      { description: "Acquired after 12/31/2022", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "energy_star_cert", description: "ENERGY STAR or ZERH certification", required: true },
      { documentType: "building_permit", description: "Building permit showing new construction", required: true },
    ],
    estimatedBenefit: {
      minAmount: 500,
      maxAmount: 5000,
      unit: "dollar",
      note: "Per unit estimate only. Actual credit depends on certification level and unit count.",
    },
    applicationDeadline: { type: "rolling", note: "Credit on federal income tax return per qualifying unit" },
    referenceUrl: "https://www.irs.gov/credits-deductions/businesses/new-energy-efficient-home-credit",
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
    id: "ga-property-tax-exemption",
    name: "Georgia Renewable Energy Property Tax Exemption",
    source: "state_energy_office",
    category: "property_tax_exemption_abatement",
    jurisdiction: { country: "US", state: "GA" },
    description:
      "Georgia O.C.G.A. §48-5-41 exempts the assessed value of solar energy systems from ad valorem property tax.",
    eligibilityRules: [
      { description: "Georgia property", met: "unknown" },
      { description: "Solar energy system installed on real property", met: "unknown" },
      { description: "System must be certified by the manufacturer", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "solar_system_certification", description: "Manufacturer certification", required: true },
      { documentType: "property_tax_form", description: "County tax assessor exemption application", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Estimated savings depend on installed system value and county millage rate.",
    },
    applicationDeadline: { type: "annual", note: "Filed with county tax assessor by January 1 each year" },
    referenceUrl: "https://dor.georgia.gov/taxes/business-taxes/property-tax",
  },
  {
    id: "ga-state-energy-loan",
    name: "Georgia Environmental Finance Authority (GEFA) — State Energy Program Loans",
    source: "state_energy_office",
    category: "low_interest_loan",
    jurisdiction: { country: "US", state: "GA" },
    description:
      "GEFA provides low-interest loans for energy efficiency and renewable energy projects at local government, school, and nonprofit facilities.",
    eligibilityRules: [
      { description: "Georgia local government, school, or nonprofit entity", met: "unknown" },
      { description: "Energy efficiency or renewable energy project", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "energy_audit", description: "Professional energy audit", required: true },
      { documentType: "project_scope", description: "Detailed project scope and cost estimate", required: true },
    ],
    estimatedBenefit: {
      minAmount: 100_000,
      maxAmount: 2_000_000,
      unit: "dollar",
      note: "Loan amounts and rates vary. Not a grant — repayment required.",
    },
    applicationDeadline: { type: "rolling" },
    referenceUrl: "https://gefa.georgia.gov/programs/state-energy-program",
  },
  {
    id: "utility-ge-energy-rebates",
    name: "Georgia Power Commercial Energy Efficiency Rebates",
    source: "utility_rebate",
    category: "rebate",
    jurisdiction: { country: "US", state: "GA" },
    description:
      "Georgia Power rebates for commercial customers installing high-efficiency HVAC, LED lighting, motors, and refrigeration equipment.",
    eligibilityRules: [
      { description: "Georgia Power commercial customer", met: "unknown" },
      { description: "New qualifying equipment (HVAC, LED, motors, refrigeration)", met: "unknown" },
      { description: "Pre-approval may be required before installation", met: "unknown" },
    ],
    requiredDocuments: [
      { documentType: "equipment_specs", description: "Equipment model/efficiency specifications", required: true },
      { documentType: "invoice", description: "Contractor invoice", required: true },
      { documentType: "rebate_application", description: "Georgia Power rebate application form", required: true },
    ],
    estimatedBenefit: {
      unit: "other",
      note: "Varies by equipment type and efficiency tier. Estimate from program documentation.",
    },
    applicationDeadline: { type: "rolling", note: "Submit within 90 days of equipment installation" },
    referenceUrl: "https://www.georgiapower.com/business/save-money/rebates-and-incentives.html",
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
  if (program.id === "irs-45l") {
    return (
      input.newConstruction === true ||
      input.assetTypes.some((a) => ["real_estate", "construction_project"].includes(a))
    );
  }
  if (program.id === "ga-property-tax-exemption") {
    return input.solarInstall === true || scope.includes("solar");
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

    const requiredNextSteps = [
      "Engage a qualified tax professional to confirm eligibility",
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
