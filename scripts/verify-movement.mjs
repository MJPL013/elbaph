import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const ARTIFACT_DIR = resolve(".agents", "artifacts");
const SCREENSHOT_PATH = resolve(ARTIFACT_DIR, "movement-check.png");

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

function vectorDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
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

async function main() {
  const executablePath = findBrowserExecutable();

  if (!executablePath) {
    throw new Error(
      "No Chrome or Edge executable found. Set CHROME_PATH to run movement verification.",
    );
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
      viewport: { width: 1280, height: 720 },
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

    const before = await readDebug(page);

    await page.keyboard.down("w");
    await page.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.rotationApplied === true,
      null,
      { timeout: 5_000 },
    );
    await page.waitForTimeout(750);

    const during = await readDebug(page);
    await page.keyboard.up("w");
    await page.waitForTimeout(150);

    const screenshot = await page.screenshot({ fullPage: false });
    writeFileSync(SCREENSHOT_PATH, screenshot);

    const characterDrift = vectorDistance(
      before.characterWorldPosition,
      during.characterWorldPosition,
    );
    const quaternionDelta = quaternionDistance(
      before.planetQuaternion,
      during.planetQuaternion,
    );
    const forwardInput =
      Math.abs(during.inputDirection[0]) < 0.001 &&
      Math.abs(during.inputDirection[1] + 1) < 0.001;

    if (characterDrift > 0.001) {
      throw new Error(`Character moved in world space: drift ${characterDrift}`);
    }

    if (quaternionDelta < 0.01) {
      throw new Error(`Planet quaternion did not change enough: ${quaternionDelta}`);
    }

    if (!forwardInput) {
      throw new Error(`Forward input was not mapped to [0,-1].`);
    }

    if (errors.length > 0) {
      throw new Error(`Browser console errors:\n${errors.join("\n")}`);
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          url,
          characterDrift,
          quaternionDelta,
          inputDirection: during.inputDirection,
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
