import type { PortfolioContent } from "./portfolioTypes";

export const EXPERIENCE_CONTENT = [
  {
    id: "kazam",
    title: "Kazam Energy",
    district: "experience",
    contentType: "experience",
    status: "AI Application Development",
    dateRange: "March 2026 - Ongoing",
    location: "Bengaluru",
    summary:
      "AI application and platform work for EV infrastructure operations.",
    techStack: ["RAG", "Agentic AI", "LLM tool-calling", "B2B SaaS", "Image QA"],
    metrics: ["Multi-tenant platform", "Field-photo QA pipeline"],
    highlights: [
      "Designed an agentic AI chatbot using retrieval-augmented generation and tool-calling.",
      "Built LLM-ready data models and backend architecture for a scalable multi-tenant platform.",
      "Engineered an image-based quality assurance pipeline for EV charging station installations.",
    ],
  },
  {
    id: "thermal-super-resolution",
    title: "AI & Decentralized Technologies",
    district: "experience",
    contentType: "experience",
    status: "Machine Learning Intern",
    dateRange: "June 2025 - Aug 2025",
    location: "Bengaluru",
    summary:
      "Deep learning research for thermal super-resolution on land surface temperature data.",
    techStack: ["PyTorch", "U-Net", "NVIDIA A100", "Geospatial ML", "Climate data"],
    metrics: ["9x super-resolution", "~44% error reduction"],
    highlights: [
      "Developed a U-Net model to resolve sub-grid thermal variation in cloud-obstructed regions.",
      "Built a GPU-optimized training pipeline with cloud masking, spatial alignment, and normalization.",
      "Validated deep learning against bicubic interpolation for climate and Urban Heat Island analysis.",
    ],
  },
  {
    id: "naxxatra",
    title: "Naxxatra Sciences",
    district: "experience",
    contentType: "experience",
    status: "Research Assistant and Teaching Fellow",
    dateRange: "June 2024 - Feb 2025",
    location: "Bengaluru",
    summary:
      "Teaching, curriculum, and immersive learning work across data science and XR.",
    techStack: ["Python", "Statistics", "Data Science", "XR", "AR learning"],
    metrics: ["50+ workshop hours", "200+ students"],
    highlights: [
      "Co-developed and delivered UGC-compliant Data Science and XR curricula.",
      "Conducted hands-on workshops covering statistics, Python, data analysis, and immersive tech.",
      "Built an AR-based educational game for space learning with visual and audio explanations.",
    ],
  },
] as const satisfies readonly PortfolioContent[];
