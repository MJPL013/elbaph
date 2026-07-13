import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { createServer } from "vite";
import { assertArtPipeline, REQUIRED_KAZAM_SLOTS } from "./verify-art-pipeline.mjs";

const ARTIFACT_DIR = resolve(".agents", "artifacts");
const SCREENSHOT_PATH = resolve(ARTIFACT_DIR, "content-check.png");
const VIEWPORT = { width: 1280, height: 720 };
const REQUIRED_IDS = [
  "home",
  "kazam",
  "thermal-super-resolution",
  "naxxatra",
  "rajneeti",
  "vakyasaar",
  "persona-architect",
  "solar-decathlon",
  "deep-learning-challenge",
  "surc",
  "skills",
  "personal",
  "contact",
];
const REQUIRED_DISTRICTS = ["home", "experience", "projects", "achievements", "skills", "personal", "contact"];
const REQUIRED_QUARTERS = ["experience", "ai-projects", "creative", "contact"];
const REQUIRED_ARCHETYPES = [
  "ev-charger",
  "satellite-lab",
  "learning-clubhouse",
  "civic-terminal",
  "archive-library",
  "agent-lab",
  "solar-house",
  "challenge-podium",
  "research-observatory",
  "personal-studio",
  "spawn-pavilion",
  "skills-tower",
  "contact-beacon",
];

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

function readContentSource() {
  return [
    "src/content/portfolioCore.ts",
    "src/content/portfolioExperience.ts",
    "src/content/portfolioProjects.ts",
    "src/content/portfolioAchievements.ts",
  ]
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
}

function assertStructuredContent() {
  const contentSource = readContentSource();
  const landmarkSource = readFileSync("src/game/landmarkData.ts", "utf8");
  const appSource = readFileSync("src/App.tsx", "utf8");
  const characterSource = readFileSync("src/components/Character.tsx", "utf8");
  const avatarSource = readFileSync("src/components/Avatar.tsx", "utf8");
  const overlaySource = readFileSync("src/components/InteractionOverlay.tsx", "utf8");

  for (const id of REQUIRED_IDS) {
    const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const entryPattern = new RegExp(`id:\\s*"${escapedId}"[\\s\\S]*?highlights:\\s*\\[`);
    if (!entryPattern.test(contentSource)) throw new Error(`Missing content fields for ${id}.`);
    if (!landmarkSource.includes(`id: "${id}"`)) throw new Error(`Missing placement for ${id}.`);
  }

  for (const district of REQUIRED_DISTRICTS) {
    if (!contentSource.includes(`district: "${district}"`)) throw new Error(`Missing content district: ${district}.`);
  }

  for (const quarter of REQUIRED_QUARTERS) {
    if (!landmarkSource.includes(`quarter: "${quarter}"`)) throw new Error(`Missing planet quarter: ${quarter}.`);
  }

  for (const archetype of REQUIRED_ARCHETYPES) {
    if (!landmarkSource.includes(`buildingArchetype: "${archetype}"`)) {
      throw new Error(`Missing building archetype: ${archetype}.`);
    }
  }

  if (landmarkSource.includes("heroVariant")) throw new Error("heroVariant should be replaced by buildingArchetype.");
  if (!landmarkSource.includes("decalTheme") || !landmarkSource.includes("footprint")) {
    throw new Error("Landmark visual metadata is missing decalTheme or footprint.");
  }
  if (!characterSource.includes("fallback={<AvatarPlaceholder />}")) {
    throw new Error("Avatar placeholder fallback is not wired in Character.");
  }
  if (!appSource.includes("preloadAvatarModel") || !avatarSource.includes("AVATAR_MODEL_URL")) {
    throw new Error("Shared avatar preload/model URL wiring is missing.");
  }
  if (/MANOJ_PAL\.pdf|\.pdf/i.test(appSource + overlaySource)) {
    throw new Error("The public UI must not open or expose the resume PDF.");
  }
}

async function main() {
  assertStructuredContent();
  assertArtPipeline();

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
    const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: 1 });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.waitForSelector("canvas", { timeout: 10_000 });
    await page.waitForFunction(() => Boolean(window.__SELF_WORLD_DEBUG__));

    const debug = await page.evaluate(() => window.__SELF_WORLD_DEBUG__);
    const homePoint = debug.landmarkScreens?.home;
    if (!homePoint) throw new Error("Missing projected Home landmark.");
    if (!debug.currentQuarter) throw new Error("HUD/debug current quarter is not set.");
    if (debug.portfolioBuildingCount < REQUIRED_IDS.length) throw new Error("Missing portfolio 3D buildings.");
    if (debug.billboardLabelCount < REQUIRED_IDS.length) throw new Error("Missing billboard labels.");
    if (debug.decalSlotCount < REQUIRED_IDS.length) throw new Error("Missing decal slots.");
    if (debug.materialLibraryCount !== 16) throw new Error("Material registry count is not 16.");
    if (debug.duplicateElbaphMaterialCount !== 0) throw new Error("Duplicate Elbaph materials detected.");
    if (debug.kazamHeroCount !== 1) throw new Error("Expected one Kazam hero building.");
    if (debug.kazamDrawCalls > 16) throw new Error("Kazam exceeds 16 draw calls.");
    if (debug.kazamTriangles > 7000) throw new Error("Kazam exceeds 7,000 triangles.");
    for (const slot of REQUIRED_KAZAM_SLOTS) {
      if (!debug.kazamMaterialSlots.includes(slot)) throw new Error("Runtime missing Kazam slot: " + slot);
    }

    for (const archetype of REQUIRED_ARCHETYPES) {
      if (!debug.buildingArchetypes?.includes(archetype)) throw new Error(`Runtime missing archetype: ${archetype}.`);
    }

    await page.mouse.click(homePoint[0], homePoint[1]);
    const panel = page.getByTestId("interaction-panel");
    await panel.waitFor({ state: "visible", timeout: 5_000 });
    await page.getByText("Overview", { exact: true }).waitFor({ state: "visible" });
    await page.getByText("Highlights", { exact: true }).waitFor({ state: "visible" });
    await page.getByText("Tech", { exact: true }).waitFor({ state: "visible" });

    if (errors.length > 0) throw new Error(`Browser console errors:\n${errors.join("\n")}`);

    const screenshot = await page.screenshot({ fullPage: false });
    writeFileSync(SCREENSHOT_PATH, screenshot);

    console.log(JSON.stringify({ ok: true, url, verifiedLandmarks: REQUIRED_IDS, screenshot: SCREENSHOT_PATH }, null, 2));
  } finally {
    await browser.close();
    await server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
