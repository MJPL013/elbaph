import type { PortfolioContentId } from "../content/portfolioContent";
import { PANTONE_INSPIRED } from "./palette";

export type PortfolioQuarter = "experience" | "ai-projects" | "creative" | "contact";

export type BuildingArchetype =
  | "ev-charger"
  | "satellite-lab"
  | "learning-clubhouse"
  | "civic-terminal"
  | "archive-library"
  | "agent-lab"
  | "solar-house"
  | "challenge-podium"
  | "research-observatory"
  | "personal-studio"
  | "spawn-pavilion"
  | "skills-tower"
  | "contact-beacon";

export type DecalTheme =
  | "energy"
  | "thermal"
  | "learning"
  | "civic"
  | "archive"
  | "agents"
  | "solar"
  | "challenge"
  | "research"
  | "personal"
  | "identity"
  | "skills"
  | "contact";

export type LandmarkDefinition = {
  id: PortfolioContentId;
  latitude: number;
  longitude: number;
  color: string;
  quarter: PortfolioQuarter;
  buildingArchetype: BuildingArchetype;
  decalTheme: DecalTheme;
  height?: number;
  footprint?: [number, number];
  labelOffset?: [number, number, number];
  padRadius: number;
  propCluster?: "flags" | "clouds" | "lamps";
};

export const QUARTER_LABELS: Record<PortfolioQuarter, string> = {
  experience: "Experience",
  "ai-projects": "AI Projects",
  creative: "Creative",
  contact: "Contact",
};

export const QUARTER_COLORS: Record<PortfolioQuarter, string> = {
  experience: PANTONE_INSPIRED.blue,
  "ai-projects": PANTONE_INSPIRED.teal,
  creative: PANTONE_INSPIRED.rose,
  contact: PANTONE_INSPIRED.gold,
};

export const LANDMARKS: LandmarkDefinition[] = [
  { id: "kazam", latitude: 62, longitude: -154, color: PANTONE_INSPIRED.gold, quarter: "experience", buildingArchetype: "ev-charger", decalTheme: "energy", height: 0.82, footprint: [0.64, 0.54], labelOffset: [0, 0.76, -0.1], padRadius: 0.68, propCluster: "lamps" },
  { id: "thermal-super-resolution", latitude: 42, longitude: -122, color: PANTONE_INSPIRED.blue, quarter: "experience", buildingArchetype: "satellite-lab", decalTheme: "thermal", height: 0.9, footprint: [0.58, 0.58], labelOffset: [0, 0.88, -0.08], padRadius: 0.64, propCluster: "clouds" },
  { id: "naxxatra", latitude: 64, longitude: -100, color: PANTONE_INSPIRED.violet, quarter: "experience", buildingArchetype: "learning-clubhouse", decalTheme: "learning", height: 0.78, footprint: [0.68, 0.58], labelOffset: [0, 0.78, -0.1], padRadius: 0.66, propCluster: "flags" },
  { id: "rajneeti", latitude: 44, longitude: -52, color: PANTONE_INSPIRED.mocha, quarter: "ai-projects", buildingArchetype: "civic-terminal", decalTheme: "civic", height: 0.82, footprint: [0.62, 0.56], labelOffset: [0, 0.78, -0.08], padRadius: 0.64, propCluster: "flags" },
  { id: "vakyasaar", latitude: 24, longitude: -18, color: PANTONE_INSPIRED.mint, quarter: "ai-projects", buildingArchetype: "archive-library", decalTheme: "archive", height: 0.78, footprint: [0.64, 0.58], labelOffset: [0, 0.76, -0.08], padRadius: 0.62, propCluster: "clouds" },
  { id: "persona-architect", latitude: 44, longitude: -6, color: PANTONE_INSPIRED.rose, quarter: "ai-projects", buildingArchetype: "agent-lab", decalTheme: "agents", height: 0.86, footprint: [0.6, 0.6], labelOffset: [0, 0.84, -0.08], padRadius: 0.62, propCluster: "lamps" },
  { id: "solar-decathlon", latitude: -10, longitude: 22, color: PANTONE_INSPIRED.gold, quarter: "creative", buildingArchetype: "solar-house", decalTheme: "solar", height: 0.78, footprint: [0.7, 0.58], labelOffset: [0, 0.78, -0.08], padRadius: 0.68, propCluster: "flags" },
  { id: "deep-learning-challenge", latitude: -32, longitude: 52, color: PANTONE_INSPIRED.peachDeep, quarter: "creative", buildingArchetype: "challenge-podium", decalTheme: "challenge", height: 0.7, footprint: [0.58, 0.54], labelOffset: [0, 0.72, -0.08], padRadius: 0.6, propCluster: "lamps" },
  { id: "surc", latitude: -48, longitude: 82, color: PANTONE_INSPIRED.blueDeep, quarter: "creative", buildingArchetype: "research-observatory", decalTheme: "research", height: 0.84, footprint: [0.58, 0.58], labelOffset: [0, 0.84, -0.08], padRadius: 0.6, propCluster: "clouds" },
  { id: "personal", latitude: -26, longitude: 112, color: PANTONE_INSPIRED.violet, quarter: "creative", buildingArchetype: "personal-studio", decalTheme: "personal", height: 0.74, footprint: [0.62, 0.56], labelOffset: [0, 0.72, -0.08], padRadius: 0.62, propCluster: "clouds" },
  { id: "home", latitude: 70, longitude: 126, color: PANTONE_INSPIRED.teal, quarter: "contact", buildingArchetype: "spawn-pavilion", decalTheme: "identity", height: 0.72, footprint: [0.72, 0.62], labelOffset: [0, 0.72, -0.08], padRadius: 0.76, propCluster: "lamps" },
  { id: "skills", latitude: 16, longitude: 150, color: PANTONE_INSPIRED.tealDeep, quarter: "contact", buildingArchetype: "skills-tower", decalTheme: "skills", height: 0.96, footprint: [0.58, 0.58], labelOffset: [0, 0.96, -0.08], padRadius: 0.66, propCluster: "lamps" },
  { id: "contact", latitude: -12, longitude: 174, color: PANTONE_INSPIRED.graphite, quarter: "contact", buildingArchetype: "contact-beacon", decalTheme: "contact", height: 0.84, footprint: [0.56, 0.56], labelOffset: [0, 0.84, -0.08], padRadius: 0.62, propCluster: "flags" },
];

export type FillerBuildingDefinition = {
  id: string;
  latitude: number;
  longitude: number;
  height: number;
  color: string;
  variant: "spire" | "stack" | "shrine" | "tower";
  propCluster?: "flags" | "clouds" | "lamps";
  collidable?: boolean;
};

export const FILLER_BUILDINGS: FillerBuildingDefinition[] = [
  { id: "east-gate", latitude: 78, longitude: 6, height: 0.42, color: PANTONE_INSPIRED.mochaSoft, variant: "shrine", propCluster: "flags", collidable: true },
  { id: "north-marker", latitude: 30, longitude: -84, height: 0.3, color: PANTONE_INSPIRED.cloud, variant: "tower", propCluster: "lamps", collidable: true },
  { id: "filler-03", latitude: 0, longitude: -108, height: 0.28, color: PANTONE_INSPIRED.peachSoft, variant: "spire", propCluster: "clouds" },
  { id: "filler-04", latitude: 32, longitude: 98, height: 0.34, color: PANTONE_INSPIRED.mochaDeep, variant: "stack", propCluster: "lamps" },
  { id: "filler-05", latitude: 0, longitude: 130, height: 0.3, color: PANTONE_INSPIRED.peach, variant: "shrine", propCluster: "flags" },
  { id: "filler-06", latitude: 10, longitude: -60, height: 0.26, color: PANTONE_INSPIRED.cloud, variant: "tower", propCluster: "clouds" },
  { id: "filler-07", latitude: -50, longitude: -60, height: 0.24, color: PANTONE_INSPIRED.mochaSoft, variant: "stack" },
  { id: "filler-08", latitude: 12, longitude: 84, height: 0.3, color: PANTONE_INSPIRED.peach, variant: "spire", propCluster: "flags" },
  { id: "filler-09", latitude: 30, longitude: 40, height: 0.26, color: PANTONE_INSPIRED.cloudWarm, variant: "tower" },
  { id: "filler-10", latitude: -12, longitude: -82, height: 0.32, color: PANTONE_INSPIRED.mocha, variant: "shrine", propCluster: "lamps" },
  { id: "filler-11", latitude: -6, longitude: -136, height: 0.25, color: PANTONE_INSPIRED.peachSoft, variant: "spire" },
  { id: "filler-12", latitude: 20, longitude: -160, height: 0.36, color: PANTONE_INSPIRED.mochaDeep, variant: "tower", propCluster: "clouds" },
  { id: "filler-13", latitude: -38, longitude: -28, height: 0.28, color: PANTONE_INSPIRED.cloud, variant: "stack" },
  { id: "filler-14", latitude: -30, longitude: 156, height: 0.34, color: PANTONE_INSPIRED.peachDeep, variant: "shrine", propCluster: "flags" },
  { id: "filler-15", latitude: -58, longitude: -116, height: 0.3, color: PANTONE_INSPIRED.mocha, variant: "tower" },
  { id: "filler-16", latitude: -54, longitude: 20, height: 0.26, color: PANTONE_INSPIRED.cloudWarm, variant: "spire", propCluster: "clouds" },
  { id: "filler-17", latitude: -64, longitude: -176, height: 0.34, color: PANTONE_INSPIRED.peach, variant: "stack", propCluster: "lamps" },
  { id: "filler-18", latitude: 44, longitude: 134, height: 0.24, color: PANTONE_INSPIRED.mochaSoft, variant: "shrine" },
];
