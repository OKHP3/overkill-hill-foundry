# Cage Fight-Rᵧ

**Iterative Comparative Synthesis — Text Artifact Improvement Through Disciplined Hybridization**

Cage Fight-Rᵧ is a structured GPT methodology for improving text artifacts by pitting two versions against each other, producing a scored synthesis report, and iterating until a best-version emerges. Rather than picking a winner, it extracts the strongest elements from each draft and proposes a principled hybrid — with full operator control at every step. The tool works on any text format: Markdown, YAML, JSON, PHP-in-Markdown, or plain text.

---

## How the Synthesis Chain Works

The loop is a directed, repeatable hybridization process:

```
C₁ = synth(A₁, B₁)
C₂ = synth(C₁, B₂)
C₃ = synth(C₂, B₃)
…
```

1. **Start a round** — supply a Goal State (what "better" means), Challenger A (first draft), and Challenger B (second draft). The tool halts if any of the three are missing.
2. **Receive the Comparative Synthesis Report** — one Markdown deliverable with three parts:
   - *Intro Matter*: a purpose statement for A and for B
   - *Comparative Scoreboard*: a table scoring each element in A and B, with a proposed C column showing whether each element comes from A, B, or is net-new
   - *Outro / Plan*: explanation of how C will be composed and a decision gate
3. **Operator decision** — `APPROVE`, `REVISE: {instruction}`, `REJECT: keep A/B`, or `ABORT`.
4. **Hybrid C is generated** on `APPROVE`, with guaranteed structural fidelity (nested code blocks, indentation, embedded formats all preserved).
5. **C becomes A₂** — introduce the next challenger B₂ and repeat.

---

## When to Use Cage Fight-Rᵧ

- You have two drafts of a GPT instruction block, schema, or doc and want the best of both without manually merging line by line.
- You're refining a prompt through multiple rounds and want a transparent audit trail of what changed and why.
- You need to converge on a canonical version from several competing variants.
- You want to improve a single artifact iteratively by introducing a series of challenger drafts.

---

## Operator Commands

| Command | Effect |
|---|---|
| `APPROVE` | Generate Hybrid C per the proposed scoreboard plan |
| `REVISE: {instruction}` | Adjust the plan before generating (e.g., "keep A's glossary verbatim") |
| `REJECT: keep A` / `keep B` | Discard the proposed hybrid; preserve the chosen draft |
| `DELIVERY: inline` / `DELIVERY: file` | Set how C is delivered |
| `SET GOAL: {text}` | Update the Goal definition mid-thread |
| `ABORT` | End the session or restart with a new subject |

---

## File Inventory

| File | Description |
|---|---|
| `cage-fight-ry-operator-guide.md` | The complete operator manual for Cage Fight-Rᵧ (v1.0, 2025-08-30). Covers the synthesis chain, per-round deliverable format, failure handling (Referee Whistle), all operator commands, best practices, templates, and a worked conceptual example. |
| `prompting-best-practices-2025-08.md` | GPT-5 Prompting Best Practices Guide (August 2025 Edition, v1.0). A comprehensive 1,900-line field manual covering prompting philosophy, router awareness, reasoning frameworks (CoT/ToT/SoT), anti-patterns, case studies, Mermaid diagrams, PHP/JSON/YAML examples, and prompt templates. This is the source material that was put through a Cage Fight-Rᵧ synthesis session. |
| `gpt_5_prompting_best_practices_rag.md` | GPT-5 Prompting Best Practices — RAG-Ready Master Edition (`C₂$`, Hybrid Optimized, Two-Layer). The synthesized output of a Cage Fight-Rᵧ session applied to the August 2025 guide. Layer 1 is a compact, RAG-optimized core (checklist, evaluation dimensions, reasoning framework reference). Layer 2 is a condensed extended appendix with case studies and a forward-looking roadmap. This is the version intended for embedding into GPT knowledge files. |

The presence of both `prompting-best-practices-2025-08.md` (source) and `gpt_5_prompting_best_practices_rag.md` (`C₂$` output) in this folder demonstrates Cage Fight-Rᵧ being applied to real content — the synthesis chain was used to produce a RAG-optimized knowledge file from the original full-narrative guide.

---

## Ecosystem Role

Cage Fight-Rᵧ is a general-purpose refinement utility — it sits outside the Cast-Rᵧ → Anvil-Rᵧ → Gleam-Rᵧ pipeline and can be applied at any stage where two or more competing versions of a text artifact need to be resolved into one canonical form. Common use cases within the OverKill Hill P³ ecosystem:

- Merging competing GPT instruction block versions (e.g., two PhenoMould-Rᵧ variants)
- Synthesizing prompt chain iterations from misc-prompts
- Producing RAG-optimized knowledge files from verbose source documents
- Resolving conflicts between Scaffold versions from ScafFrosto-Rᵧ exports

---

## Quick-Start

Paste the following into a new ChatGPT thread to initiate a session:

```md
# Iterative Synthesis Thread — Cage Fight-Rᵧ
Mode: Evaluation & Mutation using the synthesis chain (A + B → C).
Goal: {define "better" here}
A: {attach file or paste body}
B: {attach file or paste body}

Assistant pre-starter rule: If Goal, A, or B are missing, do not proceed; prompt me to provide them.
Per-round output: single integrated deliverable (Intro → Scoreboard Table → Outro + decision gate).
```
