// -- Evidence Vault -- Types -------------------------------------------------
// Local evidence vault starts metadata-only. No raw file bytes are stored.

export const EVIDENCE_VAULT_STATUSES = [
  "registered",
  "quarantined",
  "rejected",
  "stored",
  "mapped",
  "review_required",
  "accepted",
  "expired",
  "deleted",
] as const;
export type EvidenceVaultStatus = (typeof EVIDENCE_VAULT_STATUSES)[number];

export const EVIDENCE_VAULT_STORAGE_MODES = [
  "local_reference_only",
  "local_file_path",
  "encrypted_storage_future",
  "external_storage_blocked",
] as const;
export type EvidenceVaultStorageMode = (typeof EVIDENCE_VAULT_STORAGE_MODES)[number];

export const EVIDENCE_VAULT_SCAN_OUTCOMES = [
  "clean",
  "sensitive",
  "secret_detected",
  "unsupported_file_type",
  "oversized",
  "blocked",
] as const;
export type EvidenceVaultScanOutcome = (typeof EVIDENCE_VAULT_SCAN_OUTCOMES)[number];

export interface EvidenceVaultFileMetadata {
  filename: string;
  extension: string;
  normalizedLabel: string;
  source: string;
  sizeBytes: number;
  uploadedAt: string;
  mimeType?: string;
}

export interface EvidenceVaultStoragePolicy {
  mode: EvidenceVaultStorageMode;
  locationReference: string;
  externalTransferAllowed: false;
  notes: string[];
}

export interface EvidenceVaultSecurityScan {
  outcome: EvidenceVaultScanOutcome;
  blocked: boolean;
  sensitive: boolean;
  findings: string[];
  prohibitedMatches: string[];
}

export interface EvidenceVaultRetentionPolicy {
  retentionDays: number;
  expiresAt: string;
  legalHold: boolean;
}

export interface EvidenceVaultAccessPolicy {
  accessTier: "restricted" | "internal";
  rolesRequired: string[];
}

export interface EvidenceVaultAuditEntry {
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export interface EvidenceVaultRecord {
  evidenceId: string;
  status: EvidenceVaultStatus;
  metadata: EvidenceVaultFileMetadata;
  storagePolicy: EvidenceVaultStoragePolicy;
  securityScan: EvidenceVaultSecurityScan;
  retentionPolicy: EvidenceVaultRetentionPolicy;
  accessPolicy: EvidenceVaultAccessPolicy;
  mappingTargets: string[];
  autoAccepted: false;
}

export interface EvidenceVaultRegistrationInput {
  filename: string;
  submittedLabel: string;
  source: string;
  sizeBytes: number;
  uploadedAt: string;
  mimeType?: string;
  actor?: string;
}

export interface EvidenceVaultRegistrationResult {
  record: EvidenceVaultRecord;
  warnings: string[];
  nextAction: string;
  auditEntries: EvidenceVaultAuditEntry[];
}
