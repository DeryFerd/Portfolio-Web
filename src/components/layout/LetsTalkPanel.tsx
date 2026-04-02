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
import styles from "./LetsTalkPanel.module.css";

type PanelView = "menu" | "form" | "success";
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

const DIRECT_EMAIL = "deryferdikao125@gmail.com";
const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const JAKARTA_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  timeZone: JAKARTA_TIME_ZONE,
});

const QUICK_FIT = {
  projectLabel: "AI Product",
  stageLabel: "Prototype",
  needLabel: "Architecture",
  routeTitle: "System shaping sprint",
  preferredEngagement: "Advisory sprint",
  availability: "2 advisory windows open",
  kickoff: "Kickoff window: 7-10 days",
};

const INITIAL_FORM_STATE: ContactFormState = {
  name: "",
  email: "",
  message: "",
};

function formatLocalTime(date: Date) {
  return `${JAKARTA_TIME_FORMATTER.format(date)} WIB`;
}

function buildBriefCopy() {
  return [
    "Hi Dery,",
    "",
    "I want to discuss an AI product collaboration.",
    "",
    `Project type: ${QUICK_FIT.projectLabel}`,
    `Stage: ${QUICK_FIT.stageLabel}`,
    `Help needed: ${QUICK_FIT.needLabel}`,
    `Recommended route: ${QUICK_FIT.routeTitle}`,
    `Preferred engagement: ${QUICK_FIT.preferredEngagement}`,
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
  const [localTime, setLocalTime] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      const timeoutId = window.setTimeout(() => {
        setView("menu");
        setForm(INITIAL_FORM_STATE);
        setStatus("idle");
        setErrorMessage("");
        setLocalTime(null);
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

  const briefCopy = useMemo(() => buildBriefCopy(), []);

  const handleOpenChat = () => {
    onClose();
    window.setTimeout(() => {
      onOpenChat();
    }, 180);
  };

  const handleOpenForm = () => {
    setForm((current) => ({
      ...current,
      message: current.message.trim() ? current.message : briefCopy,
    }));
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
    view === "form"
      ? "Send a message"
      : view === "success"
        ? "Message sent."
        : "Let's talk";

  const kicker =
    view === "form"
      ? "Your brief is loaded below. Add the details you want me to see."
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
              {view === "form" ? (
                <button
                  type="button"
                  className={styles.closeButton}
                  aria-label="Back to Let's Talk options"
                  onClick={() => {
                    setView("menu");
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
                onClick={handleOpenForm}
              >
                <div>
                  <p className={styles.utilityKicker}>Project Fit + Availability</p>
                  <h3 className={styles.utilityTitle}>{QUICK_FIT.routeTitle}</h3>
                  <p className={styles.utilityMeta}>
                    {QUICK_FIT.stageLabel} · {QUICK_FIT.projectLabel} ·{" "}
                    {QUICK_FIT.needLabel}
                  </p>
                  <p className={styles.utilityMeta}>
                    {QUICK_FIT.availability} · {QUICK_FIT.kickoff}
                  </p>
                  <p className={styles.utilityMeta}>
                    Local time {localTime ?? "--:--:-- WIB"} · Reply 24-48 hours
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
                <a href={`mailto:${DIRECT_EMAIL}`} className={styles.inlineLink}>
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
