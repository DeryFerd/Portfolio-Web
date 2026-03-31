"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "./LetsTalkPanel.module.css";

interface LetsTalkPanelProps {
  open: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

export default function LetsTalkPanel({
  open,
  onClose,
  onOpenChat,
}: LetsTalkPanelProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return (
    <div className={styles.overlay} data-open={open}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close Let's Talk panel"
        onClick={onClose}
      />

      <div className={`container ${styles.shell}`}>
        <aside
          className={styles.panel}
          data-open={open}
          role="dialog"
          aria-modal="true"
          aria-hidden={!open}
          aria-label="Let's Talk panel"
        >
          <div className={styles.topbar} aria-hidden="true">
            <span className={styles.grip} />
          </div>

          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>Let&apos;s talk</h2>
              <p className={styles.kicker}>Open to projects and collaborations</p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close Let's Talk panel"
              onClick={onClose}
            >
              x
            </button>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          <div className={styles.actions}>
            <Link
              href="/#contact"
              className={`${styles.card} ${styles.primaryCard}`}
              onClick={onClose}
            >
              <div>
                <h3 className={styles.cardTitle}>Send me a message</h3>
                <p className={styles.cardMeta}>I reply within a day</p>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                -&gt;
              </span>
            </Link>

            <div className={styles.grid}>
              <button
                type="button"
                className={styles.card}
                onClick={onOpenChat}
              >
                <div>
                  <h3 className={styles.cardTitle}>Chat with my assistant</h3>
                  <p className={styles.cardMeta}>Instant AI response</p>
                </div>
                <span className={styles.badge}>AI</span>
              </button>

              <a
                href="mailto:deryferdikao125@gmail.com"
                className={styles.card}
                onClick={onClose}
              >
                <div>
                  <h3 className={styles.cardTitle}>Send an email</h3>
                  <p className={styles.cardMeta}>deryferdikao125@gmail.com</p>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  -&gt;
                </span>
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
