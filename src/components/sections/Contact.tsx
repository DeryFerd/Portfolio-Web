"use client";

import { useEffect, useRef, useState } from "react";
import InteractiveHeadlineText from "@/components/ui/InteractiveHeadlineText";
import TextScramble from "@/components/ui/TextScramble";
import TypewriterText from "@/components/ui/TypewriterText";
import { ShiningText } from "@/components/ui/shining-text";
import styles from "./Contact.module.css";

const SUBTITLE_TEXT =
  "I'm open to selected opportunities where AI systems need both technical depth and product-level clarity.";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/DeryFerd",
    iconUrl: "https://cdn.simpleicons.org/github",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/deryferdikaoktoriansah",
    iconUrl: "https://cdn.simpleicons.org/linkedin/0A66C2",
  },
  {
    name: "X",
    url: "https://x.com",
    iconUrl: "https://cdn.simpleicons.org/x",
  },
  {
    name: "HuggingFace",
    url: "https://huggingface.co/DeryFerd",
    iconUrl: "https://cdn.simpleicons.org/huggingface/FFD21E",
  },
];

export default function Contact() {
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
    <section ref={sectionRef} className={`section ${styles.contact}`} id="contact">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerIcon} aria-hidden="true">
                *
              </span>
              <p className={styles.kicker}>Contact</p>
            </div>
            <h2 className={styles.title}>
              {titlePhase === "thinking" ? (
                <ShiningText
                  text="This Section is Thinking..."
                  className={styles.thinkingTitle}
                />
              ) : (
                <>
                  {titlePhase === "scramble" ? (
                    <TextScramble
                      key="contact-title-scramble"
                      text="Have a project in mind?"
                      trigger={shouldScrambleTitle}
                      speed={72}
                      delay={140}
                      onComplete={() => setTitlePhase("interactive")}
                      className={styles.scrambleInline}
                    />
                  ) : (
                    <InteractiveHeadlineText
                      text="Have a project in mind?"
                      className={styles.scrambleInline}
                    />
                  )}
                </>
              )}
            </h2>
            <p className={styles.text}>
              <TypewriterText
                text={SUBTITLE_TEXT}
                trigger={isVisible}
                delay={600}
                speed={16}
                className={styles.typewriterText}
              />
            </p>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Base</span>
              <span className={styles.metaValue}>Malang, Indonesia</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Focus</span>
              <span className={styles.metaValue}>AI Agents, Agentic AI, RAG, Machine Learning</span>
            </div>
            <div className={styles.links}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <span className={styles.linkIcon}>
                    <img
                      src={social.iconUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
