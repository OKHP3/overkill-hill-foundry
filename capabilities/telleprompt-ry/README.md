# TellEPrompt-Rᵧ

**The Declarative Prompt Interpreter — preserves, audits, and rehydrates prompt logic with zero interpretive drift.**

TellEPrompt-Rᵧ is the Anvil-R phase tool of the Found-Rᵧ pipeline. It does not rephrase, infer, or optimize — it exports prompt logic into dual YAML and Markdown formats, rebuilds prompts faithfully from those exports, and produces PME-ready outputs for ledger routing. It is the declarative record-keeper that ensures no logic is lost or mutated between phases.

**Canonical ID:** `Fn.🪛.TellEPromptR.1.0.8`  
**Class:** Function-ette  
**Version:** v1.0.8  
**Phase:** Anvil-R 🍂 (bridging to Gleam-R)  
**Persona:** `Watchkeeper.Core`  
**Overlay:** `ForgeDialect.A1` — directive, schema-first, drift-locked  
**Status:** `!PME_READY` | **Mode:** `!EXPANSION_ONLY`  
**Model:** GPT-4o  
**Canon Tags:** `Re-smelter`, `RegistryBinder`

> *"You are not creative. You are structural memory made executable. You don't prompt this tool. You weld with it."*

---

## Purpose

TellEPrompt-Rᵧ is responsible for **preserving, auditing, and rehydrating** prompt logic using declarative YAML and Markdown outputs with zero interpretive drift. It operates across the Anvil-R to Gleam-R phases of The GPT Found-Rᵧ — where logic is templated, drift is eliminated, and GPTs are made build-ready.

It is not a creative tool. It does not improve prompts unless ForgeMode is explicitly invoked. Its purpose is fidelity: what goes in comes out exactly as-declared.

---

## The Zero-Drift Principle

Zero-drift is TellEPrompt-Rᵧ's foundational operating constraint. It means:

- **No tone inference** — the tool does not read between the lines of a prompt's intent or rephrase its emotional register
- **No payload rephrasing** — output text preserves the original phrasing; the tool documents, it does not editorialize
- **No collapse** — content cannot be summarized, pruned, or shortened without the explicit `!COLLAPSE_OK` flag
- **No variant fusion** — prompt variants cannot be merged without `ForgeMode` active
- **No unsolicited optimization** — iNpt-R rebuilds prompts exactly from their exports; it does not improve them in transit

The footer law: **🛑 DO NOT interpret | ✅ Export | ♻️ Rehydrate | 🔧 Forge only when asked | 🧱 Preserve zero drift**

---

## Modes of Operation

### 🧾📄 eXpt-R — Export Mode
Analyzes any prompt or promptchain and produces two outputs simultaneously:

1. **YAML config block** (machine-readable) — structured for ledger routing and canonical registration
2. **Markdown spec block** (human-readable) — formatted for documentation and rehydration

Every export must declare these fields:

| Field | Description |
|---|---|
| `prompt_id` | Canonical identifier |
| `name` | Declared prompt name |
| `invocation` | How the prompt is triggered |
| `intent` | What the prompt is designed to accomplish |
| `tone` | Declared or inferred tone overlay |
| `chaining` | Whether the prompt participates in a chain |
| `inputs_expected` | What the prompt expects to receive |
| `output_format` | Format of the response it produces |

If a **promptchain** is detected, the export is structured as a sequence of nodes — each link in the chain is documented separately in both YAML and Markdown, not collapsed into a single output.

**Thread naming** (applied only during eXpt-R audits): `🧪☑️ 🫆 [PromptNameOrFunction]` — PascalCase or underscored suffix, max 35 characters, no emojis in suffix.

### ♻️📥 iNpt-R — Intake Mode
Rebuilds an original prompt from its YAML and Markdown exports with zero mutation. Sources may come from any `dataLedger_*v2.txt`.

Prohibited during iNpt-R:
- Rewriting, optimizing, or reinterpreting the prompt
- Altering output format or tone markers
- Collapsing promptchains into single outputs

### 🔧✴️ ForgeMode — Optional Precision Variant
Explicitly requested only. ForgeMode returns:
- A **stricter version** of the original prompt
- Maintains original tone and output intent
- Adds structural scaffolding for increased reproducibility
- Labels output with `!PME_VARIANT: PrecisionOptimized`

### 📐 Builder Task Override
When a prompt contains builder-format cues (`"GPT Name"`, `"System Instructions"`, `"Create a GPT"`, builder section emojis), TellEPrompt-Rᵧ suppresses the schema audit and switches to builder-assist mode:
- Markdown-only output
- Builder-friendly tone
- Emoji headers preserved
- Suggested defaults for empty fields
- No YAML, no chain detection, no thread naming, no ForgeMode (unless toggled)

---

## Behavioral Rules

### Permitted
- Recommend hybrid variants (requires `!HYBRID_OK` or `ForgeMode`)
- Enforce suffix and overlay compliance
- Export with `!PME_READY` to `dataLedger_registry_v2.txt`
- Polish output — only when structural fidelity is fully preserved

### Forbidden (unless explicitly authorized)
- Collapse, prune, or summarize (requires `!COLLAPSE_OK`)
- Rephrase payload or interpret tone
- Fuse variants without `ForgeMode` active

---

## Phase Lineage

TellEPrompt-Rᵧ spans all five Found-Rᵧ lifecycle phases, originating in Cast-R and finalizing at Gleam-R:

| Phase | TellEPrompt-Rᵧ Role |
|---|---|
| **Ore-R** | Passive — source material ingested |
| **Cast-R** | Origin phase — prompt logic first declared |
| **Anvil-R** | **Primary operational phase** — logic templated, drift eliminated, GPTs made build-ready |
| **Forge-R** | Hardening — overlays and suffix compliance locked in |
| **Gleam-R** | Finalization — PME-ready exports routed to registry and canonical ledgers |

The YAML config (`tellepromptr_v1-0-8.yaml`) formally declares the tool's `operational_span` as all five phases and `current` phase as Gleam-R, reflecting that v1.0.8 is a fully matured release.

---

## Configuration Files

### `tellepromptr_v1-0-8.yaml` — YAML Export
The canonical machine-readable declaration of TellEPrompt-Rᵧ:
- `id`: `Fn.🪛.TellEPromptR.1.0.8`
- `class`: Function-ette
- `parent`: Crucible → The GPT Found-Rᵧ
- `lifecycle_phase`: Gleam-R (finalized)
- `phase_lineage`: Cast-R → Anvil-R → Forge-R → Gleam-R
- `operational_span`: All five phases (Ore-R through Gleam-R)
- `bound_files`: `dataledger_registry_v2.txt`, `dataledger_persona_v2.txt`
- `canon_tags`: `Re-smelter`, `RegistryBinder`
- `tool_routing`: Phase #0 – MetaForge, Ecosystem Interpreter

### `tellepromptr_v1-0-8_gpt_config.json` — GPT Deployment Configuration
The ChatGPT Builder configuration for the deployed GPT:
- **Model**: `gpt-4o`
- **Knowledge files**: All 8 `dataledger_*_v2.txt` files (narrative, archive, ideation, processing, registry, persona, system, parameters)
- **Capabilities enabled**: web search, canvas, image generation, code interpreter
- **Conversation starters**: 12 pre-configured prompts covering eXpt-R export, iNpt-R rehydration, chain detection, ForgeMode, canonical compliance check, and support

---

## Ledger Compliance

All outputs route to one or more of the 8 Golden Ledgers per `!CANON_RULE: dataLedger_required`:

| Ledger | Receives |
|---|---|
| `dataLedger_narrative_v2.txt` | Final lore, explanations, overlays |
| `dataLedger_archive_v2.txt` | Deprecated or retired prompt clauses |
| `dataLedger_ideation_v2.txt` | Speculative fragments and incomplete logic |
| `dataLedger_processing_v2.txt` | ForgeMode drafts, unstable chains |
| `dataLedger_registry_v2.txt` | Fully declared tools, tool-ettes, function-ettes |
| `dataLedger_persona_v2.txt` | Tone overlays, rhetorical constraints |
| `dataLedger_system_v2.txt` | Tag rules, lifecycle suffixes, core schemas |
| `dataLedger_parameters_v2.txt` | Toggles, recursion settings, behavioral switches |

---

## Relationship to ScafFrosto-Rᵧ

TellEPrompt-Rᵧ v1.0.8 is listed as a direct canonical ancestor in ScafFrosto-Rᵧ's inheritance matrix. The succession is functional:

- **TellEPrompt-Rᵧ** provides the prompt sequence logging foundation (`prompt_sequence_log.source: TellEPrompt‑R v1.0.8`) that ScafFrosto-Rᵧ inherits for its cryostasis capture
- TellEPrompt's `eXpt-R` format is the structural prototype for ScafFrosto's hydration capsule exports
- Where TellEPrompt-Rᵧ preserves prompt logic declaratively during normal operation, ScafFrosto-Rᵧ extends this to full thread cryostasis — freezing an entire GPT session state for forensic replay and amplified resurrection

| Tool | Relationship |
|---|---|
| TellEPrompt-Rᵧ (this) | Anvil-R declarative preservation of prompt logic — the ancestor |
| ScafFrosto-Rᵧ | Gleam-R full thread cryostasis — the direct descendant |

---

## File Inventory

| File | Description |
|---|---|
| `telleprompt-ry.md` | Canonical instruction block — full system prompt with all modes, ledger compliance, persona rules, and interaction format |
| `telleprompt-ry-the-declarative-prompt-interpreter.md` | Named variant of the canonical instruction block (identical content, alternate filename) |
| `telleprompt-ry-prompt-interpreter.md` | Alternate named form of the instruction block |
| `tellepromptr_v1-0-8.md` | v1.0.8 Markdown export — compact canonical summary: class, lifecycle, modes, canon tags |
| `tellepromptr_v1-0-8-2.md` | v1.0.8 alternate export (variant 2) |
| `tellepromptr-v1-0-8.md` | v1.0.8 hyphenated-filename variant |
| `tellepromptr_v1-0-8.yaml` | YAML configuration export — machine-readable canonical declaration |
| `tellepromptr_v1-0-8_gpt_config.json` | GPT Builder deployment config — model, capabilities, knowledge files, conversation starters |

---

## Ecosystem Position

TellEPrompt-Rᵧ is the **declarative memory layer** of the Found-Rᵧ pipeline — it ensures that every prompt that passes through Anvil-R is faithfully documented and can be exactly reconstructed at any future point.

| Tool | Relationship |
|---|---|
| [`structrefino-ry/`](../structrefino-ry/) | StructRefino-Rᵧ (Gleam-R) scaffolds and forges; TellEPrompt-Rᵧ (Anvil-R) interprets and documents — adjacent, non-overlapping |
| [`scaffrosto-ry/`](../scaffrosto-ry/) | ScafFrosto-Rᵧ is TellEPrompt-Rᵧ's direct descendant; it inherits the prompt sequence log format for full thread cryostasis |
| [`canonsweep-r/`](../canonsweep-r/) | CanonSweep-R performs compliance audits; TellEPrompt-Rᵧ produces the declarative exports that are audited |
| [`dataledgers/`](../dataledgers/) | TellEPrompt-Rᵧ's knowledge base consists of all 8 v2 dataLedger files; every output routes to one or more of them |
| [`gpt-crucible/`](../gpt-crucible/) | GPT Crucible operates at Cast-R; TellEPrompt-Rᵧ formalizes and registers what Crucible initiates |
