# 26 — Real Evidence Intake Inbox

## Purpose

The Evidence Intake Inbox is the first gate in the real evidence pipeline for Clay Terrace lender readiness. It classifies incoming documents, detects prohibited content, and routes files to the evidence-mapping engine. Nothing is accepted automatically.

---

## Critical Rule: Uploaded ≠ Accepted

An uploaded file is in state `received`. It must pass through:

1. **Classification** — file type and security level assigned
2. **Keyword mapping** — preliminary targets identified
3. **Human review** — a designated reviewer must accept or reject
4. **Professional review** (where required) — attorney/CPA/lender sign-off

A file does not contribute to lender-ready status at any step before `accepted`.

---

## File Types Supported

| Code | Description |
|------|-------------|
| `pdf` | PDF documents |
| `image` | Photographs, scans, screenshots |
| `spreadsheet` | Excel, CSV, financial models |
| `word_document` | Word documents, letters |
| `email` | Email messages, thread exports |
| `text` | Plain text files, notes |
| `unknown` | Unrecognised type — flagged for review |

---

## Evidence Source Types

| Code | Description |
|------|-------------|
| `user_upload` | Uploaded by project team |
| `internal_file` | From internal project files |
| `lender_request` | Requested by lender |
| `contractor_submission` | Submitted by contractor/trade |
| `government_source` | Government agency document |
| `utility_source` | Utility company document |
| `tax_accounting_source` | CPA or tax authority document |
| `legal_source` | Attorney or legal document |
| `blockchain_reference` | XRPL/RWA proof reference |
| `other` | Other source |

---

## Review Status Flow

```
received → classified → mapped → needs_review → accepted | rejected | expired | blocked
```

| Status | Meaning |
|--------|---------|
| `received` | File logged, not yet processed |
| `classified` | File type and security level assigned |
| `mapped` | Preliminary requirement targets identified |
| `needs_review` | Routed to human reviewer |
| `accepted` | Accepted by authorised reviewer |
| `rejected` | Rejected by reviewer |
| `expired` | Time-limited document has lapsed |
| `blocked` | Secret detected — permanently blocked |

---

## Security Levels

| Level | Description |
|-------|-------------|
| `public` | Non-sensitive public documents |
| `internal` | Internal project documents |
| `confidential` | Business-sensitive documents |
| `financial` | Bank statements, escrow letters, equity proof |
| `legal` | Legal memos, opinions, contracts |
| `tax` | Tax returns, tax memos, 179D/48E analyses |
| `identity_sensitive` | W-9, government IDs |
| `secret_prohibited` | **Blocked on intake — must not be stored** |

---

## Prohibited Content — Automatic Block

The intake engine detects the following patterns and blocks the file immediately with `reviewStatus: "blocked"` and `securityLevel: "secret_prohibited"`. Blocked files have `suggestedMappingTargets: []`.

| Pattern | Examples |
|---------|---------|
| Private keys | `private_key`, `private key`, `-----BEGIN` |
| Seed phrases | `seed phrase`, `recovery phrase` |
| Mnemonic phrases | `mnemonic` |
| API tokens / keys | `api_token`, `api_key`, `apikey` |
| Secret keys | `secret_key`, `secretkey` |
| Passwords | `password`, `passwd` |
| Environment files | `.env` file content with key-value pairs |
| Keystore files | `keystore` |
| Wallet backup files | `wallet backup`, `wallet_backup` |

**Rule: Do not store raw secrets in any evidence file. If a submitted file contains prohibited content, it is blocked at intake and cannot proceed.**

---

## Auto-Mapping Targets

Evidence files are classified against these target domains based on keyword detection:

| Target | Description |
|--------|-------------|
| `contractorMatrix` | Contractor, trade, W-9, insurance, bid evidence |
| `fundingRoutes` | Appraisal, bank, equity, loan, mortgage evidence |
| `rwaFundingRoutes` | XRPL, RWA, tokenized asset, DeFi references |
| `lenderPacket` | Title, survey, term sheet, lender documents |
| `incentives` | Tax credits, rebates, grants, energy programs |
| `indianaPrograms` | Indiana IEDC, Carmel, Hamilton County programs |
| `pof` | Proof of funds letters |
| `esg` | ESG, carbon, sustainability documents |
| `permits` | Building permits, zoning, AHJ |
| `codeCompliance` | Building code, fire code, energy code |

---

## `autoAccepted` is Always `false`

The intake engine enforces a hard invariant:

```typescript
autoAccepted: false  // literal type — never changes
```

No document is ever automatically accepted. This applies regardless of source, keyword match, or security level.

---

## What Counts Toward Lender Readiness

Evidence contributes to lender-ready status only when:

- `reviewStatus === "accepted"`
- Professional review is complete (where required)
- No active blockers remain
- Lender-use authorization is on file

Estimated incentives, applied grants, XRPL proof references, and RWA route references are **classified and mapped** but **do not count as verified funding** at any review stage.

---

## Key References

- Engine: `apps/api/src/evidenceInbox/engine.ts`
- Types: `apps/api/src/evidenceInbox/types.ts`
- Tests: `apps/api/src/evidenceInbox/engine.test.ts` (10 tests)
- Dashboard: `/project-control/evidence-inbox`
