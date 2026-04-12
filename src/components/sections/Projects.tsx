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

function createIncomingProject(slug: string, year: string): ProjectEntry {
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
    title: "Qwen-Phi Distillation",
    description:
      "A compact Phi-2 model distilled from Qwen2.5 teacher models for Python code generation and step-by-step math reasoning.",
    tags: ["Distillation", "Phi-2", "Qwen2.5", "Math", "Code"],
    slug: "qwen-phi-distillation",
    year: "2026",
    category: "LLM / Distillation",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=720&fit=crop",
    buildScope: [
      "Distilled math and coding capability from Qwen2.5 teacher models into a compact Phi-2 checkpoint.",
      "Fine-tuned on mixed instruction data from GSM8K, MATH, and MBPP-style coding tasks.",
      "Optimized for instruction-to-output format that can return both code and reasoning traces.",
      "Packaged for practical inference through Hugging Face Transformers pipeline workflows.",
    ],
    outcomes: [
      "Shows a practical distillation path from larger teachers to a smaller deployable model.",
      "Balances two task families in one model: Python function generation and math word-problem solving.",
      "Publishes a reproducible model card with training mix, limitations, and usage examples.",
    ],
    stackCards: [
      { index: "01", meta: "Base model", title: "microsoft/phi-2" },
      { index: "02", meta: "Teacher", title: "Qwen2.5-Coder-7B" },
      { index: "03", meta: "Teacher", title: "Qwen2.5-Math-7B" },
      { index: "04", meta: "Training", title: "LoRA + SFTTrainer" },
      { index: "05", meta: "Datasets", title: "GSM8K / MATH / MBPP" },
      { index: "06", meta: "Hub", title: "Hugging Face Model Card" },
    ],
    isIncoming: false,
  },
  createIncomingProject("image-classifier", "2026"),
  createIncomingProject("recommender-system", "2026"),
];

export default function Projects() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const detailIndex = hoveredIndex;
  const activeProject = detailIndex !== null ? projects[detailIndex] : null;
  const previewProject =
    projects.find((project) => project.slug === previewSlug) ?? projects[selectedIndex];
  const isPreviewOpen = previewSlug !== null;

  const handleOpenPreview = (index: number) => {
    setSelectedIndex(index);
    setHoveredIndex(index);
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
              <SectionHeadline text="Problems I've Solved" className={styles.title} />
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
                  className={`${styles.projectItem} ${index === hoveredIndex ? styles.projectItemActive : ""}`}
                >
                  <button
                    type="button"
                    className={`${styles.projectTrigger} ${index === hoveredIndex ? styles.projectTriggerActive : ""}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocus={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onBlur={() => setHoveredIndex(null)}
                    onClick={() => handleOpenPreview(index)}
                    aria-haspopup="dialog"
                    aria-expanded={previewSlug === project.slug}
                    suppressHydrationWarning
                  >
                    <span className={styles.projectNumber}>
                      _ {String(index + 1).padStart(2, "0")} .
                    </span>
                    <span
                      className={`${styles.projectTitleRow} ${project.isIncoming ? styles.projectTitleRowIncoming : ""}`}
                    >
                      {project.isIncoming ? (
                        <span className={styles.warningCenter} aria-hidden="true">
                          <span className={styles.warningBadge}>⚠</span>
                        </span>
                      ) : null}
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
                {activeProject ? null : (
                  <div className={styles.detailEmpty}>
                    <p className={styles.detailEmptyTitle}>Hover a project to preview</p>
                    <p className={styles.detailEmptyText}>
                      Move your cursor over any row on the left to inspect the project snapshot.
                    </p>
                  </div>
                )}
                {projects.map((project, index) => (
                  <Image
                    key={project.slug}
                    src={project.image}
                    alt={index === detailIndex ? project.title : ""}
                    width={900}
                    height={720}
                    className={`${styles.detailImage} ${index === detailIndex ? styles.detailImageActive : ""}`}
                    aria-hidden={index !== detailIndex}
                    unoptimized
                  />
                ))}
              </div>
              <div className={styles.detailMeta}>
                {activeProject ? (
                  <>
                    <p className={styles.detailYear}>{activeProject.year}</p>
                    <h3 className={styles.detailTitle}>{activeProject.title}</h3>
                    <p className={styles.detailDescription}>{activeProject.description}</p>
                    {activeProject.isIncoming ? (
                      <span className={styles.detailLinkMuted}>⚠ More incoming</span>
                    ) : (
                      <Link href={`/projects/${activeProject.slug}`} className={styles.detailLink}>
                        Open case study
                      </Link>
                    )}
                  </>
                ) : null}
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
