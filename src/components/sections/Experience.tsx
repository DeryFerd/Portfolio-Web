"use client";

import FadeIn from "@/components/ui/FadeIn";
import styles from "./Experience.module.css";

const experiences = [
  {
    company: "Tech Company",
    role: "AI Engineer",
    period: "2024 - Present",
    description:
      "Building and deploying ML models for production. Working on NLP and computer vision projects.",
  },
  {
    company: "Cloud Corp",
    role: "LLM DevOps",
    period: "2024 - Present",
    description:
      "Managing LLM deployment pipelines, fine-tuning infrastructure, and orchestrating model serving at scale with Kubernetes.",
  },
  {
    company: "Startup Inc",
    role: "Machine Learning Intern",
    period: "2023 - 2024",
    description:
      "Developed recommendation systems and data pipelines. Research on LLM applications.",
  },
  {
    company: "Data Solutions",
    role: "Data Engineer",
    period: "2022 - 2023",
    description:
      "Designed and maintained ETL pipelines, data warehouses, and real-time streaming architectures using Apache Spark and Airflow.",
  },
];

export default function Experience() {
  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <FadeIn direction="down">
          <h2 className={styles.sectionTitle}>
            <span className="text-accent">#</span> Experience
          </h2>
        </FadeIn>

        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <FadeIn
              key={index}
              direction={index % 2 === 0 ? "up" : "down"}
              delay={index * 120}
            >
              <div className={styles.timelineItem}>
                {/* Meteor head dot */}
                <div className={styles.meteorHead} />

                <div className={styles.period}>{exp.period}</div>
                <div className={styles.content}>
                  <h3 className={styles.role}>{exp.role}</h3>
                  <div className={styles.company}>{exp.company}</div>
                  <p className={styles.description}>{exp.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
