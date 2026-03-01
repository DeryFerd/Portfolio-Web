import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <h1 className={styles.title}>
          <span className="text-accent">#</span> About Me
        </h1>
        
        <div className={styles.profileSection}>
          <div className={styles.photoFrame}>
            <Image
              src="/images/profile.jpg"
              alt="Profile Photo"
              width={300}
              height={300}
              className={styles.photo}
              unoptimized
            />
            <div className={styles.frameCorner}></div>
          </div>
          <div className={styles.profileText}>
            <p className={styles.greeting}>
              <span className="text-accent">&gt;</span> Hello, I&apos;m
            </p>
            <h2 className={styles.name}>Your Name</h2>
            <p className={styles.role}>AI Engineer</p>
          </div>
        </div>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Who I Am</h2>
          <p className={styles.text}>
            I&apos;m an AI Engineer passionate about building intelligent systems that solve 
            real-world problems. With a strong foundation in machine learning and deep 
            learning, I specialize in natural language processing and computer vision applications.
          </p>
          <p className={styles.text}>
            My journey in AI started during my computer science studies, where I became 
            fascinated by the potential of neural networks. Since then, I&apos;ve been working 
            on various projects involving large language models, recommendation systems, and computer vision.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What I Do</h2>
          <ul className={styles.list}>
            <li>
              <span className={styles.bullet}>&gt;</span>
              Build and deploy machine learning models
            </li>
            <li>
              <span className={styles.bullet}>&gt;</span>
              Develop NLP solutions (chatbots, sentiment analysis, text classification)
            </li>
            <li>
              <span className={styles.bullet}>&gt;</span>
              Create computer vision applications (object detection, image classification)
            </li>
            <li>
              <span className={styles.bullet}>&gt;</span>
              Optimize models for production and scale
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tech I Use</h2>
          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <span className={styles.techName}>Python</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>PyTorch</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>TensorFlow</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Transformers</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>OpenCV</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>FastAPI</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Docker</span>
            </div>
            <div className={styles.techItem}>
              <span className={styles.techName}>Kubernetes</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>When I&apos;m Not Coding</h2>
          <p className={styles.text}>
            I enjoy reading research papers, exploring new AI technologies, and contributing 
            to open-source projects. I also like to write about my experiences and learnings 
            on this blog.
          </p>
        </section>
      </div>
    </div>
  );
}
