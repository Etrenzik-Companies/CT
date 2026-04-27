# 15 — Lender Submission and PoF Readiness Guide

> For documentation and planning purposes only.  
> All PoF packet contents must be reviewed by qualified real estate and legal counsel before submission.  
> This guide does not constitute a commitment, pre-approval, or legal opinion.

## PoF Packet Readiness Checklist

A lender-ready Proof of Funds packet must satisfy all of the following:

- [ ] All funding sources have uploaded bank evidence or blockchain evidence
- [ ] Total verified funds ≥ project cost (capital gap = $0)
- [ ] No estimated sources are counted toward verified capital
- [ ] At least one lender authorization letter is present
- [ ] Lender authorization is valid (not expired, project cost confirmed)

If any of these are unmet, the PoF packet status will be `internally_ready`, `evidence_missing`, `gap_unresolved`, or `blocked`.

---

## Source Classification Rules

| Source Type | Verified? | Notes |
|---|---|---|
| `bank_account` | Yes | Bank statement with account number and balance |
| `wire_transfer` | Yes | Wire confirmation with SWIFT and amount |
| `escrow_account` | Yes | Escrow statement, escrow number, agent name |
| `line_of_credit` | Yes | LOC confirmation letter, available balance |
| `equity_commitment` | Yes | Signed equity commitment letter |
| `xrpl_blockchain_reference` | Yes | XRPL tx hash, confirmed ledger, balance |
| `stellar_blockchain_reference` | Yes | Stellar tx hash, confirmed |
| `grant` | **No** | Estimated — conditional on award |
| `tax_credit_proceeds` | **No** | Estimated — conditional on certification |
| `rebate` | **No** | Estimated — conditional on approval |
| `cpace` | **No** | Estimated — conditional on lender consent |
| `unverified_estimate` | **No** | Always blocked |

---

## Capital Gap Resolution

When verified funds < project cost:

1. Identify the gap amount: `projectCost − totalVerifiedFunds`
2. Review capital stack for any `committed: false` entries that can be upgraded
3. Do NOT add estimated incentive proceeds to close the gap
4. Obtain additional bank evidence, equity commitments, or LOC letters
5. Re-assess PoF packet after evidence upload

---

## Lender Authorization Requirements

Each lender authorization must include:
- Lender name and contact
- Authorized purpose (construction, acquisition, bridge, etc.)
- Project cost confirmation matching packet
- Expiry date (must be current)

---

## XRPL Blockchain Evidence

If blockchain funds are included:
- Record XRPL transaction hash (64-char hex)
- Record confirmed ledger sequence
- Record wallet address and balance at snapshot
- Include compliance note: "XRPL balance is subject to on-chain conditions and is not a bank guarantee"

---

## Submission Workflow

```
1. Complete RWA documentation (all 6 evidence types)
2. Build capital stack — separate committed vs estimated sources
3. Upload bank statements / blockchain evidence for all verified sources
4. Obtain lender authorization letter(s)
5. Run PoF readiness assessment → confirm status = lender_ready
6. Compile submission packet with cover note and verification annex
7. Submit to lender — include PoF cover note and attestation template
```

> See `docs/deal/clay-terrace/exhibits/` for Hilton PoF attestation template, cover note, and verification annex.
