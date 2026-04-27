import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRagIndexRecords, searchRagIndex } from "./engine.js";
import type { EvidenceDocument } from "../evidence/types.js";

const documents: EvidenceDocument[] = [
  {
    id: "doc-energy-audit",
    title: "Energy Audit Summary",
    documentType: "energy_audit",
    status: "accepted",
    uploadedAt: "2026-04-27",
    source: { sourceType: "upload", sourceLabel: "portal", receivedAt: "2026-04-27" },
  },
  {
    id: "doc-missing-grant",
    title: "Grant Application Draft",
    documentType: "grant_application",
    status: "blocked",
    uploadedAt: "2026-04-27",
    source: { sourceType: "upload", sourceLabel: "portal", receivedAt: "2026-04-27" },
  },
];

describe("rag index engine", () => {
  it("1. Creates index records for evidence documents", () => {
    const records = createRagIndexRecords("ct-rag", documents);
    assert.equal(records.length, 2);
    assert.equal(records[0].document.documentId, "doc-energy-audit");
  });

  it("2. Mock search returns citations", () => {
    const records = createRagIndexRecords("ct-rag", documents);
    const result = searchRagIndex(records, { query: "energy audit", limit: 5 });
    assert.ok(result.citations.length > 0);
    assert.equal(result.citations[0].documentId, "doc-energy-audit");
  });

  it("3. Unindexed docs are marked clearly", () => {
    const records = createRagIndexRecords("ct-rag", documents);
    assert.equal(records[1].document.status, "unindexed");
  });

  it("4. Search does not invent missing documents", () => {
    const records = createRagIndexRecords("ct-rag", documents);
    const result = searchRagIndex(records, { query: "grant application", limit: 5 });
    assert.equal(result.citations.length, 0);
    assert.ok(result.unindexedDocumentIds.includes("doc-missing-grant"));
  });

  it("5. Engine output is deterministic", () => {
    const first = searchRagIndex(createRagIndexRecords("ct-rag", documents), { query: "energy audit", limit: 5 });
    const second = searchRagIndex(createRagIndexRecords("ct-rag", documents), { query: "energy audit", limit: 5 });
    assert.deepEqual(first, second);
  });
});