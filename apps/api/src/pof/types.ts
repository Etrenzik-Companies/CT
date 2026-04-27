// ── Proof-of-Funds — Types ────────────────────────────────────────────────
// For internal diligence and lender submission review only.
// Not financial advice. All PoF outputs require legal and lender review.

export const FUNDING_SOURCE_TYPES = [
  "bank_deposit",
  "brokerage_account",
  "line_of_credit",
  "hard_money_loan",
  "bridge_loan",
  "construction_loan",
  "sponsor_equity",
  "family_office",
  "private_credit",
  "grant",
  "tax_credit_proceeds",
  "rebate",
  "cpace",
  "xrpl_blockchain_reference",
  "other_blockchain_reference",
  "unverified_estimate",
  "other",
] as const;

export type FundingSourceType = (typeof FUNDING_SOURCE_TYPES)[number];

export const POF_READINESS_STATUSES = [
  "lender_ready",
  "internally_ready",
  "evidence_missing",
  "gap_unresolved",
  "blocked",
] as const;

export type PofReadinessStatus = (typeof POF_READINESS_STATUSES)[number];

export interface BankEvidence {
  bankName: string;
  accountType: string;
  statementDate: string;
  verifiedAmount: number;
  currency: string;
  evidenceId?: string;
  contactName?: string;
}

export interface BlockchainEvidence {
  chain: string; // e.g. "XRPL", "Apostle", "Ethereum"
  walletLabel: string;
  evidenceId?: string;
  verifiedAmount: number;
  currency: string;
  note: string; // must explain verification basis
}

export interface LenderUseAuthorization {
  lenderName: string;
  authorizedAmount: number;
  currency: string;
  authorizedPurpose: string;
  expiryDate?: string;
  evidenceId?: string;
}

export interface FundingSource {
  id: string;
  sourceType: FundingSourceType;
  label: string;
  amount: number;
  currency: string;
  isVerified: boolean; // true only if backed by verifiable evidence
  isEstimated: boolean; // estimated incentives, rebates, projections
  bankEvidence?: BankEvidence;
  blockchainEvidence?: BlockchainEvidence;
  evidenceId?: string;
  notes?: string;
}

export interface CapitalStackEntry {
  sourceId: string;
  label: string;
  amount: number;
  currency: string;
  position: "senior_debt" | "mezzanine" | "sponsor_equity" | "grant" | "incentive" | "other";
  committed: boolean;
}

export interface GapAnalysis {
  totalProjectCost: number;
  totalVerifiedFunds: number;
  totalEstimatedFunds: number;
  totalUnverifiedFunds: number;
  capitalGap: number; // totalProjectCost - totalVerifiedFunds
  estimatedGap: number; // totalProjectCost - (totalVerifiedFunds + totalEstimatedFunds)
}

export interface ProofOfFundsPacket {
  id: string;
  projectName: string;
  projectCost: number;
  currency: string;
  fundingSources: FundingSource[];
  capitalStack: CapitalStackEntry[];
  lenderAuthorizations: LenderUseAuthorization[];
  submissionDate?: string;
  notes?: string;
}

export interface PofReadinessResult {
  packetId: string;
  status: PofReadinessStatus;
  gapAnalysis: GapAnalysis;
  verifiedSourcesCount: number;
  estimatedSourcesCount: number;
  missingEvidence: string[];
  blockedReasons: string[];
  reviewNotes: string[];
}
