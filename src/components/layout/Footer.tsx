"use client";

import { usePathname } from "next/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  return (
    <footer className={styles.footer} data-robot-avoid>
      <div className="container">
        <div className={styles.shell}>
          <p className={styles.prompt}>Design &amp; built by Dery Ferdika</p>

          <div className={styles.bottomRow}>
            <div className={styles.signature}>AI systems, interfaces, and delivery.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
