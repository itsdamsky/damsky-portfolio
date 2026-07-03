"use client";

import { useRef, useState, useLayoutEffect, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface LiquidNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

interface LiquidBottomNavProps {
  items: LiquidNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  surfaceColor?: string;
  iconColorInactive?: string;
  iconColorActive?: string;
  accentFrom?: string;
  accentTo?: string;
  springConfig?: SpringConfig;
}

export default function LiquidBottomNav({
  items,
  activeId,
  onChange,
  surfaceColor = "#1e1e22",
  iconColorInactive = "rgba(255,255,255,0.45)",
  iconColorActive = "#ffffff",
  accentFrom = "#ff9142",
  accentTo = "#e84c00",
  springConfig = { stiffness: 210, damping: 20, mass: 1 },
}: LiquidBottomNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ready, setReady] = useState(false);

  // Target box (raw, unsprung) for the active item
  const targetX = useMotionValue(0);
  const targetWidth = useMotionValue(0);

  // Sprung values that actually drive the bubble
  const x = useSpring(targetX, springConfig);
  const width = useSpring(targetWidth, springConfig);

  // Liquid squash/stretch derived from horizontal velocity
  const xVelocity = useVelocity(x);
  const rawStretch = useTransform(xVelocity, [-1800, 0, 1800], [1.35, 1, 1.35], {
    clamp: true,
  });
  const stretch = useSpring(rawStretch, { stiffness: 300, damping: 22, mass: 0.4 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    const el = itemRefs.current[activeId];
    if (!container || !el) return;

    const containerBox = container.getBoundingClientRect();
    const elBox = el.getBoundingClientRect();

    const nextX = elBox.left - containerBox.left;
    const nextWidth = elBox.width;

    targetX.set(nextX);
    targetWidth.set(nextWidth);

    if (!ready) {
      x.jump(nextX);
      width.jump(nextWidth);
      setReady(true);
    }
  }, [activeId, ready, targetX, targetWidth, width, x]);

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, items.length]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-stretch w-full select-none"
      style={{ backgroundColor: surfaceColor, height: 68 }}
    >
      {/* ---- liquid glass bubble ---- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full overflow-hidden"
        style={{
          top: -14,
          height: 68 + 14,
          x,
          width,
          scaleX: stretch,
          opacity: ready ? 1 : 0,
          transformOrigin: "50% 100%",
        }}
      >
        {/* soft outer glow using accent colors */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `linear-gradient(160deg, ${accentFrom}55, ${accentTo}33)`,
            filter: "blur(0.5px)",
          }}
        />
        {/* frosted glass core */}
        <div
          className="absolute inset-0 rounded-full backdrop-blur-md"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow:
              `0 8px 24px -6px ${accentTo}66, inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.12)`,
          }}
        />
        {/* glare highlight, top-left, like a glass bubble */}
        <div
          className="absolute rounded-full"
          style={{
            top: "12%",
            left: "14%",
            width: "34%",
            height: "34%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(1px)",
          }}
        />
      </motion.div>

      {/* ---- nav items ---- */}
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            ref={(el) => {
              itemRefs.current[item.id] = el;
            }}
            type="button"
            onClick={() => onChange(item.id)}
            className="relative z-10 flex-1 flex flex-col items-center justify-center gap-1 outline-none"
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <motion.span
              animate={{
                scale: isActive ? 1.08 : 1,
                y: isActive ? -1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              style={{ color: isActive ? iconColorActive : iconColorInactive }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
            </motion.span>

            <motion.span
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                height: isActive ? 14 : 0,
                marginTop: isActive ? 0 : -2,
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="text-[11px] font-medium leading-none overflow-hidden"
              style={{ color: iconColorActive }}
            >
              {item.label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
