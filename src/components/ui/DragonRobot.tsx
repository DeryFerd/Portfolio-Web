"use client";
import { useEffect, useRef } from "react";
import styles from "./DragonRobot.module.css";

const MAX_PUPIL = 5;
const LEFT_EYE = { cx: 72, cy: 104 };
const RIGHT_EYE = { cx: 128, cy: 104 };

export default function DragonRobot() {
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
            const f = Math.min(dist / 350, 1);
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
                viewBox="0 0 200 280"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                {/* ════ HORNS ══════════════════════════════════════════ */}
                {/* Left horn — swept back */}
                <polygon points="42,4 68,72 28,80" className={styles.horn} />
                <polygon points="48,12 66,70 36,76" className={styles.hornInner} />
                {/* Left horn spike detail */}
                <line x1="45" y1="20" x2="38" y2="55" className={styles.hornRidge} />

                {/* Right horn — swept back */}
                <polygon points="158,4 132,72 172,80" className={styles.horn} />
                <polygon points="152,12 134,70 164,76" className={styles.hornInner} />
                <line x1="155" y1="20" x2="162" y2="55" className={styles.hornRidge} />

                {/* ════ HEAD ARMOR ═════════════════════════════════════ */}
                {/* Main skull plate */}
                <path
                    d="M28,78 L60,55 L140,55 L172,78 L178,128 L162,170 L38,170 L22,128 Z"
                    className={styles.headPlate}
                />
                {/* Top ridge (crest) */}
                <path
                    d="M80,55 L90,42 L100,38 L110,42 L120,55"
                    className={styles.crest}
                />

                {/* ════ BROW ARMOR ═════════════════════════════════════ */}
                <path d="M30,75 L95,72 L95,88 L32,92 Z" className={styles.brow} />
                <path d="M105,72 L170,75 L168,92 L105,88 Z" className={styles.brow} />
                {/* Brow bolts */}
                <circle cx="45" cy="82" r="3" className={styles.bolt} />
                <circle cx="82" cy="80" r="3" className={styles.bolt} />
                <circle cx="118" cy="80" r="3" className={styles.bolt} />
                <circle cx="155" cy="82" r="3" className={styles.bolt} />

                {/* ════ EYE SOCKETS ════════════════════════════════════ */}
                <ellipse cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} rx="26" ry="22" className={styles.eyeSocket} />
                <ellipse cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} rx="26" ry="22" className={styles.eyeSocket} />
                {/* Outer glow ring */}
                <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="19" className={styles.eyeOuter} />
                <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="19" className={styles.eyeOuter} />
                {/* Iris */}
                <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="11" className={styles.eyeIris} />
                <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="11" className={styles.eyeIris} />
                {/* Slit pupils — tracked via ref */}
                <circle ref={leftPupilRef} cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="5" className={styles.pupil} />
                <circle ref={rightPupilRef} cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="5" className={styles.pupil} />
                {/* Pupil slit overlay */}
                <ellipse cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} rx="2" ry="5" className={styles.slit} />
                <ellipse cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} rx="2" ry="5" className={styles.slit} />

                {/* ════ CHEEK ARMOR ════════════════════════════════════ */}
                <path d="M22,112 L44,105 L48,130 L24,138 Z" className={styles.cheek} />
                <path d="M178,112 L156,105 L152,130 L176,138 Z" className={styles.cheek} />
                {/* Scale texture on cheeks */}
                <path d="M28,115 Q36,110 42,116 Q36,122 28,118 Z" className={styles.scale} />
                <path d="M30,125 Q38,120 44,126 Q38,132 30,128 Z" className={styles.scale} />
                <path d="M158,115 Q166,110 172,116 Q166,122 158,118 Z" className={styles.scale} />
                <path d="M156,125 Q164,120 170,126 Q164,132 156,128 Z" className={styles.scale} />

                {/* ════ NOSE BRIDGE / FOREHEAD SCALES ═════════════════ */}
                <rect x="90" y="88" width="20" height="8" rx="3" className={styles.noseScale} />
                <rect x="88" y="98" width="24" height="7" rx="3" className={styles.noseScale} />
                <rect x="90" y="107" width="20" height="7" rx="3" className={styles.noseScale} />

                {/* ════ SNOUT ══════════════════════════════════════════ */}
                <path
                    d="M50,148 L68,168 L100,174 L132,168 L150,148 L145,142 L55,142 Z"
                    className={styles.snout}
                />
                {/* Nostril slits */}
                <ellipse cx="82" cy="155" rx="8" ry="4" className={styles.nostril} />
                <ellipse cx="118" cy="155" rx="8" ry="4" className={styles.nostril} />
                <line x1="80" y1="155" x2="90" y2="155" className={styles.nostrilSlit} />
                <line x1="110" y1="155" x2="126" y2="155" className={styles.nostrilSlit} />

                {/* ════ JAW & FANGS ════════════════════════════════════ */}
                {/* Upper jaw lip */}
                <path d="M52,168 L100,176 L148,168 L145,174 L100,182 L55,174 Z" className={styles.lip} />
                {/* Fang left */}
                <polygon points="72,180 78,206 84,180" className={styles.fang} />
                {/* Fang right */}
                <polygon points="116,180 122,206 128,180" className={styles.fang} />
                {/* Small fangs */}
                <polygon points="88,180 92,196 96,180" className={styles.fangSmall} />
                <polygon points="104,180 108,196 112,180" className={styles.fangSmall} />

                {/* ════ NECK ARMOR PLATES ══════════════════════════════ */}
                <rect x="64" y="206" width="72" height="14" rx="5" className={styles.neckPlate} />
                <rect x="72" y="218" width="56" height="12" rx="5" className={styles.neckPlate} />
                <rect x="80" y="228" width="40" height="10" rx="4" className={styles.neckPlate} />
                <rect x="88" y="236" width="24" height="9" rx="4" className={styles.neckPlate} />
                {/* Neck plate bolts */}
                <circle cx="72" cy="213" r="2" className={styles.bolt} />
                <circle cx="128" cy="213" r="2" className={styles.bolt} />
                <circle cx="80" cy="224" r="2" className={styles.bolt} />
                <circle cx="120" cy="224" r="2" className={styles.bolt} />

                {/* ════ LEFT MECHANICAL WING HINT ══════════════════════ */}
                <path d="M22,120 L2,100  L8,140  Z" className={styles.wing} />
                <path d="M22,125 L0,115  L4,150  Z" className={styles.wing} />
                <path d="M22,130 L4,128  L6,158  Z" className={styles.wingBone} />
                <line x1="6" y1="100" x2="22" y2="122" className={styles.wingRib} />
                <line x1="3" y1="112" x2="22" y2="128" className={styles.wingRib} />
                <line x1="4" y1="128" x2="22" y2="133" className={styles.wingRib} />

                {/* ════ RIGHT MECHANICAL WING HINT ═════════════════════ */}
                <path d="M178,120 L198,100 L192,140 Z" className={styles.wing} />
                <path d="M178,125 L200,115 L196,150 Z" className={styles.wing} />
                <path d="M178,130 L196,128 L194,158 Z" className={styles.wingBone} />
                <line x1="194" y1="100" x2="178" y2="122" className={styles.wingRib} />
                <line x1="197" y1="112" x2="178" y2="128" className={styles.wingRib} />
                <line x1="196" y1="128" x2="178" y2="133" className={styles.wingRib} />

                {/* ════ ENERGY CORE (chest glow) ═══════════════════════ */}
                <circle cx="100" cy="248" r="10" className={styles.core} />
                <circle cx="100" cy="248" r="6" className={styles.coreInner} />
            </svg>
        </div>
    );
}
