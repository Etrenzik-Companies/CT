import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessIndianaProgramMatrix } from "./engine.js";
import type { ClayTerraceIndianaProfile } from "./types.js";

function buildProfile(overrides: Partial<ClayTerraceIndianaProfile> = {}): ClayTerraceIndianaProfile {
  return {
    projectName: "Tempo by Hilton - Clay Terrace",
    city: "Carmel",
    county: "Hamilton",
    state: "IN",
    keys: 153,
    totalBudget: 54_800_000,
    equityAmount: 3_440_000,
    debtAmount: 51_360_000,
    assetTypes: ["hotel", "commercial_real_estate", "construction_project"],
    projectAddressKnown: true,
    parcelKnown: false,
    zoningDistrictKnown: false,
    utilityTerritoryKnown: false,
    utilities: {
      dukeIndiana: false,
      aesIndiana: false,
    },
    energyScope: {
      hvac: true,
      envelope: true,
      lighting: true,
      solarReady: true,
      evCharging: true,
      waterEfficiency: true,
    },
    jobsWorkforce: {
      jobCreationSchedule: false,
      payrollEstimates: false,
      workforceTrainingPlan: false,
    },
    redevelopmentFacts: {
      cityCountySupportLetter: false,
      publicBodyApproval: false,
      bondTermSheet: false,
      tifResolution: false,
      taxAbatementRequest: false,
      localCpaceAuthorization: false,
      lenderConsentForCpace: false,
    },
    environmentalFacts: {
      phaseI: false,
      phaseII: false,
      brownfieldDetermination: false,
    },
    scopeFacts: {
      headquartersRelocation: false,
      dataCenterScope: false,
      manufacturingScope: false,
      qualifiedEngineeringWorkforce: false,
      entrepreneurialSupportTrack: false,
    },
    taxCreditFacts: {
      iedcApplicationSubmitted: false,
      energyModelComplete: false,
      section179dCertification: false,
      grossSquareFootageKnown: false,
      equipmentSpecsComplete: false,
      placedInServiceDateKnown: false,
      taxOwnershipDocumented: false,
      lowIncomeBonusEligibilityChecked: false,
      transferabilityReviewed: false,
      taxAccountingMemo: false,
      legalMemo: false,
    },
    complianceFacts: {
      permitApplicationsSubmitted: false,
      planReviewInProgress: false,
      zoningReviewed: false,
      fireCodeReviewed: false,
      energyCodeReviewed: false,
      accessibilityReviewed: false,
      stormwaterReviewed: false,
      signPermitReviewed: false,
      healthDepartmentReviewed: false,
      elevatorReviewCompleted: false,
      humanApprovalLog: false,
    },
    fundingEvidence: [
      { programId: "in-hbitc", treatment: "estimated", amount: 500_000 },
      { programId: "in-sef", treatment: "awarded", amount: 100_000 },
      { programId: "irs-179d", treatment: "verified", amount: 200_000 },
      { programId: "indiana-cpace-monitor", treatment: "not_counted", amount: 250_000 },
    ],
    ...overrides,
  };
}

describe("indiana program matrix", () => {
  it("1. Hamilton County innkeeper tax is an operating tax obligation, not funding", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    const innkeeper = result.taxRequirements.find((item) => item.id === "hamilton-innkeepers-tax");
    assert.ok(innkeeper);
    assert.equal(innkeeper?.obligationOnly, true);
    assert.ok(innkeeper?.notes.some((note) => note.toLowerCase().includes("not a funding source")));
  });

  it("2. 179D is needs_review without energy model/certification", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    const program = result.matches.find((item) => item.programId === "irs-179d");
    assert.equal(program?.status, "needs_review");
  });

  it("3. 48E is needs_review without equipment/placed-in-service/tax ownership facts", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    const program = result.matches.find((item) => item.programId === "irs-48e");
    assert.equal(program?.status, "needs_review");
  });

  it("4. HBI/EDGE/SEF are needs_review without jobs/payroll/IEDC evidence", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    assert.equal(result.matches.find((item) => item.programId === "in-hbitc")?.status, "needs_review");
    assert.equal(result.matches.find((item) => item.programId === "in-edge")?.status, "needs_review");
    assert.equal(result.matches.find((item) => item.programId === "in-sef")?.status, "needs_review");
  });

  it("5. Brownfield programs are monitor_only without environmental evidence", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    assert.equal(result.matches.find((item) => item.programId === "in-brownfield-ifa-rlf")?.status, "monitor_only");
    assert.equal(result.matches.find((item) => item.programId === "in-state-revolving-fund-cleanup")?.status, "monitor_only");
  });

  it("6. C-PACE is monitor_only without local authorization and lender consent", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    assert.equal(result.matches.find((item) => item.programId === "indiana-cpace-monitor")?.status, "monitor_only");
  });

  it("7. Bonds/TIF are needs_review without public-body approval evidence", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    assert.equal(result.matches.find((item) => item.programId === "tax-increment-financing")?.status, "needs_review");
    assert.equal(result.matches.find((item) => item.programId === "economic-development-revenue-bonds")?.status, "needs_review");
  });

  it("8. Estimated incentives do not count as verified funds", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    assert.equal(result.summary.estimatedFundingAmount, 500_000);
    assert.equal(result.summary.verifiedFundingAmount, 200_000);
    assert.notEqual(result.summary.estimatedFundingAmount, result.summary.verifiedFundingAmount);
  });

  it("9. Hotel tax obligations do not increase funding readiness", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    assert.ok(result.taxRequirements.length > 0);
    assert.equal(result.readiness.lenderReady, false);
  });

  it("10. Code compliance gaps block lender-ready status", () => {
    const result = assessIndianaProgramMatrix(buildProfile());
    assert.equal(result.readiness.lenderReady, false);
    assert.ok(result.readiness.blockedReasons.length > 0);
  });

  it("11. Engine output is deterministic", () => {
    const profile = buildProfile();
    const one = assessIndianaProgramMatrix(profile);
    const two = assessIndianaProgramMatrix(profile);
    assert.deepEqual(one, two);
  });
});
