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

## In Progress

- 🟡 **Phase 5 — Contractor CRM**
  - CRUD operations for contractor profiles, trade categories, license / insurance verification.
  - Integration with `@ct/types` trade categories and `@ct/shared` `Result` pattern.

- 🟡 **Phase 6 — Estimating Engine**
  - Bid package generation, line-item cost database, change-order workflow.
  - Export to PDF and structured JSON.

## Planned

- ⚪ **Phase 7 — Funding Diligence**
  - Lender outreach tracker, closing-conditions matrix, term-sheet comparison.
  - Integration with clay terrace main repo funding data.

- ⚪ **Phase 8 — RAG / MCP / AI Agents**
  - Document ingestion into vector store via `@ct/rag`.
  - Agent roles wired to `AgentRole` type; answers with citations.

- ⚪ **Phase 9 — ESG / Carbon Zero**
  - Carbon footprint tracker, LEED/BREEAM checklist, ESG reporting.

- ⚪ **Phase 10 — Security Hardening**
  - RBAC enforcement, audit log, secrets management, pen-test checklist.

- ⚪ **Phase 11 — Deployment and Operations**
  - Docker compose production stack, health checks, observability.
