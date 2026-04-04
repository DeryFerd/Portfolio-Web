"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./CurtainReveal.module.css";

interface CurtainRevealProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
}

export default function CurtainReveal({
  imageSrc,
  imageAlt,
  children,
}: CurtainRevealProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCurtain = () => setIsOpen(!isOpen);

  return (
    <div className={styles.container} onClick={toggleCurtain}>
      {/* Background Photo Layer */}
      <div className={styles.photoLayer}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={styles.photo}
        />
      </div>

      {/* Curtain Layer - Covers photo when closed */}
      <AnimatePresence>
        {!isOpen && (
          <>
            {/* Left Curtain Panel */}
            <motion.div
              className={`${styles.curtain} ${styles.curtainLeft}`}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
            {/* Right Curtain Panel */}
            <motion.div
              className={`${styles.curtain} ${styles.curtainRight}`}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Foreground Info Content Layer */}
      <div className={styles.contentLayer}>
        {/* Click Indicator */}
        <div className={styles.clickIndicator}>
          {isOpen ? (
            <>
              <EyeOff className={styles.icon} />
              <span className={styles.clickText}>Click to close</span>
            </>
          ) : (
            <>
              <Eye className={styles.icon} />
              <span className={styles.clickText}>Click to reveal</span>
            </>
          )}
        </div>

        {/* Children Content (all the info) */}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
