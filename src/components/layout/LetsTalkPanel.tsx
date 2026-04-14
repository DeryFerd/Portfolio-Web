"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { CONTACT_EMAIL } from "@/lib/contactConfig";
import styles from "./LetsTalkPanel.module.css";

type PanelView = "menu" | "fit" | "form" | "success";
type SubmitStatus = "idle" | "submitting" | "error";

interface ContactFormState {
  name: string;
  email: string;
  message: string;
}

interface LetsTalkPanelProps {
  open: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}

const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const JAKARTA_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: JAKARTA_TIME_ZONE,
});

const projectTypes = [
  {
    id: "ai-product",
    label: "AI Product",
    emailLabel: "AI product",
    deliverable: "User-facing AI workflow with a clearer product path.",
  },
  {
    id: "rag-system",
    label: "RAG System",
    emailLabel: "RAG system",
    deliverable: "Retrieval flow with evaluation and shipping constraints in mind.",
  },
  {
    id: "internal-tool",
    label: "Internal Tool",
    emailLabel: "Internal AI tool",
    deliverable: "Operator-friendly tool that supports a real team workflow.",
  },
  {
    id: "ml-pipeline",
    label: "ML Pipeline",
    emailLabel: "ML pipeline",
    deliverable: "Delivery path from experimentation into stable production use.",
  },
  {
    id: "ai-interface",
    label: "AI Interface",
    emailLabel: "AI interface",
    deliverable: "Frontend system with sharper human-in-the-loop interaction.",
  },
] as const;

const projectStages = [
  {
    id: "idea",
    label: "Idea",
    kickoff: "Kickoff window: 10-14 days",
    scopeNote: "Best when we still need to shape the first version.",
  },
  {
    id: "prototype",
    label: "Prototype",
    kickoff: "Kickoff window: 7-10 days",
    scopeNote: "Best when the core workflow exists but needs structure.",
  },
  {
    id: "production",
    label: "Production",
    kickoff: "Kickoff window: 5-7 days",
    scopeNote: "Best when shipping risk, polish, or operations matter now.",
  },
] as const;

const projectNeeds = [
  {
    id: "architecture",
    label: "Architecture",
    engagement: "Advisory sprint",
    availability: "2 advisory windows open",
    summary: "shape the system before the heavy build starts",
    outputs: ["Architecture map", "Scope decisions", "Delivery risks"],
  },
  {
    id: "implementation",
    label: "Implementation",
    engagement: "Build sprint",
    availability: "1 build slot open",
    summary: "build the core workflow with production-minded constraints",
    outputs: ["Core implementation", "Integration path", "Shipping checklist"],
  },
  {
    id: "polish",
    label: "Polish",
    engagement: "Refinement sprint",
    availability: "1 polish slot open",
    summary: "tighten release quality, UX, and delivery confidence",
    outputs: ["Flow cleanup", "UI/UX refinement", "Launch notes"],
  },
  {
    id: "audit",
    label: "Audit",
    engagement: "Audit window",
    availability: "2 audit windows open",
    summary: "review what exists and identify the next high-leverage move",
    outputs: ["Audit notes", "Priority fixes", "Recommended route"],
  },
] as const;

const INITIAL_FORM_STATE: ContactFormState = {
  name: "",
  email: "",
  message: "",
};

type ProjectTypeId = (typeof projectTypes)[number]["id"];
type ProjectStageId = (typeof projectStages)[number]["id"];
type ProjectNeedId = (typeof projectNeeds)[number]["id"];

function getProjectType(id: ProjectTypeId) {
  return projectTypes.find((item) => item.id === id) ?? projectTypes[0];
}

function getProjectStage(id: ProjectStageId) {
  return projectStages.find((item) => item.id === id) ?? projectStages[0];
}

function getProjectNeed(id: ProjectNeedId) {
  return projectNeeds.find((item) => item.id === id) ?? projectNeeds[0];
}

function formatLocalTime(date: Date) {
  return `${JAKARTA_TIME_FORMATTER.format(date)} WIB`;
}

function getRouteTitle(stageId: ProjectStageId, needId: ProjectNeedId) {
  const routeMap: Record<ProjectStageId, Record<ProjectNeedId, string>> = {
    idea: {
      architecture: "Discovery + architecture sprint",
      implementation: "Validation prototype sprint",
      polish: "Concept framing + UX direction",
      audit: "Feasibility review window",
    },
    prototype: {
      architecture: "System shaping sprint",
      implementation: "Prototype build sprint",
      polish: "Prototype refinement sprint",
      audit: "Prototype audit window",
    },
    production: {
      architecture: "Production architecture review",
      implementation: "Delivery sprint",
      polish: "Release polish sprint",
      audit: "Production audit window",
    },
  };

  return routeMap[stageId][needId];
}

function buildBriefCopy(
  typeId: ProjectTypeId,
  stageId: ProjectStageId,
  needId: ProjectNeedId,
) {
  const project = getProjectType(typeId);
  const stage = getProjectStage(stageId);
  const need = getProjectNeed(needId);
  const routeTitle = getRouteTitle(stageId, needId);

  return [
    "Hi Dery,",
    "",
    `I want to discuss a ${project.emailLabel.toLowerCase()} collaboration.`,
    "",
    `Project type: ${project.label}`,
    `Stage: ${stage.label}`,
    `Help needed: ${need.label}`,
    `Recommended route: ${routeTitle}`,
    `Preferred engagement: ${need.engagement}`,
    "",
    "Context:",
    "- Current stack:",
    "- Biggest blocker:",
    "- Desired outcome:",
  ].join("\n");
}

export default function LetsTalkPanel({
  open,
  onClose,
  onOpenChat,
}: LetsTalkPanelProps) {
  const [view, setView] = useState<PanelView>("menu");
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [projectType, setProjectType] = useState<ProjectTypeId>("ai-product");
  const [projectStage, setProjectStage] = useState<ProjectStageId>("prototype");
  const [projectNeed, setProjectNeed] = useState<ProjectNeedId>("architecture");
  const [localTime, setLocalTime] = useState<string | null>(null);
  const [lastGeneratedBrief, setLastGeneratedBrief] = useState("");
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      const timeoutId = window.setTimeout(() => {
        setView("menu");
        setForm(INITIAL_FORM_STATE);
        setStatus("idle");
        setErrorMessage("");
        setProjectType("ai-product");
        setProjectStage("prototype");
        setProjectNeed("architecture");
        setLocalTime(null);
        setLastGeneratedBrief("");
      }, 240);

      return () => window.clearTimeout(timeoutId);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimeoutId = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 24);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updateTime = () => {
      setLocalTime(formatLocalTime(new Date()));
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [open]);

  const selectedProject = getProjectType(projectType);
  const selectedStage = getProjectStage(projectStage);
  const selectedNeed = getProjectNeed(projectNeed);
  const routeTitle = getRouteTitle(projectStage, projectNeed);
  const briefCopy = buildBriefCopy(projectType, projectStage, projectNeed);
  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `${selectedProject.label} | ${routeTitle}`,
  )}&body=${encodeURIComponent(briefCopy)}`;

  const handleOpenChat = () => {
    onClose();
    window.setTimeout(() => {
      onOpenChat();
    }, 180);
  };

  const handleOpenFit = () => {
    setStatus("idle");
    setErrorMessage("");
    setView("fit");
  };

  const handleOpenForm = () => {
    setForm((current) => {
      const shouldRefreshMessage =
        !current.message.trim() || current.message === lastGeneratedBrief;

      return {
        ...current,
        message: shouldRefreshMessage ? briefCopy : current.message,
      };
    });
    setLastGeneratedBrief(briefCopy);
    setStatus("idle");
    setErrorMessage("");
    setView("form");
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(
          payload.error ?? "Your message could not be sent right now.",
        );
      }

      setForm(INITIAL_FORM_STATE);
      setStatus("idle");
      setView("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your message could not be sent right now.",
      );
    }
  };

  const submitLabel = useMemo(() => {
    if (status === "submitting") {
      return "Sending message...";
    }

    if (status === "error") {
      return "Try again";
    }

    return "Send message";
  }, [status]);

  const isSubmitDisabled =
    status === "submitting" ||
    !form.name.trim() ||
    !form.email.trim() ||
    !form.message.trim();

  const title =
    view === "fit"
      ? "Project fit"
      : view === "form"
        ? "Send a message"
        : view === "success"
          ? "Message sent."
          : "Let's talk";

  const kicker =
    view === "fit"
      ? "Pick the route first, then continue to the message form."
      : view === "form"
        ? "Your selected route is loaded below. Add the details you want me to see."
        : view === "success"
          ? "I will follow up through the email you shared."
          : "Quick routes only, so visitors can decide faster.";

  return (
    <div className={styles.overlay} data-open={open}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close Let's Talk panel"
        onClick={onClose}
      />

      <div className={`container ${styles.shell}`}>
        <aside
          className={styles.panel}
          data-open={open}
          role="dialog"
          aria-modal="true"
          aria-hidden={!open}
          aria-label="Let's Talk panel"
        >
          <div className={styles.topbar} aria-hidden="true">
            <span className={styles.grip} />
          </div>

          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.kicker}>{kicker}</p>
            </div>
            <div className={styles.headerActions}>
              {view === "fit" ? (
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label="Back to Let's Talk options"
                  onClick={() => setView("menu")}
                >
                  &lt;
                </button>
              ) : null}
              {view === "form" ? (
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label="Back to project fit options"
                  onClick={() => {
                    setView("fit");
                    setStatus("idle");
                    setErrorMessage("");
                  }}
                >
                  &lt;
                </button>
              ) : null}
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.closeButton}
                aria-label="Close Let's Talk panel"
                onClick={onClose}
              >
                x
              </button>
            </div>
          </div>

          <div className={styles.divider} aria-hidden="true" />

          {view === "menu" ? (
            <div className={styles.utilityGrid}>
              <button
                type="button"
                className={`${styles.utilityCard} ${styles.fitCard}`}
                onClick={handleOpenFit}
              >
                <div>
                  <p className={styles.utilityKicker}>Project Fit + Availability</p>
                  <h3 className={styles.utilityTitle}>{routeTitle}</h3>
                  <p className={styles.utilityMeta}>
                    {selectedStage.label} | {selectedProject.label} | {selectedNeed.label}
                  </p>
                  <p className={styles.utilityMeta}>
                    {selectedNeed.availability} | {selectedStage.kickoff}
                  </p>
                  <p className={styles.utilityMeta}>
                    Local time {localTime ?? "--:--:-- WIB"} | Reply 24-48 hours
                  </p>
                </div>
                <span className={styles.utilityMark}>FIT</span>
              </button>

              <button
                type="button"
                className={styles.utilityCard}
                onClick={handleOpenChat}
              >
                <div>
                  <h3 className={styles.utilityTitle}>Chat with my assistant</h3>
                  <p className={styles.utilityMeta}>Instant AI response</p>
                </div>
                <span className={styles.utilityMark}>AI</span>
              </button>

              <Link
                href="/#contact"
                className={styles.utilityCard}
                onClick={onClose}
              >
                <div>
                  <h3 className={styles.utilityTitle}>Open contact section</h3>
                  <p className={styles.utilityMeta}>
                    Jump to the footer contact area
                  </p>
                </div>
                <span className={styles.utilityMark} aria-hidden="true">
                  -&gt;
                </span>
              </Link>
            </div>
          ) : null}

          {view === "fit" ? (
            <div className={styles.fitView}>
              <section className={styles.fitSummary}>
                <div className={styles.fitSummaryTop}>
                  <div>
                    <p className={styles.fitKicker}>Recommended route</p>
                    <h3 className={styles.fitTitle}>{routeTitle}</h3>
                  </div>
                  <span className={styles.fitBadge}>{selectedNeed.availability}</span>
                </div>
                <p className={styles.fitText}>
                  {selectedNeed.engagement} | {selectedStage.kickoff} | Local time{" "}
                  {localTime ?? "--:--:-- WIB"}
                </p>
                <p className={styles.fitText}>
                  Best when you need {selectedNeed.summary} for a{" "}
                  {selectedStage.label.toLowerCase()} {selectedProject.label.toLowerCase()}.
                </p>
              </section>

              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>What are you building?</span>
                <div className={styles.optionRail}>
                  {projectTypes.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={styles.optionButton}
                      data-selected={projectType === option.id}
                      aria-pressed={projectType === option.id}
                      onClick={() => setProjectType(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>Where is it now?</span>
                <div className={styles.optionRail}>
                  {projectStages.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={styles.optionButton}
                      data-selected={projectStage === option.id}
                      aria-pressed={projectStage === option.id}
                      onClick={() => setProjectStage(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>What kind of help?</span>
                <div className={styles.optionRail}>
                  {projectNeeds.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={styles.optionButton}
                      data-selected={projectNeed === option.id}
                      aria-pressed={projectNeed === option.id}
                      onClick={() => setProjectNeed(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.fitActions}>
                <a
                  href={mailtoHref}
                  className={styles.secondaryAction}
                  onClick={onClose}
                >
                  Email this brief
                </a>
                <button
                  type="button"
                  className={styles.primaryAction}
                  onClick={handleOpenForm}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}

          {view === "form" ? (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldGrid}>
                <label className={styles.field}>
                  <span className={styles.label}>Name</span>
                  <input
                    className={styles.input}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                    required
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.label}>Email</span>
                  <input
                    className={styles.input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={status === "submitting"}
                    required
                  />
                </label>
              </div>

              <label className={styles.field}>
                <span className={styles.label}>Message</span>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  name="message"
                  rows={5}
                  placeholder="Hello! I would like to talk about..."
                  value={form.message}
                  onChange={handleChange}
                  disabled={status === "submitting"}
                  required
                />
              </label>

              <p className={styles.helperText}>
                I will reply to the email you put here, so make sure it is one you
                actually check.
              </p>

              {errorMessage ? (
                <p className={styles.errorText} role="alert">
                  {errorMessage}
                </p>
              ) : null}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitDisabled}
              >
                {submitLabel}
              </button>
            </form>
          ) : null}

          {view === "success" ? (
            <div className={styles.successState}>
              <div className={styles.successBadge} aria-hidden="true">
                <span>OK</span>
              </div>

              <div className={styles.successCopy}>
                <h3 className={styles.successTitle}>Thanks for reaching out.</h3>
                <p className={styles.successText}>
                  Your message is already on its way to my inbox. I will reply to
                  the email address you shared as soon as I can.
                </p>
              </div>

              <div className={styles.successActions}>
                <button
                  type="button"
                  className={styles.ghostAction}
                  onClick={() => setView("menu")}
                >
                  Back to options
                </button>
                <a href={`mailto:${CONTACT_EMAIL}`} className={styles.inlineLink}>
                  Send direct email
                </a>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
