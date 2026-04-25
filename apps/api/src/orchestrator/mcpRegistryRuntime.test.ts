import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  classifyCommandRisk,
  createMcpRuntimeRegistry,
  evaluateMcpApproval,
  runMcpToolSafely
} from "./mcpRegistryRuntime.js";

describe("MCP tool registry runtime", () => {
  it("1. Classifies command risk consistently", () => {
    assert.equal(classifyCommandRisk("read-only"), "low");
    assert.equal(classifyCommandRisk("write"), "medium");
    assert.equal(classifyCommandRisk("external-network"), "medium");
    assert.equal(classifyCommandRisk("destructive"), "high");
    assert.equal(classifyCommandRisk("deploy"), "high");
  });

  it("2. Allows read-only tool when actor is permitted", async () => {
    const registry = createMcpRuntimeRegistry({
      tools: [
        {
          id: "tool-status-read",
          name: "Status Read",
          commandClass: "read-only",
          validationHookIds: [],
          requiresProjectControlHook: false,
          execute: async () => ({ ok: true })
        }
      ],
      validationHooks: []
    });

    const result = await runMcpToolSafely({
      toolId: "tool-status-read",
      registry,
      context: {
        actorRole: "executor",
        allowedToolIds: ["tool-status-read"],
        payload: {}
      },
      policy: {
        approverRoles: ["human_approver"],
        requiresHumanFor: ["destructive", "deploy"]
      }
    });

    assert.equal(result.status, "allowed");
    assert.deepEqual(result.result, { ok: true });
  });

  it("3. Blocks tool call when tool is not in actor allowlist", async () => {
    const registry = createMcpRuntimeRegistry({
      tools: [
        {
          id: "tool-write-record",
          name: "Write Record",
          commandClass: "write",
          validationHookIds: [],
          requiresProjectControlHook: false,
          execute: async () => ({ ok: true })
        }
      ],
      validationHooks: []
    });

    const result = await runMcpToolSafely({
      toolId: "tool-write-record",
      registry,
      context: {
        actorRole: "executor",
        allowedToolIds: [],
        payload: {}
      },
      policy: {
        approverRoles: ["human_approver"],
        requiresHumanFor: ["destructive", "deploy"]
      }
    });

    assert.equal(result.status, "blocked");
    assert.match(result.reason, /not allowed/);
  });

  it("4. Returns approval-required for destructive command without approver", async () => {
    const registry = createMcpRuntimeRegistry({
      tools: [
        {
          id: "tool-db-drop",
          name: "Drop Data",
          commandClass: "destructive",
          validationHookIds: [],
          requiresProjectControlHook: false,
          execute: async () => ({ ok: true })
        }
      ],
      validationHooks: []
    });

    const result = await runMcpToolSafely({
      toolId: "tool-db-drop",
      registry,
      context: {
        actorRole: "executor",
        allowedToolIds: ["tool-db-drop"],
        payload: {}
      },
      policy: {
        approverRoles: ["human_approver"],
        requiresHumanFor: ["destructive", "deploy", "external-network"]
      }
    });

    assert.equal(result.status, "approval-required");
  });

  it("5. Allows destructive command when human approval is provided", async () => {
    const registry = createMcpRuntimeRegistry({
      tools: [
        {
          id: "tool-db-drop",
          name: "Drop Data",
          commandClass: "destructive",
          validationHookIds: [],
          requiresProjectControlHook: false,
          execute: async () => ({ dropped: true })
        }
      ],
      validationHooks: []
    });

    const result = await runMcpToolSafely({
      toolId: "tool-db-drop",
      registry,
      context: {
        actorRole: "executor",
        approvedByRole: "human_approver",
        allowedToolIds: ["tool-db-drop"],
        payload: {}
      },
      policy: {
        approverRoles: ["human_approver"],
        requiresHumanFor: ["destructive", "deploy", "external-network"]
      }
    });

    assert.equal(result.status, "allowed");
    assert.deepEqual(result.result, { dropped: true });
  });

  it("6. Blocks execution when validation hook fails", async () => {
    const registry = createMcpRuntimeRegistry({
      tools: [
        {
          id: "tool-http-call",
          name: "HTTP Call",
          commandClass: "external-network",
          validationHookIds: ["hook-target-whitelist"],
          requiresProjectControlHook: false,
          execute: async () => ({ ok: true })
        }
      ],
      validationHooks: [
        {
          id: "hook-target-whitelist",
          run: ({ payload }) => {
            const target = String(payload.target ?? "");
            if (!target.startsWith("https://api.etrenzik.com")) {
              return { ok: false, reason: "target host is not allowlisted" };
            }
            return { ok: true, reason: "allowlisted" };
          }
        }
      ]
    });

    const result = await runMcpToolSafely({
      toolId: "tool-http-call",
      registry,
      context: {
        actorRole: "executor",
        allowedToolIds: ["tool-http-call"],
        payload: { target: "https://malicious.example" }
      },
      policy: {
        approverRoles: ["human_approver"],
        requiresHumanFor: ["destructive", "deploy", "external-network"]
      }
    });

    assert.equal(result.status, "blocked");
    assert.match(result.reason, /allowlisted/);
  });

  it("7. Blocks execution when project-control hook denies write tool", async () => {
    const registry = createMcpRuntimeRegistry({
      tools: [
        {
          id: "tool-permit-submit",
          name: "Permit Submit",
          commandClass: "write",
          validationHookIds: [],
          requiresProjectControlHook: true,
          execute: async () => ({ submitted: true })
        }
      ],
      validationHooks: []
    });

    const result = await runMcpToolSafely({
      toolId: "tool-permit-submit",
      registry,
      context: {
        actorRole: "executor",
        allowedToolIds: ["tool-permit-submit"],
        payload: {}
      },
      policy: {
        approverRoles: ["human_approver"],
        requiresHumanFor: ["destructive", "deploy", "external-network"]
      },
      projectControlHook: {
        run: () => ({ ok: false, reason: "missing permit evidence artifact" })
      }
    });

    assert.equal(result.status, "blocked");
    assert.match(result.reason, /project-control/);
  });

  it("8. Approval evaluator marks external-network tools as approval-required by policy", () => {
    const decision = evaluateMcpApproval({
      tool: {
        id: "tool-http-call",
        name: "HTTP Call",
        commandClass: "external-network",
        validationHookIds: [],
        requiresProjectControlHook: false,
        execute: async () => ({ ok: true })
      },
      context: {
        actorRole: "executor",
        allowedToolIds: ["tool-http-call"],
        payload: {}
      },
      policy: {
        approverRoles: ["human_approver"],
        requiresHumanFor: ["external-network"]
      }
    });

    assert.equal(decision.approved, false);
    assert.equal(decision.requiresHumanApproval, true);
  });
});