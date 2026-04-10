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
  { name: "GitHub", url: "https://github.com/DeryFerd" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/deryferdikaoktoriansah" },
  { name: "X", url: "https://x.com" },
  { name: "HuggingFace", url: "https://huggingface.co/DeryFerd" },
];

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "GitHub":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.4.21 2.45.11 2.71.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.81-4.58 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.5A10.25 10.25 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
          />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.94 8.5a1.44 1.44 0 1 1 0-2.88 1.44 1.44 0 0 1 0 2.88ZM5.7 9.7h2.48V18H5.7V9.7Zm4.03 0h2.38v1.13h.03c.33-.63 1.14-1.3 2.35-1.3 2.5 0 2.96 1.68 2.96 3.87V18h-2.48v-3.98c0-.95-.02-2.17-1.3-2.17-1.3 0-1.5 1.04-1.5 2.1V18H9.72V9.7Z"
          />
        </svg>
      );
    case "X":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.9 3H21l-4.58 5.24L21.8 21h-4.2l-3.28-4.9L10.03 21H7.9l4.9-5.6L3.2 3h4.31l2.96 4.44L14.36 3h2.06Zm-1.47 15.56h1.16L6.57 5.36H5.33l12.1 13.2Z"
          />
        </svg>
      );
    case "HuggingFace":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M7.4 10.1a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8Zm9.2 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8ZM12 18.7c3.68 0 6.67-2.97 6.67-6.64A6.66 6.66 0 0 0 12 5.4a6.66 6.66 0 0 0-6.67 6.66A6.66 6.66 0 0 0 12 18.7Zm-3.46-4.33c.72 1.26 2.02 2.03 3.46 2.03 1.44 0 2.74-.77 3.46-2.03.18-.32.59-.42.9-.24.31.18.42.58.24.89A5.3 5.3 0 0 1 12 17.72a5.3 5.3 0 0 1-4.6-2.7.65.65 0 0 1 .23-.89.66.66 0 0 1 .91.24Z"
          />
        </svg>
      );
    default:
      return null;
  }
}

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
                    <SocialIcon name={social.name} />
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
