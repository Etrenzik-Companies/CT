# 31. Evidence Security and Retention Policy

## Security Baseline

All evidence records are treated as controlled data.

- Raw secrets are prohibited.
- Private keys, seed phrases, API tokens, wallet keys, and passwords must never be uploaded.
- Secret-like files are quarantined or rejected by policy.

## Confidential Handling

The following classes default to restricted handling:

- financial documents (bank statements, escrow evidence)
- legal documents (legal memos, attorney opinions)
- tax documents (tax memos, CPA materials)
- identity-sensitive documents
- lender, insurance, and title documentation

These classes require role-based reviewer access before acceptance.

## Retention and Access

- Vault starts metadata-only in Phase 9.
- Local reference storage mode is default.
- Retention policies are assigned at registration.
- Access policies include restricted tiers for sensitive classes.
- External third-party upload/storage remains blocked by policy in this phase.

## Acceptance and Evidence Integrity

- Upload/register does not imply acceptance.
- Acceptance requires explicit reviewer approval and audit trail entry.
- Rejection requires reason capture.
- Estimated incentives and blockchain proof references do not become verified spendable funds without required off-chain/legal/financial validation.
