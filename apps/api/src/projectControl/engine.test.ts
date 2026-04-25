import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  answerCodeQuestion,
  calculateEstimateVariance,
  canAgentUseTool,
  canApprovePermit,
  canAwardBidPackage,
  canConfirmIncentiveFunding,
  canEngageVendor,
  createProjectFromTemplate,
  hasCodeFactMetadata,
  isClayTerraceProjectInstanceValid,
  isMcpActionAuthorized,
  ragAnswerHasCitations,
  requiresHumanReviewForHighRisk,
  requiresTaxProfessionalReview,
  validateContractorProfile
} from "./engine.js";

describe("project-control guardrails", () => {
  it("1. Contractor profile requires trade category", () => {
    const result = validateContractorProfile({
      id: "c1",
      companyName: "Vendor A",
      tradeCategories: [],
      quoteStatus: "requested",
      engagementStatus: "identified",
      signedEngagementEvidenceId: ""
    });
    assert.equal(result.ok, false);
  });

  it("2. Vendor cannot be engaged without signed engagement evidence", () => {
    const result = canEngageVendor({
      id: "c2",
      companyName: "Vendor B",
      tradeCategories: ["electrical"],
      quoteStatus: "approved",
      engagementStatus: "approved",
      signedEngagementEvidenceId: ""
    });
    assert.equal(result.ok, false);
  });

  it("3. Estimate variance calculation works", () => {
    assert.equal(calculateEstimateVariance({
      id: "e1",
      tradeCategory: "electrical",
      originalBudget: 100000,
      currentEstimate: 125000
    }), 25000);
  });

  it("4. Bid package cannot be awarded without approved bid", () => {
    const result = canAwardBidPackage({
      id: "b1",
      status: "recommendation",
      approvedBidId: ""
    });
    assert.equal(result.ok, false);
  });

  it("5. Code answer requires citation or unknown status", () => {
    const result = answerCodeQuestion("What code applies?", []);
    assert.equal(result.status, "unknown");
  });

  it("6. Code fact includes jurisdiction/version/effective date", () => {
    assert.equal(hasCodeFactMetadata({
      codeName: "Indiana Building Code",
      jurisdiction: "Indiana",
      version: "2014",
      effectiveDate: "2014-12-01",
      sourceUrl: "https://www.carmel.in.gov/283/Codes-Ordinances"
    }), true);
  });

  it("7. Permit cannot be marked approved without evidence", () => {
    const result = canApprovePermit({
      id: "p1",
      status: "approved",
      evidenceArtifactId: ""
    });
    assert.equal(result.ok, false);
  });

  it("8. Incentive cannot be confirmed without approval evidence", () => {
    const result = canConfirmIncentiveFunding({
      id: "i1",
      type: "rebate",
      status: "approved",
      approvalEvidenceId: "",
      requiresCpaReview: false
    });
    assert.equal(result.ok, false);
  });

  it("9. Tax incentive requires CPA review flag", () => {
    assert.equal(requiresTaxProfessionalReview({
      id: "i2",
      type: "tax",
      status: "identified",
      approvalEvidenceId: "",
      requiresCpaReview: true
    }), true);
  });

  it("10. RAG answer includes citations", () => {
    assert.equal(ragAnswerHasCitations({
      answer: "Sample",
      citations: [{ sourceDocumentId: "doc1", chunkId: "c1" }]
    }), true);
  });

  it("11. MCP tool registry blocks unauthorized side effects", () => {
    assert.equal(isMcpActionAuthorized(
      { role: "viewer", toolName: "contractor.write", sideEffectLevel: "write" },
      { viewer: ["contractor.read"] }
    ), false);
  });

  it("12. Agent cannot use forbidden tool", () => {
    assert.equal(canAgentUseTool({
      agentName: "Funding Agent",
      allowedTools: ["funding.read", "funding.score"],
      forbiddenTools: ["permit.submit"]
    }, "permit.submit"), false);
  });

  it("13. Project template can create a new project instance", () => {
    const project = createProjectFromTemplate(
      { id: "tpl-hotel", type: "hotel_development" },
      {
        id: "proj-2",
        name: "New Hotel Project",
        location: "Carmel, IN",
        jurisdiction: "Indiana",
        isPrimaryClayTerrace: false
      }
    );
    assert.equal(project.templateId, "tpl-hotel");
  });

  it("14. Clay Terrace remains one project instance", () => {
    const valid = isClayTerraceProjectInstanceValid([
      {
        id: "ct-1",
        name: "Clay Terrace / Tempo by Hilton",
        templateId: "tpl-hotel",
        location: "Carmel, IN",
        jurisdiction: "Indiana",
        isPrimaryClayTerrace: true
      },
      {
        id: "p2",
        name: "Another Project",
        templateId: "tpl-mixed",
        location: "Indianapolis, IN",
        jurisdiction: "Indiana",
        isPrimaryClayTerrace: false
      }
    ]);
    assert.equal(valid, true);
  });

  it("15. High-risk AI output requires human review", () => {
    assert.equal(requiresHumanReviewForHighRisk("high"), true);
  });
});
