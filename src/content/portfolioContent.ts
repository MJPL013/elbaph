import { ACHIEVEMENT_CONTENT } from "./portfolioAchievements";
import { CORE_CONTENT } from "./portfolioCore";
import { EXPERIENCE_CONTENT } from "./portfolioExperience";
import { PROJECT_CONTENT } from "./portfolioProjects";
import type { PortfolioContent } from "./portfolioTypes";

export type {
  PortfolioContent,
  PortfolioContentType,
  PortfolioDistrict,
  PortfolioLink,
} from "./portfolioTypes";
export { DISTRICT_LABELS } from "./portfolioTypes";

export const PORTFOLIO_CONTENT: readonly PortfolioContent[] = [
  ...CORE_CONTENT,
  ...EXPERIENCE_CONTENT,
  ...PROJECT_CONTENT,
  ...ACHIEVEMENT_CONTENT,
];

export type PortfolioContentId = (typeof PORTFOLIO_CONTENT)[number]["id"];

export function getPortfolioContent(id: string | null): PortfolioContent | null {
  if (!id) return null;
  return PORTFOLIO_CONTENT.find((content) => content.id === id) ?? null;
}
