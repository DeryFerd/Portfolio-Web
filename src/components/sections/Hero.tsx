import Link from "next/link";
import TypeWriter from "@/components/ui/TypeWriter";
import styles from "./Hero.module.css";

const focusAreas = [
  "LLM systems",
  "RAG pipelines",
  "Agent workflows",
  "Machine learning"
];

const roles = [
  "ML Engineer",
  "AI Engineer",
  "MLOps",
  "Data Engineer",
  "LLM Engineer"
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
            <span className={styles.titleRole}>
              <TypeWriter words={roles} speed={72} deleteSpeed={38} pauseDuration={1400} />
            </span>
          </h1>

          <p className={styles.description}>
            Specializing in machine learning, MLOps, RAG, and agent workflows
            for real-world AI products.
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
      </div>

      <div className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll for selected work</span>
      </div>
    </section>
  );
}
