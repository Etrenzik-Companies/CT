# Changelog

## 0.5.0 - 2026-04-25

### Phase 4 — Shared packages and real ESLint

- Promoted `packages/shared` from stub to real TypeScript package.
  - Added `Result<T, E>`, `ok()`, `err()`, `Branded<T, B>`, `assertNever()`, `slugify()`, `capitalize()`, `formatCurrency()`, `toIsoDate()`.
  - Added `tsconfig.json` extending root base; real `typecheck` and `build` scripts.
- Promoted `packages/types` from stub to real domain-types package.
  - `ProjectStatus`, `ApprovalStatus`, `RiskLevel`, `TradeCategory`, `FundingType`, `DocumentType`, `CodeJurisdiction`, `AgentRole` — all as `as const` tuples + derived union types.
  - Added `tsconfig.json` and real build scripts.
- Added real ESLint to `apps/api`.
  - `eslint.config.mjs` using `typescript-eslint` flat config with recommended rules.
  - `lint` script upgraded from placeholder to `eslint "src/**/*.ts"`.
  - DevDeps: `eslint@^9`, `typescript-eslint@^8`.
- Deleted stale `feat/agentic-orchestrator-foundation` branch (local + remote).

## 0.4.0 - 2026-04-25

### Phase 3 — MCP Tool Registry Runtime

- Added `apps/api/src/orchestrator/mcpRegistryRuntime.ts`.
  - `McpCommandClass`: `read-only | write | destructive | deploy | external-network`.
  - `McpRuntimeRegistry` with validation hooks and project-control hook enforcement.
  - Deterministic execution outcomes: `allowed | blocked | approval-required`.
  - `McpApprovalPolicy` evaluator and risk classification mapper.
- Added 8 unit tests covering all execution paths (`mcpRegistryRuntime.test.ts`).
- Added architecture doc `docs/12-mcp-tool-registry-runtime.md`.
- Tagged `mcp-registry-runtime-v1` at `c222abd`.

## 0.3.0 - 2026-04-25

### Phase 2 — Agentic Orchestrator Foundation

- Added `apps/api/src/orchestrator/engine.ts`.
  - `AgentTask`, `AgentTaskResult`, `OrchestratorEngine` with typed task dispatch.
  - Safety gates: budget cap, timeout, human-review requirement for high-risk outputs.
- Added 12 unit tests (`engine.test.ts`).
- Added architecture doc `docs/11-agentic-orchestrator-foundation.md`.
- Fixed CI pnpm version conflict (`b050059`).
- Tagged `orchestrator-foundation-v1` at `fb56f2f`.

## 0.2.0 - 2026-04-25

### Phase 1 — Project Control Guardrails

- Added `apps/api/src/projectControl/engine.ts`.
  - 15 guardrail functions covering MCP tool access, permit evidence, incentive approval, tax CPA review, RAG citation requirements, AI output human review, and project template isolation.
  - Types: `ProjectControlContext`, `ProjectControlResult`.
- Added 15 unit tests (`projectControl/engine.test.ts`).
- Added docs and specs for project-control system.
- Tagged `project-control-v1` at `6cb4fa9`.

## 0.1.0 - 2026-04-25

- Initial repository bootstrap.
- Added monorepo scaffolding, docs framework, CI templates, and security baseline.
