import { LANDMARKS, type PortfolioQuarter } from "../../../world/landmarkData";
import type { QuarterPathDefinition } from "../../../types/worldContracts";

const ROUTES: Record<PortfolioQuarter, readonly string[]> = {
  experience: ["kazam", "thermal-super-resolution", "naxxatra"],
  "ai-projects": ["rajneeti", "vakyasaar", "persona-architect"],
  creative: ["solar-decathlon", "deep-learning-challenge", "surc", "personal"],
  contact: ["home", "skills", "contact"],
};

const BY_ID = new Map(LANDMARKS.map((landmark) => [landmark.id, landmark]));

export const QUARTER_PATHS: QuarterPathDefinition[] = Object.entries(ROUTES).map(
  ([quarter, ids]) => ({
    id: quarter + "-path",
    quarter: quarter as PortfolioQuarter,
    points: ids.map((id) => {
      const landmark = BY_ID.get(id as (typeof LANDMARKS)[number]["id"]);
      if (!landmark) throw new Error("Unknown landmark in fantasy route: " + id);
      return [landmark.latitude, landmark.longitude] as const;
    }),
  }),
);
