import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessIncentiveEvidence } from "./engine.js";
import type { EvidenceDocument } from "../evidence/types.js";

function accepted(id: string, title: string, documentType: EvidenceDocument["documentType"]): EvidenceDocument {
  return {
    id,
    title,
    documentType,
    status: "accepted",
    uploadedAt: "2026-04-27",
    source: { sourceType: "upload", sourceLabel: "portal", receivedAt: "2026-04-27" },
  };
}

function acceptedOther(id: string, title: string): EvidenceDocument {
  return accepted(id, title, "other");
}

describe("incentive evidence engine", () => {
  it("1. Estimated incentives do not count as verified funds", () => {
    const result = assessIncentiveEvidence({
      projectId: "ct-incentive",
      incentiveId: "ga-utility",
      incentiveName: "Georgia Utility Rebate",
      estimatedValue: 250000,
      documents: [accepted("doc-estimate", "Tax Credit Estimate", "tax_credit_estimate")],
    });
    assert.equal(result.status, "estimated");
    assert.equal(result.countsAsVerifiedFunds, false);
  });

  it("2. Incentive evidence can become application_ready", () => {
    const result = assessIncentiveEvidence({
      projectId: "ct-incentive",
      incentiveId: "ga-utility",
      incentiveName: "Georgia Utility Rebate",
      estimatedValue: 250000,
      documents: [
        accepted("doc-estimate", "Tax Credit Estimate", "tax_credit_estimate"),
        accepted("doc-utility", "Utility Bill", "utility_bill"),
        accepted("doc-audit", "Energy Audit", "energy_audit"),
        accepted("doc-contractor", "Contractor Scope", "contractor_bid"),
        acceptedOther("doc-equipment", "Equipment Specification"),
        acceptedOther("doc-owner", "Owner Eligibility"),
      ],
    });
    assert.equal(result.status, "application_ready");
  });

  it("3. Incentive evidence can become awarded", () => {
    const result = assessIncentiveEvidence({
      projectId: "ct-incentive",
      incentiveId: "ga-utility",
      incentiveName: "Georgia Utility Rebate",
      estimatedValue: 250000,
      documents: [
        accepted("doc-estimate", "Tax Credit Estimate", "tax_credit_estimate"),
        accepted("doc-utility", "Utility Bill", "utility_bill"),
        accepted("doc-audit", "Energy Audit", "energy_audit"),
        accepted("doc-contractor", "Contractor Scope", "contractor_bid"),
        acceptedOther("doc-equipment", "Equipment Specification"),
        acceptedOther("doc-owner", "Owner Eligibility"),
        accepted("doc-application", "Grant Application", "grant_application"),
        accepted("doc-award", "Grant Award", "grant_award"),
      ],
    });
    assert.equal(result.status, "awarded");
  });

  it("4. Incentive evidence can become verified", () => {
    const result = assessIncentiveEvidence({
      projectId: "ct-incentive",
      incentiveId: "ga-utility",
      incentiveName: "Georgia Utility Rebate",
      estimatedValue: 250000,
      documents: [
        accepted("doc-estimate", "Tax Credit Estimate", "tax_credit_estimate"),
        accepted("doc-utility", "Utility Bill", "utility_bill"),
        accepted("doc-audit", "Energy Audit", "energy_audit"),
        accepted("doc-contractor", "Contractor Scope", "contractor_bid"),
        acceptedOther("doc-equipment", "Equipment Specification"),
        acceptedOther("doc-owner", "Owner Eligibility"),
        accepted("doc-application", "Grant Application", "grant_application"),
        accepted("doc-award", "Grant Award", "grant_award"),
        acceptedOther("doc-installation", "Proof of Installation"),
        accepted("doc-accounting", "Accounting Review", "accounting_review"),
      ],
    });
    assert.equal(result.status, "verified");
    assert.equal(result.countsAsVerifiedFunds, true);
  });

  it("5. Engine output is deterministic", () => {
    const input = {
      projectId: "ct-incentive",
      incentiveId: "ga-utility",
      incentiveName: "Georgia Utility Rebate",
      estimatedValue: 250000,
      documents: [accepted("doc-estimate", "Tax Credit Estimate", "tax_credit_estimate")],
    };
    assert.deepEqual(assessIncentiveEvidence(input), assessIncentiveEvidence(input));
  });
});