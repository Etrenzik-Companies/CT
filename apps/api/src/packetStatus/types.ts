// ── Packet Status — Types ────────────────────────────────────────────────
// Calculates lender-ready status for each packet category.
// lender_ready requires: accepted evidence + human review + no blockers.

export const PACKET_CATEGORIES = [
  "contractor",
  "trade",
  "funding",
  "rwa",
  "pof",
  "esg_incentive",
  "code_permit",
  "lender",
] as const;
export type PacketCategory = (typeof PACKET_CATEGORIES)[number];

export const PACKET_STATUSES = [
  "not_started",
  "evidence_received",
  "evidence_mapped",
  "review_required",
  "accepted_partial",
  "accepted_complete",
  "lender_ready",
  "blocked",
] as const;
export type PacketStatus = (typeof PACKET_STATUSES)[number];

export interface PacketEvidenceItem {
  requirementId: string;
  /** Whether the evidence file has been submitted (present). */
  present: boolean;
  /** Whether a human reviewer has accepted the evidence. */
  accepted: boolean;
  /** Whether a legal/tax/accounting review has been completed. */
  professionalReviewComplete: boolean;
  /** Specific blocker conditions on this item. */
  blockers: string[];
}

export interface PacketStatusInput {
  category: PacketCategory;
  projectName: string;
  items: PacketEvidenceItem[];
  /** Whether lender-use authorization has been provided. */
  lenderUseAuthorized: boolean;
}

export interface PacketStatusResult {
  category: PacketCategory;
  projectName: string;
  status: PacketStatus;
  totalRequired: number;
  totalPresent: number;
  totalAccepted: number;
  totalMissingRequired: number;
  totalBlockers: number;
  missingRequirements: string[];
  activeBlockers: string[];
  lenderReadyBlocked: boolean;
  lenderReadyBlockReasons: string[];
  summary: string;
}
