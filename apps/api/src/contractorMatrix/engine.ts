import type {
  ContractorProfile,
  ContractorReadinessItem,
  ContractorReadinessResult,
  ContractorRisk,
  TradeCategory,
} from "./types.js";

const LENDER_CRITICAL_TRADES: TradeCategory[] = [
  "general_contractor",
  "architect",
  "structural_engineer",
  "mechanical_hvac",
  "electrical",
  "plumbing",
  "fire_sprinkler",
  "fire_alarm",
  "appraiser",
  "title_escrow",
  "legal",
  "tax_accounting",
];

const ENERGY_TRADES: TradeCategory[] = [
  "mechanical_hvac",
  "electrical",
  "solar",
  "ev_charging",
  "energy_modeling",
  "commissioning",
  "roofing",
  "envelope",
  "glazing",
];

const PERMIT_TRADES: TradeCategory[] = [
  "architect",
  "civil_engineer",
  "structural_engineer",
  "mechanical_hvac",
  "electrical",
  "plumbing",
  "fire_sprinkler",
  "fire_alarm",
  "permit_expeditor",
  "signage",
  "pool_spa",
  "kitchen_food_service",
];

function addRisk(risks: ContractorRisk[], missingEvidence: string[], condition: boolean, risk: ContractorRisk, evidenceLabel: string): void {
  if (!condition) return;
  risks.push(risk);
  missingEvidence.push(evidenceLabel);
}

function assessContractor(contractor: ContractorProfile): ContractorReadinessItem {
  const risks: ContractorRisk[] = [];
  const missingEvidence: string[] = [];

  addRisk(risks, missingEvidence, !contractor.w9Provided, {
    level: "high",
    code: "missing_w9",
    message: "W-9 is required for vendor onboarding and draw package support.",
  }, "W-9");

  addRisk(risks, missingEvidence, contractor.licenseStatus === "missing" || contractor.licenseStatus === "expired", {
    level: "high",
    code: "missing_license",
    message: "License/registration is missing or expired.",
  }, "license/registration");

  addRisk(risks, missingEvidence, contractor.insuranceStatus === "missing" || contractor.insuranceStatus === "expired", {
    level: "high",
    code: "missing_insurance",
    message: "Insurance evidence is missing or expired.",
  }, "insurance certificate");

  addRisk(risks, missingEvidence, !contractor.scopeOfWorkProvided || !contractor.inclusionsExclusionsDefined, {
    level: "medium",
    code: "missing_scope",
    message: "Scope of work and inclusions/exclusions must be defined.",
  }, "scope/inclusions/exclusions");

  addRisk(risks, missingEvidence, contractor.bidStatus !== "approved" && contractor.bidStatus !== "received", {
    level: "high",
    code: "missing_bid",
    message: "Bid/proposal is missing or not sufficiently advanced for lender review.",
  }, "bid/proposal");

  addRisk(risks, missingEvidence, !contractor.scheduleProvided, {
    level: "medium",
    code: "missing_schedule",
    message: "Schedule and lead-time evidence are required.",
  }, "schedule");

  addRisk(risks, missingEvidence, contractor.lienWaiverStatus === "missing", {
    level: "high",
    code: "missing_lien_waiver",
    message: "Lien waiver process is required for draw controls.",
  }, "lien waiver process");

  if (ENERGY_TRADES.includes(contractor.tradeCategory)) {
    addRisk(risks, missingEvidence, !contractor.equipmentSpecsProvided, {
      level: "high",
      code: "missing_energy_specs",
      message: "Energy-related trades require equipment specs for ESG/incentive pathways.",
    }, "equipment specs");
  }

  if (PERMIT_TRADES.includes(contractor.tradeCategory)) {
    addRisk(risks, missingEvidence, !contractor.drawingsProvided, {
      level: "high",
      code: "missing_drawings",
      message: "Permit-related trades require drawings for code review.",
    }, "drawings");

    addRisk(risks, missingEvidence, !contractor.permitResponsibilityDefined, {
      level: "high",
      code: "missing_permit_responsibility",
      message: "Permit responsibility must be assigned.",
    }, "permit responsibility");
  }

  const blocksLenderReadiness =
    LENDER_CRITICAL_TRADES.includes(contractor.tradeCategory) &&
    risks.some((risk) => ["missing_insurance", "missing_bid", "missing_scope", "missing_schedule", "missing_w9", "missing_license"].includes(risk.code));

  const blocksIncentiveReadiness =
    ENERGY_TRADES.includes(contractor.tradeCategory) &&
    risks.some((risk) => risk.code === "missing_energy_specs");

  const blocksCodeReadiness =
    PERMIT_TRADES.includes(contractor.tradeCategory) &&
    risks.some((risk) => risk.code === "missing_drawings" || risk.code === "missing_permit_responsibility");

  let status: ContractorReadinessItem["status"] = "lender_ready";
  if (blocksLenderReadiness || blocksCodeReadiness) status = "blocked";
  else if (missingEvidence.length > 0) status = "evidence_missing";
  else if (blocksIncentiveReadiness) status = "needs_review";

  return {
    contractorId: contractor.id,
    legalCompanyName: contractor.legalCompanyName,
    tradeCategory: contractor.tradeCategory,
    status,
    missingEvidence,
    risks,
    fundingImpact: {
      blocksLenderReadiness,
      blocksIncentiveReadiness,
      blocksCodeReadiness,
      note: "Contractor evidence affects lender, incentive, and code readiness independently.",
    },
  };
}

export function assessContractorMatrix(projectName: string, contractors: ContractorProfile[]): ContractorReadinessResult {
  const items = contractors.map(assessContractor);

  const blockedCount = items.filter((item) => item.status === "blocked").length;
  const lenderBlockingCount = items.filter((item) => item.fundingImpact.blocksLenderReadiness).length;
  const incentiveBlockingCount = items.filter((item) => item.fundingImpact.blocksIncentiveReadiness).length;
  const codeBlockingCount = items.filter((item) => item.fundingImpact.blocksCodeReadiness).length;
  const missingEvidenceCount = items.reduce((sum, item) => sum + item.missingEvidence.length, 0);

  let status: ContractorReadinessResult["status"] = "lender_ready";
  if (blockedCount > 0) status = "blocked";
  else if (missingEvidenceCount > 0) status = "evidence_missing";
  else if (incentiveBlockingCount > 0) status = "needs_review";

  return {
    projectName,
    status,
    items,
    summary: {
      totalContractors: contractors.length,
      blockedCount,
      missingEvidenceCount,
      lenderBlockingCount,
      incentiveBlockingCount,
      codeBlockingCount,
    },
    nextBestActions: [
      "Resolve blocked GC and permit-critical trade evidence first.",
      "Complete energy trade equipment specs to unlock ESG/incentive pathways.",
      "Ensure every lender-critical trade has approved bid, scope, schedule, insurance, and licensing evidence.",
    ],
  };
}
