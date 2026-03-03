"use client";

import { useState, useEffect } from "react";
import Marquee from "@/components/ui/Marquee";
import styles from "./Loading.module.css";

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.loading}>
      <div className={styles.clockWrapper}>
        <div className={styles.marqueeWrapper}>
          <Marquee text="AI ENGINEER • LLM ENGINEER • LLM DEVOPS • ML ENGINEER • DL ENGINEER •" />
        </div>
        <div className={styles.clock}>
          <div className={styles.clockFace}>
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={styles.clockMark}
                style={{ transform: `rotate(${i * 30}deg)` }}
              />
            ))}
          </div>
          <div className={styles.hourHand} />
          <div className={styles.minuteHand} />
          <div className={styles.centerDot} />
        </div>
      </div>
      <p className={styles.text}>Loading...</p>
    </div>
  );
}
