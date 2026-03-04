import Link from "next/link";
import Image from "next/image";
import { posts } from "@/lib/blogData";
import CCTVCamera from "@/components/ui/CCTVCamera";
import styles from "./Blog.module.css";


export default function Blog() {
    return (
        <section className={`section ${styles.blog}`} id="blog">
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.sectionTitle}>
                        <span className="text-accent">#</span> Latest Posts
                    </h2>
                    {/* CCTV + View All — same pattern as Projects */}
                    <div className={styles.viewAllGroup}>
                        <CCTVCamera size={80} />
                        <Link href="/blog" className={styles.viewAll}>
                            View All &rarr;
                        </Link>
                    </div>
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
