// -- First Evidence Batch -- Engine ------------------------------------------
// Builds deterministic first-batch checklist/readiness without raw file ingestion.

import { FIRST_EVIDENCE_BATCH_PLACEHOLDER_TITLES } from "./demoData.js";
import type {
  FirstEvidenceBatchCategory,
  FirstEvidenceBatchInput,
  FirstEvidenceBatchItem,
  FirstEvidenceBatchRequirement,
  FirstEvidenceBatchResult,
  FirstEvidenceBatchReviewerAssignment,
  FirstEvidenceBatchStatus,
} from "./types.js";

const REQUIREMENTS: FirstEvidenceBatchRequirement[] = [
  {
    category: "appraisal",
    title: FIRST_EVIDENCE_BATCH_PLACEHOLDER_TITLES.appraisal,
    priority: "critical",
    confidential: true,
    classification: "valuation",
    requiresLenderUseAuthorization: false,
    reviewerAssignments: [
      { role: "lender_reviewer", reviewFocus: "valuation_review", required: true },
      { role: "project_admin", reviewFocus: "document_completeness", required: true },
    ],
  },
  {
    category: "title_search",
    title: FIRST_EVIDENCE_BATCH_PLACEHOLDER_TITLES.title_search,
    priority: "critical",
    confidential: true,
    classification: "legal_title",
    requiresLenderUseAuthorization: false,
    reviewerAssignments: [
      { role: "legal_reviewer", reviewFocus: "legal_review", required: true },
      { role: "title_reviewer", reviewFocus: "title_review", required: true },
    ],
  },
  {
    category: "gc_insurance",
    title: FIRST_EVIDENCE_BATCH_PLACEHOLDER_TITLES.gc_insurance,
    priority: "critical",
    confidential: true,
    classification: "insurance",
    requiresLenderUseAuthorization: false,
    reviewerAssignments: [
      { role: "construction_reviewer", reviewFocus: "construction_coverage_review", required: true },
      { role: "insurance_reviewer", reviewFocus: "insurance_review", required: true },
    ],
  },
  {
    category: "bank_statement",
    title: FIRST_EVIDENCE_BATCH_PLACEHOLDER_TITLES.bank_statement,
    priority: "critical",
    confidential: true,
    classification: "financial_confidential",
    requiresLenderUseAuthorization: false,
    reviewerAssignments: [
      { role: "accounting_reviewer", reviewFocus: "financial_review", required: true },
      { role: "lender_reviewer", reviewFocus: "proof_of_funds_review", required: true },
    ],
  },
  {
    category: "lender_term_sheet",
    title: FIRST_EVIDENCE_BATCH_PLACEHOLDER_TITLES.lender_term_sheet,
    priority: "critical",
    confidential: true,
    classification: "lender_confidential",
    requiresLenderUseAuthorization: true,
    reviewerAssignments: [
      { role: "lender_reviewer", reviewFocus: "lender_terms_review", required: true },
      { role: "legal_reviewer", reviewFocus: "term_sheet_legal_review", required: true },
    ],
  },
];

function normalizeSeededStatus(status: FirstEvidenceBatchStatus): FirstEvidenceBatchStatus {
  if (status === "missing") return "missing";
  if (status === "accepted") return "accepted";
  if (status === "rejected") return "rejected";
  if (status === "blocked") return "blocked";
  if (status === "expired") return "expired";
  return "review_required";
}

function receivedLike(status: FirstEvidenceBatchStatus): boolean {
  return ["received", "registered", "mapped", "review_required", "accepted", "rejected", "blocked", "expired"].includes(status);
}

function itemNotes(category: FirstEvidenceBatchCategory, assignments: FirstEvidenceBatchReviewerAssignment[]): string[] {
  const notes = [`Required reviewers: ${assignments.map((entry) => entry.role).join(", ")}`];
  if (category === "bank_statement") notes.push("Financial/confidential handling required.");
  if (category === "lender_term_sheet") notes.push("Lender-use authorization required before lender-ready status.");
  if (category === "title_search") notes.push("Legal/title review required.");
  if (category === "appraisal") notes.push("Lender/valuation review required.");
  if (category === "gc_insurance") notes.push("Construction/insurance review required.");
  notes.push("Upload/register does not equal acceptance.");
  return notes;
}

export function buildFirstEvidenceBatch(input: FirstEvidenceBatchInput): FirstEvidenceBatchResult {
  const items: FirstEvidenceBatchItem[] = REQUIREMENTS.map((requirement) => {
    const seeded = input.statusByCategory?.[requirement.category] ?? "missing";
    const status = normalizeSeededStatus(seeded);

    return {
      category: requirement.category,
      title: requirement.title,
      status,
      priority: requirement.priority,
      confidential: requirement.confidential,
      classification: requirement.classification,
      requiresLenderUseAuthorization: requirement.requiresLenderUseAuthorization,
      reviewerAssignments: requirement.reviewerAssignments,
      autoAccepted: false,
      notes: itemNotes(requirement.category, requirement.reviewerAssignments),
    };
  });

  const totalItems = items.length;
  const missingCount = items.filter((item) => item.status === "missing").length;
  const receivedCount = items.filter((item) => receivedLike(item.status)).length;
  const reviewRequiredCount = items.filter((item) => item.status === "review_required").length;
  const acceptedCount = items.filter((item) => item.status === "accepted").length;
  const blockedCount = items.filter((item) => item.status === "blocked").length;

  const lenderReady = acceptedCount === totalItems && input.lenderUseAuthorized;

  const warnings: string[] = [
    "Metadata/checklist only. No raw confidential file contents are committed in Phase 10.",
    "Uploaded/register status is not acceptance.",
  ];
  if (!input.lenderUseAuthorized) warnings.push("Lender-use authorization is not on file.");

  const nextBestActions: string[] = [];
  const missingCategories = items.filter((item) => item.status === "missing").map((item) => item.category);
  if (missingCategories.length > 0) {
    nextBestActions.push(`Collect missing lender-critical items: ${missingCategories.join(", ")}.`);
  }
  if (reviewRequiredCount > 0) {
    nextBestActions.push("Route all review_required items to assigned reviewer roles.");
  }
  if (!input.lenderUseAuthorized) {
    nextBestActions.push("Obtain lender-use authorization before considering lender-ready status.");
  }
  if (nextBestActions.length === 0) {
    nextBestActions.push("All first-batch items accepted and authorized; maintain audit trail.");
  }

  return {
    items,
    readiness: {
      totalItems,
      missingCount,
      receivedCount,
      reviewRequiredCount,
      acceptedCount,
      blockedCount,
      lenderUseAuthorized: input.lenderUseAuthorized,
      lenderReady,
    },
    nextBestActions,
    warnings,
  };
}

export function buildAcceptedFirstEvidenceBatch(lenderUseAuthorized: boolean): FirstEvidenceBatchResult {
  const statusByCategory: Partial<Record<FirstEvidenceBatchCategory, FirstEvidenceBatchStatus>> = {
    appraisal: "accepted",
    title_search: "accepted",
    gc_insurance: "accepted",
    bank_statement: "accepted",
    lender_term_sheet: "accepted",
  };
  return buildFirstEvidenceBatch({ statusByCategory, lenderUseAuthorized });
}
