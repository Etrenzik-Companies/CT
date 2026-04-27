// ── Packet Status — Engine ───────────────────────────────────────────────
// Calculates per-category packet completeness and lender-ready status.
// lender_ready is BLOCKED unless all requirements are met:
//   - evidence present
//   - evidence accepted by a human reviewer
//   - professional review complete where required
//   - no blockers active
//   - lender-use authorization on file

import type {
  PacketCategory,
  PacketStatus,
  PacketStatusInput,
  PacketStatusResult,
} from "./types.js";

// ── Required items per packet category ────────────────────────────────────
const REQUIRED_ITEMS: Record<PacketCategory, string[]> = {
  contractor: [
    "gc_insurance",
    "gc_bid",
    "gc_license",
    "gc_scope_of_work",
    "gc_w9",
  ],
  trade: [
    "trade_license",
    "trade_scope",
    "trade_bid",
    "trade_w9",
  ],
  funding: [
    "appraisal",
    "title_search",
    "survey",
    "bank_statement",
    "lender_term_sheet",
  ],
  rwa: [
    "rwa_legal_review",
    "xrpl_proof_reference",
    "human_approval_log",
  ],
  pof: [
    "pof_document",
    "bank_statement",
    "escrow_letter",
  ],
  esg_incentive: [
    "energy_model",
    "esg_certification",
    "grant_award_letter",
  ],
  code_permit: [
    "permit_set",
    "zoning_confirmation",
    "code_compliance_report",
    "fire_life_safety_report",
    "utility_confirmation",
  ],
  lender: [
    "appraisal",
    "title_search",
    "survey",
    "permit_set",
    "gc_insurance",
    "gc_bid",
    "bank_statement",
    "escrow_letter",
    "lender_term_sheet",
    "legal_memo",
    "tax_memo",
    "human_approval_log",
  ],
};

// ── Items that always require professional review ─────────────────────────
const PROFESSIONAL_REVIEW_REQUIRED = new Set<string>([
  "legal_memo",
  "tax_memo",
  "accounting_memo",
  "rwa_legal_review",
  "xrpl_proof_reference",
  "tax_credit_estimate",
  "grant_award_letter",
  "certification_179d",
  "equipment_specs_48e",
  "bond_tif_public_body_approval",
]);

// ── Compute status ─────────────────────────────────────────────────────────
export function assessPacketStatus(input: PacketStatusInput): PacketStatusResult {
  const required = REQUIRED_ITEMS[input.category];
  const itemMap = new Map(input.items.map((i) => [i.requirementId, i]));

  const missingRequirements: string[] = [];
  const activeBlockers: string[] = [];
  const lenderReadyBlockReasons: string[] = [];

  let totalPresent = 0;
  let totalAccepted = 0;

  for (const req of required) {
    const item = itemMap.get(req);

    if (!item || !item.present) {
      missingRequirements.push(req);
      lenderReadyBlockReasons.push(`Missing required evidence: ${req}`);
      continue;
    }

    totalPresent++;

    if (!item.accepted) {
      lenderReadyBlockReasons.push(`Evidence uploaded but not accepted by reviewer: ${req}`);
    } else {
      totalAccepted++;
    }

    if (PROFESSIONAL_REVIEW_REQUIRED.has(req) && !item.professionalReviewComplete) {
      lenderReadyBlockReasons.push(`Professional review (legal/tax/accounting) not complete: ${req}`);
    }

    for (const blocker of item.blockers) {
      activeBlockers.push(`${req}: ${blocker}`);
      lenderReadyBlockReasons.push(`Active blocker on ${req}: ${blocker}`);
    }
  }

  if (!input.lenderUseAuthorized) {
    lenderReadyBlockReasons.push("Lender-use authorization not on file.");
  }

  const lenderReadyBlocked = lenderReadyBlockReasons.length > 0;

  // ── Determine status ────────────────────────────────────────────────────
  let status: PacketStatus;
  if (missingRequirements.length === required.length) {
    status = "not_started";
  } else if (activeBlockers.length > 0) {
    status = "blocked";
  } else if (lenderReadyBlocked) {
    if (totalPresent === 0) {
      status = "not_started";
    } else if (totalAccepted === 0) {
      status = "evidence_received";
    } else if (totalAccepted < required.length) {
      status = "review_required";
    } else {
      status = "accepted_partial";
    }
  } else {
    // No blockers, all accepted, professional reviews done, authorization on file
    if (totalAccepted === required.length && missingRequirements.length === 0) {
      status = "lender_ready";
    } else if (totalAccepted > 0) {
      status = "accepted_complete";
    } else {
      status = "evidence_mapped";
    }
  }

  const summary =
    lenderReadyBlocked
      ? `${input.category} packet is NOT lender-ready. ${lenderReadyBlockReasons.length} issue(s) must be resolved.`
      : `${input.category} packet is lender-ready. All ${required.length} required items accepted and reviewed.`;

  return {
    category: input.category,
    projectName: input.projectName,
    status,
    totalRequired: required.length,
    totalPresent,
    totalAccepted,
    totalMissingRequired: missingRequirements.length,
    totalBlockers: activeBlockers.length,
    missingRequirements,
    activeBlockers,
    lenderReadyBlocked,
    lenderReadyBlockReasons,
    summary,
  };
}

export function assessAllPackets(
  projectName: string,
  inputs: Omit<PacketStatusInput, "projectName">[],
): PacketStatusResult[] {
  return inputs.map((i) => assessPacketStatus({ ...i, projectName }));
}
