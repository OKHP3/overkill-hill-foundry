# PhenoMould-Rᵧ

**The canonical GPT mold-caster of the GPT Found-Rᵧ. Active successor to Crucible.**

PhenoMould-Rᵧ is the primary schema-bound Tool-Rᵧ for constructing Custom GPTs within the OverKill Hill P³ ecosystem. It casts GPTs in the expressive, tonal, and functional likeness of their builder — enforcing suffix law, persona overlays, lifecycle tags, hydration metadata, and PME-readiness from ideation through publication. It is not a chatbot or general assistant: it is a mold-caster.

**Canonical ID:** `Tool.🪚.PhenoMould-R.2.0`  
**Live GPT:** [PhenoMould-R — OverKill Hill P³](https://chatgpt.com/g/g-688a6b04358481919447ddfaf50a00b2-phenomould-r-overkill-hill-p3)

---

## Succession Notice

Crucible (archived in [`gpt-crucible/`](../gpt-crucible/)) was the original monolithic GPT Builder Tool for this ecosystem. PhenoMould-Rᵧ is its formally declared canonical successor, registered as such in every version from v1.0 onward. Crucible remains preserved for lineage traceability; PhenoMould-Rᵧ is the active forge.

---

## What PhenoMould-Rᵧ Does

PhenoMould-Rᵧ operates at the **Cast-R → Anvil-R** phases of the Found-Rᵧ six-phase lifecycle. Given a builder's idea, tone description, or draft prompt, it:

1. **Captures builder voice** — mirrors phrasing density, emotional cadence, metaphor usage, and stylistic fingerprint into the casted GPT
2. **Enforces suffix governance** — auto-assigns the correct suffix (`-R`) and emoji per entity type (🪚 Tool, 🔩 Tool-ette, ⚙️ Function, 🪛 Function-ette); rejects or corrects violations
3. **Injects persona overlays** — pairs a declared overlay (e.g., `ForgeDialect.A1`) with a matching persona (e.g., `Watchkeeper.Core`); never defaults to generic ChatGPT tone
4. **Simulates pre-deployment behavior** — runs multi-turn Assistant/User dialogues to prove tone, logic, and edge-case handling before the GPT goes live
5. **Embeds hydration metadata** — produces hydration blocks (gpt_id, overlay, persona, suffix, cast_phase, validator_status) compatible with `dataLedger_hydration_v3.md` for cross-thread transport
6. **Routes outputs canonically** — specifies which `dataLedger_*_v3.md` file receives each output (registry, narrative, persona, parameters); blocks routing to legacy v2 ledgers
7. **Locks CanonSeal and PME status** — issues `::CanonSeal[ToolName.vX.X.X.locked]::` and `!PME_READY` only after overlay, suffix, simulation, and hydration validation all pass

---

## Canonical Configuration

```yaml
type:         Tool (🪚 / 🌵)
overlay:      ForgeDialect.A1
persona:      Watchkeeper.Core
cast_phase:   Cast-R → Anvil-R
model:        GPT-4o
capabilities: Web Search, Canvas, 4o Image Generation, Code Interpreter & Data Analysis
status:       PME_READY
canon_seal:   PhenoMould-R.v2.0.locked
```

**Linked ledgers (knowledge files):**
- `dataLedger_registry_v3.md` — canonical entity registry
- `dataLedger_persona_v3.md` — overlay and persona definitions
- `dataLedger_parameters_v3.md` — execution parameters and toggles
- `dataLedger_system_v3.md` — suffix schema and emoji taxonomy
- `dataLedger_hydration_v3.md` — hydration block schema
- `dataLedger_narrative_v3.md` — narrative ledger for output routing
- `dehydration-manifest-v3-0.md` — dehydration/rehydration manifest
- `PhenoMould-R Capabilities.md` — full capability narrative

---

## Version History

| Version | File | Lifecycle Phase | Key Addition |
|---|---|---|---|
| **v1.0** | `phenomould-ry-v1-0.md` | Cast-R → Anvil-R | First canonical manifest. 34 canonical principles declared. `CastFromTemplate-R` function registered. Crucible formally succeeded. |
| **v1.1a** | `phenomould-ry-v1-1a.md` | Cast-R → Anvil-R → Gleam-R | Payload expansion with deeper functional integration and embedded scaffolds from aligned Found-Rᵧ tools. |
| **v1.1** | `phenomould-ry-v1-1.md` | Cast-R → Anvil-R → Gleam-R | Recursive Casting Integration; Prompt Fidelity Verification (ToneStrik-Rᵧ alignment); Hydration Scaffold Injection; Validator Compatibility Mode; Output Export Expansion (2025.07.23 schema). |
| **v1.2** | `phenomould-ry-v1-2.md` | Cast-R → Anvil-R → Gleam-R | Added the Creed of PhenoMould-Rᵧ. Crucible formally tombstoned; PhenoMould-Rᵧ declared gold-standard schema-bound mold engine. |
| **v1.3** | `phenomould-ry-v1-3.md` | Cast-R → Anvil-R → Gleam-R | Heavyweight Forge Mode. Updated Creed; precision casting scaffold governance hardened. |
| **v1.3b** | `phenomould-ry-v1-3b.md` | Cast-R → Anvil-R → Gleam-R | Full Payload BEEF Edition. Annotated canonical registration YAML; fully expanded operational payload. |
| **v2.0** | `phenomould-ry-v2-0-*.md` | Cast-R → Anvil-R | Streamlined into deployable instruction block format. Live on ChatGPT Builder. Hydration requirements formalized. PME-Readiness Enforcement codified. ForgeDialect.A1-locked. |

The v2.0 release splits across three files:
- `phenomould-ry-v2-0-instruction.md` — the deployed system instruction block
- `phenomould-ry-v2-0-capabilities.md` — the full capability narrative (uploaded as knowledge)
- `phenomould-ry-v2-0-build-out.md` — the ChatGPT Builder UI configuration record (name, description, conversation starters, knowledge files, capabilities)

---

## GPT Manifest

`gpt_manifest_phenomould-r.yaml` is the machine-readable canonical registration record for PhenoMould-Rᵧ v2.0. It declares the tool's suffix, type, overlay, persona, cast phase, CanonSeal, instruction block status, linked ledgers, and bound project — providing a single authoritative source for any tool that needs to reference or route to PhenoMould-Rᵧ.

---

## PME-Readiness Rules

PhenoMould-Rᵧ will only apply `!PME_READY` to a casted GPT when all five gates pass:

1. Overlay and persona are declared (not inferred)
2. Hydration metadata block is present and complete
3. Instruction block contains at least one output preview or simulation
4. Suffix is valid per the canonical suffix table
5. CanonSeal is declared or explicitly marked pending

Any cast that fails a gate is returned for correction, not published.

---

## Pipeline Position

| Stage | Tool | Role |
|---|---|---|
| **Upstream** | [`gpt-wizard/`](../gpt-wizard/) | Design consultation and master template reference |
| **Upstream** | [`scaffrosto-ry/`](../scaffrosto-ry/) | Prompt scaffold templates that PhenoMould-Rᵧ draws from |
| **← Here →** | **PhenoMould-Rᵧ** | Mold-casting: captures voice, enforces structure, simulates, hydrates, seals |
| **Downstream** | [`structrefino-ry/`](../structrefino-ry/) | Post-cast structural refinement of instruction blocks |
| **Downstream** | [`telleprompt-ry/`](../telleprompt-ry/) | Prompt delivery and presentation layer after cast |
| **Audit** | [`gpt-auditor/`](../gpt-auditor/) | Validates finished GPT configurations produced by this tool |
| **Tone audit** | [`tonestrik-ry/`](../tonestrik-ry/) | Post-build tone drift detection aligned with cast overlays |

---

## File Inventory

| File | Description |
|---|---|
| `phenomould-ry-v1-0.md` | v1.0 canonical manifest — first declaration, 34 principles, CastFromTemplate-R function |
| `phenomould-ry-v1-1a.md` | v1.1a — payload expansion and deeper ecosystem integration |
| `phenomould-ry-v1-1.md` | v1.1 — recursive casting, hydration scaffold, validator compatibility |
| `phenomould-ry-v1-2.md` | v1.2 — Creed added, Crucible tombstoned |
| `phenomould-ry-v1-3.md` | v1.3 — Heavyweight Forge Mode |
| `phenomould-ry-v1-3b.md` | v1.3b — Full Payload BEEF Edition with annotated YAML |
| `phenomould-ry-v2-0-instruction.md` | v2.0 system instruction block (deployed) |
| `phenomould-ry-v2-0-capabilities.md` | v2.0 capability narrative (knowledge file) |
| `phenomould-ry-v2-0-build-out.md` | v2.0 ChatGPT Builder UI configuration record |
| `gpt_manifest_phenomould-r.yaml` | Machine-readable canonical registration for v2.0 |
