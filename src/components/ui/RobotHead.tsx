"use client";
import { useEffect, useRef } from "react";
import styles from "./RobotHead.module.css";

// ── Eye constants (same as original viewBox "0 0 110 115" head section) ──────
const MAX_PUPIL = 5;
const LEFT_EYE = { cx: 36, cy: 62 };
const RIGHT_EYE = { cx: 74, cy: 62 };

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
            {/*
        viewBox: 0 0 110 182
        Head section = identical to original (0 0 110 115)
        Body + arms extend from y=100 → y=182
      */}
            <svg
                ref={svgRef}
                viewBox="0 0 110 182"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                {/* ══ ANTENNA ════════════════════════════════ */}
                <line x1="55" y1="6" x2="55" y2="24" className={styles.antennaStick} />
                <circle cx="55" cy="5" r="5" className={styles.antennaDot} />

                {/* ══ HEAD (identical coords to original) ═══ */}
                <rect x="8" y="24" width="94" height="76" rx="14" className={styles.head} />
                <rect x="18" y="36" width="74" height="44" rx="8" className={styles.visor} />

                {/* ── Eye sockets (fill raised to 0.22 so they look teal, not black) ── */}
                <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="12" className={styles.eyeOuter} />
                <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="12" className={styles.eyeOuter} />

                {/* ── Iris rings (adds visible colour ring behind pupil) ── */}
                <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="7" className={styles.eyeIris} />
                <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="7" className={styles.eyeIris} />

                {/* ── Pupils — moved via ref, never re-renders ── */}
                <circle ref={leftPupilRef} cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="4.5" className={styles.eyeInner} />
                <circle ref={rightPupilRef} cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="4.5" className={styles.eyeInner} />

                {/* ── Mouth ── */}
                <rect x="32" y="89" width="46" height="8" rx="4" className={styles.mouth} />
                <rect x="38" y="92" width="7" height="3" rx="1" className={styles.mouthGap} />
                <rect x="49" y="92" width="7" height="3" rx="1" className={styles.mouthGap} />
                <rect x="60" y="92" width="7" height="3" rx="1" className={styles.mouthGap} />

                {/* ══ NECK ════════════════════════════════════ */}
                <rect x="40" y="100" width="30" height="12" rx="5" className={styles.neck} />

                {/* ══ TORSO ═══════════════════════════════════ */}
                <rect x="14" y="112" width="82" height="46" rx="10" className={styles.body} />
                {/* Chest panel */}
                <rect x="33" y="118" width="44" height="32" rx="5" className={styles.chestPanel} />
                {/* Chest LED */}
                <circle cx="55" cy="134" r="4.5" className={styles.chestLed} />

                {/* ══ LEFT ARM ════════════════════════════════ */}
                <circle cx="12" cy="122" r="6" className={styles.joint} />
                <rect x="2" y="114" width="12" height="26" rx="5" className={styles.arm} />
                <circle cx="8" cy="142" r="5" className={styles.joint} />
                <rect x="2" y="144" width="12" height="20" rx="5" className={styles.arm} />
                {/* Hand */}
                <rect x="0" y="163" width="16" height="9" rx="4" className={styles.hand} />
                {/* Fingers */}
                <rect x="1" y="171" width="4" height="5" rx="2" className={styles.finger} />
                <rect x="6" y="171" width="4" height="6" rx="2" className={styles.finger} />
                <rect x="11" y="171" width="4" height="5" rx="2" className={styles.finger} />

                {/* ══ RIGHT ARM ═══════════════════════════════ */}
                <circle cx="98" cy="122" r="6" className={styles.joint} />
                <rect x="96" y="114" width="12" height="26" rx="5" className={styles.arm} />
                <circle cx="102" cy="142" r="5" className={styles.joint} />
                <rect x="96" y="144" width="12" height="20" rx="5" className={styles.arm} />
                {/* Hand */}
                <rect x="94" y="163" width="16" height="9" rx="4" className={styles.hand} />
                {/* Fingers */}
                <rect x="95" y="171" width="4" height="5" rx="2" className={styles.finger} />
                <rect x="100" y="171" width="4" height="6" rx="2" className={styles.finger} />
                <rect x="105" y="171" width="4" height="5" rx="2" className={styles.finger} />
            </svg>
        </div>
    );
}
