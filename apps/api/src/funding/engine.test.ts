import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessFundingIntelligence } from "./engine.js";
import type { SubmissionPacket } from "./types.js";

const basePacket: SubmissionPacket = {
  projectId: "clay-terrace-001",
  projectName: "Clay Terrace Construction",
  projectCost: 25_000_000,
  currency: "USD",
  rwaReadinessStatus: "lender_ready",
  pofStatus: "lender_ready",
  esgScore: 65,
  incentiveMatchCount: 4,
  capitalStack: [
    { label: "Sponsor Equity", amount: 25_000_000, position: "sponsor_equity", committed: true },
  ],
};

describe("funding intelligence engine", () => {
  it("1. Potential and committed are strictly separated", () => {
    const result = assessFundingIntelligence(basePacket);
    // committedMatches should always be empty (only via executed docs)
    assert.equal(result.committedMatches.length, 0);
    assert.ok(result.potentialMatches.length > 0);
  });

  it("2. Capital gap is 0 when committed capital covers project cost", () => {
    const result = assessFundingIntelligence(basePacket);
    assert.equal(result.capitalGap, 0);
  });

  it("3. Capital gap is computed correctly", () => {
    const packet: SubmissionPacket = {
      ...basePacket,
      projectId: "ct-gap",
      capitalStack: [{ label: "Partial equity", amount: 10_000_000, position: "sponsor_equity", committed: true }],
    };
    const result = assessFundingIntelligence(packet);
    assert.equal(result.capitalGap, 15_000_000);
    assert.ok(result.blockedReasons.some((r) => r.includes("gap")));
  });

  it("4. Status is blocked when both RWA and PoF are zero", () => {
    const packet: SubmissionPacket = {
      ...basePacket,
      projectId: "ct-blocked",
      rwaReadinessStatus: "blocked",
      pofStatus: "blocked",
      esgScore: 0,
      capitalStack: [],
    };
    const result = assessFundingIntelligence(packet);
    assert.equal(result.status, "blocked");
  });

  it("5. All potential matches include a review note", () => {
    const result = assessFundingIntelligence(basePacket);
    for (const m of result.potentialMatches) {
      assert.ok(m.reviewNote.length > 0);
      assert.ok(m.reviewNote.toLowerCase().includes("potential"));
    }
  });

  it("6. Top-level review notes warn about estimated incentives", () => {
    const result = assessFundingIntelligence(basePacket);
    assert.ok(result.reviewNotes.some((n) => n.toLowerCase().includes("estimated")));
  });

  it("7. Next best steps always include legal counsel", () => {
    const result = assessFundingIntelligence(basePacket);
    assert.ok(result.nextBestSteps.some((s) => s.toLowerCase().includes("attorney") || s.toLowerCase().includes("counsel")));
  });

  it("8. Readiness score overall is between 0 and 100", () => {
    const result = assessFundingIntelligence(basePacket);
    assert.ok(result.readinessScore.overall >= 0 && result.readinessScore.overall <= 100);
  });

  it("9. Program matches include C-PACE for Georgia project", () => {
    const result = assessFundingIntelligence(basePacket);
    assert.ok(result.potentialMatches.some((m) => m.programId === "cpace-georgia" || m.programType === "cpace"));
  });
});
