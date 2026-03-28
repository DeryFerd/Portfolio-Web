import Link from "next/link";
import styles from "./Hero.module.css";

const focusAreas = [
  "LLM systems",
  "RAG pipelines",
  "Agent workflows",
  "Machine learning"
];

const systemNotes = [
  {
    label: "Focus",
    value: "Turning model logic into useful AI products."
  },
  {
    label: "Approach",
    value: "Calm execution, strong delivery, and production intent."
  },
  {
    label: "Base",
    value: "Malang, Indonesia"
  }
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.mediaLayer} aria-hidden="true">
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/airplane-window.mp4" type="video/mp4" />
        </video>
        <div className={styles.videoShade} />
        <div className={styles.videoGlow} />
        <div className={styles.videoGrid} />
      </div>

      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>
            AI Engineer / LLM Systems / Malang, Indonesia
          </p>

          <h1 className={styles.title}>
            <span className={styles.titleName}>Dery Ferdika</span>
            <span className={styles.titleStatement}>
              Building AI systems that ship cleanly.
            </span>
          </h1>

          <p className={styles.description}>
            From retrieval pipelines and agent workflows to production-facing
            interfaces, I build machine learning products that feel useful,
            reliable, and ready for the real world.
          </p>

          <div className={styles.cta}>
            <Link href="/projects" className={styles.primaryBtn}>
              View Projects
            </Link>
            <a href="#contact" className={styles.secondaryBtn}>
              Get In Touch
            </a>
          </div>

          <div className={styles.focusRail}>
            {focusAreas.map((area) => (
              <span key={area} className={styles.focusPill}>
                {area}
              </span>
            ))}
          </div>
        </div>

        <aside className={styles.systemCard}>
          <p className={styles.cardLabel}>Current vector</p>
          <p className={styles.cardTitle}>Model logic to product delivery</p>
          <div className={styles.cardGrid}>
            {systemNotes.map((note) => (
              <div key={note.label} className={styles.cardRow}>
                <span className={styles.cardRowLabel}>{note.label}</span>
                <span className={styles.cardRowValue}>{note.value}</span>
              </div>
            ))}
          </div>
          <p className={styles.cardFooter}>
            Available for selected collaborations in 2026.
          </p>
        </aside>
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll for selected work</span>
      </div>
    </section>
  );
}
