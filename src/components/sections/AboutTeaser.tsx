import Link from "next/link";
import styles from "./AboutTeaser.module.css";

export default function AboutTeaser() {
  return (
    <section className={`section ${styles.about}`}>
      <div className="container">
        <div className={styles.content}>
          <h2 className={styles.sectionTitle}>
            <span className="text-accent">#</span> About Me
          </h2>
          <p className={styles.text}>
            I&apos;m an AI Engineer passionate about building intelligent systems 
            that solve real-world problems. With a strong foundation in machine 
            learning and deep learning, I specialize in NLP and computer vision applications.
          </p>
          <p className={styles.text}>
            Currently focused on large language models and their practical applications. 
            I love turning complex problems into elegant AI solutions.
          </p>
          <Link href="/about" className={styles.link}>
            Read More &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
