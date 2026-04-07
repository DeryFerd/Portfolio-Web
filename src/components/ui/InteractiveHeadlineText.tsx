"use client";

import styles from "./InteractiveHeadlineText.module.css";

interface InteractiveHeadlineTextProps {
  text: string;
  className?: string;
}

export default function InteractiveHeadlineText({
  text,
  className = "",
}: InteractiveHeadlineTextProps) {
  return (
    <span className={`${styles.headlineText} ${className}`} aria-label={text}>
      <span className={styles.line}>{text}</span>
    </span>
  );
}
