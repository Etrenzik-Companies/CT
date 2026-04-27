# Changelog
## 0.8.0 - 2026-04-27

### Phase 7 — Evidence Intake, RAG Index, Lender Packet Builder, and Incentive Evidence Mapping

- Added `apps/api/src/evidence/`.
  - Deterministic evidence classification, requirement mapping, missing/expired evidence gaps, and review-required links.
  - Uploaded evidence is never treated as accepted by default.
- Added `apps/api/src/ragIndex/`.
  - Deterministic placeholder indexing, citation-first mock search, unindexed document reporting, and no hallucinated missing evidence.
- Added `apps/api/src/incentiveEvidence/`.
  - Incentive evidence stage mapping: `estimated`, `application_ready`, `submitted`, `awarded`, `verified`, `rejected`, `expired`.
  - Estimated incentives remain excluded from verified funds.
- Added `apps/api/src/lenderPacket/`.
  - Packet section builder, readiness score, missing evidence detection, PoF gap blocking, lender authorization gating, and blockchain off-chain review checks.
- Updated `apps/web/src/App.tsx` and `apps/web/src/project-control-pages.ts`.
  - Added five new dashboard modules: Evidence Intake, RAG Index, Lender Packet, Incentive Evidence, and Submission Readiness.
- Added docs `17-evidence-intake-rag-index.md`, `18-lender-packet-builder.md`, and `19-incentive-evidence-and-submission-readiness.md`.
- Updated documentation indexes and roadmap for Phase 7.

## 0.7.1 - 2026-04-27

### Post-Deployment Hardening

- Added `docs/16-post-deployment-security-hardening.md` with Phase 6 deployment status, token-rotation requirements, GitHub Actions secret recommendations, and repo hygiene follow-up.
- Updated `docs/00-table-of-contents.md` to include the Phase 6 hardening note.
- Added `scripts/verify-phase6-live.ps1` for non-interactive HTTP `200` verification of `https://ct.unykorn.org`.
- Added `scripts/check-repo-hygiene.ps1` to report current branch, upstream tracking, working tree status, latest commit, and whether `phase6-rwa-xrpl-pof-funding-v1` is reachable from `main`.

## 0.7.0 - 2026-04-27

### Phase 6 — RWA, XRPL, PoF, ESG, Incentive, and Funding Intelligence

- Added `apps/api/src/rwa/` — RWA Asset Registry engine.
  - `types.ts`: `RwaAsset`, `RwaReadinessResult`, 6 required evidence types, readiness statuses.
  - `engine.ts`: `assessRwaAsset()`, `assessRwaPortfolio()`. Checks 6 evidence types, ownership = 100%, liens, appraisal age, insurance expiry.
  - `engine.test.ts`: 8 tests, all passing.
- Added `apps/api/src/xrpl/` — XRPL Readiness simulation layer.
  - `types.ts`: `XrplSettlementReadiness`, 11 action types (all `approval_required`), 8 compliance warning codes.
  - `readiness.ts`: `assessXrplReadiness()`. Simulation only — no live execution ever.
  - `readiness.test.ts`: 8 tests, all passing.
- Added `apps/api/src/pof/` — Proof of Funds engine.
  - `types.ts`: 17 funding source types, `PofReadinessStatus`, `ProofOfFundsPacket`, `PofReadinessResult`.
  - `engine.ts`: `assessProofOfFunds()`. Estimated sources never count as verified. Gap = projectCost − verifiedFunds.
  - `engine.test.ts`: 7 tests, all passing.
- Added `apps/api/src/incentives/` — Tax Incentive Intelligence engine.
  - `types.ts`: 13 sources, 11 categories, `IncentiveProgram`, `IncentiveMatchResult`.
  - `engine.ts`: `matchIncentivePrograms()`. 6 built-in programs (179D, 45L, DOE, GA property tax, GA energy loan, GE utility rebates). All matches require tax professional review.
  - `engine.test.ts`: 8 tests, all passing.
- Added `apps/api/src/esg/` — ESG Scorecard engine.
  - `types.ts`: 9 metric categories, `EsgScorecard`, `EsgScorecardResult`, estimate flags.
  - `engine.ts`: `assessEsgScorecard()`. Category weights: energy:25, emissions:20, water:10, resilience:10, IAQ:10, community:10, workforce:5, compliance:5, docs:5. Estimates score at 40%.
  - `engine.test.ts`: 8 tests, all passing.
- Added `apps/api/src/funding/` — Funding Intelligence engine.
  - `types.ts`: 14 program types, `FundingMatchResult`, `SubmissionPacket`, `FundingIntelligenceResult`.
  - `engine.ts`: `assessFundingIntelligence()`. 6 built-in programs. Strict potential/committed separation. Capital gap computed from committed stack only.
  - `engine.test.ts`: 9 tests, all passing.
- Updated `apps/web/src/project-control-pages.ts` — added 6 new module paths.
- Updated `apps/web/src/App.tsx` — added Phase 6 PAGE_META, `Phase6Panel` component with status badges, review warning banners, and data cards for all 6 modules.
- Added docs: `13-rwa-xrpl-pof-funding-intelligence.md`, `14-tax-incentive-esg-funding-source-map.md`, `15-lender-submission-and-pof-readiness.md`.
- Updated `docs/00-table-of-contents.md` with Phase 6 doc entries.


## 0.6.0 - 2026-04-27

### Phase 5 — Web App and Cloudflare Pages Deployment

- Replaced `apps/web` placeholder with a production-grade Vite + React 18 + TypeScript SPA.
  - `src/App.tsx`: sidebar navigation, 14-module dashboard grid, per-section detail pages.
  - `public/_redirects`: SPA fallback routing for Cloudflare Pages.
  - `wrangler.toml`: Cloudflare Pages project binding (`ct-control-tower`, `dist/` output).
  - `tsconfig.json` + `vite.config.ts`: strict TypeScript, `@vitejs/plugin-react`.
  - Updated `package.json` from echo placeholders to real Vite build + typecheck scripts.
- Created Cloudflare Pages project `ct-control-tower` (API-provisioned, account `07bcc4a189ef176261b818409c95891f`).
  - Custom domain `ct.unykorn.org` attached and initializing.
- Added `.github/workflows/deploy.yml`.
  - Triggered on push to `main` or manual `workflow_dispatch`.
  - Runs `pnpm --filter @apps/web build` then `wrangler pages deploy` via `cloudflare/wrangler-action@v3`.
  - Requires repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

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
