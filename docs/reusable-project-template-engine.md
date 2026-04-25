# Reusable Project Template Engine

## Purpose
Enable reusable project instantiation from validated templates.

## Scope
ProjectType, ModulePreset, WorkflowPreset, DiligencePreset, TradePreset, CodeJurisdictionPreset, FundingPreset, ESGPreset, AgentPreset.

## Current Status
🟡 Template-to-instance creation and Clay Terrace singleton validation implemented.

## Rules
- Clay Terrace remains one primary instance.
- Future projects reuse workflows with location/jurisdiction-specific overrides.

## Risks
Template drift and duplicate-primary-instance conflicts.

## Next Steps
Persist template registry and add migration/version control.

## Owner
TBD
