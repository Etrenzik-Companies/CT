// -- First Evidence Batch -- Engine Tests ------------------------------------
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FIRST_EVIDENCE_BATCH_SEEDED_INPUT } from "./demoData.js";
import { buildAcceptedFirstEvidenceBatch, buildFirstEvidenceBatch } from "./engine.js";

describe("firstEvidenceBatch/engine", () => {
  it("all five required items exist", () => {
    const result = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    assert.strictEqual(result.items.length, 5);
  });

  it("no item is auto-accepted", () => {
    const result = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    for (const item of result.items) assert.strictEqual(item.autoAccepted, false);
  });

  it("bank statement is financial/confidential", () => {
    const result = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    const item = result.items.find((entry) => entry.category === "bank_statement");
    assert.ok(item);
    assert.strictEqual(item?.classification, "financial_confidential");
    assert.strictEqual(item?.confidential, true);
  });

  it("lender term sheet requires lender-use authorization", () => {
    const result = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    const item = result.items.find((entry) => entry.category === "lender_term_sheet");
    assert.ok(item?.requiresLenderUseAuthorization);
  });

  it("title search requires legal/title review", () => {
    const result = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    const item = result.items.find((entry) => entry.category === "title_search");
    const roles = item?.reviewerAssignments.map((entry) => entry.role) ?? [];
    assert.ok(roles.includes("legal_reviewer"));
    assert.ok(roles.includes("title_reviewer"));
  });

  it("appraisal requires lender/valuation review", () => {
    const result = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    const item = result.items.find((entry) => entry.category === "appraisal");
    const focus = item?.reviewerAssignments.map((entry) => entry.reviewFocus) ?? [];
    assert.ok(focus.includes("valuation_review"));
  });

  it("gc insurance requires construction/insurance review", () => {
    const result = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    const item = result.items.find((entry) => entry.category === "gc_insurance");
    const roles = item?.reviewerAssignments.map((entry) => entry.role) ?? [];
    assert.ok(roles.includes("construction_reviewer"));
    assert.ok(roles.includes("insurance_reviewer"));
  });

  it("lender-ready is false when any item is missing", () => {
    const result = buildFirstEvidenceBatch({
      lenderUseAuthorized: true,
      statusByCategory: {
        appraisal: "accepted",
        title_search: "missing",
        gc_insurance: "accepted",
        bank_statement: "accepted",
        lender_term_sheet: "accepted",
      },
    });
    assert.strictEqual(result.readiness.lenderReady, false);
  });

  it("lender-ready is false when any item is unreviewed", () => {
    const result = buildFirstEvidenceBatch({
      lenderUseAuthorized: true,
      statusByCategory: {
        appraisal: "accepted",
        title_search: "accepted",
        gc_insurance: "accepted",
        bank_statement: "registered",
        lender_term_sheet: "accepted",
      },
    });
    assert.strictEqual(result.readiness.lenderReady, false);
  });

  it("lender-ready is true only when all accepted and authorized", () => {
    const denied = buildAcceptedFirstEvidenceBatch(false);
    const authorized = buildAcceptedFirstEvidenceBatch(true);
    assert.strictEqual(denied.readiness.lenderReady, false);
    assert.strictEqual(authorized.readiness.lenderReady, true);
  });

  it("outputs are deterministic", () => {
    const r1 = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    const r2 = buildFirstEvidenceBatch(FIRST_EVIDENCE_BATCH_SEEDED_INPUT);
    assert.deepStrictEqual(r1, r2);
  });
});
