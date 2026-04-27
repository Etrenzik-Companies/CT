# 33. Lender-Critical File Review Map

## Item-to-Reviewer Map

- appraisal
  - required: lender_reviewer, project_admin
  - focus: valuation review + completeness
- title_search
  - required: legal_reviewer, title_reviewer
  - focus: legal/title review
- gc_insurance
  - required: construction_reviewer, insurance_reviewer
  - focus: construction/coverage review
- bank_statement
  - required: accounting_reviewer, lender_reviewer
  - focus: financial/confidential and proof-of-funds review
- lender_term_sheet
  - required: lender_reviewer, legal_reviewer
  - focus: lender terms + legal review
  - additional gate: lender-use authorization required

## Integration Targets

- appraisal
  - lenderPacket: appraisal_title_insurance
  - fundingRoutes: senior_construction_loan
- title_search
  - lenderPacket: appraisal_title_insurance
  - packetStatus: legal_title
- gc_insurance
  - contractorMatrix: general_contractor
  - lenderPacket: contractor_bids
- bank_statement
  - pof: proof_of_funds
  - lenderPacket: proof_of_funds
- lender_term_sheet
  - fundingRoutes: senior_construction_loan
  - lenderPacket: capital_stack

## Confidentiality Notes

- bank_statement and lender_term_sheet are confidential.
- title_search and appraisal require professional legal/lender review.
- gc_insurance requires construction and insurance review.

## Acceptance Rules

- Accepted status requires explicit reviewer decision.
- Rejections require reason + audit entry.
- Uploaded/register status alone never implies acceptance.
