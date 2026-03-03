"use client";

import styles from "./Marquee.module.css";

interface MarqueeProps {
  text: string;
}

export default function Marquee({ text }: MarqueeProps) {
  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marquee}>
        <span className={styles.text}>
          {text} • {text} • {text} • {text} • {text} • 
        </span>
        <span className={styles.text}>
          {text} • {text} • {text} • {text} • {text} • 
        </span>
      </div>
    </div>
  );
}
