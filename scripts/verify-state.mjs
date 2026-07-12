import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const ARTIFACT_DIR = resolve(".agents", "artifacts");
const SCREENSHOT_PATH = resolve(ARTIFACT_DIR, "state-check.png");
const VIEWPORT = { width: 1280, height: 720 };

function findBrowserExecutable() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate));
}

function quaternionDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]);
}

async function readDebug(page) {
  const debug = await page.evaluate(() => window.__SELF_WORLD_DEBUG__);

  if (!debug) {
    throw new Error("Missing window.__SELF_WORLD_DEBUG__ state.");
  }

  return debug;
}

async function holdKey(page, key, ms) {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

function findVisibleLandmarkScreen(debug) {
  for (const [id, point] of Object.entries(debug.landmarkScreens ?? {})) {
    const [x, y] = point;
    if (x >= 20 && x <= VIEWPORT.width - 20 && y >= 20 && y <= VIEWPORT.height - 20) {
      return { id, point };
    }
  }

  throw new Error("No landmark is visible enough to click.");
}

async function main() {
  const executablePath = findBrowserExecutable();

  if (!executablePath) {
    throw new Error("No Chrome or Edge executable found. Set CHROME_PATH.");
  }

  mkdirSync(ARTIFACT_DIR, { recursive: true });

  const server = await createServer({
    logLevel: "error",
    server: { host: "127.0.0.1", port: 5173, strictPort: false },
  });

  await server.listen();

  const url = server.resolvedUrls?.local[0];
  const browser = await chromium.launch({ executablePath, headless: true });

  try {
    const page = await browser.newPage({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
    });
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForSelector("canvas", { timeout: 10_000 });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));

    const clickTarget = findVisibleLandmarkScreen(await readDebug(page));

    await page.mouse.click(clickTarget.point[0], clickTarget.point[1]);
    await page.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.isInteracting === true,
      null,
      { timeout: 5_000 },
    );

    const interacting = await readDebug(page);

    if (!interacting.activeLandmarkId || !interacting.activeTarget) {
      throw new Error("Interaction did not set active landmark and target.");
    }

    const beforeFrozenMove = await readDebug(page);
    await holdKey(page, "w", 350);
    const afterFrozenMove = await readDebug(page);
    const frozenDelta = quaternionDistance(
      beforeFrozenMove.planetQuaternion,
      afterFrozenMove.planetQuaternion,
    );

    if (frozenDelta > 0.01) {
      throw new Error(`Planet rotated while interacting: ${frozenDelta}`);
    }

    await page.getByRole("button", { name: "Close" }).click();
    await page.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.isInteracting === false,
      null,
      { timeout: 5_000 },
    );

    const beforeResume = await readDebug(page);
    await holdKey(page, "w", 350);
    const afterResume = await readDebug(page);
    const resumeDelta = quaternionDistance(
      beforeResume.planetQuaternion,
      afterResume.planetQuaternion,
    );

    if (resumeDelta < 0.01) {
      throw new Error(`Movement did not resume after close.`);
    }

    if (errors.length > 0) {
      throw new Error(`Browser console errors:\n${errors.join("\n")}`);
    }

    const screenshot = await page.screenshot({ fullPage: false });
    writeFileSync(SCREENSHOT_PATH, screenshot);

    console.log(
      JSON.stringify(
        {
          ok: true,
          url,
          activeLandmarkId: interacting.activeLandmarkId,
          frozenDelta,
          resumeDelta,
          screenshot: SCREENSHOT_PATH,
        },
        null,
        2,
      ),
    );
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
