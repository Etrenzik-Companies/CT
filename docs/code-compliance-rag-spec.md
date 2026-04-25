# Code Compliance + RAG Spec

## Purpose
Deliver citation-first compliance research with jurisdiction awareness.

## Scope
Federal + Indiana + Carmel code references with adopted-version tracking and AHJ verification flags.

## Current Status
🟡 Guardrail logic implemented for citation-or-unknown answers and required metadata.

## Key Components
- CodeSource and CodeRequirement metadata
- CodeQuestion and CodeInterpretation
- CodeRiskFlag and AHJ contacts
- Compliance evidence links

## Guardrails
- No uncited code answers
- Responses must include AHJ verification note
- Track jurisdiction, version, effective date, source URL

## Risks
Outdated references and uncited interpretations.

## Next Steps
Add source ingestion + update monitor for Indiana committee actions.

## Owner
TBD
