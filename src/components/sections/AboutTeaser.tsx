"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import InteractiveHeadlineText from "@/components/ui/InteractiveHeadlineText";
import TextScramble from "@/components/ui/TextScramble";
import { ShiningText } from "@/components/ui/shining-text";
import styles from "./AboutTeaser.module.css";

const PARAGRAPH_1 =
  "Hi, I'm Dery. I build AI products that turn model capability into reliable user experiences, with a focus on LLM systems, agent workflows, and production-ready machine learning.";

const PARAGRAPH_2 =
  "Alongside shipping systems, I design technical learning experiences that help teams understand what they are building. I care about clarity, grounded execution, and making advanced AI feel useful in real-world environments.";

const PARAGRAPH_3 =
  "Based in Malang, Indonesia, I work across research, engineering, and interface design to make intelligent systems easier to trust, operate, and scale.";

const PROFILE_IMAGE = "/images/profile-placeholder.svg";
const CV_DOWNLOAD_PATH = "/documents/dery-ferdika-cv.pdf";

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
            <p className={styles.kicker}>About</p>
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
            <p className={styles.text}>
              <TextScramble
                text={PARAGRAPH_3}
                trigger={isVisible}
                speed={6}
                delay={900}
                className={styles.scrambleBlock}
              />
            </p>
            <div className={styles.copyActions}>
              <Button asChild variant="outline" size="lg" className={styles.cvButton}>
                <a href={CV_DOWNLOAD_PATH} download aria-label="Download my CV as PDF">
                  <span className={styles.cvText}>Download My CV</span>
                  <Download className={styles.cvIcon} aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <aside className={styles.profileCard}>
            <p className={styles.cardLabel}>Operational profile</p>
            <div className={styles.profileFrame}>
              <Image
                src={PROFILE_IMAGE}
                alt="Profile portrait of Dery Ferdika"
                fill
                className={styles.profileImage}
                unoptimized
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
