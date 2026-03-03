"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./RobotAnimation.module.css";

// Posisi mata dalam SVG viewBox (0 0 220 310)
const LEFT_EYE = { x: 85, y: 76 };
const RIGHT_EYE = { x: 135, y: 76 };
const MAX_OFFSET = 5; // batas gerak pupil dalam unit SVG

export default function RobotAnimation() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const svg = svgRef.current;
            if (!svg) return;

            const rect = svg.getBoundingClientRect();

            // Konversi mouse ke koordinat SVG
            const scaleX = 220 / rect.width;
            const scaleY = 310 / rect.height;
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;

            // Gunakan mata kiri sebagai referensi tengah (keduanya bergerak sama)
            const cx = (LEFT_EYE.x + RIGHT_EYE.x) / 2;
            const cy = (LEFT_EYE.y + RIGHT_EYE.y) / 2;

            const dx = mouseX - cx;
            const dy = mouseY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            // Normalisasi → skala maksimal MAX_OFFSET, makin jauh makin full
            const factor = Math.min(dist / 120, 1);
            setOffset({
                x: (dx / dist) * MAX_OFFSET * factor,
                y: (dy / dist) * MAX_OFFSET * factor,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const lx = LEFT_EYE.x + offset.x;
    const ly = LEFT_EYE.y + offset.y;
    const rx = RIGHT_EYE.x + offset.x;
    const ry = RIGHT_EYE.y + offset.y;

    return (
        <div className={styles.wrapper}>
            <div className={styles.glow} />
            <div className={styles.floatContainer}>
                <svg
                    ref={svgRef}
                    viewBox="0 0 220 310"
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.svg}
                    aria-label="AI Robot"
                >
                    {/* ── Antenna ── */}
                    <line x1="110" y1="8" x2="110" y2="38" className={styles.antennaStick} />
                    <circle cx="110" cy="7" r="6" className={styles.antennaDot} />

                    {/* ── Head ── */}
                    <rect x="45" y="38" width="130" height="90" rx="14" className={styles.head} />

                    {/* Visor */}
                    <rect x="58" y="52" width="104" height="48" rx="8" className={styles.visor} />

                    {/* Eye outer (static) */}
                    <circle cx={LEFT_EYE.x} cy={LEFT_EYE.y} r="13" className={styles.eyeOuter} />
                    <circle cx={RIGHT_EYE.x} cy={RIGHT_EYE.y} r="13" className={styles.eyeOuter} />

                    {/* Pupils (follow mouse) */}
                    <circle cx={lx} cy={ly} r="6" className={styles.eyeInner} />
                    <circle cx={rx} cy={ry} r="6" className={styles.eyeInner} />

                    {/* Mouth */}
                    <rect x="78" y="107" width="64" height="10" rx="5" className={styles.mouth} />
                    <rect x="86" y="110" width="10" height="4" rx="2" className={styles.mouthGap} />
                    <rect x="100" y="110" width="10" height="4" rx="2" className={styles.mouthGap} />
                    <rect x="114" y="110" width="10" height="4" rx="2" className={styles.mouthGap} />
                    <rect x="128" y="110" width="10" height="4" rx="2" className={styles.mouthGap} />

                    {/* ── Neck ── */}
                    <rect x="92" y="128" width="36" height="16" rx="5" className={styles.neck} />

                    {/* ── Body ── */}
                    <rect x="22" y="144" width="176" height="110" rx="12" className={styles.body} />
                    <rect x="42" y="158" width="136" height="82" rx="8" className={styles.panel} />

                    {/* Status lights */}
                    <circle cx="68" cy="174" r="6" className={styles.light1} />
                    <circle cx="90" cy="174" r="6" className={styles.light2} />
                    <circle cx="112" cy="174" r="6" className={styles.light3} />

                    {/* Progress bars */}
                    <rect x="55" y="190" width="110" height="5" rx="2.5" className={styles.barTrack} />
                    <rect x="55" y="190" width="80" height="5" rx="2.5" className={styles.barFill1} />
                    <rect x="55" y="202" width="110" height="5" rx="2.5" className={styles.barTrack} />
                    <rect x="55" y="202" width="50" height="5" rx="2.5" className={styles.barFill2} />
                    <rect x="55" y="214" width="110" height="5" rx="2.5" className={styles.barTrack} />
                    <rect x="55" y="214" width="95" height="5" rx="2.5" className={styles.barFill3} />

                    {/* Ear ports */}
                    <circle cx="34" cy="185" r="8" className={styles.earPort} />
                    <circle cx="186" cy="185" r="8" className={styles.earPort} />

                    {/* ── Arms ── */}
                    <rect x="-2" y="150" width="28" height="85" rx="10" className={styles.arm} />
                    <rect x="194" y="150" width="28" height="85" rx="10" className={styles.arm} />
                    <rect x="-6" y="228" width="36" height="22" rx="7" className={styles.hand} />
                    <rect x="190" y="228" width="36" height="22" rx="7" className={styles.hand} />

                    {/* ── Legs ── */}
                    <rect x="52" y="254" width="46" height="50" rx="9" className={styles.leg} />
                    <rect x="122" y="254" width="46" height="50" rx="9" className={styles.leg} />
                    <rect x="42" y="294" width="64" height="16" rx="6" className={styles.foot} />
                    <rect x="114" y="294" width="64" height="16" rx="6" className={styles.foot} />

                    {/* ── Scan line ── */}
                    <rect x="45" y="0" width="130" height="3" rx="1" className={styles.scanLine} />
                </svg>
            </div>
        </div>
    );
}
