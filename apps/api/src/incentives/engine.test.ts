import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { matchIncentivePrograms } from "./engine.js";
import type { IncentiveMatchInput } from "./engine.js";

const georgiaConstructionInput: IncentiveMatchInput = {
  jurisdiction: { country: "US", state: "GA", county: "Cobb" },
  projectScope: ["hvac", "solar", "led_lighting", "new_construction"],
  assetTypes: ["construction_project", "real_estate"],
  estimatedProjectCost: 25_000_000,
  buildingType: "mixed_use",
  newConstruction: true,
  energyEfficiencyUpgrade: true,
  solarInstall: true,
};

describe("incentive engine", () => {
  it("1. Georgia construction project matches multiple programs", () => {
    const { matches } = matchIncentivePrograms(georgiaConstructionInput);
    assert.ok(matches.length > 0);
  });

  it("2. Every match review note warns estimated incentives are not verified funds", () => {
    const { matches } = matchIncentivePrograms(georgiaConstructionInput);
    for (const m of matches) {
      assert.ok(
        m.reviewNote.toLowerCase().includes("estimated") || m.reviewNote.toLowerCase().includes("verified")
      );
    }
  });

  it("3. Top-level review note warns about tax professional review", () => {
    const { reviewNote } = matchIncentivePrograms(georgiaConstructionInput);
    assert.ok(reviewNote.toLowerCase().includes("tax professional"));
  });

  it("4. 179D is matched for commercial energy efficiency project", () => {
    const { matches } = matchIncentivePrograms(georgiaConstructionInput);
    assert.ok(matches.some((m) => m.programId === "irs-179d"));
  });

  it("5. Georgia property tax exemption is matched when solar is in scope", () => {
    const { matches } = matchIncentivePrograms(georgiaConstructionInput);
    assert.ok(matches.some((m) => m.programId === "ga-property-tax-exemption"));
  });

  it("6. Out-of-state programs do not match Georgia projects", () => {
    const txInput: IncentiveMatchInput = {
      ...georgiaConstructionInput,
      jurisdiction: { country: "US", state: "TX" },
    };
    const { matches } = matchIncentivePrograms(txInput);
    // GA-specific programs should not appear
    assert.ok(!matches.some((m) => m.programId === "ga-property-tax-exemption"));
    assert.ok(!matches.some((m) => m.programId === "ga-state-energy-loan"));
  });

  it("7. All matches have required next steps including tax professional", () => {
    const { matches } = matchIncentivePrograms(georgiaConstructionInput);
    for (const m of matches) {
      assert.ok(m.requiredNextSteps.some((s) => s.toLowerCase().includes("tax professional")));
    }
  });

  it("8. Matches include estimated benefit with a note", () => {
    const { matches } = matchIncentivePrograms(georgiaConstructionInput);
    for (const m of matches) {
      assert.ok(m.estimatedBenefit.note.length > 0);
    }
  });
});
