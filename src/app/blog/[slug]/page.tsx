import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, posts } from "@/lib/blogData";
import styles from "./page.module.css";

// Generate static params untuk semua slug yang ada
export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Kalau slug tidak ditemukan → 404
  if (!post) notFound();

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/#blog" className={styles.backLink}>
          &larr; Back to Home
        </Link>

        <header className={styles.header}>
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
          <h1 className={styles.title}>{post.title}</h1>
        </header>

        <div className={styles.coverWrapper}>
          <Image
            src={post.image}
            alt={post.title}
            width={900}
            height={400}
            className={styles.coverImage}
            unoptimized
            priority
          />
        </div>

        <div className={styles.content}>
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2 key={i} className={styles.heading2}>
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("```")) {
              return null;
            }
            if (/^\d+\. /.test(line)) {
              return (
                <li key={i} className={styles.listItem}>
                  {line.replace(/^\d+\. /, "")}
                </li>
              );
            }
            if (line.trim()) {
              return (
                <p key={i} className={styles.paragraph}>
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
