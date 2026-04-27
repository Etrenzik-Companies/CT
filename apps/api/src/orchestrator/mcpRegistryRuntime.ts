export type McpCommandClass = "read-only" | "write" | "destructive" | "deploy" | "external-network";

export interface McpToolRuntimeDefinition {
  id: string;
  name: string;
  commandClass: McpCommandClass;
  validationHookIds: string[];
  requiresProjectControlHook: boolean;
  execute: (input: { payload: Record<string, unknown> }) => Promise<unknown>;
}

export interface McpValidationHook {
  id: string;
  run: (input: {
    tool: McpToolRuntimeDefinition;
    payload: Record<string, unknown>;
  }) => { ok: boolean; reason: string };
}

export interface McpRuntimeRegistry {
  tools: Record<string, McpToolRuntimeDefinition>;
  validationHooks: Record<string, McpValidationHook>;
}

export interface McpApprovalPolicy {
  approverRoles: string[];
  requiresHumanFor: McpCommandClass[];
}

export interface McpExecutionContext {
  actorRole: string;
  approvedByRole?: string;
  allowedToolIds: string[];
  payload: Record<string, unknown>;
}

export interface McpProjectControlHook {
  run: (input: {
    tool: McpToolRuntimeDefinition;
    context: McpExecutionContext;
  }) => { ok: boolean; reason: string };
}

export interface McpRunResult {
  status: "allowed" | "blocked" | "approval-required";
  reason: string;
  result?: unknown;
}

export function createMcpRuntimeRegistry(input: {
  tools: McpToolRuntimeDefinition[];
  validationHooks: McpValidationHook[];
}): McpRuntimeRegistry {
  const tools: Record<string, McpToolRuntimeDefinition> = {};
  const validationHooks: Record<string, McpValidationHook> = {};

  for (const tool of input.tools) {
    if (tools[tool.id]) {
      throw new Error(`Duplicate MCP tool id: ${tool.id}`);
    }
    tools[tool.id] = tool;
  }

  for (const hook of input.validationHooks) {
    if (validationHooks[hook.id]) {
      throw new Error(`Duplicate MCP validation hook id: ${hook.id}`);
    }
    validationHooks[hook.id] = hook;
  }

  return {
    tools,
    validationHooks
  };
}

export function classifyCommandRisk(commandClass: McpCommandClass): "low" | "medium" | "high" {
  switch (commandClass) {
    case "read-only":
      return "low";
    case "write":
    case "external-network":
      return "medium";
    case "destructive":
    case "deploy":
      return "high";
  }
}

export function evaluateMcpApproval(input: {
  tool: McpToolRuntimeDefinition;
  context: McpExecutionContext;
  policy: McpApprovalPolicy;
}): { approved: boolean; requiresHumanApproval: boolean; reason: string } {
  const needsHuman = input.policy.requiresHumanFor.includes(input.tool.commandClass);

  if (!needsHuman) {
    return {
      approved: true,
      requiresHumanApproval: false,
      reason: "approval not required"
    };
  }

  const approverRole = input.context.approvedByRole ?? "";
  if (!input.policy.approverRoles.includes(approverRole)) {
    return {
      approved: false,
      requiresHumanApproval: true,
      reason: `${input.tool.commandClass} command requires human approval`
    };
  }

  return {
    approved: true,
    requiresHumanApproval: true,
    reason: "human approval satisfied"
  };
}

export async function runMcpToolSafely(input: {
  toolId: string;
  registry: McpRuntimeRegistry;
  context: McpExecutionContext;
  policy: McpApprovalPolicy;
  projectControlHook?: McpProjectControlHook;
}): Promise<McpRunResult> {
  const tool = input.registry.tools[input.toolId];
  if (!tool) {
    return {
      status: "blocked",
      reason: `unknown MCP tool: ${input.toolId}`
    };
  }

  if (!input.context.allowedToolIds.includes(tool.id)) {
    return {
      status: "blocked",
      reason: `tool not allowed for actor role ${input.context.actorRole}`
    };
  }

  for (const hookId of tool.validationHookIds) {
    const hook = input.registry.validationHooks[hookId];
    if (!hook) {
      return {
        status: "blocked",
        reason: `missing validation hook: ${hookId}`
      };
    }

    const result = hook.run({
      tool,
      payload: input.context.payload
    });
    if (!result.ok) {
      return {
        status: "blocked",
        reason: `${hook.id}: ${result.reason}`
      };
    }
  }

  if (tool.requiresProjectControlHook) {
    if (!input.projectControlHook) {
      return {
        status: "blocked",
        reason: "project-control hook required but missing"
      };
    }

    const hookResult = input.projectControlHook.run({
      tool,
      context: input.context
    });
    if (!hookResult.ok) {
      return {
        status: "blocked",
        reason: `project-control: ${hookResult.reason}`
      };
    }
  }

  const approval = evaluateMcpApproval({
    tool,
    context: input.context,
    policy: input.policy
  });

  if (!approval.approved) {
    return {
      status: "approval-required",
      reason: approval.reason
    };
  }

  const result = await tool.execute({ payload: input.context.payload });

  return {
    status: "allowed",
    reason: "execution completed",
    result
  };
}