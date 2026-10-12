import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  createCapabilityBackup,
  newProject,
} from "../../mockup-sandbox/src/lib/capability-workbench";

const storeKey = "okh-capability-workspace";

function fixture(name: string) {
  const project = newProject();
  project.id = `fixture-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  project.name = name;
  return { version: 1 as const, activeId: project.id, projects: [project] };
}

async function importFile(page: Page, name: string) {
  const workspace = fixture(name);
  await page.locator('input[type="file"]').setInputFiles({
    name: `${name}.json`,
    mimeType: "application/json",
    buffer: Buffer.from(createCapabilityBackup(workspace)),
  });
  await expect(
    page.getByText("Replace this workspace?", { exact: true }),
  ).toBeVisible();
}

async function readRecovery(page: Page) {
  const started = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download import recovery", exact: true })
    .click();
  const file = await started;
  return JSON.parse(await readFile((await file.path())!, "utf8"));
}

test("current backup can be inspected, cancelled, restored, and replaced without touching GPT storage", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    const project = {
      id: "current-project",
      name: "Current project",
      kind: "skill",
      owner: "",
      version: "0.1.0",
      purpose: "Before replacement",
      audience: "Maintainers",
      inputs: "",
      outputs: "",
      constraints: "",
      instructions: "",
      acceptance: "",
      components: "",
      skillRefs: "",
      evidence: "",
      reviewed: false,
      createdAt: "2026-10-05T00:00:00.000Z",
      updatedAt: "2026-10-05T00:00:00.000Z",
    };
    localStorage.setItem(
      key,
      JSON.stringify({ version: 1, activeId: project.id, projects: [project] }),
    );
    localStorage.setItem("cgpt-workspace", "legacy GPT fixture");
  }, storeKey);
  await page.goto("./");
  const before = await page.evaluate(
    (key) => localStorage.getItem(key),
    storeKey,
  );
  const gptBefore = await page.evaluate(() =>
    localStorage.getItem("cgpt-workspace"),
  );

  const backupStarted = page.waitForEvent("download");
  await importFile(page, "Imported project");
  await page
    .getByRole("button", { name: "Download current backup", exact: true })
    .click();
  const backupDownload = await backupStarted;
  const backupText = await readFile((await backupDownload.path())!, "utf8");
  expect(
    JSON.parse(backupText).workspace.projects.map(
      (project: { name: string }) => project.name,
    ),
  ).toEqual(["Current project"]);

  const confirmation = page.getByRole("alert");
  await expect(confirmation).toContainText(
    "1 capability project currently open",
  );
  await expect(confirmation).toContainText(
    "Custom GPT projects are not affected",
  );
  await expect(
    confirmation.getByRole("list", { name: "Current projects to be replaced" }),
  ).toContainText("Current project");
  await expect(
    confirmation.getByRole("list", { name: "Projects in imported backup" }),
  ).toContainText("Imported project");
  await page.getByRole("button", { name: "Keep current", exact: true }).click();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storeKey),
  ).toBe(before);

  await importFile(page, "Imported project");
  await page.getByRole("button", { name: "Replace workspace", exact: true }).click();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue("Imported project");

  // The exported version-1 backup restores the prior workspace through the same
  // replacement contract, so the downloaded bytes are an actual recovery path.
  await page.locator('input[type="file"]').setInputFiles({
    name: "prior-workspace.json",
    mimeType: "application/json",
    buffer: Buffer.from(backupText),
  });
  await expect(
    page.getByText("Replace this workspace?", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Replace workspace", exact: true })
    .click();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue(
    "Current project",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("cgpt-workspace")),
  ).toBe(gptBefore);
});

test("same-tab edit after opening confirmation blocks import and retains both recovery snapshots", async ({
  page,
}) => {
  await page.goto("./");
  await page
    .getByLabel("Capability name", { exact: true })
    .fill("Current before prompt");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await importFile(page, "Imported snapshot");

  await page
    .getByLabel("Purpose", { exact: true })
    .fill("Same-tab intervening edit");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await page
    .getByRole("button", { name: "Replace workspace", exact: true })
    .click();

  await expect(page.getByRole("alert")).toContainText("Import stopped");
  const recovery = await readRecovery(page);
  expect(recovery.persistedSnapshot.projects[0].purpose).toBe(
    "Same-tab intervening edit",
  );
  expect(recovery.importedSnapshot.projects[0].name).toBe("Imported snapshot");
  const stored = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    storeKey,
  );
  expect(stored.projects[0].purpose).toBe("Same-tab intervening edit");
  expect(stored.projects[0].name).toBe("Current before prompt");
});

test("other-tab edit after opening confirmation blocks import and retains both recovery snapshots", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const original = window.addEventListener.bind(window);
    window.addEventListener = ((type: string, ...args: unknown[]) => {
      if (type === "storage") return;
      return (original as (...values: unknown[]) => void)(type, ...args);
    }) as Window["addEventListener"];
  });
  await page.goto("./");
  await page
    .getByLabel("Capability name", { exact: true })
    .fill("Before import prompt");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await importFile(page, "Imported from other-tab race");

  const otherTab = await context.newPage();
  await otherTab.goto("./");
  await otherTab
    .getByLabel("Purpose", { exact: true })
    .fill("Other-tab intervening edit");
  await expect(otherTab.getByRole("status")).toHaveText("Saved locally");
  await page
    .getByRole("button", { name: "Replace workspace", exact: true })
    .click();

  await expect(page.getByRole("alert")).toContainText("Import stopped");
  const recovery = await readRecovery(page);
  expect(recovery.persistedSnapshot.projects[0].purpose).toBe(
    "Other-tab intervening edit",
  );
  expect(recovery.importedSnapshot.projects[0].name).toBe(
    "Imported from other-tab race",
  );
  const stored = await otherTab.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    storeKey,
  );
  expect(stored.projects[0].purpose).toBe("Other-tab intervening edit");
  expect(stored.projects[0].name).toBe("Before import prompt");
});

test("normal storage events retain the actual authoritative bytes and revision during import recovery", async ({ page, context }) => {
  await page.goto("./");
  await page.getByLabel("Capability name", { exact: true }).fill("Before normal event");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await importFile(page, "Normal event import");
  const other = await context.newPage();
  await other.goto("./");
  await other.getByLabel("Purpose", { exact: true }).fill("Updated through normal storage event");
  await expect(other.getByRole("status")).toHaveText("Saved locally");
  await expect(page.getByLabel("Purpose", { exact: true })).toHaveValue("Updated through normal storage event");
  const authority = await other.evaluate((key) => localStorage.getItem(key)!, storeKey);
  await page.getByRole("button", { name: "Replace workspace", exact: true }).click();
  const recovery = await readRecovery(page);
  expect(recovery.persistedSerialized).toBe(authority);
  expect(recovery.persistedRevision).toBe(JSON.parse(authority).__okhCapabilityRevision);
});

test("failed import preserves the current workspace in memory across studio navigation", async ({ page }) => {
  await page.addInitScript((key) => {
    const original = Storage.prototype.setItem;
    (window as Window & { __denyImport?: boolean }).__denyImport = false;
    Storage.prototype.setItem = function (name, value) {
      if (name === key && (window as Window & { __denyImport?: boolean }).__denyImport) throw new Error("Denied import write");
      original.call(this, name, value);
    };
  }, storeKey);
  await page.goto("./");
  await page.getByLabel("Capability name", { exact: true }).fill("Prior draft");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  const authority = await page.evaluate((key) => localStorage.getItem(key), storeKey);
  await importFile(page, "Rejected import");
  await page.evaluate(() => { (window as Window & { __denyImport?: boolean }).__denyImport = true; });
  await page.getByRole("button", { name: "Replace workspace", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Import stopped");
  await page.getByRole("button", { name: "Open legacy Custom GPT studio →" }).click();
  await page.getByRole("link", { name: "← Capability workbench" }).click();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue("Prior draft");
  await importFile(page, "Rejected import");
  await page.getByRole("button", { name: "Replace workspace", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Import stopped");
  await page.getByLabel("Purpose", { exact: true }).fill("Latest unsaved edit after failed import");
  const recovery = await readRecovery(page);
  expect(recovery.persistedSerialized).toBe(authority);
  expect(recovery.currentSnapshot.projects[0].purpose).toBe("Latest unsaved edit after failed import");
  expect(recovery.importedSnapshot.projects[0].name).toBe("Rejected import");
  await page.getByRole("button", { name: "Open legacy Custom GPT studio →" }).click();
  await page.getByRole("link", { name: "← Capability workbench" }).click();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue("Prior draft");
  await expect(page.getByLabel("Purpose", { exact: true })).toHaveValue("Latest unsaved edit after failed import");
});

test("same-tab edit while confirmation waits for the writer is retained with the imported snapshot", async ({ page }) => {
  await page.goto("./");
  await page.getByLabel("Capability name", { exact: true }).fill("Draft before wait");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await importFile(page, "Waiting import");
  await page.evaluate(() => {
    const state = window as Window & { __writerHeld?: boolean; __releaseWriter?: () => void };
    void navigator.locks.request("okh-capability-workspace:writer", async () => {
      state.__writerHeld = true;
      await new Promise<void>((resolve) => { state.__releaseWriter = resolve; });
    });
  });
  await expect.poll(() => page.evaluate(() => (window as Window & { __writerHeld?: boolean }).__writerHeld)).toBe(true);
  await page.getByRole("button", { name: "Replace workspace", exact: true }).click();
  await page.getByLabel("Purpose", { exact: true }).fill("Edit while import waits");
  await page.evaluate(() => (window as Window & { __releaseWriter?: () => void }).__releaseWriter?.());
  await expect(page.getByRole("alert")).toContainText("Import stopped");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  const recovery = await readRecovery(page);
  expect(recovery.currentSnapshot.projects[0].purpose).toBe("Edit while import waits");
  expect(recovery.importedSnapshot.projects[0].name).toBe("Waiting import");
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storeKey);
  expect(saved.projects[0].name).toBe("Draft before wait");
  expect(saved.projects[0].purpose).toBe("Edit while import waits");
});
