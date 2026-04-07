"use client";

import { useEffect, useRef, useState } from "react";

interface SectionSubheadlineProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export default function SectionSubheadline({
  text,
  className = "",
  speed = 16,
  delay = 160,
}: SectionSubheadlineProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || hasCompleted) return;

    let frameId: number | null = null;
    let timeoutId: number | null = null;
    let index = 0;

    const typeNext = () => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        setHasCompleted(true);
        return;
      }

      timeoutId = window.setTimeout(() => {
        frameId = window.requestAnimationFrame(typeNext);
      }, speed);
    };

    timeoutId = window.setTimeout(() => {
      frameId = window.requestAnimationFrame(typeNext);
    }, delay);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [delay, hasCompleted, isVisible, speed, text]);

  return (
    <p ref={textRef} className={className} aria-label={text}>
      {displayed}
    </p>
  );
}
