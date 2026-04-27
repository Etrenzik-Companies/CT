# 23 — Contractor and Trade Funding Readiness Matrix

## Purpose

This document defines the lender-grade contractor and trade readiness matrix for the Clay Terrace control room.

It separates three things that are often incorrectly merged:

1. Trade execution readiness
2. Funding-route readiness
3. Regulatory and tax obligations

A project can appear capitalized on paper while still being non-fundable due to contractor and trade evidence gaps.

## Core Rule

Contractor and trade readiness can block:

- lender closing,
- draw disbursements,
- incentive capture,
- code and permit progression,

even when projected capital stack totals appear sufficient.

## Contractor Master Checklist

| Category | Required Items | Why It Matters |
|---|---|---|
| Identity and legal | Legal entity name, tax ID, W-9, authorized signer | Lender KYC and contract enforceability |
| Licensing | State/local trade license, expiration date, jurisdiction match | Permit and code acceptance |
| Insurance | COI, GL, workers comp, umbrella, additional insured endorsements | Lender and owner risk transfer |
| Bonding | Performance/payment bond capacity and letter | Construction risk and default protection |
| Financial capacity | Backlog summary, bank support letter, historical project references | Execution and continuity risk |
| Contract form | Signed contract or letter of intent, scope, schedule, milestones | Draw basis and scope control |
| Pricing evidence | Bid, alternates, exclusions, clarifications, value-engineering log | Budget validity and draw support |
| Schedule evidence | Baseline schedule, critical path, long-lead procurement list | Delivery confidence and draw timing |
| Compliance evidence | Safety plan, QA/QC process, workforce certifications | Operational and legal risk reduction |
| Draw controls | Conditional/final lien waivers, pay app package structure | Draw-release readiness |

## Trade Categories and Readiness Gates

| Trade Category | Critical Evidence | Typical Blocker |
|---|---|---|
| General contractor | GMP or validated budget, schedule, insurance, bond | Missing insurance or unapproved GC package |
| Architect / design | Sealed drawings, code narrative, permit support | Incomplete permit drawing set |
| Civil | Site utility plan, grading/drainage package, jurisdiction notes | Utility coordination unresolved |
| Structural | Structural design package, stamped calculations | Missing stamped structural set |
| Mechanical | Equipment schedule, efficiency specs, commissioning path | Missing energy and performance specs |
| Electrical | Load calcs, one-line, fixture schedule, controls narrative | Incomplete design-control package |
| Plumbing | Fixture/unit schedule, drainage/vent plan, water service details | Permit submittal incomplete |
| Fire protection | Suppression/alarm plan, life-safety code alignment | Fire drawings not ready for AHJ review |
| Envelope | Roof/wall/window assemblies, warranty path | Performance specs unresolved |
| Interiors and FF&E | Room standards, procurement schedule, vendor terms | Long-lead package incomplete |

## Lender-Critical Trade Groups

The following groups are lender-critical for this project profile:

- General contractor
- Architect
- Mechanical
- Electrical
- Plumbing
- Fire protection

Any unresolved blocker in these groups should keep readiness in a blocked or needs-review state.

## Trade Readiness Status Model

| Status | Meaning | Funding Impact |
|---|---|---|
| lender_ready | Required evidence complete and reviewed | Can support lender package and draw stack |
| needs_review | Some evidence present but approvals or clarifications pending | Cannot be treated as firm draw support |
| blocked | Missing critical evidence (license, insurance, permit docs, bids) | Blocks lender readiness/draw progression |

## Funding Impact Mapping

| Trade Condition | Funding Consequence |
|---|---|
| Missing GC package | Senior debt route blocked |
| Missing major trade bids | Budget confidence reduced; lender holdback likely |
| Missing energy specs | Tax credit / utility rebate eligibility not verifiable |
| Missing permit-ready drawings | Permit and code path blocked; funding timeline risk |
| Missing lien-waiver controls | Draw package not releasable |

## Governance Rules

- Estimated trade completeness must not be represented as lender-ready.
- Incentive assumptions tied to trade specs remain estimated until evidence is complete.
- Trade and contractor data must be deterministic and evidence-backed.
- Trade readiness must be visible as an independent gating layer in dashboard modules.

## Implementation Pointers

- API domain: `apps/api/src/contractorMatrix/`
- UI modules: Contractor Matrix and Trade Readiness
- Companion docs: 24 (funding routes), 25 (master lender evidence checklist)

