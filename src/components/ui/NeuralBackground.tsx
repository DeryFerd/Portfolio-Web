"use client";

import { useEffect, useRef } from "react";
import styles from "./NeuralBackground.module.css";

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let nodes: { x: number; y: number; vx: number; vy: number; size: number; pulse: number }[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createNodes = () => {
      nodes = [];
      const nodeCount = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 2.5 + 1.5,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      const accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim() || "#00b4d8";

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.05;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const currentSize = node.size + Math.sin(node.pulse) * 0.8;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = 0.5;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, currentSize + 2, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 1;
        ctx.stroke();

        nodes.slice(i + 1).forEach((other) => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = accentColor;
            ctx.globalAlpha = 0.15 * (1 - dist / 200);
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });

        nodes.slice(i + 1).forEach((other) => {
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80 && dist > 0) {
            const midX = (node.x + other.x) / 2;
            const midY = (node.y + other.y) / 2;
            const pulseSize = 3 + Math.sin(time * 2 + dist * 0.1) * 2;
            
            ctx.beginPath();
            ctx.arc(midX, midY, pulseSize, 0, Math.PI * 2);
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = 0.4;
            ctx.fill();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createNodes();
    draw();

    const handleResize = () => {
      resize();
      createNodes();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
