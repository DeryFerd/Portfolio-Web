"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Characters used for the scramble effect
const CHARS = "!<>-_\\/[]{}—=+*^?#abcdefghijklmnopqrstuvwxyz0123456789";

interface TextScrambleProps {
    /** The final text to reveal */
    text: string;
    /** Delay before animation starts (ms) */
    delay?: number;
    /** How fast each character resolves (ms per char) */
    speed?: number;
    /** Extra CSS class */
    className?: string;
    /** Whether to trigger the animation (e.g. on scroll into view) */
    trigger?: boolean;
}

/**
 * TextScramble — characters start as random glyphs and
 * progressively "decode" into the real text.
 */
export default function TextScramble({
    text,
    delay = 0,
    speed = 40,
    className = "",
    trigger = true,
}: TextScrambleProps) {
    const [displayed, setDisplayed] = useState<string>("");
    const frameRef = useRef<number | null>(null);
    const hasRun = useRef(false);

    const scramble = useCallback(() => {
        const length = text.length;
        let resolved = 0;

        // Build initial fully-scrambled string
        const chars = text.split("").map((ch) =>
            ch === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)]
        );
        setDisplayed(chars.join(""));

        const step = () => {
            if (resolved >= length) {
                setDisplayed(text);
                return;
            }

            // Resolve the next character
            chars[resolved] = text[resolved];
            resolved++;

            // Randomise remaining unresolved characters
            for (let i = resolved; i < length; i++) {
                if (text[i] === " ") {
                    chars[i] = " ";
                } else {
                    chars[i] = CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplayed(chars.join(""));
            frameRef.current = window.setTimeout(step, speed);
        };

        // Start the first step
        frameRef.current = window.setTimeout(step, speed);
    }, [text, speed]);

    useEffect(() => {
        if (!trigger || hasRun.current) return;
        hasRun.current = true;

        const timeout = window.setTimeout(scramble, delay);
        return () => {
            clearTimeout(timeout);
            if (frameRef.current) clearTimeout(frameRef.current);
        };
    }, [trigger, delay, scramble]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (frameRef.current) clearTimeout(frameRef.current);
        };
    }, []);

    return (
        <span className={className} aria-label={text}>
            {displayed}
        </span>
    );
}
