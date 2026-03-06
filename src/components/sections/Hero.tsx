import Link from "next/link";
import TypeWriter from "@/components/ui/TypeWriter";
import TransformerRobot from "@/components/ui/TransformerRobot";
import styles from "./Hero.module.css";

const roles = [
  "AI Engineer",
  "LLM Engineer",
  "LLM DevOps",
  "ML Engineer",
  "DL Engineer"
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>

        {/* ── Text column (left) ── */}
        <div className={styles.heroContent}>
          <div className={styles.greeting}>
            <span className="text-accent">{"//"}</span> Ferdika, Dery
          </div>
          <h1 className={styles.title}>
            <TypeWriter words={roles} speed={80} deleteSpeed={40} pauseDuration={1500} />
          </h1>
          <p className={styles.description}>
            Specializing in machine learning, deep learning, and AI solutions.
            Turning data into insights, models into products.
          </p>
          <div className={styles.cta}>
            <Link href="/projects" className={styles.primaryBtn}>
              View Projects
            </Link>
            <a href="#contact" className={styles.secondaryBtn}>
              Get In Touch
            </a>
          </div>
          <div className={styles.tags}>
            <span className={styles.tag}>Machine Learning</span>
            <span className={styles.tag}>Deep Learning</span>
            <span className={styles.tag}>NLP</span>
            <span className={styles.tag}>Computer Vision</span>
          </div>
        </div>

        {/* ── Transformer Robot column (right) ── */}
        <div className={styles.characterCol}>
          <TransformerRobot />
        </div>

      </div>
    </section>
  );
}


