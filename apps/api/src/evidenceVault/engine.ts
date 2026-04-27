// -- Evidence Vault -- Engine ------------------------------------------------
// Deterministic metadata-only registration.
// Uploaded does not mean accepted.

import type {
  EvidenceVaultAccessPolicy,
  EvidenceVaultAuditEntry,
  EvidenceVaultRecord,
  EvidenceVaultRegistrationInput,
  EvidenceVaultRegistrationResult,
  EvidenceVaultRetentionPolicy,
  EvidenceVaultScanOutcome,
  EvidenceVaultSecurityScan,
  EvidenceVaultStatus,
  EvidenceVaultStoragePolicy,
} from "./types.js";

const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB metadata gate

const ALLOWED_EXTENSIONS = new Set([
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "csv",
  "xlsx",
  "xls",
  "doc",
  "docx",
  "txt",
  "eml",
]);

const SECRET_PATTERNS: RegExp[] = [
  /\.env$/i,
  /id_rsa/i,
  /private[_\-\s]?key/i,
  /seed[_\-\s]?phrase/i,
  /mnemonic/i,
  /api[_\-\s]?token/i,
  /password/i,
  /wallet[_\-\s]?key/i,
];

const SENSITIVE_PATTERNS: RegExp[] = [
  /bank[_\-\s]?statement/i,
  /tax[_\-\s]?memo/i,
  /legal[_\-\s]?memo/i,
  /identity|passport|driver[_\-\s]?license|ssn/i,
  /lender[_\-\s]?term[_\-\s]?sheet/i,
  /insurance/i,
  /title|deed/i,
];

function normalizeLabel(label: string): string {
  return label.trim().replace(/\s+/g, " ");
}

function extensionOf(filename: string): string {
  const ext = filename.split(".").pop();
  return ext ? ext.toLowerCase() : "";
}

function stableId(input: EvidenceVaultRegistrationInput, ext: string): string {
  const seed = [
    input.filename.toLowerCase(),
    normalizeLabel(input.submittedLabel).toLowerCase(),
    input.source.toLowerCase(),
    String(input.sizeBytes),
    input.uploadedAt,
    ext,
  ].join("|");

  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return `evr-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function scanSecurity(input: EvidenceVaultRegistrationInput): EvidenceVaultSecurityScan {
  const combined = `${input.filename} ${input.submittedLabel}`;

  const prohibitedMatches = SECRET_PATTERNS
    .filter((pattern) => pattern.test(combined) || pattern.test(input.filename))
    .map((pattern) => pattern.source);
  if (prohibitedMatches.length > 0) {
    return {
      outcome: "secret_detected",
      blocked: true,
      sensitive: true,
      findings: ["Prohibited secret-like filename or label detected."],
      prohibitedMatches,
    };
  }

  const sensitiveMatches = SENSITIVE_PATTERNS.filter((pattern) => pattern.test(combined)).map((pattern) => pattern.source);
  if (sensitiveMatches.length > 0) {
    return {
      outcome: "sensitive",
      blocked: false,
      sensitive: true,
      findings: ["Sensitive document class detected; restricted handling required."],
      prohibitedMatches: [],
    };
  }

  return {
    outcome: "clean",
    blocked: false,
    sensitive: false,
    findings: [],
    prohibitedMatches: [],
  };
}

function classifyTarget(input: EvidenceVaultRegistrationInput): string[] {
  const combined = `${input.filename} ${input.submittedLabel}`.toLowerCase();
  const targets: string[] = [];
  if (/appraisal|term[_\-\s]?sheet|bank[_\-\s]?statement|title|deed/.test(combined)) targets.push("packetStatus", "evidenceMapping");
  if (/permit|code|inspection/.test(combined)) targets.push("code_permit");
  if (/legal|tax|insurance/.test(combined)) targets.push("reviewWorkflow");
  return Array.from(new Set(targets));
}

function accessPolicy(scan: EvidenceVaultSecurityScan): EvidenceVaultAccessPolicy {
  if (scan.sensitive) {
    return {
      accessTier: "restricted",
      rolesRequired: ["project_admin", "legal_reviewer", "tax_reviewer", "lender_reviewer"],
    };
  }
  return {
    accessTier: "internal",
    rolesRequired: ["project_admin", "construction_reviewer"],
  };
}

function retentionPolicy(uploadedAt: string, scan: EvidenceVaultSecurityScan): EvidenceVaultRetentionPolicy {
  const baseDays = scan.sensitive ? 3650 : 2555; // 10y / 7y
  const uploadedMs = Date.parse(uploadedAt);
  const expiresAt = Number.isFinite(uploadedMs)
    ? new Date(uploadedMs + baseDays * 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() + baseDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    retentionDays: baseDays,
    expiresAt,
    legalHold: false,
  };
}

function storagePolicy(evidenceId: string, blocked: boolean): EvidenceVaultStoragePolicy {
  return {
    mode: blocked ? "external_storage_blocked" : "local_reference_only",
    locationReference: `vault://${evidenceId}`,
    externalTransferAllowed: false,
    notes: blocked
      ? ["Blocked at registration due to prohibited pattern."]
      : ["Metadata-only registration. Raw file storage not enabled in this phase."],
  };
}

function outcomeToStatus(outcome: EvidenceVaultScanOutcome): EvidenceVaultStatus {
  if (outcome === "secret_detected" || outcome === "blocked") return "quarantined";
  if (outcome === "unsupported_file_type" || outcome === "oversized") return "rejected";
  return "review_required";
}

export function registerEvidenceMetadata(input: EvidenceVaultRegistrationInput): EvidenceVaultRegistrationResult {
  const actor = input.actor ?? "system";
  const normalizedExt = extensionOf(input.filename);

  let scan = scanSecurity(input);
  const warnings: string[] = [];

  if (input.sizeBytes > MAX_SIZE_BYTES && !scan.blocked) {
    scan = {
      outcome: "oversized",
      blocked: true,
      sensitive: scan.sensitive,
      findings: [...scan.findings, `File exceeds size limit (${MAX_SIZE_BYTES} bytes).`],
      prohibitedMatches: scan.prohibitedMatches,
    };
  }

  if (!ALLOWED_EXTENSIONS.has(normalizedExt) && !scan.blocked) {
    scan = {
      outcome: "unsupported_file_type",
      blocked: true,
      sensitive: scan.sensitive,
      findings: [...scan.findings, `Unsupported extension: .${normalizedExt || "(none)"}`],
      prohibitedMatches: scan.prohibitedMatches,
    };
  }

  const evidenceId = stableId(input, normalizedExt);
  const status = outcomeToStatus(scan.outcome);

  const record: EvidenceVaultRecord = {
    evidenceId,
    status,
    metadata: {
      filename: input.filename,
      extension: normalizedExt,
      normalizedLabel: normalizeLabel(input.submittedLabel),
      source: input.source.trim().toLowerCase(),
      sizeBytes: input.sizeBytes,
      uploadedAt: input.uploadedAt,
      mimeType: input.mimeType,
    },
    storagePolicy: storagePolicy(evidenceId, scan.blocked),
    securityScan: scan,
    retentionPolicy: retentionPolicy(input.uploadedAt, scan),
    accessPolicy: accessPolicy(scan),
    mappingTargets: scan.blocked ? [] : classifyTarget(input),
    autoAccepted: false,
  };

  if (scan.sensitive) warnings.push("Sensitive document: restricted handling and reviewer assignment required.");
  if (scan.outcome === "clean" && record.mappingTargets.length === 0) warnings.push("No mapping target inferred; manual mapping required.");

  const auditEntries: EvidenceVaultAuditEntry[] = [
    {
      timestamp: input.uploadedAt,
      actor,
      action: "evidence_registered",
      details: `Registered metadata-only evidence record ${evidenceId}.`,
    },
    {
      timestamp: input.uploadedAt,
      actor,
      action: scan.blocked ? "evidence_quarantined" : "evidence_review_required",
      details: `Security scan outcome: ${scan.outcome}.`,
    },
  ];

  let nextAction = "Assign reviewer and map to missing requirements.";
  if (status === "quarantined") nextAction = "Do not accept. Remove prohibited secret material and resubmit sanitized evidence.";
  if (status === "rejected") nextAction = "Fix extension/size policy violation and resubmit metadata.";

  return {
    record,
    warnings,
    nextAction,
    auditEntries,
  };
}

export function registerEvidenceMetadataBatch(inputs: EvidenceVaultRegistrationInput[]): EvidenceVaultRegistrationResult[] {
  return inputs.map(registerEvidenceMetadata);
}
