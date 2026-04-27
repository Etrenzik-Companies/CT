# Lender Packet Builder

## Goal

The lender packet builder turns accepted evidence, PoF status, incentive state, and review gates into a deterministic lender-readiness output.

## Packet Sections

- executive_summary
- sponsor_profile
- project_overview
- rwa_asset_summary
- capital_stack
- proof_of_funds
- construction_budget
- contractor_bids
- appraisal_title_insurance
- tax_incentives
- esg_green_financing
- permits_compliance
- xrpl_proof_references
- risk_register
- human_approval_log

## Lender-Ready Blocking Rules

- Missing required evidence blocks lender-ready status.
- An unresolved PoF gap blocks lender-ready status.
- Missing lender-use authorization blocks lender-ready status.
- Blockchain or XRPL references without off-chain review block lender-ready status.
- Incentive values that are still estimated, application-ready, or merely submitted do not count as verified funds.
- Legal, accounting, and lender review remain required before real-world submission.

## Submission Standard

Lender-ready status requires reviewed evidence, complete human approvals, and a resolved capital stack. Uploaded evidence alone is not sufficient.