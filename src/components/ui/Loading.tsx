"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Loading.module.css";

const RING_COUNT = 4;
const REDUCED_MOTION_DURATION_MS = 220;

export default function Loading() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ringRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useLayoutEffect(() => {
    if (!isLoading || !rootRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        setIsLoading(false);
      }, REDUCED_MOTION_DURATION_MS);

      return () => {
        window.clearTimeout(timer);
      };
    }

    const rings = ringRefs.current.filter((ring): ring is HTMLSpanElement => ring !== null);
    const ctx = gsap.context(() => {
      gsap.set(rootRef.current, { autoAlpha: 1 });
      gsap.set(tunnelRef.current, { scale: 0.82, force3D: true });
      gsap.set(coreRef.current, { scale: 0.52, autoAlpha: 0.24, force3D: true });
      gsap.set(glowRef.current, { scale: 0.88, autoAlpha: 0.18, force3D: true });
      gsap.set(copyRef.current, { y: 12, autoAlpha: 0, force3D: true });
      gsap.set(rings, {
        scale: (index) => 0.42 + index * 0.18,
        autoAlpha: (index) => 0.1 + (RING_COUNT - index) * 0.08,
        force3D: true,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          setIsLoading(false);
        },
      });

      timeline
        .to(copyRef.current, { y: 0, autoAlpha: 1, duration: 0.32 }, 0.04)
        .to(glowRef.current, { scale: 1.04, autoAlpha: 0.3, duration: 0.72 }, 0)
        .to(coreRef.current, { scale: 0.76, autoAlpha: 0.86, duration: 0.72 }, 0)
        .to(
          rings,
          {
            scale: (index) => 0.82 + index * 0.18,
            autoAlpha: (index) => 0.08 + (RING_COUNT - index) * 0.06,
            duration: 0.78,
            stagger: 0.03,
          },
          0,
        )
        .to(tunnelRef.current, { scale: 1.06, duration: 0.44, ease: "power2.inOut" }, 0.36)
        .to(copyRef.current, { y: -10, autoAlpha: 0, duration: 0.18 }, 0.72)
        .to(
          [tunnelRef.current, ...rings],
          {
            scale: 3.2,
            autoAlpha: 0,
            duration: 0.62,
            ease: "power4.in",
          },
          0.68,
        )
        .to(glowRef.current, { scale: 1.8, autoAlpha: 0.08, duration: 0.58, ease: "power3.in" }, 0.68)
        .to(coreRef.current, { scale: 2.2, autoAlpha: 0.42, duration: 0.58, ease: "power3.in" }, 0.68)
        .to(rootRef.current, { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 1.06);
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div ref={rootRef} className={styles.loading} aria-hidden="true">
      <div className={styles.loadingFrame}>
        <div ref={tunnelRef} className={styles.tunnel}>
          <span ref={glowRef} className={styles.tunnelGlow} />
          {Array.from({ length: RING_COUNT }).map((_, index) => (
            <span
              key={index}
              ref={(element) => {
                ringRefs.current[index] = element;
              }}
              className={styles.tunnelRing}
            />
          ))}
          <span ref={coreRef} className={styles.tunnelCore} />
        </div>

        <div ref={copyRef} className={styles.copy}>
          <p className={styles.kicker}>Dery Ferdika</p>
          <p className={styles.caption}>Entering selected work</p>
        </div>
      </div>
    </div>
  );
}
