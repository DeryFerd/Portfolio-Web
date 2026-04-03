"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { certificates } from "@/lib/certificatesData";
import styles from "./Certificates.module.css";

const allCertificates = [...certificates].sort((left, right) =>
  right.issuedAt.localeCompare(left.issuedAt),
);
const latestCertificates = allCertificates.slice(0, 3);
const shelfOffsets = [
  { left: "0%", top: "2.2rem", rotate: "-8deg", depth: 1 },
  { left: "29%", top: "0.3rem", rotate: "-2deg", depth: 3 },
  { left: "58%", top: "1.8rem", rotate: "7deg", depth: 2 },
] as const;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const SWAP_DURATION_MS = 220;

function formatIssuedAt(value: string) {
  return DATE_FORMATTER.format(new Date(`${value}-01T00:00:00.000Z`));
}

export default function Certificates() {
  const [viewMode, setViewMode] = useState<"shelf" | "archive">("shelf");
  const [transitionState, setTransitionState] = useState<"idle" | "out" | "in">(
    "idle",
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const pendingViewRef = useRef<"shelf" | "archive">("shelf");
  const activeCertificate = allCertificates[activeIndex] ?? allCertificates[0];
  const isArchiveOpen = viewMode === "archive";
  const transitionClass =
    transitionState === "out"
      ? styles.viewLeaving
      : transitionState === "in"
        ? styles.viewEntering
        : "";

  useEffect(() => {
    if (transitionState !== "out") {
      return undefined;
    }

    const swapTimer = window.setTimeout(() => {
      setViewMode(pendingViewRef.current);
      setTransitionState("in");
    }, SWAP_DURATION_MS);

    return () => window.clearTimeout(swapTimer);
  }, [transitionState]);

  useEffect(() => {
    if (transitionState !== "in") {
      return undefined;
    }

    const settleTimer = window.setTimeout(() => {
      setTransitionState("idle");
    }, SWAP_DURATION_MS);

    return () => window.clearTimeout(settleTimer);
  }, [transitionState]);

  const handleToggleArchive = () => {
    if (transitionState !== "idle") {
      return;
    }

    pendingViewRef.current = isArchiveOpen ? "shelf" : "archive";
    setTransitionState("out");
  };

  return (
    <section className={`section ${styles.certificates}`} id="certificates">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.copy}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerIcon} aria-hidden="true">
                *
              </span>
              <p className={styles.kicker}>Certificates</p>
            </div>
            <h2 className={styles.title}>Formal training, kept visible and tidy.</h2>
            <p className={styles.text}>
              A lighter credential layer between public proof and shipped work.
              These are the latest three entries on the shelf, with a compact
              archive view for the rest.
            </p>
          </div>

          <button
            type="button"
            className={styles.archiveToggle}
            onClick={handleToggleArchive}
            aria-expanded={isArchiveOpen}
            aria-controls="certificate-archive"
            disabled={transitionState !== "idle"}
            suppressHydrationWarning
          >
            {isArchiveOpen ? "Hide certificates" : "View all certificates"}
          </button>
        </div>

        <div className={`${styles.viewport} ${transitionClass}`}>
          {isArchiveOpen ? (
            <div
              id="certificate-archive"
              className={styles.archiveGrid}
              aria-label="All certificates archive"
            >
              <div className={styles.archiveList}>
                {allCertificates.map((certificate, index) => (
                  <article
                    key={certificate.slug}
                    className={`${styles.archiveItem} ${index === activeIndex ? styles.archiveItemActive : ""}`}
                  >
                    <button
                      type="button"
                      className={`${styles.archiveTrigger} ${index === activeIndex ? styles.archiveTriggerActive : ""}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      suppressHydrationWarning
                    >
                      <span className={styles.archiveNumber}>
                        _ {String(index + 1).padStart(2, "0")} .
                      </span>
                      <span className={styles.archiveTitleRow}>
                        <span className={styles.archiveTitle}>{certificate.title}</span>
                        <span className={styles.archiveArrow} aria-hidden="true">
                          -&gt;
                        </span>
                      </span>
                      <span className={styles.archiveMeta}>
                        {certificate.issuer} / {formatIssuedAt(certificate.issuedAt)}
                      </span>
                    </button>
                  </article>
                ))}
              </div>

              <aside className={styles.detailPanel}>
                <div className={styles.detailStage}>
                  {allCertificates.map((certificate, index) => (
                    <Image
                      key={certificate.slug}
                      src={certificate.image}
                      alt={index === activeIndex ? certificate.title : ""}
                      fill
                      className={`${styles.detailImage} ${index === activeIndex ? styles.detailImageActive : ""}`}
                      sizes="(max-width: 1024px) 100vw, 24vw"
                      aria-hidden={index !== activeIndex}
                      unoptimized
                    />
                  ))}
                </div>

                <div className={styles.detailMeta}>
                  <p className={styles.detailDate}>
                    {formatIssuedAt(activeCertificate.issuedAt)}
                  </p>
                  <h3 className={styles.detailTitle}>{activeCertificate.title}</h3>
                  <p className={styles.detailIssuer}>{activeCertificate.issuer}</p>
                </div>
              </aside>
            </div>
          ) : (
            <div className={styles.shelfBlock}>
              <div
                className={styles.shelfStage}
                aria-label="Latest certificates shelf"
              >
                {latestCertificates.map((certificate, index) => {
                  const offset = shelfOffsets[index] ?? shelfOffsets[1];

                  return (
                    <div
                      key={certificate.slug}
                      className={styles.shelfDocument}
                      style={
                        {
                          "--document-left": offset.left,
                          "--document-top": offset.top,
                          "--document-rotate": offset.rotate,
                          "--document-depth": String(offset.depth),
                        } as CSSProperties
                      }
                    >
                      <Image
                        src={certificate.image}
                        alt={certificate.title}
                        fill
                        className={styles.shelfImage}
                        sizes="(max-width: 640px) 80vw, 30vw"
                        unoptimized
                      />
                    </div>
                  );
                })}
                <div className={styles.shelfRail} aria-hidden="true" />
              </div>

              <div className={styles.latestList}>
                {latestCertificates.map((certificate, index) => (
                  <article key={certificate.slug} className={styles.latestItem}>
                    <span className={styles.latestNumber}>
                      _ {String(index + 1).padStart(2, "0")} .
                    </span>
                    <div className={styles.latestBody}>
                      <h3 className={styles.latestTitle}>{certificate.title}</h3>
                      <p className={styles.latestMeta}>
                        {certificate.issuer} / {formatIssuedAt(certificate.issuedAt)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
