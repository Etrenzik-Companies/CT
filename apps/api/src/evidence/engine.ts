// ── Evidence Intake Registry — Engine ────────────────────────────────────
// Uploaded evidence is not accepted automatically.
// Human, legal, accounting, lender, and off-chain review remain required.

import type {
  EvidenceArea,
  EvidenceClassification,
  EvidenceDocument,
  EvidenceDocumentType,
  EvidenceGap,
  EvidenceLink,
  EvidenceRequirement,
  EvidenceReviewInput,
  EvidenceReviewResult,
  EvidenceReviewRole,
} from "./types.js";

export const BUILTIN_EVIDENCE_REQUIREMENTS: EvidenceRequirement[] = [
  {
    id: "rwa-core-docs",
    area: "rwa",
    label: "RWA ownership and asset evidence",
    requiredDocumentTypes: ["appraisal", "title_report", "insurance_certificate", "purchase_agreement"],
    reviewRoles: ["human", "legal"],
    required: true,
  },
  {
    id: "pof-core-docs",
    area: "pof",
    label: "Proof of funds evidence",
    requiredDocumentTypes: ["bank_statement", "escrow_letter", "accounting_review"],
    reviewRoles: ["human", "accounting", "lender"],
    required: true,
  },
  {
    id: "esg-core-docs",
    area: "esg",
    label: "ESG baseline and utility evidence",
    requiredDocumentTypes: ["utility_bill", "energy_audit", "esg_report"],
    reviewRoles: ["human"],
    required: true,
  },
  {
    id: "incentive-core-docs",
    area: "incentive",
    label: "Incentive application evidence",
    requiredDocumentTypes: ["tax_credit_estimate", "rebate_application", "grant_application"],
    reviewRoles: ["human", "accounting"],
    required: true,
  },
  {
    id: "funding-core-docs",
    area: "funding",
    label: "Funding and lender package evidence",
    requiredDocumentTypes: ["lender_term_sheet", "construction_budget", "contractor_bid", "legal_opinion"],
    reviewRoles: ["human", "legal", "lender"],
    required: true,
  },
  {
    id: "blockchain-proof-review",
    area: "pof",
    label: "Blockchain proof references require off-chain review",
    requiredDocumentTypes: ["blockchain_proof_reference", "xrpl_wallet_reference", "accounting_review"],
    reviewRoles: ["human", "off_chain", "accounting"],
    required: true,
  },
];

const KEYWORD_MAP: Array<{ keywords: string[]; type: EvidenceDocumentType }> = [
  { keywords: ["bank", "statement"], type: "bank_statement" },
  { keywords: ["escrow"], type: "escrow_letter" },
  { keywords: ["term sheet"], type: "lender_term_sheet" },
  { keywords: ["appraisal"], type: "appraisal" },
  { keywords: ["title"], type: "title_report" },
  { keywords: ["insurance", "certificate"], type: "insurance_certificate" },
  { keywords: ["operating agreement"], type: "operating_agreement" },
  { keywords: ["purchase agreement", "psa"], type: "purchase_agreement" },
  { keywords: ["budget"], type: "construction_budget" },
  { keywords: ["bid"], type: "contractor_bid" },
  { keywords: ["permit"], type: "permit" },
  { keywords: ["utility"], type: "utility_bill" },
  { keywords: ["energy audit"], type: "energy_audit" },
  { keywords: ["tax credit"], type: "tax_credit_estimate" },
  { keywords: ["rebate"], type: "rebate_application" },
  { keywords: ["grant application"], type: "grant_application" },
  { keywords: ["grant award"], type: "grant_award" },
  { keywords: ["environmental"], type: "environmental_report" },
  { keywords: ["esg"], type: "esg_report" },
  { keywords: ["xrpl", "wallet"], type: "xrpl_wallet_reference" },
  { keywords: ["blockchain", "proof"], type: "blockchain_proof_reference" },
  { keywords: ["legal opinion"], type: "legal_opinion" },
  { keywords: ["accounting review", "cpa"], type: "accounting_review" },
];

const TYPE_AREAS: Record<EvidenceDocumentType, EvidenceArea[]> = {
  bank_statement: ["pof", "funding"],
  escrow_letter: ["pof", "funding"],
  lender_term_sheet: ["funding"],
  appraisal: ["rwa", "funding"],
  title_report: ["rwa", "funding"],
  insurance_certificate: ["rwa", "funding"],
  operating_agreement: ["funding"],
  purchase_agreement: ["rwa", "funding"],
  construction_budget: ["funding"],
  contractor_bid: ["funding", "incentive"],
  permit: ["funding", "esg"],
  utility_bill: ["esg", "incentive"],
  energy_audit: ["esg", "incentive"],
  tax_credit_estimate: ["incentive", "funding"],
  rebate_application: ["incentive", "funding"],
  grant_application: ["incentive", "funding"],
  grant_award: ["incentive", "funding"],
  environmental_report: ["esg", "rwa"],
  esg_report: ["esg", "funding"],
  xrpl_wallet_reference: ["pof", "funding"],
  blockchain_proof_reference: ["pof", "funding"],
  legal_opinion: ["rwa", "funding"],
  accounting_review: ["pof", "incentive", "funding"],
  other: [],
};

const TYPE_REVIEW: Record<EvidenceDocumentType, EvidenceReviewRole[]> = {
  bank_statement: ["human", "accounting", "lender"],
  escrow_letter: ["human", "lender"],
  lender_term_sheet: ["human", "legal", "lender"],
  appraisal: ["human", "lender"],
  title_report: ["human", "legal"],
  insurance_certificate: ["human"],
  operating_agreement: ["human", "legal"],
  purchase_agreement: ["human", "legal"],
  construction_budget: ["human"],
  contractor_bid: ["human"],
  permit: ["human"],
  utility_bill: ["human"],
  energy_audit: ["human"],
  tax_credit_estimate: ["human", "accounting"],
  rebate_application: ["human", "accounting"],
  grant_application: ["human", "accounting"],
  grant_award: ["human", "accounting"],
  environmental_report: ["human"],
  esg_report: ["human"],
  xrpl_wallet_reference: ["human", "off_chain", "accounting"],
  blockchain_proof_reference: ["human", "off_chain", "accounting"],
  legal_opinion: ["human", "legal"],
  accounting_review: ["human", "accounting"],
  other: ["human"],
};

function inferDocumentType(document: EvidenceDocument): {
  documentType: EvidenceDocumentType;
  confidence: EvidenceClassification["confidence"];
} {
  if (document.documentType) {
    return { documentType: document.documentType, confidence: "explicit" };
  }

  const haystack = `${document.title} ${document.fileName ?? ""}`.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some((keyword) => haystack.includes(keyword))) {
      return { documentType: entry.type, confidence: "inferred" };
    }
  }

  return { documentType: "other", confidence: "fallback" };
}

function isExpired(document: EvidenceDocument): boolean {
  if (!document.expiryDate) return false;
  return document.expiryDate < document.uploadedAt.slice(0, 10);
}

function isAccepted(document: EvidenceDocument, expired: boolean): boolean {
  return document.status === "accepted" && !expired;
}

function classifyDocument(document: EvidenceDocument): EvidenceClassification {
  const { documentType, confidence } = inferDocumentType(document);
  const expired = isExpired(document) || document.status === "expired";
  return {
    documentId: document.id,
    documentType,
    confidence,
    mappedAreas: TYPE_AREAS[documentType],
    reviewRequired: TYPE_REVIEW[documentType],
    isExpired: expired,
    isAccepted: isAccepted(document, expired),
  };
}

function buildLinks(classifications: EvidenceClassification[]): EvidenceLink[] {
  const links: EvidenceLink[] = [];
  for (const classification of classifications) {
    for (const requirement of BUILTIN_EVIDENCE_REQUIREMENTS) {
      if (!requirement.requiredDocumentTypes.includes(classification.documentType)) continue;
      links.push({
        documentId: classification.documentId,
        requirementId: requirement.id,
        area: requirement.area,
        linkStatus: classification.isExpired ? "expired" : classification.isAccepted ? "mapped" : "review_required",
      });
    }
  }
  return links;
}

function buildGaps(classifications: EvidenceClassification[], links: EvidenceLink[]): EvidenceGap[] {
  const gaps: EvidenceGap[] = [];

  for (const requirement of BUILTIN_EVIDENCE_REQUIREMENTS) {
    const matchingClassifications = classifications.filter((classification) =>
      requirement.requiredDocumentTypes.includes(classification.documentType),
    );
    const accepted = matchingClassifications.filter((classification) => classification.isAccepted);
    const expired = matchingClassifications.filter((classification) => classification.isExpired);

    if (accepted.length === 0 && matchingClassifications.length === 0) {
      gaps.push({
        requirementId: requirement.id,
        area: requirement.area,
        label: requirement.label,
        reason: "missing",
        relatedDocumentIds: [],
      });
      continue;
    }

    if (accepted.length === 0 && expired.length > 0) {
      gaps.push({
        requirementId: requirement.id,
        area: requirement.area,
        label: requirement.label,
        reason: "expired",
        relatedDocumentIds: expired.map((item) => item.documentId),
      });
      continue;
    }

    if (accepted.length === 0) {
      gaps.push({
        requirementId: requirement.id,
        area: requirement.area,
        label: requirement.label,
        reason: "needs_review",
        relatedDocumentIds: links
          .filter((link) => link.requirementId === requirement.id)
          .map((link) => link.documentId),
      });
    }
  }

  return gaps;
}

export function assessEvidenceDocuments(input: EvidenceReviewInput): EvidenceReviewResult {
  const classifications = input.documents
    .map((document) => classifyDocument(document))
    .sort((left, right) => left.documentId.localeCompare(right.documentId));

  const links = buildLinks(classifications).sort((left, right) => {
    const requirementComparison = left.requirementId.localeCompare(right.requirementId);
    if (requirementComparison !== 0) return requirementComparison;
    return left.documentId.localeCompare(right.documentId);
  });

  const gaps = buildGaps(classifications, links).sort((left, right) => left.requirementId.localeCompare(right.requirementId));

  const acceptedDocuments = classifications.filter((item) => item.isAccepted).map((item) => item.documentId);
  const reviewRequiredDocuments = classifications.filter((item) => !item.isAccepted).map((item) => item.documentId);
  const expiredDocuments = classifications.filter((item) => item.isExpired).map((item) => item.documentId);

  const blockedReasons = [
    ...gaps.map((gap) => `${gap.area}:${gap.reason}:${gap.label}`),
    ...(classifications.some((item) => item.documentType === "blockchain_proof_reference" || item.documentType === "xrpl_wallet_reference")
      ? ["Blockchain and XRPL references require off-chain accounting review before acceptance"]
      : []),
  ];

  return {
    projectId: input.projectId,
    requirements: BUILTIN_EVIDENCE_REQUIREMENTS,
    classifications,
    gaps,
    links,
    acceptedDocuments,
    reviewRequiredDocuments,
    expiredDocuments,
    blockedReasons,
  };
}