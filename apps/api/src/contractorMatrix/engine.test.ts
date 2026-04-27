import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessContractorMatrix } from "./engine.js";
import type { ContractorProfile } from "./types.js";

function contractor(overrides: Partial<ContractorProfile> = {}): ContractorProfile {
  return {
    id: "c-1",
    legalCompanyName: "Prime Build GC LLC",
    tradeCategory: "general_contractor",
    contactName: "Alex Prime",
    contactEmail: "alex@primebuild.example",
    businessAddress: "100 Main St, Carmel, IN",
    w9Provided: true,
    licenseStatus: "verified",
    insuranceStatus: "verified",
    bondingStatus: "adequate",
    bidStatus: "approved",
    scopeOfWorkProvided: true,
    inclusionsExclusionsDefined: true,
    scheduleProvided: true,
    paymentTermsProvided: true,
    warrantyProvided: true,
    safetyPlanProvided: true,
    lienWaiverStatus: "defined",
    permitResponsibilityDefined: true,
    equipmentSpecsProvided: true,
    drawingsProvided: true,
    prevailingWageReviewed: true,
    apprenticeshipStatusReviewed: true,
    referencesProvided: true,
    ...overrides,
  };
}

describe("contractor matrix", () => {
  it("1. GC missing insurance blocks readiness", () => {
    const result = assessContractorMatrix("Clay Terrace", [contractor({ insuranceStatus: "missing" })]);
    assert.equal(result.status, "blocked");
    assert.equal(result.items[0]?.fundingImpact.blocksLenderReadiness, true);
  });

  it("2. Major trade missing bid blocks lender readiness", () => {
    const result = assessContractorMatrix("Clay Terrace", [contractor({ tradeCategory: "mechanical_hvac", bidStatus: "requested" })]);
    assert.equal(result.items[0]?.status, "blocked");
  });

  it("3. Energy trade missing equipment specs blocks ESG/incentive readiness", () => {
    const result = assessContractorMatrix("Clay Terrace", [contractor({ tradeCategory: "solar", equipmentSpecsProvided: false })]);
    assert.equal(result.items[0]?.fundingImpact.blocksIncentiveReadiness, true);
  });

  it("4. Permit trade missing drawings blocks code readiness", () => {
    const result = assessContractorMatrix("Clay Terrace", [contractor({ tradeCategory: "architect", drawingsProvided: false })]);
    assert.equal(result.items[0]?.fundingImpact.blocksCodeReadiness, true);
    assert.equal(result.items[0]?.status, "blocked");
  });

  it("5. Output is deterministic", () => {
    const input = [contractor({ tradeCategory: "electrical", equipmentSpecsProvided: false })];
    const one = assessContractorMatrix("Clay Terrace", input);
    const two = assessContractorMatrix("Clay Terrace", input);
    assert.deepEqual(one, two);
  });
});
