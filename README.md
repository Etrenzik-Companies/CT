# CT - Clay Terrace Control Tower

> Contractor CRM · Estimating · Funding Diligence · ESG · Code Compliance · Agentic AI

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/typescript-ready-3178c6)
![Security](https://img.shields.io/badge/security-baseline-black)
![Docs](https://img.shields.io/badge/docs-structured-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Internal](https://img.shields.io/badge/internal-etrenzik-orange)

## Executive Summary

> CT is a reusable project-control platform for managing complex real estate, construction, contractor, funding, ESG, and compliance workflows from idea to closeout.

## Color Legend

| Color | Meaning |
|------|---------|
| 🟢 Green | Operational / complete |
| 🟡 Yellow | In progress / needs review |
| 🔴 Red | Blocker / critical issue |
| 🔵 Blue | Documentation / knowledge |
| 🟣 Purple | AI / RAG / MCP system |
| ⚫ Black | Security / compliance |

## Table of Contents

- [Overview](#overview)
- [Why this repository exists](#why-this-repository-exists)
- [System modules](#system-modules)
- [Architecture](#architecture)
- [Project control tower](#project-control-tower)
- [Contractor CRM](#contractor-crm)
- [Estimating and bid packages](#estimating-and-bid-packages)
- [Funding diligence](#funding-diligence)
- [ESG / carbon-zero / rebates](#esg--carbon-zero--rebates)
- [Code compliance and permitting](#code-compliance-and-permitting)
- [RAG / MCP / AI agents](#rag--mcp--ai-agents)
- [Security model](#security-model)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Repository structure](#repository-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Maintainers](#maintainers)
- [What this is not](#what-this-is-not)

## Overview

CT is a monorepo foundation for a construction-technology and funding control tower platform.

## Why this repository exists

Complex development projects require one coherent system for contractor execution, lender readiness, ESG performance, and compliance tracking.

## Current Project Instance

Current primary project:
- Clay Terrace / Tempo by Hilton
- Carmel, Indiana
- Contractor/funding/control tower use case
- Etrenzik vendor and energy/ESG support workflows

## System modules

- Contractor CRM and trade/vendor operations
- Estimating, scope, and bid package management
- Funding diligence and lender package controls
- Code compliance and permitting workflow
- ESG/carbon-zero and incentive intelligence
- Document/evidence vault and audit metadata
- RAG + MCP + agent orchestration

## Architecture

See [docs/02-system-architecture.md](docs/02-system-architecture.md).

## Project control tower

A unified dashboard and API surface for cross-functional stakeholders.

## Contractor CRM

Contractor lifecycle: identified -> contacted -> quote -> review -> approval -> engaged.

## Estimating and bid packages

Trade-based and CSI-based estimates with bid-leveling and variance tracking.

## Funding diligence

Tracks proof-of-funds, lender package completeness, closing blockers, and readiness scores.

## ESG / carbon-zero / rebates

Supports energy audits, incentives, rebates, and ESG evidence routing.

## Code compliance and permitting

Tracks Indiana/Carmel code context, permit requirements, inspections, and AHJ verification flags.

## RAG / MCP / AI agents

AI features are constrained by citations, approvals, tool allowlists, and audit trails.

## Security model

See [SECURITY.md](SECURITY.md) and [docs/09-security-model.md](docs/09-security-model.md).

## Local development

```bash
pnpm install
pnpm validate
```

## Environment variables

Copy `.env.example` to `.env` and fill local non-secret dev values.

## Scripts

- `pnpm setup`
- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- `pnpm validate`
- `pnpm docs`

## Repository structure

See [docs/00-table-of-contents.md](docs/00-table-of-contents.md).

## Roadmap

See [ROADMAP.md](ROADMAP.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).

## Maintainers

- Etrenzik-Companies (Owner)
- Platform Engineering (Placeholder)

## What this is not

- Not legal advice
- Not tax advice
- Not engineering approval
- Not official code interpretation
- Not lender approval
- Not automatic submission system
