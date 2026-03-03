"use client";
import { useEffect, useRef } from "react";
import styles from "./RobotAnimation.module.css";

// ─── Constants ───────────────────────────────────────────────────────────────
const ROBOT_W = 100;
const ROBOT_H = 115;
const LERP = 0.04;    // slow & lazy — feels like it's "waiting"
const BOX_PAD = 10;      // extra breathing room around avoid boxes
const MAX_PUPIL = 4;

// How far above/beside the cursor the robot prefers to sit
const OFFSET_Y = 70;       // px above cursor
const OFFSET_X = 20;       // slight horizontal nudge toward cursor

const LEFT_EYE = { cx: 36, cy: 62 };
const RIGHT_EYE = { cx: 74, cy: 62 };

// ─── Helpers ─────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Compute target (x, y) for the robot.
 *
 * Strategy — "companion that hovers above you":
 *   1. Default target: centered on cursor, OFFSET_Y px above it.
 *   2. If that position overlaps a [data-robot-avoid] box,
 *      the robot climbs to just above that box (sits on top of the content).
 *   3. No side-switching — the robot stays near the cursor at all times.
 *   4. getBoundingClientRect() is always viewport-relative, so scroll is
 *      handled automatically with no extra bookkeeping.
 */
function computeTarget(
  mx: number,
  my: number,
  vw: number,
  vh: number
): { x: number; y: number } {
  // 1. Default: hover above cursor, centred horizontally on it
  let x = clamp(mx - ROBOT_W / 2, 8, vw - ROBOT_W - 8);
  let y = clamp(my - ROBOT_H - OFFSET_Y, 8, vh - ROBOT_H - 8);

  // 2. Collision with [data-robot-avoid] elements
  const avoidEls = document.querySelectorAll<HTMLElement>("[data-robot-avoid]");

  for (const el of avoidEls) {
    const r = el.getBoundingClientRect();
    const rl = r.left - BOX_PAD;
    const rr = r.right + BOX_PAD;
    const rt = r.top - BOX_PAD;
    const rb = r.bottom + BOX_PAD;

    // Skip if no horizontal overlap
    if (x + ROBOT_W <= rl || x >= rr) continue;

    // Skip if no vertical overlap
    if (y + ROBOT_H <= rt || y >= rb) continue;

    // Robot overlaps — prefer sitting ABOVE the box (feels like "waiting on top")
    const spaceAbove = rt;          // viewport top → box top
    const spaceBelow = vh - rb;     // box bottom   → viewport bottom

    if (spaceAbove >= ROBOT_H + 8) {
      // Enough room above: sit on top of the box
      y = rt - ROBOT_H - 4;
    } else if (spaceBelow >= ROBOT_H + 8) {
      // Not enough above: peek below the box
      y = rb + 4;
    } else {
      // Tight: slide to whichever vertical gap is bigger
      y = spaceAbove >= spaceBelow
        ? clamp(rt - ROBOT_H - 4, 0, vh - ROBOT_H)
        : clamp(rb + 4, 0, vh - ROBOT_H);
    }
  }

  return { x, y };
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function RobotAnimation() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);

  // All mutable state lives in refs → zero React re-renders
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const robotX = useRef(8);
  const robotY = useRef(80);

  useEffect(() => {
    // Start mouse at viewport centre to avoid corner flash on load
    mouseX.current = window.innerWidth / 2;
    mouseY.current = window.innerHeight / 2;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // ── Passive mouse tracking — won't block scroll ────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    // ── RAF animation loop ─────────────────────────────────────────────────
    let rafId: number;

    const tick = () => {
      const mx = mouseX.current;
      const my = mouseY.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const { x: tx, y: ty } = computeTarget(mx, my, vw, vh);

      // Smooth, lazy follow — LERP at 4% per frame (≈ 60 fps)
      robotX.current = lerp(robotX.current, tx, LERP);
      robotY.current = lerp(robotY.current, ty, LERP);

      // Direct DOM write — no React re-render triggered
      wrapper.style.transform =
        `translate(${robotX.current}px, ${robotY.current}px)`;

      // ── Pupil tracking ──────────────────────────────────────────────────
      const rcx = robotX.current + ROBOT_W / 2;
      const rcy = robotY.current + ROBOT_H / 2;
      const dx = mx - rcx;
      const dy = my - rcy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = Math.min(dist / 150, 1);
      const px = (dx / dist) * MAX_PUPIL * f;
      const py = (dy / dist) * MAX_PUPIL * f;

      leftPupilRef.current?.setAttribute("cx", String(LEFT_EYE.cx + px));
      leftPupilRef.current?.setAttribute("cy", String(LEFT_EYE.cy + py));
      rightPupilRef.current?.setAttribute("cx", String(RIGHT_EYE.cx + px));
      rightPupilRef.current?.setAttribute("cy", String(RIGHT_EYE.cy + py));

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: `${ROBOT_W}px`,
        pointerEvents: "none",      // never intercepts clicks or hovers
        zIndex: 49,
        willChange: "transform",  // hint browser to GPU-composite this layer
      }}
      aria-hidden="true"
    >
      <div className={styles.glow} />

      <svg
        viewBox="0 0 110 115"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        {/* Antenna */}
        <line x1="55" y1="6" x2="55" y2="24" className={styles.antennaStick} />
        <circle cx="55" cy="5" r="5" className={styles.antennaDot} />

        {/* Head & visor */}
        <rect x="8" y="24" width="94" height="76" rx="14" className={styles.head} />
        <rect x="18" y="36" width="74" height="44" rx="8" className={styles.visor} />

        {/* Eye sockets */}
        <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="12" className={styles.eyeOuter} />
        <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="12" className={styles.eyeOuter} />

        {/* Pupils — moved via setAttribute, never via state */}
        <circle ref={leftPupilRef} cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="5" className={styles.eyeInner} />
        <circle ref={rightPupilRef} cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="5" className={styles.eyeInner} />

        {/* Mouth */}
        <rect x="32" y="89" width="46" height="8" rx="4" className={styles.mouth} />
        <rect x="38" y="92" width="7" height="3" rx="1" className={styles.mouthGap} />
        <rect x="49" y="92" width="7" height="3" rx="1" className={styles.mouthGap} />
        <rect x="60" y="92" width="7" height="3" rx="1" className={styles.mouthGap} />

        {/* Neck */}
        <rect x="40" y="100" width="30" height="14" rx="5" className={styles.neck} />
      </svg>
    </div>
  );
}
