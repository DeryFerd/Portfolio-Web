"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

interface TypewriterTextProps {
  text: string;
  trigger: boolean;
  className?: string;
  delay?: number;
  speed?: number;
  as?: ElementType;
}

export default function TypewriterText({
  text,
  trigger,
  className = "",
  delay = 0,
  speed = 16,
  as: Component = "span",
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!trigger) {
      return;
    }

    if (hasCompletedRef.current) {
      setDisplayed(text);
      return;
    }

    let timeoutId: number | null = null;
    let currentIndex = 0;

    const typeNext = () => {
      currentIndex += 1;
      setDisplayed(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        hasCompletedRef.current = true;
        return;
      }

      timeoutId = window.setTimeout(typeNext, speed);
    };

    timeoutId = window.setTimeout(typeNext, delay);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [delay, speed, text, trigger]);

  return <Component className={className}>{displayed}</Component>;
}
