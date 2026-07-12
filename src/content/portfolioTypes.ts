export type PortfolioDistrict =
  | "home"
  | "experience"
  | "projects"
  | "achievements"
  | "skills"
  | "personal"
  | "contact";

export type PortfolioContentType =
  | "identity"
  | "experience"
  | "project"
  | "achievement"
  | "skill"
  | "personal"
  | "contact";

export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioContent = {
  id: string;
  title: string;
  district: PortfolioDistrict;
  contentType: PortfolioContentType;
  status: string;
  dateRange?: string;
  location?: string;
  summary: string;
  techStack: string[];
  metrics: string[];
  highlights: string[];
  links?: PortfolioLink[];
};

export const DISTRICT_LABELS: Record<PortfolioDistrict, string> = {
  home: "Home / Spawn",
  experience: "Experience District",
  projects: "Projects District",
  achievements: "Achievements District",
  skills: "Skills District",
  personal: "Personal District",
  contact: "Contact Point",
};
