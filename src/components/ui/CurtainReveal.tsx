"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./CurtainReveal.module.css";
import { cn } from "@/lib/utils";

interface CurtainRevealProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
  className?: string;
  photoFit?: "cover" | "contain";
}

export default function CurtainReveal({
  imageSrc,
  imageAlt,
  children,
  className,
  photoFit = "cover",
}: CurtainRevealProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCurtain = () => setIsOpen(!isOpen);

  return (
    <div className={cn(styles.container, className)}>
      {/* Background Photo - Always present */}
      <div className={styles.photoLayer}>
        <img
          src={imageSrc}
          alt={imageAlt}
          className={cn(styles.photo, photoFit === "contain" && styles.photoContain)}
        />
        {/* Clickable overlay when photo is visible */}
        {isOpen && (
          <div className={styles.photoClickOverlay} onClick={toggleCurtain} />
        )}
      </div>

      {/* Curtain Layer - Covers photo when info box visible */}
      <AnimatePresence>
        {!isOpen && (
          <>
            <motion.div
              className={`${styles.curtain} ${styles.curtainLeft}`}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className={`${styles.curtain} ${styles.curtainRight}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1], delay: 0.02 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Close profile reveal"
          >
            <EyeOff className={styles.icon} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
