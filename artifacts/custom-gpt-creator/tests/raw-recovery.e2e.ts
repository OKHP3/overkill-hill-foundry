import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { newProject } from "../../mockup-sandbox/src/lib/capability-workbench";

const storeKey = "okh-capability-workspace";
const malformedSource = ` {"version":1,"activeId":"before-edit"}\r\n<unparsed \u2603 source>\n`;

async function downloadRawSource(page: Page, id = 1): Promise<string> {
  const started = page.waitForEvent("download");
  await page
    .getByRole("button", {
      name: `Download raw source ${id} (unparsed, unvalidated)`,
      exact: true,
    })
    .click();
  const download = await started;
  expect(download.suggestedFilename()).toBe(
    `foundry-raw-recovery-${id}-unparsed-unvalidated.txt`,
  );
  return readFile((await download.path())!, "utf8");
}

async function downloadCurrentBackup(page: Page) {
  await page.getByRole("button", { name: "Package Reviewable handoff" }).click();
  const started = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download workspace backup", exact: true })
    .click();
  const download = await started;
  return JSON.parse(await readFile((await download.path())!, "utf8"));
}

test("malformed source downloads byte-for-byte before and after an edit beside the validated backup", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, source }) => localStorage.setItem(key, source),
    { key: storeKey, source: malformedSource },
  );
  await page.goto("./");

  await expect(page.getByLabel("Raw source recovery 1")).toContainText(
    "unparsed and unvalidated",
  );
  await expect(page.getByLabel("Raw source recovery 1")).toContainText(
    "not confirmed",
  );
  expect(await downloadRawSource(page)).toBe(malformedSource);

  const beforeEditBackup = await downloadCurrentBackup(page);
  expect(beforeEditBackup.schema).toBe("okh-capability-workspace-backup");
  expect(beforeEditBackup.workspace.projects[0].name).toBe(
    "Untitled capability",
  );
  expect(beforeEditBackup).not.toHaveProperty("rawSource");

  await page.getByRole("button", { name: "01 Brief Purpose and audience" }).click();
  await page.getByLabel("Capability name", { exact: true }).fill("Repaired draft");
  await expect(page.locator(".cw-storage")).toHaveText("Saved locally");
  expect(await downloadRawSource(page)).toBe(malformedSource);

  const afterEditBackup = await downloadCurrentBackup(page);
  expect(afterEditBackup.schema).toBe("okh-capability-workspace-backup");
  expect(afterEditBackup.workspace.projects[0].name).toBe("Repaired draft");
  expect(afterEditBackup).not.toHaveProperty("rawSource");
});

test("two distinct raw sources stay downloadable with independent recovery-key status", async ({
  page,
}) => {
  const secondMalformedSource = `\n{"version":1,"projects":[1,],"source":"B"}\r\n`;
  await page.addInitScript(
    ({ key, first, second }) => {
      localStorage.setItem(key, first);
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (itemKey, value) {
        if (itemKey.startsWith(`${key}-recovery-`) && value === second) {
          throw new DOMException("Second recovery copy denied", "QuotaExceededError");
        }
        originalSetItem.call(this, itemKey, value);
      };
    },
    { key: storeKey, first: malformedSource, second: secondMalformedSource },
  );
  await page.goto("./");

  await page.getByLabel("Capability name", { exact: true }).fill("After source A");
  await expect(page.locator(".cw-storage")).toHaveText("Saved locally");
  await expect(page.getByLabel("Raw source recovery 1")).toContainText(
    "for source 1 was verified",
  );

  await page.evaluate(
    ({ key, source }) => localStorage.setItem(key, source),
    { key: storeKey, source: secondMalformedSource },
  );
  await page.getByLabel("Capability name", { exact: true }).fill("After source B");
  await expect(page.locator(".cw-storage")).toHaveText("Saved locally");

  await expect(page.getByLabel("Raw source recovery 1")).toContainText(
    "for source 1 was verified",
  );
  await expect(page.getByLabel("Raw source recovery 2")).toContainText(
    "for source 2 is not confirmed",
  );
  expect(await downloadRawSource(page, 1)).toBe(malformedSource);
  expect(await downloadRawSource(page, 2)).toBe(secondMalformedSource);

  const afterEditBackup = await downloadCurrentBackup(page);
  expect(afterEditBackup.schema).toBe("okh-capability-workspace-backup");
  expect(afterEditBackup.workspace.projects[0].name).toBe("After source B");
  expect(afterEditBackup).not.toHaveProperty("rawSource");
  const savedCopies = await page.evaluate((key) =>
    Object.keys(localStorage)
      .filter((itemKey) => itemKey.startsWith(`${key}-recovery-`))
      .map((itemKey) => localStorage.getItem(itemKey)), storeKey);
  expect(savedCopies).toEqual([malformedSource]);
});

test("denied raw-recovery-key writes keep the exact download available without claiming durable recovery", async ({
  page,
}) => {
  await page.addInitScript(
    ({ key, source }) => {
      localStorage.setItem(key, source);
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (itemKey, value) {
        if (itemKey.startsWith(`${key}-recovery-`)) {
          throw new DOMException("Recovery copy denied", "QuotaExceededError");
        }
        originalSetItem.call(this, itemKey, value);
      };
    },
    { key: storeKey, source: malformedSource },
  );
  await page.goto("./");
  await page.getByLabel("Capability name", { exact: true }).fill("Edited with denied recovery copy");
  await expect(page.locator(".cw-storage")).toHaveText("Saved locally");
  await expect(page.getByLabel("Raw source recovery 1")).toContainText(
    "not confirmed",
  );
  expect(await downloadRawSource(page)).toBe(malformedSource);

  const afterEditBackup = await downloadCurrentBackup(page);
  expect(afterEditBackup.workspace.projects[0].name).toBe(
    "Edited with denied recovery copy",
  );
  expect(afterEditBackup.schema).toBe("okh-capability-workspace-backup");
  expect(
    await page.evaluate((key) =>
      Object.keys(localStorage).filter((itemKey) =>
        itemKey.startsWith(`${key}-recovery-`),
      ), storeKey),
  ).toEqual([]);
});

test("oversized stored text downloads unchanged without entering the workspace backup", async ({
  page,
}) => {
  const oversizedProject = newProject();
  oversizedProject.id = "oversized-original";
  oversizedProject.name = "Stored valid source outside the size limit";
  const oversizedSource = " ".repeat(2_000_001) + JSON.stringify({
    version: 1,
    activeId: oversizedProject.id,
    projects: [oversizedProject],
  });
  await page.addInitScript(
    ({ key, source }) => localStorage.setItem(key, source),
    { key: storeKey, source: oversizedSource },
  );
  await page.goto("./");

  expect(await downloadRawSource(page)).toBe(oversizedSource);
  await page.getByLabel("Capability name", { exact: true }).fill("Edited after oversized source");
  await expect(page.locator(".cw-storage")).toHaveText("Saved locally");
  expect(await downloadRawSource(page)).toBe(oversizedSource);

  const currentBackup = await downloadCurrentBackup(page);
  expect(currentBackup.schema).toBe("okh-capability-workspace-backup");
  expect(currentBackup.workspace.projects).toHaveLength(1);
  expect(currentBackup.workspace.projects[0].name).toBe(
    "Edited after oversized source",
  );
  expect(currentBackup).not.toHaveProperty("rawSource");
});
