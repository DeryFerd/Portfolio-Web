"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down";
}

export default function FadeIn({ children, delay = 0, direction = "up" }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    return direction === "up" ? "translateY(30px)" : "translateY(-30px)";
  };

  return (
    <div
      ref={ref}
      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : getTransform(),
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
