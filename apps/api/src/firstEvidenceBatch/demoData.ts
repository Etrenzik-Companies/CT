// -- First Evidence Batch -- Demo Data ---------------------------------------
// Safe placeholder metadata only. No confidential payloads.

import type { FirstEvidenceBatchCategory, FirstEvidenceBatchInput } from "./types.js";

export const FIRST_EVIDENCE_BATCH_PLACEHOLDER_TITLES: Record<FirstEvidenceBatchCategory, string> = {
  appraisal: "Clay Terrace Appraisal Placeholder",
  title_search: "Clay Terrace Title Search Placeholder",
  gc_insurance: "Clay Terrace GC Insurance Placeholder",
  bank_statement: "Clay Terrace Bank Statement Placeholder",
  lender_term_sheet: "Clay Terrace Lender Term Sheet Placeholder",
};

export const FIRST_EVIDENCE_BATCH_SEEDED_INPUT: FirstEvidenceBatchInput = {
  lenderUseAuthorized: false,
  statusByCategory: {
    appraisal: "requested",
    title_search: "missing",
    gc_insurance: "received",
    bank_statement: "registered",
    lender_term_sheet: "requested",
  },
};
