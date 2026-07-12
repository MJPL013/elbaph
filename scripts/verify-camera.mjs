import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const ARTIFACT_DIR = resolve(".agents", "artifacts");
const SCREENSHOT_PATH = resolve(ARTIFACT_DIR, "camera-check.png");
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

function vectorDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function zOffsetFromCharacter(debug) {
  return debug.cameraPosition[2] - debug.characterWorldPosition[2];
}

function xOffsetFromCharacter(debug) {
  return debug.cameraPosition[0] - debug.characterWorldPosition[0];
}

function yawDistance(a, b) {
  return Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
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

async function readDebug(page) {
  const debug = await page.evaluate(() => window.__SELF_WORLD_DEBUG__);

  if (!debug) throw new Error("Missing window.__SELF_WORLD_DEBUG__ state.");

  return debug;
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
    const cameraLogs = [];

    page.on("console", (message) => {
      const text = message.text();
      if (message.type() === "error") errors.push(text);
      if (text.includes("[CAMERA-TARGET]")) cameraLogs.push(text);
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForSelector("canvas", { timeout: 10_000 });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));

    const beforeInteraction = await readDebug(page);
    const initialCameraDistance = vectorDistance(
      beforeInteraction.cameraPosition,
      beforeInteraction.characterWorldPosition,
    );
    const clickTarget = findVisibleLandmarkScreen(beforeInteraction);

    if (initialCameraDistance > 4.2) {
      throw new Error(`Default camera is too far: ${initialCameraDistance}`);
    }

    await page.mouse.click(clickTarget.point[0], clickTarget.point[1]);
    await page.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.isInteracting === true,
      null,
      { timeout: 5_000 },
    );
    await page.waitForTimeout(800);

    const interacting = await readDebug(page);
    const interactionDelta = vectorDistance(
      beforeInteraction.cameraPosition,
      interacting.cameraPosition,
    );

    if (interactionDelta < 0.1) {
      throw new Error(`Interaction camera did not move enough: ${interactionDelta}`);
    }

    if (cameraLogs.length === 0) {
      throw new Error("Missing [CAMERA-TARGET] console log.");
    }

    await page.getByRole("button", { name: "Close" }).click();
    await page.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.isInteracting === false,
      null,
      { timeout: 5_000 },
    );

    const beforeFollow = await readDebug(page);
    await page.keyboard.down("w");
    await page.waitForTimeout(500);
    await page.keyboard.up("w");
    const afterFollow = await readDebug(page);
    const followDelta = vectorDistance(
      beforeFollow.cameraPosition,
      afterFollow.cameraPosition,
    );

    if (followDelta < 0.05) {
      throw new Error(`Lazy follow camera did not move enough: ${followDelta}`);
    }

    const beforeBackward = await readDebug(page);
    await page.keyboard.down("s");
    await page.waitForTimeout(500);
    const duringBackward = await readDebug(page);
    await page.keyboard.up("s");
    await page.waitForTimeout(1700);
    const afterBackwardRelease = await readDebug(page);
    const backwardDelta = vectorDistance(
      beforeBackward.cameraPosition,
      duringBackward.cameraPosition,
    );
    const backwardArcOffset = Math.abs(xOffsetFromCharacter(duringBackward));
    const releasedArcOffset = Math.abs(xOffsetFromCharacter(afterBackwardRelease));

    if (!duringBackward.characterRunning) {
      throw new Error("Character did not enter running state while S was held.");
    }

    if (Math.abs(duringBackward.characterFacingYaw) < 1) {
      throw new Error(
        `Character did not turn toward camera for S: yaw=${duringBackward.characterFacingYaw}, direction=${duringBackward.inputDirection}`,
      );
    }

    if (zOffsetFromCharacter(duringBackward) < 1.8) {
      throw new Error("S moved camera through/in front of the character.");
    }

    if (afterBackwardRelease.characterRunning) {
      throw new Error("Character kept running after S was released.");
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
          initialCameraDistance,
          followDelta,
          interactionDelta,
          backwardDelta,
          backwardHoldCameraZOffset: zOffsetFromCharacter(duringBackward),
          backwardArcOffset,
          releasedArcOffset,
          backwardCharacterYaw: duringBackward.characterFacingYaw,
          persistentCharacterYaw: afterBackwardRelease.characterFacingYaw,
          releasedCameraZOffset: zOffsetFromCharacter(afterBackwardRelease),
          cameraLogs,
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
