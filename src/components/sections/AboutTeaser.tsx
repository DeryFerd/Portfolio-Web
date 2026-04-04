"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import TextScramble from "@/components/ui/TextScramble";
import styles from "./AboutTeaser.module.css";

const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const JAKARTA_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: JAKARTA_TIME_ZONE,
});

const PARAGRAPH_1 =
  "I specialize in Large Language Models and Agentic AI, backed by a strong foundation in Machine Learning and Deep Learning. My work moves beyond basic integrations to focus on building autonomous AI agents and efficient systems, covering RAG, model distillation, and inference optimization.";

const PARAGRAPH_2 =
  "I also design technical curriculums as a Learning Developer, helping others master these technologies. I love solving the hard problems that come with deploying generative AI in the real world.";

const PROFILE_IMAGE = "/images/profile-placeholder.svg";
const CV_DOWNLOAD_PATH = "/documents/dery-ferdika-cv.pdf";

const profileRows = [
  {
    label: "Focus",
    value: "LLM systems, agent workflows, and machine learning products.",
  },
  {
    label: "Working style",
    value: "Clarity first, production-minded, and deeply iterative.",
  },
];

function formatLocalTime(date: Date) {
  return `${JAKARTA_TIME_FORMATTER.format(date)} WIB`;
}

function LiveLocalTime() {
  const [localTime, setLocalTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(formatLocalTime(new Date()));
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return <span className={styles.metaValue}>{localTime ?? "--:--:-- WIB"}</span>;
}

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
            <div className={styles.copyActions}>
              <Link href="/about" className={styles.link}>
                Read full background
              </Link>
              <a
                href={CV_DOWNLOAD_PATH}
                download
                className={styles.cvButton}
                aria-label="Download my CV as PDF"
              >
                Download My CV
              </a>
            </div>
          </div>

          <aside className={styles.profileCard}>
            <p className={styles.cardLabel}>Operational profile</p>
            <div className={styles.profileHero}>
              <div className={styles.portraitFrame}>
                <Image
                  src={PROFILE_IMAGE}
                  alt="Profile portrait placeholder for Dery Ferdika"
                  fill
                  className={styles.portraitImage}
                  unoptimized
                />
                <span className={styles.portraitBadge}>Profile</span>
              </div>
              <div className={styles.identityBlock}>
                <p className={styles.identityEyebrow}>Dery Ferdika</p>
                <h3 className={styles.identityTitle}>
                  AI systems, interfaces, and delivery.
                </h3>
                <p className={styles.identityText}>
                  A merged profile card so the human layer and the working layer
                  sit in one place.
                </p>
              </div>
            </div>
            <div className={styles.metaGrid}>
              <div className={styles.metaCell}>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>Malang, Indonesia</span>
              </div>
              <div className={styles.metaCell}>
                <span className={styles.metaLabel}>Local time</span>
                <LiveLocalTime />
              </div>
            </div>
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
