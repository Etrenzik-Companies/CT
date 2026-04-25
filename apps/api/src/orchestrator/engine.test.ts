import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildExecutionDecision,
  createOrchestratorRegistry,
  evaluateApprovalGate,
  resolveTaskRiskLevel,
  resolveValidationChecks,
  selectExecutionAdapters
} from "./engine.js";
import { ApprovalGatePolicy, TaskManifest } from "./types.js";

const basePolicy: ApprovalGatePolicy = {
  humanApproverRoles: ["human_approver", "admin"],
  highRiskRequiresHuman: true,
  criticalSideEffectsRequireHuman: true
};

const baseTask: TaskManifest = {
  id: "task-1",
  title: "Run orchestrator validation",
  kind: "validation",
  requestedBy: "ops",
  ownerAgentId: "agent-validator",
  toolIds: ["tool-read"],
  requiresHumanApproval: false,
  validationProfileId: "pipeline-standard"
};

describe("orchestrator foundation", () => {
  it("1. Duplicate registry ids are rejected", () => {
    assert.throws(
      () => createOrchestratorRegistry({
        agents: [
          { id: "a1", name: "A", role: "validator", allowedTools: [], canApproveHighRisk: false },
          { id: "a1", name: "B", role: "validator", allowedTools: [], canApproveHighRisk: false }
        ],
        tools: [],
        projectControlHooks: [],
        validationPipelines: [],
        simulationAdapters: [],
        ragAdapters: []
      }),
      /Duplicate id/
    );
  });

  it("2. Risk level resolves from side effects when explicit risk absent", () => {
    const risk = resolveTaskRiskLevel(baseTask, [
      { id: "tool-read", name: "Read", sideEffectLevel: "read", requiresProjectControlHook: false },
      { id: "tool-write", name: "Write", sideEffectLevel: "write", requiresProjectControlHook: true }
    ]);
    assert.equal(risk, "medium");
  });

  it("3. High-risk task requires human approval for non-human actor", () => {
    const decision = evaluateApprovalGate(
      {
        task: { ...baseTask, explicitRiskLevel: "high" },
        resolvedRiskLevel: "high",
        tools: [{ id: "tool-read", name: "Read", sideEffectLevel: "read", requiresProjectControlHook: false }],
        actorRole: "agent"
      },
      basePolicy
    );
    assert.equal(decision.approved, false);
    assert.equal(decision.requiresHumanApproval, true);
  });

  it("4. Human approver can approve high-risk task", () => {
    const decision = evaluateApprovalGate(
      {
        task: { ...baseTask, explicitRiskLevel: "high" },
        resolvedRiskLevel: "high",
        tools: [{ id: "tool-read", name: "Read", sideEffectLevel: "read", requiresProjectControlHook: false }],
        actorRole: "human_approver"
      },
      basePolicy
    );
    assert.equal(decision.approved, true);
  });

  it("5. Validation pipeline resolves only applicable checks", () => {
    const checks = resolveValidationChecks(baseTask, {
      id: "pipeline-standard",
      checks: [
        { id: "check-typecheck", title: "Typecheck", appliesToKinds: ["validation", "execution"] },
        { id: "check-rag-citations", title: "RAG citations", appliesToKinds: ["rag"] }
      ]
    });
    assert.equal(checks.length, 1);
    assert.equal(checks[0]?.id, "check-typecheck");
  });

  it("6. Adapter selection returns simulation adapter for simulation tasks", () => {
    const registry = createOrchestratorRegistry({
      agents: [],
      tools: [],
      projectControlHooks: [],
      validationPipelines: [],
      simulationAdapters: [{ id: "sim-1", runScenario: async () => ({ summary: "ok", confidence: 0.8 }) }],
      ragAdapters: []
    });

    const adapters = selectExecutionAdapters({ ...baseTask, kind: "simulation" }, registry);
    assert.equal(adapters.simulationAdapterId, "sim-1");
    assert.equal(adapters.ragAdapterId, null);
  });

  it("7. Adapter selection returns rag adapter for rag tasks", () => {
    const registry = createOrchestratorRegistry({
      agents: [],
      tools: [],
      projectControlHooks: [],
      validationPipelines: [],
      simulationAdapters: [],
      ragAdapters: [{ id: "rag-1", query: async () => ({ answer: "ok", citations: [] }) }]
    });

    const adapters = selectExecutionAdapters({ ...baseTask, kind: "rag" }, registry);
    assert.equal(adapters.simulationAdapterId, null);
    assert.equal(adapters.ragAdapterId, "rag-1");
  });

  it("8. Execution decision blocks unknown agent", () => {
    const registry = createOrchestratorRegistry({
      agents: [],
      tools: [{ id: "tool-read", name: "Read", sideEffectLevel: "read", requiresProjectControlHook: false }],
      projectControlHooks: [],
      validationPipelines: [{ id: "pipeline-standard", checks: [] }],
      simulationAdapters: [],
      ragAdapters: []
    });

    const decision = buildExecutionDecision({
      task: baseTask,
      actorRole: "agent",
      registry,
      policy: basePolicy
    });
    assert.equal(decision.canExecute, false);
    assert.match(decision.reason, /owner agent not found/);
  });

  it("9. Execution decision blocks tool outside agent allowlist", () => {
    const registry = createOrchestratorRegistry({
      agents: [
        {
          id: "agent-validator",
          name: "Validator",
          role: "validator",
          allowedTools: ["tool-read"],
          canApproveHighRisk: false
        }
      ],
      tools: [
        { id: "tool-read", name: "Read", sideEffectLevel: "read", requiresProjectControlHook: false },
        { id: "tool-write", name: "Write", sideEffectLevel: "write", requiresProjectControlHook: true }
      ],
      projectControlHooks: [],
      validationPipelines: [{ id: "pipeline-standard", checks: [] }],
      simulationAdapters: [],
      ragAdapters: []
    });

    const decision = buildExecutionDecision({
      task: { ...baseTask, toolIds: ["tool-write"] },
      actorRole: "agent",
      registry,
      policy: basePolicy
    });
    assert.equal(decision.canExecute, false);
    assert.match(decision.reason, /is not allowed to use tool/);
  });

  it("10. Execution decision blocks when project-control hook fails", () => {
    const registry = createOrchestratorRegistry({
      agents: [
        {
          id: "agent-validator",
          name: "Validator",
          role: "validator",
          allowedTools: ["tool-write"],
          canApproveHighRisk: false
        }
      ],
      tools: [{ id: "tool-write", name: "Write", sideEffectLevel: "write", requiresProjectControlHook: true }],
      projectControlHooks: [
        {
          id: "hook-project-control",
          description: "Project control enforcement",
          run: () => ({ ok: false, reason: "missing project approval artifact" })
        }
      ],
      validationPipelines: [{ id: "pipeline-standard", checks: [] }],
      simulationAdapters: [],
      ragAdapters: []
    });

    const decision = buildExecutionDecision({
      task: { ...baseTask, toolIds: ["tool-write"] },
      actorRole: "agent",
      registry,
      policy: basePolicy
    });
    assert.equal(decision.canExecute, false);
    assert.match(decision.reason, /missing project approval artifact/);
  });

  it("11. Execution decision blocks high-risk task without human role", () => {
    const registry = createOrchestratorRegistry({
      agents: [
        {
          id: "agent-validator",
          name: "Validator",
          role: "validator",
          allowedTools: ["tool-critical"],
          canApproveHighRisk: false
        }
      ],
      tools: [{ id: "tool-critical", name: "Deploy", sideEffectLevel: "critical", requiresProjectControlHook: false }],
      projectControlHooks: [],
      validationPipelines: [{ id: "pipeline-standard", checks: [] }],
      simulationAdapters: [],
      ragAdapters: []
    });

    const decision = buildExecutionDecision({
      task: { ...baseTask, toolIds: ["tool-critical"] },
      actorRole: "agent",
      registry,
      policy: basePolicy
    });
    assert.equal(decision.canExecute, false);
    assert.equal(decision.requiresHumanApproval, true);
  });

  it("12. Execution decision succeeds with checks when gate and hooks pass", () => {
    const registry = createOrchestratorRegistry({
      agents: [
        {
          id: "agent-validator",
          name: "Validator",
          role: "validator",
          allowedTools: ["tool-read"],
          canApproveHighRisk: false
        }
      ],
      tools: [{ id: "tool-read", name: "Read", sideEffectLevel: "read", requiresProjectControlHook: false }],
      projectControlHooks: [
        {
          id: "hook-project-control",
          description: "Project control enforcement",
          run: () => ({ ok: true, reason: "approved" })
        }
      ],
      validationPipelines: [
        {
          id: "pipeline-standard",
          checks: [
            { id: "check-typecheck", title: "Typecheck", appliesToKinds: ["validation"] },
            { id: "check-rag-citations", title: "RAG citations", appliesToKinds: ["rag"] }
          ]
        }
      ],
      simulationAdapters: [],
      ragAdapters: []
    });

    const decision = buildExecutionDecision({
      task: baseTask,
      actorRole: "agent",
      registry,
      policy: basePolicy
    });

    assert.equal(decision.canExecute, true);
    assert.equal(decision.requiredChecks.length, 1);
    assert.equal(decision.requiredChecks[0]?.id, "check-typecheck");
  });
});