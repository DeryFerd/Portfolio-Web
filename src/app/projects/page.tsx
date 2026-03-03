import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

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
  {
    title: "Sentiment Analysis",
    description: "Real-time sentiment analysis for social media monitoring.",
    tags: ["NLP", "BERT", "Streamlit"],
    slug: "sentiment-analysis",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
  },
  {
    title: "Object Detection",
    description: "YOLO-based object detection for autonomous vehicles.",
    tags: ["Computer Vision", "YOLO", "OpenCV"],
    slug: "object-detection",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
  },
  {
    title: "Time Series Forecasting",
    description: "LSTM model for stock price prediction and financial forecasting.",
    tags: ["Deep Learning", "LSTM", "Finance"],
    slug: "time-series",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
  },
];

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <h1 className={styles.title}>
          <span className="text-accent">#</span> Projects
        </h1>
        <p className={styles.subtitle}>
          A collection of AI/ML projects showcasing my work in machine learning, 
          deep learning, and artificial intelligence.
        </p>
        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.slug} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={200}
                  className={styles.image}
                  unoptimized
                />
              </div>
              <h2 className={styles.cardTitle}>{project.title}</h2>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                View Details &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
