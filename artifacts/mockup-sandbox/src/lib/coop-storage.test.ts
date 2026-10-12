import assert from "node:assert/strict";
import test from "node:test";
import {
  CAPABILITY_WORKSPACE_KEY,
  loadCapabilityWorkspace,
  newProject,
  saveCapabilityWorkspace,
  type CapabilityWorkspace,
} from "./capability-workbench.ts";

type StorageMap = Map<string, string>;

function workspace(name: string): CapabilityWorkspace {
  const project = { ...newProject("prompt"), name };
  return { version: 1, activeId: project.id, projects: [project] };
}

function installStorage(
  values: StorageMap,
  setItem: (key: string, value: string) => void = (key, value) => {
    values.set(key, value);
  },
): PropertyDescriptor | undefined {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem,
    },
  });
  return previous;
}

function restoreStorage(previous: PropertyDescriptor | undefined): void {
  if (previous) Object.defineProperty(globalThis, "localStorage", previous);
  else delete (globalThis as { localStorage?: unknown }).localStorage;
}

test("unavailable storage preserves the latest workspace in memory until recovery", () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  try {
    delete (globalThis as { localStorage?: unknown }).localStorage;
    const latest = workspace("Only in this tab");
    assert.equal(saveCapabilityWorkspace(latest), false);
    assert.match(loadCapabilityWorkspace().warning, /changes remain in this tab/);
    assert.equal(loadCapabilityWorkspace().workspace.projects[0].name, "Only in this tab");

    const values = new Map<string, string>();
    installStorage(values);
    assert.equal(saveCapabilityWorkspace(latest), true);
    assert.equal(JSON.parse(values.get(CAPABILITY_WORKSPACE_KEY)!).projects[0].name, "Only in this tab");
  } finally {
    restoreStorage(previous);
  }
});

test("quota failure keeps the accepted edit available for a later retry", () => {
  const values = new Map<string, string>();
  const previous = installStorage(values);
  try {
    const original = workspace("Persisted");
    assert.equal(saveCapabilityWorkspace(original), true);
    const savedBytes = values.get(CAPABILITY_WORKSPACE_KEY);
    const blocked = workspace("Retry after quota");
    installStorage(values, () => {
      throw new Error("quota exceeded");
    });
    assert.equal(saveCapabilityWorkspace(blocked), false);
    assert.equal(loadCapabilityWorkspace().workspace.projects[0].name, "Retry after quota");
    assert.equal(values.get(CAPABILITY_WORKSPACE_KEY), savedBytes);

    installStorage(values);
    assert.equal(saveCapabilityWorkspace(blocked), true);
    assert.equal(loadCapabilityWorkspace().workspace.projects[0].name, "Retry after quota");
  } finally {
    restoreStorage(previous);
  }
});

test("replacing malformed capability data preserves an exact recovery copy", () => {
  const malformed = '{"schema":"broken","keep":"this"}';
  const values = new Map([[CAPABILITY_WORKSPACE_KEY, malformed]]);
  const previous = installStorage(values);
  try {
    const replacement = workspace("Recovered replacement");
    assert.equal(saveCapabilityWorkspace(replacement), true);
    const recoveryEntries = [...values.entries()].filter(([key]) =>
      key.startsWith(`${CAPABILITY_WORKSPACE_KEY}-recovery-`),
    );
    assert.equal(recoveryEntries.length, 1);
    assert.equal(recoveryEntries[0][1], malformed);
    assert.equal(JSON.parse(values.get(CAPABILITY_WORKSPACE_KEY)!).projects[0].name, "Recovered replacement");
  } finally {
    restoreStorage(previous);
  }
});

test("capability storage never reads or overwrites the GPT workspace namespace", () => {
  const gptKey = "cgpt-workspace";
  const gptData = '{"private":"GPT data"}';
  const values = new Map([
    [CAPABILITY_WORKSPACE_KEY, JSON.stringify(workspace("Capability data"))],
    [gptKey, gptData],
  ]);
  const previous = installStorage(values);
  try {
    assert.equal(loadCapabilityWorkspace().workspace.projects[0].name, "Capability data");
    assert.equal(saveCapabilityWorkspace(workspace("Updated capability")), true);
    assert.equal(values.get(gptKey), gptData);
    assert.equal(values.has(`${gptKey}-recovery-1`), false);
    assert.equal(values.get(CAPABILITY_WORKSPACE_KEY)!.includes("Updated capability"), true);
  } finally {
    restoreStorage(previous);
  }
});
