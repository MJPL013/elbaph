import { existsSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const DIST_DIR = "dist";
const TRACKED_EXTENSIONS = new Set([".js", ".css", ".glb", ".gltf", ".png", ".jpg", ".jpeg", ".webp"]);
const RASTER_BUDGET_BYTES = 200 * 1024;

function walk(dir) {
  const entries = [];

  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) {
      entries.push(...walk(path));
    } else if (TRACKED_EXTENSIONS.has(extname(item.name).toLowerCase())) {
      entries.push(path);
    }
  }

  return entries;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

if (!existsSync(DIST_DIR)) {
  throw new Error("Missing dist directory. Run npm run build first.");
}

const files = walk(DIST_DIR)
  .map((file) => ({ file: relative(DIST_DIR, file), bytes: statSync(file).size }))
  .sort((a, b) => b.bytes - a.bytes);
const totals = files.reduce((acc, file) => {
  const extension = extname(file.file).slice(1) || "other";
  acc[extension] = (acc[extension] ?? 0) + file.bytes;
  return acc;
}, {});

console.log("Build asset sizes:");
for (const file of files) {
  const extension = extname(file.file).toLowerCase();
  const overRasterBudget = [".png", ".jpg", ".jpeg", ".webp"].includes(extension) && file.bytes > RASTER_BUDGET_BYTES;
  const warning = overRasterBudget ? "  WARN: optimize future decal/image asset" : "";
  console.log(`${formatBytes(file.bytes).padStart(9)}  ${file.file}${warning}`);
}
console.log("Totals:");
for (const [extension, bytes] of Object.entries(totals)) {
  console.log(`${extension.padStart(5)}  ${formatBytes(bytes)}`);
}
