# Roadmap

## Completed

- ✅ **Phase 0 — Repo bootstrap** (`0.1.0`)
  - pnpm workspace, TypeScript base config, CI pipeline, security baseline, docs framework.

- ✅ **Phase 1 — Project Control Guardrails** (`0.2.0`, tag `project-control-v1`)
  - 15 guardrail functions in `apps/api/src/projectControl/engine.ts`.
  - MCP tool access control, permit evidence enforcement, incentive approval gates, tax CPA review, RAG citation requirements, AI output human-review triggers.
  - 15 tests, all passing.

- ✅ **Phase 2 — Agentic Orchestrator Foundation** (`0.3.0`, tag `orchestrator-foundation-v1`)
  - Typed agentic task dispatcher in `apps/api/src/orchestrator/engine.ts`.
  - Budget cap, timeout, and human-review safety gates.
  - 12 tests, all passing.

- ✅ **Phase 3 — MCP Tool Registry Runtime** (`0.4.0`, tag `mcp-registry-runtime-v1`)
  - `McpRuntimeRegistry` safety layer: `read-only | write | destructive | deploy | external-network` command classes.
  - Deterministic outcomes: `allowed | blocked | approval-required`.
  - Validation hooks, project-control hook integration, approval policy evaluator.
  - 8 tests, all passing.

- ✅ **Phase 4 — Shared Packages and Real ESLint** (`0.5.0`)
  - `@ct/shared`: `Result<T,E>`, `Branded<T,B>`, `assertNever`, `slugify`, `formatCurrency`, `toIsoDate`.
  - `@ct/types`: authoritative domain union types — `ProjectStatus`, `RiskLevel`, `TradeCategory`, `FundingType`, `DocumentType`, `AgentRole`, and more.
  - Real ESLint (`typescript-eslint` flat config) in `apps/api`.

 ✅ **Phase 6 — RWA, XRPL, PoF, ESG, Incentive, and Funding Intelligence** (`0.7.0`, tag `phase6-rwa-xrpl-pof-funding-v1`)
  - RWA Asset Registry engine: 6-doc evidence checklist, ownership validation, lien/appraisal/insurance checks.
  - XRPL Readiness simulation layer: 11 action types all `approval_required`, 6 compliance warnings, asset classification.
  - Proof of Funds engine: capital stack verification, gap analysis, estimated source exclusion, lender authorization.
  - Tax Incentive Intelligence: 6 built-in programs (179D, 45L, DOE, GA property tax, GA energy loan, utility rebates).
  - ESG Scorecard engine: 9 weighted categories, estimate flag scoring, certification readiness thresholds.
  - Funding Intelligence: 6 built-in programs, strict potential/committed separation, readiness score composite.
  - 6 new web dashboard panels with status badges, review warnings, and data cards.
  - 3 new documentation files (docs 13–15). 53 total tests passing.
  - Vite + React 18 + TypeScript SPA replacing placeholder `apps/web`.

- ✅ **Phase 6.1 — Post-Deployment Security Hardening** (`0.7.1`)
  - Added production verification and repo hygiene scripts.
  - Added token-rotation and GitHub secrets follow-up documentation.

## In Progress

- 🟡 **Phase 7 — Evidence Intake + RAG Index + Lender Packet Builder** (`0.8.0`)
  - Evidence registry with deterministic classification, gaps, review queues, and expiration handling.
  - Citation-first RAG indexing with mock deterministic search and explicit unindexed-document reporting.
  - Lender packet readiness with PoF gap blocking, missing evidence detection, lender authorization checks, and blockchain off-chain review gates.
  - Incentive evidence staging from `estimated` through `verified` with verified-funds separation.
  - Five new web modules: Evidence Intake, RAG Index, Lender Packet, Incentive Evidence, Submission Readiness.

- 🟡 **Phase 7.1 — Indiana Official-Source Matrix Layer** (`0.8.1`)
  - Added deterministic Indiana matrix engine for ESG incentives, grants, bonds/TIF/redevelopment, hotel/local taxes, and code compliance.
  - Added evidence-gated status model: `likely_match | possible_match | monitor_only | not_applicable | blocked | needs_review | verified`.
  - Enforced lender-safe value stages: `estimated | application_ready | submitted | awarded | verified | not_counted`.
  - Added seven new dashboard modules for Indiana matrix operations and evidence-gap actioning.

- 🟡 **Phase 7.2 — Contractor, Funding Route, and RWA Control Layer** (`0.8.3`)
  - Added deterministic contractor/trade matrix with lender, code, and incentive blocker detection.
  - Added funding route matrix with explicit stage buckets and verified-funds guardrails.
  - Added explicit tax-obligation-only treatment for hotel/local taxes.
  - Added RWA/XRPL route controls: non-spendable reference model, legal/compliance/human approval gates, and blocked live execution.
  - Added seven funding control dashboard modules and docs 23–25 for master lender checklist operations.

## Planned


- ✅ **Phase 8 — Real Evidence Packet Intake** (`0.8.4`, tag `feat/phase8-real-evidence-packet-intake`)
  - Added Evidence Intake Inbox engine: classifies documents, detects and blocks 10 secret patterns, infers mapping targets from 24 keyword rules. `autoAccepted: false` enforced as literal type.
  - Added Evidence-to-Requirement Mapping engine: 36 requirement IDs, 35 keyword rules, standing blockers on estimated incentives and RWA/XRPL references.
  - Added Packet Status engine: 8 categories, 5 lender-ready gates (present + accepted + professional review + no blockers + authorization).
  - 28 new tests (10 + 10 + 8). 10 professional-review-required items enforced.
  - Seven new dashboard modules: Evidence Inbox, Evidence Mapping, Packet Status, Accepted Evidence, Blocked Evidence, Review Queue, Real Lender Packet.
  - Added docs 26–28.

## Planned

- ⚪ **Phase 9 — Live Intake and Vector Indexing**
  - Real document upload flows, persistent index storage, and vector retrieval adapters.
  - Funding packet exports tied to accepted evidence and cited retrieval results.

- ⚪ **Phase 10 — ESG / Carbon Zero**
  - Carbon footprint tracker, LEED/BREEAM checklist, ESG reporting.

- ⚪ **Phase 11 — Security Hardening**
  - RBAC enforcement, audit log, secrets management, pen-test checklist.

- ⚪ **Phase 12 — Deployment and Operations**
  - Docker compose production stack, health checks, observability.
