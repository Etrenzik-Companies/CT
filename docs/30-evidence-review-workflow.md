# 30. Evidence Review Workflow

## Review Model

Evidence must move through explicit reviewer decisions before acceptance.

- Outcomes:
  - accepted
  - rejected
  - needs_more_info
  - expired
  - blocked
  - duplicate
  - wrong_document
  - review_required

## Reviewer Roles

- project_admin
- lender_reviewer
- legal_reviewer
- tax_reviewer
- accounting_reviewer
- construction_reviewer
- code_reviewer
- esg_reviewer
- public_finance_reviewer

## Role and Policy Gates

- Legal docs require `legal_reviewer`.
- Tax docs require `tax_reviewer` or `accounting_reviewer`.
- Lender docs require lender-use authorization before acceptance.
- Contractor docs require construction/project reviewer.
- Code/permit docs require `code_reviewer`.
- ESG/incentive docs require ESG or tax/accounting reviewer depending on claim type.
- Blockchain/RWA proof references require off-chain review confirmation.

## Audit Requirements

- Accepted decision must create an audit entry.
- Rejected decision must include a reason and audit entry.
- Prohibited secret files cannot be approved by any role.

## Safety Reminder

Upload and review status are independent.

- uploaded != accepted
- mapped != accepted
- accepted requires valid reviewer role + policy conditions + audit log
