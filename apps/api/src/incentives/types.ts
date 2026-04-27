// ── Tax Incentive Intelligence — Types ────────────────────────────────────
// For identification and diligence purposes only.
// Estimated incentive amounts are never verified funds.
// All incentive outputs require review by a qualified tax professional.

export const INCENTIVE_SOURCES = [
  "irs_federal",
  "doe_federal",
  "epa",
  "hud",
  "usda",
  "state_revenue_dept",
  "state_energy_office",
  "utility_rebate",
  "local_government",
  "green_bank",
  "dsire",
  "energy_star",
  "other",
] as const;

export type IncentiveSource = (typeof INCENTIVE_SOURCES)[number];

export const INCENTIVE_CATEGORIES = [
  "federal_tax_credit",
  "state_tax_credit",
  "property_tax_exemption_abatement",
  "grant",
  "rebate",
  "low_interest_loan",
  "cpace_financing",
  "deduction",
  "utility_program",
  "certification_bonus",
  "other",
] as const;

export type IncentiveCategory = (typeof INCENTIVE_CATEGORIES)[number];

export const INCENTIVE_MATCH_STATUSES = [
  "likely_match",
  "possible_match",
  "needs_review",
  "not_eligible",
] as const;

export type IncentiveMatchStatus = (typeof INCENTIVE_MATCH_STATUSES)[number];

export interface Jurisdiction {
  country: string;
  state: string;
  county?: string;
  city?: string;
}

export interface EligibilityRule {
  description: string;
  met: boolean | "unknown";
}

export interface RequiredDocument {
  documentType: string;
  description: string;
  required: boolean;
}

export interface EstimatedBenefit {
  minAmount?: number;
  maxAmount?: number;
  unit: "dollar" | "percent" | "per_sqft" | "per_kwh" | "per_therm" | "other";
  note: string; // always note it's an estimate
}

export interface ApplicationDeadline {
  type: "rolling" | "annual" | "one_time" | "unknown";
  deadlineDate?: string;
  note?: string;
}

export interface IncentiveProgram {
  id: string;
  name: string;
  source: IncentiveSource;
  category: IncentiveCategory;
  jurisdiction: Jurisdiction;
  description: string;
  eligibilityRules: EligibilityRule[];
  requiredDocuments: RequiredDocument[];
  estimatedBenefit: EstimatedBenefit;
  applicationDeadline: ApplicationDeadline;
  referenceUrl?: string;
  irsSection?: string; // e.g. "45L", "179D", "48E"
}

export interface IncentiveMatchResult {
  programId: string;
  programName: string;
  status: IncentiveMatchStatus;
  matchReason: string;
  estimatedBenefit: EstimatedBenefit;
  missingEligibilityInfo: string[];
  requiredNextSteps: string[];
  reviewNote: string;
}
