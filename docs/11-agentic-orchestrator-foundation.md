# Agentic Orchestrator Foundation

## Purpose
Define a typed, safety-first orchestration layer that coordinates agents, tools, validation, simulation, and RAG while preserving Project Control guardrails.

## Scope
- Agent registry with explicit role and tool allowlists.
- Tool registry with side-effect classification.
- Task manifest contract for deterministic orchestration requests.
- Approval gate model for human-in-the-loop safety.
- Validation pipeline model to enforce pre-execution checks.
- Simulation and RAG adapter interfaces for extensibility.
- Project-control enforcement hooks for gated execution.

## Architecture

### 1) Registries
The orchestrator runtime stores canonical registries for:
- Agents
- Tools
- Project-control hooks
- Validation pipelines
- Simulation adapters
- RAG adapters

Each registry is keyed by stable IDs. Duplicate IDs are rejected during registry construction.

### 2) Task Manifest
Every orchestration request must provide:
- Owner agent
- Tool IDs
- Task kind (`analysis`, `execution`, `validation`, `documentation`, `simulation`, `rag`)
- Validation profile ID
- Approval requirement marker

This prevents ad hoc execution payloads and supports deterministic policy evaluation.

### 3) Risk Resolution + Approval Gate
Risk is resolved from either:
- an explicit task risk level, or
- inferred maximum risk from tool side-effects (`read`, `write`, `critical`).

Approval gate policy enforces:
- high-risk requires a human approver role,
- critical side-effects require a human approver role,
- explicit task-level human approval requirements.

### 4) Project Control Enforcement Hooks
Before execution, the orchestrator evaluates project-control hooks when any selected tool requires it.
If any hook fails, execution is blocked.

This is the enforcement bridge between orchestration and existing Project Control guardrails.

### 5) Validation Pipeline Model
A task references a validation profile.
The orchestrator resolves only checks applicable to that task kind.

This allows:
- consistent, type-safe validation ordering,
- extension by domain-specific checks,
- alignment with CI and local validation flows.

### 6) Simulation and RAG Adapters
Typed adapter interfaces provide extension points without coupling the orchestrator to specific providers.
- Simulation adapter: scenario execution + confidence result.
- RAG adapter: query + citation-bearing answer.

## Safe Execution Model
Execution is allowed only when all are true:
1. Owner agent exists.
2. Agent allowlist permits all requested tools.
3. Project-control hooks pass.
4. Approval gate policy is satisfied.
5. Validation pipeline exists and can resolve checks.

If any condition fails, the orchestrator returns a denial decision with a reason.

## Testing Coverage
The orchestrator foundation test suite covers:
- duplicate registry rejection,
- risk resolution,
- approval gate decisions,
- validation check resolution,
- simulation/RAG adapter selection,
- execution denials for unauthorized/unsafe states,
- successful execution planning under compliant conditions.

## Status
🟢 Typed orchestration foundation implemented in API module with guardrail-preserving behavior.