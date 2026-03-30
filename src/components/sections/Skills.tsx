"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Skills.module.css";

interface StackTool {
  id: string;
  label: string;
  caption: string;
  accent: string;
}

interface RoleChapter {
  id: string;
  chapter: string;
  label: string;
  note: string;
  summary: string;
  focus: string[];
  stackIds: string[];
  bridge: string;
  accent: string;
}

type DragMode = "none" | "cover" | "page";
type TurnDirection = -1 | 0 | 1;

const COVER_DRAG_DISTANCE = 240;
const COVER_OPEN_THRESHOLD = 0.42;
const COVER_ZONE_RATIO = 0.42;
const PAGE_DRAG_DISTANCE = 320;
const PAGE_TURN_DEADZONE = 24;
const PAGE_TURN_THRESHOLD = 0.52;
const PAGE_TURN_DURATION = 620;
const PAGE_TURN_COMMIT_DURATION = 540;

const stackTools: StackTool[] = [
  {
    id: "python",
    label: "Python",
    caption: "Experiments, orchestration, and the daily backbone for data and ML work.",
    accent: "#5ab0f5",
  },
  {
    id: "postgres",
    label: "Postgres",
    caption: "Warehousing, retrieval state, and the structured layer beneath applications.",
    accent: "#7a95ff",
  },
  {
    id: "docker",
    label: "Docker",
    caption: "Portable runtimes that keep model, data, and product environments aligned.",
    accent: "#46b6ff",
  },
  {
    id: "node",
    label: "Node.js",
    caption: "APIs, background jobs, and the glue between product and model workflows.",
    accent: "#8cd66f",
  },
  {
    id: "pytorch",
    label: "PyTorch",
    caption: "Training loops, fine-tuning cycles, and model iteration with production in mind.",
    accent: "#ff7b4d",
  },
  {
    id: "llms",
    label: "LLMs",
    caption: "Reasoning layers shaped through prompting, evaluation, and product behavior.",
    accent: "#f2c078",
  },
  {
    id: "rag",
    label: "RAG",
    caption: "Retrieval systems that keep model output anchored to the right context.",
    accent: "#c08cff",
  },
  {
    id: "react",
    label: "React",
    caption: "Interactive product surfaces where model behavior needs clarity and speed.",
    accent: "#65d8ff",
  },
  {
    id: "nextjs",
    label: "Next.js",
    caption: "App delivery, server rendering, and product polish in one deployment layer.",
    accent: "#f0f0f0",
  },
  {
    id: "tailwind",
    label: "Tailwind",
    caption: "Fast UI iteration when the frontend needs to move with the backend pace.",
    accent: "#33d6dd",
  },
];

const stackToolById: Record<string, StackTool> = Object.fromEntries(
  stackTools.map((tool) => [tool.id, tool]),
);

const chapters: RoleChapter[] = [
  {
    id: "data-engineer",
    chapter: "Chapter 01",
    label: "Data Engineer",
    note: "Pipelines, storage, and clean movement before anything becomes intelligence.",
    summary:
      "This chapter is about making data dependable: ingestion, transformation, warehousing, and the operational discipline that every downstream model quietly depends on.",
    focus: ["ETL", "Warehousing", "Reliability"],
    stackIds: ["python", "postgres", "docker", "node"],
    bridge: "Keeps the rest of the stack fed with context that is actually usable.",
    accent: "#7a95ff",
  },
  {
    id: "data-science",
    chapter: "Chapter 02",
    label: "Data Science",
    note: "Exploration, signal finding, and experiment framing before the product layer starts.",
    summary:
      "Here the work is less about shipping chrome and more about finding signal: understanding distributions, testing ideas, and deciding which directions deserve to become systems.",
    focus: ["EDA", "Feature work", "Evaluation"],
    stackIds: ["python", "pytorch", "postgres", "llms"],
    bridge: "Turns raw information into hypotheses worth engineering around.",
    accent: "#5ab0f5",
  },
  {
    id: "ml-engineer",
    chapter: "Chapter 03",
    label: "ML Engineer",
    note: "Training loops, model iteration, and inference paths that are built to ship.",
    summary:
      "This is the chapter where experiments stop being isolated notebooks and start becoming repeatable systems with serving, performance, and operational constraints in view.",
    focus: ["Training", "Inference", "Serving"],
    stackIds: ["python", "pytorch", "docker", "node"],
    bridge: "Connects modeling work to something that can survive product reality.",
    accent: "#ff7b4d",
  },
  {
    id: "llm-engineer",
    chapter: "Chapter 04",
    label: "LLM Engineer",
    note: "Prompting, retrieval, and evaluation loops for language systems that stay grounded.",
    summary:
      "I treat LLM work as system design rather than prompt theater: context selection, retrieval quality, and the behavioral checks that keep outputs useful instead of just fluent.",
    focus: ["Prompts", "Retrieval", "Eval loops"],
    stackIds: ["llms", "rag", "python", "postgres"],
    bridge: "Shapes generative behavior into something more trustworthy and more usable.",
    accent: "#f2c078",
  },
  {
    id: "ai-engineer",
    chapter: "Chapter 05",
    label: "AI Engineer",
    note: "User-facing intelligence where models meet product and workflows meet people.",
    summary:
      "This spread is about turning model capability into product experience: agents, copilots, and interfaces that feel coherent, responsive, and understandable in daily use.",
    focus: ["Agents", "Product UX", "Workflows"],
    stackIds: ["react", "nextjs", "llms", "node"],
    bridge: "Makes intelligence legible once it leaves the notebook and enters the product.",
    accent: "#65d8ff",
  },
  {
    id: "mlops",
    chapter: "Chapter 06",
    label: "MLOps",
    note: "Deployment discipline, observability, and the calm side of keeping models live.",
    summary:
      "The goal here is confidence: reproducible environments, smooth promotion paths, and operational habits that make ML and AI systems feel dependable under real pressure.",
    focus: ["Deployments", "Observability", "CI/CD"],
    stackIds: ["docker", "python", "node", "postgres"],
    bridge: "Turns technical capability into something repeatable, monitorable, and shippable.",
    accent: "#8cd66f",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInOutCubic(value: number) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - Math.pow(-2 * value + 2, 3) / 2;
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

function ToolCard({ tool }: { tool: StackTool }) {
  return (
    <article
      className={styles.toolCard}
      style={{ "--tool-accent": tool.accent } as CSSProperties}
    >
      <span className={styles.toolIcon}>
        <SkillIcon skillId={tool.id} />
      </span>
      <div className={styles.toolCopy}>
        <h4 className={styles.toolTitle}>{tool.label}</h4>
        <p className={styles.toolCaption}>{tool.caption}</p>
      </div>
    </article>
  );
}

function RolePage({ chapter }: { chapter: RoleChapter }) {
  const tools = chapter.stackIds
    .map((stackId) => stackToolById[stackId])
    .filter((tool): tool is StackTool => Boolean(tool));

  return (
    <div
      className={styles.rolePage}
      style={{ "--page-accent": chapter.accent } as CSSProperties}
    >
      <div className={styles.roleHeader}>
        <span className={styles.roleKicker}>{chapter.chapter}</span>
        <h3 className={styles.roleTitle}>{chapter.label}</h3>
        <p className={styles.roleNote}>{chapter.note}</p>
        <p className={styles.roleSummary}>{chapter.summary}</p>
      </div>

      <div className={styles.focusRail}>
        {chapter.focus.map((item) => (
          <span key={item} className={styles.focusPill}>
            {item}
          </span>
        ))}
      </div>

      <div className={styles.toolGrid}>
        {tools.map((tool) => (
          <ToolCard key={`${chapter.id}-${tool.id}`} tool={tool} />
        ))}
      </div>

      <div className={styles.roleBridge}>
        <span className={styles.bridgeLabel}>Shared spine</span>
        <p className={styles.bridgeText}>{chapter.bridge}</p>
      </div>
    </div>
  );
}

function TurnBackFace({ chapter }: { chapter: RoleChapter }) {
  return (
    <div
      className={styles.turnBackFace}
      style={{ "--page-accent": chapter.accent } as CSSProperties}
    >
      <span className={styles.turnBackKicker}>{chapter.chapter}</span>
      <h4 className={styles.turnBackTitle}>{chapter.label}</h4>
      <p className={styles.turnBackText}>{chapter.note}</p>
    </div>
  );
}

export default function Skills() {
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startCoverProgress: 0,
    mode: "none" as DragMode,
  });
  const turnTimeoutRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const [turnDirection, setTurnDirection] = useState<TurnDirection>(0);
  const [turnProgress, setTurnProgress] = useState(0);
  const [turnTargetIndex, setTurnTargetIndex] = useState<number | null>(null);
  const [isAnimatingTurn, setIsAnimatingTurn] = useState(false);

  useEffect(() => {
    return () => {
      if (turnTimeoutRef.current !== null) {
        window.clearTimeout(turnTimeoutRef.current);
      }
    };
  }, []);

  const activeChapter = chapters[activeIndex] ?? chapters[0];
  const turnTargetChapter =
    turnTargetIndex !== null ? chapters[turnTargetIndex] ?? null : null;
  const isDragging = dragMode !== "none";

  const visibleRightChapter = useMemo(() => {
    if (turnDirection === -1 && turnTargetChapter) {
      return turnTargetChapter;
    }

    return activeChapter;
  }, [activeChapter, turnDirection, turnTargetChapter]);

  const resetDrag = (target?: HTMLDivElement, pointerId?: number) => {
    if (
      target &&
      pointerId !== undefined &&
      target.hasPointerCapture(pointerId)
    ) {
      target.releasePointerCapture(pointerId);
    }

    dragStateRef.current.pointerId = -1;
    dragStateRef.current.mode = "none";
    setDragMode("none");
  };

  const clearTurnState = () => {
    setTurnDirection(0);
    setTurnProgress(0);
    setTurnTargetIndex(null);
    setIsAnimatingTurn(false);
  };

  const selectChapter = (index: number) => {
    if (turnTimeoutRef.current !== null) {
      window.clearTimeout(turnTimeoutRef.current);
      turnTimeoutRef.current = null;
    }

    startTransition(() => {
      setActiveIndex(index);
      setCoverProgress(1);
      clearTurnState();
    });
  };

  const commitTurn = (targetIndex: number) => {
    if (turnTimeoutRef.current !== null) {
      window.clearTimeout(turnTimeoutRef.current);
    }

    setIsAnimatingTurn(true);
    setTurnProgress(1);

    turnTimeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        setActiveIndex(targetIndex);
      });

      clearTurnState();
      turnTimeoutRef.current = null;
    }, PAGE_TURN_COMMIT_DURATION);
  };

  const revertTurn = () => {
    if (turnTimeoutRef.current !== null) {
      window.clearTimeout(turnTimeoutRef.current);
    }

    if (turnTargetIndex === null) {
      clearTurnState();
      return;
    }

    setIsAnimatingTurn(true);
    setTurnProgress(0);

    turnTimeoutRef.current = window.setTimeout(() => {
      clearTurnState();
      turnTimeoutRef.current = null;
    }, PAGE_TURN_DURATION);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (isAnimatingTurn) {
      return;
    }

    event.preventDefault();

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const nextMode: DragMode =
      coverProgress < 0.995 ||
      (activeIndex === 0 && relativeX <= COVER_ZONE_RATIO)
        ? "cover"
        : "page";

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startCoverProgress: coverProgress,
      mode: nextMode,
    };
    setDragMode(nextMode);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      dragStateRef.current.pointerId !== event.pointerId ||
      isAnimatingTurn
    ) {
      return;
    }

    event.preventDefault();
    const delta = dragStateRef.current.startX - event.clientX;

    if (dragStateRef.current.mode === "cover") {
      const nextCover = clamp(
        dragStateRef.current.startCoverProgress + delta / COVER_DRAG_DISTANCE,
        0,
        1,
      );

      setCoverProgress(nextCover);
      return;
    }

    if (dragStateRef.current.mode !== "page") {
      return;
    }

    const absDelta = Math.abs(delta);

    if (absDelta <= PAGE_TURN_DEADZONE) {
      clearTurnState();
      return;
    }

    const normalizedProgress = clamp(
      (absDelta - PAGE_TURN_DEADZONE) /
        (PAGE_DRAG_DISTANCE - PAGE_TURN_DEADZONE),
      0,
      1,
    );

    if (delta > 0 && activeIndex < chapters.length - 1) {
      setTurnDirection(-1);
      setTurnTargetIndex(activeIndex + 1);
      setTurnProgress(normalizedProgress);
      return;
    }

    if (delta < 0 && activeIndex > 0) {
      setTurnDirection(1);
      setTurnTargetIndex(activeIndex - 1);
      setTurnProgress(normalizedProgress);
      return;
    }

    clearTurnState();
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();

    if (dragStateRef.current.mode === "cover") {
      const delta = dragStateRef.current.startX - event.clientX;
      const nextCover = clamp(
        dragStateRef.current.startCoverProgress + delta / COVER_DRAG_DISTANCE,
        0,
        1,
      );

      setCoverProgress(nextCover > COVER_OPEN_THRESHOLD ? 1 : 0);
      resetDrag(event.currentTarget, event.pointerId);
      return;
    }

    if (turnTargetIndex !== null && turnProgress > PAGE_TURN_THRESHOLD) {
      const targetIndex = turnTargetIndex;
      resetDrag(event.currentTarget, event.pointerId);
      commitTurn(targetIndex);
      return;
    }

    revertTurn();
    resetDrag(event.currentTarget, event.pointerId);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    if (dragStateRef.current.mode === "cover") {
      setCoverProgress(coverProgress > COVER_OPEN_THRESHOLD ? 1 : 0);
    } else {
      revertTurn();
    }

    resetDrag(event.currentTarget, event.pointerId);
  };

  const displayedTurnProgress =
    isDragging && dragMode === "page"
      ? turnProgress
      : easeInOutCubic(turnProgress);

  const bookStyle = {
    "--cover-progress": coverProgress.toFixed(3),
    "--page-turn-progress": turnProgress.toFixed(3),
    "--page-turn-display": displayedTurnProgress.toFixed(3),
    "--page-curl": Math.sin(turnProgress * Math.PI).toFixed(3),
    "--chapter-accent": activeChapter.accent,
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
            <h2 className={styles.title}>One spine, six working chapters.</h2>
            <p className={styles.text}>
              The stack now behaves like an actual book: closed first, opened by
              dragging the cover, then moved chapter by chapter as the work
              shifts from data pipelines into models, LLM systems, product, and
              operations.
            </p>
          </div>

          <div className={styles.bookColumn}>
            <div className={styles.bookScene} style={bookStyle}>
              <div className={styles.bookAura} aria-hidden="true" />

              <div
                className={styles.bookViewport}
                data-dragging={isDragging}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
              >
                <div className={styles.bookBody}>
                  <div className={styles.bookSpread}>
                    <div className={styles.leftPage}>
                      <span className={styles.contentsKicker}>Playbook</span>
                      <h3 className={styles.contentsTitle}>
                        One portfolio, several operating modes.
                      </h3>
                      <p className={styles.contentsText}>
                        The same build philosophy shows up in different forms:
                        data movement, experiment design, model delivery, LLM
                        behavior, product surfaces, and production stability.
                      </p>

                      <div className={styles.contentsList}>
                        {chapters.map((chapter, index) => (
                          <div
                            key={chapter.id}
                            className={styles.contentsItem}
                            data-active={index === activeIndex}
                          >
                            <span className={styles.contentsItemIndex}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className={styles.contentsItemLabel}>
                              {chapter.label}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.currentCard}>
                        <span className={styles.currentChapter}>
                          {activeChapter.chapter}
                        </span>
                        <h4 className={styles.currentLabel}>
                          {activeChapter.label}
                        </h4>
                        <p className={styles.currentNote}>
                          {activeChapter.note}
                        </p>
                      </div>
                    </div>

                    <div className={styles.rightPage}>
                      <RolePage chapter={visibleRightChapter} />
                    </div>
                  </div>

                  {turnTargetChapter ? (
                    <div
                      className={styles.pageTurn}
                      data-direction={turnDirection < 0 ? "next" : "prev"}
                    >
                      <div className={`${styles.turnFace} ${styles.turnFront}`}>
                        <RolePage
                          chapter={
                            turnDirection < 0 ? activeChapter : turnTargetChapter
                          }
                        />
                      </div>
                      <div className={`${styles.turnFace} ${styles.turnBack}`}>
                        <TurnBackFace
                          chapter={
                            turnDirection < 0 ? turnTargetChapter : activeChapter
                          }
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className={styles.bookSpine} aria-hidden="true" />

                  <div className={styles.bookCover} aria-hidden="true">
                    <div className={styles.coverInner}>
                      <div className={styles.coverTop}>
                        <span className={styles.coverKicker}>Dery Ferdika</span>
                        <h3 className={styles.coverTitle}>AI / Data Playbook</h3>
                        <p className={styles.coverText}>
                          Open the cover, then turn through the roles.
                        </p>
                      </div>

                      <div className={styles.coverTags}>
                        <span>Data</span>
                        <span>Models</span>
                        <span>Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.bookmarks}>
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    className={styles.bookmarkTab}
                    data-active={index === activeIndex}
                    style={{ "--tab-accent": chapter.accent } as CSSProperties}
                    aria-label={`Open ${chapter.label} chapter`}
                    onClick={() => selectChapter(index)}
                  >
                    <span className={styles.bookmarkSwatch} />
                    <span className={styles.bookmarkLabel}>{chapter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
