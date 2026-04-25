export type AgentRole = "planner" | "executor" | "validator" | "documenter" | "operator";

export type TaskKind = "analysis" | "execution" | "validation" | "documentation" | "simulation" | "rag";

export type TaskRiskLevel = "low" | "medium" | "high";

export type SideEffectLevel = "read" | "write" | "critical";

export interface AgentDefinition {
  id: string;
  name: string;
  role: AgentRole;
  allowedTools: string[];
  canApproveHighRisk: boolean;
}

export interface ToolDefinition {
  id: string;
  name: string;
  sideEffectLevel: SideEffectLevel;
  requiresProjectControlHook: boolean;
}

export interface TaskManifest {
  id: string;
  title: string;
  kind: TaskKind;
  requestedBy: string;
  ownerAgentId: string;
  toolIds: string[];
  explicitRiskLevel?: TaskRiskLevel;
  requiresHumanApproval: boolean;
  validationProfileId: string;
}

export interface ProjectControlHookResult {
  ok: boolean;
  reason: string;
}

export interface ProjectControlHookContext {
  task: TaskManifest;
  tools: ToolDefinition[];
}

export interface ProjectControlHook {
  id: string;
  description: string;
  run: (context: ProjectControlHookContext) => ProjectControlHookResult;
}

export interface ApprovalGatePolicy {
  humanApproverRoles: string[];
  highRiskRequiresHuman: boolean;
  criticalSideEffectsRequireHuman: boolean;
}

export interface ApprovalGateInput {
  task: TaskManifest;
  resolvedRiskLevel: TaskRiskLevel;
  tools: ToolDefinition[];
  actorRole: string;
}

export interface ApprovalGateDecision {
  approved: boolean;
  requiresHumanApproval: boolean;
  reason: string;
}

export interface ValidationCheck {
  id: string;
  title: string;
  appliesToKinds: TaskKind[];
}

export interface ValidationPipeline {
  id: string;
  checks: ValidationCheck[];
}

export interface SimulationInput {
  scenario: string;
  parameters: Record<string, string | number | boolean>;
}

export interface SimulationResult {
  summary: string;
  confidence: number;
}

export interface SimulationAdapter {
  id: string;
  runScenario: (input: SimulationInput) => Promise<SimulationResult>;
}

export interface RagQuery {
  text: string;
  topK: number;
}

export interface RagResult {
  answer: string;
  citations: Array<{ sourceId: string; chunkId: string }>;
}

export interface RagAdapter {
  id: string;
  query: (input: RagQuery) => Promise<RagResult>;
}

export interface OrchestratorRegistry {
  agents: Record<string, AgentDefinition>;
  tools: Record<string, ToolDefinition>;
  projectControlHooks: Record<string, ProjectControlHook>;
  validationPipelines: Record<string, ValidationPipeline>;
  simulationAdapters: Record<string, SimulationAdapter>;
  ragAdapters: Record<string, RagAdapter>;
}

export interface ExecutionDecision {
  canExecute: boolean;
  reason: string;
  resolvedRiskLevel: TaskRiskLevel;
  requiresHumanApproval: boolean;
  requiredChecks: ValidationCheck[];
}