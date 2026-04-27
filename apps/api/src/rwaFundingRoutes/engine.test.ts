import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessRwaFundingRoutes } from "./engine.js";
import type { RwaRouteInput } from "./types.js";

function input(overrides: Partial<RwaRouteInput> = {}): RwaRouteInput {
  return {
    routeId: "asset_registry_only",
    legalReviewComplete: true,
    complianceReviewComplete: true,
    humanApprovalComplete: true,
    requestedLiveExecution: false,
    evidence: {
      asset_registry: true,
      title_docs: true,
      pof_packet: true,
      permit_status: true,
      bank_evidence: true,
      authorization_letter: true,
      deed: true,
      title_commitment: true,
      hash_record: true,
      source_document: true,
      wallet_ownership_proof: true,
      legal_review: true,
      legal_memo: true,
      compliance_memo: true,
      human_approval_log: true,
      risk_disclosure: true,
      capital_stack: true,
      offering_controls: true,
      tax_memo: true,
      securities_counsel_memo: true,
      investor_controls: true,
      kyc_aml_controls: true,
      off_chain_settlement_record: true,
    },
    ...overrides,
  };
}

describe("rwa funding routes", () => {
  it("1. RWA proof reference does not count as spendable funding", () => {
    const result = assessRwaFundingRoutes([input({ routeId: "proof_of_funds_reference" })]);
    assert.equal(result.assessments[0]?.countsAsSpendableFunding, false);
  });

  it("2. Tokenized security route requires legal review", () => {
    const result = assessRwaFundingRoutes([input({ routeId: "tokenized_security_legal_review", legalReviewComplete: false })]);
    assert.equal(result.assessments[0]?.status, "approval_required");
  });

  it("3. XRPL live transaction route is blocked", () => {
    const result = assessRwaFundingRoutes([input({ routeId: "blocked_live_transaction" })]);
    assert.equal(result.assessments[0]?.status, "blocked");
  });

  it("4. Requested live execution blocks route", () => {
    const result = assessRwaFundingRoutes([input({ routeId: "xrpl_wallet_reference", requestedLiveExecution: true })]);
    assert.equal(result.assessments[0]?.status, "blocked");
  });

  it("5. Output is deterministic", () => {
    const values = [input({ routeId: "private_credit_rwa_package", legalReviewComplete: false })];
    const one = assessRwaFundingRoutes(values);
    const two = assessRwaFundingRoutes(values);
    assert.deepEqual(one, two);
  });
});
