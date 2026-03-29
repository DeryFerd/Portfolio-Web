import styles from "./Contact.module.css";

const socialLinks = [
  { name: "GitHub", url: "https://github.com" },
  { name: "LinkedIn", url: "https://linkedin.com" },
  { name: "Twitter", url: "https://twitter.com" },
  { name: "Medium", url: "https://medium.com" },
];

export default function Contact() {
  return (
    <section className={`section ${styles.contact}`} id="contact">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className={styles.kicker}>Contact</p>
            <h2 className={styles.title}>Have a project in mind?</h2>
            <p className={styles.text}>
              I&apos;m open to selected opportunities where AI systems need both
              technical depth and product-level clarity.
            </p>
            <a href="mailto:deryferdikao125@gmail.com" className={styles.email}>
              deryferdikao125@gmail.com
            </a>
          </div>

          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Base</span>
              <span className={styles.metaValue}>Malang, Indonesia</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Focus</span>
              <span className={styles.metaValue}>AI products, tooling, and interfaces</span>
            </div>
            <div className={styles.links}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
