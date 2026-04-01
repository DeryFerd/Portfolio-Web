"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Loading.module.css";

const VIDEO_DURATION_MS = 3000;

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => window.clearTimeout(timer);
    }

    const fadeTimer = window.setTimeout(() => {
      setIsFading(true);
    }, VIDEO_DURATION_MS - 500);

    const hideTimer = window.setTimeout(() => {
      setIsLoading(false);
    }, VIDEO_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      ref={(el) => {
        if (el) {
          el.style.opacity = isFading ? "0" : "1";
        }
      }}
      className={styles.loading}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className={styles.introVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>
      <div className={styles.introOverlay} />
    </div>
  );
}
