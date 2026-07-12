import type { PortfolioContent } from "./portfolioTypes";

export const ACHIEVEMENT_CONTENT = [
  {
    id: "solar-decathlon",
    title: "Solar Decathlon India",
    district: "achievements",
    contentType: "achievement",
    status: "National Runner-Up",
    dateRange: "2024 - 2025",
    summary:
      "A national sustainable infrastructure challenge focused on residential cooling retrofit.",
    techStack: ["Sustainable design", "Data-driven infrastructure", "Cooling retrofit"],
    metrics: ["2nd place", "150+ institutions", "Rs. 1.5 lakh prize"],
    highlights: [
      "Secured national runner-up in the Residential Cooling Retrofit Challenge.",
      "Designed a sustainable, data-driven infrastructure solution.",
      "Finalist presentation was invited to the Infosys Mysore campus.",
    ],
  },
  {
    id: "deep-learning-challenge",
    title: "Deep Learning Innovation Challenge",
    district: "achievements",
    contentType: "achievement",
    status: "1st Place Winner",
    summary:
      "Top honors for VakyaSaar, a custom Seq2Seq text summarization system.",
    techStack: ["Seq2Seq", "NLP", "Model deployment", "Evaluation"],
    metrics: ["1st place", "Inclass 10k"],
    highlights: [
      "Recognized for model architecture and domain-specific NLP pipeline design.",
      "Awarded for a successful custom summarization model and deployment path.",
    ],
  },
  {
    id: "surc",
    title: "SURC 2025",
    district: "achievements",
    contentType: "achievement",
    status: "Research Presenter",
    dateRange: "2025",
    summary:
      "Selected to present original undergraduate research at Azim Premji University.",
    techStack: ["Research communication", "Technical presentation", "AI methodology"],
    metrics: ["Selected presenter"],
    highlights: [
      "Presented complex technical methodology to a diverse academic audience.",
      "Demonstrated research communication and structured technical storytelling.",
    ],
  },
] as const satisfies readonly PortfolioContent[];
