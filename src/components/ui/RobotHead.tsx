"use client";
import { useEffect, useRef } from "react";
import styles from "./RobotHead.module.css";

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
            // Centre of the robot SVG in viewport coords
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
