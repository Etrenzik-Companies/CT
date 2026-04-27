# 27 — Evidence-to-Requirement Mapping

## Purpose

The Evidence Mapping engine takes a classified intake file and maps it to one or more of 36 specific requirements across the contractor, trade, funding, RWA, compliance, incentive, and lender packet domains. All mapping results have `reviewStatus: "pending"` — mapping is a classification step, not an acceptance decision.

---

## Critical Rule: Mapping ≠ Acceptance

A mapped file has a suggested requirement assignment. It does not:

- Count toward lender-ready status
- Satisfy a requirement
- Count as verified funding
- Remove a professional-review gate

Acceptance is a separate, human-initiated step.

---

## 36 Requirement IDs

### Contractor / Trade

| ID | Description |
|----|-------------|
| `gc_insurance` | GC general liability + workers' comp insurance |
| `gc_bid` | GC approved bid |
| `gc_license` | GC contractor license |
| `gc_scope_of_work` | GC executed scope of work |
| `gc_w9` | GC W-9 |
| `trade_license` | Trade contractor license |
| `trade_scope` | Trade scope of work |
| `trade_bid` | Trade approved bid |
| `trade_w9` | Trade W-9 |

### Site / Legal

| ID | Description |
|----|-------------|
| `appraisal` | Appraisal / valuation |
| `title_search` | Title search / title insurance |
| `survey` | Survey / plat |
| `permit_set` | Permit drawings and AHJ permit set |
| `zoning_confirmation` | Zoning confirmation |
| `utility_confirmation` | Utility capacity confirmation |

### Funding / Capital

| ID | Description |
|----|-------------|
| `bank_statement` | Bank statement |
| `escrow_letter` | Escrow letter |
| `lender_term_sheet` | Lender term sheet |
| `grant_award_letter` | Grant award letter (awarded, not estimated) |
| `tax_credit_estimate` | Tax credit estimate — **blocked as non-verified** |

### ESG / Incentive

| ID | Description |
|----|-------------|
| `energy_model` | Energy model / performance analysis |
| `certification_179d` | 179D certification |
| `equipment_specs_48e` | 48E equipment specifications |
| `ev_charging_specs` | EV charging specifications |

### Public Finance / Legal

| ID | Description |
|----|-------------|
| `bond_tif_public_body_approval` | Bond / TIF public body approval |
| `city_county_support_letter` | City/county support letter |
| `legal_memo` | Legal memo — **attorney review required** |
| `tax_memo` | Tax memo — **CPA review required** |
| `accounting_memo` | Accounting memo |
| `human_approval_log` | Human approval log |

### Special

| ID | Description |
|----|-------------|
| `pof_document` | Proof of funds letter |
| `rwa_legal_review` | RWA legal review — **blocked as non-spendable** |
| `xrpl_proof_reference` | XRPL proof reference — **blocked as non-spendable** |
| `esg_certification` | ESG certification |
| `code_compliance_report` | Code compliance report |
| `fire_life_safety_report` | Fire and life safety report |

---

## Confidence Levels

| Level | Meaning |
|-------|---------|
| `high` | Strong keyword match, standard document type |
| `medium` | Multiple indicators but requires confirmation |
| `low` | Weak signal — human assignment recommended |
| `manual_required` | Cannot be auto-mapped — manual review mandatory |

---

## Mapping Review Statuses

All results are `pending` at creation. The reviewer resolves to one of:

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting reviewer |
| `accepted` | Reviewer confirmed this assignment |
| `rejected` | Reviewer rejected this assignment |
| `needs_clarification` | Reviewer needs more information |
| `expired` | Time-limited document has lapsed |

---

## Critical Blockers by Requirement

These requirements carry standing blockers that must be communicated to reviewers:

| Requirement | Blocker Message |
|-------------|----------------|
| `tax_credit_estimate` | Estimated tax credit does not count as verified funds |
| `xrpl_proof_reference` | XRPL proof reference is not spendable funds |
| `rwa_legal_review` | Tokenized securities require legal review — proof only |
| `legal_memo` | All legal opinions require attorney review |
| `tax_memo` | All tax memos require CPA review |
| `bond_tif_public_body_approval` | Requires public body approval from Carmel/Hamilton County |

---

## Financial and Legal Security

Documents mapped to these requirements are classified as **confidential or above**:

- `bank_statement` → `financial`
- `escrow_letter` → `financial`
- `lender_term_sheet` → `financial`
- `legal_memo` → `legal`
- `tax_memo` → `tax`
- `accounting_memo` → `confidential`
- `rwa_legal_review` → `legal`
- `pof_document` → `financial`

These documents are lender-use only and are not distributed to contractors or third parties without explicit authorization.

---

## Unmapped File Warning

If no mapping rule matches, the engine produces:

```
unmappedWarning: "No automatic mapping found. Manual review and assignment required."
```

The file is classified but not assigned to any requirement until a reviewer assigns it manually.

---

## `reviewStatus` is Always `pending`

All mapping results are initialised with `reviewStatus: "pending"`. No mapping is automatically accepted.

---

## Key References

- Engine: `apps/api/src/evidenceMapping/engine.ts`
- Types: `apps/api/src/evidenceMapping/types.ts`
- Tests: `apps/api/src/evidenceMapping/engine.test.ts` (10 tests)
- Dashboard: `/project-control/evidence-mapping`
