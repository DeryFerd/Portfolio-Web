"use client";

import styles from "./IncomingLabel.module.css";

interface IncomingLabelProps {
  text?: string;
}

export default function IncomingLabel({ text = "More Incoming" }: IncomingLabelProps) {
  return (
    <span className={styles.label}>
      <span>{text}</span>
      <span className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
    </span>
  );
}
