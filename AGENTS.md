# foundry-psr00-pathscrib-r

## Project identity

- **Suite:** FoundRy
- **Tool:** GPT-PSR00, PathScrib-R
- **Repository:** `https://github.com/OKHP3/foundry-psr00-pathscrib-r`
- **License:** MIT, see [LICENSE](LICENSE)
- **Current repository status:** Documentation and knowledge assets are present. No executable application or service is checked in.

## Purpose and scope

### Confirmed purpose

The repository defines a PathScrib-R business process facilitation tool. Its documented responsibilities are to:

- translate plain-language descriptions into structured process models
- guide requirements elicitation interviews
- generate or describe Mermaid, BPMN, PlantUML, JSON, and CSV process outputs
- provide narrative, revision, and QA views of a process
- use RAG reference material and RIS procedural playbooks as knowledge inputs

The persona ledger explicitly positions PathScrib-R as a business process facilitator, diagram orchestrator, and extended-memory guide. The current files do not substantiate the earlier description of this repository as a journaling tool.

### Inferred mission and vision

- **Mission:** Make process discovery and process-model creation more structured, explainable, and reusable.
- **Vision:** Provide a governed, multi-format path from stakeholder conversation to validated process documentation.

These are working interpretations of the ledgers, not owner-approved product statements.

### Non-goals and boundaries

- Do not treat this repository as a generic question-answering bot.
- Do not infer a production API, UI, deployment, or hosted runtime. None is present in the repository.
- Keep vendor-specific or unrelated material out of the PathScrib-R knowledge base, consistent with the persona ledger boundary.
- Do not commit private Notion URLs, database IDs, connector IDs, credentials, or other secrets.

## Repository structure

This is a single Git repository. No nested Git repositories were found.

- `dataledger_persona_v3.md`: documented role, tone, purpose, boundaries, and relationships.
- `dataledger_registry_v3.md`: declared agents and their relationships.
- `dataledger_parameters_v3.md`: modes, output formats, QA levels, token limits, and default execution flow.
- `dataledger_system_v3.md`: declared authority and load order.
- `dataledger_hydration_v3.md`: hydration schema and rehydration audit record.
- `ris_pathscrib-r.md`: procedural examples and output contracts, though the file currently contains duplicated or embedded ledger material as well.
- `rag_plant_uml_syntax_path_scrib_r.md`: extended PlantUML guidance and format-selection advice.
- Root-level PDFs: reference casebooks covering process modeling, requirements elicitation, BPMN, Mermaid, governance, measurement, risk, continuous improvement, and related topics.
- `.agents/skills/`: four local Agent Skills and their supporting assets or scripts.
- `README.md`: title only. It is not currently a usable project overview.
- `CLAUDE.md`: a pointer to this file, `@AGENTS.md`.

## How the documented pieces fit

The system ledger declares this load order:

`Persona -> Registry -> Parameters -> System -> Hydration`

The declared workflow is:

`interview -> diagram -> qa -> export`

The parameters ledger also documents a `narrative -> diagram` alternate path. The registry names five conceptual agents: Diagram Generator, Interview Conductor, Revision Agent, QA Gatekeeper, and Narrative Mode Agent. These are documented roles only. No corresponding executable agents are checked in.

The knowledge relationship is documented as:

`RAG references -> knowledge and notation guidance`

`RIS playbooks -> procedural steps and QA gates`

`Ledgers -> persona, registry, parameters, system order, and hydration state`

## Technology and runtime

### Confirmed

- Primary artifacts are Markdown and PDF.
- The local skill collection follows the Agent Skills convention with `SKILL.md` files and YAML front matter.
- `okhp3-skill-cataloger` includes a Python catalog and validation script at `.agents/skills/okhp3-skill-cataloger/scripts/gen-skills-readme.py`.
- The documented output formats are Mermaid, BPMN, PlantUML, JSON, and CSV.

### Not present

- No `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, Makefile, Dockerfile, or application source tree.
- No test suite, lint configuration, build configuration, deployment configuration, or GitHub Actions workflow.
- No checked-in PlantUML, BPMN, Mermaid, JSON, or CSV renderer.

Do not invent installation, run, build, test, or deployment commands until an implementation runtime is added and documented.

## Local skills

The repository currently contains these four skills:

- `find-skills`: routes requests about discovering or extending skills.
- `okhp3-notion-capture-router`: routes AI conversations into Notion and reconciles them with GitHub. It must run report-only when private anchors are unavailable.
- `okhp3-skill-cataloger`: inventories the local skills and validates their metadata.
- `skill-creator`: creates, improves, and evaluates Agent Skills.

Validate the skill inventory from the repository root with:

```sh
python3 .agents/skills/okhp3-skill-cataloger/scripts/gen-skills-readme.py \
  --skills-dir .agents/skills --check
```

The cataloger may report warnings for missing optional version metadata. Treat those as metadata follow-ups, not as proof that a runtime is working.

## Safe change conventions

- Treat this `AGENTS.md` as the canonical project guide. Keep `CLAUDE.md` as a short pointer unless Claude-specific instructions are genuinely needed.
- Inspect `git status` before editing and preserve unrelated user changes.
- Make documentation claims traceable to repository evidence. Label owner decisions and product interpretations as inferred or unknown.
- Preserve the documented ledger names and load order unless the ledgers themselves are intentionally reconciled.
- Keep standalone punchy lines as standalone lines where they carry meaning.
- Do not use em dashes in newly generated content for this project.
- Use normal Markdown and fenced examples for process notation. Keep examples clearly distinct from executable project files.
- Keep private Notion routing data outside version control. Use the documented private anchor mechanism when the Notion capture skill is run.
- Preserve the MIT license and do not alter PDFs or other knowledge assets as part of an agent-guidance change.

## Validation

Because there is no application runtime, validation is documentation and metadata validation:

1. Re-read every changed guidance file.
2. Run the skill cataloger with `--check`.
3. Run `git diff --check`.
4. Confirm that referenced paths exist and that no unexpected files changed.

There is currently no repository-provided test, build, lint, or deployment command to run.

## Known gaps and open questions

### Risks or inconsistencies

- `dataledger_hydration_v3.md` refers to `persona_v3.md`, while the tracked file is `dataledger_persona_v3.md`.
- `ris_pathscrib-r.md` starts as a Parameters Ledger and embeds sections for other ledgers and the RIS material. Its canonical role is unclear.
- Ledger documents and reference material carry 2025-08-18 or v1.0/v4.2 historical labels, but no current release or versioning policy is documented.
- `README.md` does not explain the project, its artifacts, or how to use them.
- The RAG material discusses CI, rendering, and implementation patterns, but no such tooling is checked in.

### Owner input needed

- Confirm the intended product description: business process facilitation, journaling, or both.
- Confirm whether the repository is intentionally documentation-only and identify the future runtime or integration surface, if any.
- Decide which file is canonical for RIS procedures and whether the duplicated ledger content should be split or retired.
- Confirm the authoritative ledger versions, load order, and status for the project.
- Decide whether the root PDFs are source references, generated deliverables, or both.

## Keeping this guide current

Update this file when the repository gains an implementation runtime, new validation commands, a deployment surface, a canonical ledger revision, or a changed product boundary. Re-check the claims against the files and executable checks before updating the guide.
