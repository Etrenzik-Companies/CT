# 24 — Funding Routes and RWA Capital Stack

## Purpose

This document defines the funding route taxonomy and value-stage treatment for lender-safe capital stack analysis.

It enforces the central separation rule:

- obligations are not funding,
- estimated/submitted items are not verified funds,
- RWA/XRPL reference routes are not spendable funding.

## Value Stage Model

| Stage | Description | Spendable for Lender Gap? |
|---|---|---|
| estimated | Preliminary estimate or model assumption | No |
| submitted | Application submitted or route initiated | No |
| awarded | Program awarded but not fully closed/available | No (unless separately authorized by lender policy) |
| verified | Evidence-complete and route requirements satisfied | Yes, if route permits verified counting |
| obligation_only | Cost/legal obligation bucket (taxes, code, etc.) | No |
| not_counted | Explicitly excluded from spendable stack | No |

## Funding Route Families

| Family | Example Routes | Notes |
|---|---|---|
| Senior debt | Senior construction loan, bridge loan, mini-perm, permanent debt | Requires lender underwriting evidence |
| Equity | Sponsor equity, preferred equity, mezzanine | Must show source-of-funds evidence |
| Programmatic | Grants, utility rebates, workforce grants | Application does not equal cash availability |
| Tax pathways | State/federal credits, deductions, transferable tax credits | Require tax/accounting review; often non-cash timing effects |
| Public finance | TIF, economic development bonds, redevelopment support | Needs public-body approvals |
| Specialized finance | Equipment and FF&E financing, receivable financing | Route-specific risk and covenants |
| RWA-tagged private routes | RWA private credit/equity package references | Diligence support only unless explicitly converted |
| XRPL/RWA reference routes | XRPL proof reference, tokenized security review only | Compliance and legal review; non-spendable in this model |

## Explicit Obligation Routes

The control room treats these as obligations, not funding:

- Hotel and local taxes
- Code compliance and permit obligations
- Statutory or jurisdictional payment obligations

These obligations may affect project cash needs but are never added to verified funds.

## Route Gating Examples

| Route | Minimum Evidence | Common Blocking Condition |
|---|---|---|
| Senior construction loan | Appraisal, budget, permits, GC package, equity proof | Missing permits or GC package |
| Sponsor equity | Bank/escrow proof, operating docs | Pledged equity without proof |
| Grant | Application, award letter, program terms | Missing award letter |
| State/federal tax route | Program docs + tax/accounting memo | Missing tax review |
| TIF / bond route | Public-body approval and legal analysis | Unapproved public action |
| C-PACE monitor route | Local authorization + lender consent | Missing local or lender authorization |
| Tokenized security review route | Securities counsel + legal memo | Missing legal/compliance review |

## RWA/XRPL Route Policy

RWA and XRPL paths in this phase are for:

- evidence references,
- diligence traces,
- legal/compliance workflow staging.

They are not for:

- live issuance,
- trustline changes,
- DEX activity,
- escrow execution,
- payment settlement execution.

## Bucket Math Guidance

Maintain separate displayed totals for:

- verified funding,
- awarded,
- submitted,
- estimated,
- obligations,
- not-counted.

Do not collapse these buckets into a single number for lender readiness statements.

## Implementation Pointers

- API domains:
  - `apps/api/src/fundingRoutes/`
  - `apps/api/src/rwaFundingRoutes/`
- UI modules:
  - Funding Routes
  - RWA Funding Routes
  - Funding Gap Map

