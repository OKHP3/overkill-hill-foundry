import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import {
  buildCapabilityFiles,
  createCapabilityBackup,
  newProject,
} from "../../mockup-sandbox/src/lib/capability-workbench";

const storeKey = "okh-capability-workspace";

test("convert a GPT into a portable skill and retain unverified plugin and connector plans", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("./");
  await expect(page).toHaveTitle(/OverKill Hill FoundRy.*Capability Workbench/);
  await expect(page.getByRole("button", { name: /Skill.*portable SKILL.md/ })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Capability name", { exact: true }).fill("Source review");
  const gptBefore = await page.evaluate(() => localStorage.getItem("cgpt-workspace"));
  const stages = page.getByRole("navigation", { name: "Workbench stages" });
  await stages.getByRole("button", { name: /Convert & adapt/ }).click();
  await page.getByLabel("Starting point").selectOption("custom-gpt");
  await page.getByLabel("Delivery package").selectOption("plugin");
  await page.getByLabel("Source reference", { exact: true }).fill("Supplied GPT export, 2026-09-27");
  await page.getByLabel("Source asset inventory").fill("Instructions available; knowledge files missing");
  await page.getByLabel("Behavior map").fill("Review rubric becomes skill procedure; search becomes adapter");
  await page.getByLabel("Semantic loss and tests").fill("Retrieval parity unknown; compare fixture results");
  await page.getByLabel("Target hosts").fill("Claude\nChatGPT/Codex\nOpenClaw\nPerplexity");
  await page.getByLabel("Tools and permissions").fill("Search API; read access; report unavailable tools");
  await page.getByLabel("Host compatibility evidence").fill("All hosts untested");
  await page.reload();
  await stages.getByRole("button", { name: /Convert & adapt/ }).click();
  await expect(page.getByLabel("Starting point")).toHaveValue("custom-gpt");
  await expect(page.getByLabel("Delivery package")).toHaveValue("plugin");
  await expect(page.getByLabel("Source asset inventory")).toHaveValue("Instructions available; knowledge files missing");
  await page.getByLabel("Delivery package").selectOption("connector");
  await stages.getByRole("button", { name: /Package/ }).click();
  await page.getByRole("button", { name: "adapters/compatibility.json", exact: true }).click();
  await expect(page.getByLabel("Selected generated file")).toContainText('"installable": false');
  await expect(page.getByLabel("Selected generated file")).toContainText('"delivery": "connector"');
  await page.getByRole("button", { name: "skills/source-review/SKILL.md", exact: true }).click();
  await expect(page.getByLabel("Selected generated file")).toContainText('name: "source-review"');
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download workspace backup", exact: true }).click();
  const backup = JSON.parse(await readFile((await (await download).path())!, "utf8"));
  expect(backup.workspace.projects[0].behaviorMap).toContain("skill procedure");
  expect(await page.evaluate(() => localStorage.getItem("cgpt-workspace"))).toBe(gptBefore);
  await page.setViewportSize({ width: 390, height: 844 });
  await stages.getByRole("button", { name: /Convert & adapt/ }).click();
  await expect(page.getByLabel("Target hosts")).toHaveValue("Claude\nChatGPT/Codex\nOpenClaw\nPerplexity");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("build, persist, inspect, export and restore a capability without touching GPT projects", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Capability workbench", exact: true }),
  ).toBeVisible();
  const gptBefore = await page.evaluate(() =>
    localStorage.getItem("cgpt-workspace"),
  );
  await page
    .getByLabel("Capability name", { exact: true })
    .fill("Evidence inspector — Ω");
  await page.getByLabel("Owner", { exact: true }).fill("Builder");
  await page
    .getByLabel("Purpose", { exact: true })
    .fill("Inspect source records before a system handoff.");
  await page
    .getByLabel("Audience", { exact: true })
    .fill("Software maintainers");
  await page
    .getByRole("button", { name: /Software.*local runnable starter/ })
    .click();
  const stages = page.getByRole("navigation", { name: "Workbench stages" });
  await stages.getByRole("button", { name: /Contract/ }).click();
  await page.getByLabel("Inputs", { exact: true }).fill("JSON source records");
  await page
    .getByLabel("Outputs", { exact: true })
    .fill("Input field and type inventory");
  await page
    .getByLabel("Constraints", { exact: true })
    .fill("Local processing; report malformed inputs.");
  await page
    .getByLabel("Acceptance criteria", { exact: true })
    .fill("Valid objects show field types; invalid JSON reports an error.");
  await stages.getByRole("button", { name: /Build/ }).click();
  await page
    .getByLabel("Instructions", { exact: true })
    .fill(
      "Parse JSON and inspect top-level fields. Return parse failures as text.",
    );
  await page
    .getByLabel("Components", { exact: true })
    .fill("JSON parser, input field, output view");
  await page
    .getByLabel("Skillz and canonical references")
    .fill("https://github.com/OKHP3/skillz/tree/7616ccd");
  await stages.getByRole("button", { name: /Validate/ }).click();
  await page
    .getByLabel("Evidence and validation notes")
    .fill("Design reviewed today. Bespoke system behavior is not yet tested.");
  await page.getByRole("checkbox", { name: /I reviewed this starter/ }).check();
  await stages.getByRole("button", { name: /Package/ }).click();
  await page
    .getByRole("button", { name: "capability.json", exact: true })
    .click();
  await expect(page.getByLabel("Selected generated file")).toContainText(
    '"behavioralValidation": "not-claimed"',
  );
  const backupDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download workspace backup", exact: true })
    .click();
  const backup = await readFile((await (await backupDownload).path())!, "utf8");
  expect(JSON.parse(backup).workspace.projects[0].name).toBe(
    "Evidence inspector — Ω",
  );
  const zipDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download starter ZIP" }).click();
  const zipPath = (await (await zipDownload).path())!;
  const archive = JSON.parse(
    execFileSync(
      process.platform === "win32" ? "py" : "python3",
      [
        "-c",
        "import zipfile,json,sys; z=zipfile.ZipFile(sys.argv[1]); assert z.testzip() is None; print(json.dumps({'paths':z.namelist(),'package':json.loads(z.read('capability.json'))}))",
        zipPath,
      ],
      { encoding: "utf8" },
    ),
  );
  expect(archive.paths).toContain("app/index.html");
  expect(archive.package.capability.name).toBe("Evidence inspector — Ω");
  expect(archive.package.readiness.publicationAuthorized).toBe(false);
  await page.reload();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue(
    "Evidence inspector — Ω",
  );
  await page.getByLabel("Purpose", { exact: true }).fill("Changed contract");
  await stages.getByRole("button", { name: /Validate/ }).click();
  await expect(
    page.getByRole("checkbox", { name: /I reviewed this starter/ }),
  ).not.toBeChecked();
  await page
    .locator('input[type="file"]')
    .setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(backup),
    });
  await expect(
    page.getByText("Replace this workspace?", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Replace workspace", exact: true })
    .click();
  await stages.getByRole("button", { name: /Brief/ }).click();
  await expect(page.getByLabel("Purpose", { exact: true })).toHaveValue(
    "Inspect source records before a system handoff.",
  );
  expect(
    await page.evaluate(() => localStorage.getItem("cgpt-workspace")),
  ).toBe(gptBefore);
  await page.getByRole("button", { name: "Open legacy Custom GPT studio →" }).click();
  await expect(
    page.getByRole("heading", { name: /Step 0.*Build Brief/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: "← Capability workbench" }).click();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue(
    "Evidence inspector — Ω",
  );
});

test("reject invalid imports and preserve malformed stored source", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "{broken"),
    storeKey,
  );
  await page.goto("./");
  await expect(
    page.getByRole("status").filter({ hasText: /could not be loaded and was left unchanged/ }),
  ).toBeVisible();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storeKey),
  ).toBe("{broken");
  await page
    .locator('input[type="file"]')
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":900}'),
    });
  await expect(page.getByRole("alert")).toContainText("Import stopped");
  expect(
    await page.evaluate((key) => localStorage.getItem(key), storeKey),
  ).toBe("{broken");
});

test("storage denial retains edits for a recovery download", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "okh-capability-workspace") throw new Error("Storage denied");
      original.call(this, key, value);
    };
  });
  await page.goto("./");
  await page
    .getByLabel("Capability name", { exact: true })
    .fill("Recovery draft");
  await expect(page.getByRole("status")).toContainText("Unsaved");
  await expect(page.getByRole("status")).toContainText("lost on refresh or closure");
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download backup", exact: true })
    .click();
  const backup = JSON.parse(
    await readFile((await (await download).path())!, "utf8"),
  );
  expect(backup.workspace.projects[0].name).toBe("Recovery draft");
});

test("generated software runs useful inspection and treats hostile names as text", async ({
  page,
}) => {
  const project = newProject("software");
  project.name = "</title><script>window.injected=true</script> — Ω";
  const html = buildCapabilityFiles(project).find(
    (file) => file.path === "app/index.html",
  )!.content;
  await page.setContent(html);
  await page
    .getByLabel("JSON input")
    .fill('{"count":3,"tags":["a"],"missing":null}');
  await page.getByRole("button", { name: "Inspect contract" }).click();
  await expect(page.locator("#output")).toContainText('"count": "number"');
  await expect(page.locator("#output")).toContainText('"tags": "array"');
  await expect(page.locator("#output")).toContainText('"missing": "null"');
  expect(
    await page.evaluate(
      () => (window as unknown as { injected?: boolean }).injected,
    ),
  ).toBeUndefined();
  await page.getByLabel("JSON input").fill("{broken");
  await page.getByRole("button", { name: "Inspect contract" }).click();
  await expect(page.locator("#output")).toContainText('"validJson": false');
});

test("mobile workbench stays usable and keeps region labels readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Capability workbench", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByTitle("Dark mode").click();
  await page
    .getByLabel("Capability name", { exact: true })
    .fill("Mobile capability");
  await page
    .getByRole("navigation", { name: "Workbench stages" })
    .getByRole("button", { name: /Package/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Download starter ZIP" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("project lifecycle, kind changes and oversized edits preserve a usable workspace", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(crypto, "randomUUID", {
      value: undefined,
      configurable: true,
    });
  });
  await page.goto("./");
  await page
    .getByLabel("Capability name", { exact: true })
    .fill("Original project");
  await page.getByRole("button", { name: "Duplicate", exact: true }).click();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue(
    "Original project copy",
  );
  await page
    .getByRole("button", { name: /Software.*local runnable starter/ })
    .click();
  const stages = page.getByRole("navigation", { name: "Workbench stages" });
  await stages.getByRole("button", { name: /Package/ }).click();
  await page
    .getByRole("button", { name: "app/index.html", exact: true })
    .click();
  await expect(page.getByLabel("Selected generated file")).toContainText(
    "<!doctype html>",
  );
  await stages.getByRole("button", { name: /Brief/ }).click();
  await page
    .getByRole("button", { name: /Prompt.*reusable instruction/ })
    .click();
  await stages.getByRole("button", { name: /Package/ }).click();
  await expect(page.getByLabel("Selected generated file")).toContainText(
    '"schema": "okh-capability-package"',
  );
  await stages.getByRole("button", { name: /Brief/ }).click();
  await page.getByLabel("Purpose", { exact: true }).fill("x".repeat(40_001));
  await expect(page.getByText(/exceeds the 40000-byte limit/)).toBeVisible();
  await expect(page.getByLabel("Purpose", { exact: true })).toHaveValue("");
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Delete project", exact: true })
    .click();
  await expect(page.getByLabel("Capability name", { exact: true })).toHaveValue(
    "Original project",
  );
});


test("failed backup selections clear earlier replacement prompts and reset the input", async ({ page }) => {
  await page.goto("./");
  const project = newProject();
  const valid = { name: "valid.json", mimeType: "application/json", buffer: Buffer.from(createCapabilityBackup({ version: 1, activeId: project.id, projects: [project] })) };
  const input = page.locator('input[type="file"]');
  const prompt = page.getByText("Replace this workspace?", { exact: true });
  for (const invalid of [
    { name: "invalid.json", mimeType: "application/json", buffer: Buffer.from("{broken") },
    { name: "oversize.json", mimeType: "application/json", buffer: Buffer.alloc(2_000_001, "x") },
  ]) {
    await input.setInputFiles(valid);
    await expect(prompt).toBeVisible();
    await input.setInputFiles(invalid);
    await expect(prompt).not.toBeVisible();
    await expect(page.getByRole("alert")).toContainText("Import stopped:");
    await expect(input).toHaveValue("");
    await input.setInputFiles(invalid);
    await expect(prompt).not.toBeVisible();
    await expect(input).toHaveValue("");
  }
  await input.setInputFiles(valid);
  await expect(prompt).toBeVisible();
  await page.evaluate(() => {
    FileReader.prototype.readAsText = function () {
      this.dispatchEvent(new ProgressEvent("error"));
    };
  });
  await input.setInputFiles(valid);
  await expect(prompt).not.toBeVisible();
  await expect(page.getByRole("alert")).toContainText("could not be read");
  await expect(input).toHaveValue("");
});
