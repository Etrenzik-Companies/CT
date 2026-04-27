# 13 — RWA, XRPL, PoF, and Funding Intelligence

> For documentation and diligence purposes only.  
> Nothing in this document constitutes legal, financial, or investment advice.  
> All outputs require review by qualified real estate, tax, and legal counsel.

## Overview

Phase 6 adds four tightly integrated backend engine modules to the CT Control Tower:

1. **RWA Asset Registry** — Real-world asset documentation readiness scoring
2. **XRPL Readiness** — Settlement simulation and compliance warning layer (simulation only)
3. **Proof of Funds** — Capital stack verification, gap analysis, and lender-ready packet status
4. **Funding Intelligence** — Program matching engine (potential matches only — not commitments)

---

## RWA Asset Registry (`apps/api/src/rwa/`)

The RWA engine produces a `RwaReadinessResult` for each asset or portfolio of assets.

### Evidence Requirements

| Evidence Type | Required |
|---|---|
| `title_report` | Yes |
| `deed_or_ownership_record` | Yes |
| `appraisal_report` | Yes |
| `insurance_certificate` | Yes |
| `survey` | Yes |
| `environmental_phase_1` | Yes |

### Readiness Statuses

| Status | Meaning |
|---|---|
| `lender_ready` | All 6 docs present, ownership = 100%, no expired insurance, no unsupported liens |
| `needs_evidence` | One or more required docs missing |
| `needs_review` | All docs present but warnings exist (appraisal age, liens, etc.) |
| `blocked` | Ownership ≠ 100% or critical evidence blocked |

---

## XRPL Readiness (`apps/api/src/xrpl/`)

> **SIMULATION ONLY.** No live XRPL transactions are ever executed.  
> All 11 action types are hardcoded `approval_required`.

### Asset Classification Path

```
No evidence → blocked
Evidence, no currency/issuer → documentation_only
Evidence + currency only → proof_reference
Evidence + currency + issuer → settlement_reference
Tokenization candidate → explicit flag on asset reference
```

### Compliance Warnings (always included)

| Code | Description |
|---|---|
| `no_sec_guidance` | SEC has not issued definitive guidance on this token class |
| `finra_review_required` | FINRA review required before any public offering |
| `aml_kyc_required` | AML/KYC obligations apply to all participants |
| `cross_border_restrictions` | Cross-border transfer restrictions may apply |
| `smart_contract_risk` | Smart contract vulnerabilities create settlement risk |
| `liquidity_risk` | Secondary market liquidity may be limited or absent |

---

## Proof of Funds (`apps/api/src/pof/`)

### Funding Source Classification

| Category | Verified | Notes |
|---|---|---|
| Bank wire / statement | Yes | SWIFT/wire reference required |
| Blockchain evidence | Yes | Hash + confirmations required |
| Grant | **No** | Estimated — never counts as verified |
| Tax credit proceeds | **No** | Estimated — never counts as verified |
| C-PACE | **No** | Estimated — never counts as verified |
| `unverified_estimate` | **No** | Blocked for lender submission |

### PoF Status Flow

```
lender_ready         ← gap = 0, no estimates, no missing evidence, lender auth present
internally_ready     ← gap = 0, lender auth missing
evidence_missing     ← some evidence not uploaded
gap_unresolved       ← verified funds < project cost
blocked              ← estimated source counted or critical blocker
```

---

## Funding Intelligence (`apps/api/src/funding/`)

### Built-in Program Catalog

| Program | Type | Jurisdiction |
|---|---|---|
| Regional Bank Construction Loan | `construction_loan` | National |
| Bridge / Hard Money Loan | `bridge_loan` | National |
| C-PACE Georgia | `cpace` | GA |
| Green Bank / Climate Finance | `green_bank` | National |
| HUD 221(d)(4) | `construction_loan` | National |
| New Markets Tax Credit (NMTC) | `tax_credit` | National |

### Readiness Score Weights

| Component | Weight |
|---|---|
| RWA Readiness | 30% |
| PoF Status | 35% |
| ESG Score | 20% |
| Incentive Alignment | 15% |

> All program matches are **potential only** until executed documentation exists.  
> Potential and committed are strictly separated at all times.
