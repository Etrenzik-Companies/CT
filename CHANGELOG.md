# Changelog
## 0.8.5 - 2026-04-27

### Phase 9 — Upload UI and Local Evidence Vault

- Added `apps/api/src/evidenceVault/types.ts`, `apps/api/src/evidenceVault/engine.ts`, and `apps/api/src/evidenceVault/engine.test.ts`.
  - Metadata-only local evidence vault registration (no raw file byte storage in this phase).
  - Deterministic evidence ID generation, extension/size normalization, allowed-extension + max-size guards.
  - Prohibited secret pattern blocking for `.env`, `id_rsa`, private key, seed phrase, mnemonic, API token, password, and wallet key patterns.
  - Sensitive-document flagging for bank statements, legal/tax memos, identity-sensitive docs, lender term sheets, insurance docs, and title docs.
  - `autoAccepted: false` enforced on all registrations.
- Added `apps/api/src/uploadRequests/types.ts`, `apps/api/src/uploadRequests/engine.ts`, and `apps/api/src/uploadRequests/engine.test.ts`.
  - Category-driven upload checklists across contractor/trade/funding/pof/rwa/esg/incentive/tax/legal/code/permit/lender/insurance/title/appraisal/utility/other.
  - Missing blocker prioritization and next-best-action generation.
  - Secret-like request labels are guarded against and excluded.
  - Requests link to `evidenceMapping` and `packetStatus` module targets.
- Added `apps/api/src/evidenceReview/types.ts`, `apps/api/src/evidenceReview/engine.ts`, and `apps/api/src/evidenceReview/engine.test.ts`.
  - Role-gated review policy for legal/tax/lender/contractor/code/ESG/incentive/blockchain-reference evidence classes.
  - Lender document acceptance requires lender-use authorization.
  - Rejection requires reason; acceptance and rejection produce audit entries.
  - Secret-detected files cannot be approved.
- Updated `apps/web/src/project-control-pages.ts` and `apps/web/src/App.tsx`.
  - Added seven new dashboard modules:
    - Upload Center
    - Local Evidence Vault
    - Upload Requests
    - Review Workflow
    - Sensitive Documents
    - Quarantined Files
    - Evidence Audit Log
- Added docs:
  - `docs/29-upload-ui-and-local-evidence-vault.md`
  - `docs/30-evidence-review-workflow.md`
  - `docs/31-evidence-security-and-retention-policy.md`
- Updated documentation and planning indexes:
  - `docs/00-table-of-contents.md`
  - `ROADMAP.md`

## 0.8.4 - 2026-04-27

### Phase 8 — Real Evidence Packet Intake

- Added `apps/api/src/evidenceInbox/types.ts`, `apps/api/src/evidenceInbox/engine.ts`, and `apps/api/src/evidenceInbox/engine.test.ts`.
  - 10 tests. Enforces `autoAccepted: false` literal at all times.
  - Classifies file type, detects 10 secret patterns (private keys, seed phrases, API tokens, passwords, etc.) and blocks them as `secret_prohibited`.
  - Infers preliminary mapping targets from 24 keyword rules.
- Added `apps/api/src/evidenceMapping/types.ts`, `apps/api/src/evidenceMapping/engine.ts`, and `apps/api/src/evidenceMapping/engine.test.ts`.
  - 10 tests. Maps evidence to 36 specific requirement IDs across contractor, trade, funding, RWA, incentive, compliance, and lender domains.
  - All mapping results initialised with `reviewStatus: "pending"` — no auto-acceptance.
  - Standing blockers on: `tax_credit_estimate`, `xrpl_proof_reference`, `rwa_legal_review`, `legal_memo`, `tax_memo`, `bond_tif_public_body_approval`.
- Added `apps/api/src/packetStatus/types.ts`, `apps/api/src/packetStatus/engine.ts`, and `apps/api/src/packetStatus/engine.test.ts`.
  - 8 tests. 8 categories: contractor, trade, funding, rwa, pof, esg_incentive, code_permit, lender.
  - `lender_ready` requires: all evidence present + all accepted + professional review complete + no blockers + lender-use authorization on file.
  - 10 professional-review-required items enforced.
- Updated `apps/web/src/project-control-pages.ts` — added 7 new Phase 8 routes.
- Updated `apps/web/src/App.tsx` — added `EVIDENCE_PACKET_PANELS`, `EvidencePacketPanel` component, and `isEvidencePacket` detection for 7 new dashboard modules:
  - Evidence Inbox
  - Evidence Mapping
  - Packet Status
  - Accepted Evidence
  - Blocked Evidence
  - Review Queue
  - Real Lender Packet
- Added docs:
  - `docs/26-real-evidence-intake-inbox.md`
  - `docs/27-evidence-to-requirement-mapping.md`
  - `docs/28-real-lender-packet-status-engine.md`
- Updated `docs/00-table-of-contents.md` with entries 26–28.
- Updated `ROADMAP.md` with Phase 8 completed status.

## 0.8.3 - 2026-04-27

### Funding Control Room Expansion

- Added `apps/api/src/contractorMatrix/types.ts`, `apps/api/src/contractorMatrix/engine.ts`, and `apps/api/src/contractorMatrix/engine.test.ts`.
  - Introduced contractor/trade readiness typing and deterministic lender-blocker evaluation for GC, major trades, permit readiness, and incentive-impact trade evidence.
- Added `apps/api/src/fundingRoutes/types.ts`, `apps/api/src/fundingRoutes/engine.ts`, and `apps/api/src/fundingRoutes/engine.test.ts`.
  - Implemented route-level stage separation (`estimated/submitted/awarded/verified/obligation_only/not_counted`) and strict verified-funds gating.
  - Added explicit `hotel_local_taxes_obligation` route to enforce tax obligations as non-funding.
- Added `apps/api/src/rwaFundingRoutes/types.ts`, `apps/api/src/rwaFundingRoutes/engine.ts`, and `apps/api/src/rwaFundingRoutes/engine.test.ts`.
  - Added non-spendable RWA/XRPL route controls with legal/compliance/human approval gates and live-execution blocking.
- Updated `apps/web/src/project-control-pages.ts` and `apps/web/src/App.tsx`.
  - Added seven new dashboard modules:
    - Contractor Matrix
    - Trade Readiness
    - Funding Routes
    - RWA Funding Routes
    - Lender Evidence Checklist
    - Draw Package Readiness
    - Funding Gap Map
- Added docs:
  - `docs/23-contractor-and-trade-funding-readiness-matrix.md`
  - `docs/24-funding-routes-and-rwa-capital-stack.md`
  - `docs/25-lender-evidence-master-checklist.md`
- Updated documentation and planning indexes:
  - `docs/00-table-of-contents.md`
  - `ROADMAP.md`

## 0.8.2 - 2026-04-27

### Indiana Official-Source Matrix Expansion

- Added `apps/api/src/indianaPrograms/types.ts`.
  - Introduced domain types for Indiana program matrix categories, statuses, source confidence, funding value treatment, tax requirements, code requirements, and Clay Terrace profile input.
- Added `apps/api/src/indianaPrograms/engine.ts`.
  - Implemented deterministic matrix assessment for Indiana state incentives, federal ESG/tax paths, brownfield/environmental tracks, Carmel/Hamilton public-finance tracks, taxes, and code-compliance obligations.
  - Enforced strict separation between obligations and funding sources.
  - Enforced evidence-gated transitions and prohibited estimated values from counting as verified funds.
- Added `apps/api/src/indianaPrograms/engine.test.ts`.
  - Added 11 deterministic tests covering innkeeper-tax obligation classification, 179D/48E evidence gating, HBI/EDGE/SEF gating, brownfield monitor-only behavior, C-PACE monitor-only behavior, bonds/TIF approval gating, funding-stage separation, code-gap lender blocking, and determinism.
- Updated `apps/web/src/project-control-pages.ts` and `apps/web/src/App.tsx`.
  - Added seven new dashboard modules:
    - Indiana Program Matrix
    - ESG Incentives
    - Grants & Public Funding
    - Bonds / TIF / Redevelopment
    - Hotel & Local Taxes
    - Code Compliance
    - Evidence Gaps
  - Added display treatment that keeps `estimated`, `submitted`, `awarded`, and `verified` values separate.
- Added docs:
  - `docs/21-indiana-esg-incentives-grants-bonds-tax-code-matrix.md`
  - `docs/22-carmel-hamilton-county-compliance-and-public-finance.md`
- Updated documentation and planning indexes:
  - `docs/00-table-of-contents.md`
  - `ROADMAP.md`

## 0.8.1 - 2026-04-27

### Indiana Project Profile and Incentive Alignment

- Updated `apps/api/src/incentives/engine.ts`.
  - Replaced Georgia-specific incentive entries with Indiana and Carmel-relevant entries for HBITC, Skills Enhancement Fund, local redevelopment support, Indiana C-PACE monitoring, and Indiana utility rebate screening.
  - Replaced `45L` with `48E` for a hotel-oriented commercial clean-electric pathway.
  - Improved next-step guidance so tax programs require tax review while non-tax programs require program-administrator confirmation.
- Updated `apps/api/src/incentives/engine.test.ts`.
  - Rebased tests from a Georgia construction scenario to a Carmel, Indiana hotel scenario.
  - Added assertions for Indiana-specific matches and utility / tax next-step behavior.
- Updated `docs/14-tax-incentive-esg-funding-source-map.md`.
  - Re-anchored the incentive and ESG map to the Clay Terrace hotel in Carmel, Indiana using the current pro forma inputs.
- Added `docs/20-clay-terrace-indiana-project-brief.md`.
  - Captured the extracted hotel pro forma, capital stack, Indiana incentive stack, tax notes, ESG priorities, and remaining evidence gaps.

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
