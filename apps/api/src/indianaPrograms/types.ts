// ── Indiana Program Matrix — Types ───────────────────────────────────────
// Official-source planning and diligence support only.
// No legal, tax, accounting, or investment advice is provided.

export const INDIANA_PROGRAM_CATEGORIES = [
  "esg_energy_incentive",
  "grant",
  "tax_credit_deduction",
  "bonds_tif_redevelopment_finance",
  "hotel_local_tax_obligation",
  "code_permit_compliance",
] as const;

export type IndianaProgramCategory = (typeof INDIANA_PROGRAM_CATEGORIES)[number];

export const INDIANA_ELIGIBILITY_STATUSES = [
  "likely_match",
  "possible_match",
  "monitor_only",
  "not_applicable",
  "blocked",
  "needs_review",
  "verified",
] as const;

export type IndianaEligibilityStatus = (typeof INDIANA_ELIGIBILITY_STATUSES)[number];

export const INDIANA_SOURCE_CONFIDENCE = [
  "official_source",
  "public_database",
  "local_record",
  "internal_project_document",
  "user_uploaded_evidence",
  "unknown",
] as const;

export type IndianaSourceConfidence = (typeof INDIANA_SOURCE_CONFIDENCE)[number];

export const FUNDING_VALUE_TREATMENTS = [
  "estimated",
  "application_ready",
  "submitted",
  "awarded",
  "verified",
  "not_counted",
] as const;

export type FundingValueTreatment = (typeof FUNDING_VALUE_TREATMENTS)[number];

export interface IndianaProgramSource {
  label: string;
  url: string;
  confidence: IndianaSourceConfidence;
}

export interface IndianaEvidenceRequirement {
  id: string;
  label: string;
  description: string;
  required: boolean;
  satisfied: boolean;
}

export interface IndianaProgramRisk {
  level: "low" | "medium" | "high";
  reason: string;
}

export interface IndianaProgram {
  id: string;
  name: string;
  category: IndianaProgramCategory;
  description: string;
  sources: IndianaProgramSource[];
}

export interface IndianaProgramMatch {
  programId: string;
  programName: string;
  category: IndianaProgramCategory;
  status: IndianaEligibilityStatus;
  fundingValueTreatment: FundingValueTreatment;
  estimatedAmount: number;
  countsAsVerifiedFunds: boolean;
  matchReason: string;
  requiredEvidence: IndianaEvidenceRequirement[];
  missingEvidence: string[];
  risks: IndianaProgramRisk[];
  notes: string[];
}

export interface IndianaTaxRequirement {
  id: string;
  name: string;
  status: IndianaEligibilityStatus;
  sources: IndianaProgramSource[];
  obligationOnly: true;
  requiredEvidence: IndianaEvidenceRequirement[];
  missingEvidence: string[];
  notes: string[];
}

export interface IndianaCodeRequirement {
  id: string;
  name: string;
  status: IndianaEligibilityStatus;
  sources: IndianaProgramSource[];
  requiredEvidence: IndianaEvidenceRequirement[];
  missingEvidence: string[];
  blocksLenderReadyWhenMissing: boolean;
  notes: string[];
}

export interface IndianaBondFinanceOption {
  id: string;
  name: string;
  status: IndianaEligibilityStatus;
  fundingValueTreatment: FundingValueTreatment;
  sources: IndianaProgramSource[];
  requiredEvidence: IndianaEvidenceRequirement[];
  missingEvidence: string[];
  notes: string[];
}

export interface IndianaGrantOption {
  id: string;
  name: string;
  status: IndianaEligibilityStatus;
  fundingValueTreatment: FundingValueTreatment;
  estimatedAmount: number;
  sources: IndianaProgramSource[];
  requiredEvidence: IndianaEvidenceRequirement[];
  missingEvidence: string[];
  notes: string[];
}

export interface IndianaEsgIncentive {
  id: string;
  name: string;
  status: IndianaEligibilityStatus;
  fundingValueTreatment: FundingValueTreatment;
  estimatedAmount: number;
  countsAsVerifiedFunds: boolean;
  sources: IndianaProgramSource[];
  requiredEvidence: IndianaEvidenceRequirement[];
  missingEvidence: string[];
  notes: string[];
}

export interface ClayTerraceIndianaProfile {
  projectName: string;
  city: string;
  county: string;
  state: string;
  keys: number;
  totalBudget: number;
  equityAmount: number;
  debtAmount: number;
  assetTypes: string[];
  projectAddressKnown: boolean;
  parcelKnown: boolean;
  zoningDistrictKnown: boolean;
  utilityTerritoryKnown: boolean;
  utilities: {
    dukeIndiana: boolean;
    aesIndiana: boolean;
  };
  energyScope: {
    hvac: boolean;
    envelope: boolean;
    lighting: boolean;
    solarReady: boolean;
    evCharging: boolean;
    waterEfficiency: boolean;
  };
  jobsWorkforce: {
    jobCreationSchedule: boolean;
    payrollEstimates: boolean;
    workforceTrainingPlan: boolean;
  };
  redevelopmentFacts: {
    cityCountySupportLetter: boolean;
    publicBodyApproval: boolean;
    bondTermSheet: boolean;
    tifResolution: boolean;
    taxAbatementRequest: boolean;
    localCpaceAuthorization: boolean;
    lenderConsentForCpace: boolean;
  };
  environmentalFacts: {
    phaseI: boolean;
    phaseII: boolean;
    brownfieldDetermination: boolean;
  };
  scopeFacts: {
    headquartersRelocation: boolean;
    dataCenterScope: boolean;
    manufacturingScope: boolean;
    qualifiedEngineeringWorkforce: boolean;
    entrepreneurialSupportTrack: boolean;
  };
  taxCreditFacts: {
    iedcApplicationSubmitted: boolean;
    energyModelComplete: boolean;
    section179dCertification: boolean;
    grossSquareFootageKnown: boolean;
    equipmentSpecsComplete: boolean;
    placedInServiceDateKnown: boolean;
    taxOwnershipDocumented: boolean;
    lowIncomeBonusEligibilityChecked: boolean;
    transferabilityReviewed: boolean;
    taxAccountingMemo: boolean;
    legalMemo: boolean;
  };
  complianceFacts: {
    permitApplicationsSubmitted: boolean;
    planReviewInProgress: boolean;
    zoningReviewed: boolean;
    fireCodeReviewed: boolean;
    energyCodeReviewed: boolean;
    accessibilityReviewed: boolean;
    stormwaterReviewed: boolean;
    signPermitReviewed: boolean;
    healthDepartmentReviewed: boolean;
    elevatorReviewCompleted: boolean;
    humanApprovalLog: boolean;
  };
  fundingEvidence: Array<{
    programId: string;
    treatment: FundingValueTreatment;
    amount: number;
  }>;
}

export interface IndianaProgramMatrixResult {
  projectName: string;
  matches: IndianaProgramMatch[];
  esgIncentives: IndianaEsgIncentive[];
  grants: IndianaGrantOption[];
  bondsAndRedevelopment: IndianaBondFinanceOption[];
  taxRequirements: IndianaTaxRequirement[];
  codeRequirements: IndianaCodeRequirement[];
  summary: {
    totalProgramsScreened: number;
    likelyMatches: number;
    possibleMatches: number;
    monitorOnly: number;
    blockedOrNotApplicable: number;
    taxObligations: number;
    codeRequirements: number;
    missingEvidenceCount: number;
    estimatedFundingAmount: number;
    awardedFundingAmount: number;
    verifiedFundingAmount: number;
    notCountedAmount: number;
  };
  readiness: {
    lenderReady: boolean;
    blockedReasons: string[];
  };
  nextBestActions: string[];
  reviewNotes: string[];
}