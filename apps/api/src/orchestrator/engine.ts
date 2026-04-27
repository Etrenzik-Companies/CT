import {
  AgentDefinition,
  ApprovalGateDecision,
  ApprovalGateInput,
  ApprovalGatePolicy,
  ExecutionDecision,
  OrchestratorRegistry,
  ProjectControlHook,
  RagAdapter,
  SimulationAdapter,
  SideEffectLevel,
  TaskManifest,
  TaskRiskLevel,
  ToolDefinition,
  ValidationCheck,
  ValidationPipeline
} from "./types.js";

function toRecord<T extends { id: string }>(items: T[]): Record<string, T> {
  const record: Record<string, T> = {};
  for (const item of items) {
    if (record[item.id]) {
      throw new Error(`Duplicate id in registry: ${item.id}`);
    }
    record[item.id] = item;
  }
  return record;
}

export function createOrchestratorRegistry(input: {
  agents: AgentDefinition[];
  tools: ToolDefinition[];
  projectControlHooks: ProjectControlHook[];
  validationPipelines: ValidationPipeline[];
  simulationAdapters: SimulationAdapter[];
  ragAdapters: RagAdapter[];
}): OrchestratorRegistry {
  return {
    agents: toRecord(input.agents),
    tools: toRecord(input.tools),
    projectControlHooks: toRecord(input.projectControlHooks),
    validationPipelines: toRecord(input.validationPipelines),
    simulationAdapters: toRecord(input.simulationAdapters),
    ragAdapters: toRecord(input.ragAdapters)
  };
}

function riskFromSideEffect(level: SideEffectLevel): TaskRiskLevel {
  if (level === "critical") return "high";
  if (level === "write") return "medium";
  return "low";
}

function maxRisk(a: TaskRiskLevel, b: TaskRiskLevel): TaskRiskLevel {
  const order: Record<TaskRiskLevel, number> = { low: 0, medium: 1, high: 2 };
  return order[a] >= order[b] ? a : b;
}

export function resolveTaskRiskLevel(task: TaskManifest, tools: ToolDefinition[]): TaskRiskLevel {
  if (task.explicitRiskLevel) {
    return task.explicitRiskLevel;
  }

  let resolved: TaskRiskLevel = "low";
  for (const tool of tools) {
    resolved = maxRisk(resolved, riskFromSideEffect(tool.sideEffectLevel));
  }
  return resolved;
}

export function evaluateApprovalGate(input: ApprovalGateInput, policy: ApprovalGatePolicy): ApprovalGateDecision {
  const hasCriticalTool = input.tools.some((tool) => tool.sideEffectLevel === "critical");
  const actorCanApproveHighRisk = policy.humanApproverRoles.includes(input.actorRole);

  if (input.task.requiresHumanApproval) {
    return {
      approved: actorCanApproveHighRisk,
      requiresHumanApproval: true,
      reason: actorCanApproveHighRisk ? "human approval satisfied" : "task explicitly requires human approval"
    };
  }

  if (policy.highRiskRequiresHuman && input.resolvedRiskLevel === "high") {
    return {
      approved: actorCanApproveHighRisk,
      requiresHumanApproval: true,
      reason: actorCanApproveHighRisk ? "high-risk human approval satisfied" : "high-risk task requires human approval"
    };
  }

  if (policy.criticalSideEffectsRequireHuman && hasCriticalTool) {
    return {
      approved: actorCanApproveHighRisk,
      requiresHumanApproval: true,
      reason: actorCanApproveHighRisk
        ? "critical side-effect human approval satisfied"
        : "critical side-effect tool requires human approval"
    };
  }

  return {
    approved: true,
    requiresHumanApproval: false,
    reason: "approval not required"
  };
}

export function enforceProjectControlHooks(task: TaskManifest, tools: ToolDefinition[], hooks: ProjectControlHook[]): {
  ok: boolean;
  reason: string;
} {
  const requiredHooks = hooks.filter((_hook) =>
    tools.some((tool) => tool.requiresProjectControlHook)
  );

  for (const hook of requiredHooks) {
    const result = hook.run({ task, tools });
    if (!result.ok) {
      return { ok: false, reason: `${hook.id}: ${result.reason}` };
    }
  }

  return { ok: true, reason: "project-control hooks passed" };
}

export function resolveValidationChecks(task: TaskManifest, pipeline: ValidationPipeline): ValidationCheck[] {
  return pipeline.checks.filter((check) => check.appliesToKinds.includes(task.kind));
}

export function resolveTaskTools(task: TaskManifest, registry: OrchestratorRegistry): ToolDefinition[] {
  return task.toolIds.map((toolId) => {
    const tool = registry.tools[toolId];
    if (!tool) {
      throw new Error(`Unknown tool id: ${toolId}`);
    }
    return tool;
  });
}

export function selectExecutionAdapters(task: TaskManifest, registry: OrchestratorRegistry): {
  simulationAdapterId: string | null;
  ragAdapterId: string | null;
} {
  const firstSimulationAdapter = Object.values(registry.simulationAdapters)[0] ?? null;
  const firstRagAdapter = Object.values(registry.ragAdapters)[0] ?? null;

  return {
    simulationAdapterId: task.kind === "simulation" ? firstSimulationAdapter?.id ?? null : null,
    ragAdapterId: task.kind === "rag" ? firstRagAdapter?.id ?? null : null
  };
}

export function buildExecutionDecision(input: {
  task: TaskManifest;
  actorRole: string;
  registry: OrchestratorRegistry;
  policy: ApprovalGatePolicy;
}): ExecutionDecision {
  const agent = input.registry.agents[input.task.ownerAgentId];
  if (!agent) {
    return {
      canExecute: false,
      reason: "owner agent not found",
      resolvedRiskLevel: "low",
      requiresHumanApproval: false,
      requiredChecks: []
    };
  }

  const tools = resolveTaskTools(input.task, input.registry);

  for (const tool of tools) {
    if (!agent.allowedTools.includes(tool.id)) {
      return {
        canExecute: false,
        reason: `agent ${agent.id} is not allowed to use tool ${tool.id}`,
        resolvedRiskLevel: "low",
        requiresHumanApproval: false,
        requiredChecks: []
      };
    }
  }

  const hookResult = enforceProjectControlHooks(
    input.task,
    tools,
    Object.values(input.registry.projectControlHooks)
  );
  if (!hookResult.ok) {
    return {
      canExecute: false,
      reason: hookResult.reason,
      resolvedRiskLevel: "low",
      requiresHumanApproval: false,
      requiredChecks: []
    };
  }

  const resolvedRiskLevel = resolveTaskRiskLevel(input.task, tools);
  const approval = evaluateApprovalGate(
    {
      task: input.task,
      resolvedRiskLevel,
      tools,
      actorRole: input.actorRole
    },
    input.policy
  );
  if (!approval.approved) {
    return {
      canExecute: false,
      reason: approval.reason,
      resolvedRiskLevel,
      requiresHumanApproval: approval.requiresHumanApproval,
      requiredChecks: []
    };
  }

  const pipeline = input.registry.validationPipelines[input.task.validationProfileId];
  if (!pipeline) {
    return {
      canExecute: false,
      reason: `validation pipeline not found: ${input.task.validationProfileId}`,
      resolvedRiskLevel,
      requiresHumanApproval: approval.requiresHumanApproval,
      requiredChecks: []
    };
  }

  const requiredChecks = resolveValidationChecks(input.task, pipeline);

  return {
    canExecute: true,
    reason: "execution allowed",
    resolvedRiskLevel,
    requiresHumanApproval: approval.requiresHumanApproval,
    requiredChecks
  };
}