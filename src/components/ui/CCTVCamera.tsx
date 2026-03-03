"use client";
import { useRef, useCallback } from "react";
import styles from "./CCTVCamera.module.css";

interface CCTVCameraProps {
    /** Size of the svg in px. Default: 44 */
    size?: number;
    /** ClassName passed from parent (used for hover visibility override) */
    className?: string;
}

export default function CCTVCamera({ size = 44, className = "" }: CCTVCameraProps) {
    const cameraBodyRef = useRef<SVGGElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const rotate = useCallback((e: React.MouseEvent) => {
        const wrapper = wrapperRef.current;
        const body = cameraBodyRef.current;
        if (!wrapper || !body) return;

        const rect = wrapper.getBoundingClientRect();
        const pivotX = rect.left + rect.width / 2;
        const pivotY = rect.top + rect.height / 2;

        const dx = e.clientX - pivotX;
        const dy = e.clientY - pivotY;
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        // Clamp to a natural surveillance arc (camera can't spin 360°)
        angle = Math.max(-65, Math.min(65, angle));

        body.style.transform = `rotate(${angle}deg)`;
        body.style.transformOrigin = "50% 50%";
    }, []);

    const reset = useCallback(() => {
        const body = cameraBodyRef.current;
        if (body) body.style.transform = "rotate(0deg)";
    }, []);

    return (
        <div
            ref={wrapperRef}
            className={`${styles.wrapper} ${className}`}
            style={{ width: size, height: size }}
            onMouseMove={rotate}
            onMouseLeave={reset}
        >
            <svg
                viewBox="0 0 44 44"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
                aria-hidden="true"
            >
                {/* Wall / ceiling bracket */}
                <rect x="20" y="2" width="4" height="11" rx="1.5" className={styles.mount} />
                <rect x="14" y="11" width="16" height="3" rx="1.5" className={styles.mount} />

                {/* Rotating camera body */}
                <g
                    ref={cameraBodyRef}
                    style={{ transition: "transform 0.12s ease-out", transformOrigin: "50% 50%" }}
                >
                    {/* Housing */}
                    <rect x="10" y="19" width="20" height="12" rx="3" className={styles.housing} />
                    {/* Barrel */}
                    <rect x="30" y="21" width="8" height="8" rx="2" className={styles.barrel} />
                    {/* Lens */}
                    <circle cx="36" cy="25" r="3" className={styles.lens} />
                    <circle cx="36" cy="25" r="1.2" className={styles.lensGlare} />
                    {/* Recording LED */}
                    <circle cx="14" cy="25" r="2" className={styles.led} />
                </g>
            </svg>
        </div>
    );
}
