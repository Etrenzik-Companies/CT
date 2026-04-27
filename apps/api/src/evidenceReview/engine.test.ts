// -- Evidence Review -- Tests ------------------------------------------------
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { reviewEvidence } from "./engine.js";
import type { EvidenceReviewInput } from "./types.js";

function makeInput(overrides: Partial<EvidenceReviewInput> = {}): EvidenceReviewInput {
  return {
    evidenceId: "evr-test-001",
    documentClass: "general",
    reviewerRole: "project_admin",
    decision: "accept",
    reviewedAt: "2026-04-27T22:00:00Z",
    lenderUseAuthorized: false,
    secretDetected: false,
    ...overrides,
  };
}

describe("evidenceReview/engine", () => {
  it("legal memos require legal reviewer", () => {
    const result = reviewEvidence(
      makeInput({ documentClass: "legal", reviewerRole: "project_admin", decision: "accept" })
    );
    assert.strictEqual(result.outcome, "review_required");
    assert.ok(result.blockerReasons.some((reason) => reason.includes("not allowed")));
  });

  it("tax docs require tax/accounting reviewer", () => {
    const result = reviewEvidence(
      makeInput({ documentClass: "tax", reviewerRole: "construction_reviewer", decision: "accept" })
    );
    assert.strictEqual(result.outcome, "review_required");
  });

  it("lender docs require lender-use authorization", () => {
    const result = reviewEvidence(
      makeInput({ documentClass: "lender", reviewerRole: "lender_reviewer", lenderUseAuthorized: false, decision: "accept" })
    );
    assert.strictEqual(result.outcome, "review_required");
    assert.ok(result.blockerReasons.some((reason) => reason.includes("authorization")));
  });

  it("contractor docs require construction/project reviewer", () => {
    const result = reviewEvidence(
      makeInput({ documentClass: "contractor", reviewerRole: "tax_reviewer", decision: "accept" })
    );
    assert.strictEqual(result.outcome, "review_required");
  });

  it("code and permit docs require code reviewer", () => {
    const result = reviewEvidence(
      makeInput({ documentClass: "code_permit", reviewerRole: "project_admin", decision: "accept" })
    );
    assert.strictEqual(result.outcome, "review_required");
  });

  it("accepted evidence requires role match and creates audit entry", () => {
    const result = reviewEvidence(
      makeInput({ documentClass: "legal", reviewerRole: "legal_reviewer", decision: "accept" })
    );
    assert.strictEqual(result.outcome, "accepted");
    assert.strictEqual(result.accepted, true);
    assert.ok(result.auditEntry, "accepted outcome should include audit entry");
  });

  it("rejected evidence requires reason", () => {
    const missingReason = reviewEvidence(makeInput({ decision: "reject", reason: "" }));
    assert.strictEqual(missingReason.outcome, "review_required");

    const withReason = reviewEvidence(makeInput({ decision: "reject", reason: "Document is illegible" }));
    assert.strictEqual(withReason.outcome, "rejected");
    assert.ok(withReason.auditEntry, "rejected outcome should include audit entry");
  });

  it("prohibited secret files cannot be approved", () => {
    const result = reviewEvidence(makeInput({ secretDetected: true, decision: "accept" }));
    assert.strictEqual(result.outcome, "review_required");
    assert.ok(result.blockerReasons.some((reason) => reason.includes("secret-like")));
  });

  it("all outputs are deterministic", () => {
    const input = makeInput({ documentClass: "lender", reviewerRole: "lender_reviewer", lenderUseAuthorized: true });
    const r1 = reviewEvidence(input);
    const r2 = reviewEvidence(input);
    assert.deepStrictEqual(r1, r2);
  });
});
