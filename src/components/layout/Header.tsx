"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LetsTalkPanel from "@/components/layout/LetsTalkPanel";
import PortfolioChatPanel from "@/components/layout/PortfolioChatPanel";
import ThemeToggle from "@/components/ui/ThemeToggle";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#blog", label: "Journal" },
];

const TOP_REVEAL_OFFSET = 24;
const DIRECTION_THRESHOLD = 10;

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const [isLetsTalkOpen, setIsLetsTalkOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const hiddenRef = useRef(false);

  useEffect(() => {
    let frameId: number | null = null;

    const commitVisibility = (nextHidden: boolean) => {
      if (hiddenRef.current === nextHidden) {
        return;
      }

      hiddenRef.current = nextHidden;
      setIsHidden(nextHidden);
    };

    const updateHeaderState = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= TOP_REVEAL_OFFSET) {
        commitVisibility(false);
        lastScrollYRef.current = currentScrollY;
        frameId = null;
        return;
      }

      if (Math.abs(delta) >= DIRECTION_THRESHOLD) {
        commitVisibility(delta < 0);
      }

      lastScrollYRef.current = currentScrollY;
      frameId = null;
    };

    const handleScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateHeaderState);
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isChatOpen && !isLetsTalkOpen) {
      return;
    }

    hiddenRef.current = false;
    setIsHidden(false);
  }, [isChatOpen, isLetsTalkOpen]);

  const handleOpenChat = () => {
    setIsLetsTalkOpen(false);
    setIsChatOpen(true);
  };

  return (
    <>
      <header
        className={styles.header}
        data-hidden={isChatOpen || isLetsTalkOpen ? false : isHidden}
        data-robot-avoid
      >
        <div className={`container ${styles.headerShell}`}>
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark}>D</span>
              <span className={styles.logoName}>Dery Ferdika</span>
            </Link>

            <nav className={styles.nav}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.contactButton}
                aria-haspopup="dialog"
                aria-expanded={isLetsTalkOpen}
                onClick={() => setIsLetsTalkOpen(true)}
              >
                Let&apos;s Talk
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <LetsTalkPanel
        open={isLetsTalkOpen}
        onClose={() => setIsLetsTalkOpen(false)}
        onOpenChat={handleOpenChat}
      />
      <PortfolioChatPanel
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}
