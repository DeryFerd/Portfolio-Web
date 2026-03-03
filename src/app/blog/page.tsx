import Link from "next/link";
import Image from "next/image";
import { posts } from "@/lib/blogData";
import styles from "./page.module.css";

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
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                </Link>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  Read More &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
