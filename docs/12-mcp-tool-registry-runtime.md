# MCP Tool Registry Runtime

## Purpose
Define the runtime safety layer that connects orchestrator decisions to executable MCP tools without granting uncontrolled agent power.

## Scope
- Runtime-safe MCP tool definitions.
- Command classification for risk-aware policy enforcement.
- Human approval requirements for high-risk command classes.
- Validation hooks before tool execution.
- Project-control hook integration before side effects.
- Deterministic outcomes for allow, block, and approval-required states.

## Runtime Model

### Tool Definition Contract
Each MCP tool includes:
- stable tool ID
- command class
- validation hook IDs
- project-control hook requirement marker
- async execution handler

This prevents ad hoc tool calls and enforces a consistent decision flow.

### Command Classification
Runtime command classes:
- read-only
- write
- destructive
- deploy
- external-network

Risk mapping:
- low: read-only
- medium: write, external-network
- high: destructive, deploy

### Approval Policy
Approval policy is declarative:
- approver roles list
- command classes that require human approval

If a command class is listed as requiring approval and no valid approver role is provided, runtime returns approval-required instead of executing.

### Validation Hooks
Tools can reference one or more validation hooks.
Examples:
- URL allowlist validation for external-network tools
- payload schema and invariant checks
- prohibited target checks

Any failing validation hook blocks execution before side effects.

### Project Control Hook
Tools marked as requiring project-control validation must pass project-control hook evaluation before execution.
If missing or denied, execution is blocked.

This keeps orchestrator and Project Control guardrails coupled at runtime.

## Execution Outcomes
Runtime returns one of three states:
- allowed
- blocked
- approval-required

Each outcome includes a reason string for auditability and operator review.

## Test Coverage
The MCP runtime test suite validates:
- risk classification
- allowed execution path
- blocked path for role/tool allowlist violations
- approval-required path for destructive and external-network commands
- approval-satisfied execution path
- validation hook denial path
- project-control hook denial path

## Integration Notes
The orchestrator should invoke MCP runtime only after task-level execution planning succeeds.
MCP runtime then performs tool-level safety enforcement immediately before command execution.