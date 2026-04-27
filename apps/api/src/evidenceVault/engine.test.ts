// -- Evidence Vault -- Tests -------------------------------------------------
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { registerEvidenceMetadata, registerEvidenceMetadataBatch } from "./engine.js";
import type { EvidenceVaultRegistrationInput } from "./types.js";

function makeInput(overrides: Partial<EvidenceVaultRegistrationInput> = {}): EvidenceVaultRegistrationInput {
  return {
    filename: "appraisal.pdf",
    submittedLabel: "Appraisal Report",
    source: "user_upload",
    sizeBytes: 450_000,
    uploadedAt: "2026-04-27T22:00:00Z",
    actor: "qa.user",
    ...overrides,
  };
}

describe("evidenceVault/engine", () => {
  it(".env files are blocked", () => {
    const result = registerEvidenceMetadata(makeInput({ filename: ".env", submittedLabel: "runtime env" }));
    assert.strictEqual(result.record.securityScan.outcome, "secret_detected");
    assert.strictEqual(result.record.status, "quarantined");
    assert.strictEqual(result.record.autoAccepted, false);
  });

  it("private-key filenames are blocked", () => {
    const result = registerEvidenceMetadata(makeInput({ filename: "project-private-key.txt", submittedLabel: "deployment key" }));
    assert.strictEqual(result.record.securityScan.blocked, true);
    assert.strictEqual(result.record.status, "quarantined");
  });

  it("seed phrase labels are blocked", () => {
    const result = registerEvidenceMetadata(makeInput({ submittedLabel: "wallet seed phrase backup" }));
    assert.strictEqual(result.record.securityScan.outcome, "secret_detected");
    assert.strictEqual(result.record.status, "quarantined");
  });

  it("bank statements are flagged sensitive/confidential", () => {
    const result = registerEvidenceMetadata(makeInput({ filename: "bank-statement-march.pdf", submittedLabel: "Bank Statement" }));
    assert.strictEqual(result.record.securityScan.outcome, "sensitive");
    assert.strictEqual(result.record.accessPolicy.accessTier, "restricted");
  });

  it("vault registration never auto-accepts", () => {
    const result = registerEvidenceMetadata(makeInput());
    assert.strictEqual(result.record.autoAccepted, false);
    assert.strictEqual(result.record.status, "review_required");
  });

  it("oversized files are rejected", () => {
    const result = registerEvidenceMetadata(makeInput({ sizeBytes: 40 * 1024 * 1024 }));
    assert.strictEqual(result.record.securityScan.outcome, "oversized");
    assert.strictEqual(result.record.status, "rejected");
  });

  it("all outputs are deterministic", () => {
    const inputs = [
      makeInput({ filename: "appraisal.pdf", submittedLabel: "Appraisal" }),
      makeInput({ filename: "legal-memo.pdf", submittedLabel: "Legal Memo" }),
    ];
    const r1 = registerEvidenceMetadataBatch(inputs);
    const r2 = registerEvidenceMetadataBatch(inputs);
    assert.deepStrictEqual(r1, r2);
  });
});
