// ── Evidence Mapping — Tests ─────────────────────────────────────────────
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapEvidenceBatch, mapEvidenceToRequirements } from "./engine.js";
import type { EvidenceMappingInput } from "./types.js";

function makeInput(overrides: Partial<EvidenceMappingInput> = {}): EvidenceMappingInput {
  return {
    evidenceId: "ev-001",
    filename: "appraisal-report.pdf",
    submittedLabel: "Appraisal Report",
    fileType: "pdf",
    ...overrides,
  };
}

describe("evidenceMapping/engine", () => {
  it("appraisal maps to appraisal requirement in fundingRoutes module", () => {
    const result = mapEvidenceToRequirements(makeInput());
    const mapping = result.mappings.find((m) => m.requirementId === "appraisal");
    assert.ok(mapping, "should have appraisal mapping");
    assert.strictEqual(mapping.targetModule, "fundingRoutes");
    assert.strictEqual(mapping.reviewStatus, "pending");
  });

  it("GC insurance maps to gc_insurance in contractorMatrix", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "ACORD-COI-2026.pdf", submittedLabel: "Certificate of Insurance" }));
    const mapping = result.mappings.find((m) => m.requirementId === "gc_insurance");
    assert.ok(mapping, "should have gc_insurance mapping");
    assert.strictEqual(mapping.targetModule, "contractorMatrix");
    assert.strictEqual(mapping.reviewStatus, "pending");
  });

  it("grant award letter maps to incentives module", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "grant-award-letter.pdf", submittedLabel: "Grant Award Letter" }));
    const mapping = result.mappings.find((m) => m.requirementId === "grant_award_letter");
    assert.ok(mapping, "should have grant_award_letter mapping");
    assert.strictEqual(mapping.targetModule, "incentives");
    assert.strictEqual(mapping.reviewStatus, "pending");
  });

  it("estimated tax credit has blocker — does not count as verified", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "tax-credit-estimate.pdf", submittedLabel: "Estimated Tax Credit" }));
    const mapping = result.mappings.find((m) => m.requirementId === "tax_credit_estimate");
    assert.ok(mapping, "should have tax_credit_estimate mapping");
    assert.ok(mapping.blockers.some((b) => b.includes("Estimated tax credit")));
    assert.ok(mapping.missingFields.includes("CPA memo"));
  });

  it("XRPL proof reference maps with blocker — not spendable funds", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "xrpl-proof-reference.pdf", submittedLabel: "XRPL Proof" }));
    const mapping = result.mappings.find((m) => m.requirementId === "xrpl_proof_reference");
    assert.ok(mapping, "should have xrpl_proof_reference mapping");
    assert.ok(mapping.blockers.some((b) => b.includes("not spendable funds")));
    assert.strictEqual(mapping.targetModule, "rwaFundingRoutes");
  });

  it("RWA legal review has securities blocker", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "rwa-legal-review.pdf", submittedLabel: "RWA Legal Review" }));
    const mapping = result.mappings.find((m) => m.requirementId === "rwa_legal_review");
    assert.ok(mapping);
    assert.ok(mapping.blockers.some((b) => b.includes("legal review")));
  });

  it("unrecognised document returns unmappedWarning true", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "misc-document.pdf", submittedLabel: "Some Document" }));
    assert.strictEqual(result.unmappedWarning, true);
    assert.strictEqual(result.mappings.length, 0);
  });

  it("all mapping statuses are pending — never auto-accepted", () => {
    const inputs: EvidenceMappingInput[] = [
      makeInput({ filename: "appraisal.pdf", submittedLabel: "Appraisal" }),
      makeInput({ evidenceId: "ev-002", filename: "title-search.pdf", submittedLabel: "Title Search" }),
      makeInput({ evidenceId: "ev-003", filename: "permit-set.pdf", submittedLabel: "Permit Set" }),
    ];
    const reports = mapEvidenceBatch(inputs);
    for (const report of reports) {
      for (const mapping of report.mappings) {
        assert.strictEqual(mapping.reviewStatus, "pending");
      }
    }
  });

  it("batch mapping is deterministic", () => {
    const inputs: EvidenceMappingInput[] = [
      makeInput({ filename: "appraisal.pdf", submittedLabel: "Appraisal" }),
      makeInput({ evidenceId: "ev-002", filename: "grant-award.pdf", submittedLabel: "Grant Award" }),
    ];
    const r1 = mapEvidenceBatch(inputs);
    const r2 = mapEvidenceBatch(inputs);
    assert.deepStrictEqual(r1, r2);
  });

  it("179D certification maps to certification_179d in incentives", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "179D-cert.pdf", submittedLabel: "179D Certification" }));
    const mapping = result.mappings.find((m) => m.requirementId === "certification_179d");
    assert.ok(mapping, "should have 179d mapping");
    assert.strictEqual(mapping.targetModule, "incentives");
  });

  it("legal memo has attorney-review blocker", () => {
    const result = mapEvidenceToRequirements(makeInput({ filename: "legal-memo.pdf", submittedLabel: "Attorney Legal Memo" }));
    const mapping = result.mappings.find((m) => m.requirementId === "legal_memo");
    assert.ok(mapping);
    assert.ok(mapping.blockers.some((b) => b.includes("attorney review")));
  });
});
