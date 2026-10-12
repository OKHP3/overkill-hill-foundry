import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const storeKey = "okh-capability-workspace";

async function seedAndOpen(page: Page, expectLocks = true) {
  await page.addInitScript((key) => {
    if (localStorage.getItem(key)) return;
    const project = {
      id: "capability-concurrency-fixture",
      name: "Shared capability",
      kind: "skill",
      owner: "",
      version: "0.1.0",
      purpose: "Original purpose",
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
      createdAt: "2026-10-05T00:00:00.000Z",
      updatedAt: "2026-10-05T00:00:00.000Z",
      sourceType: "new",
      delivery: "source",
      sourceRef: "",
      sourceInventory: "",
      behaviorMap: "",
      semanticLoss: "",
      runtimeTargets: "",
      toolRequirements: "",
      compatibilityEvidence: "",
    };
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      activeId: project.id,
      projects: [project],
    }));
  }, storeKey);
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Capability workbench", exact: true })).toBeVisible();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue("Shared capability");
  expect(await page.evaluate(() => Boolean(navigator.locks?.request))).toBe(expectLocks);
}

async function readDownload(page: Page, buttonName: string): Promise<any> {
  const downloadStarted = page.waitForEvent("download");
  await page.getByRole("button", { name: buttonName, exact: true }).click();
  const download = await downloadStarted;
  const path = await download.path();
  expect(path).not.toBeNull();
  return JSON.parse(await readFile(path!, "utf8"));
}

async function suppressStorageEvents(page: Page) {
  await page.addInitScript(() => {
    const target = window as Window & { addEventListener: Window["addEventListener"] };
    const original = target.addEventListener.bind(target);
    target.addEventListener = ((type: string, ...args: unknown[]) => {
      if (type === "storage") return;
      return (original as (...values: unknown[]) => void)(type, ...args);
    }) as Window["addEventListener"];
  });
}

test("stale tabs editing different fields retain both exact snapshots and authority", async ({ page }) => {
  await seedAndOpen(page);
  const staleTab = await page.context().newPage();
  await suppressStorageEvents(staleTab);
  await staleTab.goto("./");
  await expect(staleTab.getByLabel("Purpose", { exact: true })).toHaveValue("Original purpose");

  await page.getByLabel("Capability name", { exact: true }).fill("Saved in first tab");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await staleTab.getByLabel("Purpose", { exact: true }).fill("Saved in stale tab");
  await expect(staleTab.getByRole("status")).toContainText("Concurrent edit conflict");

  const recovery = await readDownload(staleTab, "Download both snapshots");
  expect(recovery.authoritativeSnapshot.projects[0].name).toBe("Saved in first tab");
  expect(recovery.authoritativeSnapshot.projects[0].purpose).toBe("Original purpose");
  expect(recovery.competingSnapshot.projects[0].name).toBe("Shared capability");
  expect(recovery.competingSnapshot.projects[0].purpose).toBe("Saved in stale tab");
  expect(recovery.authoritativeRevision).toBeTruthy();
  expect(recovery.authoritativeSerialized).toContain(recovery.authoritativeRevision);
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storeKey);
  expect(stored.projects[0].name).toBe("Saved in first tab");
  expect(stored.projects[0].purpose).toBe("Original purpose");
});

test("simultaneous same-field writes serialize and preserve the losing draft", async ({ page }) => {
  await page.addInitScript(() => {
    type LockWindow = Window & {
      __holdCapabilityWriter?: boolean;
      __capabilityWriterEntered?: boolean;
      __releaseCapabilityWriter?: () => void;
    };
    const lockWindow = window as LockWindow;
    const lockManager = navigator.locks;
    const originalRequest = lockManager.request.bind(lockManager);
    const wrapped = {
      request: (name: string, options: LockOptions, callback: (lock: Lock | null) => unknown) =>
        originalRequest(name, options, async (lock) => {
          if (lockWindow.__holdCapabilityWriter) {
            lockWindow.__capabilityWriterEntered = true;
            await new Promise<void>((resolve) => { lockWindow.__releaseCapabilityWriter = resolve; });
            lockWindow.__holdCapabilityWriter = false;
          }
          return callback(lock);
        }),
    };
    Object.defineProperty(navigator, "locks", { configurable: true, value: wrapped });
  });
  await seedAndOpen(page);
  const otherTab = await page.context().newPage();
  await otherTab.goto("./");
  await page.evaluate(() => { (window as Window & { __holdCapabilityWriter?: boolean }).__holdCapabilityWriter = true; });

  await page.getByLabel("Purpose", { exact: true }).fill("First simultaneous draft");
  await expect.poll(() => page.evaluate(() => (window as Window & { __capabilityWriterEntered?: boolean }).__capabilityWriterEntered)).toBe(true);
  await otherTab.getByLabel("Purpose", { exact: true }).fill("Second simultaneous draft");
  await expect(otherTab.getByRole("status")).toContainText("Saving locally");
  await page.evaluate(() => (window as Window & { __releaseCapabilityWriter?: () => void }).__releaseCapabilityWriter?.());

  await expect(page.getByRole("status")).toHaveText("Saved locally");
  await expect(otherTab.getByRole("status")).toContainText("Concurrent edit conflict");
  const recovery = await readDownload(otherTab, "Download both snapshots");
  expect(recovery.authoritativeSnapshot.projects[0].purpose).toBe("First simultaneous draft");
  expect(recovery.competingSnapshot.projects[0].purpose).toBe("Second simultaneous draft");
});

test("storage denial keeps the newest edit backed up until a readback-verified save succeeds", async ({ page }) => {
  await page.addInitScript((key) => {
    const storage = Storage.prototype as Storage & { __originalSetItem?: typeof Storage.prototype.setItem };
    storage.__originalSetItem = Storage.prototype.setItem;
    Object.defineProperty(window, "__denyCapabilityWrites", { configurable: true, writable: true, value: false });
    Storage.prototype.setItem = function (name, value) {
      if (name === key && (window as Window & { __denyCapabilityWrites?: boolean }).__denyCapabilityWrites) {
        throw new Error("Storage denied for capability workspace");
      }
      storage.__originalSetItem!.call(this, name, value);
    };
  }, storeKey);
  await seedAndOpen(page);
  await page.evaluate(() => { (window as Window & { __denyCapabilityWrites?: boolean }).__denyCapabilityWrites = true; });
  await page.getByLabel("Capability name", { exact: true }).fill("Newest unsaved draft");
  const status = page.getByRole("status");
  await expect(status).toContainText("lost on refresh or closure");
  await expect(status).toContainText(/storage denied/i);
  const backup = await readDownload(page, "Download newest backup");
  expect(backup.workspace.projects[0].name).toBe("Newest unsaved draft");

  await page.evaluate(() => {
    const storage = Storage.prototype as Storage & { __originalSetItem?: typeof Storage.prototype.setItem };
    Storage.prototype.setItem = storage.__originalSetItem!;
    (window as Window & { __denyCapabilityWrites?: boolean }).__denyCapabilityWrites = false;
  });
  await page.getByLabel("Purpose", { exact: true }).fill("Persisted after recovery");
  await expect(status).toHaveText("Saved locally");
  await expect(page.getByRole("button", { name: "Download newest backup", exact: true })).toHaveCount(0);
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), storeKey);
  expect(stored.projects[0].name).toBe("Newest unsaved draft");
  expect(stored.projects[0].purpose).toBe("Persisted after recovery");
});

test("missing Web Locks API fails closed with the latest editable backup", async ({ page }) => {
  await page.addInitScript(() => {
    const originalLocks = navigator.locks;
    Object.defineProperty(window, "__originalCapabilityLocks", { configurable: true, value: originalLocks });
    Object.defineProperty(navigator, "locks", { configurable: true, value: undefined });
  });
  await seedAndOpen(page, false);
  await page.getByLabel("Capability name", { exact: true }).fill("No-lock draft");
  const status = page.getByRole("status");
  await expect(status).toContainText("cannot protect capability saves across tabs");
  await expect(status).toContainText("lost on refresh or closure");
  const backup = await readDownload(page, "Download newest backup");
  expect(backup.workspace.projects[0].name).toBe("No-lock draft");
  expect(await page.evaluate((key) => localStorage.getItem(key), storeKey)).not.toContain("No-lock draft");
});

test("save progress does not repeatedly change the recovery live announcement", async ({ page }) => {
  await seedAndOpen(page);
  const announcement = page.locator(".cw-save-announcement");
  await expect(announcement).toHaveAttribute("aria-live", "polite");
  await page.evaluate(() => {
    const messages: string[] = [];
    Object.defineProperty(window, "__saveAnnouncements", { value: messages });
    const region = document.querySelector(".cw-save-announcement")!;
    new MutationObserver(() => messages.push(region.textContent ?? ""))
      .observe(region, { subtree: true, childList: true, characterData: true });
  });
  await page.getByLabel("Purpose", { exact: true }).pressSequentially(" ordinary typing");
  await expect(page.getByRole("status")).toHaveText("Saved locally");
  expect(await page.evaluate(() => (window as Window & { __saveAnnouncements: string[] }).__saveAnnouncements)).toEqual([]);

  await page.evaluate((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new Error("denied for announcement test");
      original.call(this, name, value);
    };
  }, storeKey);
  await page.getByLabel("Purpose", { exact: true }).fill("Unsaved first edit");
  await expect(announcement).toContainText("Download a backup now");
  await page.getByLabel("Purpose", { exact: true }).pressSequentially(" more typing");
  await expect(page.getByRole("status")).toContainText("Unsaved");
  expect(await page.evaluate(() => (window as Window & { __saveAnnouncements: string[] }).__saveAnnouncements)).toHaveLength(1);
});
