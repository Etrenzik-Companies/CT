// -- Upload Requests -- Engine ----------------------------------------------
// Deterministic upload checklist generator with secret-request guardrails.

import type {
  UploadRequest,
  UploadRequestCategory,
  UploadRequestChecklist,
  UploadRequestRequirement,
  UploadRequestResult,
} from "./types.js";

const SECRET_REQUEST_PATTERN = /private[_\-\s]?key|seed[_\-\s]?phrase|mnemonic|api[_\-\s]?token|password|wallet[_\-\s]?key/i;

const CHECKLISTS: Record<UploadRequestCategory, UploadRequestChecklist> = {
  contractor: {
    category: "contractor",
    requirements: [
      { requirementId: "gc_insurance", label: "GC insurance certificate", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "gc_bid", label: "GC bid package", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "gc_w9", label: "GC W-9", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
    ],
  },
  trade: {
    category: "trade",
    requirements: [
      { requirementId: "trade_license", label: "Trade license", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "trade_scope", label: "Trade scope of work", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "trade_bid", label: "Trade bid", required: false, targetModules: ["evidenceMapping"] },
    ],
  },
  funding: {
    category: "funding",
    requirements: [
      { requirementId: "appraisal", label: "Appraisal report", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "title_search", label: "Title search report", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "bank_statement", label: "Bank statement", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "lender_term_sheet", label: "Lender term sheet", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
    ],
  },
  pof: {
    category: "pof",
    requirements: [
      { requirementId: "pof_document", label: "Proof of funds letter", required: true, targetModules: ["packetStatus"] },
      { requirementId: "escrow_letter", label: "Escrow letter", required: true, targetModules: ["packetStatus"] },
      { requirementId: "bank_statement", label: "Bank statement", required: true, targetModules: ["packetStatus"] },
    ],
  },
  rwa: {
    category: "rwa",
    requirements: [
      { requirementId: "rwa_legal_review", label: "RWA legal review memo", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "xrpl_proof_reference", label: "XRPL proof reference", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "human_approval_log", label: "Human approval log", required: true, targetModules: ["packetStatus"] },
    ],
  },
  esg: {
    category: "esg",
    requirements: [
      { requirementId: "energy_model", label: "Energy model", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "esg_certification", label: "ESG certification evidence", required: false, targetModules: ["evidenceMapping"] },
    ],
  },
  incentives: {
    category: "incentives",
    requirements: [
      { requirementId: "grant_award_letter", label: "Grant award letter", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "tax_credit_estimate", label: "Tax credit estimate (not verified funds)", required: false, targetModules: ["evidenceMapping"] },
    ],
  },
  tax: {
    category: "tax",
    requirements: [
      { requirementId: "tax_memo", label: "Tax memo", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "cpa_signoff", label: "CPA sign-off", required: true, targetModules: ["packetStatus"] },
    ],
  },
  legal: {
    category: "legal",
    requirements: [
      { requirementId: "legal_memo", label: "Legal memo", required: true, targetModules: ["evidenceMapping", "packetStatus"] },
      { requirementId: "attorney_opinion", label: "Attorney opinion", required: true, targetModules: ["packetStatus"] },
    ],
  },
  code_compliance: {
    category: "code_compliance",
    requirements: [
      { requirementId: "code_checklist", label: "Code compliance checklist", required: true, targetModules: ["packetStatus"] },
      { requirementId: "inspection_report", label: "Inspection report", required: false, targetModules: ["packetStatus"] },
    ],
  },
  permits: {
    category: "permits",
    requirements: [
      { requirementId: "permit_set", label: "Permit set", required: true, targetModules: ["packetStatus"] },
      { requirementId: "permit_receipt", label: "Permit filing receipt", required: false, targetModules: ["packetStatus"] },
    ],
  },
  lender: {
    category: "lender",
    requirements: [
      { requirementId: "lender_term_sheet", label: "Lender term sheet", required: true, targetModules: ["packetStatus"] },
      { requirementId: "lender_use_authorization", label: "Lender-use authorization", required: true, targetModules: ["packetStatus"] },
      { requirementId: "human_approval_log", label: "Human approval log", required: true, targetModules: ["packetStatus"] },
    ],
  },
  insurance: {
    category: "insurance",
    requirements: [
      { requirementId: "builder_risk_insurance", label: "Builder risk insurance", required: true, targetModules: ["packetStatus"] },
      { requirementId: "liability_certificate", label: "Liability certificate", required: true, targetModules: ["packetStatus"] },
    ],
  },
  title: {
    category: "title",
    requirements: [
      { requirementId: "title_search", label: "Title search report", required: true, targetModules: ["packetStatus"] },
      { requirementId: "deed", label: "Current deed", required: true, targetModules: ["packetStatus"] },
    ],
  },
  appraisal: {
    category: "appraisal",
    requirements: [
      { requirementId: "appraisal", label: "Appraisal report", required: true, targetModules: ["packetStatus"] },
      { requirementId: "appraisal_support", label: "Appraisal support exhibits", required: false, targetModules: ["packetStatus"] },
    ],
  },
  utility: {
    category: "utility",
    requirements: [
      { requirementId: "utility_confirmation", label: "Utility service confirmation", required: true, targetModules: ["packetStatus"] },
      { requirementId: "interconnection_letter", label: "Interconnection letter", required: false, targetModules: ["packetStatus"] },
    ],
  },
  other: {
    category: "other",
    requirements: [
      { requirementId: "supporting_document", label: "Supporting document", required: false, targetModules: ["evidenceMapping"] },
    ],
  },
};

export interface BuildUploadRequestInput {
  category: UploadRequestCategory;
  missingRequirementIds: string[];
}

function stableRequestId(category: UploadRequestCategory, missingRequirementIds: string[]): string {
  const seed = `${category}|${[...missingRequirementIds].sort().join(",")}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return `upl-${hash.toString(16).padStart(8, "0")}`;
}

function sanitizeRequirements(requirements: UploadRequestRequirement[]): {
  clean: UploadRequestRequirement[];
  violations: string[];
} {
  const violations: string[] = [];
  const clean = requirements.filter((requirement) => {
    const bad = SECRET_REQUEST_PATTERN.test(requirement.label);
    if (bad) violations.push(`Blocked secret-like request label: ${requirement.label}`);
    return !bad;
  });
  return { clean, violations };
}

export function buildUploadRequest(input: BuildUploadRequestInput): UploadRequestResult {
  const checklist = CHECKLISTS[input.category];
  const sanitized = sanitizeRequirements(checklist.requirements);

  const missingSet = new Set(input.missingRequirementIds);
  const required = sanitized.clean.filter((requirement) => requirement.required);
  const optional = sanitized.clean.filter((requirement) => !requirement.required);

  const blockerFirst = required
    .slice()
    .sort((a, b) => Number(!missingSet.has(a.requirementId)) - Number(!missingSet.has(b.requirementId)));

  const missingBlockers = blockerFirst.filter((requirement) => missingSet.has(requirement.requirementId));

  const linkedModules = Array.from(
    new Set(sanitized.clean.flatMap((requirement) => requirement.targetModules))
  );

  const request: UploadRequest = {
    requestId: stableRequestId(input.category, input.missingRequirementIds),
    category: input.category,
    priority: missingBlockers.length > 0 ? "critical" : required.length > 0 ? "high" : "medium",
    status: "open",
    linkedModules,
    requirements: [...blockerFirst, ...optional],
  };

  const nextBestActions: string[] = [];
  if (missingBlockers.length > 0) {
    nextBestActions.push(`Upload blocker documents first: ${missingBlockers.map((item) => item.label).join("; ")}.`);
  }
  if (optional.length > 0) {
    nextBestActions.push(`Then upload optional supporting items: ${optional.map((item) => item.label).join("; ")}.`);
  }
  if (nextBestActions.length === 0) {
    nextBestActions.push("No eligible requirements found; create manual request.");
  }

  return {
    request,
    missingBlockers,
    optionalRequests: optional,
    nextBestActions,
    secretRequestViolations: sanitized.violations,
  };
}

export function buildUploadRequestsBatch(inputs: BuildUploadRequestInput[]): UploadRequestResult[] {
  return inputs.map(buildUploadRequest);
}
