# PathScrib-R

PathScrib-R is the FoundRy GPT-PSR00 business process facilitation tool. This repository is currently documentation-only. It defines the process-facilitation persona, conceptual agents, execution modes, output contracts, RAG references, RIS playbooks, and reusable Agent Skills that support related context and knowledge workflows.

## Documented workflow

`interview -> diagram -> qa -> export`

The ledgers also document a `narrative -> diagram` path. Supported output formats are Mermaid, BPMN, PlantUML, JSON, and CSV. These are documented contracts and formats, not checked-in renderers or an executable application.

## Start here

- [`AGENTS.md`](AGENTS.md): canonical project guidance, repository map, constraints, and validation commands.
- [`docs/ledgers/dataledger_persona_v3.md`](docs/ledgers/dataledger_persona_v3.md): role, tone, boundaries, and relationships.
- [`docs/ledgers/dataledger_registry_v3.md`](docs/ledgers/dataledger_registry_v3.md): conceptual agent registry.
- [`docs/ledgers/dataledger_parameters_v3.md`](docs/ledgers/dataledger_parameters_v3.md): modes, formats, QA levels, and execution flow.
- [`docs/ledgers/dataledger_system_v3.md`](docs/ledgers/dataledger_system_v3.md) and [`docs/ledgers/dataledger_hydration_v3.md`](docs/ledgers/dataledger_hydration_v3.md): authority, load order, and hydration state.
- [`docs/maintenance/TECHNOLOGY.md`](docs/maintenance/TECHNOLOGY.md): reviewed technology inventory and update policy.

The repository map is intentionally small: `docs/` contains project specifications and maintenance documentation, while `knowledge/` contains the process-modeling casebooks and RAG references.

The root PDFs are reference casebooks. The `.agents/skills/` directory contains 35 local Agent Skills and their evaluation assets. The `skills/okhp3-skill-promotion/` directory is an exact publication mirror for the promotion skill, managed from its `.agents/skills/` source. There is no package manifest, application runtime, deployment configuration, or repository-provided application test command.
