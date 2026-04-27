import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessFundingRoutes } from "./engine.js";
import type { FundingRouteInput } from "./types.js";

function route(overrides: Partial<FundingRouteInput> = {}): FundingRouteInput {
  return {
    routeId: "senior_construction_loan",
    stage: "verified",
    amount: 10_000_000,
    hasAwardLetter: false,
    hasTaxAccountingMemo: true,
    hasLegalMemo: true,
    hasPublicBodyApproval: false,
    hasLocalAuthorization: false,
    hasLenderConsent: false,
    evidence: {
      appraisal: true,
      budget: true,
      permits: true,
      gc_package: true,
      equity_proof: true,
      bank_or_escrow_proof: true,
      operating_agreement: true,
      application: true,
      award_letter: true,
      program_terms: true,
      eligible_scope_docs: true,
      tax_memo: true,
      certification: true,
      public_body_approval: true,
      tif_analysis: true,
      bond_counsel_memo: true,
      local_authorization: true,
      lender_consent: true,
      legal_memo: true,
      human_approval_log: true,
      securities_counsel_memo: true,
      term_sheet: true,
      exit_strategy: true,
      collateral: true,
    },
    ...overrides,
  };
}

describe("funding routes matrix", () => {
  it("1. Senior debt requires appraisal, budget, permits, GC package, and equity proof", () => {
    const result = assessFundingRoutes([route({ evidence: { appraisal: true, budget: true, permits: false, gc_package: true, equity_proof: true } })]);
    assert.equal(result.assessments[0]?.status, "blocked");
  });

  it("2. Sponsor equity requires bank/escrow proof", () => {
    const result = assessFundingRoutes([route({ routeId: "sponsor_equity", evidence: { bank_or_escrow_proof: false, operating_agreement: true } })]);
    assert.equal(result.assessments[0]?.status, "blocked");
  });

  it("3. Grants do not count without award letter", () => {
    const result = assessFundingRoutes([route({ routeId: "grant", stage: "awarded", hasAwardLetter: false })]);
    assert.equal(result.assessments[0]?.countsAsVerifiedFunds, false);
    assert.equal(result.assessments[0]?.status, "blocked");
  });

  it("4. Estimated tax credit does not count as verified funds", () => {
    const result = assessFundingRoutes([route({ routeId: "state_tax_credit", stage: "estimated", amount: 500_000 })]);
    assert.equal(result.assessments[0]?.countsAsVerifiedFunds, false);
  });

  it("5. Hotel taxes are obligations only", () => {
    const result = assessFundingRoutes([route({ routeId: "hotel_local_taxes_obligation", stage: "obligation_only", amount: 125_000 })]);
    assert.equal(result.assessments[0]?.status, "obligation_only");
    assert.equal(result.assessments[0]?.countsAsVerifiedFunds, false);
  });

  it("6. RWA proof reference does not count as spendable funding", () => {
    const result = assessFundingRoutes([route({ routeId: "xrpl_proof_reference", stage: "verified", amount: 900_000 })]);
    assert.equal(result.assessments[0]?.countsAsVerifiedFunds, false);
  });

  it("7. Tokenized security route requires legal review", () => {
    const result = assessFundingRoutes([route({ routeId: "tokenized_security_review_only", hasLegalMemo: false, evidence: { securities_counsel_memo: true, legal_memo: false } })]);
    assert.equal(result.assessments[0]?.status, "blocked");
  });

  it("8. Output is deterministic", () => {
    const input = [route({ routeId: "cpace_monitor_only", hasLocalAuthorization: false, hasLenderConsent: false, evidence: { local_authorization: false, lender_consent: false } })];
    const one = assessFundingRoutes(input);
    const two = assessFundingRoutes(input);
    assert.deepEqual(one, two);
  });
});
