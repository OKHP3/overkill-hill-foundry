import { expect, test, type Browser } from "@playwright/test";
import { readFile } from "node:fs/promises";

const capabilityKey = "okh-capability-workspace";
const creatorKey = "cgpt-workspace";
const enabled = process.env.A08_NON_CHROMIUM === "1";
const creatorSentinel = JSON.stringify({
  version: 1,
  activeProjectId: "a08-unrelated-sentinel",
  projects: [{
    id: "a08-unrelated-sentinel",
    name: "Unrelated creator sentinel",
    createdAt: "2026-10-05T00:00:00.000Z",
    updatedAt: "2026-10-05T00:00:00.000Z",
    archived: false,
    data: { title: "Preserve exactly" },
    completedSteps: [0],
    currentPage: 0,
    sidebarOpen: true,
  }],
});

async function openWorkspace(browser: Browser, deniedWrites = false) {
  const context = await browser.newContext({ acceptDownloads: true });
  await context.addInitScript(
    ({ capabilityKey, creatorKey, creatorSentinel, deniedWrites }) => {
      const sentinelSeeded = "a08-creator-sentinel-seeded";
      if (sessionStorage.getItem(sentinelSeeded) !== "1") {
        localStorage.setItem(creatorKey, creatorSentinel);
        sessionStorage.setItem(sentinelSeeded, "1");
      }
      if (deniedWrites) {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (key === capabilityKey) throw new Error("Storage denied by A08 fixture");
          original.call(this, key, value);
        };
      }
    },
    { capabilityKey, creatorKey, creatorSentinel, deniedWrites },
  );
  return { context, page: await context.newPage() };
}

test("Firefox and WebKit create, persist, export, restore, navigate, and recover", async ({
  browser,
  browserName,
}) => {
  test.skip(!enabled, "Opt in with A08_NON_CHROMIUM=1; run once with --browser=firefox and once with --browser=webkit.");
  test.skip(browserName === "chromium", "A08 acceptance is limited to Firefox and WebKit.");
  test.setTimeout(60_000);
  const baseUrl = process.env.CREATOR_BASE_URL;
  expect(baseUrl, "Set CREATOR_BASE_URL to the coordinator-owned preview.").toBeTruthy();
  expect(new URL(baseUrl!).origin).toBe("http://127.0.0.1:20027");
  console.log("A08_NON_CHROMIUM_RUNTIME " + JSON.stringify({
    browserName,
    browserVersion: browser.version(),
    nodeVersion: process.version,
    platform: process.platform,
    baseUrl,
  }));

  const durable = await openWorkspace(browser);
  try {
    await durable.page.goto(baseUrl!);
    await expect(durable.page.getByRole("heading", { name: "Capability workbench", exact: true })).toBeVisible();
    expect(await durable.page.evaluate((key) => localStorage.getItem(key), creatorKey)).toBe(creatorSentinel);
    await durable.page.getByLabel("Capability name", { exact: true }).fill("A08 recovery — 日本語 Ω");
    await durable.page.getByLabel("Purpose", { exact: true }).fill("Unicode export survives a restore.");
    await expect(durable.page.getByRole("status")).toHaveText("Saved locally");
    await durable.page.reload();
    await expect(durable.page.getByLabel("Capability name", { exact: true })).toHaveValue("A08 recovery — 日本語 Ω");
    expect(await durable.page.evaluate((key) => localStorage.getItem(key), creatorKey)).toBe(creatorSentinel);

    const started = durable.page.waitForEvent("download");
    await durable.page.getByRole("button", { name: "Download backup", exact: true }).click();
    const download = await started;
    const backupText = await readFile((await download.path())!, "utf8");
    expect(backupText).toContain("A08 recovery — 日本語 Ω");
    expect(JSON.parse(backupText).schema).toBe("okh-capability-workspace-backup");

    await durable.page.getByLabel("Purpose", { exact: true }).fill("Temporary draft before restore.");
    await durable.page.locator('input[type="file"]').setInputFiles({
      name: "a08-unicode-recovery.json",
      mimeType: "application/json",
      buffer: Buffer.from(backupText, "utf8"),
    });
    await expect(durable.page.getByText("Replace this workspace?", { exact: true })).toBeVisible();
    await durable.page.getByRole("button", { name: "Replace workspace", exact: true }).click();
    await expect(durable.page.getByText("Replace this workspace?", { exact: true })).not.toBeVisible();
    await expect(durable.page.getByRole("status")).toHaveText("Saved locally · imported workspace");
    await expect(durable.page.getByLabel("Purpose", { exact: true })).toHaveValue("Unicode export survives a restore.");

    await durable.page.getByRole("button", { name: "Open legacy Custom GPT studio →" }).click();
    await expect(durable.page.getByRole("heading", { name: /Step 0.*Build Brief/ })).toBeVisible();
    const studioSentinel = await durable.page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), creatorKey);
    expect(studioSentinel.projects).toHaveLength(1);
    expect(studioSentinel.projects[0].id).toBe("a08-unrelated-sentinel");
    expect(studioSentinel.projects[0].data.title).toBe("Preserve exactly");
    await durable.page.getByRole("link", { name: "← Capability workbench" }).click();
    await expect(durable.page.getByLabel("Capability name", { exact: true })).toHaveValue("A08 recovery — 日本語 Ω");
  } finally {
    await durable.context.close();
  }

  const denied = await openWorkspace(browser, true);
  try {
    await denied.page.goto(baseUrl!);
    await denied.page.getByLabel("Capability name", { exact: true }).fill("A08 denied — 復旧 Ω");
    await expect(denied.page.getByRole("status")).toContainText("Unsaved");
    await expect(denied.page.getByRole("status")).toContainText("lost on refresh or closure");
    const started = denied.page.waitForEvent("download");
    await denied.page.getByRole("button", { name: "Download backup", exact: true }).click();
    const recovery = JSON.parse(await readFile((await (await started).path())!, "utf8"));
    expect(recovery.workspace.projects[0].name).toBe("A08 denied — 復旧 Ω");
    expect(await denied.page.evaluate((key) => localStorage.getItem(key), capabilityKey)).toBeNull();
    expect(await denied.page.evaluate((key) => localStorage.getItem(key), creatorKey)).toBe(creatorSentinel);
  } finally {
    await denied.context.close();
  }
});
