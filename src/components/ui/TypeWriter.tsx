"use client";

import { useState, useEffect } from "react";
import styles from "./TypeWriter.module.css";

interface TypeWriterProps {
  words: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

export default function TypeWriter({ 
  words, 
  speed = 100, 
  deleteSpeed = 50, 
  pauseDuration = 2000 
}: TypeWriterProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState(words[0]?.slice(0, 1) ?? "");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const handleChange = () => {
      setIsMobile(media.matches);
    };

    handleChange();
    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (words.length === 0) {
      setCurrentText("");
      return;
    }

    const currentWord = words[currentWordIndex] ?? words[0] ?? "";
    setCurrentText(currentWord);

    const timeout = window.setTimeout(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, pauseDuration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [currentWordIndex, isMobile, pauseDuration, words]);

  useEffect(() => {
    if (isMobile) return;
    if (words.length === 0) return;

    const word = words[currentWordIndex];

    const delay = !isDeleting && currentText === word
      ? pauseDuration
      : isDeleting
        ? deleteSpeed
        : speed;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (currentText.length > 1) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          const nextIndex = (currentWordIndex + 1) % words.length;
          setCurrentWordIndex(nextIndex);
          setCurrentText(words[nextIndex].slice(0, 1));
          setIsDeleting(false);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, speed, deleteSpeed, pauseDuration, isMobile]);

  if (isMobile) {
    return (
      <span className={`${styles.typewriter} ${styles.mobileSwap}`} key={currentWordIndex}>
        {currentText}
      </span>
    );
  }

  return (
    <span className={styles.typewriter}>
      {currentText}
      <span className={styles.cursor}>|</span>
    </span>
  );
}
