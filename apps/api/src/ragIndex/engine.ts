// ── RAG Document Index — Engine ──────────────────────────────────────────
// Deterministic placeholder indexing only. Future vector adapters may plug in later.

import type { EvidenceDocument } from "../evidence/types.js";
import { assessEvidenceDocuments } from "../evidence/engine.js";
import type { RagChunk, RagCitation, RagDocument, RagIndexRecord, RagSearchQuery, RagSearchResult } from "./types.js";

function tokenize(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function isIndexable(status: EvidenceDocument["status"]): boolean {
  return status !== "missing" && status !== "rejected" && status !== "blocked";
}

function buildChunk(document: EvidenceDocument, documentType: string): RagChunk {
  const text = `${document.title}. Placeholder indexed content for ${documentType}. Source document id ${document.id}.`;
  return {
    id: `${document.id}#chunk-0`,
    documentId: document.id,
    chunkIndex: 0,
    text,
    tokenCount: tokenize(text).length,
    isPlaceholder: true,
  };
}

export function createRagIndexRecords(projectId: string, documents: EvidenceDocument[]): RagIndexRecord[] {
  const evidence = assessEvidenceDocuments({ projectId, documents });

  return documents
    .map((document) => {
      const classification = evidence.classifications.find((item) => item.documentId === document.id);
      const documentType = classification?.documentType ?? document.documentType ?? "other";
      const status = isIndexable(document.status) ? "indexed" : "unindexed";
      const ragDocument: RagDocument = {
        id: `rag-${document.id}`,
        title: document.title,
        documentId: document.id,
        status,
        sourceBinding: {
          sourceType: "evidence_document",
          sourceId: document.id,
          areas: classification?.mappedAreas ?? [],
          documentType,
        },
      };
      return {
        document: ragDocument,
        chunks: status === "indexed" ? [buildChunk(document, documentType)] : [],
        warnings: status === "indexed" ? [] : ["Document is not indexed and cannot produce citations"],
      } satisfies RagIndexRecord;
    })
    .sort((left, right) => left.document.documentId.localeCompare(right.document.documentId));
}

function scoreChunk(chunk: RagChunk, queryTokens: string[]): number {
  const chunkTokens = new Set(tokenize(chunk.text));
  const overlaps = queryTokens.filter((token) => chunkTokens.has(token)).length;
  if (overlaps === 0) return 0;
  return Number((overlaps / queryTokens.length).toFixed(3));
}

export function searchRagIndex(records: RagIndexRecord[], query: RagSearchQuery): RagSearchResult {
  const queryTokens = tokenize(query.query);
  const unindexedDocumentIds = records
    .filter((record) => record.document.status !== "indexed")
    .map((record) => record.document.documentId)
    .sort();

  const citations: RagCitation[] = [];
  for (const record of records) {
    if (record.document.status !== "indexed") continue;
    if (query.areaFilters?.length) {
      const areas = record.document.sourceBinding.areas;
      if (!query.areaFilters.some((area) => areas.includes(area))) continue;
    }
    for (const chunk of record.chunks) {
      const relevanceScore = scoreChunk(chunk, queryTokens);
      if (relevanceScore === 0) continue;
      citations.push({
        documentId: record.document.documentId,
        title: record.document.title,
        chunkId: chunk.id,
        relevanceScore,
        excerpt: chunk.text,
      });
    }
  }

  citations.sort((left, right) => {
    if (right.relevanceScore !== left.relevanceScore) {
      return right.relevanceScore - left.relevanceScore;
    }
    if (left.documentId !== right.documentId) {
      return left.documentId.localeCompare(right.documentId);
    }
    return left.chunkId.localeCompare(right.chunkId);
  });

  return {
    query: query.query,
    citations: citations.slice(0, query.limit),
    unindexedDocumentIds,
  };
}