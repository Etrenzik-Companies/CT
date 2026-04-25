# Security and Human Approval Rules

## Purpose
Consolidate high-risk action controls across contractor, funding, compliance, and AI systems.

## Scope
Human approvals, sensitive actions, evidence requirements, no-secret/no-PII handling, and auditability.

## Current Status
⚫ Baseline rules documented and partially enforced in API guardrail tests.

## Rules
- No legal/tax/engineering/code-official claims without explicit verification.
- No auto submission/sending of permits, funding docs, grants, or legal docs.
- No contractor engagement without approved quote and signed evidence.
- No private document storage on-chain; hash/metadata only.
- High-risk AI outputs require human review.

## Risks
Unauthorized automation or weak evidence hygiene.

## Next Steps
Implement approval workflow service and immutable audit trail.

## Owner
TBD
