import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessEsgScorecard } from "./engine.js";
import type { EsgScorecard } from "./types.js";

const emptyScorecard: EsgScorecard = {
  projectId: "proj-001",
  projectName: "Clay Terrace",
  metrics: [],
  resilienceMetrics: [],
  communityImpact: [],
  workforceImpact: [],
  targetCertifications: [],
  evidence: [],
};

const partialScorecard: EsgScorecard = {
  ...emptyScorecard,
  projectId: "proj-002",
  metrics: [
    {
      category: "energy",
      metricName: "Energy Use Intensity",
      baselineValue: 80,
      targetValue: 50,
      unit: "kBtu/sqft/yr",
      evidenceIds: ["ev-e1"],
      verificationStatus: "verified",
    },
    {
      category: "emissions",
      metricName: "CO2e Reduction",
      evidenceIds: [],
      verificationStatus: "estimated",
      notes: "Estimate from energy model",
    },
    {
      category: "water",
      metricName: "Water Use Reduction",
      evidenceIds: ["ev-w1"],
      verificationStatus: "verified",
    },
  ],
  resilienceMetrics: [
    { category: "flood", description: "100-year floodplain not in impact zone", level: "low" },
    { category: "grid_outage", description: "Solar + battery backup", level: "medium" },
  ],
  communityImpact: [
    {
      metricType: "jobs_created",
      value: 150,
      unit: "FTE",
      description: "Construction phase jobs",
      evidenceId: "ev-c1",
    },
  ],
  workforceImpact: [
    {
      metricType: "prevailing_wage",
      description: "Davis-Bacon prevailing wage",
      evidenceId: "ev-wf1",
      certified: true,
    },
    {
      metricType: "apprenticeship",
      description: "5% apprenticeship requirement",
      certified: false,
    },
  ],
  targetCertifications: ["ENERGY STAR", "LEED Silver"],
  evidence: [
    { evidenceId: "ev-e1", documentType: "energy_model", description: "ASHRAE 90.1 energy model" },
    { evidenceId: "ev-w1", documentType: "water_audit", description: "Water use audit" },
    { evidenceId: "ev-c1", documentType: "community_benefit_agreement", description: "CBA" },
    { evidenceId: "ev-wf1", documentType: "prevailing_wage_certification", description: "Wage cert" },
  ],
};

describe("esg engine", () => {
  it("1. Empty scorecard is not_assessed", () => {
    const result = assessEsgScorecard(emptyScorecard);
    assert.equal(result.status, "not_assessed");
    assert.equal(result.overallScore, 0);
  });

  it("2. ESG score flags missing evidence when metrics have no evidence", () => {
    const result = assessEsgScorecard(emptyScorecard);
    assert.ok(result.missingEvidence.length > 0);
  });

  it("3. Partial scorecard is evidence_partial or evidence_missing", () => {
    const result = assessEsgScorecard(partialScorecard);
    assert.ok(["evidence_partial", "evidence_missing"].includes(result.status));
    assert.ok(result.overallScore > 0);
  });

  it("4. Estimated metrics penalize category score", () => {
    const result = assessEsgScorecard(partialScorecard);
    const emissions = result.categoryScores.find((c) => c.category === "emissions");
    assert.ok(emissions !== undefined);
    assert.ok(emissions.score < 100);
  });

  it("5. Verified metrics with evidence score higher than estimated", () => {
    const result = assessEsgScorecard(partialScorecard);
    const energy = result.categoryScores.find((c) => c.category === "energy");
    const emissions = result.categoryScores.find((c) => c.category === "emissions");
    assert.ok(energy !== undefined && emissions !== undefined);
    assert.ok(energy.score > emissions.score);
  });

  it("6. Overall score is between 0 and 100", () => {
    const result = assessEsgScorecard(partialScorecard);
    assert.ok(result.overallScore >= 0 && result.overallScore <= 100);
  });

  it("7. Review notes always include certification disclaimer", () => {
    const result = assessEsgScorecard(partialScorecard);
    assert.ok(result.reviewNotes.some((n) => n.toLowerCase().includes("certification")));
  });

  it("8. Missing workforce certification is flagged", () => {
    const result = assessEsgScorecard(partialScorecard);
    const compliance = result.categoryScores.find((c) => c.category === "compliance");
    assert.ok(compliance !== undefined);
    // One certified, one not — score should be 50
    assert.equal(compliance.score, 50);
  });
});
