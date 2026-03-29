"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface AnimatedNumberProps {
  className?: string;
  duration?: number;
  value: number | null;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export default function AnimatedNumber({
  className,
  duration = 1400,
  value,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const formatter = useMemo(() => new Intl.NumberFormat("en-US"), []);

  useEffect(() => {
    if (value === null) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      setIsVisible(true);
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (value === null || !isVisible) {
      return;
    }

    let frame = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const nextValue = Math.round(value * eased);

      setDisplayValue(nextValue);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [duration, isVisible, value]);

  return (
    <p ref={ref} className={className}>
      {value === null ? "-" : formatter.format(displayValue)}
    </p>
  );
}
