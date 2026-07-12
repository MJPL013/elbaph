import { existsSync } from "node:fs";
import { chromium } from "playwright-core";
import { createServer } from "vite";

function findBrowserExecutable() {
  return [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  ]
    .filter(Boolean)
    .find((candidate) => existsSync(candidate));
}

async function readDebug(page) {
  const debug = await page.evaluate(() => window.__SELF_WORLD_DEBUG__);
  if (!debug) throw new Error("Missing debug state.");
  return debug;
}

function normalize(vector) {
  const length = Math.hypot(vector[0], vector[1]);
  return [vector[0] / length, vector[1] / length];
}

function vectorAngle(a, b) {
  const dot = a[0] * b[0] + a[1] * b[1];
  return Math.acos(Math.min(1, Math.max(-1, dot)));
}

function expectedViewportDirection(debug, rawX, rawY) {
  const character = debug.characterWorldPosition;
  const camera = debug.cameraPosition;
  const forward = normalize([character[0] - camera[0], character[2] - camera[2]]);
  const right = [-forward[1], forward[0]];

  return normalize([
    right[0] * rawX + forward[0] * -rawY,
    right[1] * rawX + forward[1] * -rawY,
  ]);
}

function assertViewportDirection(debug, rawX, rawY, label) {
  const expected = expectedViewportDirection(debug, rawX, rawY);
  const actual = normalize(debug.inputDirection);
  const angle = vectorAngle(actual, expected);

  if (angle > 0.22) {
    throw new Error(`${label} was not viewport-relative: ${angle}`);
  }

  return angle;
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
    await page.goto(server.resolvedUrls?.local[0], { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));

    await page.keyboard.down("a");
    await page.waitForTimeout(500);
    const left = await readDebug(page);
    await page.keyboard.up("a");
    const leftAngle = assertViewportDirection(left, -1, 0, "A");

    await page.waitForTimeout(1100);
    await page.keyboard.down("w");
    await page.waitForTimeout(450);
    const forwardAfterLeft = await readDebug(page);
    await page.keyboard.up("w");
    const forwardAngle = assertViewportDirection(forwardAfterLeft, 0, -1, "W after A");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));
    await page.keyboard.down("w");
    await page.keyboard.down("a");
    await page.waitForTimeout(250);
    const chordStart = await readDebug(page);
    await page.waitForTimeout(700);
    const chordHeld = await readDebug(page);
    await page.keyboard.up("a");
    await page.keyboard.up("w");

    const chordStartAngle = assertViewportDirection(chordStart, -1, -1, "W+A start");
    const chordHeldAngle = assertViewportDirection(chordHeld, -1, -1, "W+A held");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));
    await page.mouse.move(640, 360);
    await page.mouse.down();
    await page.mouse.move(576, 296, { steps: 6 });
    await page.getByTestId("virtual-joystick").waitFor({ state: "visible" });
    await page.waitForTimeout(300);
    const drag = await readDebug(page);
    const dragAngle = assertViewportDirection(drag, -1, -1, "drag up-left");
    await page.mouse.up();
    await page.getByTestId("virtual-joystick").waitFor({ state: "hidden" });
    await page.waitForTimeout(120);
    const released = await readDebug(page);

    if (Math.hypot(...released.inputDirection) > 0.05) {
      throw new Error(`Pointer release did not clear input: ${released.inputDirection}`);
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          leftAngle,
          forwardAngle,
          chordStartAngle,
          chordHeldAngle,
          dragAngle,
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
