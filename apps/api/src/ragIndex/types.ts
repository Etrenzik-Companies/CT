// ── RAG Document Index — Types ───────────────────────────────────────────
// RAG outputs must cite indexed source documents.
// Missing or unindexed evidence must never be hallucinated.

import type { EvidenceArea, EvidenceDocumentType } from "../evidence/types.js";

export const RAG_INDEX_STATUSES = ["indexed", "pending", "unindexed", "blocked"] as const;
export type RagIndexStatus = (typeof RAG_INDEX_STATUSES)[number];

export interface RagSourceBinding {
  sourceType: "evidence_document";
  sourceId: string;
  areas: EvidenceArea[];
  documentType: EvidenceDocumentType;
}

export interface RagDocument {
  id: string;
  title: string;
  documentId: string;
  status: RagIndexStatus;
  sourceBinding: RagSourceBinding;
}

export interface RagChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  isPlaceholder: boolean;
}

export interface RagIndexRecord {
  document: RagDocument;
  chunks: RagChunk[];
  warnings: string[];
}

export interface RagSearchQuery {
  query: string;
  limit: number;
  areaFilters?: EvidenceArea[];
}

export interface RagCitation {
  documentId: string;
  title: string;
  chunkId: string;
  relevanceScore: number;
  excerpt: string;
}

export interface RagSearchResult {
  query: string;
  citations: RagCitation[];
  unindexedDocumentIds: string[];
}