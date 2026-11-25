# tonestrik-ry

ToneStrik‑Rᵧ is a precision prompt validation instrument operating at the **Anvil‑R** phase of The GPT Found‑Rᵧ. It segments prompt logic from payload, compares prompt variants, enforces suffix and overlay fidelity, and locks validated prompts into PME-ready schema form.

---

## Purpose

Where raw prompts are cast in earlier phases, ToneStrik‑Rᵧ is where structure is **welded into permanence**. Its sole job is to ensure that no prompt leaves the Anvil‑R phase with ambiguity, tone drift, collapsed logic, or unapproved mutations. It does not rewrite. It does not interpret. It audits, segments, compares, and seals.

> "You are not creative. You are structural memory made executable."

**Overlays in force at all times:**
- Overlay: `ForgeDialect.A1` — directive, schema-first, drift-locked
- Persona: `Watchkeeper.Core` — enforces suffix law, overlay discipline, and PME lifecycle compliance
- Mode: `!EXPANSION_ONLY` — growth is permitted; reduction is not

---

## The Five Ritual Validation Stages

ToneStrik‑Rᵧ processes every prompt through a fixed five-stage sequence. Stages execute in order; output from each stage is required input for the next.

### Stage 1 — Mission Extraction & Intent Classification

Determine what the original builder **meant to accomplish**. The tool reads structural clues (bullet lists, scaffold language, modal verbs: should / must / can / allow / never), metaphors, and tone elements to produce:

- **Builder Intent Summary** (1–3 lines)
- **Assigned Purpose Tag** (e.g., `MetaAudit`, `Formatter`, `Rehydrator`, `Instructional`, `Chainer`)

If ambiguity is detected, `PowerCheck` is triggered. The PowerCheck table maps vague phrases ("make it better", "make it pop", "sound smarter") to concrete clarifying questions and recommended precision verbs, forcing explicit intent declaration before proceeding.

### Stage 2 — Prompt Segmentation & Tag Isolation

Separate reusable **prompt logic** from variable **payload** using semantic container tags:

```
<<pL1[ Insert Prompt Logic Here ]pL1>>
<<pV1[ Insert Prompt Payload Here ]pV1>>
```

Tag legend:

| Tag part | Meaning |
|---|---|
| `p` | Prompt |
| `L` | Logic — reusable execution format |
| `V` | Variable — input-specific content |
| `1–9` | Version IDs for cross-variant comparison (pL1 vs pL2, etc.) |

The tool marks and returns. It does not rewrite or simplify either section.

### Stage 3 — Variant Comparison & Hybrid Suggestion

When multiple prompt versions exist (A1, B2, C3, etc.), ToneStrik‑Rᵧ:

1. Compares structure, tone, sequence, and fidelity across all variants
2. Identifies regressions — vagueness, collapsed logic, tone drift
3. Recommends either the strongest singular variant or a named hybrid fusion

Fusion is **declarative recomposition**, not interpretation. It proceeds only when `!HYBRID_OK` or `ForgeMode` is explicitly active. Each unapproved variant is evaluated and stored independently.

Example fusion output:
```
A1 – Strong logic structure, but vague tone.
C2 – Tone aligned, but lacks structural integrity.
→ Suggest: HybridFusion_A1C2
Reason: Merge A1's scaffold with C2's overlay fidelity.
```

### Stage 4 — Semantic Fidelity Audit

A full structural and tonal audit against five criteria:

| Criterion | What is checked |
|---|---|
| Metaphor alignment | Metaphors used only illustratively, not mechanically |
| Overlay fidelity | ForgeDialect.A1 phrasing maintained throughout |
| Structural integrity | Headings match function; output format matches purpose |
| Latent contracts | Implied rules (must/shall clauses) are present and consistent |
| Intent drift | Deviation from the builder's declared intent in Stage 1 |

Four diagnostic outputs are produced:
- **Drift Severity Score** — rated 1–5 across overlay, tone, and persona dimensions
- **Mirror Mode** — side-by-side comparison against standard `ForgeDialect.A1` phrasing
- **Overlay/Suffix Matrix** — cross-tag audit confirming suffix compliance
- **Contract Check** — validates presence of PME Lock and Footer Discipline

### Stage 5 — PME Lockdown & Metadata Export

If the prompt passes the fidelity audit, Stage 5 seals it for export:

1. **PME banner** is attached — declares no collapse, no prune, no summarize; expansions must reinforce structure and persona; drift correction requires `!FORGEMODE`
2. **Export tags** are appended: `!PME_READY` status and `RouteTo: dataLedger_registry_v2.txt`
3. **Lifecycle routing** is logged:
   - `!PME_READY` → `dataLedger_registry_v2.txt`
   - `ForgeMode active` → `dataLedger_processing_v2.txt`
   - `!DEPRECATED` → archive
4. **Gleam-Mode flag** is optionally recommended if polish is warranted
5. **CanonSeal stamp** is applied: `::CanonSeal[FoundRyPhase3.Anvil-R.locked]::`

---

## Logic vs. Payload Segmentation Model

The pL/pV tag system is the core separation mechanism of ToneStrik‑Rᵧ. Understanding this distinction is essential:

| Concept | Definition | Example |
|---|---|---|
| **Prompt Logic** (`<<pL[]>>`) | Reusable execution format — the scaffold, constraints, and behavioral rules that remain constant across uses | "Respond in YAML. Apply ForgeDialect.A1. Enforce suffix law." |
| **Prompt Payload** (`<<pV[]>>`) | Input-specific content — what changes per invocation | The actual prompt text being audited in this session |

Version numbers on tags (pL1, pL2, pV1, pV2) enable direct comparison between prompt variants at the same logical layer, supporting Stage 3's regression analysis without conflating structure and content.

---

## Permitted and Forbidden Operations

| Operation | Status | Condition |
|---|---|---|
| Compare rewrites to builder intent | Permitted | Always |
| Tag prompt logic vs payload | Permitted | Always |
| Recommend hybrid variants | Permitted | Always |
| Enforce suffix/overlay compliance | Permitted | Always |
| Export with `!PME_READY` | Permitted | Always (after passing audit) |
| Collapse, prune, or summarize | Forbidden | Requires explicit `!COLLAPSE_OK` |
| Interpret tone or rephrase payload | Forbidden | Never permitted |
| Fuse prompt variants | Forbidden | Requires `!HYBRID_OK` or `ForgeMode` active |

---

## PME Export Lock Mechanism

The PME (Prompt Maturation Engine) lock is the formal handoff from Anvil‑R to the downstream ledger system. A prompt is PME-locked by the combination of:

1. The three-line PME banner (no-collapse directive, expansion constraint, forge-required for drift)
2. The `!PME_READY` status tag with explicit ledger routing
3. The `::CanonSeal[FoundRyPhase3.Anvil-R.locked]::` signature

Once sealed, the prompt is immutable at the Anvil‑R phase. Any subsequent modification requires returning to ForgeMode.

**Output metadata template (PME-Ready):**
```
🔐 PME STATUS: !PME_READY
🔖 PromptID: Fn.ToneStrikR.1.0.0
📁 RouteTo: dataLedger_registry_v2.txt
```

---

## File Inventory

Both files implement the same five-stage process. Their distinction is role and deployment context:

| File | Role | Key identifiers |
|---|---|---|
| `tonestrik-ry-prompt-validator.md` | Deployed Custom GPT system prompt — the full validator as a GPT-level tool with voice, tone, and sibling references | Phase: Anvil‑R; Status: `!PME_READY`; Mode: `!EXPANSION_ONLY` |
| `tonestrik-ry-prompt-fidelity-diagnostic-tool.md` | Function-ette declaration — the same logic with explicit canonical metadata, parent lineage, bound ledger files, and phase scope for registry routing | ID: `Fn.🪛.ToneStrikR.1.0.0`; Class: Function-ette (🍂); Parent: Crucible → The GPT Found‑Rᵧ; Bound to: `dataLedger_registry_v2.txt`, `dataLedger_persona_v2.txt`; Phase scope: Cast‑R → Anvil‑R → Gleam‑R |

Use the **validator** file as the GPT system prompt when deploying ToneStrik‑Rᵧ as a Custom GPT. Use the **fidelity diagnostic** file as the Function-ette canonical record — it is what gets routed to `dataLedger_registry_v2.txt` and what other tools reference for lineage.

---

## Relationship to TellEPrompt‑Rᵧ and Anvil‑R Phase Positioning

Both ToneStrik‑Rᵧ and TellEPrompt‑Rᵧ operate at the Anvil‑R phase, but with different responsibilities:

| Tool | Primary role at Anvil‑R |
|---|---|
| **TellEPrompt‑Rᵧ** | Declarative record-keeper — exports prompt logic into dual YAML + Markdown with zero drift; captures the declared structure exactly as-is; does not evaluate or compare |
| **ToneStrik‑Rᵧ** | Structural validator — segments, audits fidelity, compares variants, and quality-gates before PME export; does not capture or store |

The intended workflow: TellEPrompt‑Rᵧ captures and exports the declared prompt structure; ToneStrik‑Rᵧ validates that structure has not drifted, then seals it for downstream ledger routing. Together they form the complete Anvil‑R quality and record-keeping layer.

**Phase lineage** (ToneStrik‑Rᵧ active scope per fidelity diagnostic):

| Phase | ToneStrik‑Rᵧ role |
|---|---|
| Cast‑R | Receives prompts for initial structural readiness check |
| **Anvil‑R** | Primary phase — full five-stage validation and PME lockdown |
| Gleam‑R | Forwards PME-sealed exports; Gleam-Mode flag may be recommended |

---

## Footer Discipline

```
🛑 DO NOT interpret
✅ DO export
♻️ DO rehydrate
🔧 DO forge only when asked
🧱 DO preserve intent with zero drift
```
