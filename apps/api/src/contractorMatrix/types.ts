// ── Contractor Matrix — Types ───────────────────────────────────────────
// Lender and RWA funding readiness support only.

export const TRADE_CATEGORIES = [
  "general_contractor",
  "architect",
  "civil_engineer",
  "surveyor",
  "geotechnical",
  "structural_engineer",
  "sitework",
  "concrete",
  "steel",
  "framing",
  "roofing",
  "envelope",
  "glazing",
  "mechanical_hvac",
  "electrical",
  "plumbing",
  "fire_sprinkler",
  "fire_alarm",
  "low_voltage",
  "elevator",
  "solar",
  "ev_charging",
  "energy_modeling",
  "commissioning",
  "landscaping",
  "paving",
  "signage",
  "ff_and_e",
  "hotel_equipment",
  "kitchen_food_service",
  "pool_spa",
  "environmental",
  "permit_expeditor",
  "insurance_broker",
  "title_escrow",
  "appraiser",
  "legal",
  "tax_accounting",
] as const;

export type TradeCategory = (typeof TRADE_CATEGORIES)[number];

export const TRADE_BID_STATUSES = ["not_requested", "requested", "received", "under_review", "approved", "rejected"] as const;
export type TradeBidStatus = (typeof TRADE_BID_STATUSES)[number];

export const LICENSE_STATUSES = ["verified", "unverified", "not_required", "expired", "missing"] as const;
export type LicenseStatus = (typeof LICENSE_STATUSES)[number];

export const INSURANCE_STATUSES = ["verified", "missing", "expired", "needs_review"] as const;
export type InsuranceStatus = (typeof INSURANCE_STATUSES)[number];

export const BONDING_STATUSES = ["adequate", "insufficient", "not_provided", "not_required"] as const;
export type BondingStatus = (typeof BONDING_STATUSES)[number];

export const LIEN_WAIVER_STATUSES = ["defined", "missing", "needs_review"] as const;
export type LienWaiverStatus = (typeof LIEN_WAIVER_STATUSES)[number];

export const SCHEDULE_RISK_STATUSES = ["low", "medium", "high"] as const;
export type ScheduleRiskStatus = (typeof SCHEDULE_RISK_STATUSES)[number];

export interface TradeRequirement {
  id: string;
  label: string;
  required: boolean;
  satisfied: boolean;
  reason?: string;
}

export interface ContractorEvidenceRequirement {
  id: string;
  label: string;
  required: boolean;
  provided: boolean;
}

export interface ContractorRisk {
  level: "low" | "medium" | "high";
  code:
    | "missing_w9"
    | "missing_license"
    | "missing_insurance"
    | "missing_bonding"
    | "missing_scope"
    | "missing_bid"
    | "missing_schedule"
    | "missing_drawings"
    | "missing_energy_specs"
    | "missing_lien_waiver"
    | "missing_permit_responsibility";
  message: string;
}

export interface ContractorFundingImpact {
  blocksLenderReadiness: boolean;
  blocksIncentiveReadiness: boolean;
  blocksCodeReadiness: boolean;
  note: string;
}

export interface ContractorProfile {
  id: string;
  legalCompanyName: string;
  tradeCategory: TradeCategory;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  businessAddress: string;
  w9Provided: boolean;
  licenseStatus: LicenseStatus;
  insuranceStatus: InsuranceStatus;
  bondingStatus: BondingStatus;
  bidStatus: TradeBidStatus;
  scopeOfWorkProvided: boolean;
  inclusionsExclusionsDefined: boolean;
  scheduleProvided: boolean;
  paymentTermsProvided: boolean;
  warrantyProvided: boolean;
  safetyPlanProvided: boolean;
  lienWaiverStatus: LienWaiverStatus;
  permitResponsibilityDefined: boolean;
  equipmentSpecsProvided: boolean;
  drawingsProvided: boolean;
  prevailingWageReviewed: boolean;
  apprenticeshipStatusReviewed: boolean;
  referencesProvided: boolean;
}

export interface ContractorReadinessItem {
  contractorId: string;
  legalCompanyName: string;
  tradeCategory: TradeCategory;
  status: "lender_ready" | "needs_review" | "evidence_missing" | "blocked";
  missingEvidence: string[];
  risks: ContractorRisk[];
  fundingImpact: ContractorFundingImpact;
}

export interface ContractorReadinessResult {
  projectName: string;
  status: "lender_ready" | "needs_review" | "evidence_missing" | "blocked";
  items: ContractorReadinessItem[];
  summary: {
    totalContractors: number;
    blockedCount: number;
    missingEvidenceCount: number;
    lenderBlockingCount: number;
    incentiveBlockingCount: number;
    codeBlockingCount: number;
  };
  nextBestActions: string[];
}
