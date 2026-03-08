"use client";

import { CSSProperties, startTransition, useEffect, useRef, useState } from "react";
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

const ITEM_STAGGER = 0.14;
const ITEM_WINDOW = 0.24;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getScrollProgress(rect: DOMRect, viewportHeight: number) {
  const start = viewportHeight * 0.5;
  const end = viewportHeight * 0.3 - rect.height;
  const distance = start - end;

  if (distance <= 0) {
    return rect.top <= start ? 1 : 0;
  }

  return clamp((start - rect.top) / distance, 0, 1);
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReducedMotion(mediaQuery.matches);

    handleChange();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    let frameId = 0;

    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const nextProgress = getScrollProgress(
        section.getBoundingClientRect(),
        window.innerHeight
      );

      startTransition(() => {
        setProgress((current) =>
          Math.abs(current - nextProgress) < 0.001 ? current : nextProgress
        );
      });
    };

    const queueUpdate = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    queueUpdate();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
    };
  }, [reducedMotion]);

  const sectionStyle = {
    "--timeline-progress": progress.toFixed(4),
    "--section-shift": reducedMotion ? "0px" : `${Math.round(progress * 24)}px`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.experience}`}
      id="experience"
      style={sectionStyle}
    >
      <div className="container">
        <div className={styles.motionLayer}>
          <FadeIn direction="down">
            <h2 className={styles.sectionTitle}>
              <span className="text-accent">#</span> Experience
            </h2>
          </FadeIn>

          <div className={styles.timelineShell}>
            <div className={styles.timelineRail} aria-hidden="true">
              <div className={styles.timelineProgress}>
                <div className={styles.timelineDot} />
              </div>
            </div>

            <div className={styles.timeline}>
              {experiences.map((exp, index) => {
                const itemStart = 0.08 + index * ITEM_STAGGER;
                const itemProgress = reducedMotion
                  ? 1
                  : clamp((progress - itemStart) / ITEM_WINDOW, 0, 1);
                const itemStyle = {
                  "--item-opacity": itemProgress.toFixed(4),
                  "--item-translate": `${Math.round((1 - itemProgress) * 32)}px`,
                  "--item-scale": (0.96 + itemProgress * 0.04).toFixed(4),
                } as CSSProperties;

                return (
                  <article
                    key={`${exp.company}-${exp.period}`}
                    className={styles.timelineItem}
                    style={itemStyle}
                  >
                    <div className={styles.period}>{exp.period}</div>
                    <div className={styles.content}>
                      <h3 className={styles.role}>{exp.role}</h3>
                      <div className={styles.company}>{exp.company}</div>
                      <p className={styles.description}>{exp.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
