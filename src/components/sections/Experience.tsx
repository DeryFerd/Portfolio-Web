"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    () => experiences.map(() => false)
  );

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    []
  );

  /* ── Observe each card for fade-in ── */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            io.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className={`section ${styles.experience}`} id="experience">
      <div className="container">
        <h2 className={styles.sectionTitle}>
          <span className="text-accent">#</span> Experience
        </h2>

        <div className={styles.timeline}>
          {/* The meteor trail line (::before pseudo-element in CSS) */}

          {experiences.map((exp, index) => (
            <div
              key={index}
              ref={setCardRef(index)}
              className={`${styles.timelineItem} ${visibleCards[index] ? styles.fadeInVisible : styles.fadeInHidden}`}
              style={{ transitionDelay: `${index * 0.18}s` }}
            >
              {/* Meteor head dot */}
              <div className={styles.meteorHead} />

              <div className={styles.period}>{exp.period}</div>
              <div className={styles.content}>
                <h3 className={styles.role}>{exp.role}</h3>
                <div className={styles.company}>{exp.company}</div>
                <p className={styles.description}>{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
