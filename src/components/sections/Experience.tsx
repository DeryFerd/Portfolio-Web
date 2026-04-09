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
    company: "Home Credit Indonesia (via Rakamin Academy)",
    role: "Data Science Intern",
    period: "2025",
    summary:
      "Project-based internship focused on credit risk modeling and end-to-end data science workflows for financial services.",
    highlights: [
      "Built classification models (Logistic Regression, Random Forest, XGBoost, CatBoost) to predict loan default risk on customer application data",
      "Performed exploratory data analysis (EDA) and feature engineering to identify patterns in customer payment behavior and risk factors",
      "Handled data preprocessing challenges including missing values, data cleaning, and imbalanced dataset optimization using ROC-AUC metrics",
      "Delivered actionable business recommendations based on model performance and key risk indicators",
    ],
    tags: ["DATA SCIENCE", "MACHINE LEARNING", "EDA"],
  },
  {
    company: "Zenius",
    role: "Data Analytics Intern",
    period: "2023",
    summary:
      "Completed intensive Data Analytics program under Kampus Merdeka (MBKM) initiative, focusing on analytical thinking and technical data skills.",
    highlights: [
      "Developed proficiency in Python and SQL for data manipulation, cleaning, and analysis",
      "Created data visualizations and dashboards to transform complex datasets into actionable insights",
      "Applied logical reasoning and structured argumentation to solve analytical problems",
      "Mastered data structures and warehousing concepts for analytics-heavy systems",
    ],
    tags: ["DATA ANALYTICS", "PYTHON", "SQL", "DATA VISUALIZATION", "ETL"],
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            <div className={styles.kickerRow}>
              <span className={styles.kickerIcon} aria-hidden="true">
                *
              </span>
              <p className={styles.kicker}>Experience</p>
            </div>
            <SectionHeadline
              text="Turning technical experiments into stable products."
              className={styles.title}
            />
            <SectionSubheadline
              text="The gap between a working notebook and a live service is where the real engineering happens. These roles reflect my focus on building AI that is maintainable, observable, and ready for production."
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
