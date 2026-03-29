import Link from "next/link";
import styles from "./Footer.module.css";

const socialLinks = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://twitter.com", label: "Twitter" },
];

export default function Footer() {
  return (
    <footer className={styles.footer} data-robot-avoid>
      <div className="container">
        <div className={styles.shell}>
          <p className={styles.prompt}>Design &amp; built by Dery Ferdika</p>
          <a href="mailto:deryferdikao125@gmail.com" className={styles.email}>
            deryferdikao125@gmail.com
          </a>

          <div className={styles.bottomRow}>
            <div className={styles.signature}>AI systems, interfaces, and delivery.</div>
            <div className={styles.socials}>
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
