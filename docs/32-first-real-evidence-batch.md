# 32. First Real Evidence Batch

## Objective

Phase 10 introduces the first lender-critical evidence batch as a safe metadata/checklist workflow.

Target batch items:

1. appraisal
2. title_search
3. gc_insurance
4. bank_statement
5. lender_term_sheet

## Scope

- Builds first-batch checklist and readiness model.
- Assigns required reviewer roles for each item.
- Integrates first-batch mappings into vault, mapping, packet status, lender packet, funding routes, and contractor matrix dependencies.
- Uses placeholder metadata only.

## Safety Rules

- No real confidential documents are committed in this phase.
- No private keys, seed phrases, API tokens, passwords, or secret material are allowed.
- Upload/register does not mean accepted.
- Auto-accept is always false.

## Lender-Ready Gate

`lenderReady = true` only when:

- all five first-batch items are `accepted`
- lender-use authorization is true

Otherwise lender-ready remains false.

## Status Flow

`missing -> requested -> received -> registered -> mapped -> review_required -> accepted`

Rejection/blocked/expired statuses remain non-ready states and require remediation.
