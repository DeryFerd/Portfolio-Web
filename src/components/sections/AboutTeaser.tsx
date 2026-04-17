"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import CurtainReveal from "@/components/ui/CurtainReveal";
import InteractiveHeadlineText from "@/components/ui/InteractiveHeadlineText";
import TextScramble from "@/components/ui/TextScramble";
import { ShiningText } from "@/components/ui/shining-text";
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
  "Hi, I am Dery. As a pure math graduate and aspiring AI Engineer, I build reliable products backed by machine learning and deep learning. I specialize in autonomous AI agents, agentic AI workflows, and RAG systems. I am also highly interested in data engineering to keep my builds production-ready.";

const PARAGRAPH_2 =
  "Beyond shipping code, I work as a curriculum developer to help others master AI stuff. My goal is always to make advanced AI easy to trust and use in the real world.";

const PROFILE_IMAGE = "/images/dery-photo.jpg";
const CV_DOWNLOAD_PATH = "/api/download-cv";

const profileRows = [
  {
    label: "Focus",
    value: "LLM systems, AI agents, and RAG for production workflows.",
  },
  {
    label: "Layer",
    value: "Engineering execution with learning design and interface clarity.",
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
  const [titlePhase, setTitlePhase] = useState<"thinking" | "scramble" | "interactive">("thinking");
  const [shouldScrambleTitle, setShouldScrambleTitle] = useState(false);

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

  useEffect(() => {
    if (!isVisible) return;

    setTitlePhase("thinking");
    setShouldScrambleTitle(false);

    const timer = window.setTimeout(() => {
      setTitlePhase("scramble");
      setShouldScrambleTitle(true);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className={`section ${styles.about}`} id="about">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerIcon} aria-hidden="true">
                *
              </span>
              <p className={styles.kicker}>About</p>
            </div>
            <h2 className={styles.title}>
              {titlePhase === "thinking" ? (
                <ShiningText 
                  text="This Section is Thinking..." 
                  className={`${styles.thinkingTitle} text-4xl md:text-5xl font-bold`}
                />
              ) : (
                <>
                  {titlePhase === "scramble" ? (
                    <TextScramble
                      key="about-me-scramble"
                      text="About Me"
                      trigger={shouldScrambleTitle}
                      speed={72}
                      delay={140}
                      onComplete={() => setTitlePhase("interactive")}
                      className={`${styles.scrambleInline} text-4xl md:text-5xl font-bold`}
                    />
                  ) : (
                    <InteractiveHeadlineText
                      text="About Me"
                      className={`${styles.scrambleInline} text-4xl md:text-5xl font-bold`}
                    />
                  )}
                </>
              )}
            </h2>
            <p className={styles.lead}>
              <TextScramble
                text={PARAGRAPH_1}
                trigger={isVisible}
                speed={6}
                delay={280}
                className={styles.scrambleBlock}
              />
            </p>
            <p className={styles.text}>
              <TextScramble
                text={PARAGRAPH_2}
                trigger={isVisible}
                speed={6}
                delay={600}
                className={styles.scrambleBlock}
              />
            </p>
            <div className={styles.copyActions}>
              <Button asChild variant="outline" size="lg" className={styles.cvButton}>
                <a
                  href={CV_DOWNLOAD_PATH}
                  download="Dery-Ferdika-CV.pdf"
                  aria-label="Download my CV as PDF"
                >
                  <span className={styles.cvText}>Download My CV</span>
                  <Download className={styles.cvIcon} aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <aside className={styles.profileRail}>
            <CurtainReveal
              imageSrc={PROFILE_IMAGE}
              imageAlt="Profile portrait of Dery Ferdika"
              className={styles.profileReveal}
              photoFit="cover"
              photoPosition="50% 20%"
            >
              <div className={styles.identityGrid}>
                <div className={styles.identityCell}>
                  <span className={styles.identityLabel}>Name</span>
                  <span className={styles.identityValue}>Dery Ferdika</span>
                </div>
                <div className={styles.identityCell}>
                  <span className={styles.identityLabel}>Degree</span>
                  <span className={styles.identityValue}>Pure Mathematics</span>
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
            </CurtainReveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
