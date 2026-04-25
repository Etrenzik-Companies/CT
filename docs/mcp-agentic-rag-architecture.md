# MCP + Agentic RAG Architecture

## Purpose
Define MCP tool infrastructure and RAG orchestration for agent operations.

## Scope
Tool allowlists, role permissions, side-effect controls, source trust scoring, and human approvals.

## Current Status
🟡 MCP authorization and agent tool-policy guardrails implemented in API engine.

## Key Components
- MCP registry with role-scoped tools
- RAG citation + confidence + freshness requirements
- Action confirmation for side effects
- Audit category and rate limits

## Risks
Unauthorized side effects and prompt injection.

## Next Steps
Implement runtime MCP registry service and audit log storage.

## Owner
TBD
