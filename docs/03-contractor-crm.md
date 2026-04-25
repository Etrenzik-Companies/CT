# Contractor CRM

## Purpose
Manage contractor lifecycle, trade coverage, qualification, and engagement readiness.

## Scope
Companies, contacts, trades, subcontractors, quotes, contracts, credentials, follow-ups.

## Current Status
🟡 Spec drafted.

## Key Components
- Contractor companies
- Contacts
- Trade categories
- Subcontractors
- Quotes and engagement letters
- Licenses and insurance
- W-9 and safety records
- Bid history
- Follow-ups and communication logs

## Status Model
- identified
- contacted
- quote_requested
- quote_received
- under_review
- approved
- engaged
- rejected
- inactive

## Guardrail
Do not mark a contractor as engaged without signed contract or engagement-letter evidence.

## Risks
Incorrect engagement transitions and missing compliance artifacts.

## Next Steps
Implement entities, validation rules, and status transition checks.

## Owner
TBD
