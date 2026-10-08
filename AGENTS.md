# foundry-unt00-un-nocked-truth

## Purpose and status

**Suite:** FoundRy
**Project name:** UNT00, Un-Nocked Truth
**Repository:** https://github.com/OKHP3/foundry-unt00-un-nocked-truth
**License:** MIT, Copyright 2026 OverKill Hill P³

**Confirmed purpose:** Existing project metadata describes this repository as a FoundRy GPT tool for logical analysis and argument integrity checking.

**Confirmed current state:** The repository contains project guidance, 35 local Agent Skill packages, three reusable project prompts, one publication mirror, two PNG assets, a `requirements.txt` dependency manifest, a technology inventory, Dependabot configuration, and license metadata. It contains no application source, executable product entry point, product test suite, product build configuration, deployment configuration, or documented product runtime.

**Inferred status:** The product remains at scaffold or asset-only stage, while the repository itself is an active Agent Skills incubation, evaluation, migration, and promotion workspace. Do not describe the tool as working or production-ready based on this repository alone.

**Mission and vision:** The intended mission is inferred from the declared purpose: help a user inspect reasoning and claims for logical or integrity problems. Target users, analysis method, output contract, integrations, and longer-term vision are unknown and require owner input.

## Scope and boundaries

This repository is the project root and the only Git repository found within it. No nested project or nested instruction scope was found.

Current repository scope is limited to:

- Root-level project identity and agent guidance.
- Local Agent Skills under `.agents/skills/`, including evaluation and benchmark evidence where present.
- Reusable project prompts under `.agents/prompts/`.
- The publication mirror under `skills/okhp3-skill-promotion/`.
- Two 1024 by 1024 PNG identity or reference assets.
- README and MIT license metadata.

Do not infer a product runtime, API contract, model behavior, data flow, deployment target, or production guarantee until implementation evidence is added. Do not add secrets or credentials to this repository.

## Repository map

- `AGENTS.md`: canonical instructions for agents working in this project.
- `CLAUDE.md`: short compatibility pointer to `AGENTS.md`.
- `README.md`: repository orientation, current workspace status, map, and product boundary.
- `docs/technology-inventory.md`: evidence-backed inventory of the current tooling, dependency, and maintenance state.
- `requirements.txt`: pins `PyYAML==6.0.3` for seeded skill validation scripts.
- `.github/dependabot.yml`: weekly Dependabot checks for pip and GitHub Actions dependencies.
- `.agents/skills/`: local agent skills and their supporting references, assets, scripts, tests, evaluations, and benchmark records. These are guidance resources, not application code.
- `.agents/prompts/`: reusable onboarding and migration prompts.
- `skills/okhp3-skill-promotion/`: publication mirror of the local promotion package. Treat mirror synchronization as an explicit, evidence-backed operation.
- `assets/identity/chatgpt-image-oct-18,-2025,-09_23_20-pm.png`: 1024 by 1024 RGB PNG asset.
- `assets/identity/overkill-hill-p³-square-icon-un-nocked-truth.png`: 1024 by 1024 RGB PNG asset.
- `LICENSE`: MIT license.
- `.gitattributes`: automatic text normalization.

No source or executable entry point is currently present.

## Technology and workflow

**Confirmed tools and formats:** Git, Markdown, plain text, JSON, YAML, Python scripts, JavaScript and Node.js validation scripts, package-local test manifests, PyYAML for selected tooling, and PNG assets. Dependabot is configured for pip and GitHub Actions ecosystems. The repository has no root application package manifest.

**Unknown:** Application language, framework, model or API integration, environment variables, product interface, local server command, application test command, build command, deployment model, and operational ownership. The repository has a Python dependency manifest for seeded skill tooling, but no product runtime contract.

The local skills include guidance for skill discovery, skill creation, repository organization, Notion conversation capture, evaluation, cataloging, and promotion. Read the applicable skill file before changing a skill or its supporting resources. Do not treat skill instructions as evidence that this project implements the described capability.

## Validation

There is no product validation command to run yet. For guidance, catalog, or metadata changes, use:

```text
git status --short --branch
git diff --check
git ls-files
```

The only declared dependency setup is `python3 -m pip install -r requirements.txt` for the seeded skill validation scripts. No product build, lint, test, or run command is currently available.

For local skill validation, use the package-provided commands when applicable. The Foundry suite can validate all direct local packages with:

```text
node .agents/skills/okhp3-skill-foundry/scripts/validate-skill-suite.cjs --skills-dir .agents/skills
```

The catalog check can be run without writing files with:

```text
python3 .agents/skills/okhp3-skill-cataloger/scripts/gen-skills-readme.py --skills-dir .agents/skills --check
```

For future implementation work, add verified setup, lint, test, build, and deployment commands here and in `README.md`. Until then, report those capabilities as unavailable rather than inventing commands.

## Safe change conventions

- Keep `AGENTS.md` as the single canonical agent guide. Update it when repository evidence changes.
- Keep `CLAUDE.md` as a short pointer unless Claude-specific instructions are genuinely needed.
- Preserve existing user changes and avoid destructive version-control commands.
- Inspect the repository before adding implementation claims, dependencies, commands, or architecture descriptions.
- Preserve binary image assets unless an owner explicitly requests asset changes. Confirm dimensions and format after changing them.
- Do not commit Python bytecode or cache directories. Keep cache ignore rules narrow so evaluation evidence remains visible.
- Treat benchmark and evaluation outputs as historical evidence until provenance and supersession are explicitly established; do not purge them by filename alone.
- Keep project documentation factual. Label confirmed facts, inferences, and unknowns.
- Use the repository's existing `main` branch unless the owner specifies another branch strategy. No additional branch or naming convention is currently documented.

## Writing and brand conventions

- No em dashes in generated content.
- Preserve standalone punchy lines. Do not merge them into paragraphs without a reason.
- Follow the ROY principle: understanding produced, explanation invested. Verbosity must earn its space.

The previous guide included an AutoCAD R10 constraint. No repository evidence connects AutoCAD to this project, so it is not an active project convention.

## Related references

These links are inherited project metadata. They were not used to infer implementation details for this repository:

- [foundry-psr00-pathscrib-r](https://github.com/OKHP3/foundry-psr00-pathscrib-r)
- [foundry-hmt01-homestead-r](https://github.com/OKHP3/foundry-hmt01-homestead-r)
- [foundry-are00-abrahamic-reference-engine](https://github.com/OKHP3/foundry-are00-abrahamic-reference-engine)

## Open questions

Owner input is needed to resolve:

- Is this project currently active, in development, archived, or on hold?
- What runtime, model or API, interface, and target user workflow should be implemented?
- What are the intended input and output contracts for logical analysis?
- Where should implementation, tests, and deployment configuration live when added?
- Which related repository or external product context should this tool integrate with?

## Imported Claude Cowork project instructions
