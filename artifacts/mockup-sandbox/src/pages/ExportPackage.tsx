import { useState, useCallback, useEffect, useRef, type ChangeEvent, type ReactNode } from "react";
import {
  AUDIT_ITEMS,
  AUDIT_RUBRIC_VERSION,
  AUDIT_SHIP_GATE_THRESHOLDS,
  BUILD_STEPS,
  SAFETY_AUDIT_ID,
} from "../data/knowledge";
import {
  type AuditEvidence,
  type CreatorWorkspace,
  importAuditEvidence,
  persistWorkspace,
  readWorkspaceSnapshot,
  readProjectValue,
} from "../lib/creatorStorage";
import { calculateReadiness, type ReadinessState } from "../lib/readiness";
import { formatInstructionLayers } from "../lib/instruction-layers";

function loadCompletedSteps(): Set<number> {
  try {
    const saved = (readProjectValue("creator-state") as { completedSteps?: unknown } | undefined) ?? {};
    return new Set(
      Array.isArray(saved.completedSteps)
        ? saved.completedSteps.filter(
            (step): step is number =>
              typeof step === "number" && Number.isInteger(step) && step >= 0 && step < BUILD_STEPS.length,
          )
        : [],
    );
  } catch {
    return new Set();
  }
}

function loadStep(key: string): any {
  try { return readProjectValue(key) ?? {}; } catch { return {}; }
}

function loadStepRecord(key: string): Record<string, any> {
  const value = loadStep(key);
  return isRecord(value) ? value : {};
}

function recordArray(value: unknown): Array<Record<string, any>> {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function textValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function sanitizeDownloadName(value: unknown): string {
  const rawName = typeof value === "string" ? value : "";
  const normalizedName = (rawName || "custom-gpt").toLowerCase().normalize("NFC");
  const sanitizedName = normalizedName
    .replace(/\s+/gu, "-")
    .replace(/[^\p{L}\p{N}\p{M}-]/gu, "");

  return /[\p{L}\p{N}]/u.test(sanitizedName) ? sanitizedName : "custom-gpt";
}

interface EvidencePackage {
  schemaVersion: "1.0";
  artifact: {
    type: "custom-gpt-specification";
    name: string;
    version: string;
    owner: string;
    visibility: string;
  };
  readiness: {
    state: ReadinessState;
    confidence: "low" | "medium" | "high";
    completedSteps: number;
    totalSteps: number;
    blockers: string[];
    unresolvedItems: string[];
    behavioralValidation: "not-claimed";
  };
  evidence: Array<{ source: string; status: string; notes: string }>;
  audit?: AuditEvidence;
  humanConfirmation: {
    required: true;
    recorded: boolean;
    owner: string;
    decision: string;
    rationale: string;
  };
  provenance: {
    generatedAt: string;
    source: "browser-local-project";
    projectName: string;
    changeLedger: Record<string, unknown>;
  };
  boundaries: Record<string, string>;
  failureBehavior: Record<string, string>;
  assumptions: { knowledgeRetrieval: string; unresolved: string[] };
  phases: Record<string, unknown>;
}

type ShipGateDecision = AuditEvidence["shipGateDecision"];

interface AuditEvidenceItem {
  id: number;
  question: string;
  score: number | null;
  notes: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isAuditScore(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 5;
}

function isAuditThreshold(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 5;
}

function auditDecisionExplanation(decision: ShipGateDecision): string {
  switch (decision) {
    case "passed":
      return "All audit items are scored and the average and safety thresholds are met.";
    case "failed":
      return "All audit items are scored, but one or more ship-gate thresholds are not met.";
    case "incomplete":
      return "Not all audit items have scores, so the ship gate cannot be evaluated.";
  }
}

function normalizeAuditRecord(raw: unknown): AuditEvidence | undefined {
  if (!isRecord(raw)) return undefined;

  const rawThresholds = isRecord(raw.shipGateThresholds) ? raw.shipGateThresholds : {};
  const shipGateThresholds = {
    averageMinimum: isAuditThreshold(rawThresholds.averageMinimum)
      ? rawThresholds.averageMinimum
      : AUDIT_SHIP_GATE_THRESHOLDS.averageMinimum,
    safetyMinimum: isAuditThreshold(rawThresholds.safetyMinimum)
      ? rawThresholds.safetyMinimum
      : AUDIT_SHIP_GATE_THRESHOLDS.safetyMinimum,
  };
  const rawScores = isRecord(raw.scores) ? raw.scores : {};
  const rawNotes = isRecord(raw.notes) ? raw.notes : {};
  const scores: Record<string, number> = {};
  const notes: Record<string, string> = {};
  const items = AUDIT_ITEMS.map((item): AuditEvidenceItem => {
    const key = String(item.id);
    const score = isAuditScore(rawScores[key]) ? rawScores[key] : null;
    const note = typeof rawNotes[key] === "string" ? rawNotes[key] : "";
    if (score !== null) scores[key] = score;
    if (note) notes[key] = note;
    return { id: item.id, question: item.question, score, notes: note };
  });

  const allItemsScored = items.every((item) => item.score !== null);
  const averageScore = allItemsScored
    ? items.reduce((total, item) => total + (item.score ?? 0), 0) / items.length
    : null;
  const safetyScore = items.find((item) => item.id === SAFETY_AUDIT_ID)?.score ?? null;
  const shipGateDecision: ShipGateDecision =
    !allItemsScored
      ? "incomplete"
      : averageScore !== null &&
          averageScore >= shipGateThresholds.averageMinimum &&
          safetyScore !== null &&
          safetyScore >= shipGateThresholds.safetyMinimum
        ? "passed"
        : "failed";

  return {
    gptName: typeof raw.gptName === "string" ? raw.gptName : "",
    rubricVersion: typeof raw.rubricVersion === "string" && raw.rubricVersion.trim()
      ? raw.rubricVersion
      : AUDIT_RUBRIC_VERSION,
    shipGateThresholds,
    scores,
    notes,
    items,
    averageScore,
    safetyScore,
    shipGateDecision,
    shipGateDecisionExplanation: auditDecisionExplanation(shipGateDecision),
  };
}

function buildEvidencePackage(completedSteps: Set<number>, generatedAt: string): EvidencePackage {
  const brief = loadStepRecord("step-0");
  const contract = loadStepRecord("step-1");
  const layerData = loadStep("step-2");
  const knowledge = loadStepRecord("step-3");
  const caps = loadStepRecord("step-4");
  const actions = loadStepRecord("step-5");
  const starters = loadStep("step-6");
  const tests = loadStepRecord("step-7");
  const ship = loadStepRecord("step-8");
  const testCases = recordArray(tests.cases);
  const readiness = calculateReadiness({
    "step-0": brief, "step-1": contract, "step-2": layerData, "step-3": knowledge,
    "step-4": caps, "step-5": actions, "step-6": starters,
    "step-7": { ...tests, cases: testCases }, "step-8": ship,
  }, completedSteps);
  const changeLedger = Object.fromEntries(
    ["step-2-change", "step-3-change", "step-4-change", "step-5-change"].map(key => [key, loadStepRecord(key)])
  );
  const audit = normalizeAuditRecord(readProjectValue("audit-mode"));

  return {
    schemaVersion: "1.0",
    artifact: {
      type: "custom-gpt-specification",
      name: textValue(brief.gptName) || "Untitled GPT",
      version: textValue(ship.currentVersion) || "v0.1",
      owner: textValue(ship.ownerName),
      visibility: textValue(ship.visibility),
    },
    readiness: {
      state: readiness.state,
      confidence: readiness.confidence,
      completedSteps: readiness.completedSteps,
      totalSteps: readiness.totalSteps,
      blockers: readiness.blockers,
      unresolvedItems: readiness.unresolvedItems,
      behavioralValidation: readiness.behavioralValidation,
    },
    evidence: readiness.evidence,
    ...(audit ? { audit } : {}),
    humanConfirmation: {
      required: true,
      recorded: readiness.humanConfirmation.recorded,
      owner: textValue(ship.ownerName),
      decision: textValue(ship.releaseDecision) || "draft",
      rationale: textValue(ship.releaseEvidence),
    },
    provenance: {
      generatedAt,
      source: "browser-local-project",
      projectName: textValue(brief.gptName) || "Untitled GPT",
      changeLedger,
    },
    boundaries: {
      nonGoals: textValue(brief.nonGoals),
      allowedSources: textValue(brief.allowedSources),
      disallowedSources: textValue(brief.disallowedSources),
      compliance: textValue(brief.compliance),
      toolingAllowed: textValue(brief.toolingAllowed),
    },
    failureBehavior: {
      catastrophicMistakes: textValue(contract.catastrophicMistakes),
      toolFailureTest: textValue(tests.toolFailureTest),
      recovery: "Return to the smallest failing phase; keep unknown or failed evidence unresolved until reviewed.",
    },
    assumptions: {
      knowledgeRetrieval: textValue(knowledge.retrievalNotes),
      unresolved: readiness.unresolvedItems,
    },
    phases: {
      "step-0-build-brief": brief,
      "step-1-conversation-contract": contract,
      "step-2-instruction-stack": layerData,
      "step-3-knowledge-files": knowledge,
      "step-4-capabilities": caps,
      "step-5-actions-apps": actions,
      "step-6-conversation-starters": starters,
      "step-7-test-matrix": tests,
      "step-8-ship-govern": ship,
    },
  };
}

function buildMarkdown(evidencePackage: EvidencePackage): string {
  const brief = loadStepRecord("step-0");
  const contract = loadStepRecord("step-1");
  const layerData = loadStep("step-2");
  const knowledge = loadStepRecord("step-3");
  const knowledgeFiles = recordArray(knowledge.files);
  const caps = loadStepRecord("step-4");
  const capsRationale = loadStepRecord("step-4-rationale");
  const actions = loadStepRecord("step-5");
  const starters = stringArray(loadStep("step-6"));
  const tests = loadStepRecord("step-7");
  const testCases = recordArray(tests.cases);
  const ship = loadStepRecord("step-8");
  const evidenceSections = [
    ["Build Brief evidence", textValue(brief.evidenceStatus), textValue(brief.evidenceRegister)],
    ["Knowledge evidence", textValue(knowledge.evidenceStatus), [knowledge.retrievalNotes, knowledge.conflictHandling, knowledge.injectionBoundary].filter(Boolean).join("\n")],
    ["Evaluation evidence", textValue(tests.evidenceStatus), [tests.retrievalVerification, tests.toolFailureTest, tests.ownerReview].filter(Boolean).join("\n")],
  ];
  const auditSection = evidencePackage.audit ? `
---

## 9. Audit Findings

**Audited GPT identity:** ${evidencePackage.audit.gptName || "(not recorded)"}
**Audit rubric version:** ${evidencePackage.audit.rubricVersion}
**Ship-gate thresholds used:** average ≥ ${evidencePackage.audit.shipGateThresholds.averageMinimum} / 5; safety (item ${SAFETY_AUDIT_ID}) ≥ ${evidencePackage.audit.shipGateThresholds.safetyMinimum} / 5
**Ship-gate decision:** **${evidencePackage.audit.shipGateDecision.toUpperCase()}** — ${evidencePackage.audit.shipGateDecisionExplanation}
**Average score:** ${evidencePackage.audit.averageScore === null ? "(not available)" : `${evidencePackage.audit.averageScore.toFixed(2)} / 5`}
**Safety score (item ${SAFETY_AUDIT_ID}):** ${evidencePackage.audit.safetyScore === null ? "(not scored)" : `${evidencePackage.audit.safetyScore} / 5`}

### Per-item findings
${evidencePackage.audit.items.map((item) =>
  `- **Item ${item.id}:** ${item.question} — **Score:** ${item.score === null ? "not scored" : `${item.score} / 5`} — **Notes:** ${item.notes || "(none recorded)"}`
).join("\n")}
` : "";

  const instructionBlock = formatInstructionLayers(
    layerData,
    (layer) => `### Layer ${layer.id}: ${layer.label}`,
  );

  return `# Custom GPT Specification Package
*Generated by The OverKill Hill Found-Ry · OKH P³ · ${new Date().toISOString().split("T")[0]}*

---

## 0. Build Brief

**GPT Name:** ${textValue(brief.gptName) || "(not set)"}
**Primary Users:** ${textValue(brief.primaryUsers) || "(not set)"}
**Version:** ${textValue(ship.currentVersion) || "v0.1"}
**Owner:** ${textValue(ship.ownerName) || "(not set)"}
**Visibility:** ${textValue(ship.visibility) || "(not set)"}

### Primary Outcomes
${textValue(brief.outcomes) || "(not defined)"}

### Non-Goals / Out of Scope
${textValue(brief.nonGoals) || "(not defined)"}

### Done-When Acceptance Criteria
${textValue(brief.doneCriteria) || "(not defined)"}

### Data Sources
- **Allowed:** ${textValue(brief.allowedSources) || "(not set)"}
- **Disallowed:** ${textValue(brief.disallowedSources) || "(not set)"}

### Tooling & Compliance
- **Tooling:** ${textValue(brief.toolingAllowed) || "(not set)"}
- **Compliance:** ${textValue(brief.compliance) || "(not set)"}

### Evidence Register
- **Status:** ${textValue(brief.evidenceStatus) || "unknown"}
${textValue(brief.evidenceRegister) || "(unknown - verification needed)"}

---

## 1. Conversation Contract

### Inputs
${textValue(contract.inputs) || "(not defined)"}

### Outputs
${textValue(contract.outputs) || "(not defined)"}

### Top Tasks (ranked)
${textValue(contract.topTasks) || "(not defined)"}

### Catastrophic Mistakes
${textValue(contract.catastrophicMistakes) || "(not defined)"}

---

## 2. Instructions

${instructionBlock || "(no instruction layers filled)"}

---

## 3. Knowledge Files

${knowledgeFiles.length > 0
  ? knowledgeFiles.map((f, i) =>
      `${i + 1}. \`${textValue(f.filename) || "(unnamed)"}\` [${textValue(f.type)}] — ${textValue(f.topic) || "(no topic)"}${textValue(f.notes) ? `\n   *Routing note: ${textValue(f.notes)}*` : ""}`
    ).join("\n")
  : "(no files planned)"}

${textValue(knowledge.retrievalNotes) ? `**Retrieval notes:**\n${textValue(knowledge.retrievalNotes)}` : ""}

---

## 4. Capabilities

${Object.entries(caps || {}).filter(([, v]) => v).map(([k]) => `- ✓ ${k}`).join("\n") || "(no capabilities configured)"}

---

## 5. Actions / Apps

**Choice:** ${textValue(actions.choice) || "none"}
${actions.choice === "actions" ? `**Auth type:** ${textValue(actions.authType) || "none"}
**Privacy Policy URL:** ${textValue(actions.privacyPolicyUrl) || "(not set)"}
${textValue(actions.errorHandling) ? `**Error handling:** ${textValue(actions.errorHandling)}` : ""}` : ""}
${actions.choice === "apps" ? `**Apps notes:** ${textValue(actions.appsNotes) || "(none)"}` : ""}

---

## 6. Conversation Starters

${starters.filter((s) => s.trim()).map((s, i) => `${i + 1}. "${s}"`).join("\n") || "(no starters written)"}

---

## 7. Test Matrix

${testCases.length > 0
  ? testCases.map((c, i) =>
      `**T${i + 1}** [${textValue(c.category)}] ${c.result === "pass" ? "✓" : c.result === "fail" ? "✗" : "○"}\n- Prompt: ${textValue(c.prompt) || "(empty)"}\n- Expected: ${textValue(c.expectedBehavior) || "(not set)"}`
    ).join("\n\n")
  : "(no test cases defined)"}

---

## 8. Governance

**Visibility:** ${textValue(ship.visibility) || "(not set)"}
**Version:** ${textValue(ship.currentVersion) || "(not set)"}
**Owner:** ${textValue(ship.ownerName) || "(not set)"}
**Scheduled review:** ${textValue(ship.scheduledReview) || "(not set)"}
**Release decision:** ${textValue(ship.releaseDecision) || "draft"}
**Release evidence status:** ${textValue(ship.evidenceStatus) || "unknown"}
${textValue(ship.releaseEvidence) || "(no release decision recorded)"}

### Change Log
${textValue(ship.changeLog) || "(no changelog entry)"}

### Maintenance Cadence
${textValue(ship.maintenanceCadence) || "(not defined)"}

---

## Evidence and Provenance Record
**Package readiness:** ${evidencePackage.readiness.state}
**Confidence:** ${evidencePackage.readiness.confidence}
**Behavioral validation:** not claimed by this export; a passing protected holdout is required before making a behavioral claim.
**Human confirmation:** ${evidencePackage.humanConfirmation.recorded ? `recorded by ${evidencePackage.humanConfirmation.owner || "owner"}` : "required before release"}
${evidenceSections.map(([label, status, notes]) => `### ${label}\n**Status:** ${status || "unknown"}\n${notes || "(unknown - verification needed)"}`).join("\n\n")}

### Change Ledger
  ${["step-2-change", "step-3-change", "step-4-change", "step-5-change"].map((key) => {
    const change = loadStepRecord(key);
    return `- **${key}:** ${textValue(change.reason) || "(no change reason recorded)"} | Expected: ${textValue(change.expectedEffect) || "unknown"} | Tests: ${textValue(change.affectedTests) || "unknown"} | Observed: ${textValue(change.observedResult) || "unknown"} | Rollback: ${textValue(change.rollbackDecision) || "unknown"}`;
  }).join("\n")}

${auditSection}
---

*This spec was built using the okhp3-custom-gpt-builder Agent Skill v1.0.0 · Apache-2.0*
*Source: https://github.com/OKHP3/OverKill-Hill-FoundRy*
`;
}

function renderInlineMarkdown(value: string): ReactNode[] {
  return value.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|~~[^~]+~~|\*[^*]+\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index} style={{ color: "var(--color-forge-highlight)", background: "var(--color-forge-panel)", padding: "0.08rem 0.25rem", borderRadius: "0.2rem" }}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link && /^(https?:\/\/|mailto:)/i.test(link[2])) {
      return <a key={index} href={link[2]} target="_blank" rel="noreferrer" style={{ color: "var(--color-forge-highlight)" }}>{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("~~") && part.endsWith("~~")) {
      return <del key={index}>{part.slice(2, -2)}</del>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <span key={index}>{part}</span>;
  });
}

function renderMarkdownPreview(markdown: string): ReactNode[] {
  const lines = markdown.split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let orderedList: string[] = [];
  let quote: string[] = [];
  let code: string[] | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push(<p key={`paragraph-${blocks.length}`} style={{ margin: "0 0 0.85rem", lineHeight: 1.65 }}>{renderInlineMarkdown(paragraph.join(" "))}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} style={{ margin: "0 0 0.85rem", paddingLeft: "1.35rem", lineHeight: 1.65 }}>
        {list.map((item, index) => <li key={index}>{renderInlineMarkdown(item)}</li>)}
      </ul>,
    );
    list = [];
  };
  const flushOrderedList = () => {
    if (orderedList.length === 0) return;
    blocks.push(
      <ol key={`ordered-list-${blocks.length}`} style={{ margin: "0 0 0.85rem", paddingLeft: "1.55rem", lineHeight: 1.65 }}>
        {orderedList.map((item, index) => <li key={index}>{renderInlineMarkdown(item)}</li>)}
      </ol>,
    );
    orderedList = [];
  };
  const flushQuote = () => {
    if (quote.length === 0) return;
    blocks.push(
      <blockquote key={`quote-${blocks.length}`} style={{ margin: "0 0 0.85rem", paddingLeft: "0.9rem", borderLeft: "3px solid var(--color-forge-highlight)", color: "var(--color-forge-muted)", lineHeight: 1.65 }}>
        {renderInlineMarkdown(quote.join(" "))}
      </blockquote>,
    );
    quote = [];
  };

  lines.forEach((line, index) => {
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flushParagraph();
      flushList();
      flushOrderedList();
      flushQuote();
      if (code === null) {
        code = [];
      } else {
        blocks.push(<pre key={`code-${index}`} style={{ margin: "0 0 0.85rem", padding: "0.8rem", overflowX: "auto", background: "var(--color-forge-panel)", borderRadius: "0.3rem" }}><code>{code.join("\n")}</code></pre>);
        code = null;
      }
      return;
    }
    if (code !== null) {
      code.push(line);
      return;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    const bullet = line.match(/^- (.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    const quoteLine = line.match(/^>\s?(.*)$/);
    if (heading) {
      flushParagraph();
      flushList();
      flushOrderedList();
      flushQuote();
      const level = Math.min(heading[1].length, 4);
      const Heading = ({ 1: "h1", 2: "h2", 3: "h3", 4: "h4" } as const)[level as 1 | 2 | 3 | 4];
      blocks.push(<Heading key={`heading-${index}`} style={{ margin: "1.2rem 0 0.55rem", color: level === 1 ? "var(--color-forge-accent)" : "var(--color-forge-fg)", fontFamily: "var(--font-heading)", fontSize: level === 1 ? "1.4rem" : level === 2 ? "1.1rem" : "0.95rem" }}>{renderInlineMarkdown(heading[2])}</Heading>);
      return;
    }
    if (/^---+$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushOrderedList();
      flushQuote();
      blocks.push(<hr key={`rule-${index}`} style={{ border: 0, borderTop: "1px solid var(--color-forge-border)", margin: "1rem 0" }} />);
      return;
    }
    if (bullet) {
      flushParagraph();
      flushOrderedList();
      flushQuote();
      list.push(bullet[1]);
      return;
    }
    if (numbered) {
      flushParagraph();
      flushList();
      flushQuote();
      orderedList.push(numbered[1]);
      return;
    }
    if (quoteLine) {
      flushParagraph();
      flushList();
      flushOrderedList();
      quote.push(quoteLine[1]);
      return;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushOrderedList();
      flushQuote();
      return;
    }
    flushList();
    flushOrderedList();
    flushQuote();
    paragraph.push(line);
  });

  flushParagraph();
  flushList();
  flushOrderedList();
  flushQuote();
  const remainingCode = code as string[] | null;
  if (remainingCode !== null) {
    blocks.push(<pre key={`code-final-${blocks.length}`} style={{ margin: "0 0 0.85rem", padding: "0.8rem", overflowX: "auto", background: "var(--color-forge-panel)", borderRadius: "0.3rem" }}><code>{remainingCode.join("\n")}</code></pre>);
  }
  return blocks;
}

export default function ExportPackage({ completedSteps: liveCompletedSteps }: { completedSteps?: Set<number> }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [format, setFormat] = useState<"markdown" | "instructions" | "json">("markdown");
  const formatRef = useRef(format);
  const [markdownView, setMarkdownView] = useState<"raw" | "preview">("raw");
  const copyConfirmationTimeoutRef = useRef<number | null>(null);
  const copyRequestRef = useRef(0);
  const [auditImportMessage, setAuditImportMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const auditImportTriggerRef = useRef<HTMLButtonElement>(null);
  const auditImportFileRef = useRef<HTMLInputElement>(null);
  const auditImportDialogRef = useRef<HTMLDivElement>(null);
  const [pendingAuditImport, setPendingAuditImport] = useState<{
    workspace: CreatorWorkspace;
    sourceStorageValue: string;
    artifactName: string;
    audit: AuditEvidence;
  } | null>(null);
  const [, setAuditImportRevision] = useState(0);
  const [storedCompletedSteps] = useState(loadCompletedSteps);
  const [generatedAt] = useState(() => new Date().toISOString());
  const completedSteps = liveCompletedSteps ?? storedCompletedSteps;
  const incompleteSteps = BUILD_STEPS.filter(({ id }) => !completedSteps.has(id));
  const evidencePackage = buildEvidencePackage(completedSteps, generatedAt);
  const fullMarkdown = buildMarkdown(evidencePackage);
  const structuredJson = JSON.stringify(evidencePackage, null, 2);

  const instructionsOnly = formatInstructionLayers(
    loadStep("step-2"),
    (layer) => `## ${layer.label}`,
  );

  const content = format === "markdown" ? fullMarkdown : format === "json" ? structuredJson : instructionsOnly;
  const ship = loadStepRecord("step-8");
  const tests = loadStepRecord("step-7");
  const restoreAuditImportFocus = useCallback(() => {
    window.requestAnimationFrame(() => auditImportTriggerRef.current?.focus());
  }, []);
  const maturity = evidencePackage.readiness.state === "blocked"
    ? "Blocked"
    : evidencePackage.readiness.state === "confirmed"
      ? "Confirmed (owner-declared)"
      : evidencePackage.readiness.state === "ready-for-review"
        ? "Ready for review"
        : "Incomplete";

  const clearCopyConfirmation = useCallback(() => {
    if (copyConfirmationTimeoutRef.current !== null) {
      window.clearTimeout(copyConfirmationTimeoutRef.current);
      copyConfirmationTimeoutRef.current = null;
    }
    setCopied(false);
  }, []);

  const selectFormat = useCallback((nextFormat: typeof format) => {
    if (nextFormat === format) return;
    // "Copied" applies only to the selected export; changing formats invalidates it.
    formatRef.current = nextFormat;
    copyRequestRef.current += 1;
    setCopyError(null);
    clearCopyConfirmation();
    setFormat(nextFormat);
  }, [format, clearCopyConfirmation]);

  useEffect(() => () => {
    if (copyConfirmationTimeoutRef.current !== null) {
      window.clearTimeout(copyConfirmationTimeoutRef.current);
      copyConfirmationTimeoutRef.current = null;
    }
  }, []);

  const copy = useCallback(async () => {
    const copiedFormat = format;
    const copiedContent = content;
    const requestId = ++copyRequestRef.current;
    const startingSnapshot = readWorkspaceSnapshot();
    const isCurrentCopy = () => {
      const currentSnapshot = readWorkspaceSnapshot();
      return copyRequestRef.current === requestId && formatRef.current === copiedFormat &&
        startingSnapshot.workspace.activeProjectId === currentSnapshot.workspace.activeProjectId &&
        startingSnapshot.serialized === currentSnapshot.serialized;
    };
    setCopyError(null);
    clearCopyConfirmation();
    try {
      await navigator.clipboard.writeText(copiedContent);
    } catch {
      if (isCurrentCopy()) {
        setCopied(false);
        setCopyError("Clipboard access failed. Allow clipboard access and try again, or use Download or select and copy the export manually.");
      }
      return;
    }
    if (!isCurrentCopy()) return;

    clearCopyConfirmation();
    setCopyError(null);
    setCopied(true);
    copyConfirmationTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      copyConfirmationTimeoutRef.current = null;
    }, 2000);
  }, [content, format, clearCopyConfirmation]);

  const download = () => {
    const brief = loadStepRecord("step-0");
    const name = sanitizeDownloadName(brief.gptName);
    const isJson = format === "json";
    const contentBytes = new TextEncoder().encode(content);
    const blob = new Blob([contentBytes], { type: isJson ? "application/json;charset=utf-8" : "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name}-spec.${isJson ? "json" : "md"}`; a.click();
    URL.revokeObjectURL(url);
  };

  const importAudit = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const snapshot = readWorkspaceSnapshot();
      if (!snapshot.persisted || snapshot.serialized === null) {
        setPendingAuditImport(null);
        setAuditImportMessage({ type: "error", text: "The current project could not be verified in browser storage. Refresh the page and try again." });
        return;
      }
      const result = importAuditEvidence(String(reader.result), snapshot.workspace);
      if (!result.workspace || !result.preview) {
        setPendingAuditImport(null);
        setAuditImportMessage({ type: "error", text: result.error ?? "The audit evidence could not be imported." });
        return;
      }
      setAuditImportMessage(null);
      setPendingAuditImport({
        workspace: result.workspace,
        sourceStorageValue: snapshot.serialized,
        artifactName: result.preview.artifactName,
        audit: result.preview.audit,
      });
    };
    reader.onerror = () => {
      setAuditImportMessage({ type: "error", text: "The evidence package could not be read. It may be corrupt or incomplete." });
    };
    reader.readAsText(file);
  };

  const confirmAuditImport = () => {
    if (!pendingAuditImport) return;
    const currentSnapshot = readWorkspaceSnapshot();
    if (!currentSnapshot.persisted || currentSnapshot.serialized !== pendingAuditImport.sourceStorageValue) {
      setPendingAuditImport(null);
      setAuditImportMessage({
        type: "error",
        text: "Project data changed while this package was waiting for confirmation. Refresh the page, then select the package again to review it against the current project.",
      });
      restoreAuditImportFocus();
      return;
    }
    if (!persistWorkspace(pendingAuditImport.workspace)) {
      setAuditImportMessage({ type: "error", text: "The audit evidence was valid, but could not be saved in this browser." });
      return;
    }
    setPendingAuditImport(null);
    setAuditImportMessage({ type: "success", text: "Audit findings restored to the active project." });
    setAuditImportRevision((revision) => revision + 1);
    restoreAuditImportFocus();
  };

  const cancelAuditImport = useCallback(() => {
    setPendingAuditImport(null);
    setAuditImportMessage({ type: "success", text: "Import canceled. Existing audit findings were not changed." });
    restoreAuditImportFocus();
  }, [restoreAuditImportFocus]);

  useEffect(() => {
    if (!pendingAuditImport) return;
    const dialog = auditImportDialogRef.current;
    if (!dialog) return;

    dialog.focus();
    const getFocusableElements = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getAttribute("aria-hidden") !== "true" && element.getClientRects().length > 0);
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        cancelAuditImport();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const keepDialogFocus = (event: FocusEvent) => {
      if (event.target instanceof Node && dialog.contains(event.target)) return;
      (getFocusableElements()[0] ?? dialog).focus();
    };

    document.addEventListener("keydown", handleDialogKeyDown);
    document.addEventListener("focusin", keepDialogFocus);
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      document.removeEventListener("focusin", keepDialogFocus);
    };
  }, [pendingAuditImport, cancelAuditImport]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "var(--color-forge-accent)", margin: 0 }}>
          📦 Export Package
        </h1>
        <p style={{ color: "var(--color-forge-muted-fg)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
          Copy or download your complete GPT specification package. This is your source-of-truth artifact.
        </p>
        <div role="status" style={{ marginBottom: "1rem", padding: "0.85rem 1rem", background: "var(--color-forge-panel)", border: "1px solid var(--color-forge-border)", borderRadius: "var(--radius-md)", fontSize: "0.82rem" }}>
          <strong>Package readiness: {maturity}</strong><br />
          <span style={{ color: "var(--color-forge-muted-fg)" }}>
            {evidencePackage.readiness.completedSteps}/{evidencePackage.readiness.totalSteps} build steps complete. This summarizes recorded evidence and owner decisions; it does not validate runtime model behavior.
          </span>
          {evidencePackage.readiness.unresolvedItems.length > 0 && (
            <details style={{ marginTop: "0.55rem" }}>
              <summary style={{ cursor: "pointer", color: "var(--color-forge-fg)" }}>
                {evidencePackage.readiness.unresolvedItems.length} unresolved item{evidencePackage.readiness.unresolvedItems.length === 1 ? "" : "s"}
              </summary>
              <ul style={{ margin: "0.45rem 0 0", paddingLeft: "1.2rem", color: "var(--color-forge-muted-fg)" }}>
                {evidencePackage.readiness.unresolvedItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </details>
          )}
        </div>
      </div>

      {incompleteSteps.length > 0 && (
        <div
          role="alert"
          style={{
            marginBottom: "1rem",
            padding: "1rem 1.1rem",
            background: "color-mix(in srgb, var(--color-forge-accent) 10%, var(--color-forge-panel))",
            border: "1px solid var(--color-forge-accent)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-forge-fg)",
          }}
        >
          <strong style={{ display: "block", color: "var(--color-forge-accent)", marginBottom: "0.35rem" }}>
            ⚠️ This package is not complete yet
          </strong>
          <span style={{ display: "block", color: "var(--color-forge-muted-fg)", fontSize: "0.85rem", marginBottom: "0.65rem" }}>
            You can still export, but these required build steps are incomplete:
          </span>
          <ul style={{ display: "grid", gap: "0.3rem", margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem" }}>
            {incompleteSteps.map(({ id, label }) => (
              <li key={id}>{label}</li>
            ))}
          </ul>
        </div>
      )}

      <section
        aria-label="Restore audit findings"
        style={{
          marginBottom: "1rem", padding: "1rem 1.1rem",
          background: "var(--color-forge-panel)", border: "1px solid var(--color-forge-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <strong style={{ display: "block", color: "var(--color-forge-accent)", marginBottom: "0.35rem" }}>
          Restore audit findings
        </strong>
        <span style={{ display: "block", color: "var(--color-forge-muted-fg)", fontSize: "0.85rem", marginBottom: "0.65rem" }}>
          Import a compatible Evidence (JSON) package to restore scores and notes for this project. Existing project data is unchanged when validation fails.
        </span>
        <button
          type="button"
          ref={auditImportTriggerRef}
          data-testid="button-import-audit-evidence"
          aria-haspopup="dialog"
          aria-expanded={Boolean(pendingAuditImport)}
          aria-controls={pendingAuditImport ? "audit-import-preflight" : undefined}
          onClick={() => auditImportFileRef.current?.click()}
          style={secondaryBtn}
        >
          Import audit evidence JSON
        </button>
        <input
          ref={auditImportFileRef}
          type="file"
          accept="application/json,.json"
          aria-hidden="true"
          tabIndex={-1}
          data-testid="input-audit-evidence-file"
          onChange={importAudit}
          style={{ display: "none" }}
        />
        {pendingAuditImport && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-import-preflight-title"
            aria-describedby="audit-import-preflight-description"
            id="audit-import-preflight"
            data-testid="audit-import-preflight"
            ref={auditImportDialogRef}
            tabIndex={-1}
            style={{
              marginTop: "0.9rem",
              padding: "1rem",
              background: "color-mix(in srgb, var(--color-forge-accent) 8%, var(--color-forge-panel))",
              border: "1px solid var(--color-forge-accent)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <strong id="audit-import-preflight-title" style={{ display: "block", color: "var(--color-forge-accent)", marginBottom: "0.35rem" }}>
              Review audit replacement
            </strong>
            <p id="audit-import-preflight-description" style={{ margin: "0 0 0.8rem", color: "var(--color-forge-muted-fg)", fontSize: "0.82rem" }}>
              The package is valid, but nothing has been saved yet. Confirm to replace the active project&apos;s existing audit findings.
            </p>
            <dl style={{ display: "grid", gridTemplateColumns: "minmax(10rem, max-content) 1fr", gap: "0.35rem 0.8rem", margin: "0 0 0.9rem", fontSize: "0.84rem" }}>
              <dt style={{ color: "var(--color-forge-muted-fg)" }}>Package project</dt>
              <dd style={{ margin: 0, color: "var(--color-forge-fg)" }}>{pendingAuditImport.artifactName}</dd>
              <dt style={{ color: "var(--color-forge-muted-fg)" }}>Audited identity</dt>
              <dd style={{ margin: 0, color: "var(--color-forge-fg)" }}>{pendingAuditImport.audit.gptName || "(not recorded)"}</dd>
              <dt style={{ color: "var(--color-forge-muted-fg)" }}>Rubric version</dt>
              <dd style={{ margin: 0, color: "var(--color-forge-fg)" }}>{pendingAuditImport.audit.rubricVersion}</dd>
              <dt style={{ color: "var(--color-forge-muted-fg)" }}>Average threshold</dt>
              <dd style={{ margin: 0, color: "var(--color-forge-fg)" }}>≥ {pendingAuditImport.audit.shipGateThresholds.averageMinimum} / 5</dd>
              <dt style={{ color: "var(--color-forge-muted-fg)" }}>Safety threshold (item {SAFETY_AUDIT_ID})</dt>
              <dd style={{ margin: 0, color: "var(--color-forge-fg)" }}>≥ {pendingAuditImport.audit.shipGateThresholds.safetyMinimum} / 5</dd>
              <dt style={{ color: "var(--color-forge-muted-fg)" }}>Scored items</dt>
              <dd style={{ margin: 0, color: "var(--color-forge-fg)" }}>{Object.keys(pendingAuditImport.audit.scores).length} / {pendingAuditImport.audit.items.length}</dd>
              <dt style={{ color: "var(--color-forge-muted-fg)" }}>Normalized ship-gate</dt>
              <dd style={{ margin: 0, color: "var(--color-forge-fg)", fontWeight: 700 }}>{pendingAuditImport.audit.shipGateDecision.toUpperCase()}</dd>
            </dl>
            <div style={{ display: "flex", gap: "0.55rem" }}>
              <button type="button" data-testid="button-confirm-audit-replacement" onClick={confirmAuditImport} style={primaryBtn}>Confirm replacement</button>
              <button type="button" data-testid="button-cancel-audit-replacement" onClick={cancelAuditImport} style={secondaryBtn}>Cancel</button>
            </div>
          </div>
        )}
        {auditImportMessage && (
          <div
            role={auditImportMessage.type === "error" ? "alert" : "status"}
            style={{
              marginTop: "0.7rem",
              color: auditImportMessage.type === "error" ? "var(--color-forge-danger)" : "var(--color-forge-success)",
              fontSize: "0.82rem",
            }}
          >
            {auditImportMessage.text}
          </div>
        )}
      </section>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["markdown", "instructions", "json"] as const).map(f => (
            <button key={f} onClick={() => selectFormat(f)}
              style={{
                padding: "0.4rem 0.75rem", borderRadius: "var(--radius-md)", cursor: "pointer",
                background: format === f ? "var(--color-forge-accent)" : "var(--color-forge-panel)",
                color: format === f ? "var(--color-forge-paper)" : "var(--color-forge-fg)",
                border: "1px solid var(--color-forge-border)", fontFamily: "var(--font-body)", fontSize: "0.82rem",
              }}>
               {f === "markdown" ? "Full Spec (Markdown)" : f === "json" ? "Evidence (JSON)" : "Instructions Only"}
            </button>
          ))}
        </div>
        {format === "markdown" && (
          <div style={{ display: "flex", gap: "0.4rem", marginLeft: "0.25rem" }} aria-label="Markdown view">
            {(["raw", "preview"] as const).map(view => (
              <button key={view} onClick={() => setMarkdownView(view)}
                style={{
                  padding: "0.35rem 0.6rem", borderRadius: "var(--radius-md)", cursor: "pointer",
                  background: markdownView === view ? "var(--color-forge-highlight)" : "transparent",
                  color: markdownView === view ? "var(--color-forge-espresso)" : "var(--color-forge-muted-fg)",
                  border: "1px solid var(--color-forge-border)", fontFamily: "var(--font-body)", fontSize: "0.78rem",
                }}>
                {view === "raw" ? "Raw Markdown" : "Rendered Preview"}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
          <button onClick={copy} aria-describedby={copyError ? "copy-error" : undefined} style={primaryBtn}>{copied ? "✓ Copied!" : "📋 Copy"}</button>
          <button onClick={download} style={secondaryBtn}>⬇ Download .{format === "json" ? "json" : "md"}</button>
        </div>
      </div>

      {copyError && <div id="copy-error" role="alert" style={{ margin: "-0.5rem 0 1rem", color: "var(--color-forge-danger)", fontSize: "0.84rem" }}>{copyError}</div>}

      {format === "markdown" && markdownView === "preview" ? (
        <article data-testid="markdown-preview" aria-label="Rendered Markdown preview" style={{
          background: "var(--color-forge-espresso)", border: "1px solid var(--color-forge-border)",
          borderRadius: "var(--radius-md)", padding: "1.25rem",
          color: "var(--color-forge-fg)", maxHeight: "calc(100vh - 280px)", overflowY: "auto",
        }}>
          {renderMarkdownPreview(content)}
        </article>
      ) : (
        <pre style={{
          background: "var(--color-forge-espresso)", border: "1px solid var(--color-forge-border)",
          borderRadius: "var(--radius-md)", padding: "1.25rem",
          fontFamily: "var(--font-mono)", fontSize: "0.78rem", lineHeight: 1.7,
          color: "var(--color-forge-fg)", whiteSpace: "pre-wrap",
          maxHeight: "calc(100vh - 280px)", overflowY: "auto",
        }}>
          {content}
        </pre>
      )}

      <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "var(--color-forge-panel)", border: "1px solid var(--color-forge-border)", borderRadius: "var(--radius-md)", fontSize: "0.8rem", color: "var(--color-forge-muted-fg)" }}>
         💡 <strong>Usage:</strong> The "Full Spec" is your version-controlled source of truth. The "Evidence (JSON)" export preserves readiness, provenance, boundaries, failure behavior, and phase records for machine review. The "Instructions Only" view is ready to paste directly into the ChatGPT builder's Instructions field.
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  background: "var(--color-forge-accent)", color: "var(--color-forge-paper)",
  border: "none", borderRadius: "var(--radius-md)", padding: "0.5rem 1rem",
  fontFamily: "var(--font-body)", fontSize: "0.85rem", cursor: "pointer", fontWeight: 600,
};
const secondaryBtn: React.CSSProperties = {
  background: "var(--color-forge-panel)", color: "var(--color-forge-fg)",
  border: "1px solid var(--color-forge-border)", borderRadius: "var(--radius-md)", padding: "0.5rem 1rem",
  fontFamily: "var(--font-body)", fontSize: "0.85rem", cursor: "pointer",
};
