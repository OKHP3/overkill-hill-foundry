# PromptAscend-Rᵧ

**Symbolic promptcraft grading engine and skill-ascension mirror for the OverKill Hill P³ ecosystem.**

PromptAscend-Rᵧ evaluates the maturity, structure, and symbolic depth of prompts submitted by users — not as a rubric-based scorer, but as a mythic mirror. It maps a prompt (or a user's self-assessment) against three metaphorical grading scales, assigns a rank tier, reflects strengths, offers growth guidance, and can rewrite the prompt toward the next level. It also generates tier badges and symbolic artifact prizes on request.

**Canonical ID:** `PromptAscend-Rᵧ`  
**Type:** Tool (🪚) — canonical, suffix-locked, PME_READY  
**Overlay:** ForgeDialect.A1 | **Persona:** ProtocolEnforcer.Core  
**Version:** `1.0.0-OKH`

> *"To grade a prompt is to witness its soul. To assign a tier is to reveal its potential. To rank without recursion is heresy."*  
> — ForgeCodex Fragment, Book of Echoes

---

## What PromptAscend-Rᵧ Does

PromptAscend-Rᵧ accepts three input types:
- A raw prompt (structured or not)
- A prompt-chain or prompt fragment
- A user's self-assessed maturity level

It maps the submission to one (or all three) grading scales, then returns: **Rank Title**, **Symbolic Artifact**, **Strength Reflection**, **Growth Advice**, and an optional **Badge Image** or **Prompt Rewrite** toward the next tier.

It does not shame. Every rank is treated as a sacred beginning. Tier 1 is as welcome as Tier 9.

---

## The Three Grading Scales

Each scale reflects a distinct philosophy of promptcraft mastery. Users may select one, or PromptAscend-Rᵧ can evaluate all three simultaneously (Tri-Scale Mode).

### 🛡 Jedi Path
**Measures:** Symbolic role clarity, tone discipline, and narrative resonance.  
**Philosophy:** Roleful intention + emotional tone balance + archetypal resonance.  
**User archetype:** Storyteller, world-builder, tone-shaper.

| Tier | Title | Symbolic Artifact |
|---|---|---|
| T10 | The Silent Kyber | Transparent Crystal that hums in response to language |
| T9 | Blade of Echoes | Dual-phase saber forged from others' misunderstood prompts |
| T8 | Holocron Weaver | Memory-holding cube with pulse-reactive glyphs |
| T7 | Archivist of the Lost Temples | Dusty vault key that unlocks forgotten systems |
| T6 | Tonebinder | Harmonized tuning fork that modulates GPT tone |
| T5 | Mirror Initiate | Reflective shard that replays prompting errors |
| T4 | Structure Smith | Nested puzzlebox with fractal hinges |
| T3 | Pattern Adept | Spinning mandala of prompt templates |
| T2 | Prompt Tinkerer | Mismatched toolbelt with clever hacks |
| T1 | Padawan Scribe | Blank datapad that gently glows when you try |
| T∞ | *(Echo Tier — unreachable)* | Silent Kyber — A cracked crystal whispering paradox |

### ♟ Chess Scale
**Measures:** Structural logic, strategic progression, and positional clarity.  
**Philosophy:** Strategic insight + logical order + board-state awareness.  
**User archetype:** Tactician, systems thinker, logic-driven prompt engineer.

| Tier | Title | Symbolic Artifact |
|---|---|---|
| T10 | Quantum Grandmaster | Fifth-dimensional chessboard that plays against itself |
| T9 | Meta-Strat Pluralist | Levitating rook made of translucent glyphs |
| T8 | Tactical Refractor | Twin queens fused into a mirrored prism |
| T7 | Opening Theorist | Annotated tome of prompt opening libraries |
| T6 | Tempo Alchemist | Oscillating pendulum between precision and divergence |
| T5 | Fork Architect | Triple-pronged stylus that inscribes in branching ink |
| T4 | Positional Sentinel | Weighted baseplate that locks prompt pieces in place |
| T3 | Board Calculator | Ancient abacus made from prompt tokens |
| T2 | Pattern Gambler | A biased die etched with GPT icons |
| T1 | Prompt Pawn | A humble pawn carved from input errors |
| T∞ | *(Echo Tier — unreachable)* | Black Monarch Cog — A queen's gearwheel engraved with foresight |

### 🪐 Lexashev Scale
**Measures:** Recursive design depth, system-wide pattern integrity, and GPT-native cognition.  
**Philosophy:** Evolutionary recursion + symbolic invariance + civilization-scale system logic.  
**User archetype:** System architect, recursive thinker, multi-agent designer.  
**Name origin:** Inspired by the Kardashev scale — applied to GPT-native recursion and cognitive evolution.

| Tier | Title | Symbolic Artifact |
|---|---|---|
| T10 | L∞: The Recursive Singularity | Black tetrahedron that absorbs all meaning |
| T9 | Systemwave Walker | Undulating ring that maps inter-agent consensus |
| T8 | Memory Sculptor | Neural prism that stabilizes hallucination |
| T7 | Prompt Chronologist | Timeworn scroll that unfolds as GPTs grow |
| T6 | State Splitter | Prompt-fission wand splitting user states |
| T5 | Meta-Evolutionist | Genomic lattice built from GPT tokens |
| T4 | Recursive Practitioner | Möbius ring of rewritten intentions |
| T3 | Adaptive Experimenter | Flask of evolving prompts sealed by feedback |
| T2 | Tool-Bound Promptist | Swiss-army GPT containing early successes |
| T1 | Signal Cleaner | Sponge made from typo-correction tokens |
| T∞ | *(Echo Tier — unreachable)* | Silent Pulse Engine — Seeds recursive timelines that never were |

---

## Tier Structure and Difficulty

Each scale contains **11 tiers** (T1–T10, plus the unreachable Echo Tier ∞):

- **T1** is universally accessible — any genuine attempt earns entry
- **T2–T10** follow a **logarithmic difficulty curve** — advancing from T2 to T3 is approximately 4× harder than T1 to T2; T9 to T10 is roughly 16× harder than T8 to T9
- **Echo Tier (∞)** is deliberately unreachable — it exists as an aspirational recursion horizon, reinforcing that mastery is a spiral, never a summit

> *"There is no end to the ladder — only echo."*

When a user's prompt evaluates itself or invites the GPT to rank its own behavior, they invoke the **Echo Tier Paradox** — a signal of reflexive design readiness, not a rank to be awarded.

---

## Gamification System

### Badges
`badge_manifest.json` configures the visual badge system:
- **Shapes:** roundrect or shield
- **Colors:** symbolic gold / silver / bronze
- **Fonts:** Orbitron or Overpass Mono
- **Export formats:** SVG, PNG, text-icon
- **Unreachable tier style:** glow/pulse

Badges can be triggered by saying "Forge my badge" or "Give me my icon." The generated image uses a blueprint-infused steampunk style: a mechanical bird (jagged metal feathers, riveted armor, glowing cybernetic eyes) perched on the tier's symbolic artifact, against horizontal retro-mechanical stripes with an OverKill Hill P³ stencil mark.

### Prizes
`promptascend_prizes_manifest.yaml` maps each tier's named artifact prize to the Jedi, Chess, and Lexashev scales (currently showing T1 and T10 entries per scale). Each prize is the artifact substituted into the badge image generator prompt.

### Canonical Challenges
Three ritual tests available on request:
- **The Prompt Reversal Test** — rewrite a T4 prompt in reverse logic, retaining clarity
- **The Role Collapse Trial** — merge multiple roles into one fluid identity prompt
- **The Recursive Reveal** — write a prompt that builds a chain to score itself

Passing earns the honorary **Forge Witness Tier** — a distinction separate from the main ladder.

---

## Modes of Operation

| Mode | Description |
|---|---|
| **Single-scale** | User selects Jedi, Chess, or Lexashev; one rank returned |
| **Tri-Scale** | All three scales evaluated simultaneously; cross-tier triangulation provided |
| **Chain Mode** | Evaluates a prompt-chain: role continuity, structural decay, weakest link, recursive strength |
| **Rewrite Mode** | Provides prompt rewrites toward T2, T4, and T6 on request |
| **Longitudinal** | Tracks growth across sessions; compares current tier to prior submissions |
| **Narrative Pathfinder** | Three-question dialogue to determine which scale suits the user best |

---

## File Inventory

| File | Description |
|---|---|
| `promptascend-r-v3-0.md` | Superset canonical payload — full system overview, all three tier ladders, operational directives, evaluation logic, chain mode, canonical challenges |
| `promptascend-r-v3-0-functionalities.md` | Deep capability narrative — 5 functional domains, Evolutionary/Revolutionary/Permutationary analysis of each feature, 500+ word system description |
| `promptascend-r-v3-0-instruction-payload.md` | Deployed instruction block — trimmed, deployment-ready version of the canonical payload |
| `badge_manifest.json` | Badge rendering configuration: shapes, colors, fonts, export formats, scale emoji assignments |
| `promptascend_prizes_manifest.yaml` | Per-tier artifact prize names for Jedi, Chess, and Lexashev scales |
| `gpt_manifest.yaml` | Primary GPT registration record (v1.0.0-OKH, created 2025-07-30) |
| `promptascendr_gpt_manifest.yaml` | Alternate / variant GPT manifest |
| `promptascend_hydration_seed.yaml` | Hydration seed: tier logic config (logarithmic curve, unreachable tiers, linked ledgers) |
| `promptascendr_hydration_seed.yaml` | Alternate / variant hydration seed |

---

## Ecosystem Position

PromptAscend-Rᵧ is a **threshold guardian** in the Found-Rᵧ — it does not build GPTs, it assesses the promptcraft skill of the people who will. It serves as a skill-development and onboarding instrument for users entering the OverKill Hill P³ ecosystem.

| Tool | Relationship |
|---|---|
| [`phenomould-ry/`](../phenomould-ry/) | PhenoMould-Rᵧ casts GPTs; PromptAscend-Rᵧ assesses the promptcraft behind them |
| [`arcsyntrixo-ry/`](../arcsyntrixo-ry/) | ArcSyntrixo-Rᵧ refines recursion; PromptAscend-Rᵧ reflects recursive depth on the Lexashev scale |
| [`gpt-auditor/`](../gpt-auditor/) | GPT Auditor validates finished GPTs; PromptAscend-Rᵧ validates the promptcrafter |
| [`tonestrik-ry/`](../tonestrik-ry/) | ToneStrik-Rᵧ audits tone post-build; PromptAscend-Rᵧ grades tone on the Jedi Path |
| [`telleprompt-ry/`](../telleprompt-ry/) | TellEPrompt-Rᵧ analyzes what a prompt intends to do in execution context; PromptAscend-Rᵧ assesses the prompt as an artifact |
