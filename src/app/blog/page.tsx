"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import InteractiveHeadlineText from "@/components/ui/InteractiveHeadlineText";
import TextScramble from "@/components/ui/TextScramble";
import TypewriterText from "@/components/ui/TypewriterText";
import { ShiningText } from "@/components/ui/shining-text";
import { posts } from "@/lib/blogData";
import styles from "./page.module.css";

type ArchivePost = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[];
  image: string;
  isIncoming: boolean;
};

const incomingPostImage =
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop";

const archivePosts: ArchivePost[] = [
  { ...posts[0], isIncoming: false },
  {
    title: "More Incoming",
    excerpt:
      "⚠ This slot is reserved for an upcoming paper note. A concise technical breakdown will be published soon.",
    date: "2026-04",
    slug: "incoming-note-01",
    tags: ["Incoming", "Paper Notes", "In Progress"],
    image: incomingPostImage,
    isIncoming: true,
  },
  {
    title: "More Incoming",
    excerpt:
      "⚠ Another writing slot is intentionally kept open while the next research summary is being prepared.",
    date: "2026-04",
    slug: "incoming-note-02",
    tags: ["Incoming", "Technical Notes", "Roadmap"],
    image: incomingPostImage,
    isIncoming: true,
  },
];

export default function BlogPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [titlePhase, setTitlePhase] = useState<"thinking" | "scramble" | "interactive">("thinking");
  const [shouldScrambleTitle, setShouldScrambleTitle] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setTitlePhase("thinking");
    setShouldScrambleTitle(false);

    const timer = window.setTimeout(() => {
      setTitlePhase("scramble");
      setShouldScrambleTitle(true);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      <div className="container">
        <Link href="/#blog" className={styles.backLink}>
          &larr; Back to Home
        </Link>
        <h1 className={styles.title}>
          {titlePhase === "thinking" ? (
            <ShiningText
              text="This Section is Thinking..."
              className={styles.thinkingTitle}
            />
          ) : (
            <>
              {titlePhase === "scramble" ? (
                <TextScramble
                  key="blog-title-scramble"
                  text="# My Blog"
                  trigger={shouldScrambleTitle}
                  speed={72}
                  delay={140}
                  onComplete={() => setTitlePhase("interactive")}
                  className={styles.scrambleInline}
                />
              ) : (
                <InteractiveHeadlineText
                  text="# My Blog"
                  className={styles.scrambleInline}
                />
              )}
            </>
          )}
        </h1>
        <p className={styles.subtitle}>
          <TypewriterText
            text="Notes, experiments, and technical reflections from building across AI, machine learning, data systems, and delivery."
            trigger={isVisible}
            speed={40}
            delay={280}
          />
        </p>

        <div className={styles.grid}>
          {archivePosts.map((post) => (
            <article
              key={post.slug}
              className={`${styles.card} ${post.isIncoming ? styles.cardIncoming : ""}`}
            >
              <Link
                href={post.isIncoming ? "/blog" : `/blog/${post.slug}`}
                className={styles.imageWrapper}
              >
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
                {post.isIncoming ? (
                  <h2 className={styles.cardTitle}>
                    {post.title}
                    <span className={styles.warningBadge}>⚠</span>
                  </h2>
                ) : (
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                  </Link>
                )}
                <p className={styles.excerpt}>{post.excerpt}</p>
                {post.isIncoming ? (
                  <span className={styles.readMoreMuted}>⚠ More incoming</span>
                ) : (
                  <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                    Read More &rarr;
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
