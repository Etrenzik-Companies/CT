export const TRADE_CATEGORIES = [
  "general_contractor",
  "construction_manager",
  "sitework",
  "concrete",
  "structural_steel",
  "framing",
  "roofing",
  "exterior_envelope",
  "glazing",
  "drywall",
  "painting",
  "flooring",
  "millwork",
  "doors_hardware",
  "plumbing",
  "hvac_mechanical",
  "electrical",
  "low_voltage",
  "fire_alarm",
  "fire_suppression",
  "elevators",
  "kitchen_equipment",
  "laundry_equipment",
  "ffe",
  "signage",
  "landscaping",
  "civil_engineering",
  "structural_engineering",
  "mep_engineering",
  "architecture",
  "interior_design",
  "lighting_design",
  "energy_modeling",
  "solar_renewables",
  "ev_charging",
  "commissioning",
  "testing_inspections",
  "environmental",
  "survey",
  "title",
  "insurance",
  "legal",
  "tax_cpa",
  "appraisal",
  "market_study"
] as const;

export type TradeCategory = (typeof TRADE_CATEGORIES)[number];

export type ContractorStatus =
  | "identified"
  | "contacted"
  | "quote_requested"
  | "quote_received"
  | "under_review"
  | "approved"
  | "engaged"
  | "rejected"
  | "inactive";

export interface ContractorProfile {
  id: string;
  companyName: string;
  tradeCategories: TradeCategory[];
  quoteStatus: "not_requested" | "requested" | "received" | "approved";
  engagementStatus: ContractorStatus;
  signedEngagementEvidenceId: string;
}

export interface EstimateLineItem {
  id: string;
  tradeCategory: TradeCategory;
  originalBudget: number;
  currentEstimate: number;
}

export interface BidPackage {
  id: string;
  status:
    | "draft"
    | "ready_to_send"
    | "sent"
    | "bidder_questions"
    | "addendum_issued"
    | "bids_received"
    | "leveling"
    | "recommendation"
    | "awarded"
    | "contracted"
    | "declined"
    | "closed";
  approvedBidId: string;
}

export interface CodeFact {
  codeName: string;
  jurisdiction: string;
  version: string;
  effectiveDate: string;
  sourceUrl: string;
}

export interface PermitRecord {
  id: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  evidenceArtifactId: string;
}

export interface IncentiveRecord {
  id: string;
  type: "tax" | "rebate" | "grant";
  status: "identified" | "applied" | "approved" | "awarded" | "monetized";
  approvalEvidenceId: string;
  requiresCpaReview: boolean;
}

export interface RagAnswer {
  answer: string;
  citations: Array<{ sourceDocumentId: string; chunkId: string }>;
}

export interface MappedToolAction {
  role: string;
  toolName: string;
  sideEffectLevel: "read" | "write" | "critical";
}

export interface AgentPolicy {
  agentName: string;
  allowedTools: string[];
  forbiddenTools: string[];
}

export interface ProjectTemplate {
  id: string;
  type:
    | "hotel_development"
    | "multifamily"
    | "retail"
    | "mixed_use"
    | "office"
    | "industrial"
    | "renewable_energy"
    | "infrastructure"
    | "adaptive_reuse"
    | "carbon_zero_retrofit";
}

export interface ProjectInstance {
  id: string;
  name: string;
  templateId: string;
  location: string;
  jurisdiction: string;
  isPrimaryClayTerrace: boolean;
}
