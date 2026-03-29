"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Projects.module.css";

const projects = [
  {
    title: "AI Chatbot",
    description:
      "A conversational AI built for support automation with context-aware responses and production-minded delivery.",
    tags: ["NLP", "GPT", "FastAPI"],
    slug: "ai-chatbot",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&h=720&fit=crop"
  },
  {
    title: "Image Classifier",
    description:
      "A deep learning workflow for image classification using CNN-based architecture and fast inference-ready outputs.",
    tags: ["Computer Vision", "PyTorch", "ResNet"],
    slug: "image-classifier",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&h=720&fit=crop"
  },
  {
    title: "Recommender System",
    description:
      "A collaborative filtering engine tuned for product discovery, personalization, and real recommendation workflows.",
    tags: ["ML", "Recommendation", "Python"],
    slug: "recommender-system",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=720&fit=crop"
  },
  {
    title: "Sentiment Analysis",
    description:
      "A real-time sentiment monitor for social data, designed to surface trends and response signals with clarity.",
    tags: ["NLP", "BERT", "Streamlit"],
    slug: "sentiment-analysis",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=720&fit=crop"
  },
  {
    title: "Object Detection",
    description:
      "A YOLO-based detection pipeline oriented around real-world imagery, monitoring, and applied computer vision.",
    tags: ["Computer Vision", "YOLO", "OpenCV"],
    slug: "object-detection",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&h=720&fit=crop"
  },
  {
    title: "Time Series Forecasting",
    description:
      "An LSTM forecasting setup for financial signals, with a focus on model behavior, trend reading, and deployment readiness.",
    tags: ["Deep Learning", "LSTM", "Finance"],
    slug: "time-series",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=720&fit=crop"
  }
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <section className={`section ${styles.projects}`} id="projects">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Selected projects</p>
            <h2 className={styles.title}>Work presented with more signal than noise.</h2>
          </div>
          <Link href="/projects" className={styles.archiveLink}>
            View archive
          </Link>
        </div>

        <div className={styles.previewStrip}>
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              className={`${styles.previewTile} ${index === activeIndex ? styles.previewTileActive : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
            >
              <Image
                src={project.image}
                alt={project.title}
                width={280}
                height={220}
                className={styles.previewImage}
                unoptimized
              />
            </button>
          ))}
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.projectList}>
            {projects.map((project, index) => (
              <article key={project.slug} className={styles.projectItem}>
                <button
                  type="button"
                  className={`${styles.projectTrigger} ${index === activeIndex ? styles.projectTriggerActive : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={index === activeIndex}
                >
                  <span className={styles.projectNumber}>
                    _ {String(index + 1).padStart(2, "0")} .
                  </span>
                  <span className={styles.projectTitle}>{project.title}</span>
                  <span className={styles.projectStack}>{project.tags.join(" / ")}</span>
                </button>
              </article>
            ))}
          </div>

          <aside className={styles.detailPanel}>
            <div className={styles.detailImageFrame}>
              <Image
                src={activeProject.image}
                alt={activeProject.title}
                width={900}
                height={720}
                className={styles.detailImage}
                unoptimized
              />
            </div>
            <div className={styles.detailMeta}>
              <p className={styles.detailYear}>{activeProject.year}</p>
              <h3 className={styles.detailTitle}>{activeProject.title}</h3>
              <p className={styles.detailDescription}>{activeProject.description}</p>
              <Link href={`/projects/${activeProject.slug}`} className={styles.detailLink}>
                Open case study
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
