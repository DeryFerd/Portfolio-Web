"use client";

import Link from "next/link";
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  assistantQuickPrompts,
  buildAssistantReply,
  type AssistantLink,
} from "@/lib/portfolioAssistant";
import styles from "./PortfolioChatPanel.module.css";

type MessageRole = "assistant" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  links?: AssistantLink[];
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "intro",
  role: "assistant",
  text:
    "Hi, I'm Dery's on-site AI guide. Ask me about the background, selected projects, core stack, experience, writing, or the best way to get in touch.",
  links: [
    { label: "Open about", href: "/#about" },
    { label: "Open projects", href: "/#projects" },
  ],
};

interface PortfolioChatPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function PortfolioChatPanel({
  open,
  onClose,
}: PortfolioChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [draft, setDraft] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!bodyRef.current) {
      return;
    }

    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [isThinking, messages, open]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sendPrompt = (rawPrompt: string) => {
    const prompt = rawPrompt.trim();
    if (!prompt || isThinking) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: prompt,
    };

    startTransition(() => {
      setMessages((current) => [...current, userMessage]);
    });
    setDraft("");
    setIsThinking(true);

    timeoutRef.current = window.setTimeout(() => {
      const reply = buildAssistantReply(prompt);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: reply.text,
        links: reply.links,
      };

      startTransition(() => {
        setMessages((current) => [...current, assistantMessage]);
      });
      setIsThinking(false);
      timeoutRef.current = null;
    }, 280);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(draft);
  };

  const resetConversation = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsThinking(false);
    setDraft("");
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className={styles.overlay} data-open={open}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close AI chat"
        onClick={onClose}
      />

      <aside
        className={styles.panel}
        data-open={open}
        aria-hidden={!open}
        aria-label="Portfolio AI chat"
      >
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.kicker}>Chat with My AI</p>
            <h2 className={styles.title}>Ask about the portfolio</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close AI chat"
          >
            ×
          </button>
        </div>

        <div className={styles.panelIntro}>
          <span className={styles.statusDot} aria-hidden="true" />
          <p className={styles.introText}>
            Portfolio context loaded: about, projects, stack, experience,
            journal, and contact.
          </p>
        </div>

        <div className={styles.promptRail}>
          {assistantQuickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className={styles.promptChip}
              onClick={() => sendPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <div ref={bodyRef} className={styles.messages}>
          {messages.map((message) => (
            <article
              key={message.id}
              className={styles.message}
              data-role={message.role}
            >
              <p className={styles.messageLabel}>
                {message.role === "assistant" ? "AI guide" : "You"}
              </p>
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>{message.text}</p>
                {message.links && message.links.length > 0 ? (
                  <div className={styles.linkRail}>
                    {message.links.map((link) => (
                      <Link
                        key={`${message.id}-${link.href}`}
                        href={link.href}
                        className={styles.messageLink}
                        onClick={onClose}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}

          {isThinking ? (
            <article className={styles.message} data-role="assistant">
              <p className={styles.messageLabel}>AI guide</p>
              <div className={styles.messageBubble}>
                <div className={styles.thinkingDots} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </article>
          ) : null}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.resetButton}
              onClick={resetConversation}
            >
              Reset
            </button>
            <Link href="/#contact" className={styles.contactLink} onClick={onClose}>
              Need a human instead?
            </Link>
          </div>

          <form className={styles.composer} onSubmit={handleSubmit}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className={styles.input}
              placeholder="Ask about projects, stack, writing, or contact..."
              aria-label="Ask the portfolio AI"
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!draft.trim() || isThinking}
            >
              Send
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
