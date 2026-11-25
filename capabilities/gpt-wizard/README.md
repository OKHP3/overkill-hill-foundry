# GPT Wizard

**Design consultation archive and canonical reference library for Custom GPT construction in the OverKill Hill P³ ecosystem.**

The GPT Wizard folder is the architectural source material that underlies the entire GPT Builder workflow. It contains the foundational design consultation transcript, the Golden Master instruction block template, a tier-aware best practices guide, and the Frankenstein fill-in-the-blanks template. These documents are the reference layer; the operational promptchain derived from them lives in [`misc-prompts/`](../misc-prompts/).

---

## Files

| File | Description |
|---|---|
| `overkill-hill-p3-gpt-wizard.md` | ChatGPT design consultation transcript (GPT Wizard 🧙‍♂️). A recorded Q&A session exploring the architecture of the Glee-fully Personalizable Tools suite: whether separate templates are needed per entity tier (Toolbox/Tool/Tool-ette), how to handle Free vs. Plus capability differences, and how to structure a scalable Custom GPT suite. This is the generative design conversation that established the tiered template philosophy. |
| `custom-gpt-instruction-block-master-template.md` | The **Golden Master Template** — the canonical forge template for building GPT-5-compliant instruction blocks. Contains all possible sections and subsections (System & Persona, Capabilities, Tone, Knowledge, Constraints, etc.) in a structured container. Not deployable as-is; it is the reference mold that builders populate and prune. This file is referenced by the Golden Master Assimilation Prompt in [`thread-scourer/`](../thread-scourer/). Hard deployment constraint: ≤ 8,000 characters for the Builder instruction block. |
| `custom-gpt-building-custom-gpts.md` | Best practices guide for building Custom GPTs across Plus and Free user tiers. Covers tool integration (web browsing, code interpreter, DALL·E, vision), graceful degradation for Free users, instruction structuring for tier-aware behavior, and testing methodology. A reference companion to the builder workflow. |
| `franken-template.md` | The Glee-fully FrankenTemplate — a bracket-placeholder fill-in-the-blanks template for generating a complete Tool-ette GPT configuration in one pass. Supplies the name, description, system instructions, and conversation starters scaffolding in a copy-paste-ready format. |
| `00_overkill-hill-p3-gpt-builder-v01-5.md` | Master TOC for the GPT Builder v01.5 promptchain — the same chain operationalized in [`misc-prompts/`](../misc-prompts/). This copy in gpt-wizard serves as the reference version; misc-prompts contains the split, individually-numbered prompt files for modular use. |

---

## Relationship to Other Folders

| Folder | Relationship |
|---|---|
| [`misc-prompts/`](../misc-prompts/) | The operational promptchain (split into numbered files) derived from the architecture defined here. `gpt-wizard/` is the reference library; `misc-prompts/` is the execution layer. |
| [`phenomould-ry/`](../phenomould-ry/) | The active GPT mold-caster built using the templates and design principles from this folder. |
| [`gpt-crucible/`](../gpt-crucible/) | The retired predecessor builder; the Crucible-era design decisions informed the Golden Master template structure. |
| [`thread-scourer/`](../thread-scourer/) | The Golden Master Assimilation Prompt references `custom-gpt-instruction-block-master-template.md` as the immutable structural spine it enriches. |

---

## Role in the Ecosystem

GPT Wizard is the **design consultation and canonical template layer** — it sits upstream of every GPT construction workflow. When a new GPT is needed, the Golden Master template provides the section architecture; the FrankenTemplate provides the quick-fill scaffold; the design consultation provides the rationale for tier and entity decisions; and the best practices guide governs capability targeting. The misc-prompts promptchain then executes the build using these reference documents as its foundation.
