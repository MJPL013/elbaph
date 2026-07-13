import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { PNG } from "pngjs";
import { createServer } from "vite";
import { captureSecondaryViews } from "./visual-viewport-checks.mjs";

const ARTIFACT_DIR = resolve(".agents", "artifacts");
const SCREENSHOT_PATH = resolve(ARTIFACT_DIR, "visual-check.png");
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

function pixelAt(png, x, y) {
  const index = (png.width * y + x) * 4;
  return [png.data[index], png.data[index + 1], png.data[index + 2]];
}

function hasBrightNeighbor(png, x, y) {
  for (let dy = -6; dy <= 6; dy += 3) {
    for (let dx = -6; dx <= 6; dx += 3) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= png.width || ny >= png.height) continue;
      const [r, g, b] = pixelAt(png, nx, ny);
      if (r > 180 && g > 160 && b > 130) return true;
    }
  }

  return false;
}

function countOutlinePixels(buffer) {
  const png = PNG.sync.read(buffer);
  let outlinePixels = 0;

  for (let y = 0; y < png.height; y += 2) {
    for (let x = 0; x < png.width; x += 2) {
      const [r, g, b] = pixelAt(png, x, y);
      const isInk = r < 75 && g < 60 && b < 50;
      if (isInk && hasBrightNeighbor(png, x, y)) outlinePixels += 1;
    }
  }

  return outlinePixels;
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
  if (!executablePath) throw new Error("No Chrome or Edge executable found.");

  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const server = await createServer({
    logLevel: "error",
    server: { host: "127.0.0.1", port: 5173, strictPort: false },
  });

  await server.listen();

  const url = server.resolvedUrls?.local[0];
  const browser = await chromium.launch({ executablePath, headless: true });

  try {
    const page = await browser.newPage({ viewport: VIEWPORT });
    const errors = [];

    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));
    await page.waitForTimeout(900);

    const screenshot = await page.screenshot({ fullPage: false });
    writeFileSync(SCREENSHOT_PATH, screenshot);

    const debug = await page.evaluate(() => window.__SELF_WORLD_DEBUG__);
    if (debug.sceneryMeshCount < 40) throw new Error(`Scenery mesh count too low: ${debug.sceneryMeshCount}`);
    if (debug.portfolioBuildingCount < 13) throw new Error(`Missing 3D portfolio buildings: ${debug.portfolioBuildingCount}`);
    if (debug.billboardLabelCount < 13) throw new Error(`Missing billboard labels: ${debug.billboardLabelCount}`);
    if (debug.decalSlotCount < 13) throw new Error(`Missing decal slots: ${debug.decalSlotCount}`);
    if (debug.quarterBandCount < 4) throw new Error(`Missing quarter boundary bands: ${debug.quarterBandCount}`);
    if (debug.debugVisible !== false) throw new Error("Debug wireframes should be hidden by default.");
    if (!debug.currentQuarter) throw new Error("Current quarter was not detected for HUD state.");
    if (debug.materialLibraryCount !== 16) throw new Error("Material registry count is not 16.");
    if (debug.duplicateElbaphMaterialCount !== 0) throw new Error("Duplicate shared materials detected.");
    if (debug.kazamHeroCount !== 1) throw new Error("Missing Kazam hero blockout.");
    if (debug.kazamDrawCalls > 16) throw new Error("Kazam draw-call budget exceeded: " + debug.kazamDrawCalls);
    if (debug.kazamTriangles > 7000) throw new Error("Kazam triangle budget exceeded: " + debug.kazamTriangles);
    if (debug.rendererDrawCalls <= 0 || debug.rendererTriangles <= 0) throw new Error("Renderer statistics are unavailable.");

    await page.waitForFunction(() => window.__SELF_WORLD_DEBUG__?.avatarLoaded === true, null, { timeout: 10_000 });

    const outlinePixels = countOutlinePixels(screenshot);
    if (outlinePixels < 80) {
      throw new Error(`Outline pixel count too low: ${outlinePixels}; targets=${debug.outlineTargetCount}`);
    }

    const clickTarget = findVisibleLandmarkScreen(debug);
    await page.mouse.click(clickTarget.point[0], clickTarget.point[1]);
    const panel = page.getByTestId("interaction-panel");
    await panel.waitFor({ state: "visible", timeout: 5_000 });

    const panelState = await panel.evaluate((element) => {
      const box = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return { x: box.x, width: box.width, animationName: style.animationName };
    });

    if (panelState.x < 800 || panelState.width < 280) {
      throw new Error(`Panel is not right-side framed: ${JSON.stringify(panelState)}`);
    }
    if (!panelState.animationName.includes("panel-slide")) {
      throw new Error(`Panel slide animation missing: ${panelState.animationName}`);
    }

    await page.keyboard.press("h");
    await page.waitForFunction(() => window.__SELF_WORLD_DEBUG__?.debugVisible === true, null, { timeout: 3_000 });
    await page.keyboard.press("h");
    await page.waitForFunction(() => window.__SELF_WORLD_DEBUG__?.debugVisible === false, null, { timeout: 3_000 });

    const secondaryViews = await captureSecondaryViews(browser, url, ARTIFACT_DIR);

    if (errors.length > 0) throw new Error(`Browser console errors:\n${errors.join("\n")}`);

    console.log(JSON.stringify({
      ok: true,
      url,
      outlinePixels,
      panelState,
      kazam: {
        meshes: debug.kazamMeshCount,
        triangles: debug.kazamTriangles,
        drawCalls: debug.kazamDrawCalls,
      },
      renderer: {
        triangles: debug.rendererTriangles,
        drawCalls: debug.rendererDrawCalls,
        textures: debug.rendererTextures,
      },
      screenshot: SCREENSHOT_PATH,
      secondaryViews,
    }, null, 2));
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
