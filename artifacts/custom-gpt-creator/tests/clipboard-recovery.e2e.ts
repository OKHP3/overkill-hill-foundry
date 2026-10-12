import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function openExport(page: Page, clipboardAvailable = true) {
  await page.addInitScript((clipboardAvailable: boolean) => {
    type ClipboardControl = { resolve: () => void; reject: () => void; text: string };
    const controls: ClipboardControl[] = [];
    (window as Window & { __clipboardControls?: ClipboardControl[] }).__clipboardControls = controls;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: clipboardAvailable ? {
        writeText: (text: string) => new Promise<void>((resolve, reject) => {
          controls.push({ resolve, reject, text });
        }),
      } : undefined,
    });
  }, clipboardAvailable);
  await page.goto("./#creator");
  await page.evaluate(() => {
    localStorage.clear();
    const now = new Date().toISOString();
    const project = (id: string, name: string, marker: string) => ({
      id, name, createdAt: now, updatedAt: now, archived: false,
      data: { "step-0": { gptName: name }, "step-2": { 1: marker } },
      completedSteps: [], currentPage: 0, sidebarOpen: true,
    });
    localStorage.setItem("cgpt-workspace", JSON.stringify({
      version: 1, activeProjectId: "project-a", projects: [
        project("project-a", "Project A", "Content A"),
        project("project-b", "Project B", "Content B"),
      ],
    }));
  });
  await page.reload();
  await page.getByRole("button", { name: "Export Package" }).click();
  await expect(page.locator("h1")).toContainText("Export Package");
}

async function resolveCopy(page: Page, index = 0) {
  await page.evaluate((copyIndex) => {
    const controls = (window as Window & { __clipboardControls: Array<{ resolve: () => void }> }).__clipboardControls;
    controls[copyIndex].resolve();
  }, index);
}

async function rejectCopy(page: Page, index = 0) {
  await page.evaluate((copyIndex) => {
    const controls = (window as Window & { __clipboardControls: Array<{ reject: () => void }> }).__clipboardControls;
    controls[copyIndex].reject();
  }, index);
}

test("reports clipboard rejection, preserves manual and download fallbacks, and allows retry", async ({ page }) => {
  await openExport(page);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const exportContent = await page.locator("pre").textContent();
  expect(exportContent).not.toBeNull();
  await page.getByRole("button", { name: "📋 Copy" }).click();
  await rejectCopy(page);
  const copyAlert = page.locator("#copy-error");
  await expect(copyAlert).toContainText("Clipboard access failed");
  await expect(copyAlert).toContainText("Download");
  await expect(copyAlert).toContainText("select and copy");
  await expect(copyAlert).not.toContainText(exportContent!.slice(0, 35));
  await expect(page.getByRole("button", { name: "📋 Copy" })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "⬇ Download .md" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  await expect(readFile(downloadPath!)).resolves.toEqual(Buffer.from(exportContent!, "utf8"));

  await page.getByRole("button", { name: "📋 Copy" }).click();
  await resolveCopy(page, 1);
  await expect(page.getByRole("button", { name: "✓ Copied!" })).toBeVisible();
  await expect(copyAlert).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test("reports an unavailable clipboard API with the same usable fallbacks and no page error", async ({ page }) => {
  await openExport(page, false);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const exportContent = await page.locator("pre").textContent();
  expect(exportContent).not.toBeNull();

  await page.getByRole("button", { name: "📋 Copy" }).click();
  const copyAlert = page.locator("#copy-error");
  await expect(copyAlert).toContainText("Clipboard access failed");
  await expect(copyAlert).toContainText("Download");
  await expect(copyAlert).toContainText("select and copy");
  await expect(copyAlert).not.toContainText(exportContent!.slice(0, 35));

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "⬇ Download .md" }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  await expect(readFile(downloadPath!)).resolves.toEqual(Buffer.from(exportContent!, "utf8"));
  expect(pageErrors).toEqual([]);
});

test("only the latest successful request can confirm, and stale project or content copies cannot confirm", async ({ page }) => {
  await openExport(page);
  const copyButton = page.getByRole("button", { name: "📋 Copy" });

  await copyButton.click();
  await copyButton.click();
  await resolveCopy(page, 0);
  await expect(page.getByRole("button", { name: "✓ Copied!" })).toHaveCount(0);
  await resolveCopy(page, 1);
  await expect(page.getByRole("button", { name: "✓ Copied!" })).toBeVisible();

  await page.clock.install();
  await page.getByRole("button", { name: "Full Spec (Markdown)" }).click();
  await copyButton.click();
  await page.getByRole("button", { name: "Evidence (JSON)" }).click();
  await resolveCopy(page, 2);
  await expect(page.getByRole("button", { name: "📋 Copy" })).toBeVisible();

  await page.getByRole("button", { name: "Full Spec (Markdown)" }).click();
  await copyButton.click();
  await page.evaluate(() => {
    const workspace = JSON.parse(localStorage.getItem("cgpt-workspace")!);
    workspace.activeProjectId = "project-b";
    localStorage.setItem("cgpt-workspace", JSON.stringify(workspace));
  });
  await resolveCopy(page, 3);
  await expect(page.getByRole("button", { name: "📋 Copy" })).toBeVisible();

  await page.getByRole("button", { name: "Full Spec (Markdown)" }).click();
  await copyButton.click();
  await page.evaluate(() => {
    const workspace = JSON.parse(localStorage.getItem("cgpt-workspace")!);
    workspace.projects[1].data["step-2"][1] = "Content changed during copy";
    localStorage.setItem("cgpt-workspace", JSON.stringify(workspace));
  });
  await resolveCopy(page, 4);
  await expect(page.getByRole("button", { name: "📋 Copy" })).toBeVisible();
});

test("a delayed rejection cannot show failure for a different project", async ({ page }) => {
  await openExport(page);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.getByRole("button", { name: "📋 Copy" }).click();
  await page.evaluate(() => {
    const workspace = JSON.parse(localStorage.getItem("cgpt-workspace")!);
    workspace.activeProjectId = "project-b";
    localStorage.setItem("cgpt-workspace", JSON.stringify(workspace));
  });
  await rejectCopy(page);
  await expect(page.locator("#copy-error")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "✓ Copied!" })).toHaveCount(0);
  expect(errors).toEqual([]);
});
