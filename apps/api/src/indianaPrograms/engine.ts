// ── Indiana Program Matrix — Engine ──────────────────────────────────────
// Official-source matching and diligence workflow support only.

import type {
  ClayTerraceIndianaProfile,
  FundingValueTreatment,
  IndianaBondFinanceOption,
  IndianaCodeRequirement,
  IndianaEsgIncentive,
  IndianaEvidenceRequirement,
  IndianaGrantOption,
  IndianaProgram,
  IndianaProgramMatch,
  IndianaProgramMatrixResult,
  IndianaProgramSource,
  IndianaTaxRequirement,
} from "./types.js";

function hasIndianaLocation(profile: ClayTerraceIndianaProfile): boolean {
  return profile.state.toUpperCase() === "IN" && profile.city.toLowerCase() === "carmel" && profile.county.toLowerCase() === "hamilton";
}

function buildEvidence(id: string, label: string, description: string, satisfied: boolean): IndianaEvidenceRequirement {
  return { id, label, description, required: true, satisfied };
}

function missingEvidenceLabels(evidence: IndianaEvidenceRequirement[]): string[] {
  return evidence.filter((item) => !item.satisfied).map((item) => item.label);
}

function official(label: string, url: string): IndianaProgramSource {
  return { label, url, confidence: "official_source" };
}

function publicDb(label: string, url: string): IndianaProgramSource {
  return { label, url, confidence: "public_database" };
}

const INDIANA_PROGRAMS: IndianaProgram[] = [
  {
    id: "in-hbitc",
    name: "Hoosier Business Investment Tax Credit (HBI / HBITC)",
    category: "tax_credit_deduction",
    description: "Indiana tax-credit pathway for qualifying capital investment and job impacts with IEDC approval.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-edge",
    name: "Economic Development for a Growing Economy Tax Credit (EDGE)",
    category: "tax_credit_deduction",
    description: "Indiana payroll-driven tax-credit pathway linked to net new wages and job growth.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-sef",
    name: "Skills Enhancement Fund (SEF)",
    category: "grant",
    description: "Indiana workforce training reimbursement program with post-contract reporting obligations.",
    sources: [official("SEF Program Overview", "https://iedc.in.gov/indiana-advantages/investments/skills-enhancement-fund-sef/overview")],
  },
  {
    id: "in-cred",
    name: "Community Revitalization Enhancement District Tax Credit (CRED)",
    category: "tax_credit_deduction",
    description: "Indiana district-based revitalization tax-credit program requiring district and project qualification.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-idgf",
    name: "Industrial Development Grant Fund (IDGF)",
    category: "grant",
    description: "State grant pathway requiring local support and approved development scope.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-hrtc",
    name: "Headquarters Relocation Tax Credit (HRTC)",
    category: "tax_credit_deduction",
    description: "Monitor-only unless relocation facts are present.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-data-center-sales-tax",
    name: "Data Center Sales Tax Exemption",
    category: "tax_credit_deduction",
    description: "Monitor-only unless a qualifying data-center scope exists.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-manufacturing-readiness",
    name: "Manufacturing Readiness Grants",
    category: "grant",
    description: "Monitor-only unless qualifying manufacturing scope exists.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-engineering-grant",
    name: "Indiana Engineering Grant",
    category: "grant",
    description: "Monitor-only unless qualified workforce and program fit are evidenced.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "in-community-collaboration-fund",
    name: "Indiana Community Collaboration Fund",
    category: "grant",
    description: "Monitor-only unless entrepreneurial support-track facts are evidenced.",
    sources: [official("IEDC Incentive Catalog", "https://iedc.in.gov/indiana-advantages/investments")],
  },
  {
    id: "irs-179d",
    name: "IRS Section 179D Energy Efficient Commercial Buildings Deduction",
    category: "tax_credit_deduction",
    description: "Federal energy-efficient commercial building deduction requiring model/certification support.",
    sources: [official("IRS 179D", "https://www.irs.gov/credits-deductions/energy-efficient-commercial-buildings-deduction")],
  },
  {
    id: "irs-48e",
    name: "IRS Section 48E Clean Electricity Investment Credit",
    category: "esg_energy_incentive",
    description: "Federal credit pathway for qualified clean-electric investments.",
    sources: [official("IRS 48E", "https://www.irs.gov/credits-deductions/clean-electricity-investment-credit")],
  },
  {
    id: "irs-48e-low-income-bonus",
    name: "48E(h) Low-Income Communities Bonus Credit (screen-only)",
    category: "esg_energy_incentive",
    description: "Screen-only pathway pending eligibility confirmation.",
    sources: [official("IRS 48E", "https://www.irs.gov/credits-deductions/clean-electricity-investment-credit")],
  },
  {
    id: "irs-30c-ev",
    name: "IRS Section 30C Alternative Fuel Vehicle Refueling Property Credit",
    category: "esg_energy_incentive",
    description: "Federal EV charging/refueling property credit screening for eligible project scope and location.",
    sources: [official("IRS 30C", "https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit")],
  },
  {
    id: "irs-transferability-review",
    name: "Elective Pay / Transferability Review",
    category: "tax_credit_deduction",
    description: "Tax-structuring review for clean-energy credit transferability and elective-pay applicability.",
    sources: [official("IRS Clean Energy Credits", "https://www.irs.gov/clean-energy")],
  },
  {
    id: "doe-better-buildings-financing-navigator",
    name: "DOE Better Buildings Financing Navigator",
    category: "esg_energy_incentive",
    description: "Reference financing-source navigator for energy projects.",
    sources: [official("DOE Better Buildings", "https://betterbuildingssolutioncenter.energy.gov/financing-navigator")],
  },
  {
    id: "dsire-indiana-registry",
    name: "DSIRE Indiana Incentive Registry",
    category: "esg_energy_incentive",
    description: "Public database source for Indiana and utility incentive screening.",
    sources: [publicDb("DSIRE", "https://dsireusa.org/")],
  },
  {
    id: "in-brownfield-ifa-rlf",
    name: "Indiana Brownfields Program / IFA Revolving Loan Fund",
    category: "grant",
    description: "Cleanup and revolving-loan support path requiring environmental site evidence.",
    sources: [official("Indiana IFA Brownfields RLF", "https://www.in.gov/ifa/brownfields/files/RLF-Incentive-Guidelines-with-exhibits%2C-March-16%2C-2023-FINAL.pdf")],
  },
  {
    id: "in-state-revolving-fund-cleanup",
    name: "State Revolving Fund Brownfield/Water Support",
    category: "grant",
    description: "Cleanup and water-related support requiring environmental qualification.",
    sources: [official("Indiana SRF Program", "https://www.in.gov/ifa/srf/")],
  },
  {
    id: "epa-brownfield-grants",
    name: "EPA Brownfield Assessment/Cleanup/Job Training Grants",
    category: "grant",
    description: "Monitor-only unless site conditions and project qualification are established.",
    sources: [official("EPA Brownfields", "https://www.epa.gov/brownfields")],
  },
  {
    id: "ocra-cdbg-monitor",
    name: "OCRA CDBG (monitor-only)",
    category: "grant",
    description: "Monitor-only because Carmel may not fit rural pathways unless a specific program route is proven.",
    sources: [official("OCRA", "https://www.in.gov/ocra/")],
  },
  {
    id: "carmel-redevelopment-support",
    name: "Carmel Redevelopment Support",
    category: "bonds_tif_redevelopment_finance",
    description: "Local redevelopment support screening for Carmel/Hamilton County project execution.",
    sources: [official("Carmel Redevelopment", "https://www.carmel.in.gov/")],
  },
  {
    id: "carmel-tif-monitor",
    name: "Carmel Redevelopment Commission / TIF Monitor",
    category: "bonds_tif_redevelopment_finance",
    description: "TIF screening requiring district fit and public-body approvals.",
    sources: [official("Carmel Redevelopment", "https://www.carmel.in.gov/")],
  },
  {
    id: "carmel-bond-bank-monitor",
    name: "Carmel Local Public Improvement Bond Bank Monitor",
    category: "bonds_tif_redevelopment_finance",
    description: "Monitor and screen local bond-bank structures.",
    sources: [official("Carmel Public Finance", "https://www.carmel.in.gov/")],
  },
  {
    id: "hamilton-county-edc-finance",
    name: "Hamilton County Economic Development Commission Financing",
    category: "bonds_tif_redevelopment_finance",
    description: "County-level economic development financing support path.",
    sources: [official("Hamilton County EDC", "https://www.hamiltoncounty.in.gov/1767/Local-Business-Community-and-Hospitality")],
  },
  {
    id: "economic-development-revenue-bonds",
    name: "Economic Development Revenue Bonds",
    category: "bonds_tif_redevelopment_finance",
    description: "Revenue-bond financing requiring approvals, structure, and term sheets.",
    sources: [official("Hamilton County EDC", "https://www.hamiltoncounty.in.gov/1767/Local-Business-Community-and-Hospitality")],
  },
  {
    id: "tax-increment-financing",
    name: "Tax Increment Financing (TIF)",
    category: "bonds_tif_redevelopment_finance",
    description: "District-based redevelopment financing requiring public approvals.",
    sources: [official("Carmel Redevelopment", "https://www.carmel.in.gov/")],
  },
  {
    id: "tax-abatement-support",
    name: "Tax Abatement / Redevelopment Area Support",
    category: "bonds_tif_redevelopment_finance",
    description: "Local abatement/redevelopment path requiring approvals and parcel fit.",
    sources: [official("Hamilton County EDC", "https://www.hamiltoncounty.in.gov/1767/Local-Business-Community-and-Hospitality")],
  },
  {
    id: "tourism-hospitality-support",
    name: "Tourism/Hospitality Support",
    category: "bonds_tif_redevelopment_finance",
    description: "Tourism-linked public-finance support tied to local structures and approvals.",
    sources: [official("Hamilton County EDC", "https://www.hamiltoncounty.in.gov/1767/Local-Business-Community-and-Hospitality")],
  },
  {
    id: "indiana-cpace-monitor",
    name: "Indiana C-PACE / Energy Improvement Financing (monitor-only)",
    category: "esg_energy_incentive",
    description: "Monitor-only until Indiana local authorization and lender consent are verified.",
    sources: [official("Indiana Energy Office", "https://www.in.gov/energy/")],
  },
];

function forProgram(profile: ClayTerraceIndianaProfile, program: IndianaProgram): IndianaProgramMatch {
  const inIndiana = hasIndianaLocation(profile);
  const addressEvidence = buildEvidence("project-address", "project address / parcel", "Project address and parcel must be identified.", profile.projectAddressKnown && profile.parcelKnown);
  const zoningEvidence = buildEvidence("zoning", "zoning district", "Zoning district and use confirmation required.", profile.zoningDistrictKnown);
  const utilityEvidence = buildEvidence("utility", "utility territory", "Utility territory must be confirmed for utility and energy programs.", profile.utilityTerritoryKnown);
  const budgetEvidence = buildEvidence("budget", "construction budget", "Budget and sources/uses package required.", profile.totalBudget > 0);
  const proformaEvidence = buildEvidence("proforma", "pro forma", "Current operating/development pro forma required.", profile.totalBudget > 0 && profile.keys > 0);
  const taxMemoEvidence = buildEvidence("tax-memo", "tax/accounting memo", "Tax and accounting treatment memo required.", profile.taxCreditFacts.taxAccountingMemo);
  const legalMemoEvidence = buildEvidence("legal-memo", "legal memo", "Legal review memo required.", profile.taxCreditFacts.legalMemo);
  const humanApprovalEvidence = buildEvidence("human-approval", "human approval log", "Human approval log required before lender packet use.", profile.complianceFacts.humanApprovalLog);

  const evidence: IndianaEvidenceRequirement[] = [addressEvidence, zoningEvidence, utilityEvidence, budgetEvidence, proformaEvidence, taxMemoEvidence, legalMemoEvidence, humanApprovalEvidence];
  let status: IndianaProgramMatch["status"] = "possible_match";
  let treatment: FundingValueTreatment = "estimated";
  let notes: string[] = ["Estimated incentives are never counted as verified funds until awarded and verified."];
  const risks = [{ level: "medium", reason: "Program fit is preliminary and requires official review." }] as IndianaProgramMatch["risks"];

  if (!inIndiana) {
    status = "not_applicable";
    treatment = "not_counted";
    notes = ["Program is scoped for Clay Terrace in Carmel, Hamilton County, Indiana."];
    return {
      programId: program.id,
      programName: program.name,
      category: program.category,
      status,
      fundingValueTreatment: treatment,
      estimatedAmount: 0,
      countsAsVerifiedFunds: false,
      matchReason: "Project location mismatch",
      requiredEvidence: evidence,
      missingEvidence: missingEvidenceLabels(evidence),
      risks,
      notes,
    };
  }

  if (["in-hbitc", "in-edge", "in-sef"].includes(program.id)) {
    evidence.push(
      buildEvidence("job-schedule", "job creation schedule", "Job creation schedule required.", profile.jobsWorkforce.jobCreationSchedule),
      buildEvidence("payroll", "payroll estimates", "Payroll estimates are required for state incentive review.", profile.jobsWorkforce.payrollEstimates),
      buildEvidence("iedc", "IEDC application evidence", "IEDC application / pre-screen evidence is required.", profile.taxCreditFacts.iedcApplicationSubmitted)
    );
    status = evidence.some((item) => !item.satisfied) ? "needs_review" : "possible_match";
    treatment = status === "possible_match" ? "application_ready" : "estimated";
    notes.push("HBI/EDGE/SEF remain needs_review until job, payroll, capital, and IEDC evidence are complete.");
  }

  if (program.id === "irs-179d") {
    evidence.push(
      buildEvidence("energy-model", "energy model", "ASHRAE-aligned energy model required.", profile.taxCreditFacts.energyModelComplete),
      buildEvidence("179d-cert", "certification", "Qualified certification for 179D is required.", profile.taxCreditFacts.section179dCertification),
      buildEvidence("sqft", "gross square footage", "Square footage evidence is required.", profile.taxCreditFacts.grossSquareFootageKnown),
      buildEvidence("pis", "placed-in-service facts", "Placed-in-service facts are required.", profile.taxCreditFacts.placedInServiceDateKnown)
    );
    status = evidence.some((item) => !item.satisfied) ? "needs_review" : "possible_match";
    treatment = status === "possible_match" ? "application_ready" : "estimated";
    notes.push("179D is needs_review without model, certification, square footage, placed-in-service, and tax review evidence.");
  }

  if (["irs-48e", "irs-30c-ev"].includes(program.id)) {
    evidence.push(
      buildEvidence("equip-specs", "equipment specs", "Equipment specifications are required.", profile.taxCreditFacts.equipmentSpecsComplete),
      buildEvidence("pis", "placed-in-service facts", "Placed-in-service evidence is required.", profile.taxCreditFacts.placedInServiceDateKnown),
      buildEvidence("tax-owner", "tax ownership", "Tax ownership and benefit allocation must be documented.", profile.taxCreditFacts.taxOwnershipDocumented)
    );
    if (program.id === "irs-30c-ev") {
      evidence.push(buildEvidence("ev-scope", "scope of work", "EV charging scope evidence required.", profile.energyScope.evCharging));
    }
    status = evidence.some((item) => !item.satisfied) ? "needs_review" : "possible_match";
    treatment = status === "possible_match" ? "application_ready" : "estimated";
    notes.push("48E and 30C remain needs_review without equipment, placed-in-service, and tax ownership facts.");
  }

  if (program.id === "irs-48e-low-income-bonus") {
    evidence.push(buildEvidence("low-income-check", "eligible-location checks", "Low-income community bonus eligibility must be validated.", profile.taxCreditFacts.lowIncomeBonusEligibilityChecked));
    status = evidence.some((item) => !item.satisfied) ? "needs_review" : "possible_match";
    treatment = "estimated";
    notes.push("48E(h) bonus is screening-only unless location eligibility is documented.");
  }

  if (program.id === "irs-transferability-review") {
    evidence.push(buildEvidence("transferability", "tax/accounting memo", "Elective-pay / transferability analysis required.", profile.taxCreditFacts.transferabilityReviewed));
    status = evidence.some((item) => !item.satisfied) ? "needs_review" : "possible_match";
    treatment = "not_counted";
    notes.push("Transferability review does not create funds by itself; it governs monetization pathway.");
  }

  if (["in-brownfield-ifa-rlf", "in-state-revolving-fund-cleanup", "epa-brownfield-grants"].includes(program.id)) {
    evidence.push(
      buildEvidence("phase-i", "scope of work", "Phase I environmental site assessment evidence is required.", profile.environmentalFacts.phaseI),
      buildEvidence("phase-ii", "permit applications", "Phase II/environmental follow-up where required.", profile.environmentalFacts.phaseII)
    );
    status = profile.environmentalFacts.phaseI || profile.environmentalFacts.phaseII ? "needs_review" : "monitor_only";
    treatment = "not_counted";
    notes.push("Brownfield support remains monitor_only until environmental evidence exists.");
  }

  if (program.id === "ocra-cdbg-monitor") {
    status = "monitor_only";
    treatment = "not_counted";
    notes.push("Carmel may not fit rural OCRA pathways without a specific validated route.");
  }

  if (
    [
      "carmel-redevelopment-support",
      "carmel-tif-monitor",
      "carmel-bond-bank-monitor",
      "hamilton-county-edc-finance",
      "economic-development-revenue-bonds",
      "tax-increment-financing",
      "tax-abatement-support",
      "tourism-hospitality-support",
    ].includes(program.id)
  ) {
    evidence.push(
      buildEvidence("city-support", "city/county support letter", "Local support letter or equivalent record required.", profile.redevelopmentFacts.cityCountySupportLetter),
      buildEvidence("public-approval", "bond/TIF resolution if applicable", "Public-body approval or formal resolution is required.", profile.redevelopmentFacts.publicBodyApproval),
      buildEvidence("term-sheet", "lender term sheet", "Term sheet is required for underwriting.", profile.redevelopmentFacts.bondTermSheet)
    );
    status = evidence.some((item) => !item.satisfied) ? "needs_review" : "possible_match";
    treatment = status === "possible_match" ? "application_ready" : "estimated";
    notes.push("Bonds/TIF/redevelopment items stay needs_review without public-body approval evidence.");
  }

  if (program.id === "indiana-cpace-monitor") {
    evidence.push(
      buildEvidence("cpace-auth", "official source URL or citation label", "Local authorization and current program path required.", profile.redevelopmentFacts.localCpaceAuthorization),
      buildEvidence("lender-consent", "lender term sheet", "Senior lender consent for C-PACE is required.", profile.redevelopmentFacts.lenderConsentForCpace)
    );
    status = profile.redevelopmentFacts.localCpaceAuthorization && profile.redevelopmentFacts.lenderConsentForCpace
      ? "needs_review"
      : "monitor_only";
    treatment = "not_counted";
    notes.push("C-PACE is monitor_only unless local authorization and lender consent are verified.");
  }

  if (program.id === "doe-better-buildings-financing-navigator" || program.id === "dsire-indiana-registry") {
    status = "possible_match";
    treatment = "not_counted";
    notes.push("Reference registry/resource only — not direct committed capital.");
  }

  if (program.id === "in-hrtc") {
    status = profile.scopeFacts.headquartersRelocation ? "needs_review" : "monitor_only";
    treatment = "not_counted";
  }
  if (program.id === "in-data-center-sales-tax") {
    status = profile.scopeFacts.dataCenterScope ? "needs_review" : "not_applicable";
    treatment = "not_counted";
  }
  if (program.id === "in-manufacturing-readiness") {
    status = profile.scopeFacts.manufacturingScope ? "needs_review" : "not_applicable";
    treatment = "not_counted";
  }
  if (program.id === "in-engineering-grant") {
    status = profile.scopeFacts.qualifiedEngineeringWorkforce ? "needs_review" : "monitor_only";
    treatment = "not_counted";
  }
  if (program.id === "in-community-collaboration-fund") {
    status = profile.scopeFacts.entrepreneurialSupportTrack ? "needs_review" : "monitor_only";
    treatment = "not_counted";
  }

  return {
    programId: program.id,
    programName: program.name,
    category: program.category,
    status,
    fundingValueTreatment: treatment,
    estimatedAmount: 0,
    countsAsVerifiedFunds: false,
    matchReason: `Screened for ${profile.city}, ${profile.county}, ${profile.state}`,
    requiredEvidence: evidence,
    missingEvidence: missingEvidenceLabels(evidence),
    risks,
    notes,
  };
}

function buildTaxRequirements(profile: ClayTerraceIndianaProfile): IndianaTaxRequirement[] {
  const taxMemo = buildEvidence("tax-memo", "tax/accounting memo", "Tax memo is required for lender-safe treatment.", profile.taxCreditFacts.taxAccountingMemo);
  const legalMemo = buildEvidence("legal-memo", "legal memo", "Legal review required for final obligations treatment.", profile.taxCreditFacts.legalMemo);

  const defs = [
    {
      id: "in-sales-tax-lodging",
      name: "Indiana state sales tax on lodging/accommodations",
      sources: [official("Indiana DOR SIB 41", "https://www.in.gov/dor/files/sib41.pdf")],
    },
    {
      id: "hamilton-innkeepers-tax",
      name: "Hamilton County Innkeeper's Tax",
      sources: [official("Indiana DOR County Innkeeper Tax", "https://www.in.gov/dor/resources/tax-rates-and-reports/rates-fees-and-penalties/county-innkeepers-tax/")],
    },
    {
      id: "food-beverage-tax",
      name: "Food and Beverage Tax (if applicable)",
      sources: [official("Indiana DOR Rates", "https://www.in.gov/dor/resources/tax-rates-and-reports/")],
    },
    {
      id: "property-tax-review",
      name: "Property tax / assessed value / abatement review",
      sources: [official("Indiana DLGF", "https://www.in.gov/dlgf/")],
    },
    {
      id: "sales-use-materials-ffe",
      name: "Sales/use tax on construction materials and FF&E",
      sources: [official("Indiana DOR", "https://www.in.gov/dor/")],
    },
    {
      id: "corporate-tax-review",
      name: "Corporate income tax review",
      sources: [official("Indiana DOR", "https://www.in.gov/dor/")],
    },
    {
      id: "payroll-withholding-review",
      name: "Payroll withholding impacts for EDGE/SEF",
      sources: [official("Indiana DOR", "https://www.in.gov/dor/")],
    },
    {
      id: "tpp-tax-review",
      name: "Tangible personal property tax for hotel FF&E",
      sources: [official("Indiana DLGF", "https://www.in.gov/dlgf/")],
    },
  ] as const;

  return defs.map((item) => {
    const requiredEvidence = [taxMemo, legalMemo];
    return {
      id: item.id,
      name: item.name,
      status: requiredEvidence.some((entry) => !entry.satisfied) ? "needs_review" : "possible_match",
      sources: [...item.sources],
      obligationOnly: true,
      requiredEvidence,
      missingEvidence: missingEvidenceLabels(requiredEvidence),
      notes: ["Operating tax obligation only. Not a funding source."],
    };
  });
}

function buildCodeRequirements(profile: ClayTerraceIndianaProfile): IndianaCodeRequirement[] {
  const defs = [
    {
      id: "carmel-commercial-permit",
      name: "Carmel commercial/multifamily building permits",
      satisfied: profile.complianceFacts.permitApplicationsSubmitted,
      sources: [official("Carmel Building Safety", "https://www.carmel.in.gov/286/Building-Safety-Office")],
    },
    {
      id: "carmel-plan-review",
      name: "Carmel Building Safety review and inspections",
      satisfied: profile.complianceFacts.planReviewInProgress,
      sources: [official("Carmel Building Safety", "https://www.carmel.in.gov/286/Building-Safety-Office")],
    },
    {
      id: "carmel-zoning",
      name: "Carmel Unified Development Ordinance and zoning review",
      satisfied: profile.complianceFacts.zoningReviewed,
      sources: [official("Carmel Planning", "https://www.carmel.in.gov/")],
    },
    {
      id: "plan-commission-bza",
      name: "Carmel Plan Commission / BZA variance path",
      satisfied: profile.complianceFacts.zoningReviewed,
      sources: [official("Carmel Planning", "https://www.carmel.in.gov/")],
    },
    {
      id: "in-state-building-code",
      name: "State-adopted Indiana building code",
      satisfied: profile.complianceFacts.planReviewInProgress,
      sources: [official("Indiana DHS Code Book", "https://www.in.gov/dhs/fire-and-building-safety-code/indiana-code-book/")],
    },
    {
      id: "in-fire-prevention-commission",
      name: "Indiana Fire Prevention and Building Safety Commission",
      satisfied: profile.complianceFacts.fireCodeReviewed,
      sources: [official("Indiana DHS Boards and Commissions", "https://secure.in.gov/dhs/boards-and-commissions/?a=127119")],
    },
    {
      id: "in-fire-code",
      name: "Indiana Fire Code",
      satisfied: profile.complianceFacts.fireCodeReviewed,
      sources: [official("Indiana DHS Code Book", "https://www.in.gov/dhs/fire-and-building-safety-code/indiana-code-book/")],
    },
    {
      id: "in-mechanical-code",
      name: "Indiana Mechanical Code",
      satisfied: profile.complianceFacts.planReviewInProgress,
      sources: [official("Indiana DHS Code Book", "https://www.in.gov/dhs/fire-and-building-safety-code/indiana-code-book/")],
    },
    {
      id: "in-fuel-gas-code",
      name: "Indiana Fuel Gas Code",
      satisfied: profile.complianceFacts.planReviewInProgress,
      sources: [official("Indiana DHS Code Book", "https://www.in.gov/dhs/fire-and-building-safety-code/indiana-code-book/")],
    },
    {
      id: "in-electrical-code",
      name: "Indiana Electrical Code",
      satisfied: profile.complianceFacts.planReviewInProgress,
      sources: [official("Indiana DHS Code Book", "https://www.in.gov/dhs/fire-and-building-safety-code/indiana-code-book/")],
    },
    {
      id: "in-energy-conservation-code",
      name: "Indiana Energy Conservation Code",
      satisfied: profile.complianceFacts.energyCodeReviewed,
      sources: [official("Indiana DHS Code Book", "https://www.in.gov/dhs/fire-and-building-safety-code/indiana-code-book/")],
    },
    {
      id: "ada-review",
      name: "Accessibility / ADA review",
      satisfied: profile.complianceFacts.accessibilityReviewed,
      sources: [official("ADA Standards", "https://www.ada.gov/resources/2010-ada-standard-for-accessible-design/")],
    },
    {
      id: "elevator-lift-review",
      name: "Elevator/lift review",
      satisfied: profile.complianceFacts.elevatorReviewCompleted,
      sources: [official("Indiana DHS", "https://www.in.gov/dhs/fire-and-building-safety-code/")],
    },
    {
      id: "stormwater-utility-review",
      name: "Stormwater, drainage, utility, and engineering approval",
      satisfied: profile.complianceFacts.stormwaterReviewed,
      sources: [official("Carmel Engineering", "https://www.carmel.in.gov/")],
    },
    {
      id: "sign-permit",
      name: "Sign permits",
      satisfied: profile.complianceFacts.signPermitReviewed,
      sources: [official("Carmel Building Safety", "https://www.carmel.in.gov/286/Building-Safety-Office")],
    },
    {
      id: "health-department-review",
      name: "Health department / food service / pool/spa review",
      satisfied: profile.complianceFacts.healthDepartmentReviewed,
      sources: [official("Hamilton County Health", "https://www.hamiltoncounty.in.gov/")],
    },
  ] as const;

  return defs.map((item) => {
    const requiredEvidence = [buildEvidence("compliance-evidence", "permit applications", "Permit submission and plan-review evidence required.", item.satisfied)];
    return {
      id: item.id,
      name: item.name,
      status: item.satisfied ? "possible_match" : "blocked",
      sources: [...item.sources],
      requiredEvidence,
      missingEvidence: missingEvidenceLabels(requiredEvidence),
      blocksLenderReadyWhenMissing: true,
      notes: ["Code and permit compliance are obligations and can block lender readiness when incomplete."],
    };
  });
}

function toGrant(programMatch: IndianaProgramMatch, sources: IndianaProgramSource[]): IndianaGrantOption {
  return {
    id: programMatch.programId,
    name: programMatch.programName,
    status: programMatch.status,
    fundingValueTreatment: programMatch.fundingValueTreatment,
    estimatedAmount: programMatch.estimatedAmount,
    sources,
    requiredEvidence: programMatch.requiredEvidence,
    missingEvidence: programMatch.missingEvidence,
    notes: programMatch.notes,
  };
}

function toBond(programMatch: IndianaProgramMatch, sources: IndianaProgramSource[]): IndianaBondFinanceOption {
  return {
    id: programMatch.programId,
    name: programMatch.programName,
    status: programMatch.status,
    fundingValueTreatment: programMatch.fundingValueTreatment,
    sources,
    requiredEvidence: programMatch.requiredEvidence,
    missingEvidence: programMatch.missingEvidence,
    notes: programMatch.notes,
  };
}

function toEsg(programMatch: IndianaProgramMatch, sources: IndianaProgramSource[]): IndianaEsgIncentive {
  return {
    id: programMatch.programId,
    name: programMatch.programName,
    status: programMatch.status,
    fundingValueTreatment: programMatch.fundingValueTreatment,
    estimatedAmount: programMatch.estimatedAmount,
    countsAsVerifiedFunds: programMatch.countsAsVerifiedFunds,
    sources,
    requiredEvidence: programMatch.requiredEvidence,
    missingEvidence: programMatch.missingEvidence,
    notes: programMatch.notes,
  };
}

function amountTotals(profile: ClayTerraceIndianaProfile): IndianaProgramMatrixResult["summary"] {
  const estimatedFundingAmount = profile.fundingEvidence
    .filter((item) => item.treatment === "estimated" || item.treatment === "application_ready" || item.treatment === "submitted")
    .reduce((sum, item) => sum + item.amount, 0);
  const awardedFundingAmount = profile.fundingEvidence
    .filter((item) => item.treatment === "awarded")
    .reduce((sum, item) => sum + item.amount, 0);
  const verifiedFundingAmount = profile.fundingEvidence
    .filter((item) => item.treatment === "verified")
    .reduce((sum, item) => sum + item.amount, 0);
  const notCountedAmount = profile.fundingEvidence
    .filter((item) => item.treatment === "not_counted")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    totalProgramsScreened: 0,
    likelyMatches: 0,
    possibleMatches: 0,
    monitorOnly: 0,
    blockedOrNotApplicable: 0,
    taxObligations: 0,
    codeRequirements: 0,
    missingEvidenceCount: 0,
    estimatedFundingAmount,
    awardedFundingAmount,
    verifiedFundingAmount,
    notCountedAmount,
  };
}

export function assessIndianaProgramMatrix(profile: ClayTerraceIndianaProfile): IndianaProgramMatrixResult {
  const programMatches = INDIANA_PROGRAMS.map((program) => forProgram(profile, program));
  const programById = new Map(INDIANA_PROGRAMS.map((program) => [program.id, program]));

  const taxRequirements = buildTaxRequirements(profile);
  const codeRequirements = buildCodeRequirements(profile);

  const grants: IndianaGrantOption[] = programMatches
    .filter((program) => program.category === "grant")
    .map((program) => toGrant(program, programById.get(program.programId)?.sources ?? []));

  const bondsAndRedevelopment: IndianaBondFinanceOption[] = programMatches
    .filter((program) => program.category === "bonds_tif_redevelopment_finance")
    .map((program) => toBond(program, programById.get(program.programId)?.sources ?? []));

  const esgIncentives: IndianaEsgIncentive[] = programMatches
    .filter((program) => program.category === "esg_energy_incentive")
    .map((program) => toEsg(program, programById.get(program.programId)?.sources ?? []));

  const summary = amountTotals(profile);
  summary.totalProgramsScreened = programMatches.length;
  summary.likelyMatches = programMatches.filter((program) => program.status === "likely_match").length;
  summary.possibleMatches = programMatches.filter((program) => program.status === "possible_match" || program.status === "needs_review").length;
  summary.monitorOnly = programMatches.filter((program) => program.status === "monitor_only").length;
  summary.blockedOrNotApplicable = programMatches.filter((program) => program.status === "blocked" || program.status === "not_applicable").length;
  summary.taxObligations = taxRequirements.length;
  summary.codeRequirements = codeRequirements.length;
  summary.missingEvidenceCount =
    programMatches.reduce((sum, program) => sum + program.missingEvidence.length, 0) +
    taxRequirements.reduce((sum, item) => sum + item.missingEvidence.length, 0) +
    codeRequirements.reduce((sum, item) => sum + item.missingEvidence.length, 0);

  const blockedCode = codeRequirements.filter((item) => item.blocksLenderReadyWhenMissing && item.status !== "possible_match");
  const readiness = {
    lenderReady: blockedCode.length === 0,
    blockedReasons: blockedCode.map((item) => `${item.name} incomplete`),
  };

  const nextBestActions = [
    "Complete utility territory, zoning district, and parcel evidence for all Indiana/local matches.",
    "Close code and permit gaps before treating lender packet as externally ready.",
    "Convert estimated incentives to submitted/awarded/verified with official approvals and accounting memos.",
    "Collect public-body approval records for bonds/TIF/redevelopment pathways.",
  ];

  const reviewNotes = [
    "Taxes and code requirements are obligations, not funding sources.",
    "Estimated, submitted, awarded, and verified values remain separated and are not merged into one funding figure.",
    "No incentive is treated as verified without evidence and human/legal/accounting review.",
  ];

  return {
    projectName: profile.projectName,
    matches: programMatches,
    esgIncentives,
    grants,
    bondsAndRedevelopment,
    taxRequirements,
    codeRequirements,
    summary,
    readiness,
    nextBestActions,
    reviewNotes,
  };
}

export function getIndianaProgramCatalog(): IndianaProgram[] {
  return INDIANA_PROGRAMS;
}
