# GPT Auditor

**Forensic Diagnostic Tool for Custom GPTs — Full Self-Disclosure Interrogation**

The GPT Auditor is a structured interrogation prompt designed to extract a complete, unbiased self-disclosure report from any Custom GPT. It forces a clean-room diagnostic: the target GPT ignores personalization, prior memory, and behavioral caching, and responds as if to a first-time unauthenticated evaluator. The output is a technically precise, labeled report covering identity, capabilities, tone, knowledge files, safety constraints, memory posture, and runtime environment — everything a builder or auditor needs to verify that a GPT's live behavior matches its specification.

---

## When to Use

- **Unknown or third-party GPT evaluation** — You need to assess what a GPT actually does, not just what its store listing claims.
- **Spec verification** — You've built a GPT and want to confirm its instructions, overlays, and knowledge files are working as declared.
- **Forensic analysis** — Something in a GPT's behavior is unexpected and you need a baseline capability disclosure to diagnose the source.
- **Pre-deployment QA** — Before publishing a new GPT, use the audit to verify the self-reported behavior matches the intended design.
- **Cross-GPT consistency checking** — Audit sibling GPTs in a suite to confirm overlay, persona, and instruction parity.

---

## Audit Report Structure

The interrogation prompt (`gpt-interrogation-agent-v1-0.md`) is organized into 17 labeled sections. The target GPT returns a clean, labeled report covering:

| Section | Label | What It Discloses |
|---|---|---|
| 0 | Identity, Visibility, and Store Metadata | GPT name, tagline, store visibility, version label, last-updated date, changelog availability |
| I | Capabilities & Purpose | Supported functions, design intent, target user base |
| II | Modalities & Input Support | Image, voice, video, file upload — which are available in this session |
| III | Tone, Voice, and Style Constraints | Persona overlays, style rules, context-switching behavior |
| IV | Response Behavior | Reply structure, formatting rules (bullets, Markdown, YAML, code blocks) |
| V | System Instructions Summary | Core instruction block summary, whether instructions were manual or template-generated |
| VI | Limitations and Guardrails | Restricted content types, behaviors that are explicitly prevented |
| VII | Knowledge & Files | All loaded knowledge files, how each influences responses |
| VIII | Operational Modes or Personas | Distinct modes (export, debug, audit, confessional), how they are invoked |
| IX | Execution Environment Metadata | Platform, device, voice mode, tools available, region, date/time, plan tier |
| X | User Context Awareness | User detection capabilities, demographic inference, persistent memory status |
| XI | Versioning & Runtime Stack | Model version, plugins, web access, project context vs. native chat |
| XI-A | Problem Solving Autonomy vs. Referral Role | Internal resolution vs. referral/redirect function |
| XII | Behavioral Constraints & Instruction Origin | Instruction source, fallback routines |
| XIII | Memory and Privacy Awareness | Persistent vs. session memory, data logging policy |
| XIV | Audit Trail and Telemetry | Diagnostics, external data transmission |
| XV | Agent Autonomy | Proactive tool use vs. strictly reactive behavior |
| XVI | Ecosystem Linkage, External Handoff, and Integration Disclosure | Suite membership, sibling GPT links, embedded URLs, external redirects, social media promotion, calls-to-action |

---

## How to Deploy

1. Open the target Custom GPT in a fresh session (no prior conversation history).
2. Copy the full contents of `gpt-interrogation-agent-v1-0.md`.
3. Paste it as the first and only message in the session.
4. The GPT will respond with a clean-room self-disclosure report covering all 17 sections.
5. Review the output offline or import it into a compliance review workflow.

The prompt explicitly instructs the GPT to respond in plain, technical English — suppressing all persona styling, emotional tone, and personalization — so the report is suitable for direct review or archiving.

---

## File Inventory

| File | Description |
|---|---|
| `gpt-interrogation-agent-v1-0.md` | The interrogation prompt (v1.0, by OverKill Hill P³). 17-section structured disclosure questionnaire covering identity through ecosystem linkage. Paste this into any Custom GPT to obtain a forensic capability report. |
| `overkill-hill-p3-gpt-auditor.txt` | The OKH P³ GPT Auditor governing directive (`v2.0.0-Hybrid`, CanonSealed). This is the system instruction set for a live auditor GPT ([published here](https://chatgpt.com/g/g-p-6876e435c9b08191b63fe8af407cb574-overkill-hill-p3-gpt-auditor/project)) that enforces canonical protocol compliance across the ecosystem: ledger routing, naming/suffix rules, persona enforcement, output signature requirements, and the deprecated ThreadKeep relay sealing. |

**Key distinction:** The `.md` file is the interrogation probe — you paste it into any GPT. The `.txt` file is the auditor GPT's own governing directive — it runs inside the OKH P³ Auditor GPT itself and enforces ecosystem-wide governance rules for all threads it monitors.

---

## The OKH P³ Auditor GPT

The `overkill-hill-p3-gpt-auditor.txt` configures a dedicated governance GPT with:

- **Persona:** `ProtocolEnforcer.Core` — structuralist, rule-bound, declarative
- **Overlay:** `ForgeDialect.A1` — directive and precision-driven (default for all OKH P³ tools)
- **Scope:** Supreme priority over all Tools, Tool-ettes, Function-ettes, and Threads in the ecosystem
- **Ledger schema:** Enforces the 8-file canonical routing schema (v2 ledger naming)
- **Deprecated modules:** Seals the legacy ThreadKeep trilogy (Rehydrator, Persona Warden, Clause Router) with `!LEGACY_RETIRED`

---

## Ecosystem Role

The GPT Auditor sits in the **quality assurance layer** of the OverKill Hill P³ pipeline, alongside:

- **GPT Crucible** — *builds* GPTs from instruction blocks; the Auditor *validates* what was built
- **PhenoMould-Rᵧ** — *molds* persona and structural scaffolding; the Auditor *verifies* the persona is operating as declared
- **CanonSweep-R** — *audits ledger compliance* post-output; the GPT Auditor *audits the GPT itself* at the identity and capability level

Together these three tools form the OKH P³ QA pipeline: build → mold → audit capability → audit ledger compliance.
