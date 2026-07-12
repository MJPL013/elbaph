import type { PortfolioContent } from "./portfolioTypes";

export const PROJECT_CONTENT = [
  {
    id: "rajneeti",
    title: "Rajneeti.help",
    district: "projects",
    contentType: "project",
    status: "Agentic RAG project",
    dateRange: "2024 - 2025",
    summary:
      "A political news analysis system using retrieval, reasoning, and accountability framing.",
    techStack: ["Weaviate", "GCP", "FastAPI", "Sentence Transformers", "PyTorch", "RAGAS"],
    metrics: ["50k+ articles", "~85% semantic recall", "<200 ms query latency"],
    highlights: [
      "Built an agentic RAG pipeline with a four-stage retrieval and reasoning workflow.",
      "Designed an Action vs. Rhetoric framework for contextual political discourse analysis.",
      "Used Gemini API and prompt chaining for multi-step classification and reasoning.",
    ],
  },
  {
    id: "vakyasaar",
    title: "VakyaSaar",
    district: "projects",
    contentType: "project",
    status: "Deep learning NLP project",
    dateRange: "2024 - 2025",
    summary:
      "A custom abstractive summarization model for Indian government press releases.",
    techStack: ["TensorFlow", "Seq2Seq", "BiLSTM", "SentencePiece", "GCP", "Vertex AI"],
    metrics: ["27M parameters", "74K+ PIB releases", "27.0 ROUGE-L F1"],
    highlights: [
      "Built a BiLSTM Seq2Seq model for long-form policy document summarization.",
      "Engineered a domain-specific NLP pipeline with PDFMiner, SentencePiece, and GloVe100d.",
      "Used scheduled sampling, gradient clipping, and custom training loops for stability.",
    ],
  },
  {
    id: "persona-architect",
    title: "Agentic AI Persona Architect",
    district: "projects",
    contentType: "project",
    status: "Multi-agent AI system",
    dateRange: "2024 - 2025",
    summary:
      "A stateful agent workflow that builds Digital Creator Persona Reports.",
    techStack: ["FastAPI", "LangGraph", "GCP", "Pydantic", "Gemini API"],
    metrics: ["40% less redundant processing", "100% schema compliance"],
    highlights: [
      "Implemented routing between full persona builds and incremental updates using short-term memory hits.",
      "Designed calculator and summarizer agents for statistical and cognitive synthesis.",
      "Added Pydantic validation guardrails for reliable LLM-generated report schemas.",
    ],
  },
] as const satisfies readonly PortfolioContent[];
