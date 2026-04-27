import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessEvidenceDocuments } from "./engine.js";
import type { EvidenceReviewInput } from "./types.js";

const baseInput: EvidenceReviewInput = {
  projectId: "clay-terrace-evidence",
  documents: [
    {
      id: "doc-bank-1",
      title: "Sponsor Bank Statement",
      fileName: "bank-statement.pdf",
      status: "uploaded",
      uploadedAt: "2026-04-27",
      source: { sourceType: "upload", sourceLabel: "portal", receivedAt: "2026-04-27" },
    },
    {
      id: "doc-title-1",
      title: "Title Report",
      status: "accepted",
      uploadedAt: "2026-04-27",
      source: { sourceType: "upload", sourceLabel: "portal", receivedAt: "2026-04-27" },
      documentType: "title_report",
    },
  ],
};

describe("evidence intake engine", () => {
  it("1. Uploaded evidence is not accepted by default", () => {
    const result = assessEvidenceDocuments(baseInput);
    assert.ok(!result.acceptedDocuments.includes("doc-bank-1"));
    assert.ok(result.reviewRequiredDocuments.includes("doc-bank-1"));
  });

  it("2. Missing evidence is flagged as a gap", () => {
    const result = assessEvidenceDocuments(baseInput);
    assert.ok(result.gaps.some((gap) => gap.reason === "missing"));
  });

  it("3. Expired evidence is flagged", () => {
    const result = assessEvidenceDocuments({
      projectId: "expired-evidence",
      documents: [
        {
          id: "doc-insurance-1",
          title: "Insurance Certificate",
          documentType: "insurance_certificate",
          status: "accepted",
          uploadedAt: "2026-04-27",
          expiryDate: "2026-04-01",
          source: { sourceType: "upload", sourceLabel: "portal", receivedAt: "2026-04-27" },
        },
      ],
    });
    assert.ok(result.expiredDocuments.includes("doc-insurance-1"));
    assert.ok(result.gaps.some((gap) => gap.reason === "expired"));
  });

  it("4. Blockchain references require off-chain review", () => {
    const result = assessEvidenceDocuments({
      projectId: "blockchain-review",
      documents: [
        {
          id: "doc-chain-1",
          title: "Blockchain Proof Reference",
          documentType: "blockchain_proof_reference",
          status: "classified",
          uploadedAt: "2026-04-27",
          source: { sourceType: "upload", sourceLabel: "portal", receivedAt: "2026-04-27" },
        },
      ],
    });
    assert.ok(result.blockedReasons.some((reason) => reason.toLowerCase().includes("off-chain")));
  });

  it("5. Engine output is deterministic", () => {
    const first = assessEvidenceDocuments(baseInput);
    const second = assessEvidenceDocuments(baseInput);
    assert.deepEqual(first, second);
  });
});