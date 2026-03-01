import Link from "next/link";
import styles from "./Projects.module.css";

const projects = [
  {
    title: "AI Chatbot",
    description: "A conversational AI built with GPT models for customer support automation.",
    tags: ["NLP", "GPT", "FastAPI"],
    slug: "ai-chatbot",
  },
  {
    title: "Image Classifier",
    description: "Deep learning model for image classification using CNN architecture.",
    tags: ["Computer Vision", "PyTorch", "ResNet"],
    slug: "image-classifier",
  },
  {
    title: "Recommender System",
    description: "Collaborative filtering recommendation engine for e-commerce platforms.",
    tags: ["ML", "Recommendation", "Python"],
    slug: "recommender-system",
  },
];

export default function Projects() {
  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span className="text-accent">#</span> Featured Projects
          </h2>
          <Link href="/projects" className={styles.viewAll}>
            View All &rarr;
          </Link>
        </div>
        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.slug} className={styles.card}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                Learn More &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
