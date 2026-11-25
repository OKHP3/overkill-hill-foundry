# CanonSweep-R

**4+1-Step Canonical Ledger Compliance Audit Routine**

CanonSweep-R is a surveillance audit routine for GPT threads. It scans an external thread's entire output history, extracts every clause that should have been ledger-registered, checks whether each one was properly tagged and committed to the correct dataLedger, flags misroutes and write failures, and runs a recovery loop until the thread is either declared compliant or escalated for manual intervention. It enforces the canonical data governance layer of the OverKill Hill P³ ecosystem.

---

## What It Audits

CanonSweep-R targets **external GPT threads** — not the thread it runs in. Before initiating, the operator declares:

- **Thread Name / ID** — what thread is under audit
- **Declared Tool or GPT ID** — the tool registered in `dataLedger_registry_v3.md`
- **Registry File Check** — confirmed present in `dataLedger_registry_v3.md`
- **Tone Check** — declared in `dataLedger_persona_v3.md`

If a tool or entity is active in the thread but absent from the registry, it is immediately flagged as `!RUNG_STATE: Unregistered – CanonUnknown` and routed to `dataLedger_processing_v3.md`.

---

## The 4+1 Step Audit Process

### Step 1 — Canonical Clause Extraction
Scan the full thread archive and harvest all candidates for ledger inclusion:
- Tool, Function, and Function-ette declarations
- Idea sparks and GPT conceptual entries
- Toggle and runtime parameter adjustments
- Persona, tone overlay, and archetype definitions
- Emoji syntax, symbolic systems, and suffix mappings

For each clause: assign the expected `dataLedger_*_v3.md` destination, validate lifecycle tags (`!PME_READY`, `!RUNG_STATE`, `!DRIFT_ALERT`), and flag untagged or misrouted entries.

### Step 2 — Ledger Metadata Comparison
Pull SHA-256 hash, file size, and last-modified timestamp from all 8 canonical ledgers. Cross-check each extracted clause against ledger activity:

- Clause present **and** ledger updated → ✅ Compliant
- Clause present **but** ledger not updated → 🧨 `CanonMismatch` (Write Failure) → routed to `dataLedger_processing_v3.md`

### Step 3 — Legacy Relay Drift Detection
Scan for deprecated threadkeeping infrastructure still in active use:
- Rehydrator (`🪛🍂`)
- Persona Warden (`🪛🍂`)
- Clause Router (`🪛🍂`)
- Memory-local persona binding or drift correction mechanisms

Any detected legacy relay triggers `!DRIFT_ALERT: Legacy Relay Detected` and is routed to `dataLedger_archive_v3.md`.

### Step 4 — CanonCompliance Report
Generate a full compliance matrix:

| Clause ID | Ledger | Lifecycle Tag | Routed? | Committed? | Canon Result |
|---|---|---|---|---|---|
| Tool.🔩.CanonSweepR | dataLedger_registry_v3.md | !PME_READY | ✅ | ✅ | ✅ Compliant |
| [ExampleID] | dataLedger_persona_v3.md | !DRIFT_ALERT | ✅ | ❌ | 🧨 CanonMismatch |

Declare one final status:
- ✅ `!RUNG_STATE: Canonically Compliant`
- 🧨 `!RUNG_STATE: Routing Drift Detected`
- ⚠️ `!RUNG_STATE: Memory Reliance – Manual Intervention Required`

Optionally seal the thread with `!CANON_SEAL: ::CanonSweep-R[Validated.by.{ThreadID}]` → `dataLedger_registry_v3.md`.

### Step 5 ("+1") — Drift Recovery Loop
If any clauses were unregistered, uncommitted, or misrouted, the audit re-enters the loop: run Step 3 → Step 1 → Step 4 again. If tone/persona drift persists, generate a new overlay stub and route to `dataLedger_processing_v3.md`. Once all discrepancies are resolved, declare `!RUNG_STATE: Canonically Cleared ✅`.

---

## When to Invoke

- A thread has been producing outputs for some time and you need to verify it has been properly maintaining canonical compliance.
- A thread is being archived or handed off and requires a final compliance stamp.
- You suspect ledger write failures or misrouting in a running thread.
- A thread references tools or entities that may not be registered.
- A thread shows signs of legacy relay drift (using deprecated persona/routing mechanisms).

---

## Ledger Dependencies

CanonSweep-R audits against all 8 canonical dataledgers. The four most directly referenced in the audit flow are:

| Ledger | Role in Audit |
|---|---|
| `dataLedger_registry_v3.md` | Confirms tool/function registration; receives canon seal |
| `dataLedger_persona_v3.md` | Verifies tone overlay and archetype declarations |
| `dataLedger_processing_v3.md` | Receives unregistered entries, write failures, and recovery outputs |
| `dataLedger_archive_v3.md` | Receives legacy relay drift detections |

---

## File Inventory

| File | Description |
|---|---|
| `canonsweep-r-compliance-routine-v1-0.md` | Original compliance routine file (filename reflects v1.0 lineage; content carries the v1.0.1-WT header, indicating the file was updated in place). More verbose formatting: uses YAML blocks for routing declarations, explicit emoji per clause type, and detailed metadata instructions for Step 2. |
| `canonsweep-r_v1-0-1-wt.md` | Watchtower Edition (v1.0.1-WT) — the current canonical form. Streamlined formatting: uses plain text routing blocks, tightened step descriptions, same 5-step structure. Preferred version for embedding into GPT instruction systems. |

**Key difference between versions:** The Watchtower Edition removes YAML wrapper syntax from routing tags (replacing them with plain text blocks) and tightens the Step 2 metadata check language, but the functional audit logic is identical across both files.

---

## Ecosystem Role

CanonSweep-R is a governance utility — it sits above the standard prompt execution pipeline as a **compliance surveillance layer**. It does not produce content; it audits content produced elsewhere.

Within the OverKill Hill P³ ecosystem:
- **Audits outputs from:** ArcSyntrixo-Rᵧ, TellePrompt-Rᵧ, ScafFrosto-Rᵧ, PhenoMould-Rᵧ, and any other Cast-Rᵧ or Gleam-Rᵧ phase tools that write to the dataledgers
- **Reports to:** `dataLedger_registry_v3.md` (compliance seals), `dataLedger_processing_v3.md` (failures and recovery work)
- **Registered as:** a `🪛` Function-ette in `dataLedger_registry_v3.md`
- **Portability:** designed for OverKill Hill P³ but portable to Glee-fully and Found-Rᵧ with suffix injection
