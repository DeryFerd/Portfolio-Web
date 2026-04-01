"use client";

import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import styles from "./Loading.module.css";

const RING_COUNT = 12;
const PARTICLE_COUNT = 40;
const REDUCED_MOTION_DURATION_MS = 220;

/**
 * Deterministic pseudo-random number generator (mulberry32).
 * Ensures identical output on server and client to avoid hydration mismatch.
 */
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
}

/* Particles are generated deterministically so SSR and CSR match. */
const rand = createSeededRandom(42);
const PARTICLES: Particle[] = Array.from({ length: PARTICLE_COUNT }).map(() => ({
  x: (rand() - 0.5) * 200,
  y: (rand() - 0.5) * 200,
  size: Math.round((1 + rand() * 2.5) * 100) / 100,
  speed: Math.round((0.5 + rand() * 1.5) * 100) / 100,
}));

export default function Loading() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ringRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const particleRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const setRingRef = useCallback(
    (index: number) => (element: HTMLSpanElement | null) => {
      ringRefs.current[index] = element;
    },
    [],
  );

  const setParticleRef = useCallback(
    (index: number) => (element: HTMLSpanElement | null) => {
      particleRefs.current[index] = element;
    },
    [],
  );

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
    const particleElements = particleRefs.current.filter((p): p is HTMLSpanElement => p !== null);

    const ctx = gsap.context(() => {
      gsap.set(rootRef.current, { autoAlpha: 1 });

      /* Tunnel wrapper starts small */
      gsap.set(tunnelRef.current, { scale: 0.6, force3D: true });

      /* Each ring starts tiny - stacked to simulate depth */
      gsap.set(rings, {
        scale: (index: number) => {
          const t = index / (RING_COUNT - 1);
          return 0.08 + t * 0.14;
        },
        autoAlpha: (index: number) => {
          const t = index / (RING_COUNT - 1);
          return 0.04 + (1 - t) * 0.28;
        },
        force3D: true,
      });

      gsap.set(coreRef.current, { scale: 0.06, autoAlpha: 0.5, force3D: true });
      gsap.set(glowRef.current, { scale: 0.12, autoAlpha: 0.08, force3D: true });
      gsap.set(copyRef.current, { y: 20, autoAlpha: 0, force3D: true });

      /* Particles start near the centre */
      particleElements.forEach((el, i) => {
        const p = PARTICLES[i];
        gsap.set(el, {
          x: p.x * 0.25,
          y: p.y * 0.25,
          scale: 0.15,
          autoAlpha: 0,
          force3D: true,
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => setIsLoading(false),
      });

      /* ── Phase 1  Tunnel materialises (0 – 0.85s) ────────────── */
      tl.to(copyRef.current, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }, 0.1)
        .to(tunnelRef.current, { scale: 0.85, duration: 0.85, ease: "power2.out" }, 0)
        .to(coreRef.current, { scale: 0.14, autoAlpha: 0.85, duration: 0.85 }, 0)
        .to(glowRef.current, { scale: 0.3, autoAlpha: 0.22, duration: 0.85 }, 0);

      rings.forEach((ring, i) => {
        const t = i / (RING_COUNT - 1);
        tl.to(
          ring,
          {
            scale: 0.14 + t * 0.58,
            autoAlpha: 0.06 + (1 - t) * 0.38,
            duration: 0.9,
            ease: "power2.out",
          },
          0,
        );
      });

      particleElements.forEach((el, i) => {
        const p = PARTICLES[i];
        tl.to(
          el,
          {
            x: p.x * 0.5,
            y: p.y * 0.5,
            scale: 0.35 + p.size * 0.12,
            autoAlpha: 0.15 + (i % 5) * 0.06,
            duration: 0.8,
            ease: "power2.out",
          },
          0.08 + (i % 7) * 0.04,
        );
      });

      /* ── Phase 2  Zoom INTO the tunnel (0.9 – 1.6s) ─────────── */
      tl.to(copyRef.current, { y: -15, autoAlpha: 0, duration: 0.28, ease: "power2.in" }, 0.88);

      rings.forEach((ring, i) => {
        const t = i / (RING_COUNT - 1);
        const delay = 0.92 + (1 - t) * 0.22;
        tl.to(
          ring,
          {
            scale: 3.8 + (1 - t) * 4.5,
            autoAlpha: 0,
            duration: 0.55 + t * 0.35,
            ease: "power3.in",
          },
          delay,
        );
      });

      tl.to(coreRef.current, { scale: 5, autoAlpha: 0, duration: 0.75, ease: "power3.in" }, 1.1)
        .to(glowRef.current, { scale: 6, autoAlpha: 0.5, duration: 0.75, ease: "power2.in" }, 1.0);

      particleElements.forEach((el, i) => {
        const p = PARTICLES[i];
        tl.to(
          el,
          {
            x: p.x * 4,
            y: p.y * 4,
            scale: 1.5 + p.speed * 2,
            autoAlpha: 0,
            duration: 0.6 + p.speed * 0.25,
            ease: "power2.in",
          },
          0.92 + (i % 5) * 0.04,
        );
      });

      /* ── Phase 3  Screen dissolves (1.5 – 2.0s) ─────────────── */
      tl.to(tunnelRef.current, { scale: 7, duration: 0.65, ease: "power4.in" }, 1.25)
        .to(glowRef.current, { autoAlpha: 0, duration: 0.25 }, 1.6)
        .to(rootRef.current, { autoAlpha: 0, duration: 0.32, ease: "power2.out" }, 1.7);
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
          {Array.from({ length: RING_COUNT }).map((_, i) => (
            <span key={i} ref={setRingRef(i)} className={styles.tunnelRing} />
          ))}
          <span ref={coreRef} className={styles.tunnelCore} />
        </div>

        <div className={styles.particles}>
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              ref={setParticleRef(i)}
              className={styles.particle}
              style={{ width: `${p.size}px`, height: `${p.size}px` }}
            />
          ))}
        </div>

        <div ref={copyRef} className={styles.copy}>
          <p className={styles.kicker}>Dery Ferdika</p>
          <p className={styles.caption}>Entering selected work</p>
        </div>
      </div>
    </div>
  );
}
