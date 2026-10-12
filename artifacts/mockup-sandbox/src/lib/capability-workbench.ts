export type CapabilityKind = "prompt" | "skill" | "workflow" | "software";

// Optional additive fields keep version-1 projects and backups readable.
export const PORTABILITY_DEFAULTS = {
  sourceType: "new" as "new" | "custom-gpt" | "existing-skill",
  delivery: "source" as "source" | "plugin" | "connector",
  sourceRef: "",
  sourceInventory: "",
  behaviorMap: "",
  semanticLoss: "",
  runtimeTargets: "",
  toolRequirements: "",
  compatibilityEvidence: "",
};
type PortabilityFields = typeof PORTABILITY_DEFAULTS;

export interface CapabilityProject extends Partial<PortabilityFields> {
  id: string;
  name: string;
  kind: CapabilityKind;
  owner: string;
  version: string;
  purpose: string;
  audience: string;
  inputs: string;
  outputs: string;
  constraints: string;
  instructions: string;
  acceptance: string;
  components: string;
  skillRefs: string;
  evidence: string;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityWorkspace {
  version: 1;
  activeId: string;
  projects: CapabilityProject[];
}

export type Workspace = CapabilityWorkspace;

export const CAPABILITY_WORKSPACE_KEY = "okh-capability-workspace";
const CAPABILITY_REVISION_KEY = `${CAPABILITY_WORKSPACE_KEY}-revision`;
const CAPABILITY_REVISION_FIELD = "__okhCapabilityRevision";
export const MAX_CAPABILITY_PROJECTS = 20;
export const MAX_CAPABILITY_BACKUP_BYTES = 2_000_000;
export const MAX_CAPABILITY_IMPORT_BYTES = MAX_CAPABILITY_BACKUP_BYTES;
export const MAX_CAPABILITY_FIELD_LENGTH = 40_000;

const BACKUP_SCHEMA = "okh-capability-workspace-backup";
const BACKUP_VERSION = 1;
const KINDS: readonly CapabilityKind[] = [
  "prompt",
  "skill",
  "workflow",
  "software",
];
const stringFields = [
  "id",
  "name",
  "owner",
  "version",
  "purpose",
  "audience",
  "inputs",
  "outputs",
  "constraints",
  "instructions",
  "acceptance",
  "components",
  "skillRefs",
  "evidence",
  "createdAt",
  "updatedAt",
] as const;

let memoryWorkspace: CapabilityWorkspace | null = null;
let persistedWorkspace: CapabilityWorkspace | null = null;
let unsavedInMemory = false;

export interface CapabilityRawRecovery {
  id: number;
  source: string;
  recoveryKeyVerified: boolean;
}

type CapabilityRawRecoveryEntry = CapabilityRawRecovery & {
  recoveryKeyAttempted: boolean;
};

const rawRecoveryEntries: CapabilityRawRecoveryEntry[] = [];

function findRawRecovery(source: string): CapabilityRawRecoveryEntry | undefined {
  return rawRecoveryEntries.find((entry) => entry.source === source);
}

function retainRawRecoverySource(source: string): CapabilityRawRecoveryEntry {
  const existing = findRawRecovery(source);
  if (existing) return existing;
  const entry: CapabilityRawRecoveryEntry = {
    id: rawRecoveryEntries.length + 1,
    source,
    recoveryKeyVerified: false,
    recoveryKeyAttempted: false,
  };
  rawRecoveryEntries.push(entry);
  return entry;
}

export function getCapabilityRawRecoveries(): CapabilityRawRecovery[] {
  return rawRecoveryEntries.map(({ id, source, recoveryKeyVerified }) => ({
    id,
    source,
    recoveryKeyVerified,
  }));
}

function timestamp(): string {
  return new Date().toISOString();
}

function createId(): string {
  const random =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  return `capability-${random}`;
}

function cloneWorkspace(workspace: CapabilityWorkspace): CapabilityWorkspace {
  return {
    version: 1,
    activeId: workspace.activeId,
    projects: workspace.projects.map((project) => ({
      ...Object.fromEntries(
        Object.entries(PORTABILITY_DEFAULTS).map(([key, fallback]) => [
          key,
          project[key as keyof PortabilityFields] ?? fallback,
        ]),
      ),
      id: project.id,
      name: project.name,
      kind: project.kind,
      owner: project.owner,
      version: project.version,
      purpose: project.purpose,
      audience: project.audience,
      inputs: project.inputs,
      outputs: project.outputs,
      constraints: project.constraints,
      instructions: project.instructions,
      acceptance: project.acceptance,
      components: project.components,
      skillRefs: project.skillRefs,
      evidence: project.evidence,
      reviewed: project.reviewed,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

function validationError(value: unknown): string | null {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.activeId !== "string" ||
    !Array.isArray(value.projects)
  ) {
    return "The capability workspace has an unknown or malformed schema.";
  }
  if (value.projects.length === 0)
    return "The capability workspace must contain at least one project.";
  if (value.projects.length > MAX_CAPABILITY_PROJECTS) {
    return `The capability workspace exceeds the ${MAX_CAPABILITY_PROJECTS}-project limit.`;
  }
  const ids = new Set<string>();
  const allowedProjectFields = new Set<string>([
    ...stringFields,
    ...Object.keys(PORTABILITY_DEFAULTS),
    "kind",
    "reviewed",
  ]);
  for (const candidate of value.projects) {
    if (
      !isRecord(candidate) ||
      !KINDS.includes(candidate.kind as CapabilityKind) ||
      typeof candidate.reviewed !== "boolean"
    ) {
      return "The capability workspace contains a malformed project.";
    }
    const unknownField = Object.keys(candidate).find(
      (field) => !allowedProjectFields.has(field),
    );
    if (unknownField)
      return `The capability workspace contains unknown project field \"${unknownField}\".`;
    for (const field of Object.keys(PORTABILITY_DEFAULTS)) {
      if (!(field in candidate)) continue;
      if (typeof candidate[field] !== "string")
        return `Project field "${field}" must be text.`;
      if (byteLength(candidate[field] as string) > MAX_CAPABILITY_FIELD_LENGTH)
        return `Project field "${field}" exceeds the ${MAX_CAPABILITY_FIELD_LENGTH}-byte limit.`;
    }
    if (
      candidate.sourceType !== undefined &&
      !["new", "custom-gpt", "existing-skill"].includes(
        candidate.sourceType as string,
      )
    )
      return "Unknown capability source type.";
    if (
      candidate.delivery !== undefined &&
      !["source", "plugin", "connector"].includes(candidate.delivery as string)
    )
      return "Unknown capability delivery target.";
    for (const field of stringFields) {
      if (typeof candidate[field] !== "string")
        return `Project field \"${field}\" must be text.`;
      if (
        byteLength(candidate[field] as string) > MAX_CAPABILITY_FIELD_LENGTH
      ) {
        return `Project field \"${field}\" exceeds the ${MAX_CAPABILITY_FIELD_LENGTH}-byte limit.`;
      }
    }
    const id = candidate.id as string;
    if (!id.trim()) return "Every capability project must have an id.";
    if (ids.has(id))
      return `The capability workspace contains duplicate project id \"${id}\".`;
    ids.add(id);
  }
  if (!ids.has(value.activeId))
    return "The active capability project does not exist in this workspace.";
  return null;
}

function requireWorkspace(value: unknown): CapabilityWorkspace {
  const error = validationError(value);
  if (error) throw new Error(error);
  return cloneWorkspace(value as CapabilityWorkspace);
}

export function parseCapabilityWorkspaceStorageValue(raw: string): {
  workspace: CapabilityWorkspace;
  revision: string | null;
} {
  const parsed: unknown = JSON.parse(raw);
  const revision = isRecord(parsed) && typeof parsed[CAPABILITY_REVISION_FIELD] === "string"
    ? parsed[CAPABILITY_REVISION_FIELD] as string
    : null;
  return { workspace: requireWorkspace(parsed), revision };
}

export function sameCapabilityWorkspaceContent(
  left: CapabilityWorkspace,
  right: CapabilityWorkspace,
): boolean {
  const comparable = (workspace: CapabilityWorkspace) => ({
    version: workspace.version,
    activeId: workspace.activeId,
    projects: workspace.projects.map(({ updatedAt: _updatedAt, ...project }) => project),
  });
  return JSON.stringify(comparable(left)) === JSON.stringify(comparable(right));
}

/** Serialize capability-workspace saves across same-origin tabs. */
export function withCapabilityWorkspaceWriter<T>(operation: () => T): Promise<T> {
  if (typeof navigator === "undefined" || !navigator.locks?.request) {
    return Promise.reject(
      new Error("This browser cannot protect capability saves across tabs."),
    );
  }
  return navigator.locks.request(
    `${CAPABILITY_WORKSPACE_KEY}:writer`,
    { mode: "exclusive" },
    operation,
  );
}

function blankWorkspace(): CapabilityWorkspace {
  const project = newProject();
  return { version: 1, activeId: project.id, projects: [project] };
}

export function newProject(kind: CapabilityKind = "skill"): CapabilityProject {
  if (!KINDS.includes(kind))
    throw new Error(`Unknown capability kind: ${String(kind)}`);
  const now = timestamp();
  return {
    ...PORTABILITY_DEFAULTS,
    id: createId(),
    name: "Untitled capability",
    kind,
    owner: "",
    version: "0.1.0",
    purpose: "",
    audience: "OverKill Hill",
    inputs: "",
    outputs: "",
    constraints: "",
    instructions: "",
    acceptance: "",
    components: "",
    skillRefs: "",
    evidence: "",
    reviewed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function loadCapabilityWorkspace(): {
  workspace: CapabilityWorkspace;
  warning: string;
  rawRecoveries: CapabilityRawRecovery[];
} {
  if (unsavedInMemory && memoryWorkspace) {
    return {
      workspace: cloneWorkspace(memoryWorkspace),
      warning:
        "Storage unavailable — changes remain in this tab only. Download a backup before refreshing.",
      rawRecoveries: getCapabilityRawRecoveries(),
    };
  }
  let raw: string | null = null;
  try {
    if (typeof localStorage === "undefined")
      throw new Error("Browser storage is unavailable.");
    raw = localStorage.getItem(CAPABILITY_WORKSPACE_KEY);
    if (raw === null) {
      const workspace = memoryWorkspace
        ? cloneWorkspace(memoryWorkspace)
        : blankWorkspace();
      memoryWorkspace = cloneWorkspace(workspace);
      persistedWorkspace = cloneWorkspace(workspace);
      return {
        workspace,
        warning: "",
        rawRecoveries: getCapabilityRawRecoveries(),
      };
    }
    if (byteLength(raw) > MAX_CAPABILITY_IMPORT_BYTES) {
      retainRawRecoverySource(raw);
      const workspace = memoryWorkspace
        ? cloneWorkspace(memoryWorkspace)
        : blankWorkspace();
      return {
        workspace,
        warning:
          "The saved workspace is oversized and was left unchanged. A temporary workspace is open.",
        rawRecoveries: getCapabilityRawRecoveries(),
      };
    }
    const { workspace } = parseCapabilityWorkspaceStorageValue(raw);
    memoryWorkspace = cloneWorkspace(workspace);
    persistedWorkspace = cloneWorkspace(workspace);
    return { workspace, warning: "", rawRecoveries: getCapabilityRawRecoveries() };
  } catch (error) {
    if (raw !== null) retainRawRecoverySource(raw);
    const workspace = memoryWorkspace
      ? cloneWorkspace(memoryWorkspace)
      : blankWorkspace();
    memoryWorkspace = cloneWorkspace(workspace);
    const detail =
      error instanceof Error ? error.message : "Unknown storage error.";
    return {
      workspace,
      warning: `The saved capability workspace could not be loaded and was left unchanged. A temporary workspace is open. ${detail}`,
      rawRecoveries: getCapabilityRawRecoveries(),
    };
  }
}

export function saveCapabilityWorkspace(
  workspace: CapabilityWorkspace,
): boolean {
  return saveCapabilityWorkspaceRevisionAware(
    workspace,
    persistedWorkspace ?? undefined,
  ).saved;
}

export interface CapabilityConflictRecovery {
  schema: "okh-capability-workspace-conflict-recovery";
  schemaVersion: 1;
  authoritativeRevision: string;
  authoritativeSnapshot: CapabilityWorkspace;
  competingSnapshot: CapabilityWorkspace;
  authoritativeSerialized: string;
  competingSerialized: string;
}

export interface CapabilitySaveResult {
  saved: boolean;
  workspace: CapabilityWorkspace;
  conflict?: CapabilityConflictRecovery;
}

function revisionId(): string {
  return `${Date.now()}-${createId()}`;
}

/** Save only when the tab's baseline still matches persisted content.
 * Replacement imports retain the current draft as failureWorkspace until a
 * readback-verified replacement succeeds. Ordinary edits retain their candidate.
 */
export function saveCapabilityWorkspaceRevisionAware(
  workspace: CapabilityWorkspace,
  baseWorkspace?: CapabilityWorkspace,
  failureWorkspace: CapabilityWorkspace = workspace,
): CapabilitySaveResult {
  let safe: CapabilityWorkspace;
  try {
    safe = requireWorkspace(workspace);
  } catch {
    return { saved: false, workspace: cloneWorkspace(workspace) };
  }
  try {
    if (typeof localStorage === "undefined") {
      memoryWorkspace = cloneWorkspace(failureWorkspace);
      unsavedInMemory = true;
      return { saved: false, workspace: safe };
    }
    const previous = localStorage.getItem(CAPABILITY_WORKSPACE_KEY);
    const legacyRevision = localStorage.getItem(CAPABILITY_REVISION_KEY);
    const baseline = baseWorkspace ?? persistedWorkspace ?? undefined;
    let revision = legacyRevision ?? "legacy-revision";
    if (previous !== null) {
      let remote: CapabilityWorkspace | null = null;
      let rawRecovery = findRawRecovery(previous);
      if (!rawRecovery && byteLength(previous) > MAX_CAPABILITY_IMPORT_BYTES) {
        rawRecovery = retainRawRecoverySource(previous);
      }
      if (!rawRecovery) {
        try {
          const stored = parseCapabilityWorkspaceStorageValue(previous);
          revision = stored.revision ?? revision;
          remote = stored.workspace;
        } catch {
          // The existing recovery path below preserves malformed source exactly.
        }
      }
      if (remote && baseline && !sameCapabilityWorkspaceContent(baseline, remote)) {
        const conflict: CapabilityConflictRecovery = {
          schema: "okh-capability-workspace-conflict-recovery",
          schemaVersion: 1,
          authoritativeRevision: revision,
          authoritativeSnapshot: remote,
          competingSnapshot: safe,
          authoritativeSerialized: previous,
          competingSerialized: JSON.stringify(safe),
        };
        memoryWorkspace = cloneWorkspace(failureWorkspace);
        unsavedInMemory = true;
        return { saved: false, workspace: safe, conflict };
      }
      if (remote && !baseline && !sameCapabilityWorkspaceContent(safe, remote)) {
        const conflict: CapabilityConflictRecovery = {
          schema: "okh-capability-workspace-conflict-recovery",
          schemaVersion: 1,
          authoritativeRevision: revision,
          authoritativeSnapshot: remote,
          competingSnapshot: safe,
          authoritativeSerialized: previous,
          competingSerialized: JSON.stringify(safe),
        };
        memoryWorkspace = cloneWorkspace(failureWorkspace);
        unsavedInMemory = true;
        return { saved: false, workspace: safe, conflict };
      }
      if (!remote) rawRecovery ??= retainRawRecoverySource(previous);
      if (rawRecovery && !rawRecovery.recoveryKeyAttempted) {
        // Keep an independent local copy when storage permits. A denied or
        // unverifiable write must not erase the in-memory raw download.
        rawRecovery.recoveryKeyAttempted = true;
        try {
          const recoveryKey = `${CAPABILITY_WORKSPACE_KEY}-recovery-${createId()}`;
          localStorage.setItem(recoveryKey, rawRecovery.source);
          rawRecovery.recoveryKeyVerified =
            localStorage.getItem(recoveryKey) === rawRecovery.source;
        } catch {
          rawRecovery.recoveryKeyVerified = false;
        }
      }
    }
    const nextRevision = revisionId();
    const serialized = JSON.stringify({
      ...safe,
      [CAPABILITY_REVISION_FIELD]: nextRevision,
    });
    if (byteLength(serialized) > MAX_CAPABILITY_IMPORT_BYTES) {
      memoryWorkspace = cloneWorkspace(failureWorkspace);
      unsavedInMemory = true;
      return { saved: false, workspace: safe };
    }
    localStorage.setItem(CAPABILITY_WORKSPACE_KEY, serialized);
    const written = localStorage.getItem(CAPABILITY_WORKSPACE_KEY);
    let writtenRevision = legacyRevision;
    let authoritative = safe;
    if (written) {
      try {
        const stored = parseCapabilityWorkspaceStorageValue(written);
        writtenRevision = stored.revision ?? writtenRevision;
        authoritative = stored.workspace;
      } catch {
        writtenRevision = null;
      }
    }
    if (written !== serialized || writtenRevision !== nextRevision) {
      const conflict: CapabilityConflictRecovery = {
        schema: "okh-capability-workspace-conflict-recovery",
        schemaVersion: 1,
        authoritativeRevision: writtenRevision ?? "revision-unavailable",
        authoritativeSnapshot: authoritative,
        competingSnapshot: safe,
        authoritativeSerialized: written ?? "",
        competingSerialized: JSON.stringify(safe),
      };
      memoryWorkspace = cloneWorkspace(failureWorkspace);
      unsavedInMemory = true;
      return { saved: false, workspace: safe, conflict };
    }
    memoryWorkspace = cloneWorkspace(safe);
    persistedWorkspace = cloneWorkspace(safe);
    unsavedInMemory = false;
    return { saved: true, workspace: safe };
  } catch {
    memoryWorkspace = cloneWorkspace(failureWorkspace);
    unsavedInMemory = true;
    return { saved: false, workspace: safe };
  }
}

export function createCapabilityConflictBackup(
  conflict: CapabilityConflictRecovery,
): string {
  return JSON.stringify(conflict, null, 2);
}

export function createCapabilityBackup(workspace: CapabilityWorkspace): string {
  const safe = requireWorkspace(workspace);
  const backup = JSON.stringify(
    {
      schema: BACKUP_SCHEMA,
      schemaVersion: BACKUP_VERSION,
      audience: "overkillhill",
      lineage: { parentFoundry: "OKHP3/OverKill-Hill-FoundRy" },
      exportedAt: timestamp(),
      workspace: safe,
    },
    null,
    2,
  );
  if (byteLength(backup) > MAX_CAPABILITY_BACKUP_BYTES) {
    throw new Error(
      `The generated capability backup exceeds the ${MAX_CAPABILITY_BACKUP_BYTES}-byte backup limit.`,
    );
  }
  return backup;
}

export function parseCapabilityBackup(text: string): CapabilityWorkspace {
  if (typeof text !== "string")
    throw new Error("Capability backup input must be text.");
  if (byteLength(text) > MAX_CAPABILITY_IMPORT_BYTES) {
    throw new Error(
      `Capability backup exceeds the ${MAX_CAPABILITY_IMPORT_BYTES}-byte import limit.`,
    );
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Capability backup is not valid JSON.");
  }
  if (!isRecord(value))
    throw new Error("Capability backup must be a JSON object.");
  if (
    value.schema !== BACKUP_SCHEMA ||
    value.schemaVersion !== BACKUP_VERSION
  ) {
    throw new Error("Capability backup has an unknown schema or version.");
  }
  if (
    value.audience !== "overkillhill" ||
    !isRecord(value.lineage) ||
    value.lineage.parentFoundry !== "OKHP3/OverKill-Hill-FoundRy"
  ) {
    throw new Error(
      "Capability backup is not an OverKill Hill FoundRy export.",
    );
  }
  return requireWorkspace(value.workspace);
}

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

export function assessCapability(project: CapabilityProject): {
  state: string;
  blockers: string[];
  checks: { label: string; passed: boolean }[];
} {
  const checks = [
    {
      label: "Named capability",
      passed: hasText(project.name) && project.name !== "Untitled capability",
    },
    {
      label: "Accountable owner and version",
      passed: hasText(project.owner) && hasText(project.version),
    },
    {
      label: "Purpose and intended audience",
      passed: hasText(project.purpose) && hasText(project.audience),
    },
    {
      label: "Input and output contract",
      passed: hasText(project.inputs) && hasText(project.outputs),
    },
    {
      label: "Constraints and instructions",
      passed: hasText(project.constraints) && hasText(project.instructions),
    },
    { label: "Acceptance criteria", passed: hasText(project.acceptance) },
    { label: "Components identified", passed: hasText(project.components) },
    {
      label: "Validation evidence recorded",
      passed: hasText(project.evidence),
    },
  ];
  if (project.sourceType && project.sourceType !== "new") {
    checks.push(
      {
        label: "Source reference and asset inventory",
        passed:
          hasText(project.sourceRef ?? "") &&
          hasText(project.sourceInventory ?? ""),
      },
      {
        label: "Behavior map and semantic-loss review",
        passed:
          hasText(project.behaviorMap ?? "") &&
          hasText(project.semanticLoss ?? ""),
      },
    );
  }
  if (project.delivery && project.delivery !== "source") {
    checks.push(
      {
        label: "Portable skill core for packaging",
        passed: project.kind === "skill",
      },
      {
        label: "Target hosts and tool requirements recorded",
        passed:
          hasText(project.runtimeTargets ?? "") &&
          hasText(project.toolRequirements ?? ""),
      },
      {
        label: "Host compatibility evidence or gaps recorded",
        passed: hasText(project.compatibilityEvidence ?? ""),
      },
    );
  }
  const blockers = checks
    .filter((check) => !check.passed)
    .map((check) => `${check.label} is incomplete.`);
  const state =
    blockers.length > 0
      ? "incomplete-structural-draft"
      : project.reviewed
        ? "owner-reviewed-structural-draft"
        : "ready-for-owner-review-structural-draft";
  return { state, blockers, checks };
}

function cleanHeading(value: string, fallback: string): string {
  return value.trim().replace(/[\r\n]+/g, " ") || fallback;
}

function markdownSection(title: string, value: string): string {
  return `## ${title}\n\n${value.trim() || "TBD"}\n`;
}

function yamlString(value: string): string {
  return JSON.stringify(value.replace(/[\r\n]+/g, " ").trim());
}

function safeSkillName(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const portable = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(slug)
    ? `capability-${slug}`
    : slug;
  return (portable || "untitled-capability").slice(0, 64).replace(/-+$/g, "");
}

function htmlText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function softwareStarter(project: CapabilityProject): string {
  const title = htmlText(cleanHeading(project.name, "Capability"));
  const config = JSON.stringify({
    name: project.name,
    purpose: project.purpose,
  })
    .replace(/</g, "\\u003c")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — contract inspector starter</title>
<style>body{font:16px system-ui;max-width:760px;margin:3rem auto;padding:0 1rem}textarea,pre{box-sizing:border-box;width:100%;padding:1rem}textarea{min-height:10rem}button{padding:.7rem 1rem}pre{background:#f4f4f4;white-space:pre-wrap}</style></head>
<body><h1>${title}</h1><p>This dependency-free starter inspects a JSON input contract. It does not implement or validate the bespoke capability.</p>
<label for="input">JSON input</label><textarea id="input">{"example":true}</textarea><button id="inspect" type="button">Inspect contract</button><pre id="output" aria-live="polite"></pre>
<script type="application/json" id="capability-config">${config}</script>
<script>const input=document.querySelector("#input"),output=document.querySelector("#output");document.querySelector("#inspect").addEventListener("click",()=>{try{const value=JSON.parse(input.value);const describe=v=>Array.isArray(v)?"array":v===null?"null":typeof v;const fields=value&&typeof value==="object"&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).map(([key,val])=>[key,describe(val)])):{value:describe(value)};output.textContent=JSON.stringify({validJson:true,fields},null,2)}catch(error){output.textContent=JSON.stringify({validJson:false,error:error instanceof Error?error.message:"Invalid JSON"},null,2)}});</script></body></html>`;
}

export function buildCapabilityFiles(
  project: CapabilityProject,
): { path: string; content: string }[] {
  const checked = requireWorkspace({
    version: 1,
    activeId: project.id,
    projects: [project],
  }).projects[0];
  const name = cleanHeading(checked.name, "Untitled capability");
  const assessment = assessCapability(checked);
  const files: { path: string; content: string }[] = [];
  files.push({
    path: "capability.json",
    content:
      JSON.stringify(
        {
          schema: "okh-capability-package",
          schemaVersion: 2,
          audience: "overkillhill",
          lineage: { parentFoundry: "OKHP3/OverKill-Hill-FoundRy" },
          capability: checked,
          readiness: {
            ...assessment,
            behavioralValidation: "not-claimed",
            publicationAuthorized: false,
          },
        },
        null,
        2,
      ) + "\n",
  });
  const runDirections =
    checked.kind === "software"
      ? "\n## Run the starter\n\nSee [app/README.md](app/README.md) for the dependency-free browser instructions.\n"
      : "";
  files.push({
    path: "README.md",
    content: `# ${name}\n\n${checked.purpose.trim() || "TBD: state the capability purpose."}\n\nThis is an OverKill Hill FoundRy source package for a ${checked.kind} capability. It is a reviewable structural draft, not proof of behavior or permission to publish.\n${runDirections}\n${markdownSection("Audience", checked.audience)}\n${markdownSection("Inputs", checked.inputs)}\n${markdownSection("Outputs", checked.outputs)}\n${markdownSection("Acceptance", checked.acceptance)}`,
  });
  files.push({
    path: "AGENTS.md",
    content: `# AGENTS.md — ${name}\n\nThis package is governed by \`OKHP3/OverKill-Hill-FoundRy\`. Keep its audience within OverKill Hill, preserve evidence labels, and do not publish or claim behavioral validation without a separate recorded decision.\n\n${markdownSection("Constraints", checked.constraints)}\n${markdownSection("Instructions", checked.instructions)}`,
  });
  files.push({
    path: "docs/build-plan.md",
    content: `# ${name} build plan\n\nTarget: ${checked.kind}\nVersion: ${checked.version || "TBD"}\nOwner: ${checked.owner || "TBD"}\n\n${markdownSection("Components", checked.components)}\n${markdownSection("Implementation instructions", checked.instructions)}`,
  });
  files.push({
    path: "docs/validation.md",
    content: `# ${name} validation record\n\nReadiness: **${assessment.state}**\n\nBehavioral validation: **not claimed**\nPublication authorization: **not granted**\n\n${markdownSection("Acceptance criteria", checked.acceptance)}\n${markdownSection("Recorded evidence", checked.evidence)}\n## Structural checks\n\n${assessment.checks.map((check) => `- [${check.passed ? "x" : " "}] ${check.label}`).join("\n")}\n`,
  });
  files.push({
    path: "docs/skillz-references.md",
    content: `# Skillz references\n\nReferences are pointers only. This generator does not fetch source content. Review the text you supplied before sharing.\n\n${checked.skillRefs.trim() || "No Skillz references recorded."}\n`,
  });

  files.push({
    path: "origin/source.json",
    content:
      JSON.stringify(
        {
          schemaVersion: 1,
          sourceType: checked.sourceType,
          reference: checked.sourceRef,
          inventory: checked.sourceInventory,
          sourceRevision: null,
          licenseReview: "pending",
          publicSourceReview: "pending",
          imported: false,
        },
        null,
        2,
      ) + "\n",
  });
  files.push({
    path: "docs/conversion.md",
    content: `# Conversion dossier\n\nSource: ${checked.sourceType}\n\nThis is an authored plan. No GPT, repository, knowledge file, or tool was fetched or converted automatically.\n\n${markdownSection("Source reference", checked.sourceRef ?? "")}\n${markdownSection("Asset inventory and availability", checked.sourceInventory ?? "")}\n${markdownSection("Behavior to skill or adapter map", checked.behaviorMap ?? "")}\n${markdownSection("Semantic loss, mitigation and acceptance tests", checked.semanticLoss ?? "")}\n## Evaluation plan\n\nBefore release, run a semantic-preservation case, a platform-adapter or loss case, and a boundary case. Record inputs, expected results, host/version, observed results and evidence. Authored criteria are not test results.\n`,
  });
  files.push({
    path: "adapters/compatibility.json",
    content:
      JSON.stringify(
        {
          schemaVersion: 1,
          delivery: checked.delivery,
          requestedHosts: (checked.runtimeTargets ?? "")
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean),
          toolRequirements: checked.toolRequirements,
          evidenceNotes: checked.compatibilityEvidence,
          verifiedHosts: [],
          status: "unverified",
          installable: false,
        },
        null,
        2,
      ) + "\n",
  });
  files.push({
    path: "adapters/packaging-plan.md",
    content: `# Platform packaging plan\n\nDelivery: ${checked.delivery}\n\nKeep the canonical skill independent of host manifests. This file is a packaging plan, not an installable plugin or connector.\n\n${markdownSection("Requested hosts and versions", checked.runtimeTargets ?? "")}\n${markdownSection("Tools, MCP servers, APIs and permissions", checked.toolRequirements ?? "")}\n${markdownSection("Compatibility evidence and gaps", checked.compatibilityEvidence ?? "")}\n## Adapter implementation\n\nFor each host, verify its current packaging format and skill support. Build the host wrapper under adapters/<host>/; reference or reproducibly copy the canonical skills into its required layout. Record the source revision and wrapper version. Keep credentials out of source. Implement and test tool authentication, least required permissions, unavailable-tool recovery, and installation/removal. A connector needs an actual integration; a manifest alone does not supply it.\n`,
  });

  if (checked.kind === "prompt") {
    files.push({
      path: "prompts/prompt-contract.md",
      content: `# ${name} prompt contract\n\n${markdownSection("Purpose", checked.purpose)}\n${markdownSection("Inputs", checked.inputs)}\n${markdownSection("Outputs", checked.outputs)}\n${markdownSection("Constraints", checked.constraints)}\n${markdownSection("Instructions", checked.instructions)}\n${markdownSection("Acceptance criteria", checked.acceptance)}`,
    });
  } else if (checked.kind === "skill") {
    const description = `Use when an OverKill Hill user needs ${cleanHeading(checked.purpose, "this capability")}. Scope: ${cleanHeading(checked.constraints, "follow the package constraints")}.`;
    files.push({
      path: `skills/${safeSkillName(name)}/SKILL.md`,
      content: `---\nname: ${yamlString(safeSkillName(name))}\ndescription: ${yamlString(description.slice(0, 1024))}\n---\n\n# ${name}\n\n## Trigger\n\nUse this skill only for the OverKill Hill audience when the request matches the purpose stated below.\n\n${markdownSection("Purpose", checked.purpose)}\n${markdownSection("Scope and constraints", checked.constraints)}\n${markdownSection("Instructions", checked.instructions)}\n${markdownSection("Acceptance criteria", checked.acceptance)}`,
    });
  } else if (checked.kind === "workflow") {
    files.push({
      path: "docs/workflow-plan.md",
      content: `# ${name} workflow plan\n\nThis is an implementation plan. Steps have not been executed merely because this file exists.\n\n${markdownSection("Inputs", checked.inputs)}\n${markdownSection("Workflow instructions", checked.instructions)}\n${markdownSection("Outputs", checked.outputs)}\n${markdownSection("Acceptance criteria", checked.acceptance)}`,
    });
  } else {
    files.push({ path: "app/index.html", content: softwareStarter(checked) });
    files.push({
      path: "app/README.md",
      content: `# Contract inspector starter\n\nOpen \`index.html\` in a browser. Enter JSON and choose **Inspect contract** to see whether it parses and which top-level fields and value types it contains. This useful starter behavior does not implement the bespoke ${name} capability.\n`,
    });
  }
  return files.map((file) => ({ ...file }));
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()): { date: number; time: number } {
  const year = Math.max(1980, date.getFullYear());
  return {
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
    time:
      (date.getHours() << 11) |
      (date.getMinutes() << 5) |
      Math.floor(date.getSeconds() / 2),
  };
}

function safeZipPath(path: string): string {
  if (
    !path ||
    path.startsWith("/") ||
    path.includes("\\") ||
    path.split("/").some((part) => part === ".." || part === "")
  ) {
    throw new Error(`Unsafe ZIP path: ${path}`);
  }
  return path;
}

export function buildCapabilityZip(
  project: CapabilityProject,
): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const files = buildCapabilityFiles(project).map((file) => ({
    path: encoder.encode(safeZipPath(file.path)),
    data: encoder.encode(file.content),
  }));
  const { date, time } = dosDateTime();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;
  const write = (
    size: number,
    populate: (view: DataView) => void,
  ): Uint8Array => {
    const bytes = new Uint8Array(size);
    populate(new DataView(bytes.buffer));
    return bytes;
  };
  for (const file of files) {
    const crc = crc32(file.data);
    const local = write(30 + file.path.length + file.data.length, (view) => {
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0x0800, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, time, true);
      view.setUint16(12, date, true);
      view.setUint32(14, crc, true);
      view.setUint32(18, file.data.length, true);
      view.setUint32(22, file.data.length, true);
      view.setUint16(26, file.path.length, true);
      view.setUint16(28, 0, true);
      new Uint8Array(view.buffer).set(file.path, 30);
      new Uint8Array(view.buffer).set(file.data, 30 + file.path.length);
    });
    localParts.push(local);
    const central = write(46 + file.path.length, (view) => {
      view.setUint32(0, 0x02014b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 20, true);
      view.setUint16(8, 0x0800, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, time, true);
      view.setUint16(14, date, true);
      view.setUint32(16, crc, true);
      view.setUint32(20, file.data.length, true);
      view.setUint32(24, file.data.length, true);
      view.setUint16(28, file.path.length, true);
      view.setUint16(30, 0, true);
      view.setUint16(32, 0, true);
      view.setUint16(34, 0, true);
      view.setUint16(36, 0, true);
      view.setUint32(38, 0, true);
      view.setUint32(42, offset, true);
      new Uint8Array(view.buffer).set(file.path, 46);
    });
    centralParts.push(central);
    offset += local.length;
  }
  const centralSize = centralParts.reduce(
    (total, part) => total + part.length,
    0,
  );
  const end = write(22, (view) => {
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, files.length, true);
    view.setUint16(10, files.length, true);
    view.setUint32(12, centralSize, true);
    view.setUint32(16, offset, true);
    view.setUint16(20, 0, true);
  });
  const output = new Uint8Array(offset + centralSize + end.length);
  let cursor = 0;
  for (const part of [...localParts, ...centralParts, end]) {
    output.set(part, cursor);
    cursor += part.length;
  }
  return output;
}
