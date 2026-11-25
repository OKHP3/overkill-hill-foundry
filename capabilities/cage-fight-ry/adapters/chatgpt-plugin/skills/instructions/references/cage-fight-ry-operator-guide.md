# 🥊 Cage Fight‑Rᵧ Operator Guide
*Instruction Booklet & Explainer for Iterative Comparative Synthesis*  
**Version:** 1.0 • **Last Updated:** 2025-08-30

---

## 1) Purpose & Value

Cage Fight‑Rᵧ exists to improve text artifacts through disciplined, **iterative comparison and synthesis**. When you have multiple drafts (Markdown, YAML, PHP-in-Markdown, JSON, or plain text), Cage Fight‑Rᵧ:

- Keeps **operator control**: no hybrid is produced without your explicit approval.
- Guarantees **structural fidelity**: nested code blocks and formats are preserved.
- Builds a **transparent chain of evolution**: each hybrid becomes the new baseline and faces a new challenger until you decide the bout is over.

**Why not just “pick a winner”?** Because often A and B both contain keepers. Cage Fight‑Rᵧ preserves strengths from both, discards weaknesses, and proposes **net-new** improvements where justified.

---

## 2) The Synthesis Chain (How It Works)

The loop is a directed, repeatable hybridization process:

```
C₁ = synth(A₁, B₁)
C₂ = synth(C₁, B₂)
C₃ = synth(C₂, B₃)
…
```

- Two inputs enter: **Challenger A** and **Challenger B**.  
- A **Comparative Synthesis Report** is produced (one artifact, three parts).  
- On approval, a **Hybrid C** is generated.  
- C is promoted as the new **A** (A₂). You introduce the next **B** (B₂). Repeat.

---

## 3) Starting a Session

### Mandatory Inputs (Round 1)
- **Goal State** — Define what “better” means (e.g., shorter, clearer, schema‑compliant, more persuasive).
- **Challenger A** — First body of material (file upload or pasted body).
- **Challenger B** — Second body of material (file upload or pasted body).

### Pre‑Starter Rule (Negging Behavior)
If any of **Goal / A / B** are missing, Cage Fight‑Rᵧ **halts immediately** and prompts you to supply the missing items.  
*No comparison, scoring, or synthesis occurs until all three are present.*

### Quick‑Start Initiation Prompt (paste this into a new thread)
```md
# Iterative Synthesis Thread — Cage Fight‑Rᵧ
Mode: Evaluation & Mutation using the synthesis chain (A + B → C). 
Goal: {define "better" here — optional at launch}
A: {attach file or paste body — optional at launch}
B: {attach file or paste body — optional at launch}

Assistant pre-starter rule: If Goal, A, or B are missing, do not proceed; prompt me to provide them.
Per‑round output: single integrated deliverable (Intro → Scoreboard Table → Outro + decision gate).
```

---

## 4) Per‑Round Deliverable (One Artifact, Three Parts)

Each round produces **one** Markdown deliverable:

### (a) Intro Matter — Inferred Purposes
- **A purpose:** one‑paragraph summary of what A tries to accomplish.  
- **B purpose:** one‑paragraph summary of what B tries to accomplish.

### (b) Comparative Scoreboard & Hybrid Mapping (single table)
| Element | A (notes / score) | B (notes / score) | Proposed C (source: A / B / New + rationale) |
|---|---|---|---|
| Example Section | Clear taxonomy (4/5) | Simpler phrasing (5/5) | **B** phrasing + **A** taxonomy |
| Config Block | YAML schema complete (5/5) | Missing keys (2/5) | **A** as-is |
| Intro Copy | Too long (2/5) | Concise but dry (3/5) | **New:** short + warmer tone |

**Scoring Guidance:**  
- Use qualitative notes **and/or** numeric scores (1–5).  
- For short, single-statement inputs, the table **collapses** to a single overall row.

### (c) Outro Matter — Plan & Decision Gate
- Explain how **C** will be composed and *why* it outperforms A and B given the Goal.  
- **Operator decision (required):** `APPROVE` / `REVISE` / `REJECT` (keep A or B intact) / `ABORT` (end or restart with new Goal).

---

## 5) Hybrid Creation & Delivery

On **APPROVE**, Cage Fight‑Rᵧ generates **Hybrid C** with the following guarantees:

- **Structural fidelity:** preserve nested Markdown (including fenced blocks), embedded **YAML**, **PHP**, **JSON**, HTML, etc.  
- **Syntax integrity:** maintain indentation, nesting, and formatting.  
- **Faithful recombination:** only the elements justified in the scoreboard are merged.

### Delivery Mode (you choose each round)
- **Inline Markdown** — displays on screen (copy/paste).  
- **Downloadable `.md` file** — when supported; otherwise fallback to inline.

After delivery, **C becomes A₂**, and you will be prompted to introduce the next challenger **B₂**.

---

## 6) Failure Handling & “Referee Whistle” Failback

When something’s off, Cage Fight‑Rᵧ stops the bout and shows a **Referee Whistle** block:

> **⏹️ Referee Whistle — Halt & Diagnose**  
> Reason: *{missing inputs / goal drift / structural conflict / incompatible schema}*  
> Recommended next step: *{clarify goal, supply schema, split the round, etc.}*

**Typical cases:**
- **Missing Inputs:** Prompt to supply Goal, A, or B.  
- **Minor Goal Drift:** Flag and request clarification before continuing.  
- **Major Goal Drift:** Recommend terminate/restart with updated Goal.  
- **Conflicting Structures:** Halt, explain conflict, request guidance (e.g., which schema to normalize to).

Structural fidelity is **mandatory**: Cage Fight‑Rᵧ must never silently alter or corrupt nested elements.

---

## 7) Operator Commands (Cheat‑Sheet)

- `APPROVE` — Generate Hybrid C per the proposed plan.  
- `REVISE: {instruction}` — Adjust the plan (e.g., “Keep A’s glossary verbatim; use B’s headings”).  
- `REJECT: keep A` (or `keep B`) — Discard the proposed hybrid; preserve the chosen incumbent.  
- `DELIVERY: inline` or `DELIVERY: file` — Set how C should be delivered this round.  
- `SET GOAL: {text}` — Update the Goal definition mid‑thread.  
- `ABORT` — End the process or restart with new subject/goal.

---

## 8) Best Practices

- **Be explicit with the Goal.** Ambiguity weakens the scorecard.  
- **Chunk by sections.** Headers/sections in A and B yield cleaner element rows.  
- **Prefer numeric scores for large tables.** They clarify trade‑offs at a glance.  
- **Iterate in short bouts.** Smaller deltas produce stronger cumulative hybrids.  
- **Preserve provenance.** The “Proposed C” column must mark **A / B / New** for every row.

---

## 9) Templates

### A) Round Report Skeleton (assistant output)
```md
## 🔍 Comparative Synthesis Report (Round {N})

### Purpose Statements
- **A:** {one-paragraph purpose}
- **B:** {one-paragraph purpose}

### Scoreboard & Hybrid Mapping
| Element | A (notes/score) | B (notes/score) | Proposed C (A/B/New + rationale) |
|---|---|---|---|
| … | … | … | … |

### Plan for Hybrid C
{why this composition best fits the Goal}

**Operator Decision:** APPROVE / REVISE / REJECT (keep A or B) / ABORT
```

### B) Minimal Initiation (fast start)
```md
Cage Fight‑Rᵧ init • Mode: synthesis chain
Goal: {define}
A: {attach or paste}
B: {attach or paste}
Rule: If any are missing, prompt me; do not proceed.
Per-round: single integrated report → decision gate → hybrid → promote → next B.
```

---

## 10) Example (Conceptual)

- **Goal:** “Shorter and clearer without losing key definitions.”  
- **A:** Long, well‑structured doc with full glossary.  
- **B:** Short, punchy summary missing glossary.  
- **Scoreboard:** B wins on clarity; A wins on completeness and glossary.  
- **Plan:** Use B’s structure and tone; pull glossary verbatim from A; compress A’s examples to bullet points.  
- **Hybrid C:** Concise doc with retained glossary and compact examples. C becomes A₂; introduce next B₂.

---

**Summary:** Cage Fight‑Rᵧ iteratively compares, scores, and hybridizes content with strict goal alignment and operator control—while preserving the exact structure of your nested formats.
