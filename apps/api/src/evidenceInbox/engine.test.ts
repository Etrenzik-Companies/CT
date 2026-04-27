// ── Evidence Inbox — Tests ───────────────────────────────────────────────
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { intakeEvidence, intakeEvidenceBatch } from "./engine.js";
import type { EvidenceInboxItem } from "./types.js";

function makeItem(overrides: Partial<EvidenceInboxItem> = {}): EvidenceInboxItem {
  return {
    id: "test-001",
    filename: "appraisal-report.pdf",
    fileType: "pdf",
    source: "user_upload",
    submittedLabel: "Appraisal Report",
    submittedAt: "2026-04-27T00:00:00Z",
    ...overrides,
  };
}

describe("evidenceInbox/engine", () => {
  it("uploaded evidence is never auto-accepted", () => {
    const result = intakeEvidence(makeItem());
    assert.strictEqual(result.autoAccepted, false);
    assert.strictEqual(result.reviewStatus, "received");
  });

  it("appraisal maps to fundingRoutes and lenderPacket", () => {
    const result = intakeEvidence(makeItem({ filename: "appraisal-final.pdf", submittedLabel: "Appraisal Report" }));
    assert.ok(result.suggestedMappingTargets.includes("fundingRoutes"), "should map to fundingRoutes");
    assert.ok(result.suggestedMappingTargets.includes("lenderPacket"), "should map to lenderPacket");
    assert.strictEqual(result.secretDetected, false);
  });

  it("private key file is blocked with secret_prohibited security level", () => {
    const result = intakeEvidence(makeItem({ filename: "private_key.txt", submittedLabel: "My Private Key", fileType: "text" }));
    assert.strictEqual(result.secretDetected, true);
    assert.strictEqual(result.reviewStatus, "blocked");
    assert.strictEqual(result.securityLevel, "secret_prohibited");
    assert.strictEqual(result.suggestedMappingTargets.length, 0);
    assert.ok(result.secretBlockers.length > 0);
  });

  it("seed phrase file is blocked", () => {
    const result = intakeEvidence(makeItem({ filename: "seed_phrase_backup.txt", submittedLabel: "Seed phrase", fileType: "text" }));
    assert.strictEqual(result.secretDetected, true);
    assert.strictEqual(result.reviewStatus, "blocked");
  });

  it("API key file is blocked", () => {
    const result = intakeEvidence(makeItem({ filename: "api_key.txt", submittedLabel: "API Key for service", fileType: "text" }));
    assert.strictEqual(result.secretDetected, true);
    assert.strictEqual(result.reviewStatus, "blocked");
  });

  it(".env file is blocked", () => {
    const result = intakeEvidence(makeItem({ filename: ".env", submittedLabel: "environment config" }));
    assert.strictEqual(result.secretDetected, true);
    assert.strictEqual(result.reviewStatus, "blocked");
  });

  it("bank statement is classified as financial and mapped correctly", () => {
    const result = intakeEvidence(makeItem({ filename: "bank-statement-march.pdf", submittedLabel: "Bank Statement" }));
    assert.strictEqual(result.securityLevel, "financial");
    assert.ok(result.suggestedMappingTargets.includes("pof"));
    assert.ok(result.warnings.some((w) => w.includes("Financial document")));
    assert.strictEqual(result.autoAccepted, false);
  });

  it("tax credit document maps to incentives and fundingroutes", () => {
    const result = intakeEvidence(makeItem({ filename: "179D-certification.pdf", submittedLabel: "179D Tax Credit Cert" }));
    assert.ok(result.suggestedMappingTargets.includes("incentives"));
    assert.ok(result.suggestedMappingTargets.includes("fundingRoutes"));
    assert.strictEqual(result.autoAccepted, false);
  });

  it("legal memo is classified as legal security level", () => {
    const result = intakeEvidence(makeItem({ filename: "legal-memo-zoning.pdf", submittedLabel: "Legal Memo on Zoning" }));
    assert.strictEqual(result.securityLevel, "legal");
    assert.ok(result.warnings.some((w) => w.includes("attorney")));
  });

  it("XRPL/RWA reference maps to rwaFundingRoutes", () => {
    const result = intakeEvidence(makeItem({ filename: "xrpl-proof-reference.pdf", submittedLabel: "XRPL Proof Reference" }));
    assert.ok(result.suggestedMappingTargets.includes("rwaFundingRoutes"));
    assert.ok(result.suggestedMappingTargets.includes("pof"));
    assert.strictEqual(result.autoAccepted, false);
  });

  it("batch intake returns deterministic results", () => {
    const items: EvidenceInboxItem[] = [
      makeItem({ id: "a", filename: "appraisal.pdf", submittedLabel: "Appraisal" }),
      makeItem({ id: "b", filename: "private_key.txt", submittedLabel: "key", fileType: "text" }),
    ];
    const r1 = intakeEvidenceBatch(items);
    const r2 = intakeEvidenceBatch(items);
    assert.deepStrictEqual(r1, r2);
    assert.strictEqual(r1[0]!.autoAccepted, false);
    assert.strictEqual(r1[1]!.secretDetected, true);
  });
});
