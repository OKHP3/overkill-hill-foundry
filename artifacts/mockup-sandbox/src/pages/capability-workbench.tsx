import { useEffect, useMemo, useRef, useState } from "react";
import {
  assessCapability,
  CAPABILITY_WORKSPACE_KEY,
  buildCapabilityFiles,
  buildCapabilityZip,
  createCapabilityBackup,
  createCapabilityConflictBackup,
  getCapabilityRawRecoveries,
  loadCapabilityWorkspace,
  MAX_CAPABILITY_BACKUP_BYTES,
  MAX_CAPABILITY_PROJECTS,
  newProject,
  parseCapabilityWorkspaceStorageValue,
  parseCapabilityBackup,
  saveCapabilityWorkspaceRevisionAware,
  sameCapabilityWorkspaceContent,
  type CapabilityKind,
  type CapabilityProject,
  type Workspace,
  withCapabilityWorkspaceWriter,
} from "../lib/capability-workbench";
import "../capability-workbench.css";

type Stage =
  "brief" | "contract" | "build" | "validate" | "package" | "convert";

type PendingImport = {
  workspace: Workspace;
  displayBase: Workspace;
  persistedBase: Workspace;
};

type ImportRecovery = {
  schema: "okh-capability-import-recovery";
  schemaVersion: 1;
  persistedRevision: string | null;
  persistedSnapshot: Workspace | null;
  persistedSerialized: string | null;
  storageRead: "read" | "unavailable" | "unvalidated";
  currentSnapshot: Workspace;
  importedSnapshot: Workspace;
};

const STAGES: Array<{
  id: Stage;
  number: string;
  label: string;
  note: string;
}> = [
  { id: "brief", number: "01", label: "Brief", note: "Purpose and audience" },
  {
    id: "convert",
    number: "02",
    label: "Convert & adapt",
    note: "GPT sources and host packages",
  },
  {
    id: "contract",
    number: "03",
    label: "Contract",
    note: "Inputs, outputs, boundaries",
  },
  { id: "build", number: "04", label: "Build", note: "Method and components" },
  {
    id: "validate",
    number: "05",
    label: "Validate",
    note: "Observed evidence",
  },
  { id: "package", number: "06", label: "Package", note: "Reviewable handoff" },
];

const KINDS: Array<{ value: CapabilityKind; label: string; detail: string }> = [
  { value: "skill", label: "Skill", detail: "A portable SKILL.md capability" },
  { value: "prompt", label: "Prompt", detail: "A reusable instruction asset" },
  {
    value: "workflow",
    label: "Workflow",
    detail: "A controlled operating sequence",
  },
  { value: "software", label: "Software", detail: "A local runnable starter" },
];

const PUBLIC_SURFACES = [
  ["OverKill Hill", "https://overkillhill.com", "public site"],
  ["AskJamie", "https://askjamie.bot", "public site"],
  ["Glee-fully", "https://glee-fully.tools", "public site"],
  ["Skillz", "https://okhp3.github.io/skillz", "shared public catalog"],
  [
    "OverKill Hill FoundRy",
    "https://github.com/OKHP3/OverKill-Hill-FoundRy",
    "OverKill workshop",
  ],
  [
    "AskJamie FoundRy",
    "https://github.com/OKHP3/AskJamie-FoundRy",
    "sibling repository",
  ],
  [
    "Glee-fullyTools FoundRy",
    "https://github.com/OKHP3/Glee-fullyTools-FoundRy",
    "sibling repository",
  ],
] as const;

function triggerDownload(name: string, data: BlobPart, type: string): void {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadZip(name: string, bytes: Uint8Array): void {
  // Copy into a browser-owned ArrayBuffer so Blob accepts typed arrays produced by any runtime.
  const stable = new Uint8Array(bytes.byteLength);
  stable.set(bytes);
  triggerDownload(name, stable.buffer, "application/zip");
}

function titleFor(project: CapabilityProject): string {
  return project.name.trim() || "Untitled capability";
}

export default function CapabilityWorkbench({
  onOpenCreator,
}: {
  onOpenCreator: () => void;
}) {
  const initial = useMemo(() => loadCapabilityWorkspace(), []);
  const [workspace, setWorkspace] = useState<Workspace>(initial.workspace);
  const workspaceRef = useRef(workspace);
  workspaceRef.current = workspace;
  const [storageState, setStorageState] = useState(
    initial.warning || "Local workspace · saves when you edit",
  );
  const [recoveryNeeded, setRecoveryNeeded] = useState(Boolean(initial.warning));
  const [recoveryAnnouncement, setRecoveryAnnouncement] = useState(initial.warning);
  const [rawRecoveries, setRawRecoveries] = useState(initial.rawRecoveries);
  const [conflictRecovery, setConflictRecovery] = useState<ReturnType<typeof saveCapabilityWorkspaceRevisionAware>['conflict']>();
  const [stage, setStage] = useState<Stage>("brief");
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(null);
  const [importApplying, setImportApplying] = useState(false);
  const [importRecovery, setImportRecovery] = useState<ImportRecovery | null>(null);
  const [importError, setImportError] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const importRevision = useRef(0);
  const persistedWorkspace = useRef(initial.workspace);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const workspaceEpoch = useRef(0);
  const project =
    workspace.projects.find((item) => item.id === workspace.activeId) ||
    workspace.projects[0];
  const canAddProject = workspace.projects.length < MAX_CAPABILITY_PROJECTS;

  useEffect(() => {
    // Ordinary save progress stays readable without announcing every keystroke.
    // Announce recovery transitions once; identical failure messages stay stable.
    setRecoveryAnnouncement((previous) => recoveryNeeded
      ? storageState
      : previous ? "Workspace saved. Your latest edits are now stored locally." : "");
  }, [recoveryNeeded, storageState]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "okh-capability-workspace" || !event.newValue) return;
      try {
        const { workspace: remote } = parseCapabilityWorkspaceStorageValue(event.newValue);
        // Refresh a clean tab, but keep a dirty tab's original base so its next
        // locked save can identify this update as stale and preserve both sides.
        if (sameCapabilityWorkspaceContent(workspaceRef.current, persistedWorkspace.current)) {
          persistedWorkspace.current = remote;
          workspaceRef.current = remote;
          setWorkspace(remote);
        }
      } catch {
        // A malformed external value is surfaced on the next explicit save/load.
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!project) return null;

  const replaceWorkspace = (next: Workspace) => {
    try {
      // Keep every accepted edit within the same schema and size envelope as recovery.
      createCapabilityBackup(next);
    } catch (error) {
      setStorageState(
        error instanceof Error
          ? error.message
          : "This edit exceeds the workspace limits.",
      );
      return;
    }
    workspaceRef.current = next;
    setWorkspace(next);
    // Once recovery is needed, keep the same live message while the user types.
    if (!recoveryNeeded) setStorageState("Saving locally…");
    const epoch = workspaceEpoch.current;
    saveQueue.current = saveQueue.current.catch(() => undefined).then(async () => {
      if (epoch !== workspaceEpoch.current) return;
      const candidate = workspaceRef.current;
      try {
        const result = await withCapabilityWorkspaceWriter(() => epoch !== workspaceEpoch.current
          ? null
          : saveCapabilityWorkspaceRevisionAware(candidate, persistedWorkspace.current));
        if (!result) return;
        if (result.saved) {
          setRawRecoveries(getCapabilityRawRecoveries());
          persistedWorkspace.current = result.workspace;
          if (sameCapabilityWorkspaceContent(workspaceRef.current, candidate)) {
            workspaceRef.current = result.workspace;
            setWorkspace(result.workspace);
            setConflictRecovery(undefined);
            setRecoveryNeeded(false);
            setStorageState("Saved locally");
          } else {
            setStorageState("Saving locally…");
          }
          return;
        }
        setRawRecoveries(getCapabilityRawRecoveries());
        setConflictRecovery(result.conflict);
        setRecoveryNeeded(true);
        setStorageState(result.conflict
          ? "Concurrent edit conflict — both snapshots are retained. Download recovery before refreshing or closing."
          : "Unsaved — storage denied this write. Your latest edits remain in this tab and will be lost on refresh or closure. Download a backup now.");
      } catch (error) {
        setRawRecoveries(getCapabilityRawRecoveries());
        setConflictRecovery(undefined);
        setRecoveryNeeded(true);
        const detail = error instanceof Error ? ` ${error.message}` : "";
        setStorageState(`Unsaved — your latest edits remain in this tab and will be lost on refresh or closure. Download a backup now.${detail}`);
      }
    });
  };

  const update = (field: keyof CapabilityProject, value: string | boolean) => {
    const next: Workspace = {
      ...workspace,
      projects: workspace.projects.map((item) =>
        item.id === project.id
          ? {
              ...item,
              [field]: value,
              reviewed: field === "reviewed" ? Boolean(value) : false,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    };
    replaceWorkspace(next);
  };
  const create = (kind: CapabilityKind = "skill") => {
    if (!canAddProject) {
      setStorageState(`Project limit reached (${MAX_CAPABILITY_PROJECTS})`);
      return;
    }
    const fresh = newProject(kind);
    replaceWorkspace({
      ...workspace,
      activeId: fresh.id,
      projects: [...workspace.projects, fresh],
    });
    setStage("brief");
  };
  const duplicate = () => {
    if (!canAddProject) {
      setStorageState(`Project limit reached (${MAX_CAPABILITY_PROJECTS})`);
      return;
    }
    const copy = {
      ...project,
      id: newProject(project.kind).id,
      name: `${titleFor(project)} copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewed: false,
    };
    replaceWorkspace({
      ...workspace,
      activeId: copy.id,
      projects: [...workspace.projects, copy],
    });
  };
  const removeProject = () => {
    if (
      !window.confirm(
        `Delete ${titleFor(project)} from this browser workspace? Download a backup first if you need to keep it.`,
      )
    )
      return;
    const remaining = workspace.projects.filter(
      (item) => item.id !== project.id,
    );
    const projects = remaining.length ? remaining : [newProject()];
    replaceWorkspace({ version: 1, activeId: projects[0].id, projects });
    setStage("brief");
  };
  const files = buildCapabilityFiles(project);
  const assessment = assessCapability(project);
  const readinessLabel =
    assessment.state === "owner-reviewed-structural-draft"
      ? "Owner-reviewed draft"
      : assessment.state === "ready-for-owner-review-structural-draft"
        ? "Ready for owner review"
        : "Incomplete draft";
  const previewFile =
    files.find((file) => file.path === selectedFile) ?? files[0];
  const chooseImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    const revision = ++importRevision.current;
    // Freeze the visible draft and saved baseline while the file is read. A
    // later confirmation must not silently replace intervening edits.
    const displayBase = parseCapabilityBackup(
      createCapabilityBackup(workspaceRef.current),
    );
    const persistedBase = parseCapabilityBackup(
      createCapabilityBackup(persistedWorkspace.current),
    );
    setPendingImport(null);
    setImportError("");
    if (file.size > MAX_CAPABILITY_BACKUP_BYTES) {
      setImportError(
        `Backups must be ${Math.floor(MAX_CAPABILITY_BACKUP_BYTES / 1_000_000)} MB or smaller.`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (revision !== importRevision.current) return;
      try {
        setPendingImport({
          workspace: parseCapabilityBackup(String(reader.result)),
          displayBase,
          persistedBase,
        });
        setImportError("");
      } catch (error) {
        setImportError(
          error instanceof Error
            ? error.message
            : "This backup could not be read.",
        );
      }
    };
    reader.onerror = () => {
      if (revision !== importRevision.current) return;
      setImportError("This backup could not be read.");
    };
    reader.readAsText(file);
  };

  const confirmImport = async () => {
    if (!pendingImport || importApplying) return;
    setImportApplying(true);
    const pending = pendingImport;
    const captureRecovery = (): ImportRecovery => {
      const recovery: ImportRecovery = {
        schema: "okh-capability-import-recovery",
        schemaVersion: 1,
        persistedRevision: null,
        persistedSnapshot: null,
        persistedSerialized: null,
        storageRead: "unavailable",
        currentSnapshot: workspaceRef.current,
        importedSnapshot: pending.workspace,
      };
      try {
        recovery.persistedSerialized = localStorage.getItem(CAPABILITY_WORKSPACE_KEY);
        recovery.storageRead = "read";
        if (recovery.persistedSerialized !== null) {
          try {
            const stored = parseCapabilityWorkspaceStorageValue(recovery.persistedSerialized);
            recovery.persistedSnapshot = stored.workspace;
            recovery.persistedRevision = stored.revision;
          } catch { recovery.storageRead = "unvalidated"; }
        }
      } catch { /* The visible draft and import remain downloadable without storage. */ }
      return recovery;
    };
    try {
      const result = await withCapabilityWorkspaceWriter(() => {
        const recovery = captureRecovery();
        // Catch same-tab edits, even when their save is still queued. The
        // revision-aware save checks persisted changes under this same lock.
        if (!sameCapabilityWorkspaceContent(workspaceRef.current, pending.displayBase)) {
          return {
            saved: false,
            workspace: workspaceRef.current,
            recovery,
          };
        }
        const result = saveCapabilityWorkspaceRevisionAware(
          pending.workspace,
          pending.persistedBase,
          workspaceRef.current,
        );
        setRawRecoveries(getCapabilityRawRecoveries());
        if (result.saved) {
          // Obsolete queued saves belong to the replaced workspace. Invalidate
          // them while holding the lock, before another queued writer can run.
          workspaceEpoch.current += 1;
          persistedWorkspace.current = result.workspace;
          workspaceRef.current = result.workspace;
          setWorkspace(result.workspace);
        }
        return { ...result, recovery: result.saved ? recovery : captureRecovery() };
      });
      setPendingImport(null);
      if (!result.saved) {
        setImportRecovery(result.recovery);
        setImportError(
          "The current workspace changed or could not be saved. The saved state, current draft and imported snapshot are available in import recovery. Download recovery before refreshing or closing.",
        );
        return;
      }
      setImportRecovery(null);
      setImportError("");
      setConflictRecovery(undefined);
      setRecoveryNeeded(false);
      setStorageState("Saved locally · imported workspace");
      setStage("brief");
    } catch (error) {
      setPendingImport(null);
      setImportRecovery(captureRecovery());
      setImportError(
        "The current workspace could not be checked. Current and imported snapshots remain downloadable; saved-state availability is recorded in the recovery file. Download recovery before refreshing or closing.",
      );
    } finally {
      setImportApplying(false);
    }
  };

  return (
    <main className="capability-workbench">
      <header className="cw-masthead">
        <div>
          <p className="cw-kicker">OverKill Hill P³ / FoundRy</p>
          <h1>Capability workbench</h1>
          <p className="cw-deck">
            Create portable Agent Skills, recover the useful methods in existing
            GPTs, and plan plugins and connectors for your chosen hosts. Author
            locally, then export the source for implementation and testing.
          </p>
        </div>
        <div className="cw-header-actions">
          <span
            role="status"
            aria-live="off"
            className={`cw-storage ${storageState.startsWith("Saved") ? "is-good" : "is-warning"}`}
          >
            {storageState}
          </span>
          <span
            className="cw-save-announcement"
            aria-live="polite"
            aria-atomic="true"
            style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }}
          >
            {recoveryAnnouncement}
          </span>
          {rawRecoveries.map((rawRecovery) => (
            <div
              className="cw-raw-recovery"
              role="group"
              aria-label={`Raw source recovery ${rawRecovery.id}`}
              key={rawRecovery.id}
            >
              <p>
                Raw source {rawRecovery.id} is unparsed and unvalidated.
                {rawRecovery.recoveryKeyVerified
                  ? ` A separate local recovery copy for source ${rawRecovery.id} was verified.`
                  : ` A separate local recovery copy for source ${rawRecovery.id} is not confirmed; download it before refreshing or closing.`}
              </p>
              <button
                className="cw-button"
                type="button"
                onClick={() => triggerDownload(
                  `foundry-raw-recovery-${rawRecovery.id}-unparsed-unvalidated.txt`,
                  rawRecovery.source,
                  "text/plain;charset=utf-8",
                )}
              >
                {`Download raw source ${rawRecovery.id} (unparsed, unvalidated)`}
              </button>
            </div>
          ))}
          {recoveryNeeded && (
            <button
              className="cw-button"
              type="button"
              onClick={() => triggerDownload(
                conflictRecovery ? "foundry-conflict-recovery.json" : "foundry-unsaved-backup.json",
                conflictRecovery
                  ? createCapabilityConflictBackup({
                      ...conflictRecovery,
                      competingSnapshot: workspace,
                      competingSerialized: JSON.stringify(workspace),
                    })
                  : createCapabilityBackup(workspace),
                "application/json",
              )}
            >
              {conflictRecovery ? "Download both snapshots" : "Download newest backup"}
            </button>
          )}
          <button
            className="cw-button cw-button--solid"
            type="button"
            disabled={!canAddProject}
            onClick={() => create()}
          >
            New capability
          </button>
        </div>
      </header>

      <section className="cw-universe" aria-labelledby="universe-title">
        <div className="cw-universe-copy">
          <p className="cw-kicker">Orientation</p>
          <h2 id="universe-title">Three workshops, one shared catalog</h2>
          <p>
            FoundRy is the OverKill Hill workshop and mentor pattern for the
            distinct AskJamie and Glee-fully FoundRys. All three can learn from
            each other. Skillz is their shared catalog.
          </p>
        </div>
        <svg
          className="cw-universe-diagram"
          viewBox="0 0 520 255"
          role="img"
          aria-labelledby="rings-title rings-description"
        >
          <title id="rings-title">
            Three overlapping regions of the OverKill Hill universe
          </title>
          <desc id="rings-description">
            AskJamie is left, OverKill connects the center, and Glee-fully is
            right. Skillz is shared across all three. This FoundRy stays inside
            the exclusive OverKill area.
          </desc>
          <circle cx="135" cy="130" r="108" className="cw-region" />
          <circle
            cx="260"
            cy="130"
            r="112"
            className="cw-region cw-region--center"
          />
          <circle cx="385" cy="130" r="108" className="cw-region" />
          <text x="93" y="108" textAnchor="middle">
            AskJamie
          </text>
          <text x="427" y="108" textAnchor="middle">
            Glee-fully
          </text>
          <text x="260" y="202" textAnchor="middle">
            OverKill
          </text>
          <rect
            x="219"
            y="44"
            width="82"
            height="30"
            rx="4"
            className="cw-diagram-label"
          />
          <text x="260" y="64" textAnchor="middle">
            FoundRy
          </text>
          <path d="M90 142 H430" className="cw-shared-line" />
          <rect
            x="175"
            y="126"
            width="170"
            height="32"
            rx="4"
            className="cw-diagram-label"
          />
          <text x="260" y="147" textAnchor="middle">
            Skillz · shared catalog
          </text>
        </svg>
        <div
          className="cw-siblings"
          aria-label="Entry surfaces and sibling repositories"
        >
          <span>Entry surfaces</span>
          {PUBLIC_SURFACES.map(([label, href, detail]) => (
            <a key={href} href={href} target="_blank" rel="noreferrer">
              {label} <small>({detail})</small> ↗
            </a>
          ))}
        </div>
      </section>

      <section
        className="cw-projectbar"
        aria-label="Capability project controls"
      >
        <label>
          Project
          <select
            value={project.id}
            onChange={(event) =>
              replaceWorkspace({ ...workspace, activeId: event.target.value })
            }
          >
            {workspace.projects.map((item) => (
              <option key={item.id} value={item.id}>
                {titleFor(item)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="cw-button"
          disabled={!canAddProject}
          onClick={duplicate}
        >
          Duplicate
        </button>
        <button type="button" className="cw-button" onClick={removeProject}>
          Delete project
        </button>
        <button
          type="button"
          className="cw-button"
          title="Download a backup of the current capability workspace"
          onClick={() =>
            triggerDownload(
              "foundry-workspace-backup.json",
              createCapabilityBackup(workspace),
              "application/json",
            )
          }
        >
          Download backup
        </button>
        <button
          type="button"
          className="cw-button"
          disabled={importApplying}
          onClick={() => inputRef.current?.click()}
        >
          Import backup
        </button>
        <input
          ref={inputRef}
          className="cw-visually-hidden"
          type="file"
          accept="application/json"
          onChange={chooseImport}
        />
        <button
          type="button"
          className="cw-creator-link"
          onClick={onOpenCreator}
        >
          Open legacy Custom GPT studio →
        </button>
      </section>
      {importError && (
        <p className="cw-import-error" role="alert">
          Import stopped: {importError}
        </p>
      )}
      {importRecovery && (
        <button className="cw-button" type="button" onClick={() => triggerDownload(
          "foundry-import-recovery.json",
          JSON.stringify({
            ...importRecovery,
            currentSnapshot: workspace,
            currentSerialized: JSON.stringify(workspace),
            importedSerialized: JSON.stringify(importRecovery.importedSnapshot),
          }, null, 2),
          "application/json",
        )}>
          Download import recovery
        </button>
      )}
      {pendingImport && (
        <section className="cw-confirm" role="alert">
          <div>
            <strong>Replace this workspace?</strong>
            <p>
              Replacing affects the {workspace.projects.length} capability
              project{workspace.projects.length === 1 ? "" : "s"} currently
              open in this browser and imports {pendingImport.workspace.projects.length}
              project{pendingImport.workspace.projects.length === 1 ? "" : "s"}.
              Custom GPT projects are not affected. Download the current backup
              first if you may want to restore it.
            </p>
            <div className="cw-fields cw-fields--two">
              <div>
                <strong>Current projects</strong>
                <ul aria-label="Current projects to be replaced">
                  {workspace.projects.map((item) => (
                    <li key={item.id}>{titleFor(item)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Imported projects</strong>
                <ul aria-label="Projects in imported backup">
                  {pendingImport.workspace.projects.map((item) => (
                    <li key={item.id}>{titleFor(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <button className="cw-button" type="button" onClick={() => triggerDownload(
            "foundry-current-workspace-backup.json", createCapabilityBackup(workspace), "application/json",
          )}>
            Download current backup
          </button>
          <button
            className="cw-button"
            type="button"
            disabled={importApplying}
            onClick={() => setPendingImport(null)}
          >
            Keep current
          </button>
          <button
            className="cw-button cw-button--danger"
            type="button"
            disabled={importApplying}
            onClick={() => {
              void confirmImport();
            }}
          >
            Replace workspace
          </button>
        </section>
      )}

      <nav className="cw-stages" aria-label="Workbench stages">
        {STAGES.map((item) => (
          <button
            aria-current={stage === item.id ? "step" : undefined}
            key={item.id}
            type="button"
            className={stage === item.id ? "is-active" : ""}
            onClick={() => setStage(item.id)}
          >
            <span>{item.number}</span>
            {item.label}
            <small>{item.note}</small>
          </button>
        ))}
      </nav>

      <section className="cw-workarea">
        <aside className="cw-rail">
          <p className="cw-kicker">Current build</p>
          <h2>{titleFor(project)}</h2>
          <p className="cw-kind-label">{project.kind}</p>
          <div className={`cw-state cw-state--${assessment.state}`}>
            {readinessLabel}
          </div>
          <p>
            {assessment.blockers.length
              ? `${assessment.blockers.length} thing${assessment.blockers.length === 1 ? "" : "s"} to resolve`
              : "No structural blockers"}
          </p>
        </aside>
        <div className="cw-editor">
          {stage === "convert" && (
            <>
              <div className="cw-section-heading">
                <p className="cw-kicker">Conversion and distribution</p>
                <h2>Preserve the method. Adapt the platform.</h2>
              </div>
              <p className="cw-note">
                Inventory a GPT or existing skill, map its behaviors, then build
                a portable skill in Build. Plugin and connector choices add a
                packaging plan; each host still needs implementation and
                testing.
              </p>
              <div className="cw-fields cw-fields--two">
                <label>
                  Starting point
                  <select
                    value={project.sourceType ?? "new"}
                    onChange={(event) =>
                      update("sourceType", event.target.value)
                    }
                  >
                    <option value="new">New capability</option>
                    <option value="custom-gpt">Existing Custom GPT</option>
                    <option value="existing-skill">Existing Agent Skill</option>
                  </select>
                </label>
                <label>
                  Delivery package
                  <select
                    value={project.delivery ?? "source"}
                    onChange={(event) => update("delivery", event.target.value)}
                  >
                    <option value="source">Portable source</option>
                    <option value="plugin">Plugin packaging plan</option>
                    <option value="connector">Connector packaging plan</option>
                  </select>
                </label>
              </div>
              {(
                [
                  [
                    "sourceRef",
                    "Source reference",
                    "Repository URL and exact revision, or supplied GPT export and date. No secrets.",
                  ],
                  [
                    "sourceInventory",
                    "Source asset inventory",
                    "Instructions, knowledge files, actions, starters, examples and rights. Mark available, partial, missing or unverified.",
                  ],
                  [
                    "behaviorMap",
                    "Behavior map",
                    "For each behavior: portable skill procedure, reference, tool adapter, explicit drop or blocker.",
                  ],
                  [
                    "semanticLoss",
                    "Semantic loss and tests",
                    "What may change (retrieval, memory, permissions)? Record impact, mitigation and an observable acceptance test.",
                  ],
                  [
                    "runtimeTargets",
                    "Target hosts",
                    "One host and intended version per line: Claude, ChatGPT/Codex, OpenClaw, Perplexity, another runtime. Support remains unverified until tested.",
                  ],
                  [
                    "toolRequirements",
                    "Tools and permissions",
                    "MCP servers, APIs, apps, authentication method, required permissions and missing-tool recovery; write none if unnecessary.",
                  ],
                  [
                    "compatibilityEvidence",
                    "Host compatibility evidence",
                    "Host/version, skill revision, installation and behavior results, date and evidence link; record untested gaps.",
                  ],
                ] as const
              ).map(([field, label, placeholder]) => (
                <label key={field}>
                  {label}
                  <textarea
                    aria-label={label}
                    value={project[field] ?? ""}
                    placeholder={placeholder}
                    onChange={(event) => update(field, event.target.value)}
                  />
                </label>
              ))}
            </>
          )}
          {stage === "brief" && (
            <>
              <div className="cw-section-heading">
                <p className="cw-kicker">01 / intent</p>
                <h2>Name the useful thing before choosing its wrapper.</h2>
              </div>
              <div className="cw-fields cw-fields--two">
                <label>
                  Capability name
                  <input
                    value={project.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="e.g. Source-backed interview planner"
                  />
                </label>
                <label>
                  Owner
                  <input
                    value={project.owner}
                    onChange={(event) => update("owner", event.target.value)}
                    placeholder="Who is accountable?"
                  />
                </label>
                <label>
                  Version
                  <input
                    value={project.version}
                    onChange={(event) => update("version", event.target.value)}
                    placeholder="v0.1"
                  />
                </label>
                <label>
                  Audience
                  <input
                    value={project.audience}
                    onChange={(event) => update("audience", event.target.value)}
                    placeholder="Who will use it?"
                  />
                </label>
              </div>
              <label>
                Purpose
                <textarea
                  aria-label="Purpose"
                  value={project.purpose}
                  onChange={(event) => update("purpose", event.target.value)}
                  placeholder="What outcome should this capability help create?"
                />
              </label>
              <fieldset>
                <legend>Canonical source form</legend>
                <div className="cw-kinds">
                  {KINDS.map((kind) => (
                    <button
                      type="button"
                      key={kind.value}
                      aria-pressed={project.kind === kind.value}
                      className={
                        project.kind === kind.value ? "is-selected" : ""
                      }
                      onClick={() => update("kind", kind.value)}
                    >
                      <b>{kind.label}</b>
                      <span>{kind.detail}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <p className="cw-note">
                Start with a skill for reusable agent behavior. Use Convert
                &amp; adapt to capture an existing GPT and plan host-specific
                packaging.
              </p>
            </>
          )}
          {stage === "contract" && (
            <>
              <div className="cw-section-heading">
                <p className="cw-kicker">03 / contract</p>
                <h2>State what comes in, what leaves, and where it stops.</h2>
              </div>
              <div className="cw-fields">
                <label>
                  Inputs
                  <textarea
                    aria-label="Inputs"
                    value={project.inputs}
                    onChange={(event) => update("inputs", event.target.value)}
                    placeholder="Sources, decisions, parameters…"
                  />
                </label>
                <label>
                  Outputs
                  <textarea
                    aria-label="Outputs"
                    value={project.outputs}
                    onChange={(event) => update("outputs", event.target.value)}
                    placeholder="Files, recommendations, structured records…"
                  />
                </label>
                <label>
                  Constraints
                  <textarea
                    aria-label="Constraints"
                    value={project.constraints}
                    onChange={(event) =>
                      update("constraints", event.target.value)
                    }
                    placeholder="Privacy, permissions, exclusions, escalation…"
                  />
                </label>
                <label>
                  Acceptance criteria
                  <textarea
                    aria-label="Acceptance criteria"
                    value={project.acceptance}
                    onChange={(event) =>
                      update("acceptance", event.target.value)
                    }
                    placeholder="Observable conditions that show the starter is useful"
                  />
                </label>
              </div>
            </>
          )}
          {stage === "build" && (
            <>
              <div className="cw-section-heading">
                <p className="cw-kicker">04 / method</p>
                <h2>
                  Capture the canonical method, then point to shared sources.
                </h2>
              </div>
              <label>
                Instructions
                <textarea
                  aria-label="Instructions"
                  value={project.instructions}
                  onChange={(event) =>
                    update("instructions", event.target.value)
                  }
                  placeholder="Sequence, decisions, and recovery behavior. Keep claims bounded to what you know."
                />
              </label>
              <div className="cw-fields cw-fields--two">
                <label>
                  Components
                  <textarea
                    aria-label="Components"
                    value={project.components}
                    onChange={(event) =>
                      update("components", event.target.value)
                    }
                    placeholder="Modules, templates, diagrams, scripts…"
                  />
                </label>
                <label>
                  Skillz and canonical references
                  <textarea
                    aria-label="Skillz and canonical references"
                    value={project.skillRefs}
                    onChange={(event) =>
                      update("skillRefs", event.target.value)
                    }
                    placeholder="Public Skillz URLs or names; one per line"
                  />
                </label>
              </div>
              <p className="cw-note">
                Method links:{" "}
                <a
                  href="https://github.com/OKHP3/OverKill-Hill-FoundRy/blob/main/phenomould-ry/README.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  PhenoMould construction ↗
                </a>{" "}
                ·{" "}
                <a
                  href="https://github.com/OKHP3/skillz"
                  target="_blank"
                  rel="noreferrer"
                >
                  shared Skillz catalog ↗
                </a>{" "}
                ·{" "}
                <a
                  href="https://github.com/OKHP3/OverKill-Hill-FoundRy/blob/main/telleprompt-ry/README.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  TellePrompt interpretation ↗
                </a>{" "}
                ·{" "}
                <a
                  href="https://github.com/OKHP3/OverKill-Hill-FoundRy/blob/main/structrefino-ry/README.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  StructRefino review ↗
                </a>
              </p>
            </>
          )}
          {stage === "validate" && (
            <>
              <div className="cw-section-heading">
                <p className="cw-kicker">05 / observed evidence</p>
                <h2>Record what was actually checked.</h2>
              </div>
              <label>
                Evidence and validation notes
                <textarea
                  aria-label="Evidence and validation notes"
                  value={project.evidence}
                  onChange={(event) => update("evidence", event.target.value)}
                  placeholder="Observed results, dates, limitations, and unresolved risks. A filled field is not proof of behavior."
                />
              </label>
              <label className="cw-review">
                <input
                  type="checkbox"
                  checked={project.reviewed}
                  onChange={(event) => update("reviewed", event.target.checked)}
                />{" "}
                I reviewed this starter against its stated contract.
              </label>
              <div className="cw-checks">
                {assessment.checks.map((check) => (
                  <div
                    key={check.label}
                    className={check.passed ? "is-passed" : ""}
                  >
                    <span aria-hidden="true">{check.passed ? "✓" : "·"}</span>
                    {check.label}
                  </div>
                ))}
              </div>
            </>
          )}
          {stage === "package" && (
            <>
              <div className="cw-section-heading">
                <p className="cw-kicker">06 / handoff</p>
                <h2>Inspect the source bundle before sharing it.</h2>
              </div>
              <p className="cw-note">
                Exports are local starter files. They do not publish, deploy,
                provision repositories, or establish production readiness.
                Plugin and connector exports include packaging plans, not
                installed integrations.
              </p>
              <div className="cw-package">
                <div className="cw-file-list" aria-label="Generated files">
                  {files.map((file) => (
                    <button
                      key={file.path}
                      type="button"
                      className={
                        previewFile?.path === file.path ? "is-selected" : ""
                      }
                      onClick={() => setSelectedFile(file.path)}
                    >
                      {file.path}
                    </button>
                  ))}
                </div>
                <pre aria-label="Selected generated file">
                  {previewFile?.content ||
                    "No generated files are available for this starter yet."}
                </pre>
              </div>
              <div className="cw-package-actions">
                <button
                  className="cw-button"
                  type="button"
                  onClick={() =>
                    triggerDownload(
                      "foundry-workspace-backup.json",
                      createCapabilityBackup(workspace),
                      "application/json",
                    )
                  }
                >
                  Download workspace backup
                </button>
                <button
                  className="cw-button cw-button--solid"
                  type="button"
                  onClick={() =>
                    downloadZip(
                      `${
                        project.name
                          .trim()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-") || "capability"
                      }-starter.zip`,
                      buildCapabilityZip(project),
                    )
                  }
                >
                  Download starter ZIP
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
