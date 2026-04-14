import { posts } from "@/lib/blogData";
import { CONTACT_EMAIL } from "@/lib/contactConfig";

export interface AssistantLink {
  href: string;
  label: string;
}

export interface AssistantReply {
  text: string;
  links?: AssistantLink[];
}

interface ProjectKnowledge {
  title: string;
  slug: string;
  year: string;
  description: string;
  tags: string[];
  detail: string;
}

interface ExperienceKnowledge {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
}

interface RoleKnowledge {
  label: string;
  summary: string;
  focus: string[];
}

const aboutSummary =
  "Dery Ferdika is an AI Engineer based in Malang, Indonesia, focused on LLM systems, agent workflows, machine learning products, and production-minded AI delivery.";

const projects: ProjectKnowledge[] = [
  {
    title: "Qwen-Phi Distillation",
    slug: "qwen-phi-distillation",
    year: "2026",
    description:
      "A compact Phi-2 distillation project tuned for Python code generation and step-by-step math reasoning.",
    tags: ["Distillation", "Phi-2", "Qwen2.5"],
    detail:
      "This project distills Qwen2.5 teacher capability into a smaller Phi-2 checkpoint and publishes the full training intent through a public Hugging Face model card.",
  },
  {
    title: "Image Classifier",
    slug: "image-classifier",
    year: "2025",
    description:
      "A deep learning workflow for image classification using CNN-based architecture and fast inference-ready outputs.",
    tags: ["Computer Vision", "PyTorch", "ResNet"],
    detail:
      "It focuses on computer vision and inference-ready classification using a CNN-oriented pipeline and deployment-friendly outputs.",
  },
  {
    title: "Recommender System",
    slug: "recommender-system",
    year: "2025",
    description:
      "A collaborative filtering engine tuned for product discovery, personalization, and real recommendation workflows.",
    tags: ["ML", "Recommendation", "Python"],
    detail:
      "This is the portfolio's recommendation workflow story: collaborative filtering, product discovery, and practical personalization logic.",
  },
  {
    title: "Sentiment Analysis",
    slug: "sentiment-analysis",
    year: "2024",
    description:
      "A real-time sentiment monitor for social data, designed to surface trends and response signals with clarity.",
    tags: ["NLP", "BERT", "Streamlit"],
    detail:
      "It is an NLP-driven monitor for sentiment signals, meant to surface trend shifts clearly rather than just classify text in isolation.",
  },
  {
    title: "Object Detection",
    slug: "object-detection",
    year: "2024",
    description:
      "A YOLO-based detection pipeline oriented around real-world imagery, monitoring, and applied computer vision.",
    tags: ["Computer Vision", "YOLO", "OpenCV"],
    detail:
      "This work leans into applied computer vision using a YOLO-style detection pipeline for real-world imagery and monitoring use cases.",
  },
  {
    title: "Time Series Forecasting",
    slug: "time-series",
    year: "2024",
    description:
      "An LSTM forecasting setup for financial signals, with a focus on model behavior, trend reading, and deployment readiness.",
    tags: ["Deep Learning", "LSTM", "Finance"],
    detail:
      "This project explores financial forecasting with LSTM, focusing on trend behavior, model reading, and deployment-minded experimentation.",
  },
];

const experience: ExperienceKnowledge[] = [
  {
    role: "AI Engineer",
    company: "Tech Company",
    period: "2024 - Present",
    summary:
      "Building production ML features with emphasis on NLP workflows and computer vision delivery.",
    highlights: [
      "Moved ML work from experimentation into production-facing features.",
      "Balanced model behavior with product constraints, runtime, and delivery quality.",
    ],
  },
  {
    role: "LLM DevOps",
    company: "Cloud Corp",
    period: "2024 - Present",
    summary:
      "Owning the path between model experimentation, reliable serving, and operational stability.",
    highlights: [
      "Maintained deployment and operational flows for LLM systems.",
      "Focused on rollout hygiene, serving reliability, and live-system calmness.",
    ],
  },
  {
    role: "Machine Learning Intern",
    company: "Startup Inc",
    period: "2023 - 2024",
    summary:
      "Supporting experimentation-heavy product work across recommendations, pipelines, and early LLM use cases.",
    highlights: [
      "Contributed to recommendation workflows and pipeline support.",
      "Helped turn early model ideas into something easier to evaluate and shape.",
    ],
  },
  {
    role: "Data Engineer",
    company: "Data Solutions",
    period: "2023",
    summary:
      "Designing ETL and warehousing flows for analytics-heavy systems and streaming workloads.",
    highlights: [
      "Built ETL pipelines and downstream reporting flows.",
      "Improved data reliability for both operations and analytics use cases.",
    ],
  },
];

const stackRoles: RoleKnowledge[] = [
  {
    label: "Data Engineer",
    summary:
      "Builds ingestion, ETL, warehousing, and the dependable movement of data before anything becomes intelligence.",
    focus: ["ETL", "Warehousing", "Reliability"],
  },
  {
    label: "Data Science",
    summary:
      "Explores signal, frames experiments, and turns raw information into directions worth engineering around.",
    focus: ["EDA", "Feature work", "Evaluation"],
  },
  {
    label: "ML Engineer",
    summary:
      "Turns model work into training, inference, and serving systems that can survive real product constraints.",
    focus: ["Training", "Inference", "Serving"],
  },
  {
    label: "LLM Engineer",
    summary:
      "Treats LLM work as system design through prompting, retrieval, and evaluation loops that stay grounded.",
    focus: ["Prompts", "Retrieval", "Eval loops"],
  },
  {
    label: "AI Engineer",
    summary:
      "Connects models to user-facing workflows, agents, and product experiences that feel coherent in daily use.",
    focus: ["Agents", "Product UX", "Workflows"],
  },
  {
    label: "MLOps",
    summary:
      "Covers deployment, observability, and repeatable release paths that keep model systems dependable after launch.",
    focus: ["Deployments", "Observability", "CI/CD"],
  },
];

export const assistantQuickPrompts = [
  "Who is Dery?",
  "What projects should I open first?",
  "What does the core stack look like?",
  "How can I contact Dery?",
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function includesAny(query: string, keywords: string[]) {
  return keywords.some((keyword) => query.includes(keyword));
}

function findProject(query: string) {
  const normalizedQuery = normalize(query);
  let bestMatch: ProjectKnowledge | null = null;
  let bestScore = 0;

  for (const project of projects) {
    const searchableTerms = [project.title, project.slug.replace(/-/g, " "), ...project.tags];
    let score = 0;

    for (const term of searchableTerms) {
      const normalizedTerm = normalize(term);
      if (normalizedQuery.includes(normalizedTerm)) {
        score += normalizedTerm.includes(" ") ? 4 : 2;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = project;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

function findExperience(query: string) {
  const normalizedQuery = normalize(query);

  return (
    experience.find((item) =>
      [item.role, item.company, ...item.highlights].some((value) =>
        normalizedQuery.includes(normalize(value)),
      ),
    ) ?? null
  );
}

function findRole(query: string) {
  const normalizedQuery = normalize(query);
  return stackRoles.find((role) => normalizedQuery.includes(normalize(role.label))) ?? null;
}

function buildProjectReply(project: ProjectKnowledge): AssistantReply {
  return {
    text: `${project.title} (${project.year}) is one of the highlighted portfolio pieces. ${project.detail} The stack signal shown on the site is ${project.tags.join(", ")}.`,
    links: [
      { label: "Open case study", href: `/projects/${project.slug}` },
      { label: "View all projects", href: "/projects" },
    ],
  };
}

function buildExperienceReply(item: ExperienceKnowledge): AssistantReply {
  return {
    text: `${item.role} @ ${item.company} (${item.period}) is presented as a delivery-focused chapter. ${item.summary} Key signals: ${item.highlights.join(" ")}`,
    links: [{ label: "Jump to experience", href: "/#experience" }],
  };
}

function buildRoleReply(role: RoleKnowledge): AssistantReply {
  return {
    text: `${role.label} is one chapter of the Core Stack book. ${role.summary} The main focus areas shown there are ${role.focus.join(", ")}.`,
    links: [{ label: "Open core stack", href: "/#skills" }],
  };
}

export function buildAssistantReply(input: string): AssistantReply {
  const query = normalize(input);
  const projectMatch = findProject(query);
  const experienceMatch = findExperience(query);
  const roleMatch = findRole(query);

  if (!query) {
    return {
      text: "Ask me about Dery's background, projects, stack, experience, writing, or contact details and I'll point you to the right part of the portfolio.",
    };
  }

  if (includesAny(query, ["hello", "hi", "hey", "yo"])) {
    return {
      text: `Hi, I'm the on-site portfolio guide. ${aboutSummary} You can ask about projects, stack, experience, writing, or the best way to contact Dery.`,
      links: [{ label: "Jump to about", href: "/#about" }],
    };
  }

  if (includesAny(query, ["contact", "email", "hire", "reach", "talk", "collab", "collaboration"])) {
    return {
      text: `The best direct contact on the site is ${CONTACT_EMAIL}. Dery is based in Malang, Indonesia and is open to selected AI projects, internal tools, and product-facing collaborations.`,
      links: [
        { label: "Open contact section", href: "/#contact" },
        { label: "Email Dery", href: `mailto:${CONTACT_EMAIL}` },
      ],
    };
  }

  if (includesAny(query, ["about", "who is", "background", "dery", "profile", "location", "based"])) {
    return {
      text: `${aboutSummary} The profile card also highlights a clarity-first working style and an operational focus on product-facing AI systems.`,
      links: [
        { label: "Open about section", href: "/#about" },
        { label: "Read full background", href: "/about" },
      ],
    };
  }

  if (projectMatch) {
    return buildProjectReply(projectMatch);
  }

  if (includesAny(query, ["project", "projects", "work", "case study", "portfolio"])) {
    return {
      text: `The current highlighted project set spans ${projects.map((project) => project.title).join(", ")}. If you want a strong starting point, begin with Qwen-Phi Distillation for LLM distillation, Image Classifier for computer vision, and Recommender System for applied ML.`,
      links: [
        { label: "View project archive", href: "/projects" },
        { label: "Jump to selected work", href: "/#projects" },
      ],
    };
  }

  if (experienceMatch) {
    return buildExperienceReply(experienceMatch);
  }

  if (includesAny(query, ["experience", "career", "roles", "work history", "delivery"])) {
    return {
      text: `The experience section currently walks through ${experience.map((item) => `${item.role} @ ${item.company}`).join(", ")}. The shared theme is moving from experimentation into something that can ship cleanly in the real world.`,
      links: [{ label: "Open experience", href: "/#experience" }],
    };
  }

  if (roleMatch) {
    return buildRoleReply(roleMatch);
  }

  if (includesAny(query, ["skill", "skills", "stack", "core stack", "tools", "tech", "mlops", "llm", "data engineer", "ai engineer"])) {
    return {
      text: `The Core Stack area is organized as a book with six working chapters: ${stackRoles.map((role) => role.label).join(", ")}. It groups Dery's stack around roles rather than around a random badge wall.`,
      links: [{ label: "Open core stack", href: "/#skills" }],
    };
  }

  if (includesAny(query, ["blog", "journal", "writing", "article", "post"])) {
    return {
      text: `The Journal currently features ${posts.map((post) => post.title).join(", ")}. The writing leans toward practical machine learning, LLMs, and deployment-minded engineering.`,
      links: [
        { label: "Open journal", href: "/#blog" },
        { label: "View all posts", href: "/blog" },
      ],
    };
  }

  if (includesAny(query, ["github", "proof", "activity", "repos"])) {
    return {
      text: "There is a GitHub proof section that surfaces public repos, contribution totals, active days, and recent repository activity to show consistency and shipping cadence in public.",
      links: [{ label: "Jump to GitHub proof", href: "/#proof" }],
    };
  }

  return {
    text: `I can help with Dery's background, selected projects, core stack, experience, journal, GitHub proof, and contact details. Try asking something like "${assistantQuickPrompts[1]}" or "${assistantQuickPrompts[3]}".`,
    links: [{ label: "Back to top", href: "/" }],
  };
}
