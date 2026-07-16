import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

export async function captureSecondaryViews(browser, baseUrl, artifactDir) {
  const lowPath = resolve(artifactDir, "visual-low-check.png");
  const mobilePath = resolve(artifactDir, "visual-mobile-check.png");
  const lowPage = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    await lowPage.goto(baseUrl + "?quality=low", {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await lowPage.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.avatarLoaded === true,
    );
    await lowPage.waitForTimeout(250);
    const lowDebug = await lowPage.evaluate(() => window.__SELF_WORLD_DEBUG__);
    if (lowDebug.kazamHeroCount !== 1) throw new Error("Low quality lost the Kazam hero.");
    if (lowDebug.ambientInstanceCount >= 52) {
      throw new Error("Low quality did not reduce fantasy prop density.");
    }
    writeFileSync(lowPath, await lowPage.screenshot({ fullPage: false }));
  } finally {
    await lowPage.close();
  }

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  mobilePage.on("pageerror", (error) => errors.push(error.message));

  try {
    await mobilePage.goto(baseUrl + "?quality=medium", {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await mobilePage.waitForFunction(
      () => window.__SELF_WORLD_DEBUG__?.avatarLoaded === true,
    );
    await mobilePage.mouse.move(92, 700);
    await mobilePage.mouse.down();
    await mobilePage.mouse.move(135, 660, { steps: 5 });
    await mobilePage.getByTestId("virtual-joystick").waitFor({ state: "visible" });
    writeFileSync(mobilePath, await mobilePage.screenshot({ fullPage: false }));
    await mobilePage.mouse.up();
  } finally {
    await mobilePage.close();
  }

  if (errors.length > 0) {
    throw new Error("Mobile browser errors:\n" + errors.join("\n"));
  }
  return { lowPath, mobilePath };
}
