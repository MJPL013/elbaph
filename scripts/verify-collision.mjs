import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const ARTIFACT_DIR = resolve(".agents", "artifacts");
const SCREENSHOT_PATH = resolve(ARTIFACT_DIR, "collision-check.png");
const TEST_KEYS = ["w", "a", "s", "d"];

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
  if (!debug) throw new Error("Missing window.__SELF_WORLD_DEBUG__ state.");
  return debug;
}

async function reloadReady(page) {
  await page.reload({ waitUntil: "domcontentloaded", timeout: 30_000 });
  await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));
}

async function sampleKey(page, key, ms) {
  const before = await readDebug(page);
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  const after = await readDebug(page);
  await page.keyboard.up(key);
  await page.waitForTimeout(100);

  return {
    key,
    after,
    delta: quaternionDistance(before.planetQuaternion, after.planetQuaternion),
  };
}

async function findBlockedKey(page) {
  for (const key of TEST_KEYS) {
    await reloadReady(page);
    await page.keyboard.down(key);

    try {
      await page.waitForFunction(
        () => Boolean(window.__SELF_WORLD_DEBUG__?.collisionTarget),
        null,
        { timeout: 4_000 },
      );
      const blockedStart = await readDebug(page);
      await page.waitForTimeout(300);
      const blockedEnd = await readDebug(page);
      const blockedDelta = quaternionDistance(
        blockedStart.planetQuaternion,
        blockedEnd.planetQuaternion,
      );

      if (
        blockedEnd.collisionBlocked &&
        !blockedEnd.rotationApplied &&
        blockedEnd.collisionTarget &&
        blockedDelta <= 0.01
      ) {
        return { key, after: blockedEnd, delta: blockedDelta };
      }
    } catch (error) {
      const isTimeout = error?.name === "TimeoutError";
      if (!isTimeout) throw error;
    } finally {
      await page.keyboard.up(key).catch(() => {});
      await page.waitForTimeout(100);
    }
  }

  throw new Error("No movement direction reached a clean collision block.");
}

async function findClearKey(page, blockedKey) {
  for (const key of TEST_KEYS.filter((candidate) => candidate !== blockedKey)) {
    await reloadReady(page);
    const sample = await sampleKey(page, key, 350);
    const movedCleanly =
      sample.after.rotationApplied && !sample.after.collisionBlocked && sample.delta > 0.01;

    if (movedCleanly) return sample;
  }

  throw new Error("No spawn direction produced clear treadmill movement.");
}

async function main() {
  const executablePath = findBrowserExecutable();
  if (!executablePath) throw new Error("No Chrome or Edge executable found. Set CHROME_PATH.");

  mkdirSync(ARTIFACT_DIR, { recursive: true });

  const server = await createServer({
    logLevel: "error",
    server: { host: "127.0.0.1", port: 5173, strictPort: false },
  });
  await server.listen();

  const url = server.resolvedUrls?.local[0];
  const browser = await chromium.launch({ executablePath, headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForSelector("canvas", { timeout: 10_000 });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));

    const blocked = await findBlockedKey(page);
    const clear = await findClearKey(page, blocked.key);

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
          blockedKey: blocked.key,
          blockedTarget: blocked.after.collisionTarget,
          blockedDelta: blocked.delta,
          clearKey: clear.key,
          clearDelta: clear.delta,
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
