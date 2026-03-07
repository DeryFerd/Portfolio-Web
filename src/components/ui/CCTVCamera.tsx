"use client";

import { useEffect, useId, useRef } from "react";
import styles from "./CCTVCamera.module.css";

interface CCTVCameraProps {
    /** Size of the svg in px. Default: 56 */
    size?: number;
    className?: string;
}

const SMOOTHING = 0.16;
const SNAP_THRESHOLD = 0.25;
const PIVOT_X_RATIO = 40 / 96;
const PIVOT_Y_RATIO = 73 / 112;
const TRACK_PIVOT_X = 40;
const TRACK_PIVOT_Y = 73;

function getShortestAngleDelta(target: number, current: number) {
    return ((((target - current) % 360) + 540) % 360) - 180;
}

export default function CCTVCamera({ size = 56, className = "" }: CCTVCameraProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackingRef = useRef<SVGGElement>(null);
    const currentAngleRef = useRef(0);
    const targetAngleRef = useRef(0);
    const frameRef = useRef<number | null>(null);
    const id = useId().replace(/:/g, "");

    const bracketGradientId = `${id}-bracket-gradient`;
    const bodyGradientId = `${id}-body-gradient`;
    const lowerShellGradientId = `${id}-lower-shell-gradient`;
    const seamGradientId = `${id}-seam-gradient`;
    const domeGlassId = `${id}-dome-glass`;
    const domeHighlightId = `${id}-dome-highlight`;
    const lensRingId = `${id}-lens-ring`;
    const lensCoreId = `${id}-lens-core`;
    const sensorMetalId = `${id}-sensor-metal`;
    const domeClipId = `${id}-dome-clip`;

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const trackingGroup = trackingRef.current;
        if (!wrapper || !trackingGroup) return;

        const animate = () => {
            const delta = getShortestAngleDelta(targetAngleRef.current, currentAngleRef.current);

            if (Math.abs(delta) < SNAP_THRESHOLD) {
                currentAngleRef.current = targetAngleRef.current;
            } else {
                currentAngleRef.current += delta * SMOOTHING;
            }

            trackingGroup.setAttribute(
                "transform",
                `rotate(${currentAngleRef.current} ${TRACK_PIVOT_X} ${TRACK_PIVOT_Y})`
            );
            frameRef.current = window.requestAnimationFrame(animate);
        };

        const onPointerMove = (event: PointerEvent) => {
            const rect = wrapper.getBoundingClientRect();
            const pivotX = rect.left + rect.width * PIVOT_X_RATIO;
            const pivotY = rect.top + rect.height * PIVOT_Y_RATIO;
            const dx = event.clientX - pivotX;
            const dy = event.clientY - pivotY;

            targetAngleRef.current = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
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
                viewBox="0 0 96 112"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.svg}
            >
                <defs>
                    <linearGradient id={bracketGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c8ccd1" />
                        <stop offset="42%" stopColor="#f8fafc" />
                        <stop offset="72%" stopColor="#d5d9de" />
                        <stop offset="100%" stopColor="#aeb4bc" />
                    </linearGradient>
                    <linearGradient id={bodyGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#e2e5e9" />
                        <stop offset="26%" stopColor="#fcfcfd" />
                        <stop offset="62%" stopColor="#dfe3e8" />
                        <stop offset="100%" stopColor="#bcc2ca" />
                    </linearGradient>
                    <linearGradient id={lowerShellGradientId} x1="8%" y1="10%" x2="86%" y2="82%">
                        <stop offset="0%" stopColor="#f9fbfd" />
                        <stop offset="35%" stopColor="#e7ebf0" />
                        <stop offset="68%" stopColor="#c5cbd3" />
                        <stop offset="100%" stopColor="#9ba3ad" />
                    </linearGradient>
                    <linearGradient id={seamGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(120, 128, 138, 0)" />
                        <stop offset="50%" stopColor="rgba(120, 128, 138, 0.55)" />
                        <stop offset="100%" stopColor="rgba(120, 128, 138, 0)" />
                    </linearGradient>
                    <radialGradient id={domeGlassId} cx="36%" cy="22%" r="78%">
                        <stop offset="0%" stopColor="#3f4750" />
                        <stop offset="30%" stopColor="#1b2027" />
                        <stop offset="72%" stopColor="#090c11" />
                        <stop offset="100%" stopColor="#020305" />
                    </radialGradient>
                    <radialGradient id={domeHighlightId} cx="26%" cy="18%" r="82%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.62)" />
                        <stop offset="28%" stopColor="rgba(255, 255, 255, 0.18)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </radialGradient>
                    <radialGradient id={lensRingId} cx="38%" cy="35%" r="72%">
                        <stop offset="0%" stopColor="#5b6570" />
                        <stop offset="55%" stopColor="#1e232a" />
                        <stop offset="100%" stopColor="#090b0f" />
                    </radialGradient>
                    <radialGradient id={lensCoreId} cx="35%" cy="35%" r="70%">
                        <stop offset="0%" stopColor="#0f2530" />
                        <stop offset="42%" stopColor="#071119" />
                        <stop offset="100%" stopColor="#020509" />
                    </radialGradient>
                    <radialGradient id={sensorMetalId} cx="35%" cy="30%" r="75%">
                        <stop offset="0%" stopColor="#d3d8dd" />
                        <stop offset="55%" stopColor="#87909a" />
                        <stop offset="100%" stopColor="#4a5159" />
                    </radialGradient>
                    <clipPath id={domeClipId}>
                        <ellipse cx="40" cy="73" rx="23" ry="27" transform="rotate(-17 40 73)" />
                    </clipPath>
                </defs>

                <path
                    d="M70 14h14c4.5 0 8 3.5 8 8v36c0 4.5-3.5 8-8 8h-9v-8h6c1.1 0 2-.9 2-2V28c0-1.1-.9-2-2-2H70z"
                    fill={`url(#${bracketGradientId})`}
                    stroke="rgba(120, 128, 138, 0.45)"
                    strokeWidth="1"
                />
                <circle cx="83" cy="29" r="2.1" fill="#eef1f4" stroke="#a2a9b1" strokeWidth="0.8" />
                <circle cx="83" cy="49" r="2.1" fill="#eef1f4" stroke="#a2a9b1" strokeWidth="0.8" />

                <ellipse cx="44" cy="16" rx="27" ry="7.5" fill={`url(#${bodyGradientId})`} opacity="0.95" />
                <path
                    d="M17 16c0-4.8 12.1-8.5 27-8.5S71 11.2 71 16v21c0 7.1-5.8 13-13 13H30c-7.2 0-13-5.9-13-13z"
                    fill={`url(#${bodyGradientId})`}
                    stroke="rgba(126, 133, 142, 0.45)"
                    strokeWidth="1"
                />
                <path d="M20 41h48" stroke={`url(#${seamGradientId})`} strokeWidth="1.2" />
                <path
                    d="M22 46c0-11.8 9.8-21.3 22-21.3S66 34.2 66 46v30.5C66 91 56.5 103 44 103S22 91 22 76.5z"
                    fill={`url(#${lowerShellGradientId})`}
                    stroke="rgba(120, 128, 138, 0.42)"
                    strokeWidth="1"
                />
                <path
                    d="M28 30c-5 4.3-8 10.8-8 18.5v25.5c0 15 9.7 27.8 24 28.8c-11.5-2.3-18-12.5-18-28.3V49c0-8.2 2.3-14.6 6.4-19z"
                    fill="rgba(255, 255, 255, 0.45)"
                    opacity="0.55"
                />

                <ellipse
                    cx="40"
                    cy="73"
                    rx="23"
                    ry="27"
                    transform="rotate(-17 40 73)"
                    fill={`url(#${domeGlassId})`}
                />
                <ellipse
                    cx="35"
                    cy="66"
                    rx="16"
                    ry="21"
                    transform="rotate(-17 35 66)"
                    fill={`url(#${domeHighlightId})`}
                    opacity="0.7"
                />

                <g ref={trackingRef} clipPath={`url(#${domeClipId})`} className={styles.trackingGroup}>
                    <line x1="40" y1="73" x2="40" y2="51" stroke="rgba(164, 174, 187, 0.6)" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="40" cy="55" r="5.2" fill={`url(#${sensorMetalId})`} stroke="rgba(208, 214, 220, 0.65)" strokeWidth="0.8" />
                    <circle cx="40" cy="73" r="15" fill={`url(#${lensRingId})`} stroke="rgba(190, 198, 206, 0.18)" strokeWidth="1" />
                    <circle cx="40" cy="73" r="9.4" fill={`url(#${lensCoreId})`} stroke="rgba(80, 92, 104, 0.55)" strokeWidth="0.9" />
                    <circle cx="44.5" cy="68.5" r="2" fill="rgba(137, 229, 255, 0.38)" />
                    <circle cx="28.5" cy="79.5" r="2.6" fill={`url(#${sensorMetalId})`} />
                    <circle cx="51.5" cy="79.5" r="2.6" fill={`url(#${sensorMetalId})`} />
                    <circle cx="28" cy="66" r="2.2" fill={`url(#${sensorMetalId})`} />
                    <circle cx="52" cy="66" r="2.2" fill={`url(#${sensorMetalId})`} />
                </g>

                <ellipse
                    cx="40"
                    cy="73"
                    rx="23"
                    ry="27"
                    transform="rotate(-17 40 73)"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth="1"
                />

                <circle cx="52" cy="60" r="2.3" className={styles.led} />
            </svg>
        </div>
    );
}
