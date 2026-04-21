"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Loading.module.css";

const VIDEO_DURATION_MS = 3000;
const MOBILE_BREAKPOINT = 768;

export default function Loading() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const markVideoReady = () => {
    setIsVideoReady(true);
  };

  useLayoutEffect(() => {
    setHasMounted(true);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

    if (reduceMotion || isMobile) {
      setIsLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!hasMounted || !isLoading) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;

    if (reduceMotion || isMobile) {
      const timer = window.setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => window.clearTimeout(timer);
    }

    if (!isVideoReady) {
      const readyFallbackTimer = window.setTimeout(() => {
        setIsVideoReady(true);
      }, 900);

      return () => {
        window.clearTimeout(readyFallbackTimer);
      };
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
  }, [hasMounted, isLoading, isVideoReady]);

  useEffect(() => {
    if (!hasMounted || !isLoading || !isVideoReady) {
      return;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    videoRef.current?.play().catch(() => {
      // Autoplay can be delayed briefly; the overlay remains stable until playback begins.
    });
  }, [hasMounted, isLoading, isVideoReady]);

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
        muted
        playsInline
        preload="auto"
        data-ready={isVideoReady}
        onLoadedData={markVideoReady}
        onCanPlay={markVideoReady}
        onCanPlayThrough={markVideoReady}
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
      </video>
      <div className={styles.introOverlay} />
    </div>
  );
}
