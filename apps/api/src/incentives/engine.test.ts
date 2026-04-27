import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { matchIncentivePrograms } from "./engine.js";
import type { IncentiveMatchInput } from "./engine.js";

const indianaHotelInput: IncentiveMatchInput = {
  jurisdiction: { country: "US", state: "IN", county: "Hamilton", city: "Carmel" },
  projectScope: ["hvac", "solar", "led_lighting", "new_construction"],
  assetTypes: ["construction_project", "real_estate"],
  estimatedProjectCost: 54_800_000,
  buildingType: "hospitality",
  newConstruction: true,
  energyEfficiencyUpgrade: true,
  solarInstall: true,
};

describe("incentive engine", () => {
  it("1. Indiana hotel project matches multiple programs", () => {
    const { matches } = matchIncentivePrograms(indianaHotelInput);
    assert.ok(matches.length > 0);
  });

  it("2. Every match review note warns estimated incentives are not verified funds", () => {
    const { matches } = matchIncentivePrograms(indianaHotelInput);
    for (const m of matches) {
      assert.ok(
        m.reviewNote.toLowerCase().includes("estimated") || m.reviewNote.toLowerCase().includes("verified")
      );
    }
  });

  it("3. Top-level review note warns about tax professional review", () => {
    const { reviewNote } = matchIncentivePrograms(indianaHotelInput);
    assert.ok(reviewNote.toLowerCase().includes("tax professional"));
  });

  it("4. 179D is matched for commercial hotel energy scope", () => {
    const { matches } = matchIncentivePrograms(indianaHotelInput);
    assert.ok(matches.some((m) => m.programId === "irs-179d"));
  });

  it("5. Indiana programs are surfaced for a Carmel hotel deal", () => {
    const { matches } = matchIncentivePrograms(indianaHotelInput);
    assert.ok(matches.some((m) => m.programId === "in-hbitc"));
    assert.ok(matches.some((m) => m.programId === "in-local-tif-abatement"));
    assert.ok(matches.some((m) => m.programId === "in-cpace-monitor"));
  });

  it("6. Indiana-specific programs do not match out-of-state projects", () => {
    const txInput: IncentiveMatchInput = {
      ...indianaHotelInput,
      jurisdiction: { country: "US", state: "TX" },
    };
    const { matches } = matchIncentivePrograms(txInput);
    assert.ok(!matches.some((m) => m.programId === "in-hbitc"));
    assert.ok(!matches.some((m) => m.programId === "in-local-tif-abatement"));
    assert.ok(!matches.some((m) => m.programId === "utility-duke-indiana"));
  });

  it("7. Tax programs ask for tax review while utility programs ask for program confirmation", () => {
    const { matches } = matchIncentivePrograms(indianaHotelInput);
    const taxProgram = matches.find((m) => m.programId === "irs-179d");
    const utilityProgram = matches.find((m) => m.programId === "utility-duke-indiana");

    assert.ok(taxProgram?.requiredNextSteps.some((s) => s.toLowerCase().includes("tax professional")));
    assert.ok(utilityProgram?.requiredNextSteps.some((s) => s.toLowerCase().includes("program administrator")));
  });

  it("8. Matches include estimated benefit with a note", () => {
    const { matches } = matchIncentivePrograms(indianaHotelInput);
    for (const m of matches) {
      assert.ok(m.estimatedBenefit.note.length > 0);
    }
  });
});
