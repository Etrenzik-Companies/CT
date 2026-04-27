// ── RWA Asset Registry — Types ─────────────────────────────────────────────
// All outputs are for documentation, diligence, and review purposes only.
// No legal, investment, or financial advice is provided or implied.

export const ASSET_TYPES = [
  "real_estate",
  "construction_project",
  "energy_system",
  "solar",
  "battery_storage",
  "hvac",
  "equipment",
  "receivable",
  "contract_right",
  "precious_metal_reference",
  "other",
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

export const ASSET_READINESS_STATUSES = [
  "lender_ready",
  "needs_evidence",
  "needs_review",
  "blocked",
] as const;

export type AssetReadinessStatus = (typeof ASSET_READINESS_STATUSES)[number];

export interface AssetLocation {
  street?: string;
  city: string;
  state: string;
  county?: string;
  zip?: string;
  country: string;
  parcelId?: string;
}

export interface OwnershipRecord {
  ownerName: string;
  ownerType: "individual" | "llc" | "lp" | "corporation" | "trust" | "other";
  ownershipPercent: number;
  evidenceId?: string;
}

export interface ValuationRecord {
  valuationAmount: number;
  valuationDate: string;
  valuationMethod: "appraisal" | "bpo" | "cost_approach" | "income_approach" | "market" | "self_reported";
  appraiserName?: string;
  evidenceId?: string;
}

export interface LienRecord {
  lienholder: string;
  amount: number;
  position: number;
  maturityDate?: string;
  evidenceId?: string;
}

export interface InsuranceRecord {
  carrier: string;
  policyType: "general_liability" | "builders_risk" | "property" | "professional" | "other";
  coverageAmount: number;
  expiryDate: string;
  evidenceId?: string;
}

export interface AppraisalRecord {
  appraiserName: string;
  appraisalDate: string;
  appraisedValue: number;
  reportType: "full" | "restricted" | "desk_review" | "bpo";
  evidenceId?: string;
}

export interface EvidenceReference {
  evidenceId: string;
  documentType: string;
  description: string;
  uploadedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface RwaAsset {
  id: string;
  name: string;
  assetType: AssetType;
  location: AssetLocation;
  ownership: OwnershipRecord[];
  valuations: ValuationRecord[];
  liens: LienRecord[];
  insurance: InsuranceRecord[];
  appraisals: AppraisalRecord[];
  evidence: EvidenceReference[];
  projectCost?: number;
  estimatedCompletionDate?: string;
  notes?: string;
}

export interface RwaReadinessResult {
  assetId: string;
  status: AssetReadinessStatus;
  evidenceCompleteness: number; // 0–100
  missingDocuments: string[];
  legalGaps: string[];
  titleGaps: string[];
  lienGaps: string[];
  insuranceGaps: string[];
  appraisalGaps: string[];
  blockedReasons: string[];
  reviewNotes: string[];
}
