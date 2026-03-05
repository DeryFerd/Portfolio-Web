"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "auto";
}

export default function FadeIn({ children, delay = 0, direction = "auto" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollDir = useRef<"down" | "up">("down");
  const lastScrollY = useRef(0);

  /* ── Track scroll direction globally ── */
  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      scrollDir.current = currentY >= lastScrollY.current ? "down" : "up";
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Observe element entering / leaving viewport ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (direction === "auto") {
      // Scrolling down → element enters from below → translateY(30px)
      // Scrolling up   → element enters from above → translateY(-30px)
      return scrollDir.current === "down" ? "translateY(30px)" : "translateY(-30px)";
    }
    return direction === "up" ? "translateY(30px)" : "translateY(-30px)";
  };

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : getTransform(),
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
