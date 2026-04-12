"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const handleOpenChat = () => {
    setIsMobileMenuOpen(false);
    setIsLetsTalkOpen(false);
    setIsChatOpen(true);
  };

  const handleNavLinkClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/" || !href.startsWith("/#")) {
      return;
    }

    const targetId = href.slice(2);
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();
    hiddenRef.current = false;
    setIsHidden(false);

    const headerHeight =
      Number.parseFloat(
        window.getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
      ) || 64;

    const targetTop =
      targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

    window.history.replaceState(null, "", href);
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });

    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={styles.header}
        data-hidden={isChatOpen || isLetsTalkOpen || isMobileMenuOpen ? false : isHidden}
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
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.navLink}
                  onClick={(event) => handleNavLinkClick(event, link.href)}
                >
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
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLetsTalkOpen(true);
                }}
              >
                Let&apos;s Talk
              </button>
              <ThemeToggle />
              <button
                type="button"
                className={styles.mobileMenuButton}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-menu"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div
            id="mobile-nav-menu"
            className={styles.mobileMenuPanel}
            data-open={isMobileMenuOpen}
          >
            <nav className={styles.mobileNav}>
              {navLinks.map((link) => (
                <Link
                  key={`mobile-${link.href}`}
                  href={link.href}
                  className={styles.mobileNavLink}
                  onClick={(event) => handleNavLinkClick(event, link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button
              type="button"
              className={styles.mobileContactButton}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLetsTalkOpen(true);
              }}
            >
              Let&apos;s Talk
            </button>
          </div>
        </div>
      </header>
      <button
        type="button"
        className={styles.mobileMenuBackdrop}
        data-open={isMobileMenuOpen}
        aria-hidden={!isMobileMenuOpen}
        tabIndex={isMobileMenuOpen ? 0 : -1}
        onClick={() => setIsMobileMenuOpen(false)}
      />
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
