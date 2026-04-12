"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

interface TypewriterTextProps {
  text: string;
  trigger: boolean;
  className?: string;
  delay?: number;
  speed?: number;
  as?: ElementType;
  replayOnDesktop?: boolean;
}

export default function TypewriterText({
  text,
  trigger,
  className = "",
  delay = 0,
  speed = 16,
  as: Component = "span",
  replayOnDesktop = false,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const hasCompletedRef = useRef(false);
  const prefersReplayRef = useRef(false);

  useEffect(() => {
    if (!replayOnDesktop) {
      prefersReplayRef.current = false;
      return;
    }

    const mediaQuery = window.matchMedia(
      "(max-width: 1024px), (hover: none), (pointer: coarse)"
    );
    prefersReplayRef.current = !mediaQuery.matches;

    const handleMediaChange = () => {
      prefersReplayRef.current = !mediaQuery.matches;
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [replayOnDesktop]);

  useEffect(() => {
    if (!trigger) {
      return;
    }

    const shouldReplay = prefersReplayRef.current;

    if (!shouldReplay && hasCompletedRef.current) {
      setDisplayed(text);
      return;
    }

    let timeoutId: number | null = null;
    setDisplayed("");
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
  }, [delay, speed, text, trigger, replayOnDesktop]);

  return <Component className={className}>{displayed}</Component>;
}
