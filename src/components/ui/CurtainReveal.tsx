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

  const isSvg = imageSrc.endsWith(".svg");

  return (
    <div className={styles.container}>
      {/* Default State - Info Box */}
      <AnimatePresence mode="wait">
        {!isOpen && (
          <motion.div
            key="info-box"
            className={styles.infoBox}
            onClick={toggleCurtain}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Click Indicator */}
            <div className={styles.clickIndicator}>
              <Eye className={styles.icon} />
              <span className={styles.clickText}>Click to reveal</span>
            </div>

            {/* Info Content */}
            <div className={styles.infoContent}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open State - Full Image with Curtain Effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="image-container"
            className={styles.imageContainer}
            onClick={toggleCurtain}
            initial={{ clipPath: "inset(0 50% 0 50%)" }}
            animate={{ clipPath: "inset(0 0% 0 0%)" }}
            exit={{ clipPath: "inset(0 50% 0 50%)" }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Curtain Left */}
            <motion.div
              className={`${styles.curtain} ${styles.curtainLeft}`}
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              exit={{ x: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
            />

            {/* Curtain Right */}
            <motion.div
              className={`${styles.curtain} ${styles.curtainRight}`}
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              exit={{ x: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
            />

            {/* Full Image - Use img for SVG, Next Image for others */}
            <div className={styles.imageWrapper}>
              {isSvg ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className={styles.fullImage}
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className={styles.fullImage}
                />
              )}
            </div>

            {/* Close Indicator */}
            <motion.div
              className={styles.closeIndicator}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.2 }}
            >
              <EyeOff className={styles.icon} />
              <span className={styles.closeText}>Click to close</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
