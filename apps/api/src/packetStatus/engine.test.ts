// ── Packet Status — Tests ────────────────────────────────────────────────
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessAllPackets, assessPacketStatus } from "./engine.js";
import type { PacketEvidenceItem, PacketStatusInput } from "./types.js";

function accepted(requirementId: string, overrides: Partial<PacketEvidenceItem> = {}): PacketEvidenceItem {
  return { requirementId, present: true, accepted: true, professionalReviewComplete: true, blockers: [], ...overrides };
}

function uploaded(requirementId: string): PacketEvidenceItem {
  return { requirementId, present: true, accepted: false, professionalReviewComplete: false, blockers: [] };
}

describe("packetStatus/engine", () => {
  it("empty contractor packet is not_started", () => {
    const result = assessPacketStatus({
      category: "contractor",
      projectName: "Clay Terrace",
      items: [],
      lenderUseAuthorized: false,
    });
    assert.strictEqual(result.status, "not_started");
    assert.ok(result.lenderReadyBlocked);
  });

  it("uploaded-but-unreviewed evidence blocks lender-ready", () => {
    const result = assessPacketStatus({
      category: "contractor",
      projectName: "Clay Terrace",
      items: [
        uploaded("gc_insurance"),
        uploaded("gc_bid"),
        uploaded("gc_license"),
        uploaded("gc_scope_of_work"),
        uploaded("gc_w9"),
      ],
      lenderUseAuthorized: false,
    });
    assert.ok(result.lenderReadyBlocked, "should be blocked");
    assert.notStrictEqual(result.status, "lender_ready");
    assert.ok(result.lenderReadyBlockReasons.some((r) => r.includes("not accepted by reviewer")));
  });

  it("missing required evidence blocks lender-ready", () => {
    const result = assessPacketStatus({
      category: "funding",
      projectName: "Clay Terrace",
      items: [
        accepted("appraisal"),
        // title_search, survey, bank_statement, lender_term_sheet missing
      ],
      lenderUseAuthorized: true,
    });
    assert.ok(result.lenderReadyBlocked);
    assert.ok(result.missingRequirements.includes("title_search"));
    assert.ok(result.missingRequirements.includes("survey"));
  });

  it("active blocker on item sets status to blocked", () => {
    const result = assessPacketStatus({
      category: "rwa",
      projectName: "Clay Terrace",
      items: [
        accepted("rwa_legal_review", { blockers: ["Tokenized securities require legal review."] }),
        accepted("xrpl_proof_reference"),
        accepted("human_approval_log"),
      ],
      lenderUseAuthorized: true,
    });
    assert.strictEqual(result.status, "blocked");
    assert.ok(result.activeBlockers.length > 0);
  });

  it("missing lender-use authorization blocks lender-ready", () => {
    const result = assessPacketStatus({
      category: "pof",
      projectName: "Clay Terrace",
      items: [
        accepted("pof_document"),
        accepted("bank_statement"),
        accepted("escrow_letter"),
      ],
      lenderUseAuthorized: false,
    });
    assert.ok(result.lenderReadyBlocked);
    assert.ok(result.lenderReadyBlockReasons.some((r) => r.includes("authorization")));
  });

  it("professional review missing on legal_memo blocks lender-ready", () => {
    const result = assessPacketStatus({
      category: "lender",
      projectName: "Clay Terrace",
      items: [
        accepted("appraisal"),
        accepted("title_search"),
        accepted("survey"),
        accepted("permit_set"),
        accepted("gc_insurance"),
        accepted("gc_bid"),
        accepted("bank_statement"),
        accepted("escrow_letter"),
        accepted("lender_term_sheet"),
        // legal_memo accepted but professional review NOT done
        { requirementId: "legal_memo", present: true, accepted: true, professionalReviewComplete: false, blockers: [] },
        accepted("tax_memo"),
        accepted("human_approval_log"),
      ],
      lenderUseAuthorized: true,
    });
    assert.ok(result.lenderReadyBlocked);
    assert.ok(result.lenderReadyBlockReasons.some((r) => r.includes("legal_memo")));
  });

  it("fully accepted and reviewed packet with authorization achieves lender_ready", () => {
    const result = assessPacketStatus({
      category: "contractor",
      projectName: "Clay Terrace",
      items: [
        accepted("gc_insurance"),
        accepted("gc_bid"),
        accepted("gc_license"),
        accepted("gc_scope_of_work"),
        accepted("gc_w9"),
      ],
      lenderUseAuthorized: true,
    });
    assert.strictEqual(result.status, "lender_ready");
    assert.strictEqual(result.lenderReadyBlocked, false);
  });

  it("assessAllPackets is deterministic", () => {
    const inputs: Omit<PacketStatusInput, "projectName">[] = [
      { category: "contractor", items: [], lenderUseAuthorized: false },
      { category: "pof", items: [accepted("pof_document"), accepted("bank_statement"), accepted("escrow_letter")], lenderUseAuthorized: true },
    ];
    const r1 = assessAllPackets("Clay Terrace", inputs);
    const r2 = assessAllPackets("Clay Terrace", inputs);
    assert.deepStrictEqual(r1, r2);
  });

  it("estimated incentive without professional review blocks esg_incentive packet", () => {
    const result = assessPacketStatus({
      category: "esg_incentive",
      projectName: "Clay Terrace",
      items: [
        accepted("energy_model"),
        accepted("esg_certification"),
        // grant_award_letter present but professional review NOT done
        { requirementId: "grant_award_letter", present: true, accepted: true, professionalReviewComplete: false, blockers: [] },
      ],
      lenderUseAuthorized: true,
    });
    assert.ok(result.lenderReadyBlocked);
    assert.ok(result.lenderReadyBlockReasons.some((r) => r.includes("grant_award_letter")));
  });
});
