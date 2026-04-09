"use client";

import { useState } from "react";
import SectionHeadline from "@/components/ui/SectionHeadline";
import SectionSubheadline from "@/components/ui/SectionSubheadline";
import { StaggerCertificates, CertificateItem } from "@/components/ui/stagger-certificates";
import { certificates } from "@/lib/certificatesData";
import styles from "./Certificates.module.css";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatIssuedAt(value: string) {
  return DATE_FORMATTER.format(new Date(`${value}-01T00:00:00.000Z`));
}

export default function Certificates() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Transform certificates data for StaggerCertificates
  const certificateItems: CertificateItem[] = certificates.map((cert) => ({
    id: cert.slug,
    title: cert.title,
    issuer: cert.issuer,
    issuedAt: formatIssuedAt(cert.issuedAt),
    image: cert.image,
  }));

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
            <SectionHeadline
              text="Foundations & Continuous Learning."
              className={styles.title}
            />
            <SectionSubheadline
              text="AI moves fast, so I keep my fundamentals sharp. These certifications represent my structured approach to mastering new architectures and staying current with industry standards."
              className={styles.text}
            />
          </div>
        </div>

        <div className={styles.carouselWrapper}>
          <StaggerCertificates 
            certificates={certificateItems} 
            className={styles.staggerContainer}
            onIndexChange={setActiveIndex}
          />
        </div>

        {/* Certificate Counter */}
        <div className={styles.counter}>
          <span className={styles.counterCurrent}>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className={styles.counterDivider}>/</span>
          <span className={styles.counterTotal}>{String(certificates.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
