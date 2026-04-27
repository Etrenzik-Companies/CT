// ── Proof-of-Funds — Engine ────────────────────────────────────────────────
// For internal diligence and lender submission review only.
// Not financial advice. Estimated incentives are NEVER counted as verified.
// All PoF outputs require legal and lender review before any submission.

import type {
  FundingSource,
  GapAnalysis,
  PofReadinessResult,
  PofReadinessStatus,
  ProofOfFundsPacket,
} from "./types.js";

const ESTIMATED_SOURCE_TYPES = new Set([
  "grant",
  "tax_credit_proceeds",
  "rebate",
  "cpace",
  "unverified_estimate",
]);

function isEstimated(source: FundingSource): boolean {
  return source.isEstimated || ESTIMATED_SOURCE_TYPES.has(source.sourceType);
}

function findMissingEvidence(sources: FundingSource[]): string[] {
  const missing: string[] = [];
  for (const s of sources) {
    if (s.isVerified && !s.evidenceId && !s.bankEvidence?.evidenceId && !s.blockchainEvidence?.evidenceId) {
      missing.push(`Source "${s.label}" is marked verified but has no evidence document`);
    }
    if (s.sourceType === "bank_deposit" && !s.bankEvidence) {
      missing.push(`Bank deposit source "${s.label}" has no bank evidence record`);
    }
    if (
      (s.sourceType === "xrpl_blockchain_reference" || s.sourceType === "other_blockchain_reference") &&
      !s.blockchainEvidence
    ) {
      missing.push(`Blockchain source "${s.label}" has no blockchain evidence record`);
    }
  }
  return missing;
}

function computeGapAnalysis(packet: ProofOfFundsPacket): GapAnalysis {
  const totalProjectCost = packet.projectCost;

  let totalVerifiedFunds = 0;
  let totalEstimatedFunds = 0;
  let totalUnverifiedFunds = 0;

  for (const s of packet.fundingSources) {
    if (isEstimated(s)) {
      totalEstimatedFunds += s.amount;
    } else if (s.isVerified) {
      totalVerifiedFunds += s.amount;
    } else {
      totalUnverifiedFunds += s.amount;
    }
  }

  return {
    totalProjectCost,
    totalVerifiedFunds,
    totalEstimatedFunds,
    totalUnverifiedFunds,
    capitalGap: totalProjectCost - totalVerifiedFunds,
    estimatedGap: totalProjectCost - totalVerifiedFunds - totalEstimatedFunds,
  };
}

export function assessProofOfFunds(packet: ProofOfFundsPacket): PofReadinessResult {
  const gapAnalysis = computeGapAnalysis(packet);
  const missingEvidence = findMissingEvidence(packet.fundingSources);

  const blockedReasons: string[] = [];

  if (gapAnalysis.capitalGap > 0) {
    blockedReasons.push(
      `Capital gap of $${gapAnalysis.capitalGap.toLocaleString()} — verified funds do not cover project cost`
    );
  }
  if (missingEvidence.length > 0) {
    blockedReasons.push("Evidence documents missing for one or more verified sources");
  }
  if (packet.lenderAuthorizations.length === 0) {
    blockedReasons.push("No lender use authorizations on file");
  }
  if (packet.fundingSources.length === 0) {
    blockedReasons.push("No funding sources provided");
  }

  const verifiedSourcesCount = packet.fundingSources.filter((s) => s.isVerified && !isEstimated(s)).length;
  const estimatedSourcesCount = packet.fundingSources.filter(isEstimated).length;

  let status: PofReadinessStatus;
  if (packet.fundingSources.length === 0 || blockedReasons.some((r) => r.includes("gap"))) {
    status = gapAnalysis.capitalGap > 0 ? "gap_unresolved" : "blocked";
  } else if (missingEvidence.length > 0 || packet.lenderAuthorizations.length === 0) {
    status = "evidence_missing";
  } else if (blockedReasons.length === 0 && gapAnalysis.capitalGap <= 0) {
    // Check if lender-ready (all sources verified, no estimates)
    status = estimatedSourcesCount > 0 ? "internally_ready" : "lender_ready";
  } else {
    status = "evidence_missing";
  }

  const reviewNotes = [
    "Estimated incentives (grants, tax credits, rebates, C-PACE) are NEVER counted as verified capital.",
    "All PoF outputs are for internal review only — not a substitute for lender-verified proof of funds.",
    "Blockchain evidence must be backed by verifiable on-chain records and qualified legal attestation.",
    "Lender authorization letters must be reviewed by legal counsel before submission.",
  ];

  return {
    packetId: packet.id,
    status,
    gapAnalysis,
    verifiedSourcesCount,
    estimatedSourcesCount,
    missingEvidence,
    blockedReasons,
    reviewNotes,
  };
}
