"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./QuickPreviewDialog.module.css";

export interface QuickPreviewAction {
  href?: string;
  label: string;
  external?: boolean;
  onClick?: () => void;
}

export interface QuickPreviewSection {
  eyebrow: string;
  title: string;
  items: readonly string[];
  variant: "list" | "paragraphs";
}

export interface QuickPreviewCard {
  index: string;
  meta: string;
  title: string;
}

export interface QuickPreviewCardSection {
  eyebrow: string;
  title: string;
  description: string;
  cards: readonly QuickPreviewCard[];
}

export interface QuickPreviewDialogProps {
  category: string;
  cardSection: QuickPreviewCardSection;
  kindLabel: string;
  image: string;
  modalLabel: string;
  onClose: () => void;
  open: boolean;
  primaryAction: QuickPreviewAction;
  secondaryAction?: QuickPreviewAction;
  sections: readonly QuickPreviewSection[];
  summary: string;
  tags: readonly string[];
  title: string;
  year: string;
}

function ActionControl({
  action,
  className,
  onClose,
}: {
  action: QuickPreviewAction;
  className: string;
  onClose: () => void;
}) {
  const handleClick = () => {
    action.onClick?.();
    onClose();
  };

  if (action.href) {
    if (action.external) {
      return (
        <a
          href={action.href}
          target="_blank"
          rel="noreferrer noopener"
          className={className}
          onClick={handleClick}
        >
          {action.label}
        </a>
      );
    }

    return (
      <Link href={action.href} className={className} onClick={handleClick}>
        {action.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      suppressHydrationWarning
    >
      {action.label}
    </button>
  );
}

export default function QuickPreviewDialog({
  category,
  cardSection,
  kindLabel,
  image,
  modalLabel,
  onClose,
  open,
  primaryAction,
  secondaryAction,
  sections,
  summary,
  tags,
  title,
  year,
}: QuickPreviewDialogProps) {
  const [isMounted, setIsMounted] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const { visibleTags, hiddenTagCount } = useMemo(() => {
    const safeTags = tags.filter(Boolean);

    return {
      visibleTags: safeTags.slice(0, 4),
      hiddenTagCount: Math.max(0, safeTags.length - 4),
    };
  }, [tags]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !open) {
      const previousFocus = lastFocusedElementRef.current;

      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }

      lastFocusedElementRef.current = null;
      return undefined;
    }

    lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
    const previousBodyOverflow = document.body.style.overflow;
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
      document.body.style.overflow = previousBodyOverflow;
      window.clearTimeout(focusTimeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, onClose, open]);

  if (!isMounted || !open) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} data-open={open}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label={`Close ${modalLabel}`}
        onClick={onClose}
        suppressHydrationWarning
      />

      <div className={styles.shell}>
        <div
          className={styles.dialog}
          data-open={open}
          role="dialog"
          aria-modal="true"
          aria-hidden={!open}
          aria-labelledby={titleId}
          aria-label={modalLabel}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.header}>
            <div className={styles.headerMeta}>
              <span className={styles.metaChip}>{category}</span>
              <span className={styles.metaYear}>{year}</span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              aria-label={`Close ${modalLabel}`}
              onClick={onClose}
              suppressHydrationWarning
            >
              x
            </button>
          </div>

          <div className={styles.leadGrid}>
            <div className={styles.leadPanel}>
              <p className={styles.kindLabel}>{kindLabel}</p>
              <h3 id={titleId} className={styles.title}>
                {title}
              </h3>
              <p className={styles.summary}>{summary}</p>

              <div className={styles.tagRow}>
                {visibleTags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
                {hiddenTagCount > 0 ? (
                  <span className={styles.tagOverflow}>+{hiddenTagCount} more</span>
                ) : null}
              </div>

              <div className={styles.actionRow}>
                <ActionControl
                  action={primaryAction}
                  className={styles.primaryAction}
                  onClose={onClose}
                />
                {secondaryAction ? (
                  <ActionControl
                    action={secondaryAction}
                    className={styles.secondaryAction}
                    onClose={onClose}
                  />
                ) : null}
              </div>
            </div>

            <div className={styles.imageFrame}>
              <Image
                src={image}
                alt={title}
                width={1200}
                height={840}
                className={styles.image}
                unoptimized
              />
            </div>
          </div>

          <div className={styles.detailsGrid}>
            {sections.map((section) => (
              <section key={`${section.eyebrow}-${section.title}`} className={styles.detailSection}>
                <div className={styles.sectionHeader}>
                  <p className={styles.sectionEyebrow}>{section.eyebrow}</p>
                  <h4 className={styles.sectionTitle}>{section.title}</h4>
                </div>

                {section.variant === "list" ? (
                  <ol className={styles.numberedList}>
                    {section.items.map((item, index) => (
                      <li key={`${section.title}-${item}`} className={styles.numberedItem}>
                        <span className={styles.numberedIndex}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.numberedText}>{item}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className={styles.paragraphStack}>
                    {section.items.map((item) => (
                      <p key={`${section.title}-${item}`} className={styles.paragraph}>
                        {item}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          <section className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <p className={styles.sectionEyebrow}>{cardSection.eyebrow}</p>
              <h4 className={styles.sectionTitle}>{cardSection.title}</h4>
              <p className={styles.cardDescription}>{cardSection.description}</p>
            </div>

            <div className={styles.cardGrid}>
              {cardSection.cards.map((card) => (
                <article key={`${card.meta}-${card.title}`} className={styles.card}>
                  <div className={styles.cardMetaRow}>
                    <span className={styles.cardIndex}>{card.index}</span>
                    <span className={styles.cardMeta}>{card.meta}</span>
                  </div>
                  <h5 className={styles.cardTitle}>{card.title}</h5>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body
  );
}
