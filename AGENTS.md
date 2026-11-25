# AGENTS.md — OverKill-Hill-FoundRy

## 0. Role

This repository is the OverKill Hill P³ FoundRy relay. It translates the golden governance from `OKHP3/OverKill-Hill` into reusable scaffolds for OKH child repositories, including experimental architectures, recursive systems, promptcraft assets, narrative frameworks, writing projects, local AI workbenches, Mermaid tooling, and FoundRy capability prototypes.

This repo is not merely a content repository. It is a template-of-templates and governance relay.

**Product direction (2026-09-27):** FoundRy is now a workbench for portable Agent
Skills and their plugins/connectors. Preserve and convert useful Custom GPT
methods into composable skills; isolate host packaging and tool integrations in
adapters. Custom GPTs are retained migration sources and optional legacy targets.
Use `capabilities/<slug>/` for consolidated capability projects and the
[migration contract](docs/portable-skill-foundry.md) for source-preserving imports.
This local adaptation does not change the universal governance authority.

**Identity boundary:** FoundRy is the primary identity of this intentionally public repository. ReFolDec (Recursively Folding Codec) is a FoundRy-hosted capability and prospective public artifact, not an alternate repository identity. Source-safe ReFolDec development may live here; a public ReFolDec release requires its own approved publication surface and the graduation checks in section 7.

## 1. Authority Chain

```text
OKHP3/OverKill-Hill
  → OKHP3/OverKill-Hill-FoundRy
    → OKH child repositories
```

Universal governance should originate in `OKHP3/OverKill-Hill`. This relay may adapt implementation details for the OverKill Hill domain, but must not silently fork universal rules.

## 2. Relay Responsibilities

This repository owns:

- Child repository scaffolds in `_template/`
- Repo registry files in `registry/`
- Manifest and validation schemas in `schemas/`
- Relay documentation in `docs/`
- GitHub workflow templates in `.github/`
- Governance guidance for OKH child repos

## 3. Child Repository Scope

This relay governs repositories matching these families:

- `foundry-*`
- `vault-*`
- `article-*`
- `narrative-*`
- `mermaid-*`
- `mac-studio-*`
- OKH research, app, writing, local AI, and promptcraft repositories

Known child examples include:

- `foundry-are00-abrahamic-reference-engine`
- `mermaid-theme-builder`
- `mermaid-diagram-bpmn`
- `mac-studio-local-ai-workbench`
- `infusing-a-soul`
- `first-diagram-is-a-liar`
- `3-years-with-chatgpt`
- `magnus-progenitor-saga`
- `vault-codacies-biases-as-constants`
- `bimdb-building-information-modeling-database`

Homestead-R, PathScrib-R and Un-Nocked Truth are now hosted under
`capabilities/`. Their former repository identities and source revisions are
listed in [the migration registry](registry/capability-migrations.json).

## 4. Required Child Repo Files

Every governed child repo should eventually contain:

```text
AGENTS.md
README.md
CHANGELOG.md
LICENSE.md
manifest.yaml
```

Capability repos should additionally include:

```text
docs/
origin/
skill/
prompts/
research/
tests/
schemas/
assets/
exports/
archive/
```

## 5. Naming Rules

Use lowercase kebab-case for new repositories unless a public brand repository already has a legacy casing requirement.

Preferred OKH patterns:

```text
foundry-[code][##]-[project-slug]
vault-[concept-slug]
article-[project-slug]
narrative-[world-or-system-slug]
mermaid-[function-slug]
mac-studio-[function-slug]
```

Avoid ambiguous names that do not identify domain, purpose, or lineage.

## 6. Manifest Requirements

Each child repository should include a root `manifest.yaml` conforming to `schemas/repo-manifest-schema.yaml`.

Required lineage fields:

```yaml
brand_domain: overkillhill
parent_foundry: OKHP3/OverKill-Hill-FoundRy
governance.naming_pattern: ""
```

## 7. Visibility and Graduation

Private repos may become public only after:

- PII scrub
- employer/conflict review
- source/license review
- README externalization
- manifest completion
- public-readiness checklist completion

Repositories with sensitive client or employer context must not be graduated automatically.

For a FoundRy-hosted capability such as ReFolDec, public documentation or exports must be treated as a separate graduation target. The FoundRy relay is intentionally public, as confirmed by the owner on 2026-09-07. Repository visibility does not authorize publication of private source material or establish a separate capability release.

## 8. Agent Behavior

AI agents working in this repo must:

- Preserve governance hierarchy.
- Prefer small, auditable changes.
- Avoid deleting historical artifacts unless explicitly instructed.
- Treat `_template/` as deployable scaffold source.
- Update `registry/index.yaml` when child repo relationships are created or materially changed.
- Keep public-facing copy clear, practical, and portfolio-grade.

## 8.1 Application scope

The capability workbench is the OverKill region's application. AskJamie and
Glee-fully own distinct FoundRys; Skillz is the catalog shared across all three.
OverKill-Hill supplies the baseline pattern and resolves universal governance
questions. This FoundRy is the initial mentor pattern for both sibling FoundRys;
each can improve the mentor or the other sibling. Preserve distinct application
ownership and adopt shared changes through review, with universal rules reconciled
at OverKill-Hill. See `docs/foundry-mentoring-model.md`. Do not import private sibling content.

The existing creator runs from `artifacts/custom-gpt-creator`, with canonical
implementation in `artifacts/mockup-sandbox/src`. Preserve `cgpt-workspace`
projects and Canvas previews when extending it. Capability projects use a separate
versioned browser store. Do not label generated starters, authored acceptance
criteria, or structural completeness as tested behavior or publication.

The owner confirmed on 2026-09-07 that public repository visibility is intended.
Current governance and the manifest reflect that decision. Historical private
posture records are dated evidence, not current visibility policy.

## 8.2 Validation entry point

Run the complete governance sequence before review:

```bash
python3 scripts/governance-check.py
```

This is the same repository-local entry point used by governance CI. It runs
the manifest, registry, capability migration records, scaffold sync, public graduation, and release-record
consistency checks without changing the existing checks.

## 8.3 Collaboration across agent hosts

Follow [the collaboration protocol](docs/agent-collaboration.md) when work crosses
ChatGPT/Codex, Claude, GitHub Copilot, or Replit. This is a repository-local
working agreement, not a new universal governance rule.

- Optimize useful work per token; elapsed time is secondary. Prefer the owner's
  larger ChatGPT allocation for portable work, Claude for bounded second opinions,
  Copilot for small targeted tasks, and Replit for its checkout and runtime needs.
  Select the least costly capable model and effort available to the assigned host.
- Fetch and inspect current Git state before editing. Preserve local work and
  reconcile with `origin/main`; never overwrite another host's work to gain parity.
- Use one task owner, one implementation branch, explicit file scope, and one
  integration owner per task. Independent agents may work in separate checkouts;
  coordinate overlapping files and do not duplicate an active assignment.
- Pass the protocol's compact handoff with exact commit and validation evidence.
  A host must acknowledge a handoff before it counts as accepted. Chat history,
  account allowances, and access permissions are not assumed to transfer.
- Reuse relevant verified evidence; rerun required checks and checks invalidated
  by changes. Do not spend tokens repeating whole-repository research or polling.
- The six website/FoundRy Repls are distinct workspaces. Skillz is context only
  in the current reconciliation round. Modify this repository only unless the
  owner explicitly expands scope. All three regional FoundRy repositories are
  intentionally public; preserve private-source and capability-release boundaries.

## 8.4 OverKill project routing

FoundRy is the OverKill region's capability workbench and governance relay. Its
scope includes reusable prompts, Agent Skills, workflows, software starters,
and other capability work beyond the retained Custom GPT studio. The public
`OKHP3/OverKill-Hill` site owns the OverKill brand and portfolio, including the
published editorial MurderBird story at `/writings/murderbird/`.

All MurderBird creative assets and interactive application implementation belong
in the sibling [`OKHP3/murderbird-uncaged`](https://github.com/OKHP3/murderbird-uncaged)
repository. The OverKill-Hill site keeps its story publication, site shell, and
any copies needed for distribution. A story snapshot in MurderBird Uncaged may
provide creative context; the website remains the source of truth for editorial
publication. Do not build a second MurderBird app or keep its creative source
assets in FoundRy. See [repository boundaries](docs/repository-boundaries.md).

## 9. Directory Contract

```text
_template/   Child repo starter scaffold
registry/    Child repo catalog and triage logs
schemas/     Manifest and registry validation schemas
docs/        Relay design, governance, and migration guidance
.github/     GitHub workflow and issue template scaffolds
capabilities/ Consolidated capability subtrees (portable skills plus adapters)
```

## 10. Filename Compliance Enforcement

All filenames in this repository must follow lowercase-kebab-case ASCII conventions enforced by `scripts/normalize_filenames.py`.

A GitHub Actions workflow at `.github/workflows/filename-check.yml` runs on every pull request and push to `main`. It performs a dry-run check and **fails the CI job** if any filenames require renaming.

If the check fails locally or in CI:

```bash
# Preview what would change
python3 scripts/normalize_filenames.py . --recursive --ascii-only --include-dirs

# Apply the renames
python3 scripts/normalize_filenames.py . --recursive --ascii-only --include-dirs --apply
```

Hidden paths (`.git`, `.github`, `.agents`, `.cache`, `.config`, `.local`, `.replit`) and the default-excluded dirs (`_template`, `lib`, `artifacts`) are exempt from the check.

AI agents introducing new files must ensure names are lowercase-kebab-case ASCII before committing.

## 11. Canonical Principle

The durable unit is the capability, not the platform wrapper. GPTs, skills, agents, local modules, websites, and articles are deployment targets. The repository is the source of truth.

For new capability work, prefer `skills/<skill-name>/SKILL.md` inside its
capability subtree, with `origin/`, `adapters/`, `tests/`, and `docs/`. A skill may
compose other skills and use MCP, APIs or applications through explicit tool
contracts. Record compatibility for each host/version independently. Never equate
source portability, a packaging plan or a plugin manifest with tested execution.
Keep contributor skills in `.agents/skills/` distinct from product skills.
Do not archive source repositories until import parity and recovery are verified.

## Imported Claude Cowork project instructions
