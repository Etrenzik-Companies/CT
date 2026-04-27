// ── ESG Scorecard — Types ─────────────────────────────────────────────────
// For documentation and lender/investor reporting purposes only.
// All ESG estimates require qualified certification/verification.

export const ESG_METRIC_CATEGORIES = [
  "energy",
  "water",
  "emissions",
  "resilience",
  "indoor_air_quality",
  "community_impact",
  "workforce",
  "compliance",
  "documentation",
] as const;

export type EsgMetricCategory = (typeof ESG_METRIC_CATEGORIES)[number];

export const ESG_READINESS_STATUSES = [
  "certification_ready",
  "evidence_complete",
  "evidence_partial",
  "evidence_missing",
  "not_assessed",
] as const;

export type EsgReadinessStatus = (typeof ESG_READINESS_STATUSES)[number];

export interface EsgEvidenceReference {
  evidenceId: string;
  documentType: string;
  description: string;
  uploadedAt?: string;
}

export interface EsgMetric {
  category: EsgMetricCategory;
  metricName: string;
  baselineValue?: number;
  targetValue?: number;
  unit?: string;
  evidenceIds: string[];
  verificationStatus: "verified" | "estimated" | "not_provided";
  notes?: string;
}

export interface EnergyBenchmark {
  source: "energy_star_portfolio_manager" | "cbecs" | "ashrae_90_1" | "other";
  baselineEui?: number; // energy use intensity kBtu/sqft/yr
  targetEui?: number;
  reductiontargetPercent?: number;
  evidenceId?: string;
}

export interface CarbonReductionEstimate {
  baselineEmissions?: number; // MT CO2e/yr
  targetEmissions?: number;
  reductionPercent?: number;
  methodology?: string;
  evidenceId?: string;
  isEstimate: true;
}

export interface WaterReductionEstimate {
  baselineGallons?: number;
  targetGallons?: number;
  reductionPercent?: number;
  evidenceId?: string;
  isEstimate: true;
}

export interface ResilienceMetric {
  category: "flood" | "fire" | "wind" | "seismic" | "grid_outage" | "climate_adaptation" | "other";
  description: string;
  level: "high" | "medium" | "low" | "not_assessed";
  evidenceId?: string;
}

export interface CommunityImpactMetric {
  metricType: "affordable_units" | "jobs_created" | "local_contractor_spend" | "community_benefit_agreement" | "other";
  value?: number;
  unit?: string;
  description: string;
  evidenceId?: string;
}

export interface WorkforceImpactMetric {
  metricType:
    | "prevailing_wage"
    | "apprenticeship"
    | "local_hire"
    | "vet_preference"
    | "minority_contractor"
    | "women_owned"
    | "other";
  description: string;
  evidenceId?: string;
  certified: boolean;
}

export interface EsgScorecard {
  projectId: string;
  projectName: string;
  energyBenchmark?: EnergyBenchmark;
  carbonReduction?: CarbonReductionEstimate;
  waterReduction?: WaterReductionEstimate;
  metrics: EsgMetric[];
  resilienceMetrics: ResilienceMetric[];
  communityImpact: CommunityImpactMetric[];
  workforceImpact: WorkforceImpactMetric[];
  targetCertifications: string[]; // e.g. "LEED Silver", "ENERGY STAR", "ZERH"
  evidence: EsgEvidenceReference[];
  notes?: string;
}

export interface EsgCategoryScore {
  category: EsgMetricCategory;
  score: number; // 0–100
  missingEvidence: string[];
  reviewNotes: string[];
}

export interface EsgScorecardResult {
  projectId: string;
  status: EsgReadinessStatus;
  overallScore: number; // 0–100
  categoryScores: EsgCategoryScore[];
  missingEvidence: string[];
  blockedReasons: string[];
  reviewNotes: string[];
}
