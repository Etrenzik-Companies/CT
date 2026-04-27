import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessRwaAsset } from "./engine.js";
import type { RwaAsset } from "./types.js";

const FULL_EVIDENCE = [
  { evidenceId: "e1", documentType: "title_report", description: "Title report" },
  { evidenceId: "e2", documentType: "deed_or_ownership_record", description: "Deed" },
  { evidenceId: "e3", documentType: "appraisal_report", description: "Appraisal" },
  { evidenceId: "e4", documentType: "insurance_certificate", description: "Insurance cert" },
  { evidenceId: "e5", documentType: "survey", description: "Survey" },
  { evidenceId: "e6", documentType: "environmental_phase_1", description: "Phase 1 ESA" },
];

const baseAsset: RwaAsset = {
  id: "asset-001",
  name: "Clay Terrace Construction Project",
  assetType: "construction_project",
  location: { city: "Smyrna", state: "GA", country: "US" },
  ownership: [{ ownerName: "Clay Terrace LLC", ownerType: "llc", ownershipPercent: 100 }],
  valuations: [],
  liens: [],
  insurance: [
    {
      carrier: "AIG",
      policyType: "builders_risk",
      coverageAmount: 25_000_000,
      expiryDate: "2027-12-31",
    },
  ],
  appraisals: [
    {
      appraiserName: "Southeast Appraisal Group",
      appraisalDate: "2026-01-15",
      appraisedValue: 22_000_000,
      reportType: "full",
    },
  ],
  evidence: FULL_EVIDENCE,
};

describe("rwa engine", () => {
  it("1. Asset with full evidence is lender_ready", () => {
    const result = assessRwaAsset(baseAsset);
    assert.equal(result.status, "lender_ready");
    assert.equal(result.evidenceCompleteness, 100);
    assert.equal(result.missingDocuments.length, 0);
  });

  it("2. Asset without any evidence cannot be lender_ready", () => {
    const asset: RwaAsset = { ...baseAsset, id: "asset-002", evidence: [] };
    const result = assessRwaAsset(asset);
    assert.notEqual(result.status, "lender_ready");
    assert.ok(result.blockedReasons.length > 0);
  });

  it("3. Asset missing title report is not lender_ready", () => {
    const asset: RwaAsset = {
      ...baseAsset,
      id: "asset-003",
      evidence: FULL_EVIDENCE.filter((e) => e.documentType !== "title_report"),
    };
    const result = assessRwaAsset(asset);
    assert.notEqual(result.status, "lender_ready");
    assert.ok(result.missingDocuments.includes("title_report"));
  });

  it("4. Ownership percentage must total 100%", () => {
    const asset: RwaAsset = {
      ...baseAsset,
      id: "asset-004",
      ownership: [{ ownerName: "Partial Owner", ownerType: "llc", ownershipPercent: 80 }],
    };
    const result = assessRwaAsset(asset);
    assert.ok(result.legalGaps.some((g) => g.includes("80%")));
  });

  it("5. Expired insurance is flagged", () => {
    const asset: RwaAsset = {
      ...baseAsset,
      id: "asset-005",
      insurance: [
        { carrier: "AIG", policyType: "builders_risk", coverageAmount: 1_000_000, expiryDate: "2020-01-01" },
      ],
    };
    const result = assessRwaAsset(asset);
    assert.ok(result.insuranceGaps.some((g) => g.includes("expired")));
  });

  it("6. Lien without evidence is flagged", () => {
    const asset: RwaAsset = {
      ...baseAsset,
      id: "asset-006",
      liens: [{ lienholder: "Bank A", amount: 10_000_000, position: 1 }],
    };
    const result = assessRwaAsset(asset);
    assert.ok(result.lienGaps.length > 0);
  });

  it("7. Result always includes review notes disclaimer", () => {
    const result = assessRwaAsset(baseAsset);
    assert.ok(result.reviewNotes.length > 0);
    assert.ok(result.reviewNotes.some((n) => n.toLowerCase().includes("legal")));
  });

  it("8. Evidence completeness is 0 when no evidence", () => {
    const asset: RwaAsset = { ...baseAsset, id: "asset-008", evidence: [] };
    const result = assessRwaAsset(asset);
    assert.equal(result.evidenceCompleteness, 0);
  });
});
