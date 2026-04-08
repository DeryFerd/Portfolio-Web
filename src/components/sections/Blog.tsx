"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeadline from "@/components/ui/SectionHeadline";
import SectionSubheadline from "@/components/ui/SectionSubheadline";
import QuickPreviewDialog from "@/components/ui/QuickPreviewDialog";
import { posts } from "@/lib/blogData";
import styles from "./Blog.module.css";

function extractPostSignals(content: string) {
  const headings: string[] = [];
  const listItems: string[] = [];
  const paragraphs: string[] = [];
  let insideCodeBlock = false;

  content.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      return;
    }

    if (line.startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      return;
    }

    if (insideCodeBlock) {
      return;
    }

    if (line.startsWith("## ")) {
      headings.push(line.replace("## ", ""));
      return;
    }

    if (/^\d+\.\s/.test(line)) {
      listItems.push(line.replace(/^\d+\.\s/, ""));
      return;
    }

    paragraphs.push(line.replace(/\*\*/g, ""));
  });

  return { headings, listItems, paragraphs };
}

export default function Blog() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const activePost = posts[activeIndex];
  const previewPost = posts.find((post) => post.slug === previewSlug) ?? activePost;
  const isPreviewOpen = previewSlug !== null;

  const previewContent = useMemo(() => {
    const { headings, listItems, paragraphs } = extractPostSignals(previewPost.content);

    const outlineItems = headings.slice(0, 4);
    const takeawayItems =
      listItems.length > 0
        ? listItems.slice(0, 3)
        : paragraphs
            .filter((paragraph) => paragraph.length > 64)
            .slice(1, 4);

    return {
      outlineItems:
        outlineItems.length > 0
          ? outlineItems
          : previewPost.tags.map((tag) => `${tag} in practice`),
      takeawayItems:
        takeawayItems.length > 0
          ? takeawayItems
          : [
              "Turns the note into a practical walkthrough instead of a vague thought piece.",
              "Keeps the learning path visible so the article is useful to come back to later.",
              "Connects tooling and reasoning in a way that is easy to scan before reading the full post.",
            ],
      topicCards: previewPost.tags.map((tag, index) => ({
        index: String(index + 1).padStart(2, "0"),
        meta: "Topic",
        title: tag,
      })),
    };
  }, [previewPost]);

  const handleOpenPreview = (index: number) => {
    setActiveIndex(index);
    setPreviewSlug(posts[index]?.slug ?? null);
  };

  return (
    <>
      <section className={`section ${styles.blog}`} id="blog">
        <div className="container">
          <div className={styles.header}>
            <div className={styles.copy}>
              <div className={styles.kickerRow}>
                <span className={styles.kickerIcon} aria-hidden="true">
                  *
                </span>
                <p className={styles.kicker}>Latest writing</p>
              </div>
              <SectionHeadline
                text="Notes from building and learning in public."
                className={styles.title}
              />
              <SectionSubheadline
                text="A collection of articles that break down technical concepts, implementation details, and practical lessons from real projects. Each piece is written to be useful before you even finish reading."
                className={styles.text}
              />
            </div>
            <Link href="/blog" className={styles.archiveLink}>
              View all posts
            </Link>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.postList}>
              {posts.map((post, index) => (
                <article
                  key={post.slug}
                  className={`${styles.postItem} ${index === activeIndex ? styles.postItemActive : ""}`}
                >
                  <button
                    type="button"
                    className={`${styles.postTrigger} ${index === activeIndex ? styles.postTriggerActive : ""}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => handleOpenPreview(index)}
                    aria-haspopup="dialog"
                    aria-expanded={previewSlug === post.slug}
                    suppressHydrationWarning
                  >
                    <span className={styles.postNumber}>
                      _ {String(index + 1).padStart(2, "0")} .
                    </span>
                    <span className={styles.postTitleRow}>
                      <span className={styles.postTitle}>{post.title}</span>
                      <span className={styles.postArrow} aria-hidden="true">
                        -&gt;
                      </span>
                    </span>
                    <span className={styles.postMeta}>
                      {post.date} / {post.tags.join(" / ")}
                    </span>
                  </button>
                </article>
              ))}
            </div>

            <aside className={styles.detailPanel}>
              <div className={styles.detailStage}>
                {posts.map((post, index) => (
                  <Image
                    key={post.slug}
                    src={post.image}
                    alt={index === activeIndex ? post.title : ""}
                    width={960}
                    height={640}
                    className={`${styles.detailImage} ${index === activeIndex ? styles.detailImageActive : ""}`}
                    aria-hidden={index !== activeIndex}
                    unoptimized
                  />
                ))}
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

      <QuickPreviewDialog
        open={isPreviewOpen}
        onClose={() => setPreviewSlug(null)}
        modalLabel={`${previewPost.title} writing preview`}
        category="Writing / Notes in Public"
        year={previewPost.date.slice(0, 4)}
        kindLabel="Reading note"
        title={previewPost.title}
        summary={previewPost.excerpt}
        image={previewPost.image}
        tags={previewPost.tags}
        primaryAction={{
          href: `/blog/${previewPost.slug}`,
          label: "Read article",
        }}
        secondaryAction={{
          href: "/blog",
          label: "View all posts",
        }}
        sections={[
          {
            eyebrow: "Inside the note",
            title: "What the piece walks through",
            items: previewContent.outlineItems,
            variant: "list",
          },
          {
            eyebrow: "Takeaways",
            title: "Why it is worth opening",
            items: previewContent.takeawayItems,
            variant: "paragraphs",
          },
        ]}
        cardSection={{
          eyebrow: "Topics",
          title: "Themes carried through the piece.",
          description:
            "A tighter read on the subjects, methods, and practical layers that shape this note.",
          cards: previewContent.topicCards,
        }}
      />
    </>
  );
}
