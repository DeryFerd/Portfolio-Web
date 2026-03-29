import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import styles from "./Header.module.css";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#blog", label: "Journal" },
];

export default function Header() {
  return (
    <header className={styles.header} data-robot-avoid>
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
            <Link href="/#contact" className={styles.contactLink}>
              Let&apos;s Talk
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
