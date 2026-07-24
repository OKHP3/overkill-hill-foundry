# PathScrib-R

PathScrib-R is the FoundRy GPT-PSR00 business process facilitation tool. This repository is currently documentation-only. It defines the process-facilitation persona, conceptual agents, execution modes, output contracts, RAG references, RIS playbooks, and reusable Agent Skills that support related context and knowledge workflows.

## Documented workflow

`interview -> diagram -> qa -> export`

The ledgers also document a `narrative -> diagram` path. Supported output formats are Mermaid, BPMN, PlantUML, JSON, and CSV. These are documented contracts and formats, not checked-in renderers or an executable application.

## Start here

- [`AGENTS.md`](AGENTS.md): canonical project guidance, repository map, constraints, and validation commands.
- [`dataledger_persona_v3.md`](dataledger_persona_v3.md): role, tone, boundaries, and relationships.
- [`dataledger_registry_v3.md`](dataledger_registry_v3.md): conceptual agent registry.
- [`dataledger_parameters_v3.md`](dataledger_parameters_v3.md): modes, formats, QA levels, and execution flow.
- [`dataledger_system_v3.md`](dataledger_system_v3.md) and [`dataledger_hydration_v3.md`](dataledger_hydration_v3.md): authority, load order, and hydration state.
- [`TECHNOLOGY.md`](TECHNOLOGY.md): reviewed technology inventory and update policy.

The root PDFs are reference casebooks. The `.agents/skills/` directory contains 16 Agent Skills plus an evaluation workspace. There is no package manifest, application runtime, deployment configuration, or repository-provided application test command.
