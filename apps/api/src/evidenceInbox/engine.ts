// ── Evidence Inbox — Engine ──────────────────────────────────────────────
// Deterministic intake engine.
// Rule: uploaded ≠ accepted. Accepted requires human review.
// Rule: secret-looking content is BLOCKED on intake.

import type {
  EvidenceClassificationStatus,
  EvidenceFileType,
  EvidenceInboxItem,
  EvidenceIntakeResult,
  EvidenceMappingTarget,
  EvidenceReviewStatus,
  EvidenceSecurityLevel,
} from "./types.js";

// ── Secret detection patterns ─────────────────────────────────────────────
// Filename/label patterns that suggest prohibited secret content.
const SECRET_PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /private[_\-\s]?key/i, reason: "private key reference detected" },
  { pattern: /seed[_\-\s]?phrase/i, reason: "seed phrase reference detected" },
  { pattern: /mnemonic/i, reason: "mnemonic/seed phrase reference detected" },
  { pattern: /api[_\-\s]?token/i, reason: "API token reference detected" },
  { pattern: /api[_\-\s]?key/i, reason: "API key reference detected" },
  { pattern: /secret[_\-\s]?key/i, reason: "secret key reference detected" },
  { pattern: /password[s]?/i, reason: "password reference detected" },
  { pattern: /\.env$/i, reason: ".env file — secrets prohibited" },
  { pattern: /keystore/i, reason: "keystore file — secrets prohibited" },
  { pattern: /wallet[_\-\s]?backup/i, reason: "wallet backup — secrets prohibited" },
];

// ── Keyword → target mapping ───────────────────────────────────────────────
const KEYWORD_TARGET_MAP: { keywords: RegExp; targets: EvidenceMappingTarget[] }[] = [
  { keywords: /insurance|cert.*of.*ins|coi/i, targets: ["contractorMatrix", "lenderPacket"] },
  { keywords: /gc[_\-\s]?bid|general.*contractor.*bid/i, targets: ["contractorMatrix", "lenderPacket"] },
  { keywords: /trade.*licens|contractor.*licens/i, targets: ["contractorMatrix"] },
  { keywords: /w-?9/i, targets: ["contractorMatrix", "lenderPacket"] },
  { keywords: /appraisal/i, targets: ["fundingRoutes", "lenderPacket"] },
  { keywords: /title|deed|ownership/i, targets: ["fundingRoutes", "lenderPacket"] },
  { keywords: /survey/i, targets: ["fundingRoutes", "lenderPacket", "permits"] },
  { keywords: /permit/i, targets: ["permits", "contractorMatrix", "lenderPacket"] },
  { keywords: /zoning/i, targets: ["permits", "codeCompliance", "lenderPacket"] },
  { keywords: /bank.*statement|escrow.*letter/i, targets: ["fundingRoutes", "lenderPacket", "pof"] },
  { keywords: /term.*sheet|loan.*commitment/i, targets: ["fundingRoutes", "lenderPacket"] },
  { keywords: /grant.*award|award.*letter/i, targets: ["fundingRoutes", "incentives", "indianaPrograms"] },
  { keywords: /tax.*credit|179d|48e|itc|ptc/i, targets: ["incentives", "indianaPrograms", "fundingRoutes"] },
  { keywords: /energy.*model|energy.*audit/i, targets: ["incentives", "esg", "indianaPrograms"] },
  { keywords: /ev.*charg|electric.*vehicle/i, targets: ["incentives", "esg"] },
  { keywords: /solar/i, targets: ["incentives", "esg"] },
  { keywords: /bond|tif|public.*finance/i, targets: ["fundingRoutes", "indianaPrograms"] },
  { keywords: /city.*letter|county.*letter|support.*letter/i, targets: ["indianaPrograms", "lenderPacket"] },
  { keywords: /legal.*memo|attorney.*opinion/i, targets: ["lenderPacket", "rwaFundingRoutes"] },
  { keywords: /tax.*memo|accounting.*memo/i, targets: ["incentives", "lenderPacket"] },
  { keywords: /xrpl|rwa|tokeniz/i, targets: ["rwaFundingRoutes", "pof"] },
  { keywords: /proof.*of.*fund|pof/i, targets: ["pof", "lenderPacket"] },
  { keywords: /esg|sustainability|leed|green/i, targets: ["esg", "incentives"] },
  { keywords: /code.*compliance|building.*code|fire.*code/i, targets: ["codeCompliance", "permits"] },
  { keywords: /utility.*confirm/i, targets: ["permits", "lenderPacket"] },
  { keywords: /human.*approv|approval.*log/i, targets: ["lenderPacket"] },
];

// ── Security level classification ──────────────────────────────────────────
function classifySecurityLevel(item: EvidenceInboxItem): EvidenceSecurityLevel {
  const combined = `${item.filename} ${item.submittedLabel} ${(item.detectedKeywords ?? []).join(" ")}`.toLowerCase();
  if (/private.*key|seed.*phrase|mnemonic|password|keystore|api.*key|api.*token/.test(combined)) return "secret_prohibited";
  if (/tax.*return|w-?2|1099|accounting|cpa|tax.*memo/.test(combined)) return "tax";
  if (/legal.*memo|attorney|confidential|attorney.*opinion/.test(combined)) return "legal";
  if (/bank.*state|escrow|balance|financial.*statement/.test(combined)) return "financial";
  if (/ssn|social.*security|id.*card|passport|identity/.test(combined)) return "identity_sensitive";
  if (/legal|contract|agreement|deed|title/.test(combined)) return "confidential";
  if (/internal|draft|working/.test(combined)) return "internal";
  return "public";
}

// ── File type classification ───────────────────────────────────────────────
function classifyFileType(filename: string, provided: EvidenceFileType): EvidenceFileType {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["jpg", "jpeg", "png", "tiff", "bmp", "gif", "webp"].includes(ext)) return "image";
  if (["xlsx", "xls", "csv", "ods"].includes(ext)) return "spreadsheet";
  if (["doc", "docx", "odt", "rtf"].includes(ext)) return "word_document";
  if (["eml", "msg"].includes(ext)) return "email";
  if (["txt", "md", "log"].includes(ext)) return "text";
  if (provided !== "unknown") return provided;
  return "unknown";
}

// ── Target inference ───────────────────────────────────────────────────────
function inferTargets(item: EvidenceInboxItem): EvidenceMappingTarget[] {
  const combined = `${item.filename} ${item.submittedLabel} ${(item.detectedKeywords ?? []).join(" ")}`;
  const targets = new Set<EvidenceMappingTarget>();
  for (const { keywords, targets: t } of KEYWORD_TARGET_MAP) {
    if (keywords.test(combined)) t.forEach((tgt) => targets.add(tgt));
  }
  return Array.from(targets);
}

// ── Main intake function ───────────────────────────────────────────────────
export function intakeEvidence(item: EvidenceInboxItem): EvidenceIntakeResult {
  const combined = `${item.filename} ${item.submittedLabel} ${(item.detectedKeywords ?? []).join(" ")}`;

  // Secret detection — hard block
  const secretBlockers: string[] = [];
  for (const { pattern, reason } of SECRET_PATTERNS) {
    if (pattern.test(combined) || pattern.test(item.filename)) secretBlockers.push(reason);
  }
  const secretDetected = secretBlockers.length > 0;

  // Security level
  const securityLevel = secretDetected ? "secret_prohibited" : classifySecurityLevel(item);

  // Review status
  let reviewStatus: EvidenceReviewStatus;
  if (secretDetected) {
    reviewStatus = "blocked";
  } else {
    reviewStatus = "received";
  }

  // Classification
  const classifiedType = classifyFileType(item.filename, item.fileType);
  const classificationStatus: EvidenceClassificationStatus =
    classifiedType !== "unknown" ? "classified" : "unclassified";

  // Target mapping
  const suggestedMappingTargets = secretDetected ? [] : inferTargets(item);

  // Warnings
  const warnings: string[] = [];
  if (securityLevel === "financial") warnings.push("Financial document — requires authorised review before sharing with any third party.");
  if (securityLevel === "legal") warnings.push("Legal document — requires attorney review.");
  if (securityLevel === "tax") warnings.push("Tax document — requires CPA/tax advisor review.");
  if (securityLevel === "identity_sensitive") warnings.push("Identity-sensitive document — handle with maximum care.");
  if (classifiedType === "unknown") warnings.push("File type not recognised — manual classification required.");
  if (suggestedMappingTargets.length === 0 && !secretDetected) warnings.push("No mapping targets detected — manual mapping required.");

  // Next action
  let nextAction: string;
  if (secretDetected) {
    nextAction = "BLOCKED — remove and do not resubmit. Contact system administrator.";
  } else if (securityLevel === "legal" || securityLevel === "tax") {
    nextAction = "Route to authorised reviewer (attorney / CPA). Do not auto-accept.";
  } else if (suggestedMappingTargets.length > 0) {
    nextAction = `Map to: ${suggestedMappingTargets.join(", ")}. Requires human review before acceptance.`;
  } else {
    nextAction = "Classify and map manually. Requires human review before acceptance.";
  }

  return {
    id: item.id,
    filename: item.filename,
    fileType: classifiedType,
    source: item.source,
    classificationStatus,
    reviewStatus,
    securityLevel,
    suggestedMappingTargets,
    secretDetected,
    secretBlockers,
    warnings,
    autoAccepted: false,
    nextAction,
  };
}

export function intakeEvidenceBatch(items: EvidenceInboxItem[]): EvidenceIntakeResult[] {
  return items.map(intakeEvidence);
}
