import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import { createServer } from "vite";

const ARTIFACT_DIR = resolve(".agents", "artifacts");
const SCREENSHOT_PATH = resolve(ARTIFACT_DIR, "render-check.png");
const BACKGROUND = { r: 241, g: 238, b: 232 };

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

function isNear(value, target, tolerance) {
  return Math.abs(value - target) <= tolerance;
}

function samplePixels(buffer) {
  const png = PNG.sync.read(buffer);
  const result = { sampledPixels: 0, nonBackgroundPixels: 0, brightWhitePixels: 0, redPixels: 0 };

  for (let y = 0; y < png.height; y += 4) {
    for (let x = 0; x < png.width; x += 4) {
      const index = (png.width * y + x) * 4;
      const r = png.data[index];
      const g = png.data[index + 1];
      const b = png.data[index + 2];

      result.sampledPixels += 1;

      if (!isNear(r, BACKGROUND.r, 10) || !isNear(g, BACKGROUND.g, 10) || !isNear(b, BACKGROUND.b, 10)) {
        result.nonBackgroundPixels += 1;
      }
      if (r > 215 && g > 205 && b > 185) result.brightWhitePixels += 1;
      if (r > 220 && g < 95 && b < 95) result.redPixels += 1;
    }
  }

  return result;
}

function assertThreshold(name, actual, minimum) {
  if (actual < minimum) throw new Error(`${name} too low: expected >= ${minimum}, got ${actual}`);
}

async function main() {
  const executablePath = findBrowserExecutable();
  if (!executablePath) throw new Error("No Chrome or Edge executable found. Set CHROME_PATH to run render verification.");

  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const server = await createServer({ logLevel: "error", server: { host: "127.0.0.1", port: 5173, strictPort: false } });

  await server.listen();

  const url = server.resolvedUrls?.local[0];
  const browser = await chromium.launch({ executablePath, headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForSelector("canvas", { timeout: 10_000 });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));
    await page.waitForTimeout(750);

    const canvasBox = await page.locator("canvas").boundingBox();
    if (!canvasBox || canvasBox.width < 1000 || canvasBox.height < 600) {
      throw new Error(`Canvas is not full-screen enough: ${JSON.stringify(canvasBox)}`);
    }

    const debug = await page.evaluate(() => window.__SELF_WORLD_DEBUG__);
    if (debug.debugVisible !== false) throw new Error("Debug wireframes should be hidden by default.");
    if (debug.portfolioBuildingCount < 13) throw new Error("Portfolio building count too low.");

    const screenshot = await page.screenshot({ fullPage: false });
    writeFileSync(SCREENSHOT_PATH, screenshot);

    const pixels = samplePixels(screenshot);
    assertThreshold("nonBackgroundPixels", pixels.nonBackgroundPixels, 2_000);
    assertThreshold("brightWhitePixels", pixels.brightWhitePixels, 1_000);
    if (pixels.redPixels > 20) throw new Error(`Unexpected debug-red pixels in default view: ${pixels.redPixels}`);

    if (errors.length > 0) throw new Error(`Browser console errors:\n${errors.join("\n")}`);

    console.log(JSON.stringify({ ok: true, url, canvasBox, pixels, screenshot: SCREENSHOT_PATH }, null, 2));
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
