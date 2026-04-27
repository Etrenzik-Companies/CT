// ── Incentive Evidence Mapping — Engine ──────────────────────────────────
// Estimated incentives never count as verified funds.

import type { EvidenceDocument } from "../evidence/types.js";
import type { IncentiveEvidenceInput, IncentiveEvidenceRequirement, IncentiveEvidenceResult } from "./types.js";

export const INCENTIVE_EVIDENCE_REQUIREMENTS: IncentiveEvidenceRequirement[] = [
  { id: "tax-credit-estimate", label: "tax_credit_estimate", requiredFor: "application_ready" },
  { id: "application-package", label: "grant_application", requiredFor: "submitted" },
  { id: "utility-documentation", label: "utility_documentation", requiredFor: "application_ready" },
  { id: "energy-audit", label: "energy_audit", requiredFor: "application_ready" },
  { id: "contractor-scope", label: "contractor_scope", requiredFor: "application_ready" },
  { id: "equipment-specification", label: "equipment_specification", requiredFor: "application_ready" },
  { id: "proof-of-installation", label: "proof_of_installation", requiredFor: "verified" },
  { id: "owner-eligibility", label: "owner_eligibility_docs", requiredFor: "application_ready" },
  { id: "accounting-review", label: "accounting_review", requiredFor: "verified" },
];

function hasAccepted(documents: EvidenceDocument[], predicate: (document: EvidenceDocument) => boolean): boolean {
  return documents.some((document) => document.status === "accepted" && predicate(document));
}

function hasRejected(documents: EvidenceDocument[]): boolean {
  return documents.some((document) => document.status === "rejected");
}

function hasExpired(documents: EvidenceDocument[]): boolean {
  return documents.some((document) => document.status === "expired");
}

function isEquipmentSpec(document: EvidenceDocument): boolean {
  return document.documentType === "other" && document.title.toLowerCase().includes("equipment");
}

function isInstallationProof(document: EvidenceDocument): boolean {
  return document.documentType === "other" && document.title.toLowerCase().includes("installation");
}

function isOwnerEligibility(document: EvidenceDocument): boolean {
  return document.documentType === "other" && document.title.toLowerCase().includes("owner eligibility");
}

export function assessIncentiveEvidence(input: IncentiveEvidenceInput): IncentiveEvidenceResult {
  const docs = input.documents;

  const readyForApplication = {
    taxEstimate: hasAccepted(docs, (document) => document.documentType === "tax_credit_estimate"),
    utility: hasAccepted(docs, (document) => document.documentType === "utility_bill"),
    audit: hasAccepted(docs, (document) => document.documentType === "energy_audit"),
    contractor: hasAccepted(docs, (document) => document.documentType === "contractor_bid"),
    equipment: hasAccepted(docs, (document) => isEquipmentSpec(document)),
    owner: hasAccepted(docs, (document) => isOwnerEligibility(document)),
  };

  const applicationSubmitted = hasAccepted(
    docs,
    (document) => document.documentType === "grant_application" || document.documentType === "rebate_application",
  );
  const awardAccepted = hasAccepted(docs, (document) => document.documentType === "grant_award");
  const installationProof = hasAccepted(docs, (document) => isInstallationProof(document));
  const accountingReview = hasAccepted(docs, (document) => document.documentType === "accounting_review");

  const missingRequirements: string[] = [];
  if (!readyForApplication.taxEstimate) missingRequirements.push("tax_credit_estimate");
  if (!readyForApplication.utility) missingRequirements.push("utility_documentation");
  if (!readyForApplication.audit) missingRequirements.push("energy_audit");
  if (!readyForApplication.contractor) missingRequirements.push("contractor_scope");
  if (!readyForApplication.equipment) missingRequirements.push("equipment_specification");
  if (!readyForApplication.owner) missingRequirements.push("owner_eligibility_docs");
  if (!applicationSubmitted) missingRequirements.push("grant_application");
  if (!installationProof) missingRequirements.push("proof_of_installation");
  if (!accountingReview) missingRequirements.push("accounting_review");

  let status: IncentiveEvidenceResult["status"] = "estimated";
  if (hasRejected(docs)) {
    status = "rejected";
  } else if (hasExpired(docs)) {
    status = "expired";
  } else if (awardAccepted && installationProof && accountingReview) {
    status = "verified";
  } else if (awardAccepted) {
    status = "awarded";
  } else if (applicationSubmitted) {
    status = "submitted";
  } else if (readyForApplication.taxEstimate && readyForApplication.utility && readyForApplication.audit && readyForApplication.contractor && readyForApplication.equipment && readyForApplication.owner) {
    status = "application_ready";
  }

  const reviewRequiredDocumentIds = docs.filter((document) => document.status !== "accepted").map((document) => document.id).sort();

  return {
    projectId: input.projectId,
    incentiveId: input.incentiveId,
    incentiveName: input.incentiveName,
    status,
    requirements: INCENTIVE_EVIDENCE_REQUIREMENTS,
    missingRequirements,
    reviewRequiredDocumentIds,
    countsAsVerifiedFunds: status === "verified",
    reviewNotes: [
      "Estimated incentives must never count as verified funds.",
      "Application, award, and verification status require reviewed evidence.",
    ],
  };
}