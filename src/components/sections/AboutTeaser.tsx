"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TextScramble from "../ui/TextScramble";
import styles from "./AboutTeaser.module.css";

const PARAGRAPH_1 =
  "I specialize in Large Language Models and Agentic AI, backed by a strong foundation in Machine Learning and Deep Learning. My work moves beyond basic integrations to focus on building autonomous AI Agents and efficient systems, covering RAG, model distillation, and inference optimization.";

const PARAGRAPH_2 =
  "I also design technical curriculums as a Learning Developer, helping others master these technologies. I love solving the hard problems that come with deploying generative AI in the real world.";

export default function AboutTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // only trigger once
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`section ${styles.about}`}>
      <div className="container">
        <div className={styles.wrapper}>

          {/* ── Text column (left) ── */}
          <div className={styles.content}>
            <h2 className={styles.sectionTitle}>
              <span className="text-accent">#</span>{" "}
              <TextScramble
                text="About Me"
                trigger={isVisible}
                speed={50}
                delay={0}
                className={styles.scrambleInline}
              />
            </h2>

            <p className={styles.text}>
              <TextScramble
                text={PARAGRAPH_1}
                trigger={isVisible}
                speed={12}
                delay={400}
                className={styles.scrambleBlock}
              />
            </p>

            <p className={styles.text}>
              <TextScramble
                text={PARAGRAPH_2}
                trigger={isVisible}
                speed={12}
                delay={3000}
                className={styles.scrambleBlock}
              />
            </p>

            <Link href="/about" className={styles.link}>
              Read More &rarr;
            </Link>
          </div>

          {/* ── Photo frame (right) ── */}
          <div className={styles.photoCol}>
            <div className={styles.frameOuter}>
              <div className={styles.cornerTL} />
              <div className={styles.cornerTR} />
              <div className={styles.cornerBL} />
              <div className={styles.cornerBR} />
              <div className={styles.frameInner}>
                {/* Replace src with your own photo */}
                <Image
                  src="/images/profile.jpg"
                  alt="Profile photo"
                  width={340}
                  height={420}
                  className={styles.photo}
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

