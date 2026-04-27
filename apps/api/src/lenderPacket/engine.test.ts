import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessEvidenceDocuments } from "../evidence/engine.js";
import { buildLenderPacket } from "./engine.js";
import type { EvidenceDocument, EvidenceReviewInput } from "../evidence/types.js";
import type { LenderPacketInput } from "./types.js";

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

function packetInput(documents: EvidenceDocument[], overrides: Partial<LenderPacketInput> = {}): LenderPacketInput {
  const evidenceReview = assessEvidenceDocuments({ projectId: "ct-lender", documents } satisfies EvidenceReviewInput);
  return {
    projectId: "ct-lender",
    projectName: "Clay Terrace",
    evidenceReview,
    pofCapitalGap: 0,
    lenderUseAuthorizations: [{ lenderName: "Regional Bank", authorizedAmount: 25000000, currency: "USD", isApproved: true }],
    incentiveStatuses: [{ incentiveId: "ga-utility", status: "verified", countsAsVerifiedFunds: true }],
    ...overrides,
  };
}

const fullDocs: EvidenceDocument[] = [
  accepted("doc-operating", "Operating Agreement", "operating_agreement"),
  accepted("doc-purchase", "Purchase Agreement", "purchase_agreement"),
  accepted("doc-appraisal", "Appraisal", "appraisal"),
  accepted("doc-title", "Title Report", "title_report"),
  accepted("doc-insurance", "Insurance Certificate", "insurance_certificate"),
  accepted("doc-bank", "Bank Statement", "bank_statement"),
  accepted("doc-escrow", "Escrow Letter", "escrow_letter"),
  accepted("doc-term", "Lender Term Sheet", "lender_term_sheet"),
  accepted("doc-accounting", "Accounting Review", "accounting_review"),
  accepted("doc-budget", "Construction Budget", "construction_budget"),
  accepted("doc-bid", "Contractor Bid", "contractor_bid"),
  accepted("doc-tax", "Tax Credit Estimate", "tax_credit_estimate"),
  accepted("doc-grant-app", "Grant Application", "grant_application"),
  accepted("doc-grant-award", "Grant Award", "grant_award"),
  accepted("doc-energy", "Energy Audit", "energy_audit"),
  accepted("doc-esg", "ESG Report", "esg_report"),
  accepted("doc-utility", "Utility Bill", "utility_bill"),
  accepted("doc-permit", "Permit", "permit"),
  accepted("doc-legal", "Legal Opinion", "legal_opinion"),
];

describe("lender packet engine", () => {
  it("1. Missing evidence blocks lender packet readiness", () => {
    const result = buildLenderPacket(packetInput(fullDocs.filter((document) => document.documentType !== "permit")));
    assert.equal(result.readiness.status, "blocked");
    assert.ok(result.readiness.missingRequiredDocs.some((label) => label.toLowerCase().includes("permits")));
  });

  it("2. Lender packet blocks when PoF gap is unresolved", () => {
    const result = buildLenderPacket(packetInput(fullDocs, { pofCapitalGap: 500000 }));
    assert.ok(result.readiness.blockedReasons.some((reason) => reason.includes("pof gap")));
  });

  it("3. Lender packet blocks when lender-use authorization is missing", () => {
    const result = buildLenderPacket(packetInput(fullDocs, { lenderUseAuthorizations: [] }));
    assert.ok(result.readiness.blockedReasons.some((reason) => reason.includes("missing lender authorization")));
  });

  it("4. Blockchain evidence requires off-chain review", () => {
    const result = buildLenderPacket(
      packetInput([
        ...fullDocs.filter((document) => document.documentType !== "accounting_review"),
        accepted("doc-chain", "Blockchain Proof Reference", "blockchain_proof_reference"),
      ]),
    );
    assert.ok(result.readiness.blockedReasons.some((reason) => reason.includes("blockchain off chain review")));
  });

  it("5. Estimated incentives do not count as verified funds", () => {
    const result = buildLenderPacket(packetInput(fullDocs, {
      incentiveStatuses: [{ incentiveId: "ga-utility", status: "estimated", countsAsVerifiedFunds: false }],
    }));
    assert.ok(result.readiness.blockedReasons.some((reason) => reason.includes("estimated incentives")));
  });

  it("6. Engine output is deterministic", () => {
    const first = buildLenderPacket(packetInput(fullDocs));
    const second = buildLenderPacket(packetInput(fullDocs));
    assert.deepEqual(first, second);
  });
});