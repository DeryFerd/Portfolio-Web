"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import InteractiveHeadlineText from "@/components/ui/InteractiveHeadlineText";
import TextScramble from "@/components/ui/TextScramble";
import TypewriterText from "@/components/ui/TypewriterText";
import { ShiningText } from "@/components/ui/shining-text";
import styles from "./page.module.css";

type ArchiveProject = {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  image: string;
  isIncoming: boolean;
};

const incomingImage =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop";

function createIncomingProject(slug: string): ArchiveProject {
  return {
    title: "More Incoming",
    description:
      "⚠ This slot is reserved for the next case study. A full breakdown will be published once the build is ready.",
    tags: ["Incoming", "In Progress", "Roadmap"],
    slug,
    image: incomingImage,
    isIncoming: true,
  };
}

const projects: ArchiveProject[] = [
  {
    title: "AI Chatbot",
    description: "A conversational AI built with GPT models for customer support automation.",
    tags: ["NLP", "GPT", "FastAPI"],
    slug: "ai-chatbot",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    isIncoming: false,
  },
  createIncomingProject("image-classifier"),
  createIncomingProject("recommender-system"),
];

export default function ProjectsPage() {
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
        <Link href="/#projects" className={styles.backLink}>
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
                  key="projects-title-scramble"
                  text="# My Projects"
                  trigger={shouldScrambleTitle}
                  speed={72}
                  delay={140}
                  onComplete={() => setTitlePhase("interactive")}
                  className={styles.scrambleInline}
                />
              ) : (
                <InteractiveHeadlineText
                  text="# My Projects"
                  className={styles.scrambleInline}
                />
              )}
            </>
          )}
        </h1>
        <p className={styles.subtitle}>
          <TypewriterText
            text="A working archive of AI, data, and product-facing builds, shaped less like a dump of demos and more like a record of systems delivered with intent."
            trigger={isVisible}
            speed={40}
            delay={280}
          />
        </p>
        <div className={styles.grid}>
          {projects.map((project) => (
            <article
              key={project.slug}
              className={`${styles.card} ${project.isIncoming ? styles.cardIncoming : ""}`}
            >
              <Link
                href={project.isIncoming ? "/projects" : `/projects/${project.slug}`}
                className={styles.imageWrapper}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={200}
                  className={styles.image}
                  unoptimized
                />
              </Link>
              <h2 className={styles.cardTitle}>
                {project.title}
                {project.isIncoming ? (
                  <span className={styles.warningBadge}>⚠</span>
                ) : null}
              </h2>
              <p className={styles.cardDescription}>{project.description}</p>
              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              {project.isIncoming ? (
                <span className={styles.cardLinkMuted}>⚠ More incoming</span>
              ) : (
                <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                  View Details &rarr;
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
