import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const REQUIRED_KAZAM_SLOTS = [
  "concrete.warm",
  "roof.teal",
  "metal.graphite",
  "metal.energy",
  "road.asphalt",
  "road.marking",
  "glass.sky",
];

export function assertArtPipeline() {
  const provider = readFileSync("src/art/materials/ElbaphMaterialProvider.tsx", "utf8");
  const types = readFileSync("src/art/materials/materialTypes.ts", "utf8");
  const manifest = readFileSync("src/art/textures/textureManifest.ts", "utf8");
  const prompts = readFileSync("docs/art/texture-prompt-library.md", "utf8");
  const kazam = readFileSync(
    "src/components/scenery/buildings/KazamHeroBuilding.tsx",
    "utf8",
  );
  const buildingDir = "src/components/scenery/buildings";
  const buildingSource = readdirSync(buildingDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => readFileSync(join(buildingDir, file), "utf8"))
    .join("\n");

  if (!provider.includes("MeshToonMaterial") || !provider.includes("DataTexture")) {
    throw new Error("Shared toon material provider is incomplete.");
  }
  if (!provider.includes("NearestFilter") || !provider.includes("three-band-toon-ramp")) {
    throw new Error("Three-band nearest-filtered toon ramp is missing.");
  }
  if ((types.match(/^  "/gm) ?? []).length !== 16) {
    throw new Error("Expected exactly 16 Elbaph material IDs.");
  }
  if (/meshStandardMaterial/.test(buildingSource)) {
    throw new Error("Building kit contains raw meshStandardMaterial usage.");
  }
  if (!manifest.includes("ktx2") || !manifest.includes("webpFallback")) {
    throw new Error("Texture manifest is missing KTX2 or WebP paths.");
  }
  const promptCount = (prompts.match(/^\d+\./gm) ?? []).length;
  if (promptCount !== 73) {
    throw new Error("Expected 73 texture prompts, got " + promptCount + ".");
  }
  if ((kazam.match(/<instancedMesh/g) ?? []).length < 3) {
    throw new Error("Kazam chargers, bollards, and road markings must be instanced.");
  }
  for (const slot of REQUIRED_KAZAM_SLOTS) {
    if (!kazam.includes('"' + slot + '"')) {
      throw new Error("Missing Kazam material slot: " + slot + ".");
    }
  }
}

export { REQUIRED_KAZAM_SLOTS };
