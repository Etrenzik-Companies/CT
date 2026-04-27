// ── Funding Intelligence — Types ──────────────────────────────────────────
// For documentation and diligence purposes only.
// Not financial advice. All matches require review by qualified professionals.

export const FUNDING_PROGRAM_TYPES = [
  "senior_debt",
  "bridge_loan",
  "construction_loan",
  "mezzanine",
  "sponsor_equity",
  "grant",
  "tax_credit",
  "rebate",
  "green_bank",
  "cpace",
  "private_credit",
  "receivable_financing",
  "equipment_financing",
  "other",
] as const;

export type FundingProgramType = (typeof FUNDING_PROGRAM_TYPES)[number];

export const FUNDING_READINESS_STATUSES = [
  "submission_ready",
  "internally_ready",
  "gaps_to_resolve",
  "needs_review",
  "blocked",
] as const;

export type FundingReadinessStatus = (typeof FUNDING_READINESS_STATUSES)[number];

export interface LenderRequirement {
  requirementType: string;
  description: string;
  met: boolean | "unknown";
  evidenceId?: string;
}

export interface FundingProgram {
  id: string;
  name: string;
  programType: FundingProgramType;
  lenderOrSource: string;
  jurisdiction: string; // "national", "GA", "Southeast", etc.
  minProjectCost?: number;
  maxProjectCost?: number;
  minLtvRatio?: number;
  maxLtvRatio?: number;
  typicalRate?: string; // descriptive only — not a quote
  typicalTerm?: string; // descriptive only
  description: string;
  requirements: LenderRequirement[];
  esgBonus?: string; // note if ESG improves terms
  referenceUrl?: string;
  isPotential: true; // all programs are potential until committed
}

export interface FundingMatchResult {
  programId: string;
  programName: string;
  programType: FundingProgramType;
  status: "potential" | "needs_info" | "likely_ineligible";
  matchScore: number; // 0–100 based on met requirements
  metRequirements: string[];
  unmetRequirements: string[];
  unknownRequirements: string[];
  recommendedNextSteps: string[];
  reviewNote: string;
}

export interface SubmissionPacket {
  projectId: string;
  projectName: string;
  projectCost: number;
  currency: string;
  rwaReadinessStatus?: string;
  pofStatus?: string;
  esgScore?: number;
  incentiveMatchCount?: number;
  capitalStack?: Array<{ label: string; amount: number; position: string; committed: boolean }>;
  notes?: string;
}

export interface ReadinessScore {
  overall: number; // 0–100
  rwa: number;
  pof: number;
  esg: number;
  incentiveAlignment: number;
}

export interface FundingIntelligenceResult {
  projectId: string;
  status: FundingReadinessStatus;
  readinessScore: ReadinessScore;
  potentialMatches: FundingMatchResult[];
  committedMatches: FundingMatchResult[];
  capitalGap: number;
  nextBestSteps: string[];
  blockedReasons: string[];
  reviewNotes: string[];
}
