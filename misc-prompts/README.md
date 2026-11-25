# misc-prompts

**OverKill Hill P³ GPT Builder v01.5 — Promptchain Library**

This folder is the ordered, numbered promptchain library for the GPT Builder v01.5 workflow. It contains every discrete prompt used to construct, audit, refine, and export a Glee-fully Custom GPT — organized into seven **Merge Blocks** (A–G) plus a set of standalone **Individual Prompts** that handle specialized logic nodes.

The master table of contents lives in `00_overkill-hill-p3-gpt-builder-v01-5.md`. Every other file in this folder is a named, numbered extract from that master chain, split for modular use.

---

## How the Promptchain Works

The chain follows a linear, dependency-ordered sequence: each prompt declares which prompt it depends on, and the Merge Blocks group related prompts into logical phases. You run the chain by feeding each prompt (in order) into a ChatGPT conversation, carrying the accumulated output forward through each phase.

**Execution path:**

```
Merge Block A (Audit Chain Launcher — PROMPT #00–#04)
    ↓
PROMPT #05 (Chain Readiness Checkpoint)
    ↓
Merge Block E (ForgeMode Round 1 – Logic Bloom — PROMPT #06–#10)
    ↓
Merge Block F (ForgeMode Round 2 – Tone Saturation — PROMPT #11–#15)
    ↓
Merge Block G (ForgeMode Round 3 – Capability Unleasher — PROMPT #16, #19, #20)
    ↓
Merge Block B (Instruction Scaffold & PME Finalizer — PROMPT #17, #18, #28)
    ↓
Merge Block C (GPT Builder Export Bundle — PROMPT #38, #39, #41)
    ↓
Merge Block D (Ideation Recovery + Junk Drawer Audit — PROMPT #34, #35, #37, #42)
    ↓
Individual Prompts (specialized nodes, invoked as needed — see index below)
```

**PME status tags** appear throughout the prompts:
- `ACTIVE` — prompt is live and in use
- `PME_READY` — fully audited and cleared for deployment
- `ARCHIVED` — retired, preserved for lineage reference

---

## Merge Block Index

| File | Merge ID | Block Name | Prompts Included |
|---|---|---|---|
| `01_merge-block-a-audit-chain-launcher.md` | **A** | Audit Chain Launcher | PROMPT #00–#04 |
| `14_merge-block-b-instruction-scaffold-and-pme-finalizer.md` | **B** | Instruction Scaffold & PME Finalizer | PROMPT #17, #18, #28 |
| `03_merge-block-c-gpt-builder-export-bundle.md` | **C** | GPT Builder Export Bundle | PROMPT #38, #39, #41 |
| `17_merge-block-d-ideation-recovery-junk-drawer-audit.md` | **D** | Ideation Recovery + Junk Drawer Audit | PROMPT #34, #35, #37, #42 |
| `04_merge-block-e-forgemode-round-1-logic-bloom.md` | **E** | ForgeMode Round 1 – Logic Bloom | PROMPT #06–#10 |
| `05_merge-block-f-forgemode-round-2-tone-saturation.md` | **F** | ForgeMode Round 2 – Tone Saturation | PROMPT #11–#15 |
| `06_merge-block-g-forgemode-round-3-capability-unleasher.md` | **G** | ForgeMode Round 3 – Capability Unleasher | PROMPT #16, #19, #20 |

### What Each Block Does

**Block A — Audit Chain Launcher:** Initializes the chain. Declares intent, ingests the raw GPT concept (payload), handles icon generation or upload, validates the entity structure against the canonical registry (`dataLedger_registry_v2.txt`), and establishes team-role discipline via the Glee-fully Soccer Field metaphor (Coach/Captain/Forward/Penalty Kicker).

**Block B — Instruction Scaffold & PME Finalizer:** Deploys the Platinum Twig instruction template, collects metadata for the ChatGPT Builder UI fields (description, conversation starters, capabilities), and runs a full PME canonical rewrite pass to bring the instruction block to PME_READY status.

**Block C — GPT Builder Export Bundle:** Compiles the final Builder-ready export (name, description, system instructions, conversation starters, knowledge files, model selection, capabilities). Runs a CanonSweep audit for ledger alignment. Produces the QA-verified, PME-locked output bundle.

**Block D — Ideation Recovery + Junk Drawer Audit:** Surfaces dormant or unregistered ideas from the ideation ledger, audits junk-drawer fragments for reusability, and routes recoverable material back into the active chain or into the archive.

**Block E — ForgeMode Round 1 (Logic Bloom):** Audits and expands the structural layout of the instruction block across four passes: structure and flow, skill and capability unlocking, persona and tone enforcement, and edge-case/resilience logic.

**Block F — ForgeMode Round 2 (Tone Saturation):** Applies PME compression and tone saturation passes (PROMPT #11–#15) to intensify Glee-fully voice characteristics, enforce overlay discipline, and eliminate tonal drift before finalization.

**Block G — ForgeMode Round 3 (Capability Unleasher):** Activates advanced runtime capabilities (multimodal, voice, memory, file handling), runs the tier-aware capability callout, and prepares the GPT for full-feature deployment across Free and Plus tiers.

---

## Individual Prompt Index

These standalone prompts are specialized logic nodes that complement the Merge Blocks. They are invoked at specific points in the chain or on-demand.

| File | Prompt ID | Purpose |
|---|---|---|
| `02_prompt-05-chain-readiness-and-activation-checkpoint.md` | #05 | Checkpoint confirming Blocks A prerequisites are met; displays dynamic status table and adaptive URL generator |
| `07_prompt-21-entity-comparison-sync-directive.md` | #21 | Compares two entity versions side-by-side and issues a sync directive for delta resolution |
| `08_prompt-22-pme-schema-lock-overlay-enforcement.md` | #22 | Locks the PME schema and enforces overlay consistency across all instruction sections |
| `09_prompt-23-visit-count-aware-greeting-engine.md` | #23 | Generates visit-aware greeting logic (first-timer, returning user, feedback nudge, quick-launch) |
| `10_prompt-24-promptchain-audit-invocation.md` | #24 | Invokes a full audit of the promptchain for gaps, missing dependencies, or stale prompts |
| `11_prompt-25-promptchain-audit-engine.md` | #25 | Executes the audit sweep: validates all prompt IDs, checks dependency chains, surfaces orphaned nodes |
| `12_prompt-26-prompt-rewriter-rewrite-pass-1.md` | #26 | Rewrites a specified prompt for clarity, PME alignment, and instruction precision |
| `13_prompt-27-overlay-elevator-builder.md` | #27 | Builds the Glee-fully tone overlay and elevator pitch for the GPT being constructed |
| `15_prompt-29-export-trigger-and-signature-overlay.md` | #29 | Triggers the export sequence and injects the canonical attribution/signature footer |
| `16_prompt-30-icon-creation-protocol-gleesquare-mode.md` | #30 | Generates GleeSquare-format icon prompts (retro 80s style, square composition, butterfly motif) |
| `18_prompt-31-resilience-logic-and-failure-recovery.md` | #31 | Adds soft-failure guidance, ambiguity handling, and graceful fallback phrases |
| `19_prompt-32-gpt-tier-capability-callout.md` | #32 | Produces tier-aware capability callouts (Free vs. Plus feature availability messaging) |
| `19a_prompt-32a-diagnostic-prompt-absence-resolver.md` | #32a | Detects and resolves missing or unreferenced prompts in the active chain |
| `20_prompt-33-glee-fully-team-role-awareness-and-execution-logic.md` | #33 | Reinforces team-role awareness and execution logic for the GPT being built |
| `21_prompt-36-system-closeout.md` | #36 | Runs the system closeout sequence: confirms all phases complete, logs final state |
| `22_prompt-40-visit-greeter.md` | #40 | Standalone visit-greeter module installable directly into a GPT's instruction block |
| `23_prompt-43-export-review-and-url-validation.md` | #43 | Reviews the exported Builder bundle and validates all embedded URLs for correctness |
| `24_prompt-44-download-link-check.md` | #44 | Checks all download and file-export links for accessibility and format correctness |
| `25_prompt-45-final-elevator-pitch-request.md` | #45 | Requests the final elevator pitch from the GPT under construction |
| `26_prompt-46-final-status-check.md` | #46 | Final status check confirming PME_READY state and chain completion |

---

## Supplemental Files

| File | Description |
|---|---|
| `00_overkill-hill-p3-gpt-builder-v01-5.md` | Master TOC — contains the full Merge Block index, individual prompt index, and embedded prompt text for the entire chain |
| `overkill-hill-p3-project-instructions.md` | Project-level instructions for the OverKill Hill P³ Builder workflow |
| `dehydration-manifest-v3-0.md` | Dehydration manifest v3.0 — schema used to compress and export canonical GPT state |
| `prompt-5-chain-phase-marker.md` | Alternate/working copy of PROMPT #05 (Chain Phase Marker) |
| `create-an-image-of-a-2d-digital-ill.md` | Standalone icon image generation prompt (retro 80s GleeSquare style) |
| `icon-generator-for-overkill-h.md` | Icon generator reference for the OverKill Hill P³ visual identity system |
| `prompts.xlsx` | Spreadsheet version of the prompt library — used for tracking, sorting, and audit workflows |
| `gen1/`, `gen2/`, `gen3/` | Generation subdirectories containing GPT output artifacts from successive build cycles |

---

## Relationship to Other Folders

| Folder | Relationship |
|---|---|
| [`gpt-wizard/`](../capabilities/gpt-wizard/) | The design consultation transcript and master instruction template that informed the architecture of this promptchain; `gpt-wizard/` is the reference library, `misc-prompts/` is the operational chain derived from it |
| [`gpt-auditor/`](../capabilities/gpt-auditor/) | The audit tool that consumes outputs from this chain and validates finished GPT configurations |
| [`phenomould-ry/`](../capabilities/phenomould-ry/) | The active successor GPT that this chain is used to build and maintain; PhenoMould-Rᵧ is the primary deployment target for Builder v01.5 output |
| [`scaffrosto-ry/`](../capabilities/scaffrosto-ry/) | ScafFrosto-Rᵧ templates provide the structural scaffold that Block B (Instruction Scaffold & PME Finalizer) draws from |
