"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "auto";
}

const OFFSET_PX = 30;

function getFixedTransform(direction: Exclude<FadeInProps["direction"], "auto">) {
  return direction === "up"
    ? `translateY(${OFFSET_PX}px)`
    : `translateY(-${OFFSET_PX}px)`;
}

function getAutoTransform(rect: DOMRect, viewportHeight: number) {
  if (rect.bottom <= 0) {
    return `translateY(-${OFFSET_PX}px)`;
  }

  if (rect.top >= viewportHeight) {
    return `translateY(${OFFSET_PX}px)`;
  }

  return rect.top >= viewportHeight / 2
    ? `translateY(${OFFSET_PX}px)`
    : `translateY(-${OFFSET_PX}px)`;
}

function getHiddenTransform(
  direction: FadeInProps["direction"],
  rect?: DOMRect,
  viewportHeight?: number
) {
  if (direction !== "auto") {
    return getFixedTransform(direction);
  }

  if (!rect || viewportHeight === undefined) {
    return `translateY(${OFFSET_PX}px)`;
  }

  return getAutoTransform(rect, viewportHeight);
}

export default function FadeIn({ children, delay = 0, direction = "auto" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hiddenTransform, setHiddenTransform] = useState(() => getHiddenTransform(direction));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateHiddenTransform = (rect?: DOMRect) => {
      setHiddenTransform(getHiddenTransform(direction, rect ?? element.getBoundingClientRect(), window.innerHeight));
    };

    updateHiddenTransform();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          return;
        }

        updateHiddenTransform(entry.boundingClientRect);
        setIsVisible(false);
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [direction]);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : hiddenTransform,
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
