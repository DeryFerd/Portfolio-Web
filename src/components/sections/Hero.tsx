import Link from "next/link";
import TypeWriter from "@/components/ui/TypeWriter";
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
        <div className={styles.greeting}>
          <span className="text-accent">//</span> Hello, World
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
        <Link href="/blog" className={styles.blogLink}>
          Check my posts on my blog →
        </Link>
      </div>
    </section>
  );
}
