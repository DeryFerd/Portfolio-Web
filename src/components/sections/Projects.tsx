"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeadline from "@/components/ui/SectionHeadline";
import QuickPreviewDialog from "@/components/ui/QuickPreviewDialog";
import styles from "./Projects.module.css";

const projects = [
  {
    title: "AI Chatbot",
    description:
      "A conversational AI built for support automation with context-aware responses and production-minded delivery.",
    tags: ["NLP", "GPT", "FastAPI", "React", "PostgreSQL"],
    slug: "ai-chatbot",
    year: "2026",
    category: "AI / Product Systems",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=720&fit=crop",
    buildScope: [
      "Conversation orchestration for support requests, routing simple questions instantly before human escalation.",
      "Context-aware retrieval so the assistant can answer from prior tickets, product notes, and user history.",
      "Backend service layer built for production use, including API handling, session state, and persistence.",
      "A lightweight operator-facing interface for testing prompts, reviewing outputs, and shipping updates quickly.",
    ],
    outcomes: [
      "Turns the project from a model demo into a support workflow that can actually shorten response time.",
      "Shows how language models, backend engineering, and interface delivery can move together as one product.",
      "Makes the AI legible to non-technical stakeholders because the interaction, feedback, and fallback paths are explicit.",
    ],
    stackCards: [
      { index: "01", meta: "LLM", title: "GPT" },
      { index: "02", meta: "Service", title: "FastAPI" },
      { index: "03", meta: "Interface", title: "React" },
      { index: "04", meta: "Data", title: "PostgreSQL" },
      { index: "05", meta: "Ops", title: "Prompt eval loops" },
      { index: "06", meta: "Delivery", title: "Support automation" },
    ],
  },
  {
    title: "Image Classifier",
    description:
      "A deep learning workflow for image classification using CNN-based architecture and fast inference-ready outputs.",
    tags: ["Computer Vision", "PyTorch", "ResNet", "Inference"],
    slug: "image-classifier",
    year: "2025",
    category: "Computer Vision",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&h=720&fit=crop",
    buildScope: [
      "Dataset preparation, augmentation, and training loops designed to keep the model stable across classes.",
      "CNN-based experimentation around accuracy, inference speed, and export readiness for downstream use.",
      "Inference packaging so uploaded images can be turned into clear predictions instead of raw logits.",
      "Evaluation views that make confidence, error cases, and class balance easier to explain.",
    ],
    outcomes: [
      "Creates a more useful computer vision showcase than a notebook because prediction and interface are shipped together.",
      "Demonstrates the translation from model experimentation into an input-output experience that people can actually try.",
      "Keeps the system readable by pairing performance work with visible inference behavior.",
    ],
    stackCards: [
      { index: "01", meta: "Model", title: "ResNet" },
      { index: "02", meta: "Training", title: "PyTorch" },
      { index: "03", meta: "Data", title: "Augmentation" },
      { index: "04", meta: "Inference", title: "Prediction service" },
      { index: "05", meta: "Interface", title: "Upload workflow" },
      { index: "06", meta: "Review", title: "Confidence outputs" },
    ],
  },
  {
    title: "Recommender System",
    description:
      "A collaborative filtering engine tuned for product discovery, personalization, and real recommendation workflows.",
    tags: ["ML", "Recommendation", "Python", "Personalization"],
    slug: "recommender-system",
    year: "2025",
    category: "Applied Machine Learning",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=720&fit=crop",
    buildScope: [
      "Recommendation logic around collaborative filtering and ranking behavior for product discovery use cases.",
      "Interaction modeling from user history so the engine can move beyond static catalog suggestions.",
      "Evaluation passes around relevance and recommendation quality before exposing anything in the interface.",
      "A delivery flow that makes suggestions readable as a product pattern instead of a notebook metric.",
    ],
    outcomes: [
      "Frames personalization as a workflow problem, not just a matrix factorization exercise.",
      "Makes the recommendation engine easier to evaluate because the experience is tied back to product behavior.",
      "Shows how data, ranking logic, and interface design connect into one decision system.",
    ],
    stackCards: [
      { index: "01", meta: "ML", title: "Collaborative filtering" },
      { index: "02", meta: "Ranking", title: "Recommendation logic" },
      { index: "03", meta: "Data", title: "Interaction history" },
      { index: "04", meta: "Tooling", title: "Python" },
      { index: "05", meta: "Product", title: "Discovery flows" },
      { index: "06", meta: "Signal", title: "Personalization" },
    ],
  },
  {
    title: "Sentiment Analysis",
    description:
      "A real-time sentiment monitor for social data, designed to surface trends and response signals with clarity.",
    tags: ["NLP", "BERT", "Streamlit", "Monitoring"],
    slug: "sentiment-analysis",
    year: "2024",
    category: "Language Intelligence",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=720&fit=crop",
    buildScope: [
      "Streaming-style sentiment classification across social or public text sources to detect tone shifts quickly.",
      "Model integration that keeps the classification layer understandable rather than black-boxed.",
      "Dashboard views that translate sentiment outputs into readable movement, trends, and alerts.",
      "A feedback loop where outputs can be reviewed in context, not only as aggregated scores.",
    ],
    outcomes: [
      "Useful for showing how NLP systems can support monitoring and response, not only offline analysis.",
      "Brings visibility to trend movement so the model output feels operational instead of abstract.",
      "Pairs language modeling with a simple presentation layer that keeps the signal legible.",
    ],
    stackCards: [
      { index: "01", meta: "NLP", title: "BERT" },
      { index: "02", meta: "Interface", title: "Streamlit" },
      { index: "03", meta: "Signal", title: "Sentiment scoring" },
      { index: "04", meta: "Monitoring", title: "Trend views" },
      { index: "05", meta: "Input", title: "Social text" },
      { index: "06", meta: "Delivery", title: "Real-time feedback" },
    ],
  },
  {
    title: "Object Detection",
    description:
      "A YOLO-based detection pipeline oriented around real-world imagery, monitoring, and applied computer vision.",
    tags: ["Computer Vision", "YOLO", "OpenCV", "Detection"],
    slug: "object-detection",
    year: "2024",
    category: "Computer Vision",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&h=720&fit=crop",
    buildScope: [
      "Real-world detection flow for multiple objects across image frames rather than synthetic toy examples.",
      "Bounding-box generation and class labeling with a pipeline designed for readable monitoring outputs.",
      "Inference handling built around speed, practical imagery, and visual review of results.",
      "A delivery layer that turns object detection into a usable interface instead of a terminal-only run.",
    ],
    outcomes: [
      "Shows the step from model output into monitoring-ready visualization, which is where many vision demos stop.",
      "Keeps the result practical by focusing on image review, detection clarity, and inference responsiveness.",
      "Connects model performance with a presentation format that makes outcomes inspectable.",
    ],
    stackCards: [
      { index: "01", meta: "Model", title: "YOLO" },
      { index: "02", meta: "Vision", title: "OpenCV" },
      { index: "03", meta: "Output", title: "Bounding boxes" },
      { index: "04", meta: "Inference", title: "Frame processing" },
      { index: "05", meta: "Review", title: "Visual detection QA" },
      { index: "06", meta: "Use case", title: "Applied monitoring" },
    ],
  },
  {
    title: "Time Series Forecasting",
    description:
      "An LSTM forecasting setup for financial signals, with a focus on model behavior, trend reading, and deployment readiness.",
    tags: ["Deep Learning", "LSTM", "Finance", "Forecasting"],
    slug: "time-series",
    year: "2024",
    category: "Forecasting Systems",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=720&fit=crop",
    buildScope: [
      "Sequence modeling for financial-style signals with attention to trend windows and data preparation.",
      "LSTM experimentation around stability, drift, and readable output behavior across time windows.",
      "Forecast views that make projection behavior easier to inspect instead of burying it in metrics.",
      "A setup designed to bridge research iteration and deployment-minded presentation.",
    ],
    outcomes: [
      "Useful as a forecasting case study because it surfaces model behavior, not just future values.",
      "Makes sequence prediction more legible by pairing charts, context, and trend interpretation together.",
      "Shows how analytical modeling can be delivered in a way that feels closer to a usable tool.",
    ],
    stackCards: [
      { index: "01", meta: "Model", title: "LSTM" },
      { index: "02", meta: "Data", title: "Time windows" },
      { index: "03", meta: "Domain", title: "Finance" },
      { index: "04", meta: "Evaluation", title: "Trend reading" },
      { index: "05", meta: "Interface", title: "Forecast charts" },
      { index: "06", meta: "Delivery", title: "Deployment readiness" },
    ],
  },
] as const;

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const activeProject = projects[activeIndex];
  const previewProject =
    projects.find((project) => project.slug === previewSlug) ?? activeProject;
  const isPreviewOpen = previewSlug !== null;

  const handleOpenPreview = (index: number) => {
    setActiveIndex(index);
    setPreviewSlug(projects[index]?.slug ?? null);
  };

  return (
    <>
      <section className={`section ${styles.projects}`} id="projects">
        <div className="container">
          <div className={styles.header}>
            <div>
              <div className={styles.kickerRow}>
                <span className={styles.kickerIcon} aria-hidden="true">
                  *
                </span>
                <p className={styles.kicker}>Selected projects</p>
              </div>
              <SectionHeadline
                text="Work presented with more signal than noise."
                className={styles.title}
              />
            </div>
            <Link href="/projects" className={styles.archiveLink}>
              View archive
            </Link>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.projectList}>
              {projects.map((project, index) => (
                <article
                  key={project.slug}
                  className={`${styles.projectItem} ${index === activeIndex ? styles.projectItemActive : ""}`}
                >
                  <button
                    type="button"
                    className={`${styles.projectTrigger} ${index === activeIndex ? styles.projectTriggerActive : ""}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => handleOpenPreview(index)}
                    aria-haspopup="dialog"
                    aria-expanded={previewSlug === project.slug}
                    suppressHydrationWarning
                  >
                    <span className={styles.projectNumber}>
                      _ {String(index + 1).padStart(2, "0")} .
                    </span>
                    <span className={styles.projectTitleRow}>
                      <span className={styles.projectTitle}>{project.title}</span>
                      <span className={styles.projectArrow} aria-hidden="true">
                        -&gt;
                      </span>
                    </span>
                    <span className={styles.projectStack}>
                      {project.tags.slice(0, 3).join(" / ")}
                    </span>
                  </button>
                </article>
              ))}
            </div>

            <aside className={styles.detailPanel}>
              <div className={styles.detailStage}>
                {projects.map((project, index) => (
                  <Image
                    key={project.slug}
                    src={project.image}
                    alt={index === activeIndex ? project.title : ""}
                    width={900}
                    height={720}
                    className={`${styles.detailImage} ${index === activeIndex ? styles.detailImageActive : ""}`}
                    aria-hidden={index !== activeIndex}
                    unoptimized
                  />
                ))}
              </div>
              <div className={styles.detailMeta}>
                <p className={styles.detailYear}>{activeProject.year}</p>
                <h3 className={styles.detailTitle}>{activeProject.title}</h3>
                <p className={styles.detailDescription}>
                  {activeProject.description}
                </p>
                <Link
                  href={`/projects/${activeProject.slug}`}
                  className={styles.detailLink}
                >
                  Open case study
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <QuickPreviewDialog
        open={isPreviewOpen}
        onClose={() => setPreviewSlug(null)}
        modalLabel={`${previewProject.title} project preview`}
        category={previewProject.category}
        year={previewProject.year}
        kindLabel="Case study"
        title={previewProject.title}
        summary={previewProject.description}
        image={previewProject.image}
        tags={previewProject.tags}
        primaryAction={{
          href: `/projects/${previewProject.slug}`,
          label: "Open case study",
        }}
        secondaryAction={{
          href: "/projects",
          label: "View archive",
        }}
        sections={[
          {
            eyebrow: "Core architecture",
            title: "What the build covers",
            items: previewProject.buildScope,
            variant: "list",
          },
          {
            eyebrow: "Outcome",
            title: "Why it matters",
            items: previewProject.outcomes,
            variant: "paragraphs",
          },
        ]}
        cardSection={{
          eyebrow: "Stack",
          title: "Tools that hold the build together.",
          description:
            "A delivery stack shaped across model work, service logic, and the interface where the system becomes usable.",
          cards: previewProject.stackCards,
        }}
      />
    </>
  );
}
