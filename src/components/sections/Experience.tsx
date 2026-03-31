"use client";

import { useState } from "react";
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

export default function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Experience</p>
            <h2 className={styles.title}>Where technical work became delivery.</h2>
            <p className={styles.text}>
              I care about the part between &ldquo;it works&rdquo; and
              &ldquo;it ships.&rdquo; These roles shaped how I think about
              product clarity, implementation quality, and the real constraints
              around building with AI.
            </p>
          </div>

          <div className={styles.timeline}>
            {experiences.map((experience, index) => (
              <article
                key={`${experience.company}-${experience.period}`}
                className={styles.item}
                data-open={openIndex === index}
              >
                <span className={styles.itemNumber}>
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <div className={styles.itemColumn}>
                  <button
                    type="button"
                    className={styles.itemTrigger}
                    aria-expanded={openIndex === index}
                    aria-controls={`experience-panel-${index}`}
                    onClick={() =>
                      setOpenIndex((currentIndex) =>
                        currentIndex === index ? null : index,
                      )
                    }
                  >
                    <div className={styles.itemHeading}>
                      <div className={styles.roleLine}>
                        <h3 className={styles.role}>{experience.role}</h3>
                        <span className={styles.company}>@ {experience.company}</span>
                      </div>
                      <span className={styles.period}>{experience.period}</span>
                    </div>

                    <span className={styles.chevron} aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="none" focusable="false">
                        <path
                          d="M5 7.5 10 12.5 15 7.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.4"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={`experience-panel-${index}`}
                    className={styles.details}
                    data-open={openIndex === index}
                  >
                    <div className={styles.detailsInner}>
                      <p className={styles.summary}>{experience.summary}</p>
                      <ul className={styles.highlights}>
                        {experience.highlights.map((highlight) => (
                          <li key={highlight} className={styles.highlightItem}>
                            <span className={styles.highlightBullet} aria-hidden="true" />
                            <span>{highlight}</span>
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
