// ── RWA Asset Registry — Engine ────────────────────────────────────────────
// For documentation, diligence, and review purposes only.
// No legal, investment, or financial advice provided or implied.

import type {
  RwaAsset,
  RwaReadinessResult,
} from "./types.js";

const REQUIRED_DOC_TYPES = [
  "title_report",
  "deed_or_ownership_record",
  "appraisal_report",
  "insurance_certificate",
  "survey",
  "environmental_phase_1",
] as const;

function scoreEvidence(asset: RwaAsset): number {
  if (asset.evidence.length === 0) return 0;
  const requiredPresent = REQUIRED_DOC_TYPES.filter((req) =>
    asset.evidence.some((e) => e.documentType === req)
  ).length;
  return Math.round((requiredPresent / REQUIRED_DOC_TYPES.length) * 100);
}

function findMissingDocuments(asset: RwaAsset): string[] {
  return REQUIRED_DOC_TYPES.filter(
    (req) => !asset.evidence.some((e) => e.documentType === req)
  );
}

function findLegalGaps(asset: RwaAsset): string[] {
  const gaps: string[] = [];
  if (asset.ownership.length === 0) gaps.push("No ownership records");
  const totalOwnership = asset.ownership.reduce((s, o) => s + o.ownershipPercent, 0);
  if (asset.ownership.length > 0 && Math.abs(totalOwnership - 100) > 0.01) {
    gaps.push(`Ownership percentage totals ${totalOwnership}% (must equal 100%)`);
  }
  if (!asset.evidence.some((e) => e.documentType === "deed_or_ownership_record")) {
    gaps.push("Deed or ownership record not uploaded");
  }
  return gaps;
}

function findTitleGaps(asset: RwaAsset): string[] {
  const gaps: string[] = [];
  if (!asset.evidence.some((e) => e.documentType === "title_report")) {
    gaps.push("Title report missing");
  }
  if (!asset.evidence.some((e) => e.documentType === "survey")) {
    gaps.push("Survey missing");
  }
  return gaps;
}

function findLienGaps(asset: RwaAsset): string[] {
  const gaps: string[] = [];
  for (const lien of asset.liens) {
    if (!lien.evidenceId) {
      gaps.push(`Lien held by ${lien.lienholder} has no supporting evidence`);
    }
  }
  return gaps;
}

function findInsuranceGaps(asset: RwaAsset): string[] {
  const gaps: string[] = [];
  if (asset.insurance.length === 0) {
    gaps.push("No insurance records on file");
  } else {
    const today = new Date().toISOString().slice(0, 10);
    for (const ins of asset.insurance) {
      if (ins.expiryDate < today) {
        gaps.push(`${ins.policyType} policy expired ${ins.expiryDate}`);
      }
    }
  }
  return gaps;
}

function findAppraisalGaps(asset: RwaAsset): string[] {
  const gaps: string[] = [];
  if (asset.appraisals.length === 0) {
    gaps.push("No appraisal on file");
  } else {
    // Flag appraisals older than 12 months
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    for (const appr of asset.appraisals) {
      if (appr.appraisalDate < cutoffStr) {
        gaps.push(`Appraisal dated ${appr.appraisalDate} is more than 12 months old`);
      }
    }
  }
  return gaps;
}

export function assessRwaAsset(asset: RwaAsset): RwaReadinessResult {
  const missingDocuments = findMissingDocuments(asset);
  const legalGaps = findLegalGaps(asset);
  const titleGaps = findTitleGaps(asset);
  const lienGaps = findLienGaps(asset);
  const insuranceGaps = findInsuranceGaps(asset);
  const appraisalGaps = findAppraisalGaps(asset);
  const evidenceCompleteness = scoreEvidence(asset);

  const blockedReasons: string[] = [];
  const reviewNotes: string[] = [
    "All outputs are for diligence review only — not legal or financial advice.",
    "Consult qualified legal counsel before using any asset record in a lender submission.",
  ];

  const allGaps = [
    ...missingDocuments,
    ...legalGaps,
    ...titleGaps,
    ...lienGaps,
    ...insuranceGaps,
    ...appraisalGaps,
  ];

  if (missingDocuments.length > 0) {
    blockedReasons.push("Required lender documents missing");
  }
  if (legalGaps.length > 0) {
    blockedReasons.push("Legal/ownership gaps identified — legal review required");
  }
  if (evidenceCompleteness < 50) {
    blockedReasons.push("Evidence completeness below 50% — not submission-ready");
  }

  let status: RwaReadinessResult["status"];
  if (blockedReasons.length > 0) {
    status = allGaps.some((g) => g.includes("ownership") || g.includes("Title") || g.includes("deed"))
      ? "blocked"
      : "needs_evidence";
  } else if (lienGaps.length > 0 || appraisalGaps.length > 0 || insuranceGaps.length > 0) {
    status = "needs_review";
  } else {
    status = "lender_ready";
  }

  return {
    assetId: asset.id,
    status,
    evidenceCompleteness,
    missingDocuments,
    legalGaps,
    titleGaps,
    lienGaps,
    insuranceGaps,
    appraisalGaps,
    blockedReasons,
    reviewNotes,
  };
}

export function assessRwaPortfolio(assets: RwaAsset[]): {
  total: number;
  lenderReady: number;
  needsEvidence: number;
  needsReview: number;
  blocked: number;
  averageEvidenceCompleteness: number;
  results: RwaReadinessResult[];
} {
  const results = assets.map(assessRwaAsset);
  const total = results.length;
  const lenderReady = results.filter((r) => r.status === "lender_ready").length;
  const needsEvidence = results.filter((r) => r.status === "needs_evidence").length;
  const needsReview = results.filter((r) => r.status === "needs_review").length;
  const blocked = results.filter((r) => r.status === "blocked").length;
  const averageEvidenceCompleteness =
    total === 0 ? 0 : Math.round(results.reduce((s, r) => s + r.evidenceCompleteness, 0) / total);

  return { total, lenderReady, needsEvidence, needsReview, blocked, averageEvidenceCompleteness, results };
}
