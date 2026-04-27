# 29. Upload UI and Local Evidence Vault

## Purpose

Phase 9 introduces a safe intake workflow for evidence registration and review routing.

- Upload/register means metadata registration only.
- Upload/register does not mean accepted.
- Accepted evidence always requires explicit human review and audit entry.

## Scope

- New dashboard modules:
  - Upload Center
  - Local Evidence Vault
  - Upload Requests
  - Review Workflow
  - Sensitive Documents
  - Quarantined Files
  - Evidence Audit Log
- New API domains:
  - `evidenceVault`
  - `uploadRequests`
  - `evidenceReview`

## Vault Design

- Metadata-only registration in Phase 9.
- No raw file byte storage in this phase.
- Stable evidence ID generation from normalized metadata.
- Storage modes include local-reference and blocked external storage paths.
- Security scan outcomes include clean, sensitive, secret-detected, unsupported, oversized, and blocked.

## Non-Negotiable Rules

- No auto-accept for uploaded evidence.
- Prohibited secrets must never be uploaded:
  - private keys
  - seed phrases / mnemonics
  - API tokens / keys
  - passwords
  - wallet keys
  - `.env` and equivalent secret files
- Confidential documents require restricted handling and reviewer assignment.

## Funding Safety

- Estimated incentives are not verified funds.
- XRPL/RWA proof references are not spendable funds.
- Live XRPL/RWA transactions remain blocked or approval-required.
