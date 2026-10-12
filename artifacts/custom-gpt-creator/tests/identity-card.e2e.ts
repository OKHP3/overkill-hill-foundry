import { spawn, type ChildProcess } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test, type Page } from "@playwright/test";

const identityRoot = fileURLToPath(
  new URL("../../okh-identity-card/", import.meta.url),
);
let server: ChildProcess;
let identityURL: string;
let serverOutput = "";
let serverError: Error | undefined;

function serverExited() {
  return server.exitCode !== null || server.signalCode !== null;
}

async function stopOwnedServer() {
  if (!server || serverExited() || serverError) return;
  await new Promise<void>((resolve, reject) => {
    const finished = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      server.off("exit", finished);
      reject(
        new Error("Owned Identity preview did not stop within five seconds"),
      );
    }, 5000);
    server.once("exit", finished);
    if (!server.kill()) {
      server.off("exit", finished);
      clearTimeout(timer);
      if (serverExited()) resolve();
      else reject(new Error("Could not stop the owned Identity preview"));
    }
  });
}

test.beforeAll(async () => {
  test.setTimeout(60_000);
  const reservation = createServer();
  await new Promise<void>((resolve) =>
    reservation.listen(0, "127.0.0.1", resolve),
  );
  const address = reservation.address();
  if (!address || typeof address === "string")
    throw new Error("No loopback test port");
  const port = address.port;
  await new Promise<void>((resolve, reject) =>
    reservation.close((error) => (error ? reject(error) : resolve())),
  );
  identityURL = `http://127.0.0.1:${port}/okh-identity/`;
  const environment = {
    ...process.env,
    PORT: String(port),
    BASE_PATH: "/okh-identity/",
  };
  delete environment.REPL_ID;
  server = spawn(
    process.execPath,
    [
      path.join(identityRoot, "node_modules/vite/bin/vite.js"),
      "--host",
      "127.0.0.1",
    ],
    {
      cwd: identityRoot,
      env: environment,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout?.on("data", (chunk) => {
    serverOutput = (serverOutput + String(chunk)).slice(-4000);
  });
  server.stderr?.on("data", (chunk) => {
    serverOutput = (serverOutput + String(chunk)).slice(-4000);
  });
  server.on("error", (error) => {
    serverError = error;
  });
  await expect
    .poll(
      async () => {
        if (serverError) throw serverError;
        if (serverExited())
          throw new Error(`Identity server exited: ${serverOutput}`);
        try {
          return (
            await fetch(identityURL, { signal: AbortSignal.timeout(2000) })
          ).status;
        } catch {
          return 0;
        }
      },
      { timeout: 45_000 },
    )
    .toBe(200);
});

test.afterAll(stopOwnedServer);

async function settleCard(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page
        .getByText("Precision", { exact: true })
        .evaluate(
          (element) =>
            getComputedStyle(element.parentElement!.parentElement!).opacity,
        ),
    )
    .toBe("1");
}

async function assertContentFits(page: Page) {
  // Document overflow alone misses content hidden by the card's clipping border.
  const clipped = await page.evaluate(() => {
    const failures: string[] = [];
    const inspect = (element: Element, rect: DOMRect, name: string) => {
      let left = 0,
        right = document.documentElement.clientWidth;
      for (
        let ancestor: Element | null = element;
        ancestor;
        ancestor = ancestor.parentElement
      ) {
        if (
          ["hidden", "clip", "scroll", "auto"].includes(
            getComputedStyle(ancestor).overflowX,
          )
        ) {
          const bounds = ancestor.getBoundingClientRect();
          left = Math.max(left, bounds.left);
          right = Math.min(right, bounds.right);
        }
      }
      if (rect.left < left - 1 || rect.right > right + 1) failures.push(name);
    };
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const element = node.parentElement;
      if (
        !element ||
        !node.textContent?.trim() ||
        ["SCRIPT", "STYLE"].includes(element.tagName)
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects())
        if (rect.width) inspect(element, rect, node.textContent.trim());
    }
    for (const element of document.querySelectorAll("[title]"))
      inspect(
        element,
        element.getBoundingClientRect(),
        element.getAttribute("title")!,
      );
    return failures;
  });
  expect(
    clipped,
    "Visible text and all eight palette swatches fit their clipping ancestors",
  ).toEqual([]);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
}

for (const width of [1280, 390, 320]) {
  test(`Identity mark decodes and the card fits at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto(identityURL);
    const mark = page.getByRole("img", { name: "Forge mark", exact: true });
    await expect(mark).toHaveAttribute("src", "/okh-identity/forge-icon.png");
    await expect
      .poll(() =>
        mark.evaluate(
          (image: HTMLImageElement) =>
            image.complete && image.naturalWidth > 0 && image.naturalHeight > 0,
        ),
      )
      .toBe(true);
    await settleCard(page);
    await expect(mark).toHaveCount(1);
    const bounds = await mark.boundingBox();
    expect(bounds?.width).toBeCloseTo(62, 0);
    expect(bounds?.height).toBeCloseTo(62, 0);
    await assertContentFits(page);
    expect(errors).toEqual([]);
  });

  test(`Identity mark failure preserves accessible content at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/forge-icon.png", (route) => route.abort());
    await page.setViewportSize({ width, height: 900 });
    await page.goto(identityURL);
    const fallback = page.getByRole("img", { name: "Forge mark", exact: true });
    await expect(fallback).toHaveText("⚙");
    await expect(fallback).toHaveCount(1);
    await expect(fallback.locator("[aria-hidden=true]")).toHaveText("⚙");
    await expect(fallback.locator("..").locator(":scope > div")).toHaveCount(1);
    await settleCard(page);
    await assertContentFits(page);
    await page.setViewportSize({ width: width + 10, height: 900 });
    await expect(fallback).toHaveText("⚙");
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  });
}

test("Invalid image bytes with HTTP 200 use the accessible fallback", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/forge-icon.png", (route) =>
    route.fulfill({
      status: 200,
      contentType: "image/png",
      body: "invalid image",
    }),
  );
  await page.goto(identityURL);
  await expect(
    page.getByRole("img", { name: "Forge mark", exact: true }),
  ).toHaveText("⚙");
  expect(errors).toEqual([]);
});

test("The narrow card does not hide text or palette swatches", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(identityURL);
  await settleCard(page);
  await assertContentFits(page);
});

// Keep this last: terminate only this fixture's child, then exercise repeated cleanup.
test("Owned preview cleanup recognizes an already terminated child", async () => {
  await stopOwnedServer();
  expect(serverExited()).toBe(true);
  await stopOwnedServer();
});
