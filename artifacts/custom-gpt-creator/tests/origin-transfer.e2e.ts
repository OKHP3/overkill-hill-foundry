import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const capabilityKey = "okh-capability-workspace";
const creatorKey = "cgpt-workspace";
const pagesUrl = "https://okhp3.github.io/overkill-hill-foundry/";
const localUrl = process.env.CREATOR_BASE_URL;
const enabled = process.env.A07_ORIGIN_TRANSFER === "1";

const coreFields = [
  "id",
  "name",
  "kind",
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
  "reviewed",
  "createdAt",
  "updatedAt",
] as const;
const portabilityFields = [
  "sourceType",
  "delivery",
  "sourceRef",
  "sourceInventory",
  "behaviorMap",
  "semanticLoss",
  "runtimeTargets",
  "toolRequirements",
  "compatibilityEvidence",
] as const;

type Project = Record<string, string | boolean>;
type Workspace = {
  version: 1;
  activeId: string;
  projects: Project[];
};
type Backup = {
  schema: string;
  schemaVersion: number;
  audience: string;
  lineage: { parentFoundry: string };
  workspace: Workspace;
};

function project(id: string, name: string): Project {
  return {
    id,
    name,
    kind: "skill",
    owner: "Synthetic A07 fixture",
    version: "1.0.0",
    purpose: `Public-safe transfer fixture for ${name}.`,
    audience: "Maintainers",
    inputs: "A synthetic JSON document.",
    outputs: "A field inventory.",
    constraints: "No credentials, accounts, or private data.",
    instructions: "Inspect only the fixture fields and report them.",
    acceptance: "Every supplied field is preserved across origin transfer.",
    components: "Parser; inspector.",
    skillRefs: "",
    evidence: "Synthetic local test data; no behavior claim.",
    reviewed: false,
    createdAt: "2026-10-05T00:00:00.000Z",
    updatedAt: "2026-10-05T00:00:00.000Z",
  };
}

const legacyProject = project("a07-legacy-001", "A07 legacy-format sample");
const portableProject: Project = {
  ...project("a07-portable-002", "A07 portability sample"),
  sourceType: "custom-gpt",
  delivery: "connector",
  sourceRef: "Synthetic fixture; no GPT account or export used.",
  sourceInventory: "Synthetic instructions; no external assets.",
  behaviorMap: "Review procedure → portable skill; search → adapter.",
  semanticLoss: "Host retrieval differs; compare the declared fixture fields.",
  runtimeTargets: "Synthetic local preview\nGitHub Pages",
  toolRequirements: "No tools or credentials required.",
  compatibilityEvidence: "Not a host compatibility claim; transfer fixture only.",
};
const originalWorkspace: Workspace = {
  version: 1,
  activeId: legacyProject.id as string,
  projects: [legacyProject, portableProject],
};
const creatorSentinel = JSON.stringify({
  version: 1,
  activeProjectId: "a07-legacy-gpt-sentinel",
  projects: [
    {
      id: "a07-legacy-gpt-sentinel",
      name: "Unrelated synthetic legacy GPT",
      createdAt: "2026-10-05T00:00:00.000Z",
      updatedAt: "2026-10-05T00:00:00.000Z",
      archived: false,
      data: { title: "Preservation sentinel", instructions: "Keep byte-for-byte." },
      completedSteps: [0, 1, 2],
      currentPage: 2,
      sidebarOpen: true,
    },
  ],
});

function digest(projects: Project[], fieldsForProject: (project: Project) => readonly string[]): string {
  const projection = projects.map((item) =>
    Object.fromEntries(fieldsForProject(item).map((field) => [field, item[field]])),
  );
  return createHash("sha256").update(JSON.stringify(projection), "utf8").digest("hex");
}

function suppliedFields(item: Project): readonly string[] {
  return [...coreFields, ...portabilityFields.filter((field) => field in item)];
}

async function downloadBackup(page: Page): Promise<string> {
  const started = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download backup", exact: true }).click();
  return readFile((await (await started).path())!, "utf8");
}

async function importBackup(page: Page, contents: string): Promise<void> {
  await page.locator('input[type="file"]').setInputFiles({
    name: "a07-capability-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(contents, "utf8"),
  });
  await expect(page.getByText("Replace this workspace?", { exact: true })).toBeVisible();
  await expect(page.getByRole("list", { name: "Projects in imported backup" })).toContainText(
    "A07 legacy-format sample",
  );
  await expect(page.getByRole("list", { name: "Projects in imported backup" })).toContainText(
    "A07 portability sample",
  );
  await page.getByRole("button", { name: "Replace workspace", exact: true }).click();
  // Consecutive imports reuse the same status text. Wait for this confirmation
  // to close before reading the next saved workspace, rather than accepting
  // the preceding import's status while the save lock is still pending.
  await expect(page.getByText("Replace this workspace?", { exact: true })).not.toBeVisible();
  await expect(page.getByRole("status")).toHaveText("Saved locally · imported workspace");
}

async function readStoredWorkspace(page: Page): Promise<Workspace> {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!) as Workspace, capabilityKey);
}

test("transfer a synthetic legacy and portable backup Pages → clean local → Pages, then restore the preserved original", async ({
  browser,
}) => {
  test.skip(!enabled, "A07 exercises live GitHub Pages and the coordinator-owned local preview; opt in with A07_ORIGIN_TRANSFER=1.");
  test.setTimeout(120_000);
  expect(localUrl, "Set CREATOR_BASE_URL to the coordinator-owned preview URL.").toBeTruthy();
  expect(pagesUrl).toBe("https://okhp3.github.io/overkill-hill-foundry/");
  expect(new URL(localUrl!).origin).not.toBe(new URL(pagesUrl).origin);

  const pagesContext = await browser.newContext({ acceptDownloads: true });
  const localContext = await browser.newContext({ acceptDownloads: true });
  await pagesContext.addInitScript(
    ({ key, value }) => { if (location.origin !== "null") localStorage.setItem(key, value); },
    { key: creatorKey, value: creatorSentinel },
  );
  await localContext.addInitScript(
    ({ key, value }) => { if (location.origin !== "null") localStorage.setItem(key, value); },
    { key: creatorKey, value: creatorSentinel },
  );
  const pages = await pagesContext.newPage();
  const local = await localContext.newPage();

  try {
    await pages.goto(pagesUrl);
    await expect(pages.getByRole("heading", { name: "Capability workbench", exact: true })).toBeVisible();
    await pages.evaluate(
      ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
      { key: capabilityKey, value: originalWorkspace },
    );
    await pages.reload();
    await expect(pages.getByLabel("Capability name", { exact: true })).toHaveValue(
      "A07 legacy-format sample",
    );
    const pagesOriginalText = await downloadBackup(pages);
    const originalBackup = JSON.parse(pagesOriginalText) as Backup;
    expect(originalBackup.schema).toBe("okh-capability-workspace-backup");
    expect(originalBackup.schemaVersion).toBe(1);
    expect(originalBackup.workspace.projects).toHaveLength(2);

    const originalFieldHashes = originalWorkspace.projects.map((expected, index) => {
      const fields = suppliedFields(expected);
      const actual = originalBackup.workspace.projects[index];
      for (const field of fields) expect(actual[field], `${expected.id}.${field}`).toEqual(expected[field]);
      return digest([expected], () => fields);
    });
    const legacyAfterDefaults = originalBackup.workspace.projects[0];
    expect(legacyAfterDefaults.sourceType).toBe("new");
    expect(legacyAfterDefaults.delivery).toBe("source");
    for (const field of portabilityFields.slice(2)) expect(legacyAfterDefaults[field]).toBe("");
    for (const field of portabilityFields) {
      expect(originalBackup.workspace.projects[1][field]).toEqual(portableProject[field]);
    }

    await local.goto(localUrl!);
    await expect(local.getByRole("heading", { name: "Capability workbench", exact: true })).toBeVisible();
    expect(await local.evaluate((key) => localStorage.getItem(key), capabilityKey)).toBeNull();
    await importBackup(local, pagesOriginalText);
    const localReceived = await readStoredWorkspace(local);
    expect(localReceived.projects).toHaveLength(2);
    const localReceivedHashes = originalWorkspace.projects.map((expected, index) =>
      digest([localReceived.projects[index]], () => suppliedFields(expected)),
    );
    expect(localReceivedHashes).toEqual(originalFieldHashes);
    for (const field of portabilityFields) {
      expect(localReceived.projects[0][field]).toEqual(
        field === "sourceType" ? "new" : field === "delivery" ? "source" : "",
      );
    }
    await expect(local.getByLabel("Capability name", { exact: true })).toHaveValue(
      "A07 legacy-format sample",
    );

    const localOnlyPurpose = "A07 deliberate local edit; no account sync is assumed.";
    await local.getByLabel("Purpose", { exact: true }).fill(localOnlyPurpose);
    await expect(local.getByRole("status")).toHaveText("Saved locally");
    const localReturnText = await downloadBackup(local);
    const localReturnBackup = JSON.parse(localReturnText) as Backup;
    expect(localReturnBackup.workspace.projects[0].name).toBe("A07 legacy-format sample");
    expect(localReturnBackup.workspace.projects[0].purpose).toBe(localOnlyPurpose);
    for (const field of portabilityFields) {
      expect(localReturnBackup.workspace.projects[1][field]).toEqual(portableProject[field]);
    }
    const changedFieldHashes = originalWorkspace.projects.map((expected, index) =>
      digest(
        [localReturnBackup.workspace.projects[index]],
        () => suppliedFields(expected).filter((field) => !(index === 0 && ["purpose", "updatedAt"].includes(field))),
      ),
    );
    expect(changedFieldHashes).toEqual(originalWorkspace.projects.map((expected, index) =>
      digest([expected], () => suppliedFields(expected).filter((field) => !(index === 0 && ["purpose", "updatedAt"].includes(field)))),
    ));

    await importBackup(pages, localReturnText);
    const pagesRoundTrip = await readStoredWorkspace(pages);
    expect(pagesRoundTrip.projects[0].purpose).toBe(localOnlyPurpose);
    const pagesReturnHashes = originalWorkspace.projects.map((expected, index) =>
      digest(
        [pagesRoundTrip.projects[index]],
        () => suppliedFields(expected).filter((field) => !(index === 0 && ["purpose", "updatedAt"].includes(field))),
      ),
    );
    expect(pagesReturnHashes).toEqual(changedFieldHashes);

    // Keep the exact original Pages backup in memory and use it as the rollback source.
    await importBackup(pages, pagesOriginalText);
    const restoredPages = await readStoredWorkspace(pages);
    const restoredHashes = originalWorkspace.projects.map((expected, index) =>
      digest([restoredPages.projects[index]], () => suppliedFields(expected)),
    );
    expect(restoredHashes).toEqual(originalFieldHashes);
    expect(restoredPages.projects[0].purpose).toBe(legacyProject.purpose);
    expect(restoredPages.projects[1].runtimeTargets).toBe(portableProject.runtimeTargets);
    const restoredBackup = JSON.parse(await downloadBackup(pages)) as Backup;
    expect(restoredBackup.workspace.projects.map((item, index) =>
      digest([item], () => suppliedFields(originalWorkspace.projects[index])),
    )).toEqual(originalFieldHashes);

    const pagesCreatorAfter = await pages.evaluate((key) => localStorage.getItem(key), creatorKey);
    const localCreatorAfter = await local.evaluate((key) => localStorage.getItem(key), creatorKey);
    expect(pagesCreatorAfter).toBe(creatorSentinel);
    expect(localCreatorAfter).toBe(creatorSentinel);

    const pagesAssets = await pages.evaluate(() =>
      performance.getEntriesByType("resource")
        .map((entry) => entry.name)
        .filter((url) => /\/assets\/index-[^/]+\.js(?:\?|$)/.test(url)),
    );
    console.log("A07_ORIGIN_TRANSFER_EVIDENCE " + JSON.stringify({
      pagesUrl,
      localUrl,
      pagesRuntime: await browser.version(),
      nodeRuntime: process.version,
      pagesAssets,
      originalFieldHashes,
      localReceivedHashes,
      changedFieldHashes,
      pagesReturnHashes,
      restoredHashes,
      restoredBackupSchema: restoredBackup.schema,
      creatorSentinelSha256: createHash("sha256").update(creatorSentinel).digest("hex"),
      creatorSentinelsUnchanged: pagesCreatorAfter === creatorSentinel && localCreatorAfter === creatorSentinel,
      originSeparation: [new URL(pagesUrl).origin, new URL(localUrl!).origin],
    }));
  } finally {
    await pagesContext.close();
    await localContext.close();
  }
});
