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
    <div className={styles.container}>
      {/* Background Photo - Always present */}
      <div className={styles.photoLayer}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={styles.photo}
        />
      </div>

      {/* Curtain Layer - Covers photo when info box visible */}
      <AnimatePresence>
        {!isOpen && (
          <>
            <motion.div
              className={`${styles.curtain} ${styles.curtainLeft}`}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.div
              className={`${styles.curtain} ${styles.curtainRight}`}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Info Box Layer - Clickable, disappears when curtain opens */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="info-box"
            className={styles.infoBox}
            onClick={toggleCurtain}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.clickIndicator}>
              <Eye className={styles.icon} />
              <span className={styles.clickText}>Click to reveal</span>
            </div>
            <div className={styles.infoContent}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close Button - Only visible when photo shown */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            key="close-btn"
            className={styles.closeButton}
            onClick={toggleCurtain}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          >
            <EyeOff className={styles.icon} />
            <span>Click to close</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
