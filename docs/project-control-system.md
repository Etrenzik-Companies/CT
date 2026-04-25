# Project Control System

## Purpose
Define the integrated Project Control system connecting contractors, estimating, compliance, permitting, funding, incentives, RAG, MCP tools, and agents.

## Scope
Clay Terrace is the first project instance; architecture is reusable for future projects.

## Current Status
🟡 Core contracts and guardrail engine implemented in `apps/api/src/projectControl`.

## Key Components
- Contractor CRM and trade graph
- Estimating and bid package lifecycle
- Code-compliance knowledge and AHJ validation flags
- Permitting workflow and inspection tracking
- Funding readiness and closeout blockers
- Incentive intelligence and ESG evidence
- RAG citation and confidence requirements
- MCP allowlist + agent policy enforcement

## Risks
- Over-automation without approvals
- Stale code references
- Data quality and evidence mismatch

## Next Steps
- Add persistent storage adapters
- Add API endpoints for each module
- Add dashboard pages under `/project-control`

## Owner
TBD
