import Link from "next/link";
import Image from "next/image";
import styles from "./Blog.module.css";

const posts = [
    {
        title: "Getting Started with Large Language Models",
        excerpt: "A comprehensive guide to understanding and working with LLMs for production applications.",
        date: "2024-01-15",
        slug: "getting-started-with-llms",
        tags: ["NLP", "LLM", "Tutorial"],
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
    },
    {
        title: "Building a Neural Network from Scratch",
        excerpt: "Learn the fundamentals of neural networks by building one from scratch using Python.",
        date: "2024-01-10",
        slug: "building-neural-network-from-scratch",
        tags: ["Deep Learning", "Python", "Tutorial"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    },
    {
        title: "Deploying ML Models with Docker",
        excerpt: "Step-by-step guide to containerizing and deploying machine learning models.",
        date: "2024-01-05",
        slug: "deploying-ml-models-docker",
        tags: ["MLOps", "Docker", "Deployment"],
        image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=400&fit=crop",
    },
];

export default function Blog() {
    return (
        <section className={`section ${styles.blog}`} id="blog">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>
                        <span className="text-accent">#</span> Latest Posts
                    </h2>
                    <Link href="/blog" className={styles.viewAll}>
                        View All &rarr;
                    </Link>
                </div>

                <div className={styles.grid}>
                    {posts.map((post) => (
                        <article key={post.slug} className={styles.card}>
                            <Link href={`/blog/${post.slug}`} className={styles.imageWrapper}>
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    width={400}
                                    height={200}
                                    className={styles.image}
                                    unoptimized
                                />
                            </Link>
                            <div className={styles.cardBody}>
                                <div className={styles.meta}>
                                    <time className={styles.date}>{post.date}</time>
                                    <div className={styles.tags}>
                                        {post.tags.map((tag) => (
                                            <span key={tag} className={styles.tag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Link href={`/blog/${post.slug}`}>
                                    <h3 className={styles.cardTitle}>{post.title}</h3>
                                </Link>
                                <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                                    Read More &rarr;
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
