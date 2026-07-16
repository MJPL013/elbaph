import type { AmbientPlacement, AmbientPropKind } from "../../../types/worldContracts";

type Quarter = AmbientPlacement["quarter"];
type Seed = readonly [
  kind: AmbientPropKind,
  latitudeOffset: number,
  longitudeOffset: number,
  scale: number,
];

const CENTERS: Record<Quarter, readonly [number, number]> = {
  experience: [38, -116],
  "ai-projects": [30, -24],
  creative: [-28, 68],
  contact: [28, 150],
};

const PATTERNS: Record<Quarter, readonly Seed[]> = {
  experience: [
    ["crystal", 14, -34, 1.1], ["lantern", 8, -18, 0.9],
    ["rock", -4, -30, 1.2], ["grass", 2, -18, 1.1],
    ["tree", 16, 12, 0.9], ["crystal", -12, 8, 0.8],
    ["lantern", -2, 24, 0.8], ["grass", -18, -12, 1.0],
    ["rock", 4, 40, 0.9], ["tree", -18, 34, 0.75],
    ["grass", 22, 32, 0.9], ["crystal", -28, -36, 0.7],
  ],
  "ai-projects": [
    ["crystal", 12, -28, 1.0], ["mushroom", 4, -18, 1.1],
    ["tree", -10, -28, 0.85], ["grass", 18, 4, 0.9],
    ["crystal", -4, 18, 0.75], ["mushroom", -16, 10, 0.85],
    ["lantern", 10, 30, 0.8], ["tree", -22, 34, 0.75],
    ["rock", 24, 44, 0.8], ["grass", -30, -8, 1.0],
    ["crystal", 30, -12, 0.7], ["mushroom", -8, 48, 0.8],
  ],
  creative: [
    ["tree", 12, -32, 1.0], ["mushroom", 4, -20, 1.2],
    ["grass", -8, -30, 1.1], ["rock", 18, 4, 1.0],
    ["tree", -2, 20, 0.85], ["mushroom", -18, 12, 0.9],
    ["crystal", 8, 34, 0.75], ["grass", -24, 38, 1.0],
    ["rock", 26, 48, 0.9], ["tree", -30, -12, 0.8],
    ["mushroom", 30, -18, 0.75], ["grass", -10, 54, 0.9],
  ],
  contact: [
    ["lantern", 12, -30, 1.0], ["tree", 4, -18, 0.9],
    ["grass", -8, -28, 1.1], ["crystal", 18, 2, 0.8],
    ["lantern", -2, 20, 0.85], ["tree", -18, 10, 0.85],
    ["rock", 8, 36, 0.9], ["grass", -26, 36, 1.0],
    ["lantern", 26, 46, 0.75], ["tree", -30, -12, 0.75],
    ["crystal", 32, -16, 0.7], ["grass", -10, 54, 0.9],
  ],
};

export const AMBIENT_PLACEMENTS: AmbientPlacement[] = Object.entries(PATTERNS)
  .flatMap(([quarter, seeds]) => {
    const typedQuarter = quarter as Quarter;
    const [baseLatitude, baseLongitude] = CENTERS[typedQuarter];
    return seeds.map(([kind, lat, lon, scale], index) => ({
      id: typedQuarter + "-" + kind + "-" + index,
      kind,
      latitude: clampLatitude(baseLatitude + lat),
      longitude: wrapLongitude(baseLongitude + lon),
      scale,
      rotation: ((index * 47) % 360) * (Math.PI / 180),
      quarter: typedQuarter,
    }));
  })
  .concat([
    { id: "island-experience", kind: "island", latitude: 5, longitude: -154, scale: 0.8, rotation: 0, quarter: "experience" },
    { id: "island-ai", kind: "island", latitude: 2, longitude: -42, scale: 0.72, rotation: 0, quarter: "ai-projects" },
    { id: "island-creative", kind: "island", latitude: -58, longitude: 52, scale: 0.8, rotation: 0, quarter: "creative" },
    { id: "island-contact", kind: "island", latitude: 4, longitude: 118, scale: 0.74, rotation: 0, quarter: "contact" },
    { id: "spawn-tree-a", kind: "tree", latitude: 69, longitude: 18, scale: 0.72, rotation: 0.2, quarter: "contact" },
    { id: "spawn-crystal-a", kind: "crystal", latitude: 67, longitude: 48, scale: 0.72, rotation: 0.5, quarter: "contact" },
    { id: "spawn-lantern-a", kind: "lantern", latitude: 70, longitude: 78, scale: 0.7, rotation: 0.8, quarter: "contact" },
    { id: "spawn-grass-a", kind: "grass", latitude: 66, longitude: 106, scale: 0.82, rotation: 1.1, quarter: "contact" },
    { id: "spawn-tree-b", kind: "tree", latitude: 68, longitude: 154, scale: 0.68, rotation: 1.5, quarter: "contact" },
    { id: "spawn-crystal-b", kind: "crystal", latitude: 66, longitude: -174, scale: 0.68, rotation: 1.8, quarter: "experience" },
    { id: "spawn-lantern-b", kind: "lantern", latitude: 70, longitude: -142, scale: 0.7, rotation: 2.1, quarter: "experience" },
    { id: "spawn-grass-b", kind: "grass", latitude: 67, longitude: -108, scale: 0.82, rotation: 2.5, quarter: "experience" },
    { id: "spawn-tree-c", kind: "tree", latitude: 69, longitude: -76, scale: 0.7, rotation: 2.8, quarter: "ai-projects" },
    { id: "spawn-mushroom", kind: "mushroom", latitude: 66, longitude: -44, scale: 0.78, rotation: 3.1, quarter: "ai-projects" },
    { id: "spawn-rock", kind: "rock", latitude: 68, longitude: -14, scale: 0.78, rotation: 3.4, quarter: "creative" },
    { id: "spawn-grass-c", kind: "grass", latitude: 66, longitude: 12, scale: 0.8, rotation: 3.7, quarter: "creative" },
  ]);

function clampLatitude(value: number) {
  return Math.max(-72, Math.min(72, value));
}

function wrapLongitude(value: number) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}
