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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < word.length) {
          setCurrentText(word.slice(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, speed, deleteSpeed, pauseDuration]);

  return (
    <span className={styles.typewriter}>
      {currentText}
      <span className={styles.cursor}>|</span>
    </span>
  );
}
