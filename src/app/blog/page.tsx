import Link from "next/link";
import styles from "./page.module.css";

const posts = [
  {
    title: "Getting Started with Large Language Models",
    excerpt: "A comprehensive guide to understanding and working with LLMs for production applications.",
    date: "2024-01-15",
    slug: "getting-started-with-llms",
    tags: ["NLP", "LLM", "Tutorial"],
  },
  {
    title: "Building a Neural Network from Scratch",
    excerpt: "Learn the fundamentals of neural networks by building one from scratch using Python.",
    date: "2024-01-10",
    slug: "building-neural-network-from-scratch",
    tags: ["Deep Learning", "Python", "Tutorial"],
  },
  {
    title: "Deploying ML Models with Docker",
    excerpt: "Step-by-step guide to containerizing and deploying machine learning models.",
    date: "2024-01-05",
    slug: "deploying-ml-models-docker",
    tags: ["MLOps", "Docker", "Deployment"],
  },
];

export default function BlogPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>
        <h1 className={styles.title}>
          <span className="text-accent">#</span> Blog
        </h1>
        <p className={styles.subtitle}>
          Thoughts on AI, machine learning, and building intelligent systems.
        </p>
        
        <div className={styles.posts}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.post}>
              <div className={styles.postMeta}>
                <time className={styles.date}>{post.date}</time>
                <div className={styles.tags}>
                  {post.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className={styles.postTitle}>{post.title}</h2>
              </Link>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                Read More &rarr;
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
