import Image from "next/image";
import Link from "next/link";
import styles from "./AboutTeaser.module.css";

export default function AboutTeaser() {
  return (
    <section className={`section ${styles.about}`}>
      <div className="container">
        <div className={styles.wrapper}>

          {/* ── Text column (left) ── */}
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

          {/* ── Photo frame (right) ── */}
          <div className={styles.photoCol}>
            <div className={styles.frameOuter}>
              <div className={styles.cornerTL} />
              <div className={styles.cornerTR} />
              <div className={styles.cornerBL} />
              <div className={styles.cornerBR} />
              <div className={styles.frameInner}>
                {/* Replace src with your own photo */}
                <Image
                  src="/images/profile.jpg"
                  alt="Profile photo"
                  width={340}
                  height={420}
                  className={styles.photo}
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
