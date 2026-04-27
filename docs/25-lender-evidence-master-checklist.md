# 25 — Lender Evidence Master Checklist

## Purpose

This is the master checklist for lender packet assembly and draw package readiness.

It consolidates contractor, trade, funding, legal, tax, compliance, and RWA reference controls into one lender-facing evidence framework.

## Lender-Safe Principles

1. Only evidence-backed and approved routes can be represented as verified funding.
2. Obligations (tax/code/compliance costs) are tracked separately from funding routes.
3. RWA/XRPL artifacts are diligence references and not spendable capital in this phase.
4. Missing critical evidence blocks readiness regardless of projected totals.

## Section A — Project Identity and Governance

| Item | Required Evidence | Status Notes |
|---|---|---|
| Borrower identity | Legal entity docs, formation docs, EIN, signer authority | Required for KYC and enforceability |
| Ownership structure | Org chart, beneficial ownership declaration | Required for lender diligence |
| Project profile | Address, parcel, use type, development narrative | Must align with appraisal and plans |
| Governance controls | Approval policy, sign-off matrix, delegated authorities | Required for controlled execution |

## Section B — Site Control and Real Estate

| Item | Required Evidence | Status Notes |
|---|---|---|
| Site control | Deed, purchase agreement, option, assignment docs | Must show legal control rights |
| Title condition | Title commitment, exception list, endorsements | Required for close readiness |
| Survey and legal description | ALTA/survey and legal description consistency | Must match title and plans |
| Encumbrance review | Lien/ucc/servitude summary | Impacts lender risk and structure |

## Section C — Entitlements, Permits, and Code

| Item | Required Evidence | Status Notes |
|---|---|---|
| Zoning/land use | Zoning confirmation and permitted-use memo | Required for development validity |
| Permit path | Permit matrix, status tracker, resubmittal log | Delays affect funding timeline |
| Code compliance | AHJ code plan, life-safety narrative, inspection path | Code obligations are not funding |
| Utility coordination | Utility will-serve or capacity confirmations | Critical for schedule confidence |

## Section D — Contractor and Trade Package

| Item | Required Evidence | Status Notes |
|---|---|---|
| GC package | Contract/GMP, insurance, bond, schedule, safety plan | Lender-critical blocker if incomplete |
| Major trade bids | Mechanical, electrical, plumbing, fire, envelope bid packages | Needed for budget confidence |
| Licensing and insurance | Active licenses and COI by trade | Permit and risk-transfer dependency |
| Draw controls | Lien waiver workflow and pay app structure | Required for draw release confidence |

## Section E — Budget, Uses, and Draw Governance

| Item | Required Evidence | Status Notes |
|---|---|---|
| Development budget | Hard/soft cost model with assumptions log | Must tie to contracts and bids |
| Sources and uses | Route-level source mapping with stages | Keep stage buckets separated |
| Draw schedule | Monthly draw cadence and milestone mapping | Must align with project schedule |
| Change-order governance | Thresholds, approvals, contingency protocol | Required for variance control |

## Section F — Funding Routes Master Checklist

| Route Family | Required Evidence | Lender Treatment |
|---|---|---|
| Senior debt | Appraisal, budget, permits, GC package, equity proof | Eligible for verified only when satisfied |
| Equity | Bank/escrow evidence, org docs, subscriptions | Eligible when evidence is complete |
| Grants/rebates | Application, award letter, terms | Awarded/submitted until fully verified |
| Tax routes | Eligibility docs, tax/accounting memo | Non-verified until reviewed and monetization is validated |
| Public finance | Public approvals, counsel memo, authorization docs | Not verified without formal approvals |
| RWA/XRPL references | Legal/compliance memos, approval logs, evidence linkage | Not spendable funding in this phase |
| Obligations | Tax/code/permit obligations and payment requirements | Track as obligations only |

## Section G — Legal, Tax, and Compliance

| Item | Required Evidence | Status Notes |
|---|---|---|
| Legal review | Counsel memo on structure and enforceability | Required for complex funding routes |
| Tax review | CPA/tax counsel memo for credits and deductions | Required for tax route claims |
| Securities review | Securities counsel memo for tokenized structures | Required before any security-like pathway |
| Compliance controls | KYC/AML and policy controls where applicable | Required for high-risk routes |

## Section H — RWA/XRPL Diligence References

| Item | Required Evidence | Status Notes |
|---|---|---|
| Proof-of-funds reference | Bank proof + authorization letter + reference mapping | Non-spendable reference route |
| Document hash attestations | Hash record + source file traceability | Integrity proof only |
| Ownership reference | Deed/title references and ownership linkage | Diligence support only |
| Route approvals | Legal, compliance, and human approval logs | Required for high-risk routes |

## Section I — Draw Package Readiness

| Item | Required Evidence | Status Notes |
|---|---|---|
| Draw request package | Pay app, schedule-of-values, invoice support | Baseline draw requirement |
| Inspection support | Site inspection reports and completion evidence | Needed for draw authorization |
| Lien waiver chain | Conditional/final waivers by contractor and trade | Missing waivers block release |
| Stored materials controls | Proof of ownership, insurance, storage evidence | Required if funded in draws |

## Section J — Funding Gap Map and Explanations

| Bucket | Included Items | Excluded Items |
|---|---|---|
| Verified funding | Evidence-complete, route-eligible, approved funds | Estimated/submitted/awarded-only routes |
| Estimated | Preliminary projections only | Any verified claims |
| Submitted | Applications filed but unresolved | Verified cash availability |
| Awarded | Awarded but not fully spendable/closed | Verified draw-ready funds |
| Obligations | Taxes, code, permit, compliance obligations | Any funding source treatment |
| Not counted | XRPL proof references, review-only tokenized routes, unsupported assumptions | Spendable stack treatment |

## Evidence Gaps That Must Trigger Blockers

- Missing GC insurance/bond package
- Missing appraisal or permit evidence for senior debt
- Missing bank/escrow proof for sponsor equity
- Missing award letter for grants treated as funded
- Missing tax/accounting memo for tax-route claims
- Missing legal/compliance approvals for high-risk RWA routes
- Missing lien-waiver and inspection chain for draw readiness

## Implementation Pointers

- API engines:
  - `apps/api/src/contractorMatrix/engine.ts`
  - `apps/api/src/fundingRoutes/engine.ts`
  - `apps/api/src/rwaFundingRoutes/engine.ts`
- Dashboard modules:
  - Contractor Matrix
  - Trade Readiness
  - Funding Routes
  - RWA Funding Routes
  - Lender Evidence Checklist
  - Draw Package Readiness
  - Funding Gap Map

