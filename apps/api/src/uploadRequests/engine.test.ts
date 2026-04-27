// -- Upload Requests -- Tests ------------------------------------------------
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildUploadRequest, buildUploadRequestsBatch } from "./engine.js";
import type { BuildUploadRequestInput } from "./engine.js";

describe("uploadRequests/engine", () => {
  it("upload requests prioritize missing blockers", () => {
    const result = buildUploadRequest({
      category: "funding",
      missingRequirementIds: ["bank_statement", "title_search"],
    });

    assert.strictEqual(result.request.priority, "critical");
    assert.strictEqual(result.missingBlockers.length, 2);
    assert.strictEqual(result.missingBlockers[0]?.requirementId, "title_search");
    assert.strictEqual(result.missingBlockers[1]?.requirementId, "bank_statement");
    assert.ok(result.nextBestActions[0]?.includes("blocker documents"));
  });

  it("no upload request asks for secrets", () => {
    const result = buildUploadRequest({
      category: "lender",
      missingRequirementIds: ["lender_term_sheet"],
    });

    const labels = result.request.requirements.map((requirement) => requirement.label.toLowerCase()).join(" ");
    assert.strictEqual(/private key|seed phrase|api token|password/.test(labels), false);
    assert.strictEqual(result.secretRequestViolations.length, 0);
  });

  it("links upload requests to evidenceMapping and packetStatus modules", () => {
    const result = buildUploadRequest({
      category: "contractor",
      missingRequirementIds: ["gc_insurance"],
    });

    assert.ok(result.request.linkedModules.includes("evidenceMapping"));
    assert.ok(result.request.linkedModules.includes("packetStatus"));
  });

  it("all outputs are deterministic", () => {
    const inputs: BuildUploadRequestInput[] = [
      { category: "contractor", missingRequirementIds: ["gc_insurance"] },
      { category: "rwa", missingRequirementIds: ["rwa_legal_review", "human_approval_log"] },
    ];

    const r1 = buildUploadRequestsBatch(inputs.map((item) => ({ ...item })));
    const r2 = buildUploadRequestsBatch(inputs.map((item) => ({ ...item })));
    assert.deepStrictEqual(r1, r2);
  });
});
