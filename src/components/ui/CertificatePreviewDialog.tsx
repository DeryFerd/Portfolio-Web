"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CertificatePreviewDialog.module.css";

interface CertificatePreviewDialogProps {
  image: string;
  issuer: string;
  onClose: () => void;
  open: boolean;
  title: string;
}

export default function CertificatePreviewDialog({
  image,
  issuer,
  onClose,
  open,
  title,
}: CertificatePreviewDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimeoutId = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 24);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, onClose, open]);

  if (!isMounted || !open) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label={`Close ${title} preview`}
        onClick={onClose}
        suppressHydrationWarning
      />

      <div className={styles.shell}>
        <div
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.header}>
            <div className={styles.meta}>
              <p className={styles.eyebrow}>Certificate preview</p>
              <h3 id={titleId} className={styles.title}>
                {title}
              </h3>
              <p className={styles.issuer}>{issuer}</p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              aria-label={`Close ${title} preview`}
              onClick={onClose}
              suppressHydrationWarning
            >
              Close
            </button>
          </div>

          <div className={styles.frame}>
            <Image
              src={image}
              alt={title}
              width={1800}
              height={1275}
              className={styles.image}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
