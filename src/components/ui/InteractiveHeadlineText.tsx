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
  const words = text.split(" ");

  return (
    <span className={`${styles.headlineText} ${className}`} aria-label={text}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className={styles.word}>{word}</span>
          {index < words.length - 1 ? <span className={styles.space}> </span> : null}
        </span>
      ))}
    </span>
  );
}
