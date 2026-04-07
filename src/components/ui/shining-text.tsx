"use client" 

import * as React from "react"

import { motion, AnimatePresence } from "motion/react";
 
export function ShiningText({text, className}: {text: string, className?: string}) {
  return (
    <motion.span
      className={`bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${className || ""}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: "linear",
      }}
    >
      {text}
    </motion.span>
  );
}

interface ThinkingToScrambleProps {
  thinkingText?: string;
  finalText: string;
  thinkingDuration?: number;
  scrambleSpeed?: number;
  className?: string;
}

export function ThinkingToScramble({
  thinkingText = "This Section is Thinking...",
  finalText,
  thinkingDuration = 1500,
  scrambleSpeed = 44,
  className
}: ThinkingToScrambleProps) {
  const [phase, setPhase] = React.useState<"thinking" | "scramble" | "done">("thinking");
  const [displayText, setDisplayText] = React.useState(thinkingText);
  const [mounted, setMounted] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
    setKey(prev => prev + 1); // Force re-render to start animation
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    
    const thinkingTimer = setTimeout(() => {
      setPhase("scramble");
    }, thinkingDuration);

    return () => clearTimeout(thinkingTimer);
  }, [mounted, thinkingDuration]);

  // Scramble effect for final text
  React.useEffect(() => {
    if (phase !== "scramble") return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let iteration = 0;
    const finalLength = finalText.length;
    const totalIterations = finalLength * 3;

    const interval = setInterval(() => {
      setDisplayText(
        finalText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            const charIteration = iteration - index * 3;
            if (charIteration < 3) {
              return chars[Math.floor(Math.random() * chars.length)];
            } else {
              return char;
            }
          })
          .join("")
      );

      iteration++;

      if (iteration >= totalIterations + 3) {
        setDisplayText(finalText);
        setPhase("done");
        clearInterval(interval);
      }
    }, scrambleSpeed);

    return () => clearInterval(interval);
  }, [phase, finalText, scrambleSpeed]);

  // Prevent hydration mismatch - render nothing or thinking text initially
  if (!mounted) {
    return <span className={className}>{thinkingText}</span>;
  }

  return (
    <AnimatePresence mode="wait" initial={true} key={key}>
      {phase === "thinking" && (
        <motion.span
          key="thinking"
          className={`bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${className || ""}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            backgroundPosition: ["200% 0", "-200% 0"]
          }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            opacity: { duration: 0.3 },
            y: { duration: 0.3 },
            backgroundPosition: {
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            },
          }}
        >
          {thinkingText}
        </motion.span>
      )}

      {(phase === "scramble" || phase === "done") && (
        <motion.span
          key="scramble"
          className={`${className || ""}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayText}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
