"use client";
import { useEffect, useRef } from "react";
import styles from "./CCTVCamera.module.css";

interface CCTVCameraProps {
    /** Size of the svg in px. Default: 56 */
    size?: number;
    className?: string;
}

/**
 * CCTV Camera — mounted at section level.
 * Tracks the GLOBAL cursor position and rotates to face it at all times.
 * No hover gating — always watching.
 */
export default function CCTVCamera({ size = 56, className = "" }: CCTVCameraProps) {
    const cameraBodyRef = useRef<SVGGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const body = cameraBodyRef.current;
        const wrapper = wrapperRef.current;
        if (!body || !wrapper) return;

        const onMouseMove = (e: MouseEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const pivotX = rect.left + rect.width / 2;
            const pivotY = rect.top + rect.height / 2;

            const dx = e.clientX - pivotX;
            const dy = e.clientY - pivotY;
            let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
            // Clamp to realistic surveillance arc: can't spin past its mount
            angle = Math.max(-75, Math.min(75, angle));

            body.style.transform = `rotate(${angle}deg)`;
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMouseMove);
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
                {/* ── Ceiling mount ── */}
                {/* Vertical stem */}
                <rect x="25" y="2" width="6" height="14" rx="2" className={styles.mount} />
                {/* Horizontal arm base */}
                <rect x="18" y="14" width="20" height="4" rx="2" className={styles.mount} />

                {/* ── Rotating camera body ── */}
                <g
                    ref={cameraBodyRef}
                    style={{
                        transition: "transform 0.1s ease-out",
                        transformOrigin: "50% 50%",
                    }}
                >
                    {/* Housing body */}
                    <rect x="14" y="24" width="24" height="16" rx="4" className={styles.housing} />
                    {/* Lens barrel */}
                    <rect x="38" y="27" width="12" height="10" rx="3" className={styles.barrel} />
                    {/* Lens glass */}
                    <circle cx="47" cy="32" r="4" className={styles.lens} />
                    <circle cx="47" cy="32" r="1.6" className={styles.lensGlare} />
                    {/* Recording LED */}
                    <circle cx="19" cy="32" r="2.5" className={styles.led} />
                    {/* Scan line detail */}
                    <line x1="26" y1="29" x2="36" y2="29" className={styles.scanline} />
                    <line x1="26" y1="32" x2="36" y2="32" className={styles.scanline} />
                    <line x1="26" y1="35" x2="36" y2="35" className={styles.scanline} />
                </g>
            </svg>
        </div>
    );
}
