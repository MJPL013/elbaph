import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const SOURCE_ROOT = "src";
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);
const files = walk(SOURCE_ROOT).filter((file) => SOURCE_EXTENSIONS.has(extname(file)));
const failures = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  const path = relative(".", file).replaceAll("\\", "/");
  const lineCount = source.split(/\r?\n/).length - 1;

  if (lineCount > 200) failures.push(path + " exceeds 200 lines: " + lineCount);

  if (path.startsWith("src/game/")) {
    const forbidden = [
      "react",
      "@react-three",
      "/components/",
      "../components/",
      "/visuals/",
      "../art/",
      "postprocessing",
    ];
    for (const token of forbidden) {
      if (source.includes(token)) {
        failures.push(path + " imports forbidden game-layer dependency: " + token);
      }
    }
  }

  if (path.startsWith("src/components/visuals/")) {
    if (/registerCollider|colliderId/.test(source)) {
      failures.push(path + " must not register or define gameplay colliders.");
    }
    if (/<mesh(?:Standard|Toon|Phong|Lambert)Material|new Mesh(?:Standard|Toon|Phong|Lambert)Material/.test(source)) {
      failures.push(path + " allocates an unshared scenery material.");
    }
  }
}

const controller = readFileSync("src/components/TreadmillPlanet.tsx", "utf8");
for (const forbidden of ["./Planet", "./Landmarks", "./visuals/"]) {
  if (controller.includes(forbidden)) {
    failures.push("TreadmillPlanet depends on concrete world rendering: " + forbidden);
  }
}
if (!controller.includes("children(registerCollider)")) {
  failures.push("TreadmillPlanet must expose rendering through its collider render contract.");
}

const landmarkEntity = readFileSync("src/components/LandmarkBox.tsx", "utf8");
if (!landmarkEntity.includes("<LandmarkVisual") || !landmarkEntity.includes("<EntityCollider")) {
  failures.push("Landmark entity is not split into independent visual and collider children.");
}

if (failures.length > 0) {
  throw new Error("Architecture verification failed:\n" + failures.join("\n"));
}

console.log(JSON.stringify({
  ok: true,
  checkedFiles: files.length,
  gameLayer: "pure",
  worldLayer: "typed entities",
  visualLayer: "replaceable fantasy package",
}, null, 2));

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}
