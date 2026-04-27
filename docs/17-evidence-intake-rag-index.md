# Evidence Intake and RAG Index

## Purpose

Phase 7 introduces a document-backed evidence registry and a citation-first RAG index interface for lender and diligence workflows.

## Evidence Intake Rules

- Uploaded documents are not automatically accepted.
- Evidence status must move through review-aware stages such as `uploaded`, `classified`, `needs_review`, and `accepted`.
- Expired evidence is treated as unavailable until refreshed.
- Blockchain and XRPL references remain proof references only unless separately reviewed off-chain.

## RAG Index Rules

- RAG results must cite source documents.
- Citations must include document ID, title, chunk ID, and relevance score.
- Unindexed or blocked documents must be reported clearly.
- Missing evidence must never be hallucinated into a search result.

## Operational Notes

- The current implementation uses deterministic placeholder chunks.
- Future vector database adapters may be added later, but the citation contract stays the same.
- Legal, accounting, lender, and human review remain required for real-world submission use.