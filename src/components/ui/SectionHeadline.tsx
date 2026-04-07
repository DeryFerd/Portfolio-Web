"use client";

import { useEffect, useRef, useState } from "react";
import TextScramble from "@/components/ui/TextScramble";
import { ShiningText } from "@/components/ui/shining-text";
import styles from "./SectionHeadline.module.css";

interface SectionHeadlineProps {
  text: string;
  className?: string;
  thinkingText?: string;
}

export default function SectionHeadline({
  text,
  className = "",
  thinkingText = "This section is thinking...",
}: SectionHeadlineProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [titlePhase, setTitlePhase] = useState<"thinking" | "final">("thinking");
  const [shouldScramble, setShouldScramble] = useState(false);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(title);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    setTitlePhase("thinking");
    setShouldScramble(false);

    const timer = window.setTimeout(() => {
      setTitlePhase("final");
      setShouldScramble(true);
    }, 1350);

    return () => window.clearTimeout(timer);
  }, [isVisible]);

  return (
    <h2 ref={titleRef} className={`${styles.headline} ${className}`}>
      {titlePhase === "thinking" ? (
        <ShiningText
          text={thinkingText}
          className={`${styles.thinking} ${styles.content}`}
        />
      ) : (
        <TextScramble
          key={text}
          text={text}
          trigger={shouldScramble}
          speed={68}
          delay={120}
          className={`${styles.scramble} ${styles.content}`}
        />
      )}
    </h2>
  );
}
