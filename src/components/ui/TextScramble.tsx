"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "!<>-_\\/[]{}=+*^?#abcdefghijklmnopqrstuvwxyz0123456789";

interface TextScrambleProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  trigger?: boolean;
  onComplete?: () => void;
}

export default function TextScramble({
  text,
  delay = 0,
  speed = 40,
  className = "",
  trigger = true,
  onComplete,
}: TextScrambleProps) {
  const [displayed, setDisplayed] = useState("");
  const frameRef = useRef<number | null>(null);
  const completedTextRef = useRef<string | null>(null);

  const scramble = useCallback(() => {
    const length = text.length;
    let resolved = 0;

    const chars = text.split("").map((char) =>
      char === " " ? " " : CHARS[Math.floor(Math.random() * CHARS.length)],
    );

    setDisplayed(chars.join(""));

    const step = () => {
      if (resolved >= length) {
        completedTextRef.current = text;
        setDisplayed(text);
        onComplete?.();
        return;
      }

      chars[resolved] = text[resolved];
      resolved += 1;

      for (let index = resolved; index < length; index += 1) {
        chars[index] =
          text[index] === " "
            ? " "
            : CHARS[Math.floor(Math.random() * CHARS.length)];
      }

      setDisplayed(chars.join(""));
      frameRef.current = window.setTimeout(step, speed);
    };

    frameRef.current = window.setTimeout(step, speed);
  }, [onComplete, speed, text]);

  useEffect(() => {
    if (!trigger) {
      setDisplayed("");
      return;
    }

    if (completedTextRef.current === text) {
      setDisplayed(text);
      return;
    }

    const timeout = window.setTimeout(scramble, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [delay, scramble, trigger, text]);

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
