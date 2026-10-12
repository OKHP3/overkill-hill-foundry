import assert from "node:assert/strict";
import test from "node:test";
import {
  CAPABILITY_WORKSPACE_KEY,
  createCapabilityConflictBackup,
  loadCapabilityWorkspace,
  newProject,
  saveCapabilityWorkspaceRevisionAware,
  withCapabilityWorkspaceWriter,
  type CapabilityWorkspace,
} from "./capability-workbench.ts";

function makeWorkspace(): CapabilityWorkspace {
  const project = newProject();
  return { version: 1, activeId: project.id, projects: [project] };
}

function installStorage(): { values: Map<string, string>; restore: () => void } {
  const values = new Map<string, string>();
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  return {
    values,
    restore: () => {
      if (previous) Object.defineProperty(globalThis, "localStorage", previous);
      else delete (globalThis as { localStorage?: unknown }).localStorage;
    },
  };
}

test("different-field stale edits fail closed and export both exact snapshots", () => {
  const storage = installStorage();
  try {
    const base = makeWorkspace();
    assert.equal(saveCapabilityWorkspaceRevisionAware(base).saved, true);
    const tabA = structuredClone(base);
    const tabB = structuredClone(base);
    tabA.projects[0].name = "Saved from tab A";
    assert.equal(saveCapabilityWorkspaceRevisionAware(tabA, base).saved, true);
    tabB.projects[0].purpose = "Saved from tab B";
    const result = saveCapabilityWorkspaceRevisionAware(tabB, base);
    assert.equal(result.saved, false);
    assert.equal(result.conflict?.authoritativeSnapshot.projects[0].name, "Saved from tab A");
    assert.equal(result.conflict?.authoritativeSnapshot.projects[0].purpose, base.projects[0].purpose);
    assert.equal(result.conflict?.competingSnapshot.projects[0].name, base.projects[0].name);
    assert.equal(result.conflict?.competingSnapshot.projects[0].purpose, "Saved from tab B");
    assert.equal(result.conflict?.authoritativeSerialized, storage.values.get(CAPABILITY_WORKSPACE_KEY));
    assert.equal(JSON.parse(result.conflict!.competingSerialized).projects[0].purpose, "Saved from tab B");
    const persisted = JSON.parse(storage.values.get(CAPABILITY_WORKSPACE_KEY)!);
    assert.equal(persisted.projects[0].name, "Saved from tab A");
    assert.equal(persisted.projects[0].purpose, base.projects[0].purpose);
    assert.equal(persisted.__okhCapabilityRevision, result.conflict?.authoritativeRevision);
    const recovery = JSON.parse(createCapabilityConflictBackup(result.conflict!));
    assert.equal(recovery.authoritativeSnapshot.projects[0].name, "Saved from tab A");
    assert.equal(recovery.competingSnapshot.projects[0].purpose, "Saved from tab B");
  } finally {
    storage.restore();
  }
});

test("same-field stale writes keep authority and export both inspectable snapshots", () => {
  const storage = installStorage();
  try {
    const base = makeWorkspace();
    assert.equal(saveCapabilityWorkspaceRevisionAware(base).saved, true);
    const tabA = structuredClone(base);
    const tabB = structuredClone(base);
    tabA.projects[0].name = "Authoritative edit";
    assert.equal(saveCapabilityWorkspaceRevisionAware(tabA, base).saved, true);
    tabB.projects[0].name = "Competing edit";
    const result = saveCapabilityWorkspaceRevisionAware(tabB, base);
    assert.equal(result.saved, false);
    assert.equal(result.workspace.projects[0].name, "Competing edit");
    assert.equal(result.conflict?.authoritativeSnapshot.projects[0].name, "Authoritative edit");
    assert.equal(result.conflict?.competingSnapshot.projects[0].name, "Competing edit");
    assert.ok(result.conflict?.authoritativeRevision);
    const recovery = JSON.parse(createCapabilityConflictBackup(result.conflict!));
    assert.equal(recovery.authoritativeSnapshot.projects[0].name, "Authoritative edit");
    assert.equal(recovery.competingSnapshot.projects[0].name, "Competing edit");
    assert.equal(recovery.authoritativeRevision, result.conflict?.authoritativeRevision);
    assert.equal(loadCapabilityWorkspace().workspace.projects[0].name, "Competing edit");
    assert.equal(JSON.parse(storage.values.get(CAPABILITY_WORKSPACE_KEY)!).projects[0].name, "Authoritative edit");
  } finally {
    storage.restore();
  }
});

test("a stale save cannot silently replace imported project order", () => {
  const storage = installStorage();
  try {
    const base = makeWorkspace();
    base.projects.push(newProject());
    assert.equal(saveCapabilityWorkspaceRevisionAware(base).saved, true);
    const reordered = structuredClone(base);
    reordered.projects.reverse();
    assert.equal(saveCapabilityWorkspaceRevisionAware(reordered, base).saved, true);
    const authorityBytes = storage.values.get(CAPABILITY_WORKSPACE_KEY);
    const stale = structuredClone(base);
    stale.projects[0].purpose = "A later edit from the stale order";
    const result = saveCapabilityWorkspaceRevisionAware(stale, base);
    assert.equal(result.saved, false);
    assert.equal(storage.values.get(CAPABILITY_WORKSPACE_KEY), authorityBytes);
    assert.deepEqual(result.conflict?.authoritativeSnapshot.projects.map(p => p.id), reordered.projects.map(p => p.id));
    assert.deepEqual(result.conflict?.competingSnapshot.projects.map(p => p.id), base.projects.map(p => p.id));
  } finally {
    storage.restore();
  }
});

test("updatedAt alone does not create a stale-content conflict", () => {
  const storage = installStorage();
  try {
    const base = makeWorkspace();
    assert.equal(saveCapabilityWorkspaceRevisionAware(base).saved, true);
    const metadataOnly = structuredClone(base);
    metadataOnly.projects[0].updatedAt = "2099-01-01T00:00:00.000Z";
    assert.equal(saveCapabilityWorkspaceRevisionAware(metadataOnly, base).saved, true);

    const tabWithEdit = structuredClone(base);
    tabWithEdit.projects[0].purpose = "Meaningful edit";
    const result = saveCapabilityWorkspaceRevisionAware(tabWithEdit, base);
    assert.equal(result.saved, true);
    assert.equal(result.workspace.projects[0].purpose, "Meaningful edit");
  } finally {
    storage.restore();
  }
});

test("stores workspace and authoritative revision in one atomic key write", () => {
  const storage = installStorage();
  try {
    const base = makeWorkspace();
    const result = saveCapabilityWorkspaceRevisionAware(base);
    assert.equal(result.saved, true);
    const raw = storage.values.get(CAPABILITY_WORKSPACE_KEY)!;
    assert.ok(JSON.parse(raw).__okhCapabilityRevision);
    assert.equal(storage.values.has(`${CAPABILITY_WORKSPACE_KEY}-revision`), false);
  } finally {
    storage.restore();
  }
});

test("storage denial retains the latest edit in memory and leaves authority unchanged", () => {
  const storage = installStorage();
  try {
    const base = makeWorkspace();
    assert.equal(saveCapabilityWorkspaceRevisionAware(base).saved, true);
    const authoritativeRaw = storage.values.get(CAPABILITY_WORKSPACE_KEY);
    const blocked = structuredClone(base);
    blocked.projects[0].purpose = "Keep in memory";
    const originalSetItem = globalThis.localStorage.setItem;
    globalThis.localStorage.setItem = (key, value) => {
      if (key === CAPABILITY_WORKSPACE_KEY) throw new Error("Storage denied");
      originalSetItem.call(globalThis.localStorage, key, value);
    };
    const result = saveCapabilityWorkspaceRevisionAware(blocked, base);
    assert.equal(result.saved, false);
    assert.equal(loadCapabilityWorkspace().workspace.projects[0].purpose, "Keep in memory");
    assert.equal(storage.values.get(CAPABILITY_WORKSPACE_KEY), authoritativeRaw);
  } finally {
    storage.restore();
  }
});

test("simultaneous writer requests serialize and the second stale save is recoverable", async () => {
  const storage = installStorage();
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  let tail = Promise.resolve();
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      locks: {
        request: (_name: string, options: { mode: string }, callback: (lock: object) => unknown) => {
          assert.equal(options.mode, "exclusive");
          const operation = tail.then(() => callback({}));
          tail = operation.then(() => undefined, () => undefined);
          return operation;
        },
      },
    },
  });
  try {
    const base = makeWorkspace();
    assert.equal(saveCapabilityWorkspaceRevisionAware(base).saved, true);
    const tabA = structuredClone(base);
    const tabB = structuredClone(base);
    tabA.projects[0].purpose = "Writer A";
    tabB.projects[0].purpose = "Writer B";
    const results = await Promise.all([
      withCapabilityWorkspaceWriter(() => saveCapabilityWorkspaceRevisionAware(tabA, base)),
      withCapabilityWorkspaceWriter(() => saveCapabilityWorkspaceRevisionAware(tabB, base)),
    ]);
    assert.equal(results.filter((result) => result.saved).length, 1);
    assert.equal(results.filter((result) => result.conflict).length, 1);
    const conflict = results.find((result) => result.conflict)!.conflict!;
    assert.ok(["Writer A", "Writer B"].includes(conflict.authoritativeSnapshot.projects[0].purpose));
    assert.ok(["Writer A", "Writer B"].includes(conflict.competingSnapshot.projects[0].purpose));
    assert.notEqual(conflict.authoritativeSnapshot.projects[0].purpose, conflict.competingSnapshot.projects[0].purpose);
  } finally {
    storage.restore();
    if (previousNavigator) Object.defineProperty(globalThis, "navigator", previousNavigator);
    else delete (globalThis as { navigator?: unknown }).navigator;
  }
});
