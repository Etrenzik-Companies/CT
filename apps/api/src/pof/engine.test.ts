import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessProofOfFunds } from "./engine.js";
import type { ProofOfFundsPacket } from "./types.js";

const basePacket: ProofOfFundsPacket = {
  id: "pof-001",
  projectName: "Clay Terrace Construction",
  projectCost: 25_000_000,
  currency: "USD",
  fundingSources: [
    {
      id: "src-1",
      sourceType: "bank_deposit",
      label: "Sponsor Equity — First Citizens Bank",
      amount: 25_000_000,
      currency: "USD",
      isVerified: true,
      isEstimated: false,
      bankEvidence: {
        bankName: "First Citizens Bank",
        accountType: "business_checking",
        statementDate: "2026-04-01",
        verifiedAmount: 25_000_000,
        currency: "USD",
        evidenceId: "ev-bank-001",
      },
      evidenceId: "ev-bank-001",
    },
  ],
  capitalStack: [
    {
      sourceId: "src-1",
      label: "Sponsor Equity",
      amount: 25_000_000,
      currency: "USD",
      position: "sponsor_equity",
      committed: true,
    },
  ],
  lenderAuthorizations: [
    {
      lenderName: "First Citizens Bank",
      authorizedAmount: 25_000_000,
      currency: "USD",
      authorizedPurpose: "Construction of Clay Terrace mixed-use development",
      evidenceId: "ev-auth-001",
    },
  ],
};

describe("pof engine", () => {
  it("1. Fully funded packet with verified evidence is lender_ready", () => {
    const result = assessProofOfFunds(basePacket);
    assert.equal(result.status, "lender_ready");
    assert.equal(result.gapAnalysis.capitalGap, 0);
  });

  it("2. PoF is blocked when capital gap > 0", () => {
    const packet: ProofOfFundsPacket = {
      ...basePacket,
      id: "pof-002",
      fundingSources: [
        {
          id: "src-2",
          sourceType: "bank_deposit",
          label: "Partial equity",
          amount: 10_000_000,
          currency: "USD",
          isVerified: true,
          isEstimated: false,
          evidenceId: "ev-002",
          bankEvidence: {
            bankName: "Wells Fargo",
            accountType: "business_checking",
            statementDate: "2026-04-01",
            verifiedAmount: 10_000_000,
            currency: "USD",
            evidenceId: "ev-002",
          },
        },
      ],
    };
    const result = assessProofOfFunds(packet);
    assert.notEqual(result.status, "lender_ready");
    assert.ok(result.gapAnalysis.capitalGap > 0);
    assert.ok(result.blockedReasons.some((r) => r.toLowerCase().includes("gap")));
  });

  it("3. Estimated incentives are NEVER counted as verified funds", () => {
    const packet: ProofOfFundsPacket = {
      ...basePacket,
      id: "pof-003",
      fundingSources: [
        {
          id: "src-3",
          sourceType: "tax_credit_proceeds",
          label: "Estimated 179D Tax Credit",
          amount: 25_000_000,
          currency: "USD",
          isVerified: false,
          isEstimated: true,
          evidenceId: "ev-003",
        },
      ],
    };
    const result = assessProofOfFunds(packet);
    // Estimated funds don't count as verified
    assert.equal(result.gapAnalysis.totalVerifiedFunds, 0);
    assert.ok(result.gapAnalysis.totalEstimatedFunds > 0);
    assert.ok(result.gapAnalysis.capitalGap > 0);
    assert.notEqual(result.status, "lender_ready");
  });

  it("4. Source marked verified without evidence doc is flagged", () => {
    const packet: ProofOfFundsPacket = {
      ...basePacket,
      id: "pof-004",
      fundingSources: [
        {
          id: "src-4",
          sourceType: "bank_deposit",
          label: "No evidence bank",
          amount: 25_000_000,
          currency: "USD",
          isVerified: true,
          isEstimated: false,
          // no evidenceId and no bankEvidence
        },
      ],
    };
    const result = assessProofOfFunds(packet);
    assert.ok(result.missingEvidence.length > 0);
  });

  it("5. Packet with no lender authorizations is evidence_missing or blocked", () => {
    const packet: ProofOfFundsPacket = { ...basePacket, id: "pof-005", lenderAuthorizations: [] };
    const result = assessProofOfFunds(packet);
    assert.notEqual(result.status, "lender_ready");
  });

  it("6. Packet with a mix of verified + estimated shows internally_ready if only gap is estimates", () => {
    const packet: ProofOfFundsPacket = {
      ...basePacket,
      id: "pof-006",
      fundingSources: [
        { ...basePacket.fundingSources[0]!, id: "src-6a", amount: 24_000_000 },
        {
          id: "src-6b",
          sourceType: "rebate",
          label: "Estimated Energy Rebate",
          amount: 1_000_000,
          currency: "USD",
          isVerified: false,
          isEstimated: true,
        },
      ],
    };
    const result = assessProofOfFunds(packet);
    // Verified = 24M, project cost = 25M → gap of 1M → gap_unresolved
    assert.ok(result.gapAnalysis.capitalGap > 0);
    assert.equal(result.gapAnalysis.totalEstimatedFunds, 1_000_000);
  });

  it("7. Review notes always include estimated-incentive warning", () => {
    const result = assessProofOfFunds(basePacket);
    assert.ok(result.reviewNotes.some((n) => n.toLowerCase().includes("estimated")));
  });
});
