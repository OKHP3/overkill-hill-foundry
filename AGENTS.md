# foundry-psr00-pathscrib-r

## Project identity

- **Suite:** FoundRy
- **Tool:** GPT-PSR00, PathScrib-R
- **Repository:** `https://github.com/OKHP3/foundry-psr00-pathscrib-r`
- **License:** MIT, see [LICENSE](LICENSE)
- **Current repository status:** Documentation, knowledge assets, Agent Skills, evaluation fixtures, and small Python utilities are present. No executable application or service is checked in.
- **Lifecycle:** Active maintenance. The latest commits on 2026-07-21 and 2026-07-22 added and hardened Agent Skills and evaluation assets.

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

- `docs/ledgers/`: the five PathScrib-R ledger specifications.
- `docs/procedures/ris_pathscrib-r.md`: procedural examples and output contracts, though the file currently contains duplicated or embedded ledger material as well.
- `docs/maintenance/`: technology inventory documentation and its machine-readable source of truth.
- `knowledge/casebooks/`: reference casebooks covering process modeling, requirements elicitation, BPMN, Mermaid, governance, measurement, risk, continuous improvement, and related topics.
- `knowledge/rag/`: RAG implementation, process-modeling, and PlantUML guidance.
- `.agents/skills/`: 35 local Agent Skills and their supporting assets, scripts, tests, benchmarks, and evaluation fixtures.
- `skills/okhp3-skill-promotion/`: exact publication mirror of the local promotion skill, generated from `.agents/skills/okhp3-skill-promotion/`.
- `.github/workflows/technology-inventory.yml`: scheduled and manually dispatched technology-inventory review.
- `.github/scripts/check-technology-inventory.py`: checks inventory age and selected release baselines.
- `docs/maintenance/TECHNOLOGY.md` and `docs/maintenance/technology-inventory.json`: technology inventory and its machine-readable source of truth.
- `README.md`: short project overview and orientation guide.
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
- The repository includes Python utility scripts for skill packaging, validation, extraction, and evaluation. Dependencies are not declared in a project manifest.
- GitHub Actions runs the technology-inventory review on a monthly schedule and by manual dispatch. Dependabot checks GitHub Actions weekly. Root pip/npm jobs were removed because no Python dependency manifest or root npm workspace exists; seven nested skill package manifests declare no dependencies. Add ecosystem coverage at actual manifest directories when dependencies are introduced.
- The documented output formats are Mermaid, BPMN, PlantUML, JSON, and CSV.

### Not present

- No root `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, Makefile, Dockerfile, or application source tree. Nested skill package metadata does not establish an application runtime.
- No application test suite, lint configuration, build configuration, or deployment configuration.
- No checked-in PlantUML, BPMN, Mermaid, JSON, or CSV renderer.

Do not invent installation, run, build, test, or deployment commands until an implementation runtime is added and documented.

## Local skills

The repository currently contains 35 Agent Skills:

- `okhp3-artifact-validation`
- `okhp3-as-is-process-capture`
- `okhp3-brand-style-registry`
- `okhp3-capture-intake`
- `okhp3-chatgpt-project-migration`
- `okhp3-custom-gpt-builder`
- `okhp3-custom-gpt-readiness`
- `okhp3-decision-model-authoring`
- `okhp3-elicitation-interviews`
- `okhp3-equilibrium-review`
- `okhp3-evidence-standard`
- `okhp3-future-state-strategy`
- `okhp3-gpt-skill-conversion-plan`
- `okhp3-graduation-gate`
- `okhp3-handoff-packaging`
- `okhp3-notion-capture-router`
- `okhp3-outcome-modeling-core`
- `okhp3-overkill-hill-brand`
- `okhp3-process-capture`
- `okhp3-process-gap-analysis`
- `okhp3-process-intake-and-scope`
- `okhp3-project-promotion`
- `okhp3-repl-repo-janitor`
- `okhp3-repository-janitor`
- `okhp3-repository-organizer`
- `okhp3-session-handoff`
- `okhp3-skill-cataloger`
- `okhp3-skill-discovery`
- `okhp3-skill-foundry`
- `okhp3-skill-promotion`
- `okhp3-source-backed-research`
- `okhp3-thread-context-extraction`
- `okhp3-thread-extract-chatgpt`
- `okhp3-thread-extract-claude`
- `okhp3-triage-and-file`

Evaluation workspaces and benchmark records live inside the relevant skill packages and are not counted as separate skills unless they contain their own `SKILL.md`.

The Notion capture router must run report-only when private anchors are unavailable. The cataloger inventories skills and validates their metadata. The skill-creator package creates, improves, and evaluates Agent Skills. The extraction packages preserve manually supplied AI conversation context for platform-specific and generic workflows.

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
3. Run the technology inventory check with `python3 .github/scripts/check-technology-inventory.py --max-age-days 90` when network access is available.
4. Run `git diff --check`.
5. Confirm that referenced paths exist and that no unexpected files changed.

There is currently no repository-provided test, build, lint, or deployment command to run.

## Known gaps and open questions

### Risks or inconsistencies

- `ris_pathscrib-r.md` starts as a Parameters Ledger and embeds sections for other ledgers and the RIS material. Its canonical role is unclear.
- Ledger documents and reference material carry 2025-08-18 or v1.0/v4.2 historical labels, but no current release or versioning policy is documented.
- The RAG material discusses CI, rendering, and implementation patterns, but no such tooling is checked in.

### Owner input needed

- Confirm the intended product description: business process facilitation, journaling, or both.
- Confirm whether the repository is intentionally documentation-only and identify the future runtime or integration surface, if any.
- Decide which file is canonical for RIS procedures and whether the duplicated ledger content should be split or retired.
- Confirm the authoritative ledger versions, load order, and status for the project.
- Decide whether the root PDFs are source references, generated deliverables, or both.

## Keeping this guide current

Update this file when the repository gains an implementation runtime, new validation commands, a deployment surface, a canonical ledger revision, or a changed product boundary. Re-check the claims against the files and executable checks before updating the guide.

## Imported Claude Cowork project instructions
