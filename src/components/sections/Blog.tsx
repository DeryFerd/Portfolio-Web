"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/blogData";
import styles from "./Blog.module.css";

export default function Blog() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePost = posts[activeIndex];

  return (
    <section className={`section ${styles.blog}`} id="blog">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className={styles.kicker}>Latest writing</p>
            <h2 className={styles.title}>Notes from building and learning in public.</h2>
          </div>
          <Link href="/blog" className={styles.archiveLink}>
            View all posts
          </Link>
        </div>

        <div className={styles.previewStrip}>
          {posts.map((post, index) => (
            <button
              key={post.slug}
              type="button"
              className={`${styles.previewTile} ${index === activeIndex ? styles.previewTileActive : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              aria-pressed={index === activeIndex}
            >
              <Image
                src={post.image}
                alt={post.title}
                width={420}
                height={280}
                className={styles.previewImage}
                unoptimized
              />
            </button>
          ))}
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.postList}>
            {posts.map((post, index) => (
              <article key={post.slug} className={styles.postItem}>
                <button
                  type="button"
                  className={`${styles.postTrigger} ${index === activeIndex ? styles.postTriggerActive : ""}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={index === activeIndex}
                >
                  <span className={styles.postNumber}>
                    _ {String(index + 1).padStart(2, "0")} .
                  </span>
                  <span className={styles.postTitle}>{post.title}</span>
                  <span className={styles.postMeta}>
                    {post.date} / {post.tags.join(" / ")}
                  </span>
                </button>
              </article>
            ))}
          </div>

          <aside className={styles.detailPanel}>
            <div className={styles.detailImageFrame}>
              <Image
                src={activePost.image}
                alt={activePost.title}
                width={960}
                height={640}
                className={styles.detailImage}
                unoptimized
              />
            </div>
            <div className={styles.detailMeta}>
              <p className={styles.detailDate}>{activePost.date}</p>
              <h3 className={styles.detailTitle}>{activePost.title}</h3>
              <p className={styles.detailExcerpt}>{activePost.excerpt}</p>
              <Link href={`/blog/${activePost.slug}`} className={styles.detailLink}>
                Read article
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
