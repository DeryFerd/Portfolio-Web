"use client";

import { useState, useCallback, memo } from "react";
import SectionHeadline from "@/components/ui/SectionHeadline";
import SectionSubheadline from "@/components/ui/SectionSubheadline";
import TypewriterText from "@/components/ui/TypewriterText";
import styles from "./Experience.module.css";

const experiences = [
  {
    company: "Tech Company",
    role: "AI Engineer",
    period: "2024 - Present",
    summary:
      "Building production ML features with emphasis on NLP workflows and computer vision delivery.",
    highlights: [
      "Built and deployed ML models that moved from experimentation into production-facing features.",
      "Shaped NLP workflows and computer vision systems around product constraints, accuracy, and runtime tradeoffs.",
      "Worked across implementation and release decisions so model work stayed usable after launch.",
    ],
    tags: ["NLP", "Computer Vision", "Production ML"],
  },
  {
    company: "Cloud Corp",
    role: "LLM DevOps",
    period: "2024 - Present",
    summary:
      "Owning the path between model experimentation, reliable serving, and operational stability.",
    highlights: [
      "Maintained deployment pipelines and model operations for large language model systems.",
      "Handled the infrastructure needed for serving, monitoring, and iteration across LLM releases.",
      "Focused on rollout hygiene and keeping AI services dependable once they were live.",
    ],
    tags: ["LLM Ops", "Pipelines", "Serving"],
  },
  {
    company: "Startup Inc",
    role: "Machine Learning Intern",
    period: "2023 - 2024",
    summary:
      "Supporting experimentation-heavy product work across recommendations, pipelines, and early LLM use cases.",
    highlights: [
      "Developed recommendation workflows and supported the surrounding data preparation steps.",
      "Contributed to data pipelines that kept experiments reproducible and easier to evaluate.",
      "Explored practical LLM applications with an eye toward fit, feasibility, and product value.",
    ],
    tags: ["Recommendations", "Experimentation", "LLM Prototyping"],
  },
  {
    company: "Data Solutions",
    role: "Data Engineer",
    period: "2023",
    summary:
      "Designing ETL and warehousing flows for analytics-heavy systems and streaming workloads.",
    highlights: [
      "Built ETL pipelines for structured ingestion, transformation, and downstream reporting.",
      "Worked on warehousing patterns that supported streaming and analytics-heavy product needs.",
      "Improved data reliability so teams could use the same pipelines for both operations and insight work.",
    ],
    tags: ["ETL", "Warehousing", "Analytics"],
  },
];

// Chevron icon as separate memoized component
const ChevronIcon = memo(function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" focusable="false" aria-hidden="true">
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
});

// Memoized experience item to prevent re-render
interface ExperienceItemProps {
  experience: typeof experiences[0];
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
}

const ExperienceItem = memo(function ExperienceItem({
  experience,
  index,
  isOpen,
  onToggle,
}: ExperienceItemProps) {
  const handleClick = useCallback(() => {
    onToggle(index);
  }, [index, onToggle]);

  return (
    <article
      key={`${experience.company}-${experience.period}`}
      className={styles.item}
      data-open={isOpen}
    >
      <span className={styles.itemNumber}>
        {(index + 1).toString().padStart(2, "0")}
      </span>

      <div className={styles.itemColumn}>
        <button
          type="button"
          className={styles.itemTrigger}
          aria-expanded={isOpen}
          aria-controls={`experience-panel-${index}`}
          suppressHydrationWarning
          onClick={handleClick}
        >
          <div className={styles.itemHeading}>
            <div className={styles.roleLine}>
              <h3 className={styles.role}>{experience.role}</h3>
              <span className={styles.company}>@ {experience.company}</span>
            </div>
            <span className={styles.period}>{experience.period}</span>
          </div>

          <span className={styles.chevron} aria-hidden="true">
            <ChevronIcon />
          </span>
        </button>

        <div
          id={`experience-panel-${index}`}
          className={styles.details}
          data-open={isOpen}
        >
          <div className={styles.detailsInner}>
            <TypewriterText
              as="p"
              text={experience.summary}
              trigger={isOpen}
              delay={120}
              speed={14}
              className={styles.summary}
            />
            <ul className={styles.highlights}>
              {experience.highlights.map((highlight, highlightIndex) => (
                <li key={highlight} className={styles.highlightItem}>
                  <span className={styles.highlightBullet} aria-hidden="true" />
                  <TypewriterText
                    text={highlight}
                    trigger={isOpen}
                    delay={300 + highlightIndex * 220}
                    speed={12}
                  />
                </li>
              ))}
            </ul>
            <div className={styles.tagRail}>
              {experience.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});

export default function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  }, []);

  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Experience</p>
            <SectionHeadline
              text="Where technical work became delivery."
              className={styles.title}
            />
            <SectionSubheadline
              text='I care about the part between "it works" and "it ships." These roles shaped how I think about product clarity, implementation quality, and the real constraints around building with AI.'
              className={styles.text}
            />
          </div>

          <div className={styles.timeline}>
            {experiences.map((experience, index) => (
              <ExperienceItem
                key={`${experience.company}-${experience.period}`}
                experience={experience}
                index={index}
                isOpen={openIndex === index}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
