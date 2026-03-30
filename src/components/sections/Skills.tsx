"use client";

import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Skills.module.css";

interface Skill {
  id: string;
  label: string;
  eyebrow: string;
  description: string;
  accent: string;
  latitude: number;
  longitude: number;
}

interface ProjectedSkill extends Skill {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  blur: number;
}

interface OrbPoint {
  x: number;
  y: number;
  z: number;
}

interface MeshLine {
  id: string;
  fullPath: string;
  frontPaths: string[];
}

const BASE_TILT = -12;
const AUTO_SPIN_SPEED = 0.16;
const FOCUS_HOLD_MS = 3600;
const FRONT_Z_THRESHOLD = 0.28;

const skills: Skill[] = [
  {
    id: "llms",
    label: "LLMs",
    eyebrow: "Reasoning systems",
    description:
      "Model choice, prompting, and evaluation loops tuned for useful product behavior.",
    accent: "#f2c078",
    latitude: 20,
    longitude: -18,
  },
  {
    id: "rag",
    label: "RAG",
    eyebrow: "Grounded retrieval",
    description:
      "Search pipelines that keep outputs anchored to the right context, not just fluent text.",
    accent: "#c08cff",
    latitude: -16,
    longitude: 42,
  },
  {
    id: "python",
    label: "Python",
    eyebrow: "ML backbone",
    description:
      "The default layer for experiments, orchestration, inference services, and data work.",
    accent: "#5ab0f5",
    latitude: 10,
    longitude: -112,
  },
  {
    id: "pytorch",
    label: "PyTorch",
    eyebrow: "Model work",
    description:
      "Training, fine-tuning, and iterating on modern ML systems with practical deployment in mind.",
    accent: "#ff7b4d",
    latitude: 48,
    longitude: 18,
  },
  {
    id: "react",
    label: "React",
    eyebrow: "Product surfaces",
    description:
      "Interfaces for AI products where fast iteration, clarity, and responsive state all matter.",
    accent: "#65d8ff",
    latitude: -10,
    longitude: -58,
  },
  {
    id: "nextjs",
    label: "Next.js",
    eyebrow: "Delivery layer",
    description:
      "App Router builds that connect product pages, server rendering, and operational polish.",
    accent: "#f0f0f0",
    latitude: 14,
    longitude: 112,
  },
  {
    id: "node",
    label: "Node.js",
    eyebrow: "Real-time glue",
    description:
      "APIs, background jobs, and streaming endpoints that support agent and product workflows.",
    accent: "#8cd66f",
    latitude: 46,
    longitude: 138,
  },
  {
    id: "postgres",
    label: "Postgres",
    eyebrow: "Structured memory",
    description:
      "Reliable storage for product data, retrieval layers, and the state behind real applications.",
    accent: "#7a95ff",
    latitude: -30,
    longitude: 126,
  },
  {
    id: "docker",
    label: "Docker",
    eyebrow: "Portable runtime",
    description:
      "Clean environments for reproducible training, inference, and product deployment pipelines.",
    accent: "#46b6ff",
    latitude: -44,
    longitude: -132,
  },
  {
    id: "tailwind",
    label: "Tailwind",
    eyebrow: "Interface speed",
    description:
      "Fast layout iteration when the frontend needs to move at the same speed as the backend.",
    accent: "#33d6dd",
    latitude: -24,
    longitude: 12,
  },
];

const globeLatitudes = [-60, -42, -24, 0, 24, 42, 60];
const globeMeridians = [0, 20, 40, 60, 80, 100, 120, 140, 160];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function wrapAngle(angle: number) {
  let next = angle;

  while (next > 180) next -= 360;
  while (next < -180) next += 360;

  return next;
}

function shortestAngleDifference(from: number, to: number) {
  return wrapAngle(to - from);
}

function nearestEquivalentAngle(current: number, target: number) {
  return current + shortestAngleDifference(current, target);
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function projectOrbPoint(latitudeValue: number, longitudeValue: number, rotation: number, tilt: number): OrbPoint {
  const latitude = toRadians(latitudeValue);
  const longitude = toRadians(longitudeValue);
  const rotationY = toRadians(rotation);
  const rotationX = toRadians(tilt);

  const x0 = Math.cos(latitude) * Math.sin(longitude);
  const y0 = Math.sin(latitude);
  const z0 = Math.cos(latitude) * Math.cos(longitude);

  const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
  const y1 = y0;
  const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

  const x2 = x1;
  const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
  const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

  return {
    x: x2,
    y: y2,
    z: z2,
  };
}

function projectSkill(skill: Skill, rotation: number, tilt: number): ProjectedSkill {
  const point = projectOrbPoint(skill.latitude, skill.longitude, rotation, tilt);

  const depth = (point.z + 1) / 2;

  return {
    ...skill,
    x: point.x,
    y: point.y,
    z: point.z,
    scale: 0.72 + depth * 0.56,
    opacity: 0.18 + depth * 0.82,
    blur: (1 - depth) * 1.35,
  };
}

function pointToSvg(point: OrbPoint) {
  const x = 50 + point.x * 37.6;
  const y = 50 + point.y * 37.6;

  return `${x.toFixed(2)} ${y.toFixed(2)}`;
}

function buildLinePath(points: OrbPoint[]) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${pointToSvg(point)}`)
    .join(" ");
}

function buildFrontSegments(points: OrbPoint[], loop = false) {
  if (points.length === 0) {
    return [];
  }

  const wrappedPoints = loop ? [...points, points[0]] : points;
  const segments: OrbPoint[][] = [];
  let current: OrbPoint[] = [];

  wrappedPoints.forEach((point) => {
    if (point.z >= 0) {
      current.push(point);
      return;
    }

    if (current.length > 1) {
      segments.push(current);
    }

    current = [];
  });

  if (current.length > 1) {
    segments.push(current);
  }

  const firstPoint = points[0];
  const lastPoint = points.at(-1);

  if (loop && segments.length > 1 && firstPoint && firstPoint.z >= 0 && lastPoint && lastPoint.z >= 0) {
    const [first, ...rest] = segments;
    const last = rest.pop();

    if (first && last) {
      segments.splice(0, segments.length, [...last, ...first.slice(1)], ...rest);
    }
  }

  return segments.map((segment) => buildLinePath(segment));
}

function buildMesh(rotation: number, tilt: number) {
  const latitudes: MeshLine[] = globeLatitudes.map((latitude) => {
    const points = Array.from({ length: 73 }, (_, index) =>
      projectOrbPoint(latitude, index * 5 - 180, rotation, tilt),
    );

    return {
      id: `lat-${latitude}`,
      fullPath: buildLinePath(points),
      frontPaths: buildFrontSegments(points, true),
    };
  });

  const meridians: MeshLine[] = globeMeridians.map((longitude) => {
    const points = Array.from({ length: 73 }, (_, index) =>
      projectOrbPoint(index * 2.5 - 90, longitude, rotation, tilt),
    );

    return {
      id: `lon-${longitude}`,
      fullPath: buildLinePath(points),
      frontPaths: buildFrontSegments(points),
    };
  });

  return {
    latitudes,
    meridians,
  };
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

export default function Skills() {
  const orbRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(12);
  const tiltRef = useRef(BASE_TILT);
  const targetRotationRef = useRef<number | null>(null);
  const targetTiltRef = useRef(BASE_TILT);
  const draggingRef = useRef(false);
  const dragStateRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startRotation: 0,
    startTilt: BASE_TILT,
  });
  const holdSelectionUntilRef = useRef(0);
  const isVisibleRef = useRef(false);
  const [rotation, setRotation] = useState(rotationRef.current);
  const [tilt, setTilt] = useState(BASE_TILT);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(
    skills[0]?.id ?? null,
  );

  useEffect(() => {
    const node = orbRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        isVisibleRef.current = visible;
        setIsVisible(visible);
      },
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const animateOrb = useEffectEvent((now: number) => {
    if (!isVisibleRef.current || draggingRef.current) {
      return;
    }

    if (selectedSkillId && holdSelectionUntilRef.current && now > holdSelectionUntilRef.current) {
      holdSelectionUntilRef.current = 0;
      setSelectedSkillId(null);
    }

    const targetRotation = targetRotationRef.current;

    if (targetRotation !== null) {
      const delta = shortestAngleDifference(rotationRef.current, targetRotation);
      rotationRef.current = wrapAngle(rotationRef.current + delta * 0.11);

      if (Math.abs(delta) < 0.16) {
        rotationRef.current = wrapAngle(targetRotation);
        targetRotationRef.current = null;
      }
    } else if (!selectedSkillId) {
      rotationRef.current = wrapAngle(rotationRef.current + AUTO_SPIN_SPEED);
    }

    const tiltDelta = targetTiltRef.current - tiltRef.current;
    tiltRef.current += tiltDelta * 0.08;

    setRotation(rotationRef.current);
    setTilt(tiltRef.current);
  });

  useEffect(() => {
    let frame = 0;

    const tick = (now: number) => {
      animateOrb(now);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [animateOrb]);

  const projectedSkills = useMemo(
    () => skills.map((skill) => projectSkill(skill, rotation, tilt)),
    [rotation, tilt],
  );
  const mesh = useMemo(() => buildMesh(rotation, tilt), [rotation, tilt]);
  const orbShadeStyle = {
    "--globe-light-angle": `${wrapAngle(rotation * -1 + 118)}deg`,
  } as CSSProperties;

  const frontSkillId =
    projectedSkills.reduce((front, skill) => {
      if (!front || skill.z > front.z) {
        return skill;
      }

      return front;
    }, null as ProjectedSkill | null)?.id ?? skills[0].id;

  const activeSkillId = hoveredSkillId ?? selectedSkillId ?? frontSkillId;
  const activeSkill =
    skills.find((skill) => skill.id === activeSkillId) ?? skills[0];
  const activeSkillIndex = skills.findIndex((skill) => skill.id === activeSkill.id);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const target = event.target;

    if (target instanceof HTMLElement && target.closest("[data-skill-node='true']")) {
      return;
    }

    draggingRef.current = true;
    targetRotationRef.current = null;
    targetTiltRef.current = tiltRef.current;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRotation: rotationRef.current,
      startTilt: tiltRef.current,
    };
    setSelectedSkillId(null);
    setHoveredSkillId(null);
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !draggingRef.current ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;
    const nextRotation = wrapAngle(
      dragStateRef.current.startRotation + deltaX * 0.34,
    );
    const nextTilt = clamp(
      dragStateRef.current.startTilt - deltaY * 0.12,
      -24,
      14,
    );

    rotationRef.current = nextRotation;
    tiltRef.current = nextTilt;
    setRotation(nextRotation);
    setTilt(nextTilt);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !draggingRef.current ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return;
    }

    draggingRef.current = false;
    dragStateRef.current.pointerId = -1;
    targetTiltRef.current = BASE_TILT;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkillId(skill.id);
    setHoveredSkillId(null);
    holdSelectionUntilRef.current = performance.now() + FOCUS_HOLD_MS;
    targetRotationRef.current = nearestEquivalentAngle(
      rotationRef.current,
      -skill.longitude,
    );
    targetTiltRef.current = BASE_TILT;
  };

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
            <h2 className={styles.title}>Systems that orbit product, not the other way around.</h2>
            <p className={styles.text}>
              The stack is broad, but the center stays clear: model quality,
              retrieval, application UX, and deployment reliability all need to
              move together when AI work ships to real users.
            </p>
            <div className={styles.copyMeta}>
              <span>Drag to rotate</span>
              <span>Click a node to focus</span>
              <span>{skills.length} core layers</span>
            </div>
          </div>

          <div className={styles.orbColumn}>
            <div
              ref={orbRef}
              className={`${styles.orbStage} ${isDragging ? styles.orbStageDragging : ""}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className={styles.orbField} aria-hidden="true" />
              <div className={styles.orbAura} aria-hidden="true" />
              <div className={styles.orbSphere} aria-hidden="true" />
              <div
                className={styles.orbShade}
                style={orbShadeStyle}
                aria-hidden="true"
              />
              <svg
                className={styles.wireframe}
                viewBox="0 0 100 100"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="skill-orb-glow" cx="50%" cy="45%" r="72%">
                    <stop offset="0%" stopColor="rgba(224,182,130,0.14)" />
                    <stop offset="55%" stopColor="rgba(74,83,94,0.12)" />
                    <stop offset="100%" stopColor="rgba(74,83,94,0)" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="38" fill="url(#skill-orb-glow)" />
                <circle cx="50" cy="50" r="37.6" className={styles.wireframeOuter} />
                {mesh.latitudes.map((line) => (
                  <path
                    key={`${line.id}-back`}
                    d={line.fullPath}
                    className={styles.wireframeBack}
                  />
                ))}
                {mesh.meridians.map((line) => (
                  <path
                    key={`${line.id}-back`}
                    d={line.fullPath}
                    className={styles.wireframeBack}
                  />
                ))}
                {mesh.latitudes.flatMap((line) =>
                  line.frontPaths.map((path, index) => (
                    <path
                      key={`${line.id}-front-${index}`}
                      d={path}
                      className={line.id === "lat-0" ? styles.wireframeFrontStrong : styles.wireframeFront}
                    />
                  )),
                )}
                {mesh.meridians.flatMap((line) =>
                  line.frontPaths.map((path, index) => (
                    <path
                      key={`${line.id}-front-${index}`}
                      d={path}
                      className={styles.wireframeFront}
                    />
                  )),
                )}
              </svg>

              <div className={styles.coreCenter}>
                <div
                  className={styles.coreIcon}
                  style={{ "--active-accent": activeSkill.accent } as CSSProperties}
                >
                  <SkillIcon skillId={activeSkill.id} />
                </div>
                <p className={styles.coreCenterLabel}>{activeSkill.label}</p>
              </div>

              {projectedSkills.map((skill) => {
                const isActive = skill.id === activeSkillId;
                const isFront = skill.z >= FRONT_Z_THRESHOLD;
                const nodeStyle = {
                  "--node-x": `${(skill.x * 31).toFixed(2)}%`,
                  "--node-y": `${(skill.y * 27).toFixed(2)}%`,
                  "--node-scale": skill.scale.toFixed(3),
                  "--node-opacity": skill.opacity.toFixed(3),
                  "--node-blur": `${skill.blur.toFixed(2)}px`,
                  "--node-accent": skill.accent,
                  zIndex: Math.round((skill.z + 1) * 100),
                } as CSSProperties;

                return (
                  <button
                    key={skill.id}
                    type="button"
                    data-skill-node="true"
                    data-active={isActive}
                    data-front={isFront}
                    className={styles.skillNode}
                    style={nodeStyle}
                    onMouseEnter={() => setHoveredSkillId(skill.id)}
                    onMouseLeave={() => setHoveredSkillId(null)}
                    onFocus={() => setHoveredSkillId(skill.id)}
                    onBlur={() => setHoveredSkillId(null)}
                    onClick={() => handleSkillClick(skill)}
                    aria-pressed={isActive}
                    aria-label={`Focus ${skill.label}`}
                  >
                    <span className={styles.skillGlow} aria-hidden="true" />
                    <span className={styles.skillIcon}>
                      <SkillIcon skillId={skill.id} />
                    </span>
                    <span className={styles.skillLabel}>{skill.label}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.detailCard}>
              <div className={styles.detailHead}>
                <p className={styles.detailEyebrow}>{activeSkill.eyebrow}</p>
                <p className={styles.detailCounter}>
                  {String(activeSkillIndex + 1).padStart(2, "0")} / {String(skills.length).padStart(2, "0")}
                </p>
              </div>
              <h3 className={styles.detailTitle}>{activeSkill.label}</h3>
              <p className={styles.detailDescription}>{activeSkill.description}</p>
            </div>

            <div className={styles.stackLegend}>
              <span>AI reasoning</span>
              <span>Retrieval</span>
              <span>Applications</span>
              <span>Infra</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
