"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeadline from "@/components/ui/SectionHeadline";
import SectionSubheadline from "@/components/ui/SectionSubheadline";
import QuickPreviewDialog from "@/components/ui/QuickPreviewDialog";
import styles from "./Projects.module.css";

type ProjectEntry = {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  year: string;
  category: string;
  image: string;
  buildScope: string[];
  outcomes: string[];
  stackCards: Array<{ index: string; meta: string; title: string }>;
  isIncoming: boolean;
};

const incomingImage =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&h=720&fit=crop";

function createIncomingProject(
  slug: string,
  year: string,
): ProjectEntry {
  return {
    title: "More Incoming",
    description:
      "⚠ This slot is intentionally reserved for the next case study. A deeper build update will be published here soon.",
    tags: ["Incoming", "In Progress", "Roadmap"],
    slug,
    year,
    category: "Archive Slot",
    image: incomingImage,
    buildScope: [
      "Define the production problem and measurable success criteria before publishing.",
      "Document architecture and delivery choices once implementation reaches a stable milestone.",
      "Prepare reproducible evidence: stack decisions, constraints, and tradeoffs.",
      "Ship a complete write-up when the build is strong enough to review publicly.",
    ],
    outcomes: [
      "Keeps the archive honest by showing progress without inflating unfinished work.",
      "Signals upcoming case studies while preserving quality standards for published projects.",
      "Makes room for stronger documentation instead of lightweight placeholder claims.",
    ],
    stackCards: [
      { index: "01", meta: "Status", title: "⚠ More Incoming" },
      { index: "02", meta: "Stage", title: "Research" },
      { index: "03", meta: "Stage", title: "Build" },
      { index: "04", meta: "Stage", title: "Validation" },
      { index: "05", meta: "Stage", title: "Documentation" },
      { index: "06", meta: "Release", title: "Case study pending" },
    ],
    isIncoming: true,
  };
}

const projects: ProjectEntry[] = [
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
    isIncoming: false,
  },
  createIncomingProject("image-classifier", "2026"),
  createIncomingProject("recommender-system", "2026"),
];

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
            <div className={styles.copy}>
              <div className={styles.kickerRow}>
                <span className={styles.kickerIcon} aria-hidden="true">
                  *
                </span>
                <p className={styles.kicker}>Selected projects</p>
              </div>
              <SectionHeadline
                text="Problems I've Solved"
                className={styles.title}
              />
              <SectionSubheadline
                text="A look into how I connect models, data pipelines, and user interfaces. Each project here is a case study in solving a specific technical challenge with a production-first mindset."
                className={styles.text}
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
                      <span className={styles.projectTitle}>
                        {project.isIncoming ? (
                          <span className={styles.incomingTitle}>
                            More Incoming
                            <span className={styles.incomingDots} aria-hidden="true">
                              ...
                            </span>
                          </span>
                        ) : (
                          project.title
                        )}
                      </span>
                      {project.isIncoming ? (
                        <span className={styles.warningBadge}>⚠</span>
                      ) : null}
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
                {activeProject.isIncoming ? (
                  <span className={styles.detailLinkMuted}>
                    ⚠ More incoming
                  </span>
                ) : (
                  <Link
                    href={`/projects/${activeProject.slug}`}
                    className={styles.detailLink}
                  >
                    Open case study
                  </Link>
                )}
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
