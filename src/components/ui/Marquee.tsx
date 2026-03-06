"use client";

import styles from "./Marquee.module.css";

interface MarqueeProps {
  text: string;
}

export default function Marquee({ text }: MarqueeProps) {
  const separatorPattern = /\s*[\u2022\u00B7]\s*$/;
  const separator = "\u2022";
  const normalizedText = text.replace(separatorPattern, "").trim();
  const repeatedText = Array.from({ length: 5 }, () => normalizedText).join(` ${separator} `);

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marquee}>
        <span className={styles.text}>{repeatedText}</span>
        <span className={styles.text}>{repeatedText}</span>
      </div>
    </div>
  );
}
