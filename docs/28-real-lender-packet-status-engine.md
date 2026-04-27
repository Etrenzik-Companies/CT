# 28 — Real Lender Packet Status Engine

## Purpose

The Packet Status engine assesses per-category completeness of the lender packet across 8 categories. It enforces a strict lender-ready gate: evidence must be present, accepted by a human reviewer, professionally reviewed (where required), free of active blockers, and authorised for lender use.

---

## The 8 Packet Categories

| Category | Key Required Evidence |
|----------|-----------------------|
| `contractor` | gc_insurance, gc_bid, gc_license, gc_scope_of_work, gc_w9 |
| `trade` | trade_license, trade_scope, trade_bid, trade_w9 |
| `funding` | appraisal, title_search, bank_statement, lender_term_sheet, escrow_letter |
| `rwa` | rwa_legal_review, xrpl_proof_reference, human_approval_log |
| `pof` | pof_document, bank_statement, escrow_letter |
| `esg_incentive` | energy_model, certification_179d, grant_award_letter |
| `code_permit` | permit_set, zoning_confirmation, utility_confirmation, code_compliance_report, fire_life_safety_report |
| `lender` | All 12 lender-checklist requirements |

---

## Lender-Ready Status Flow

```
not_started → evidence_received → evidence_mapped → review_required
    → accepted_partial → accepted_complete → lender_ready
                              blocked (at any stage)
```

| Status | Meaning |
|--------|---------|
| `not_started` | No evidence submitted for this category |
| `evidence_received` | Files uploaded but not yet reviewed |
| `evidence_mapped` | Files mapped to requirements |
| `review_required` | Human reviewer needed |
| `accepted_partial` | Some items accepted, some still pending |
| `accepted_complete` | All required items accepted |
| `lender_ready` | Accepted + reviewed + no blockers + authorized |
| `blocked` | Active compliance or policy blocker |

---

## Lender-Ready Gates (All Must Pass)

A category achieves `lender_ready` only when all of the following conditions are true:

1. **All required evidence is present** — every required item for the category has been submitted
2. **All uploaded items are accepted** — no item remains in `received`, `classified`, `mapped`, or `needs_review`
3. **Professional review is complete** where required (see below)
4. **No active blockers** — no outstanding compliance or policy blockers
5. **Lender-use authorization is on file** — explicit authorisation from the borrower for lender sharing

If any gate fails, the result is `accepted_partial`, `review_required`, or `blocked` — never `lender_ready`.

---

## Professional Review Required Items

These requirement IDs require professional review (attorney, CPA, or lender) before the item counts as accepted:

| Requirement | Reviewer |
|-------------|---------|
| `legal_memo` | Attorney |
| `tax_memo` | CPA |
| `accounting_memo` | CPA / Accountant |
| `rwa_legal_review` | Securities attorney |
| `xrpl_proof_reference` | Legal/compliance reviewer |
| `tax_credit_estimate` | CPA — note: estimated, not verified |
| `grant_award_letter` | Grants administrator |
| `certification_179d` | Qualified engineer + CPA |
| `equipment_specs_48e` | Engineer |
| `bond_tif_public_body_approval` | Public finance attorney |

---

## Blocked Items — Policy Rules

The following items are blocked by standing policy and cannot contribute to lender-ready status regardless of reviewer acceptance:

| Requirement | Block Reason |
|-------------|-------------|
| `tax_credit_estimate` | Estimated credits are not verified funds. Must be separately tracked as estimated/submitted/awarded/verified. |
| `xrpl_proof_reference` | XRPL proof references are non-spendable. Evidence/compliance use only. |
| `rwa_legal_review` | Tokenized securities are non-spendable. Proof-reference only unless separately approved by securities counsel. |

---

## Funding Stage Separation

For incentive and public-finance items, the engine requires strict stage separation:

| Stage | Meaning |
|-------|---------|
| `estimated` | Professional estimate only — not awarded |
| `submitted` | Application submitted — not decided |
| `awarded` | Award letter received — not yet verified |
| `verified` | Evidence backed + professionally reviewed + accepted |
| `not_counted` | Explicitly excluded from verified capital stack |

Estimated, submitted, and awarded items are tracked but **do not reduce the verified funding gap** and **do not contribute to lender-ready status**.

---

## RWA / XRPL Packet Rules

The `rwa` category packet follows special rules:

- `rwa_legal_review` and `xrpl_proof_reference` items are tracked for evidence and compliance purposes
- They do not represent spendable funds
- No live XRPL transactions are created by this system
- `human_approval_log` is required before any RWA route is shown as reviewed
- Legal review must be complete before any token-related item is shown as accepted

---

## Lender Category (12-Item Minimum)

The `lender` packet requires acceptance of all 12 master-checklist items:

appraisal, title_search, survey, bank_statement, escrow_letter, lender_term_sheet, legal_memo, tax_memo, accounting_memo, human_approval_log, pof_document, code_compliance_report

Missing or unreviewed items in any of these 12 blocks lender_ready for the entire lender category.

---

## Completeness Score

The engine calculates `completenessPercent` as:

```
completenessPercent = (accepted items / total required items) × 100
```

This is a progress indicator only. `completenessPercent === 100` does not mean `lender_ready` — all 5 gates must independently pass.

---

## Safety Invariants

1. `autoAccepted` is always `false` — never set by the engine
2. `lenderReady` is `false` unless all 5 gates pass
3. Estimated incentives are never counted as verified
4. XRPL/RWA proof references are never counted as spendable
5. Professional review requirements cannot be bypassed
6. Lender-use authorization must be explicitly provided
7. Active blockers prevent `lender_ready` regardless of completeness score

---

## Key References

- Engine: `apps/api/src/packetStatus/engine.ts`
- Types: `apps/api/src/packetStatus/types.ts`
- Tests: `apps/api/src/packetStatus/engine.test.ts` (8 tests)
- Dashboard: `/project-control/packet-status`, `/project-control/real-lender-packet`
- Related: [26-real-evidence-intake-inbox.md](26-real-evidence-intake-inbox.md), [27-evidence-to-requirement-mapping.md](27-evidence-to-requirement-mapping.md)
