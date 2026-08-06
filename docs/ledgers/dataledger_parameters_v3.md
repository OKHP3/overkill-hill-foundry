# PathScrib-R — Parameters Ledger (v1.0)

## Runtime Toggles
- `mode`: {diagram, interview, revision, qa, narrative}
- `output_format`: {mermaid, bpmn, plantuml, json, csv}
- `qa_level`: {basic, extended, strict}
- `tone`: {practical, analytical, reflective}

---

## Token Safety
- Max retrieval chunk: 2k tokens
- Max RIS injection: 800 tokens per procedure
- Fail gracefully if exceeded

---

## Execution Modes
- Default: interview → diagram → qa → export
- Alternate: narrative → diagram
