/**
 * @ct/types — shared domain type constants for the CT Control Tower.
 *
 * All enumerations and union types used across apps and packages live here
 * so there is a single authoritative definition per concept.
 */

// ---------------------------------------------------------------------------
// Project status
// ---------------------------------------------------------------------------

export const PROJECT_STATUSES = [
  'draft',
  'active',
  'on-hold',
  'complete',
  'cancelled',
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

// ---------------------------------------------------------------------------
// Approval / workflow status
// ---------------------------------------------------------------------------

export const APPROVAL_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'requires-review',
] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

// ---------------------------------------------------------------------------
// Risk level
// ---------------------------------------------------------------------------

export const RISK_LEVELS = ['low', 'medium', 'high', 'critical'] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

// ---------------------------------------------------------------------------
// Trade categories (construction)
// ---------------------------------------------------------------------------

export const TRADE_CATEGORIES = [
  'general-contractor',
  'electrical',
  'plumbing',
  'mechanical',
  'structural',
  'civil',
  'roofing',
  'finishes',
  'landscaping',
  'other',
] as const;

export type TradeCategory = (typeof TRADE_CATEGORIES)[number];

// ---------------------------------------------------------------------------
// Funding / deal types
// ---------------------------------------------------------------------------

export const FUNDING_TYPES = [
  'conventional-loan',
  'bridge-loan',
  'hard-money',
  'mezzanine',
  'equity',
  'grant',
  'tax-credit',
  'bond',
  'other',
] as const;

export type FundingType = (typeof FUNDING_TYPES)[number];

// ---------------------------------------------------------------------------
// Document types
// ---------------------------------------------------------------------------

export const DOCUMENT_TYPES = [
  'contract',
  'permit',
  'insurance-certificate',
  'lien-waiver',
  'change-order',
  'rfi',
  'submittal',
  'pay-application',
  'inspection-report',
  'environmental-report',
  'title-report',
  'appraisal',
  'financial-statement',
  'other',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

// ---------------------------------------------------------------------------
// Compliance / code references
// ---------------------------------------------------------------------------

export const CODE_JURISDICTIONS = [
  'international-building-code',
  'international-residential-code',
  'nfpa',
  'local-amendment',
  'state-amendment',
  'ada',
  'osha',
  'other',
] as const;

export type CodeJurisdiction = (typeof CODE_JURISDICTIONS)[number];

// ---------------------------------------------------------------------------
// Agent / MCP roles
// ---------------------------------------------------------------------------

export const AGENT_ROLES = [
  'estimator',
  'compliance-checker',
  'funding-analyst',
  'contractor-screener',
  'rag-query',
  'human-review',
] as const;

export type AgentRole = (typeof AGENT_ROLES)[number];
