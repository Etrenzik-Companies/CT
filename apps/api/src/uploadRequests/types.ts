// -- Upload Requests -- Types ------------------------------------------------

export const UPLOAD_REQUEST_CATEGORIES = [
  "contractor",
  "trade",
  "funding",
  "pof",
  "rwa",
  "esg",
  "incentives",
  "tax",
  "legal",
  "code_compliance",
  "permits",
  "lender",
  "insurance",
  "title",
  "appraisal",
  "utility",
  "other",
] as const;
export type UploadRequestCategory = (typeof UPLOAD_REQUEST_CATEGORIES)[number];

export const UPLOAD_REQUEST_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export type UploadRequestPriority = (typeof UPLOAD_REQUEST_PRIORITIES)[number];

export const UPLOAD_REQUEST_STATUSES = ["open", "in_progress", "waiting_review", "completed", "blocked"] as const;
export type UploadRequestStatus = (typeof UPLOAD_REQUEST_STATUSES)[number];

export interface UploadRequestRequirement {
  requirementId: string;
  label: string;
  required: boolean;
  targetModules: string[];
}

export interface UploadRequestChecklist {
  category: UploadRequestCategory;
  requirements: UploadRequestRequirement[];
}

export interface UploadRequest {
  requestId: string;
  category: UploadRequestCategory;
  priority: UploadRequestPriority;
  status: UploadRequestStatus;
  linkedModules: string[];
  requirements: UploadRequestRequirement[];
}

export interface UploadRequestResult {
  request: UploadRequest;
  missingBlockers: UploadRequestRequirement[];
  optionalRequests: UploadRequestRequirement[];
  nextBestActions: string[];
  secretRequestViolations: string[];
}
