# thread-scourer

Research and tooling for surveying, cataloging, and quality-governing ChatGPT project threads across the OverKill Hill P³ / GPT Found‑Rᵧ ecosystem.

---

## What "Thread Scouring" Means

A **thread scour** is the act of systematically surveying every active ChatGPT thread in a project ecosystem, extracting its latent purpose, thematic clusters, and conceptual DNA, then routing, naming, and archiving it correctly. The process prevents thread sprawl, eliminates naming entropy, and ensures every fragment of intellectual work lands in the right canonical project with a human-readable, collision-free title.

Thread scouring sits inside the **Turn Track** layer — the command observatory and audit log for OverKill Hill P³ — and feeds its outputs upstream into the `dataLedger_*_v3.md` ledger system via hydration exports.

---

## Dual Purpose

This folder serves two distinct but related missions:

| Mission | What it covers |
|---|---|
| **Project Inventory Tooling** | Cataloging every ChatGPT project with status, links, and narrative descriptions at multiple levels of detail; providing the source list the salvage routing engine uses for Traffic Cop placement |
| **Semantic Interference Research** | Defining, detecting, and remediating unintended meaning mutations that occur as prompts evolve across threads, tiers, and merges |

Both missions support canonical ledger hygiene. The inventory tooling tells you *where* content belongs; the semantic interference research tells you *whether* the content has drifted from its intended meaning along the way.

---

## Inventory Document Variants

Six inventory documents exist, each at a different level of detail. Choose the one appropriate to your task:

| File | Format | Best used for |
|---|---|---|
| `chatgpt_project_inventory_bullet.md` | Bullet — name, tag, status, link, no description | Quick status scan; link lookup |
| `chatgpt_project_inventory_elevator.md` | Bullet + one-paragraph description per project | Onboarding; rapid orientation to each project's purpose |
| `project-inventory.md` | Full elevator pitches (250–450 words each) with mission, problems addressed, solutions, and done-good criteria | Deep audit; cross-project planning; hydration export sourcing |
| `project-inventory-limited.md` | Condensed narrative per project (3 sentences) | Traffic Cop source file inside the salvage routing engine |
| `chatgpt_project_inventory_refined_grouped.md` | Stub descriptions grouped by ecosystem (Found‑RG, General, OverKill Hill P³) | Ecosystem-level overview; group-scoped audits |
| `gpt_project_inventory_comprehensive.md` / `chatgpt_project_inventory.md` | Base and comprehensive master inventories | Full canonical reference; source-of-truth for all variants |

The **project-inventory-limited.md** file is the one the salvage routing engine actively reads at runtime (via the `Traffic_Cop` mode's `inventory_source` field). The others are human-reference and audit materials.

---

## Golden Master Assimilation Prompt

**File:** `golden-master-assimilation-prompt-v1-1.md`

A dual-mode unified prompt file that governs how content from existing threads, builds, and ledger excerpts is evaluated for integration into the canonical master template (`Custom GPT Instruction Block — Master Template.md`). Switch between modes via the YAML front-matter `mode:` field.

### Mode 1: `golden_master`

The Golden Master is an immutable structural spine — its section order and headings can never be rearranged or trimmed, only enriched. This mode compares a single SOURCE FILE against the master, extracts only unique and beneficial content that is not already present, cross-checks each candidate addition against the full `dataLedger_*_v3.md` ledger set, and rejects anything redundant, outdated, or in conflict with ledger law.

Output is a diff-style Markdown block using `🟩` markers grouped by Golden Master section. Four acceptance tests must all pass before any addition is proposed:

- **AT-01**: No structural edits — additions only
- **AT-02**: Each addition cites its target Golden Master section
- **AT-03**: No addition contradicts ledger law
- **AT-04**: Overlapping signals collapse to the single leanest clause

An optional **Batch Mode** accepts a folder or list of SOURCE FILEs and produces a concatenated diff with file-scoped subheaders.

### Mode 2: `interrogation_salvage`

A five-phase YAML-orchestrated pipeline for comprehensive thread corpus salvage:

| Phase | Tool | Output |
|---|---|---|
| 1. Interrogation | GPT Interrogation Agent v1.0 | `interrogation_report.yaml`, `artifact_index.yaml` |
| 2. Salvage | Recursive Salvage Directive v1.0 | `salvage_capsules.yaml`, `salvage_notes.md` |
| 3. Synthesis | Growth-only merge | `unified_schema.yaml`, `unified_construct.md` |
| 4. Verification | Schema integrity + delta accounting + ledger alignment checks | `verification_log.yaml`, `deltas.yaml` |
| 5. Export | Full audit bundle | SHA-stamped `INT+SLG.v1` pack |

Key runtime invariants: growth-only mutation (`!ARCHIVED` required for removals), conflict precedence order `system → parameters → registry → persona → narrative`, SHA-anchored provenance manifest, stable sort for deterministic reproducibility.

---

## Canon-Locked Salvage Routing Engine

**File:** `canon-locked-salvage-routing-engine-with-title-synthesis.md`

A reusable, lossless, cross-thread salvage engine that also generates deterministic, collision-free thread titles. Trigger it with `!SALVAGE` in a working thread.

### Four Operating Modes

| Mode | What it does |
|---|---|
| **Passive Harvest** | Preserves all content verbatim; growth-only; respects `!ARCHIVED` and `!REMOVE` tags; keeps canon markers intact |
| **Active Salvage** | Enumerates fragments, clusters by function (framework/prompt/process/instruction/schema/narrative), extracts top noun and verb signals, deduplicates across threads |
| **Traffic Cop** | Reads `project-inventory-limited.md`; scores each fragment against all known projects (scope match 0.55, lexical overlap 0.45); assigns primary project + secondary list + out-of-scope flag with documented rationale |
| **Title Synthesis** | Produces a human-clear, scan-friendly thread title from the dominant conceptual cluster |

### Title Synthesis Scoring

Titles are generated from four weighted signals:

| Signal | Weight |
|---|---|
| Core noun terms from primary cluster | 0.45 |
| Action verb terms | 0.25 |
| Scope overlap with target project | 0.20 |
| Uniqueness against existing titles | 0.10 |

Hard constraints: 38–72 chars (cap 80), title-case, no leading articles, preserve canonical suffix tokens (`‑R`, `‑Rᵧ`). A collision guard appends `-2`, `-3`, etc. to the slug without altering the semantic core. Output includes the suggested title, a kebab-case slug, and a `::CanonSeal[title_synth_v1.locked]::` stamp.

---

## Semantic Interference Detection Research

**Primary file:** `semantic_interference_detection_monolith_v4-2.md`  
**License:** CC BY-NC 4.0 | **Status:** canon-ready

This is a comprehensive builder's handbook and enterprise AI resource defining, categorizing, and operationalizing the detection and remediation of **semantic interference** — unintended mutation of meaning across the lifecycle of a prompt.

### What Semantic Interference Is

Semantic interference occurs when a prompt's meaning drifts from its intended specification during creation, revision, or cross-thread merging. Four primary failure modes:

| Type | Definition |
|---|---|
| **Lexical Drift** | A substituted term alters nuance or operational scope (e.g., "scan" → "inspect") |
| **Metaphor Bleed** | A metaphor migrates from illustrative context into literal, mechanical sections |
| **Cross-Context Contamination** | Terms from an unrelated domain leak in during salvage or merge operations |
| **Loss of Functional Constraints** | Removal of "must/shall" clauses, checksums, or operational safety checks |

### The Three-Tier Model (Bronze / Silver / Gold)

Prompt evolution is treated as a multi-tier join on conceptual maturity:

- **🥉 Bronze (middleSchool)** — raw creative seeds; early drafts; unique conceptual DNA, imprecise mechanics
- **🥈 Silver (highSchool)** — refined but not yet canon-sealed; may contain lexical drift from the Bronze → Silver transition
- **🥇 Gold (postGraduate)** — canonical, ledger-compliant construct; the only tier that survives as an operational artifact

The Gold tier's mechanics always dominate. Bronze and Silver are mined for unique details not yet integrated into Gold. Salvage decision rules: if Gold exists, merge missing upstream details then archive redundants; if no Gold, promote Silver; if only Bronze, seed → enrich → promote.

### Detection Methodologies

| Method | Strengths | Best for |
|---|---|---|
| **Manual review** | Catches metaphor bleed and suffix violations | Nuanced semantic judgment |
| **Diff-based automated** | Exact lexical and structural change detection | Large corpus comparison |
| **Semantic vector comparison** | Cosine similarity with configurable threshold (default 0.86) | Subtle paraphrase detection |
| **Hybrid** | Machine flags, human adjudicates with side-by-side tier diffs | Production-quality auditing |

### Ledger Integration

Detection results are routed through the canonical ledger system under v4.2 precedence order: `system → parameters → registry → persona → narrative`. Remediated concepts are registered in `dataLedger_registry_v3.md` as gold-tier entries with SHA-anchored provenance manifests. RIS-style stubs can offload system rules and merge thresholds to the appropriate ledger files.

### Remediation Playbooks

A playbook exists for each interference type:

- **Lexical Drift**: restore the original intent verb/noun while preserving any legitimate scope additions
- **Metaphor Bleed**: replace with literal, mechanical phrasing (e.g., "bolt on the fender" → "execute validator A before invoking validator B")
- **Cross-Context Contamination**: identify the foreign term, confirm the target domain, replace with domain-correct vocabulary
- **Loss of Constraints**: locate the missing must/shall clause in a lower tier, restore to Gold with ledger citation
- **Suffix Violation**: rename the entity to remove or correct the reserved `-R`/`‑Rᵧ` suffix

All remediations validate canonical tier precedence before committing, then emit a signed audit manifest.

### Version Landscape

| File | Role |
|---|---|
| `semantic_interference_detection_monolith_v4-2.md` | Current canon-ready monolith (v4.2) with full block index, fewshot library, and YAML schemas |
| `semantic_interference_detection_in_prompt_engineering_monolith_metatagged.md` | Meta-tagged variant |
| `semantic_interference_detection_monolith_full.md` | Full unpatched reference |
| `semantic_interference_detection_monolith_patched.md` / `_patched-1.md` | Patched intermediate versions |

---

## Ecosystem Role and Turn Track Connection

Thread scourer materials support the **Turn Track** project management layer in three concrete ways:

1. **Inventory as routing source** — `project-inventory-limited.md` is the Traffic Cop's live reference; accurate inventory descriptions directly determine whether salvaged fragments are routed to the correct canonical project.
2. **Semantic interference as quality gate** — before any salvaged content is integrated into a `dataLedger_*_v3.md` file, the interference detection framework provides the audit methodology to confirm the content has not drifted from its Bronze-tier origin.
3. **Title synthesis as metadata hygiene** — deterministic, collision-free thread titles produced by the routing engine become the stable identifiers that Turn Track uses to index, summarize, and narrate thread history across the ecosystem.

The full inventory (`project-inventory.md`) also serves as the source corpus for Turn Track's cross-project insight reports and is structured to export directly to `dataLedger_archive_v3.md` or `dataLedger_hydration_v3.md` for rehydration.

---

## File Inventory

| File | Description |
|---|---|
| `project-inventory.md` | Comprehensive inventory with full elevator pitches (250–450 words) for all OverKill Hill P³ projects |
| `project-inventory-limited.md` | Condensed 3-sentence narratives; runtime source for Traffic Cop routing |
| `chatgpt_project_inventory.md` | Base project inventory |
| `chatgpt_project_inventory_bullet.md` | Minimal bullet format — name, tag, status, link |
| `chatgpt_project_inventory_elevator.md` | Bullet format with one-paragraph descriptions |
| `chatgpt_project_inventory_refined_grouped.md` | Stub descriptions grouped by ecosystem |
| `gpt_project_inventory_comprehensive.md` | Comprehensive master inventory reference |
| `golden-master-assimilation-prompt-v1-1.md` | Dual-mode prompt (golden_master + interrogation_salvage) for canonical enrichment |
| `canon-locked-salvage-routing-engine-with-title-synthesis.md` | Salvage routing engine with Title Synthesis module; triggered by `!SALVAGE` |
| `semantic_interference_detection_monolith_v4-2.md` | Canon-ready v4.2 research handbook (CC BY-NC 4.0) |
| `semantic_interference_detection_in_prompt_engineering_monolith_metatagged.md` | Meta-tagged variant of the monolith |
| `semantic_interference_detection_monolith_full.md` | Full reference version |
| `semantic_interference_detection_monolith_patched.md` | First patched intermediate |
| `semantic_interference_detection_monolith_patched-1.md` | Second patched intermediate |
