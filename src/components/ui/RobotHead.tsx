"use client";
import { useEffect, useRef } from "react";
import styles from "./RobotHead.module.css";

// ── Eye constants (relative to viewBox 0 0 160 155) ──────────────────────────
const MAX_PUPIL = 5;
// Head is centered horizontally at x=80 (was 55 in 110-wide viewBox)
// Head: x=23 width=114 → cx_left = 23+28 = 51, cx_right = 23+28+52 = 103 (approx)
const LEFT_EYE = { cx: 51, cy: 65 };
const RIGHT_EYE = { cx: 99, cy: 65 };

export default function RobotHead() {
    const svgRef = useRef<SVGSVGElement>(null);
    const leftPupilRef = useRef<SVGCircleElement>(null);
    const rightPupilRef = useRef<SVGCircleElement>(null);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            const svg = svgRef.current;
            if (!svg) return;

            const rect = svg.getBoundingClientRect();
            const rcx = rect.left + rect.width / 2;
            const rcy = rect.top + rect.height / 2;

            const dx = e.clientX - rcx;
            const dy = e.clientY - rcy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const f = Math.min(dist / 300, 1);
            const px = (dx / dist) * MAX_PUPIL * f;
            const py = (dy / dist) * MAX_PUPIL * f;

            leftPupilRef.current?.setAttribute("cx", String(LEFT_EYE.cx + px));
            leftPupilRef.current?.setAttribute("cy", String(LEFT_EYE.cy + py));
            rightPupilRef.current?.setAttribute("cx", String(RIGHT_EYE.cx + px));
            rightPupilRef.current?.setAttribute("cy", String(RIGHT_EYE.cy + py));
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMouseMove);
    }, []);

    return (
        <div className={styles.wrapper} aria-hidden="true">
            <div className={styles.glow} />
            <svg
                ref={svgRef}
                viewBox="0 0 160 170"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                {/* ── Antenna ── */}
                <line x1="80" y1="4" x2="80" y2="26" className={styles.antennaStick} />
                <circle cx="80" cy="4" r="5" className={styles.antennaDot} />

                {/* ── Head ── */}
                <rect x="23" y="26" width="114" height="80" rx="16" className={styles.head} />
                {/* Visor */}
                <rect x="35" y="38" width="90" height="48" rx="9" className={styles.visor} />

                {/* ── Eye sockets ── */}
                <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="14" className={styles.eyeOuter} />
                <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="14" className={styles.eyeOuter} />

                {/* ── Pupils — moved via setAttribute ── */}
                <circle ref={leftPupilRef} cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="5.5" className={styles.eyeInner} />
                <circle ref={rightPupilRef} cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="5.5" className={styles.eyeInner} />

                {/* ── Mouth ── */}
                <rect x="45" y="94" width="70" height="8" rx="4" className={styles.mouth} />
                <rect x="52" y="97" width="8" height="3" rx="1" className={styles.mouthGap} />
                <rect x="66" y="97" width="8" height="3" rx="1" className={styles.mouthGap} />
                <rect x="80" y="97" width="8" height="3" rx="1" className={styles.mouthGap} />

                {/* ── Neck ── */}
                <rect x="62" y="106" width="36" height="12" rx="5" className={styles.neck} />

                {/* ── Body (torso) ── */}
                <rect x="38" y="118" width="84" height="36" rx="10" className={styles.body} />
                {/* Chest detail — small panel */}
                <rect x="62" y="124" width="36" height="22" rx="5" className={styles.chestPanel} />
                {/* Panel indicator dot */}
                <circle cx="80" cy="135" r="5" className={styles.chestLed} />

                {/* ── Left arm ── (shoulder → elbow → hand) */}
                {/* Upper arm */}
                <rect x="16" y="118" width="22" height="10" rx="5" className={styles.arm} />
                {/* Lower arm / forearm */}
                <rect x="8" y="126" width="10" height="22" rx="5" className={styles.arm} />
                {/* Hand */}
                <rect x="5" y="146" width="16" height="10" rx="4" className={styles.hand} />

                {/* ── Right arm ── */}
                {/* Upper arm */}
                <rect x="122" y="118" width="22" height="10" rx="5" className={styles.arm} />
                {/* Lower arm / forearm */}
                <rect x="142" y="126" width="10" height="22" rx="5" className={styles.arm} />
                {/* Hand */}
                <rect x="139" y="146" width="16" height="10" rx="4" className={styles.hand} />
            </svg>
        </div>
    );
}
