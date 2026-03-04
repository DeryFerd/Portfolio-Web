"use client";
import { useEffect, useRef } from "react";
import styles from "./TransformerRobot.module.css";

const MAX_PUPIL = 6;
const LEFT_EYE = { cx: 88, cy: 88 };
const RIGHT_EYE = { cx: 152, cy: 88 };

export default function TransformerRobot() {
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
            const f = Math.min(dist / 400, 1);
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
                viewBox="0 0 240 310"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                {/* ════ HEAD CREST (top fin — classic Transformer) ════ */}
                <polygon points="112,2 128,2 126,34 114,34" className={styles.crest} />
                <polygon points="85,8 100,8 100,34 84,34" className={styles.crestSide} />
                <polygon points="140,8 156,8 156,34 140,34" className={styles.crestSide} />
                {/* Crest detail lines */}
                <line x1="120" y1="4" x2="120" y2="32" className={styles.crestLine} />
                <line x1="92" y1="10" x2="92" y2="32" className={styles.crestLine} />
                <line x1="148" y1="10" x2="148" y2="32" className={styles.crestLine} />

                {/* ════ EAR PANELS (iconic side boxes) ════════════════ */}
                {/* Left ear */}
                <rect x="14" y="42" width="28" height="68" rx="3" className={styles.earPlate} />
                <rect x="16" y="48" width="24" height="16" rx="2" className={styles.earDetail} />
                <rect x="16" y="68" width="24" height="16" rx="2" className={styles.earDetail} />
                <rect x="16" y="88" width="24" height="16" rx="2" className={styles.earDetail} />
                {/* Right ear */}
                <rect x="198" y="42" width="28" height="68" rx="3" className={styles.earPlate} />
                <rect x="200" y="48" width="24" height="16" rx="2" className={styles.earDetail} />
                <rect x="200" y="68" width="24" height="16" rx="2" className={styles.earDetail} />
                <rect x="200" y="88" width="24" height="16" rx="2" className={styles.earDetail} />

                {/* ════ MAIN HELMET ════════════════════════════════════ */}
                <polygon
                    points="42,35 198,35 214,55 212,138 192,150 48,150 28,138 26,55"
                    className={styles.helmet}
                />
                {/* Helmet bevel/chamfer edges */}
                <polygon
                    points="50,38 190,38 204,56 202,136 185,146 55,146 36,136 34,56"
                    className={styles.helmetInner}
                />

                {/* ════ BROW RIDGE ═════════════════════════════════════ */}
                {/* Left brow slab */}
                <polygon points="46,58 118,58 118,74 50,76 38,68" className={styles.brow} />
                {/* Right brow slab */}
                <polygon points="122,58 194,58 202,68 190,76 122,74" className={styles.brow} />
                {/* Brow bolts */}
                <circle cx="58" cy="66" r="3.5" className={styles.bolt} />
                <circle cx="102" cy="63" r="3" className={styles.bolt} />
                <circle cx="138" cy="63" r="3" className={styles.bolt} />
                <circle cx="182" cy="66" r="3.5" className={styles.bolt} />

                {/* ════ EYE SOCKETS ════════════════════════════════════ */}
                {/* Angular recessed socket frames */}
                <polygon
                    points="58,76 116,76 118,102 56,104 46,92"
                    className={styles.eyeSocket}
                />
                <polygon
                    points="124,76 182,76 194,92 182,104 122,102"
                    className={styles.eyeSocket}
                />
                {/* Glow rings */}
                <ellipse cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} rx="22" ry="17" className={styles.eyeGlow} />
                <ellipse cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} rx="22" ry="17" className={styles.eyeGlow} />
                {/* Eye lens */}
                <ellipse cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} rx="15" ry="11" className={styles.eyeLens} />
                <ellipse cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} rx="15" ry="11" className={styles.eyeLens} />
                {/* Iris */}
                <circle cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="7.5" className={styles.iris} />
                <circle cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="7.5" className={styles.iris} />
                {/* Pupil — cursor-tracked */}
                <circle ref={leftPupilRef} cx={LEFT_EYE.cx} cy={LEFT_EYE.cy} r="4" className={styles.pupil} />
                <circle ref={rightPupilRef} cx={RIGHT_EYE.cx} cy={RIGHT_EYE.cy} r="4" className={styles.pupil} />

                {/* ════ NOSE BRIDGE + FACE CENTRE ══════════════════════ */}
                <rect x="110" y="78" width="20" height="22" rx="3" className={styles.noseBridge} />

                {/* ════ MOUTHGUARD / FACE PLATE ════════════════════════ */}
                <polygon
                    points="52,110 188,110 196,132 188,146 52,146 44,132"
                    className={styles.mouthPlate}
                />
                {/* Grille slits */}
                {[116, 122, 128, 134, 140].map((y, i) => (
                    <line key={i} x1="62" y1={y} x2="178" y2={y} className={styles.grille} />
                ))}
                {/* Mouth plate bolts */}
                <circle cx="58" cy="128" r="3" className={styles.bolt} />
                <circle cx="182" cy="128" r="3" className={styles.bolt} />

                {/* ════ NECK ═══════════════════════════════════════════ */}
                <rect x="96" y="150" width="48" height="10" rx="3" className={styles.neckTop} />
                <rect x="100" y="160" width="40" height="8" rx="3" className={styles.neckTop} />
                <rect x="98" y="168" width="44" height="10" rx="3" className={styles.neckTop} />

                {/* ════ SHOULDER PAULDRONS (iconic wide armor) ═════════ */}
                {/* LEFT pauldron */}
                <polygon
                    points="0,155 72,155 82,178 78,228 54,238 4,225 0,195"
                    className={styles.pauldron}
                />
                {/* Pauldron layered plates */}
                <polygon points="4,160 70,160 78,178 62,185 6,183" className={styles.pauldronPlate} />
                <polygon points="4,188 66,188 72,210 54,218 4,214" className={styles.pauldronPlate} />
                {/* Pauldron bolts */}
                <circle cx="18" cy="170" r="3" className={styles.bolt} />
                <circle cx="52" cy="168" r="3" className={styles.bolt} />
                <circle cx="20" cy="202" r="3" className={styles.bolt} />
                <circle cx="56" cy="200" r="3" className={styles.bolt} />

                {/* RIGHT pauldron */}
                <polygon
                    points="240,155 168,155 158,178 162,228 186,238 236,225 240,195"
                    className={styles.pauldron}
                />
                <polygon points="236,160 170,160 162,178 178,185 234,183" className={styles.pauldronPlate} />
                <polygon points="236,188 174,188 168,210 186,218 236,214" className={styles.pauldronPlate} />
                <circle cx="222" cy="170" r="3" className={styles.bolt} />
                <circle cx="188" cy="168" r="3" className={styles.bolt} />
                <circle cx="220" cy="202" r="3" className={styles.bolt} />
                <circle cx="184" cy="200" r="3" className={styles.bolt} />

                {/* ════ CHEST ══════════════════════════════════════════ */}
                <polygon
                    points="78,178 162,178 174,194 172,262 158,272 82,272 68,262 66,194"
                    className={styles.chest}
                />
                {/* Left chest panel */}
                <polygon points="72,182 116,182 118,196 116,230 72,232 66,218 66,196" className={styles.chestPanel} />
                {/* Right chest panel */}
                <polygon points="168,182 124,182 122,196 124,230 168,232 174,218 174,196" className={styles.chestPanel} />
                {/* Chest panel detail lines */}
                <line x1="72" y1="200" x2="114" y2="200" className={styles.panelLine} />
                <line x1="72" y1="214" x2="114" y2="214" className={styles.panelLine} />
                <line x1="126" y1="200" x2="168" y2="200" className={styles.panelLine} />
                <line x1="126" y1="214" x2="168" y2="214" className={styles.panelLine} />

                {/* ════ MATRIX OF LEADERSHIP / SPARK CORE ═════════════ */}
                {/* Outer ring */}
                <circle cx="120" cy="244" r="20" className={styles.matrixOuter} />
                {/* Hexagonal energy cell */}
                <polygon
                    points="120,228 133,235 133,249 120,256 107,249 107,235"
                    className={styles.matrixHex}
                />
                {/* Inner spark */}
                <circle cx="120" cy="244" r="9" className={styles.matrixInner} />
                <circle cx="120" cy="244" r="5" className={styles.matrixCore} />

                {/* ════ UPPER ARMS ═════════════════════════════════════ */}
                {/* Left upper arm */}
                <rect x="4" y="170" width="36" height="72" rx="5" className={styles.arm} />
                <rect x="8" y="174" width="28" height="20" rx="3" className={styles.armPlate} />
                <rect x="8" y="198" width="28" height="20" rx="3" className={styles.armPlate} />
                <rect x="8" y="218" width="28" height="18" rx="3" className={styles.armPlate} />
                {/* Left elbow */}
                <ellipse cx="22" cy="244" rx="16" ry="10" className={styles.elbow} />
                {/* Left forearm */}
                <rect x="8" y="252" width="28" height="52" rx="4" className={styles.forearm} />
                <line x1="12" y1="266" x2="32" y2="266" className={styles.panelLine} />
                <line x1="12" y1="280" x2="32" y2="280" className={styles.panelLine} />
                {/* Left fist */}
                <rect x="5" y="301" width="34" height="20" rx="5" className={styles.fist} />

                {/* Right upper arm */}
                <rect x="200" y="170" width="36" height="72" rx="5" className={styles.arm} />
                <rect x="204" y="174" width="28" height="20" rx="3" className={styles.armPlate} />
                <rect x="204" y="198" width="28" height="20" rx="3" className={styles.armPlate} />
                <rect x="204" y="218" width="28" height="18" rx="3" className={styles.armPlate} />
                {/* Right elbow */}
                <ellipse cx="218" cy="244" rx="16" ry="10" className={styles.elbow} />
                {/* Right forearm */}
                <rect x="204" y="252" width="28" height="52" rx="4" className={styles.forearm} />
                <line x1="208" y1="266" x2="228" y2="266" className={styles.panelLine} />
                <line x1="208" y1="280" x2="228" y2="280" className={styles.panelLine} />
                {/* Right fist */}
                <rect x="201" y="301" width="34" height="20" rx="5" className={styles.fist} />

                {/* ════ LOWER CHEST / HIP CONNECTOR ═══════════════════ */}
                <polygon points="68,272 172,272 178,290 170,303 70,303 62,290" className={styles.hip} />
                <line x1="72" y1="283" x2="168" y2="283" className={styles.panelLine} />
                <line x1="74" y1="293" x2="166" y2="293" className={styles.panelLine} />
                {/* Hip bolts */}
                <circle cx="80" cy="288" r="3" className={styles.bolt} />
                <circle cx="160" cy="288" r="3" className={styles.bolt} />
            </svg>
        </div>
    );
}
