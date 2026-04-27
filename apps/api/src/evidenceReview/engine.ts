// -- Evidence Review -- Engine ----------------------------------------------
// Enforces role-based acceptance and audit requirements.

import type {
  EvidenceAcceptancePolicy,
  EvidenceDocumentClass,
  EvidenceReviewAuditEntry,
  EvidenceReviewInput,
  EvidenceReviewOutcome,
  EvidenceReviewerRole,
} from "./types.js";

const POLICY: Record<EvidenceDocumentClass, EvidenceAcceptancePolicy> = {
  general: {
    documentClass: "general",
    checklist: { requiresRole: ["project_admin", "construction_reviewer"], requiresLenderAuthorization: false, requiresOffChainReview: false },
  },
  legal: {
    documentClass: "legal",
    checklist: { requiresRole: ["legal_reviewer"], requiresLenderAuthorization: false, requiresOffChainReview: false },
  },
  tax: {
    documentClass: "tax",
    checklist: { requiresRole: ["tax_reviewer", "accounting_reviewer"], requiresLenderAuthorization: false, requiresOffChainReview: false },
  },
  lender: {
    documentClass: "lender",
    checklist: { requiresRole: ["lender_reviewer", "project_admin"], requiresLenderAuthorization: true, requiresOffChainReview: false },
  },
  contractor: {
    documentClass: "contractor",
    checklist: { requiresRole: ["construction_reviewer", "project_admin"], requiresLenderAuthorization: false, requiresOffChainReview: false },
  },
  code_permit: {
    documentClass: "code_permit",
    checklist: { requiresRole: ["code_reviewer"], requiresLenderAuthorization: false, requiresOffChainReview: false },
  },
  esg: {
    documentClass: "esg",
    checklist: { requiresRole: ["esg_reviewer"], requiresLenderAuthorization: false, requiresOffChainReview: false },
  },
  incentive: {
    documentClass: "incentive",
    checklist: { requiresRole: ["esg_reviewer", "tax_reviewer", "accounting_reviewer"], requiresLenderAuthorization: false, requiresOffChainReview: false },
  },
  blockchain_reference: {
    documentClass: "blockchain_reference",
    checklist: { requiresRole: ["public_finance_reviewer", "legal_reviewer"], requiresLenderAuthorization: false, requiresOffChainReview: true },
  },
};

function roleAllowed(role: EvidenceReviewerRole, requiredRoles: EvidenceReviewerRole[]): boolean {
  return requiredRoles.includes(role);
}

function createAuditEntry(input: EvidenceReviewInput, action: string, details: string): EvidenceReviewAuditEntry {
  return {
    timestamp: input.reviewedAt,
    actor: input.reviewerRole,
    evidenceId: input.evidenceId,
    action,
    details,
  };
}

export function reviewEvidence(input: EvidenceReviewInput): EvidenceReviewOutcome {
  const policy = POLICY[input.documentClass];
  const blockers: string[] = [];

  if (input.secretDetected && input.decision === "accept") {
    blockers.push("Prohibited secret-like file cannot be approved.");
  }

  if (input.decision === "reject" && !input.reason?.trim()) {
    blockers.push("Rejection requires a reason.");
  }

  if (input.decision === "accept") {
    if (!roleAllowed(input.reviewerRole, policy.checklist.requiresRole)) {
      blockers.push(`Reviewer role ${input.reviewerRole} is not allowed for ${input.documentClass} documents.`);
    }

    if (policy.checklist.requiresLenderAuthorization && !input.lenderUseAuthorized) {
      blockers.push("Lender-use authorization is required before acceptance.");
    }

    if (policy.checklist.requiresOffChainReview) {
      blockers.push("Blockchain/RWA proof references require off-chain review confirmation.");
    }

    if (input.documentClass === "incentive" && input.claimType === "tax_credit") {
      const allowed: EvidenceReviewerRole[] = ["tax_reviewer", "accounting_reviewer"];
      if (!allowed.includes(input.reviewerRole)) {
        blockers.push("Tax-credit incentive claims require tax/accounting reviewer.");
      }
    }
  }

  if (blockers.length > 0) {
    return {
      evidenceId: input.evidenceId,
      outcome: "review_required",
      accepted: false,
      blockerReasons: blockers,
    };
  }

  if (input.decision === "accept") {
    return {
      evidenceId: input.evidenceId,
      outcome: "accepted",
      accepted: true,
      blockerReasons: [],
      auditEntry: createAuditEntry(input, "evidence_accepted", "Accepted by authorized reviewer."),
    };
  }

  if (input.decision === "reject") {
    return {
      evidenceId: input.evidenceId,
      outcome: "rejected",
      accepted: false,
      blockerReasons: [],
      auditEntry: createAuditEntry(input, "evidence_rejected", input.reason ?? "Rejected."),
    };
  }

  if (input.decision === "needs_more_info") {
    return {
      evidenceId: input.evidenceId,
      outcome: "needs_more_info",
      accepted: false,
      blockerReasons: ["Additional supporting evidence requested."],
    };
  }

  if (input.decision === "expire") {
    return {
      evidenceId: input.evidenceId,
      outcome: "expired",
      accepted: false,
      blockerReasons: ["Evidence is expired and must be re-submitted."],
    };
  }

  if (input.decision === "mark_duplicate") {
    return {
      evidenceId: input.evidenceId,
      outcome: "duplicate",
      accepted: false,
      blockerReasons: ["Duplicate evidence record."],
    };
  }

  if (input.decision === "mark_wrong_document") {
    return {
      evidenceId: input.evidenceId,
      outcome: "wrong_document",
      accepted: false,
      blockerReasons: ["Wrong document type for this requirement."],
    };
  }

  return {
    evidenceId: input.evidenceId,
    outcome: "blocked",
    accepted: false,
    blockerReasons: ["Review action blocked by policy."],
  };
}
