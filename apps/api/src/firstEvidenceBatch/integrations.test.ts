// -- First Evidence Batch -- Integration Tests -------------------------------
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { allFirstEvidenceBatchIntegrations, integrationForCategory } from "./integrations.js";

describe("firstEvidenceBatch/integrations", () => {
  it("integration mappings connect items to correct packet/funding targets", () => {
    const appraisal = integrationForCategory("appraisal");
    assert.strictEqual(appraisal.lenderPacketSection, "appraisal_title_insurance");
    assert.strictEqual(appraisal.fundingRoutesDependency, "senior_construction_loan");

    const title = integrationForCategory("title_search");
    assert.strictEqual(title.packetStatusSection, "legal_title");
    assert.strictEqual(title.lenderPacketSection, "appraisal_title_insurance");

    const gcInsurance = integrationForCategory("gc_insurance");
    assert.strictEqual(gcInsurance.contractorMatrixDependency, "general_contractor");
    assert.strictEqual(gcInsurance.lenderPacketSection, "contractor_bids");

    const bankStatement = integrationForCategory("bank_statement");
    assert.strictEqual(bankStatement.evidenceMappingTarget, "pof");
    assert.strictEqual(bankStatement.lenderPacketSection, "proof_of_funds");

    const lenderTerm = integrationForCategory("lender_term_sheet");
    assert.strictEqual(lenderTerm.evidenceMappingTarget, "fundingRoutes");
    assert.strictEqual(lenderTerm.lenderPacketSection, "capital_stack");
  });

  it("integration output is deterministic", () => {
    const r1 = allFirstEvidenceBatchIntegrations();
    const r2 = allFirstEvidenceBatchIntegrations();
    assert.deepStrictEqual(r1, r2);
  });
});
