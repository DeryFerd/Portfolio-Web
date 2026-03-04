import Link from "next/link";
import Image from "next/image";
import CCTVCamera from "@/components/ui/CCTVCamera";
import styles from "./Projects.module.css";

const projects = [
  {
    title: "AI Chatbot",
    description: "A conversational AI built with GPT models for customer support automation.",
    tags: ["NLP", "GPT", "FastAPI"],
    slug: "ai-chatbot",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
  {
    title: "Image Classifier",
    description: "Deep learning model for image classification using CNN architecture.",
    tags: ["Computer Vision", "PyTorch", "ResNet"],
    slug: "image-classifier",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
  },
  {
    title: "Recommender System",
    description: "Collaborative filtering recommendation engine for e-commerce platforms.",
    tags: ["ML", "Recommendation", "Python"],
    slug: "recommender-system",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  },
];

export default function Projects() {
  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        {/* ── Section header: title | "View All" link | CCTV camera ── */}
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span className="text-accent">#</span> Featured Projects
          </h2>
          {/* CCTV attached to the left of View All link — watches where you click */}
          <div className={styles.viewAllGroup}>
            <CCTVCamera size={80} />
            <Link href="/projects" className={styles.viewAll}>
              View All &rarr;
            </Link>
          </div>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.slug} className={styles.card}>
              <Link href={`/projects/${project.slug}`} className={styles.imageWrapper}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={200}
                  className={styles.image}
                  unoptimized
                />
              </Link>
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
