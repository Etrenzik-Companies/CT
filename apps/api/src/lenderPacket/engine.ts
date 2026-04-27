// ── Lender Packet Builder — Engine ───────────────────────────────────────
// Blockchain references remain proof references only unless separately reviewed and approved.

import type { EvidenceClassification, EvidenceDocumentType } from "../evidence/types.js";
import type { LenderPacket, LenderPacketGap, LenderPacketInput, LenderPacketRequirement, LenderPacketSection } from "./types.js";

const REQUIREMENTS: LenderPacketRequirement[] = [
  { id: "sponsor-profile", section: "sponsor_profile", label: "Sponsor profile", requiredDocumentTypes: ["operating_agreement"], required: true },
  { id: "project-overview", section: "project_overview", label: "Project overview", requiredDocumentTypes: ["purchase_agreement"], required: true },
  { id: "rwa-summary", section: "rwa_asset_summary", label: "RWA asset summary", requiredDocumentTypes: ["appraisal", "title_report", "insurance_certificate"], required: true },
  { id: "capital-stack", section: "capital_stack", label: "Capital stack", requiredDocumentTypes: ["bank_statement", "escrow_letter", "lender_term_sheet"], required: true },
  { id: "proof-of-funds", section: "proof_of_funds", label: "Proof of funds", requiredDocumentTypes: ["bank_statement", "accounting_review"], required: true },
  { id: "construction-budget", section: "construction_budget", label: "Construction budget", requiredDocumentTypes: ["construction_budget"], required: true },
  { id: "contractor-bids", section: "contractor_bids", label: "Contractor bids", requiredDocumentTypes: ["contractor_bid"], required: true },
  { id: "tax-incentives", section: "tax_incentives", label: "Tax incentives", requiredDocumentTypes: ["tax_credit_estimate", "grant_application", "grant_award"], required: true },
  { id: "esg-green-financing", section: "esg_green_financing", label: "ESG and green financing", requiredDocumentTypes: ["energy_audit", "esg_report", "utility_bill"], required: true },
  { id: "permits-compliance", section: "permits_compliance", label: "Permits and compliance", requiredDocumentTypes: ["permit", "legal_opinion"], required: true },
  { id: "xrpl-references", section: "xrpl_proof_references", label: "XRPL proof references", requiredDocumentTypes: ["xrpl_wallet_reference", "blockchain_proof_reference", "accounting_review"], required: false },
  { id: "human-approval", section: "human_approval_log", label: "Human approval log", requiredDocumentTypes: ["legal_opinion", "accounting_review"], required: true },
];

const SECTION_TITLES: Record<LenderPacketSection["key"], string> = {
  executive_summary: "Executive Summary",
  sponsor_profile: "Sponsor Profile",
  project_overview: "Project Overview",
  rwa_asset_summary: "RWA Asset Summary",
  capital_stack: "Capital Stack",
  proof_of_funds: "Proof of Funds",
  construction_budget: "Construction Budget",
  contractor_bids: "Contractor Bids",
  appraisal_title_insurance: "Appraisal, Title, and Insurance",
  tax_incentives: "Tax Incentives",
  esg_green_financing: "ESG and Green Financing",
  permits_compliance: "Permits and Compliance",
  xrpl_proof_references: "XRPL Proof References",
  risk_register: "Risk Register",
  human_approval_log: "Human Approval Log",
};

function acceptedDocsByType(classifications: EvidenceClassification[], type: EvidenceDocumentType): string[] {
  return classifications.filter((item) => item.documentType === type && item.isAccepted).map((item) => item.documentId);
}

function hasAcceptedType(classifications: EvidenceClassification[], type: EvidenceDocumentType): boolean {
  return acceptedDocsByType(classifications, type).length > 0;
}

function hasReviewPending(classifications: EvidenceClassification[], type: EvidenceDocumentType): boolean {
  return classifications.some((item) => item.documentType === type && !item.isAccepted);
}

function buildSections(classifications: EvidenceClassification[]): LenderPacketSection[] {
  const keys = Object.keys(SECTION_TITLES) as LenderPacketSection["key"][];
  return keys.map((key) => {
    const requirement = REQUIREMENTS.find((item) => item.section === key);
    const requiredTypes = requirement?.requiredDocumentTypes ?? [];
    const documentIds = requiredTypes.flatMap((type) => acceptedDocsByType(classifications, type));
    const missing = requiredTypes.length > 0 && requiredTypes.some((type) => !hasAcceptedType(classifications, type));
    const pendingReview = requiredTypes.some((type) => hasReviewPending(classifications, type));

    return {
      key,
      title: SECTION_TITLES[key],
      status: missing ? "missing" : pendingReview ? "needs_review" : "complete",
      documentIds,
    };
  });
}

export function buildLenderPacket(input: LenderPacketInput): LenderPacket {
  const classifications = input.evidenceReview.classifications;
  const sections = buildSections(classifications);
  const gaps: LenderPacketGap[] = [];
  const packetMissingRequirements = REQUIREMENTS.filter(
    (requirement) =>
      requirement.required && requirement.requiredDocumentTypes.some((type) => !hasAcceptedType(classifications, type)),
  );

  if (input.pofCapitalGap > 0) {
    gaps.push({ requirementId: "proof-of-funds", reason: "pof_gap_unresolved" });
  }

  if (!input.lenderUseAuthorizations.some((item) => item.isApproved)) {
    gaps.push({ requirementId: "capital-stack", reason: "missing_lender_authorization" });
  }

  const missingEvidenceGaps = input.evidenceReview.gaps.filter((gap) => gap.reason === "missing" || gap.reason === "expired");
  gaps.push(...missingEvidenceGaps.map((gap) => ({ requirementId: gap.requirementId, reason: "missing_evidence" as const })));
  gaps.push(...packetMissingRequirements.map((requirement) => ({ requirementId: requirement.id, reason: "missing_evidence" as const })));

  const reviewRequiredDocs = classifications.filter((item) => !item.isAccepted);
  if (reviewRequiredDocs.length > 0) {
    gaps.push({ requirementId: "human-approval", reason: "review_required" });
  }

  const hasBlockchainReference = classifications.some(
    (item) => item.documentType === "blockchain_proof_reference" || item.documentType === "xrpl_wallet_reference",
  );
  const hasAcceptedAccountingReview = hasAcceptedType(classifications, "accounting_review");
  if (hasBlockchainReference && !hasAcceptedAccountingReview) {
    gaps.push({ requirementId: "xrpl-references", reason: "blockchain_off_chain_review" });
  }

  const legalPending = classifications.some((item) => !item.isAccepted && item.reviewRequired.includes("legal"));
  const accountingPending = classifications.some((item) => !item.isAccepted && item.reviewRequired.includes("accounting"));
  if (legalPending || accountingPending) {
    gaps.push({ requirementId: "human-approval", reason: "legal_accounting_review_incomplete" });
  }

  if (input.incentiveStatuses.some((item) => item.status !== "verified" && item.status !== "rejected" && item.status !== "expired")) {
    gaps.push({ requirementId: "tax-incentives", reason: "estimated_incentives" });
  }

  const uniqueGaps = gaps.filter((gap, index) => index === gaps.findIndex((candidate) => candidate.requirementId === gap.requirementId && candidate.reason === gap.reason));

  const missingRequiredDocs = [
    ...missingEvidenceGaps.map((gap) => gap.label),
    ...packetMissingRequirements.map((requirement) => requirement.label),
  ].sort();
  const reviewRequiredDocumentIds = reviewRequiredDocs.map((item) => item.documentId).sort();
  const blockedReasons = uniqueGaps.map((gap) => gap.reason.replaceAll("_", " "));

  const completeSections = sections.filter((section) => section.status === "complete").length;
  const score = Math.round((completeSections / sections.length) * 100);

  const status = blockedReasons.length > 0 ? "blocked" : score >= 85 ? "lender_ready" : score >= 60 ? "internally_ready" : "not_lender_ready";

  return {
    projectId: input.projectId,
    projectName: input.projectName,
    requirements: REQUIREMENTS,
    sections,
    gaps: uniqueGaps,
    readiness: {
      score,
      status,
      missingRequiredDocs,
      reviewRequiredDocs: reviewRequiredDocumentIds,
      blockedReasons,
    },
    exportSummary: {
      totalSections: sections.length,
      completeSections,
      blockedSections: sections.filter((section) => section.status === "blocked" || section.status === "missing").length,
    },
  };
}