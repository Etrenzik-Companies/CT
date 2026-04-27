import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessXrplReadiness } from "./readiness.js";
import type { XrplAssetReference } from "./types.js";

const refWithEvidence: XrplAssetReference = {
  rwaAssetId: "asset-001",
  assetName: "Clay Terrace Construction Project",
  evidenceIds: ["e1", "e2"],
};

describe("xrpl readiness engine", () => {
  it("1. Asset with no evidence is blocked", () => {
    const result = assessXrplReadiness({ rwaAssetId: "x1", assetName: "Empty", evidenceIds: [] });
    assert.equal(result.assetClass, "blocked");
    assert.ok(result.blockedReasons.length > 0);
  });

  it("2. Asset with evidence but no currency code is documentation_only", () => {
    const result = assessXrplReadiness(refWithEvidence);
    assert.equal(result.assetClass, "documentation_only");
  });

  it("3. Asset with currency code but no issuer is proof_reference", () => {
    const result = assessXrplReadiness({ ...refWithEvidence, proposedCurrencyCode: "CTT" });
    assert.equal(result.assetClass, "proof_reference");
  });

  it("4. Asset with currency code and issuer is settlement_reference", () => {
    const result = assessXrplReadiness({
      ...refWithEvidence,
      proposedCurrencyCode: "CTT",
      proposedIssuerLabel: "clay-terrace-issuer",
    });
    assert.equal(result.assetClass, "settlement_reference");
    assert.ok(result.blockedReasons.some((r) => r.toLowerCase().includes("securities")));
  });

  it("5. All XRPL live transaction actions are approval_required", () => {
    const result = assessXrplReadiness(refWithEvidence);
    for (const action of result.simulatedActions) {
      assert.equal(action.status, "approval_required");
    }
  });

  it("6. Result always includes standard compliance warnings", () => {
    const result = assessXrplReadiness(refWithEvidence);
    const codes = result.complianceWarnings.map((w) => w.code);
    assert.ok(codes.includes("no_investment_advice"));
    assert.ok(codes.includes("securities_review_required"));
    assert.ok(codes.includes("legal_counsel_required"));
  });

  it("7. Result always includes simulation review notes", () => {
    const result = assessXrplReadiness(refWithEvidence);
    assert.ok(result.reviewNotes.some((n) => n.includes("SIMULATION ONLY")));
  });

  it("8. Issuer profile is only set when issuer label is provided", () => {
    const noIssuer = assessXrplReadiness({ ...refWithEvidence, proposedCurrencyCode: "CTT" });
    assert.equal(noIssuer.issuerProfile, undefined);

    const withIssuer = assessXrplReadiness({
      ...refWithEvidence,
      proposedCurrencyCode: "CTT",
      proposedIssuerLabel: "ct-issuer",
    });
    assert.ok(withIssuer.issuerProfile !== undefined);
    assert.equal(withIssuer.issuerProfile?.requiresLegalReview, true);
    assert.equal(withIssuer.issuerProfile?.requiresComplianceApproval, true);
  });
});
