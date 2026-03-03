import Link from "next/link";
import styles from "./Footer.module.css";

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: "[ ]" },
  { href: "https://linkedin.com", label: "LinkedIn", icon: "#" },
  { href: "https://twitter.com", label: "Twitter", icon: "@" },
];

export default function Footer() {
  return (
    <footer className={styles.footer} data-robot-avoid>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.copyright}>
          <span className="text-accent">&copy;</span> {new Date().getFullYear()} AI Engineer. All rights reserved.
        </div>
        <div className={styles.socials}>
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span className={styles.socialIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
