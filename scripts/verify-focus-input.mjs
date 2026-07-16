import { existsSync } from "node:fs";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const KEYS = ["w", "a", "s", "d"];

function findBrowserExecutable() {
  return [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ].filter(Boolean).find((candidate) => existsSync(candidate));
}

function quaternionDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3]);
}

async function readDebug(page) {
  return page.evaluate(() => window.__SELF_WORLD_DEBUG__);
}

async function dispatchBlur(page) {
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await page.waitForFunction(() => {
    const input = window.__SELF_WORLD_DEBUG__?.inputDirection ?? [1, 1];
    return Math.hypot(input[0], input[1]) < 0.001;
  });
}

async function assertRotationStopped(page, label) {
  const before = await readDebug(page);
  await page.waitForTimeout(300);
  const after = await readDebug(page);
  const drift = quaternionDistance(before.planetQuaternion, after.planetQuaternion);
  if (drift > 0.001) {
    throw new Error(label + " continued moving after focus loss: " + drift);
  }
  if (after.rotationApplied) {
    throw new Error(label + " still reports applied rotation after focus loss.");
  }
  return drift;
}

async function verifyKeyboard(page) {
  const results = {};

  for (const key of KEYS) {
    await page.keyboard.down(key);
    await page.waitForFunction(() => {
      const input = window.__SELF_WORLD_DEBUG__?.inputDirection ?? [0, 0];
      return Math.hypot(input[0], input[1]) > 0.5;
    });
    await dispatchBlur(page);
    results[key] = await assertRotationStopped(page, key.toUpperCase());
    await page.keyboard.up(key);
  }

  return results;
}

async function verifyPointer(page) {
  await page.mouse.move(640, 360);
  await page.mouse.down();
  await page.mouse.move(700, 320, { steps: 4 });
  await page.waitForFunction(() => {
    const input = window.__SELF_WORLD_DEBUG__?.controlDirection ?? [0, 0];
    return Math.hypot(input[0], input[1]) > 0.5;
  });
  await page.getByTestId("virtual-joystick").waitFor({ state: "visible" });
  await dispatchBlur(page);
  await page.getByTestId("virtual-joystick").waitFor({ state: "detached" });
  const drift = await assertRotationStopped(page, "Pointer drag");
  await page.mouse.up();
  return drift;
}

async function main() {
  const executablePath = findBrowserExecutable();
  if (!executablePath) throw new Error("No Chrome or Edge executable found.");

  const server = await createServer({
    logLevel: "error",
    server: { host: "127.0.0.1", port: 5173, strictPort: false },
  });
  await server.listen();
  const browser = await chromium.launch({ executablePath, headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await page.goto(server.resolvedUrls?.local[0], {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.avatarLoaded === true,
    );

    const keyboardDrift = await verifyKeyboard(page);
    const pointerDrift = await verifyPointer(page);

    console.log(JSON.stringify({
      ok: true,
      keyboardDrift,
      pointerDrift,
      stuckInput: false,
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
