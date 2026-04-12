"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SectionHeadline from "@/components/ui/SectionHeadline";
import SectionSubheadline from "@/components/ui/SectionSubheadline";
import QuickPreviewDialog from "@/components/ui/QuickPreviewDialog";
import { posts } from "@/lib/blogData";
import styles from "./Blog.module.css";

type WritingEntry = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  tags: string[];
  image: string;
  content: string;
  isIncoming: boolean;
};

const incomingWritingImage =
  "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=960&h=640&fit=crop";

const incomingWritings: WritingEntry[] = [
  {
    title: "More Incoming",
    excerpt:
      "⚠ This note slot is reserved for the next paper breakdown. A practical summary will be published soon.",
    date: "2026-04",
    slug: "incoming-note-01",
    tags: ["Incoming", "Paper Notes", "In Progress"],
    image: incomingWritingImage,
    content: `
## Status
This writing slot is still in progress.

## Planned structure
1. Paper in 60 seconds
2. Why it matters for product decisions
3. Practical takeaways for implementation
    `,
    isIncoming: true,
  },
  {
    title: "More Incoming",
    excerpt:
      "⚠ Another writing slot is intentionally kept open while the next technical note is being prepared.",
    date: "2026-04",
    slug: "incoming-note-02",
    tags: ["Incoming", "Technical Notes", "Roadmap"],
    image: incomingWritingImage,
    content: `
## Status
Drafting in progress.

## Planned structure
1. Core concept recap
2. Tradeoffs and limitations
3. What to test next
    `,
    isIncoming: true,
  },
];

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const writingEntries = useMemo<WritingEntry[]>(
    () => [{ ...posts[0], isIncoming: false }, ...incomingWritings],
    [],
  );
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);
  const detailIndex = hoveredIndex;
  const activePost = detailIndex !== null ? writingEntries[detailIndex] : null;
  const previewPost =
    writingEntries.find((post) => post.slug === previewSlug) ?? writingEntries[selectedIndex];
  const isPreviewOpen = previewSlug !== null;

  const previewContent = useMemo(() => {
    if (previewPost.isIncoming) {
      return {
        outlineItems: [
          "Paper in 60 seconds",
          "Why it matters in product context",
          "What to test in implementation",
        ],
        takeawayItems: [
          "Keeps the writing section honest without pretending unfinished notes are published.",
          "Signals the direction of upcoming content so visitors know what is coming next.",
          "Maintains structure consistency while preserving quality for final write-ups.",
        ],
        topicCards: previewPost.tags.map((tag, index) => ({
          index: String(index + 1).padStart(2, "0"),
          meta: "Status",
          title: tag,
        })),
      };
    }

    const { headings, listItems, paragraphs } = extractPostSignals(previewPost.content);
    const outlineItems = headings.slice(0, 4);
    const takeawayItems =
      listItems.length > 0
        ? listItems.slice(0, 3)
        : paragraphs.filter((paragraph) => paragraph.length > 64).slice(1, 4);

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
    setSelectedIndex(index);
    setHoveredIndex(index);
    setPreviewSlug(writingEntries[index]?.slug ?? null);
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
              <SectionHeadline text="Writing & Technical Notes." className={styles.title} />
              <SectionSubheadline
                text="Sometimes the best way to learn is to explain. I write about my experiments in AI and the technical hurdles I encounter while building data systems."
                className={styles.text}
              />
            </div>
            <Link href="/blog" className={styles.archiveLink}>
              View all posts
            </Link>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.postList}>
              {writingEntries.map((post, index) => (
                <article
                  key={post.slug}
                  className={`${styles.postItem} ${index === hoveredIndex ? styles.postItemActive : ""}`}
                >
                  <button
                    type="button"
                    className={`${styles.postTrigger} ${index === hoveredIndex ? styles.postTriggerActive : ""}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onFocus={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onBlur={() => setHoveredIndex(null)}
                    onClick={() => handleOpenPreview(index)}
                    aria-haspopup="dialog"
                    aria-expanded={previewSlug === post.slug}
                    suppressHydrationWarning
                  >
                    <span className={styles.postNumber}>
                      _ {String(index + 1).padStart(2, "0")} .
                    </span>
                    <span
                      className={`${styles.postTitleRow} ${post.isIncoming ? styles.postTitleRowIncoming : ""}`}
                    >
                      {post.isIncoming ? (
                        <span className={styles.warningCenter} aria-hidden="true">
                          <span className={styles.warningBadge}>⚠</span>
                        </span>
                      ) : null}
                      <span className={styles.postTitle}>
                        {post.isIncoming ? (
                          <span className={styles.incomingTitle}>
                            More Incoming
                            <span className={styles.incomingDots} aria-hidden="true">
                              ...
                            </span>
                          </span>
                        ) : (
                          post.title
                        )}
                      </span>
                      <span className={styles.postArrow} aria-hidden="true">
                        -&gt;
                      </span>
                    </span>
                    <span className={styles.postMeta}>
                      {post.isIncoming
                        ? `⚠ Incoming / ${post.tags.slice(0, 2).join(" / ")}`
                        : `${post.date} / ${post.tags.join(" / ")}`}
                    </span>
                  </button>
                </article>
              ))}
            </div>

            <aside className={styles.detailPanel}>
              <div className={styles.detailStage}>
                {activePost ? null : (
                  <div className={styles.detailEmpty}>
                    <p className={styles.detailEmptyTitle}>Hover a note to preview</p>
                    <p className={styles.detailEmptyText}>
                      Move your cursor over any row on the left to inspect the writing snapshot.
                    </p>
                  </div>
                )}
                {writingEntries.map((post, index) => (
                  <Image
                    key={post.slug}
                    src={post.image}
                    alt={index === detailIndex ? post.title : ""}
                    width={960}
                    height={640}
                    className={`${styles.detailImage} ${index === detailIndex ? styles.detailImageActive : ""}`}
                    aria-hidden={index !== detailIndex}
                    unoptimized
                  />
                ))}
              </div>
              <div className={styles.detailMeta}>
                {activePost ? (
                  <>
                    <p className={styles.detailDate}>{activePost.date}</p>
                    <h3 className={styles.detailTitle}>{activePost.title}</h3>
                    <p className={styles.detailExcerpt}>{activePost.excerpt}</p>
                    {activePost.isIncoming ? (
                      <span className={styles.detailLinkMuted}>⚠ More incoming</span>
                    ) : (
                      <Link href={`/blog/${activePost.slug}`} className={styles.detailLink}>
                        Read article
                      </Link>
                    )}
                  </>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <QuickPreviewDialog
        open={isPreviewOpen}
        onClose={() => setPreviewSlug(null)}
        modalLabel={`${previewPost.title} writing preview`}
        category={previewPost.isIncoming ? "Writing / Incoming Slot" : "Writing / Notes in Public"}
        year={previewPost.date.slice(0, 4)}
        kindLabel={previewPost.isIncoming ? "Incoming note" : "Reading note"}
        title={previewPost.title}
        summary={previewPost.excerpt}
        image={previewPost.image}
        tags={previewPost.tags}
        primaryAction={{
          href: previewPost.isIncoming ? "/blog" : `/blog/${previewPost.slug}`,
          label: previewPost.isIncoming ? "View archive status" : "Read article",
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
