import { existsSync } from "node:fs";
import { chromium } from "playwright-core";
import { createServer } from "vite";

const GLB_PATTERN = "**/*son_goku_and_kintoun_nimbus*.glb";

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

async function waitForAvatar(page) {
  await page.waitForFunction(
    () =>
      window.__SELF_WORLD_DEBUG__?.avatarLoaded === true &&
      window.__SELF_WORLD_DEBUG__?.avatarStatus === "ready",
    null,
    { timeout: 15_000 },
  );
  await page.getByTestId("avatar-loading-gate").waitFor({ state: "detached" });
  const debug = await page.evaluate(() => window.__SELF_WORLD_DEBUG__);
  if (debug.avatarPlaceholderVisible) {
    throw new Error("Avatar placeholder remained visible after readiness.");
  }
}

async function verifyColdLoads(browser, url) {
  const durations = [];

  for (let run = 0; run < 3; run += 1) {
    const context = await browser.newContext();
    const page = await context.newPage();
    let modelResponses = 0;
    page.on("response", (response) => {
      if (response.url().includes("son_goku_and_kintoun_nimbus")) {
        modelResponses += 1;
      }
    });
    const started = Date.now();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await waitForAvatar(page);
    durations.push(Date.now() - started);
    if (modelResponses < 1) throw new Error("Cold load did not request the avatar GLB.");
    await context.close();
  }

  return durations;
}

async function verifyRecovery(browser, url) {
  const context = await browser.newContext();
  const page = await context.newPage();
  let requests = 0;

  await page.route(GLB_PATTERN, async (route) => {
    requests += 1;
    if (requests <= 2) await route.abort("failed");
    else await route.continue();
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
  const gate = page.getByTestId("avatar-loading-gate");
  await gate.waitFor({ state: "visible" });
  const retry = page.getByRole("button", { name: "Retry Goku" });
  await retry.waitFor({ state: "visible", timeout: 12_000 });
  await page.waitForTimeout(1_100);
  if (requests < 2) {
    throw new Error("Automatic retry did not issue a second GLB request.");
  }
  await retry.waitFor({ state: "visible", timeout: 5_000 });
  await retry.click();
  await waitForAvatar(page);
  if (requests < 3) throw new Error("Manual retry did not issue a fresh GLB request.");
  await context.close();
  return requests;
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
    const coldLoadDurations = await verifyColdLoads(browser, server.resolvedUrls?.local[0]);
    const recoveryRequests = await verifyRecovery(browser, server.resolvedUrls?.local[0]);
    console.log(JSON.stringify({
      ok: true,
      coldLoadDurations,
      recoveryRequests,
      refreshRequired: false,
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
