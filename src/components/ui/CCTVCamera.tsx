"use client";

import { useEffect, useRef } from "react";
import styles from "./CCTVCamera.module.css";

interface CCTVCameraProps {
    /** Size of the svg in px. Default: 56 */
    size?: number;
    className?: string;
}

const SPRING_FACTOR = 0.16;
const SNAP_THRESHOLD = 0.1;

function unwrapAngle(nextAngle: number, referenceAngle: number) {
    const delta = ((((nextAngle - referenceAngle) % 360) + 540) % 360) - 180;
    return referenceAngle + delta;
}

/**
 * CCTV camera mounted at section level.
 * Tracks the global cursor position and rotates continuously to face it.
 */
export default function CCTVCamera({ size = 56, className = "" }: CCTVCameraProps) {
    const cameraBodyRef = useRef<SVGGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const currentAngleRef = useRef(0);
    const targetAngleRef = useRef(0);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const body = cameraBodyRef.current;
        const wrapper = wrapperRef.current;
        if (!body || !wrapper) return;

        const animate = () => {
            const delta = targetAngleRef.current - currentAngleRef.current;

            if (Math.abs(delta) < SNAP_THRESHOLD) {
                currentAngleRef.current = targetAngleRef.current;
            } else {
                currentAngleRef.current += delta * SPRING_FACTOR;
            }

            body.style.transform = `rotate(${currentAngleRef.current}deg)`;
            frameRef.current = window.requestAnimationFrame(animate);
        };

        const onPointerMove = (e: PointerEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const pivotX = rect.left + rect.width / 2;
            const pivotY = rect.top + rect.height / 2;
            const dx = e.clientX - pivotX;
            const dy = e.clientY - pivotY;
            const rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

            targetAngleRef.current = unwrapAngle(rawAngle, targetAngleRef.current);
        };

        frameRef.current = window.requestAnimationFrame(animate);
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        return () => {
            window.removeEventListener("pointermove", onPointerMove);

            if (frameRef.current !== null) {
                window.cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper} ${className}`}
            style={{ width: size, height: size }}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 56 56"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                <rect x="25" y="2" width="6" height="14" rx="2" className={styles.mount} />
                <rect x="18" y="14" width="20" height="4" rx="2" className={styles.mount} />

                <g
                    ref={cameraBodyRef}
                    style={{
                        transformOrigin: "50% 50%",
                        transformBox: "fill-box",
                        willChange: "transform",
                    }}
                >
                    <rect x="14" y="24" width="24" height="16" rx="4" className={styles.housing} />
                    <rect x="38" y="27" width="12" height="10" rx="3" className={styles.barrel} />
                    <circle cx="47" cy="32" r="4" className={styles.lens} />
                    <circle cx="47" cy="32" r="1.6" className={styles.lensGlare} />
                    <circle cx="19" cy="32" r="2.5" className={styles.led} />
                    <line x1="26" y1="29" x2="36" y2="29" className={styles.scanline} />
                    <line x1="26" y1="32" x2="36" y2="32" className={styles.scanline} />
                    <line x1="26" y1="35" x2="36" y2="35" className={styles.scanline} />
                </g>
            </svg>
        </div>
    );
}
