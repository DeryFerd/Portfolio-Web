"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TextScramble from "@/components/ui/TextScramble";
import styles from "./AboutTeaser.module.css";

const PARAGRAPH_1 =
  "I specialize in Large Language Models and Agentic AI, backed by a strong foundation in Machine Learning and Deep Learning. My work moves beyond basic integrations to focus on building autonomous AI agents and efficient systems, covering RAG, model distillation, and inference optimization.";

const PARAGRAPH_2 =
  "I also design technical curriculums as a Learning Developer, helping others master these technologies. I love solving the hard problems that come with deploying generative AI in the real world.";

const profileRows = [
  {
    label: "Base",
    value: "Malang, Indonesia",
  },
  {
    label: "Focus",
    value: "LLM systems, agent workflows, and machine learning products.",
  },
  {
    label: "Working style",
    value: "Clarity first, production-minded, and deeply iterative.",
  },
];

export default function AboutTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`section ${styles.about}`} id="about">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className={styles.kicker}>About</p>
            <h2 className={styles.title}>
              <TextScramble
                text="About Me"
                trigger={isVisible}
                speed={44}
                delay={0}
                className={styles.scrambleInline}
              />
            </h2>
            <p className={styles.lead}>
              <TextScramble
                text={PARAGRAPH_1}
                trigger={isVisible}
                speed={8}
                delay={280}
                className={styles.scrambleBlock}
              />
            </p>
            <p className={styles.text}>
              <TextScramble
                text={PARAGRAPH_2}
                trigger={isVisible}
                speed={8}
                delay={2700}
                className={styles.scrambleBlock}
              />
            </p>
            <Link href="/about" className={styles.link}>
              Read full background
            </Link>
          </div>

          <aside className={styles.profileCard}>
            <p className={styles.cardLabel}>Operational profile</p>
            <div className={styles.cardRows}>
              {profileRows.map((row) => (
                <div key={row.label} className={styles.cardRow}>
                  <span className={styles.rowLabel}>{row.label}</span>
                  <span className={styles.rowValue}>{row.value}</span>
                </div>
              ))}
            </div>
            <p className={styles.cardNote}>
              Currently interested in product-facing AI systems, internal tools,
              and collaborations that need both technical depth and visual care.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
