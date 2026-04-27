// -- First Evidence Batch -- Integrations ------------------------------------

import type { FirstEvidenceBatchCategory } from "./types.js";

export interface FirstEvidenceBatchIntegrationTarget {
  category: FirstEvidenceBatchCategory;
  evidenceVaultTarget: string;
  evidenceMappingTarget: string;
  packetStatusSection: string;
  lenderPacketSection: string;
  fundingRoutesDependency: string;
  contractorMatrixDependency?: string;
}

export const FIRST_EVIDENCE_BATCH_INTEGRATIONS: Record<FirstEvidenceBatchCategory, FirstEvidenceBatchIntegrationTarget> = {
  appraisal: {
    category: "appraisal",
    evidenceVaultTarget: "first_batch.appraisal",
    evidenceMappingTarget: "fundingRoutes",
    packetStatusSection: "funding",
    lenderPacketSection: "appraisal_title_insurance",
    fundingRoutesDependency: "senior_construction_loan",
  },
  title_search: {
    category: "title_search",
    evidenceVaultTarget: "first_batch.title_search",
    evidenceMappingTarget: "lenderPacket",
    packetStatusSection: "legal_title",
    lenderPacketSection: "appraisal_title_insurance",
    fundingRoutesDependency: "senior_construction_loan",
  },
  gc_insurance: {
    category: "gc_insurance",
    evidenceVaultTarget: "first_batch.gc_insurance",
    evidenceMappingTarget: "contractorMatrix",
    packetStatusSection: "contractor",
    lenderPacketSection: "contractor_bids",
    fundingRoutesDependency: "senior_construction_loan",
    contractorMatrixDependency: "general_contractor",
  },
  bank_statement: {
    category: "bank_statement",
    evidenceVaultTarget: "first_batch.bank_statement",
    evidenceMappingTarget: "pof",
    packetStatusSection: "pof",
    lenderPacketSection: "proof_of_funds",
    fundingRoutesDependency: "senior_construction_loan",
  },
  lender_term_sheet: {
    category: "lender_term_sheet",
    evidenceVaultTarget: "first_batch.lender_term_sheet",
    evidenceMappingTarget: "fundingRoutes",
    packetStatusSection: "lender",
    lenderPacketSection: "capital_stack",
    fundingRoutesDependency: "senior_construction_loan",
  },
};

export function integrationForCategory(category: FirstEvidenceBatchCategory): FirstEvidenceBatchIntegrationTarget {
  return FIRST_EVIDENCE_BATCH_INTEGRATIONS[category];
}

export function allFirstEvidenceBatchIntegrations(): FirstEvidenceBatchIntegrationTarget[] {
  return Object.values(FIRST_EVIDENCE_BATCH_INTEGRATIONS);
}
