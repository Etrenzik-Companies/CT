// ── ESG Scorecard — Engine ────────────────────────────────────────────────
// For documentation and lender/investor reporting purposes only.
// All ESG estimates require qualified certification/verification.

import type {
  EsgCategoryScore,
  EsgMetricCategory,
  EsgReadinessStatus,
  EsgScorecard,
  EsgScorecardResult,
} from "./types.js";

const CATEGORY_WEIGHTS: Record<EsgMetricCategory, number> = {
  energy: 25,
  emissions: 20,
  water: 10,
  resilience: 10,
  indoor_air_quality: 10,
  community_impact: 10,
  workforce: 5,
  compliance: 5,
  documentation: 5,
};

function scoreCategoryMetrics(
  category: EsgMetricCategory,
  scorecard: EsgScorecard
): EsgCategoryScore {
  const metrics = scorecard.metrics.filter((m) => m.category === category);
  const missing: string[] = [];
  const reviewNotes: string[] = [];

  if (metrics.length === 0) {
    missing.push(`No metrics provided for category: ${category}`);
    return { category, score: 0, missingEvidence: missing, reviewNotes };
  }

  let totalPossible = 0;
  let earned = 0;

  for (const metric of metrics) {
    totalPossible += 100;
    if (metric.verificationStatus === "verified" && metric.evidenceIds.length > 0) {
      earned += 100;
    } else if (metric.verificationStatus === "estimated") {
      earned += 40;
      reviewNotes.push(`"${metric.metricName}" uses estimated data — certification requires verification`);
    } else {
      missing.push(`"${metric.metricName}" has no verified evidence`);
    }
  }

  const score = totalPossible > 0 ? Math.round((earned / totalPossible) * 100) : 0;
  return { category, score, missingEvidence: missing, reviewNotes };
}

function scoreDocumentation(scorecard: EsgScorecard): EsgCategoryScore {
  const missing: string[] = [];
  const reviewNotes: string[] = [];
  let score = 0;

  if (scorecard.evidence.length === 0) {
    missing.push("No ESG evidence documents uploaded");
    return { category: "documentation", score: 0, missingEvidence: missing, reviewNotes };
  }
  if (scorecard.targetCertifications.length === 0) {
    missing.push("No target certifications identified (e.g. LEED, ENERGY STAR, ZERH)");
    score = 30;
  } else {
    score = 80;
    reviewNotes.push(`Target certifications: ${scorecard.targetCertifications.join(", ")}`);
  }

  return { category: "documentation", score, missingEvidence: missing, reviewNotes };
}

function scoreCompliance(scorecard: EsgScorecard): EsgCategoryScore {
  const missing: string[] = [];
  const certified = scorecard.workforceImpact.filter((w) => w.certified).length;
  const total = scorecard.workforceImpact.length;

  let score = 0;
  if (total === 0) {
    missing.push("No workforce compliance records (prevailing wage, apprenticeship, etc.)");
  } else {
    score = Math.round((certified / total) * 100);
    if (certified < total) {
      missing.push(`${total - certified} workforce metrics not yet certified`);
    }
  }

  return { category: "compliance", score, missingEvidence: missing, reviewNotes: [] };
}

function scoreCommunity(scorecard: EsgScorecard): EsgCategoryScore {
  const missing: string[] = [];
  if (scorecard.communityImpact.length === 0) {
    missing.push("No community impact metrics provided");
    return { category: "community_impact", score: 0, missingEvidence: missing, reviewNotes: [] };
  }
  const withEvidence = scorecard.communityImpact.filter((c) => !!c.evidenceId).length;
  const score = Math.round((withEvidence / scorecard.communityImpact.length) * 100);
  return { category: "community_impact", score, missingEvidence: missing, reviewNotes: [] };
}

function scoreWorkforce(scorecard: EsgScorecard): EsgCategoryScore {
  const missing: string[] = [];
  if (scorecard.workforceImpact.length === 0) {
    missing.push("No workforce impact metrics provided");
    return { category: "workforce", score: 0, missingEvidence: missing, reviewNotes: [] };
  }
  const certified = scorecard.workforceImpact.filter((w) => w.certified).length;
  const score = Math.round((certified / scorecard.workforceImpact.length) * 100);
  return { category: "workforce", score, missingEvidence: missing, reviewNotes: [] };
}

function scoreResilience(scorecard: EsgScorecard): EsgCategoryScore {
  const missing: string[] = [];
  if (scorecard.resilienceMetrics.length === 0) {
    missing.push("No resilience metrics provided");
    return { category: "resilience", score: 0, missingEvidence: missing, reviewNotes: [] };
  }
  const assessed = scorecard.resilienceMetrics.filter((r) => r.level !== "not_assessed").length;
  const score = Math.round((assessed / scorecard.resilienceMetrics.length) * 100);
  return { category: "resilience", score, missingEvidence: missing, reviewNotes: [] };
}

export function assessEsgScorecard(scorecard: EsgScorecard): EsgScorecardResult {
  const categoryScores: EsgCategoryScore[] = [];
  const STANDARD_CATEGORIES: EsgMetricCategory[] = ["energy", "emissions", "water", "indoor_air_quality"];

  for (const cat of STANDARD_CATEGORIES) {
    categoryScores.push(scoreCategoryMetrics(cat, scorecard));
  }
  categoryScores.push(scoreResilience(scorecard));
  categoryScores.push(scoreCommunity(scorecard));
  categoryScores.push(scoreWorkforce(scorecard));
  categoryScores.push(scoreCompliance(scorecard));
  categoryScores.push(scoreDocumentation(scorecard));

  const totalWeight = Object.values(CATEGORY_WEIGHTS).reduce((s, w) => s + w, 0);
  let weightedSum = 0;
  for (const cs of categoryScores) {
    weightedSum += cs.score * (CATEGORY_WEIGHTS[cs.category] / totalWeight);
  }
  const overallScore = Math.round(weightedSum);

  const allMissing = categoryScores.flatMap((cs) => cs.missingEvidence);
  const blockedReasons: string[] = [];
  if (overallScore < 20) blockedReasons.push("Overall ESG score is below threshold — evidence incomplete");

  let status: EsgReadinessStatus;
  if (allMissing.length === 0 && overallScore >= 80) {
    status = "certification_ready";
  } else if (allMissing.length === 0 && overallScore >= 50) {
    status = "evidence_complete";
  } else if (allMissing.length > 0 && overallScore > 0) {
    status = "evidence_partial";
  } else if (overallScore === 0) {
    status = "not_assessed";
  } else {
    status = "evidence_missing";
  }

  const reviewNotes = [
    "All ESG scores are preliminary — certification requires qualified third-party verification.",
    "Estimated values do not satisfy lender or certification verification requirements.",
    "Community impact and workforce metrics should be supported by contractual commitments.",
    ...categoryScores.flatMap((cs) => cs.reviewNotes),
  ];

  return {
    projectId: scorecard.projectId,
    status,
    overallScore,
    categoryScores,
    missingEvidence: allMissing,
    blockedReasons,
    reviewNotes,
  };
}
