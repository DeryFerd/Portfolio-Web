"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Link2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId: number) => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number) => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const centerViewOnNode = (nodeId: number) => {
    if (!nodeRefs.current[nodeId]) return;

    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;

    setRotationAngle(270 - targetAngle);
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const nextState: Record<number, boolean> = {};
      const willOpen = !prev[id];

      if (willOpen) {
        nextState[id] = true;
        setActiveNodeId(id);
        setAutoRotate(false);

        const relatedItems = getRelatedItems(id);
        const nextPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relatedId) => {
          nextPulseEffect[relatedId] = true;
        });
        setPulseEffect(nextPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return nextState;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;

    const rotationTimer = window.setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.28) % 360).toFixed(3)));
    }, 50);

    return () => window.clearInterval(rotationTimer);
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 210;
    const radian = (angle * Math.PI) / 180;

    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(
      0.44,
      Math.min(1, 0.48 + 0.52 * ((1 + Math.sin(radian)) / 2)),
    );

    return { x, y, zIndex, opacity };
  };

  const getStatusStyles = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":
        return "text-[#f5f0e6] bg-[#111111] border-white/30";
      case "in-progress":
        return "text-[#111111] bg-[#f5f0e6] border-[#111111]/20";
      case "pending":
      default:
        return "text-[#f5f0e6] bg-[#111111]/50 border-white/15";
    }
  };

  const activeItem = useMemo(
    () => timelineData.find((item) => item.id === activeNodeId) ?? null,
    [activeNodeId, timelineData],
  );

  return (
    <div
      ref={orbitRef}
      className="relative flex min-h-[34rem] w-full items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1116] text-white shadow-[0_28px_80px_rgba(7,8,10,0.38)]"
      onClick={handleContainerClick}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(135,206,235,0.08),transparent_36%),radial-gradient(circle_at_22%_22%,rgba(107,140,255,0.18),transparent_26%),radial-gradient(circle_at_78%_76%,rgba(84,190,160,0.14),transparent_24%)]" />

      <div className="absolute h-[27rem] w-[27rem] rounded-full border border-white/10" />
      <div className="absolute h-[20rem] w-[20rem] rounded-full border border-white/5" />

      <div className="absolute z-10 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-emerald-400 shadow-[0_0_40px_rgba(79,155,255,0.4)]">
        <div className="absolute h-24 w-24 animate-ping rounded-full border border-white/20 opacity-60" />
        <div
          className="absolute h-28 w-28 animate-ping rounded-full border border-white/10 opacity-35"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-md" />
      </div>

      {timelineData.map((item, index) => {
        const position = calculateNodePosition(index, timelineData.length);
        const isExpanded = expandedItems[item.id];
        const isRelated = isRelatedToActive(item.id);
        const isPulsing = pulseEffect[item.id];
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            ref={(node) => {
              nodeRefs.current[item.id] = node;
            }}
            className="absolute transition-all duration-700"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            }}
          >
            <button
              type="button"
              className="group relative flex flex-col items-center"
              onClick={(event) => {
                event.stopPropagation();
                toggleItem(item.id);
              }}
              aria-label={`Inspect ${item.title}`}
            >
              <div
                className={`absolute -inset-3 rounded-full ${
                  isPulsing ? "animate-pulse duration-1000" : ""
                }`}
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 72%)",
                }}
              />

              <div
                className={[
                  "relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isExpanded
                    ? "scale-150 border-white bg-white text-black shadow-[0_0_26px_rgba(255,255,255,0.22)]"
                    : isRelated
                      ? "border-white bg-white/70 text-black"
                      : "border-white/30 bg-black/70 text-white",
                ].join(" ")}
              >
                <Icon size={16} />
              </div>

              <span
                className={[
                  "absolute top-14 whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-[0.24em] transition-all duration-300",
                  isExpanded ? "scale-110 text-white" : "text-white/62",
                ].join(" ")}
              >
                {item.title}
              </span>
            </button>
          </div>
        );
      })}

      <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-end justify-between">
        <div className="max-w-[14rem]">
          <p className="mb-2 text-[0.66rem] uppercase tracking-[0.24em] text-white/45">
            Quick orbit
          </p>
          <p className="text-sm leading-6 text-white/68">
            A rotating systems map for the same six chapters when you want the short version first.
          </p>
        </div>

        {activeItem ? (
          <Card className="pointer-events-auto w-[18rem] border-white/14 bg-black/72 text-white shadow-[0_18px_44px_rgba(0,0,0,0.42)] backdrop-blur-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <Badge className={getStatusStyles(activeItem.status)}>
                  {activeItem.status === "completed"
                    ? "COMPLETE"
                    : activeItem.status === "in-progress"
                      ? "IN PROGRESS"
                      : "PENDING"}
                </Badge>
                <span className="text-xs font-mono text-white/45">{activeItem.date}</span>
              </div>
              <CardTitle className="mt-1 text-lg text-white">
                {activeItem.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm text-white/78">
              <p>{activeItem.content}</p>

              <div className="rounded-2xl border border-white/8 bg-white/4 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-white/72">
                    <Zap size={11} />
                    Energy
                  </span>
                  <span className="font-mono text-white/52">{activeItem.energy}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400"
                    style={{ width: `${activeItem.energy}%` }}
                  />
                </div>
              </div>

              {activeItem.relatedIds.length > 0 ? (
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/52">
                    <Link2 size={11} />
                    Connected nodes
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeItem.relatedIds.map((relatedId) => {
                      const relatedItem = timelineData.find((entry) => entry.id === relatedId);
                      if (!relatedItem) return null;

                      return (
                        <Button
                          key={relatedId}
                          variant="outline"
                          size="sm"
                          className="h-7 rounded-full border-white/14 bg-transparent px-3 text-[0.68rem] uppercase tracking-[0.14em] text-white/78 hover:bg-white/10 hover:text-white"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleItem(relatedId);
                          }}
                        >
                          {relatedItem.title}
                          <ArrowRight size={10} />
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <div className="pointer-events-none max-w-[16rem] rounded-[1.4rem] border border-white/10 bg-white/4 px-4 py-3 text-sm leading-6 text-white/56 backdrop-blur-md">
            Click any orbit node to pause rotation, inspect the chapter, and reveal connected roles.
          </div>
        )}
      </div>
    </div>
  );
}
