"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
} from "react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Skills.module.css";

interface Skill {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  accent: string;
}

interface DeckCardProps {
  active?: boolean;
  animating?: boolean;
  cardProps?: HTMLAttributes<HTMLDivElement>;
  className: string;
  counter: string;
  dragging?: boolean;
  relatedSkills: Skill[];
  skill: Skill;
  style?: CSSProperties;
  swipeDirection?: number;
}

const SWIPE_THRESHOLD = 96;

const skills: Skill[] = [
  {
    id: "llms",
    label: "LLMs",
    eyebrow: "Reasoning systems",
    description:
      "Model choice, prompting, and evaluation loops tuned for useful product behavior.",
    accent: "#f2c078",
  },
  {
    id: "rag",
    label: "RAG",
    eyebrow: "Grounded retrieval",
    description:
      "Search pipelines that keep outputs anchored to the right context, not just fluent text.",
    accent: "#c08cff",
  },
  {
    id: "python",
    label: "Python",
    eyebrow: "ML backbone",
    description:
      "The default layer for experiments, orchestration, inference services, and data work.",
    accent: "#5ab0f5",
  },
  {
    id: "pytorch",
    label: "PyTorch",
    eyebrow: "Model work",
    description:
      "Training, fine-tuning, and iterating on modern ML systems with practical deployment in mind.",
    accent: "#ff7b4d",
  },
  {
    id: "react",
    label: "React",
    eyebrow: "Product surfaces",
    description:
      "Interfaces for AI products where fast iteration, clarity, and responsive state all matter.",
    accent: "#65d8ff",
  },
  {
    id: "nextjs",
    label: "Next.js",
    eyebrow: "Delivery layer",
    description:
      "App Router builds that connect product pages, server rendering, and operational polish.",
    accent: "#f0f0f0",
  },
  {
    id: "node",
    label: "Node.js",
    eyebrow: "Real-time glue",
    description:
      "APIs, background jobs, and streaming endpoints that support agent and product workflows.",
    accent: "#8cd66f",
  },
  {
    id: "postgres",
    label: "Postgres",
    eyebrow: "Structured memory",
    description:
      "Reliable storage for product data, retrieval layers, and the state behind real applications.",
    accent: "#7a95ff",
  },
  {
    id: "docker",
    label: "Docker",
    eyebrow: "Portable runtime",
    description:
      "Clean environments for reproducible training, inference, and product deployment pipelines.",
    accent: "#46b6ff",
  },
  {
    id: "tailwind",
    label: "Tailwind",
    eyebrow: "Interface speed",
    description:
      "Fast layout iteration when the frontend needs to move at the same speed as the backend.",
    accent: "#33d6dd",
  },
];

function getWrappedIndex(index: number) {
  return (index % skills.length + skills.length) % skills.length;
}

function getSkillAt(index: number) {
  return skills[getWrappedIndex(index)] ?? skills[0];
}

function getRelatedSkills(centerIndex: number) {
  return [0, 1, 3, 5].map((offset) => getSkillAt(centerIndex + offset));
}

function SkillIcon({ skillId }: { skillId: string }) {
  switch (skillId) {
    case "llms":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="5.4" fill="currentColor" />
          <circle cx="24" cy="10.5" r="3.3" fill="currentColor" opacity="0.8" />
          <circle cx="36.5" cy="18" r="3.3" fill="currentColor" opacity="0.72" />
          <circle cx="33" cy="33.5" r="3.3" fill="currentColor" opacity="0.64" />
          <circle cx="15" cy="34" r="3.3" fill="currentColor" opacity="0.78" />
          <circle cx="11" cy="17.5" r="3.3" fill="currentColor" opacity="0.7" />
          <path
            d="M24 15.2 32.2 19.6 29.6 29 18.4 29 15.8 19.6Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "rag":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect
            x="10"
            y="12"
            width="20"
            height="18"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
          />
          <path
            d="M20 31h14a4 4 0 0 0 4-4V15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="18" cy="20" r="2.2" fill="currentColor" />
          <circle cx="24" cy="20" r="2.2" fill="currentColor" opacity="0.72" />
          <circle cx="30" cy="20" r="2.2" fill="currentColor" opacity="0.48" />
        </svg>
      );
    case "python":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 8c-8 0-8 4.6-8 7.4v4.8h11.2c2.2 0 4 1.8 4 4V32c0 2.2-1.8 4-4 4H18c0 2.8 2.8 4 6 4 8 0 8-4.6 8-7.4V16c0-2.2-1.8-4-4-4Z"
            fill="currentColor"
            opacity="0.94"
          />
          <path
            d="M24 40c8 0 8-4.6 8-7.4v-4.8H20.8c-2.2 0-4-1.8-4-4V16c0-2.2 1.8-4 4-4H30c0-2.8-2.8-4-6-4-8 0-8 4.6-8 7.4V32c0 2.2 1.8 4 4 4Z"
            fill="currentColor"
            opacity="0.54"
          />
          <circle cx="21.5" cy="14.6" r="2" fill="#080909" />
          <circle cx="26.5" cy="33.4" r="2" fill="#080909" />
        </svg>
      );
    case "pytorch":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M33.2 12.4c-7.2 1.5-13 7.2-14.6 14.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M18.8 27c1.4 5.4 6.2 9.4 11.9 9.4 6.8 0 12.3-5.5 12.3-12.3 0-4.7-2.6-8.8-6.5-10.9"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.72"
          />
          <circle cx="18.4" cy="27.6" r="4.3" fill="currentColor" />
        </svg>
      );
    case "react":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="3.6" fill="currentColor" />
          <ellipse
            cx="24"
            cy="24"
            rx="15"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <ellipse
            cx="24"
            cy="24"
            rx="15"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            transform="rotate(60 24 24)"
          />
          <ellipse
            cx="24"
            cy="24"
            rx="15"
            ry="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            transform="rotate(-60 24 24)"
          />
        </svg>
      );
    case "nextjs":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle
            cx="24"
            cy="24"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
          />
          <path
            d="M18 31V17l12 14V17"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "node":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M24 7 37 14.5V29.5L24 37 11 29.5V14.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path
            d="M20 29V18l8 11V18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "postgres":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <ellipse
            cx="24"
            cy="13"
            rx="11"
            ry="4.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
          />
          <path
            d="M13 13v16.2c0 2.7 4.9 4.8 11 4.8s11-2.1 11-4.8V13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
          />
          <path
            d="M13 21.2c0 2.7 4.9 4.8 11 4.8s11-2.1 11-4.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
          />
        </svg>
      );
    case "docker":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="12" y="19" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="18" y="19" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="24" y="19" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="18" y="13" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="24" y="13" width="5" height="5" rx="1" fill="currentColor" />
          <path
            d="M10 27.5h21.5c2.3 0 4.2-.4 5.4-1.3 1.6-1.1 2.6-3 3-5.8.1-.7.8-1.1 1.4-.8 1.1.5 1.8 1.6 1.8 2.9 0 2.8-2.3 6.3-5.8 8.3-2.5 1.5-5.4 2.1-8.2 2.1H18.5c-3.7 0-6.8-2.3-8.5-5.4Z"
            fill="currentColor"
          />
        </svg>
      );
    case "tailwind":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path
            d="M13 20.5c2-4.7 5.4-7 10.2-7 6 0 6.7 4.2 9.7 5.5 2 .8 4.3.4 6.8-1.3-2 4.8-5.4 7.2-10.3 7.2-6 0-6.6-4.2-9.7-5.4-1.9-.8-4.2-.5-6.7 1Z"
            fill="currentColor"
          />
          <path
            d="M8.5 30.5c2-4.7 5.4-7 10.2-7 6 0 6.7 4.2 9.7 5.5 2 .8 4.3.4 6.8-1.3-2 4.8-5.4 7.2-10.3 7.2-6 0-6.6-4.2-9.7-5.4-1.9-.8-4.2-.5-6.7 1Z"
            fill="currentColor"
            opacity="0.82"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="12" fill="currentColor" />
        </svg>
      );
  }
}

function DeckCard({
  active = false,
  animating = false,
  cardProps,
  className,
  counter,
  dragging = false,
  relatedSkills,
  skill,
  style,
  swipeDirection = 0,
}: DeckCardProps) {
  const cardStyle = {
    "--card-accent": skill.accent,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={className}
      style={cardStyle}
      data-active={active}
      data-animating={animating}
      data-dragging={dragging}
      data-swipe={swipeDirection}
      {...cardProps}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardCounter}>{counter}</span>
        <span className={styles.cardEyebrow}>{skill.eyebrow}</span>
      </div>

      <div className={styles.cardHero}>
        <span className={styles.cardIcon}>
          <SkillIcon skillId={skill.id} />
        </span>
        <div className={styles.cardIdentity}>
          <h3 className={styles.cardTitle}>{skill.label}</h3>
          <p className={styles.cardDescription}>{skill.description}</p>
        </div>
      </div>

      <div className={styles.logoRail}>
        {relatedSkills.map((relatedSkill) => (
          <span
            key={`${skill.id}-${relatedSkill.id}`}
            className={styles.logoChip}
            data-active={relatedSkill.id === skill.id}
            style={{ "--chip-accent": relatedSkill.accent } as CSSProperties}
          >
            <span className={styles.logoIcon}>
              <SkillIcon skillId={relatedSkill.id} />
            </span>
            <span className={styles.logoLabel}>{relatedSkill.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const swipeTimeoutRef = useRef<number | null>(null);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<-1 | 0 | 1>(0);

  useEffect(() => {
    return () => {
      if (swipeTimeoutRef.current !== null) {
        window.clearTimeout(swipeTimeoutRef.current);
      }
    };
  }, []);

  const activeSkill = skills[activeIndex] ?? skills[0];

  const deckCards = useMemo(
    () =>
      Array.from({ length: 3 }, (_, layer) => {
        const index = getWrappedIndex(activeIndex + layer);

        return {
          layer,
          index,
          skill: skills[index] ?? skills[0],
          relatedSkills: getRelatedSkills(index),
        };
      }),
    [activeIndex],
  );

  const completeSwipe = (direction: -1 | 1) => {
    if (swipeTimeoutRef.current !== null) {
      window.clearTimeout(swipeTimeoutRef.current);
    }

    setSwipeDirection(direction);
    setIsAnimating(true);

    swipeTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        setActiveIndex((current) =>
          getWrappedIndex(current + (direction < 0 ? 1 : -1)),
        );
      });
      setDragOffset(0);
      setSwipeDirection(0);
      setIsAnimating(false);
    }, 240);
  };

  const resetDrag = (target?: HTMLDivElement, pointerId?: number) => {
    setDragOffset(0);
    setIsDragging(false);

    if (
      target &&
      pointerId !== undefined &&
      target.hasPointerCapture(pointerId)
    ) {
      target.releasePointerCapture(pointerId);
    }

    dragStateRef.current.pointerId = -1;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isAnimating) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      dragStateRef.current.pointerId !== event.pointerId ||
      isAnimating
    ) {
      return;
    }

    setDragOffset(event.clientX - dragStateRef.current.startX);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      dragStateRef.current.pointerId !== event.pointerId ||
      isAnimating
    ) {
      return;
    }

    const delta = event.clientX - dragStateRef.current.startX;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      resetDrag(event.currentTarget, event.pointerId);
      completeSwipe(delta < 0 ? -1 : 1);
      return;
    }

    resetDrag(event.currentTarget, event.pointerId);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    resetDrag(event.currentTarget, event.pointerId);
  };

  const activeCardStyle = {
    "--drag-x": `${dragOffset}px`,
    "--drag-rotate": `${(dragOffset * 0.05).toFixed(2)}deg`,
    "--swipe-x": swipeDirection < 0 ? "-138%" : "138%",
    "--swipe-rotate": `${swipeDirection * 16}deg`,
  } as CSSProperties;

  return (
    <section className={`section ${styles.skills}`} id="skills">
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.copy}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerIcon} aria-hidden="true">
                *
              </span>
              <p className={styles.kicker}>Core stack</p>
            </div>
            <h2 className={styles.title}>A stack you can swipe through instead of decode.</h2>
            <p className={styles.text}>
              The section is now just cards: one layer up front, two more
              waiting behind it, and a direct gesture to move through the stack
              without the visual noise from heavier concepts.
            </p>
          </div>

          <div className={styles.deckColumn}>
            <div className={styles.deckStage}>
              <div className={styles.cardStack}>
                {deckCards
                  .slice()
                  .reverse()
                  .map(({ layer, skill, relatedSkills }) => {
                    const counter = `${String(getWrappedIndex(activeIndex + layer) + 1).padStart(2, "0")} / ${String(skills.length).padStart(2, "0")}`;

                    if (layer === 0) {
                      return (
                        <DeckCard
                          key={`front-${skill.id}-${activeIndex}`}
                          active
                          animating={isAnimating}
                          className={styles.cardFront}
                          counter={counter}
                          dragging={isDragging}
                          relatedSkills={relatedSkills}
                          skill={skill}
                          style={activeCardStyle}
                          swipeDirection={swipeDirection}
                          cardProps={{
                            onPointerDown: handlePointerDown,
                            onPointerMove: handlePointerMove,
                            onPointerUp: handlePointerUp,
                            onPointerCancel: handlePointerCancel,
                          }}
                        />
                      );
                    }

                    return (
                      <DeckCard
                        key={`back-${skill.id}-${layer}-${activeIndex}`}
                        className={styles.cardBack}
                        counter={counter}
                        relatedSkills={relatedSkills}
                        skill={skill}
                        style={{ "--card-layer": layer } as CSSProperties}
                      />
                    );
                  })}
              </div>
            </div>

            <div className={styles.selectorRail}>
              {skills.map((skill, index) => (
                <button
                  key={skill.id}
                  type="button"
                  className={styles.selectorPill}
                  data-active={index === activeIndex}
                  style={{ "--pill-accent": skill.accent } as CSSProperties}
                  onClick={() =>
                    startTransition(() => {
                      if (swipeTimeoutRef.current !== null) {
                        window.clearTimeout(swipeTimeoutRef.current);
                      }

                      setActiveIndex(index);
                      setDragOffset(0);
                      setIsDragging(false);
                      setSwipeDirection(0);
                      setIsAnimating(false);
                    })
                  }
                >
                  {skill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
