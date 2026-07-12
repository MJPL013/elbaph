import type { PortfolioContent } from "./portfolioTypes";

export const CORE_CONTENT = [
  {
    id: "home",
    title: "Manoj Pal",
    district: "home",
    contentType: "identity",
    status: "AI Application Developer",
    location: "Bengaluru",
    summary:
      "I build end-to-end AI applications that connect machine learning models with production software.",
    techStack: ["Generative AI", "Agentic workflows", "RAG", "Geospatial ML", "GCP"],
    metrics: ["BTech 8.9 CGPA", "AI + full-stack focus"],
    highlights: [
      "Works across model design, backend architecture, data engineering, and deployment.",
      "Focuses on robust RAG pipelines, custom deep learning models, and real-world AI products.",
      "This planet is designed as an explorable portfolio instead of a static resume page.",
    ],
  },
  {
    id: "skills",
    title: "Skill Atlas",
    district: "skills",
    contentType: "skill",
    status: "Technical toolkit",
    summary:
      "A compact map of the technologies used across my AI and full-stack work.",
    techStack: [
      "Python",
      "SQL",
      "JavaScript",
      "FastAPI",
      "React",
      "PyTorch",
      "TensorFlow",
      "Weaviate",
      "GCP",
    ],
    metrics: ["AI/ML", "GenAI/NLP", "Data engineering", "Cloud/MLOps", "Full-stack"],
    highlights: [
      "AI and ML: CNNs, U-Net, Seq2Seq, RAG, Agentic AI, and LLM systems.",
      "NLP: prompt engineering, Sentence Transformers, Hugging Face, Gemini API, ROUGE, and RAGAS.",
      "Infrastructure: GCP Vertex AI, FastAPI, model deployment, Git, Docker basics, MySQL, Flask, and REST APIs.",
    ],
  },
  {
    id: "personal",
    title: "Personal Quarter",
    district: "personal",
    contentType: "personal",
    status: "Coming later",
    summary:
      "A future space for games, shows, extracurriculars, inspirations, and the parts of me not captured in a resume.",
    techStack: ["Gaming", "Creative tech", "Personal story"],
    metrics: ["Content to be added later"],
    highlights: [
      "This area is intentionally reserved for personal details we will collect later.",
      "It should make the planet feel like a world that represents me, not only my work history.",
    ],
  },
  {
    id: "contact",
    title: "Contact Beacon",
    district: "contact",
    contentType: "contact",
    status: "Open channel",
    location: "Bengaluru",
    summary:
      "The direct route to reach me or inspect my public technical work.",
    techStack: ["Email", "LinkedIn", "GitHub"],
    metrics: ["Available for AI/full-stack opportunities"],
    highlights: [
      "Email: manojpal6723@gmail.com",
      "LinkedIn and GitHub are available as direct actions.",
    ],
    links: [
      { label: "Email", href: "mailto:manojpal6723@gmail.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/manoj-pal-0b18a2271/" },
      { label: "GitHub", href: "https://github.com/MJPL013" },
    ],
  },
] as const satisfies readonly PortfolioContent[];
