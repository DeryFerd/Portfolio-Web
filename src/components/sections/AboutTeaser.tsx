import Link from "next/link";
import styles from "./AboutTeaser.module.css";

const profileRows = [
  {
    label: "Base",
    value: "Malang, Indonesia"
  },
  {
    label: "Focus",
    value: "LLM systems, agent workflows, and machine learning products."
  },
  {
    label: "Working style",
    value: "Clarity first, production-minded, and deeply iterative."
  }
];

export default function AboutTeaser() {
  return (
    <section className={`section ${styles.about}`} id="about">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <p className={styles.kicker}>About</p>
            <h2 className={styles.title}>Human context behind the systems.</h2>
            <p className={styles.lead}>
              I work at the intersection of machine learning delivery and product
              execution, building AI systems that are useful outside the lab.
            </p>
            <p className={styles.text}>
              My work spans retrieval pipelines, agentic workflows, model
              operations, and the interfaces people actually use. I care about
              making intelligent systems feel clear, dependable, and ready for
              real environments.
            </p>
            <p className={styles.text}>
              I also enjoy translating complex AI ideas into approachable
              learning experiences, which is why teaching, writing, and system
              design all feed back into how I build.
            </p>
            <Link href="/about" className={styles.link}>
              Read full background
            </Link>
          </div>

          <aside className={styles.profileCard}>
            <p className={styles.cardLabel}>Operational profile</p>
            <div className={styles.cardRows}>
              {profileRows.map((row) => (
                <div key={row.label} className={styles.cardRow}>
                  <span className={styles.rowLabel}>{row.label}</span>
                  <span className={styles.rowValue}>{row.value}</span>
                </div>
              ))}
            </div>
            <p className={styles.cardNote}>
              Currently interested in product-facing AI systems, internal tools,
              and collaborations that need both technical depth and visual care.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
