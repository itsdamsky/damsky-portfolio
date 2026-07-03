"use client";

import { useRef, useState, useLayoutEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface SpotlightNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

interface SpotlightBottomNavProps {
  items: SpotlightNavItem[];
  activeId: string;
  onChange: (id: string) => void;
  surfaceColor?: string;
  iconColorInactive?: string;
  iconColorActive?: string;
  /** solid fallback color for the glow (used for box-shadow) */
  beamColor?: string;
  /** gradient endpoints for the rim bar + beam — defaults to the site's orange theme */
  accentFrom?: string;
  accentTo?: string;
  springConfig?: SpringConfig;
}

export default function SpotlightBottomNav({
  items,
  activeId,
  onChange,
  surfaceColor = "rgba(70,70,74,0.9)",
  iconColorInactive = "rgba(20,20,22,0.85)",
  iconColorActive = "#ff9142",
  beamColor = "#ff9142",
  accentFrom = "#ff9142",
  accentTo = "#e84c00",
  springConfig = { stiffness: 260, damping: 24, mass: 1 },
}: SpotlightBottomNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [ready, setReady] = useState(false);

  // center-x of the active icon, relative to container (clamped so the
  // bar/beam never spill past the pill's rounded edges on the first/last item)
  const targetCenter = useMotionValue(0);
  const center = useSpring(targetCenter, springConfig);

  const BAR_W = 64; // wide glowing bar
  const BEAM_TOP_W = 60; // beam width right under the rim (close to bar width)
  const BEAM_BOTTOM_W = 34; // beam narrows further as it reaches the icon

  const BEAM_BOX_W = Math.max(BEAM_TOP_W, BEAM_BOTTOM_W);
  const TOP_LEFT = (BEAM_BOX_W - BEAM_TOP_W) / 2;
  const TOP_RIGHT = TOP_LEFT + BEAM_TOP_W;
  const BOTTOM_LEFT = (BEAM_BOX_W - BEAM_BOTTOM_W) / 2;
  const BOTTOM_RIGHT = BOTTOM_LEFT + BEAM_BOTTOM_W;

  // Pre-offset the x transforms so each element is already centered on
  // `center`, instead of mixing a motion-value `x` with a static
  // `translateX: -50%`. Mixing those two forces the browser to recompute
  // the transform on the main thread every frame instead of just moving a
  // GPU layer — that's the #1 cause of the animation feeling laggy on
  // phones. A single `x` channel stays fully compositor-driven.
  const barX = useTransform(center, (v) => v - BAR_W / 2);
  const beamX = useTransform(center, (v) => v - BEAM_BOX_W / 2);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const el = itemRefs.current[activeId];
    if (!container || !el) return;

    const containerBox = container.getBoundingClientRect();
    const elBox = el.getBoundingClientRect();
    let nextCenter = elBox.left - containerBox.left + elBox.width / 2;

    // keep the bar fully inside the pill, clear of its rounded corners
    const margin = BAR_W / 2 + 12;
    nextCenter = Math.min(
      Math.max(nextCenter, margin),
      containerBox.width - margin
    );

    targetCenter.set(nextCenter);
    if (!ready) {
      center.jump(nextCenter);
      setReady(true);
    }
  }, [activeId, ready, targetCenter, center]);

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, items.length]);

  const gradient = `linear-gradient(90deg, ${accentFrom}, ${accentTo})`;

  return (
    <div
      ref={containerRef}
      className="relative flex items-stretch w-full select-none overflow-hidden"
      style={{ backgroundColor: surfaceColor, height: 76, borderRadius: 999 }}
    >
      {/* ---- glowing rim bar ---- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          top: -3,
          height: 6,
          width: BAR_W,
          x: barX,
          willChange: "transform",
          background: gradient,
          opacity: ready ? 1 : 0,
          boxShadow: `0 0 8px 1px ${beamColor}88`,
        }}
      />

      {/* ---- light beam / cone ---- */}
      {/* box is sized to the wider of the two ends, so the cone can
          either flare out OR converge (like a real spotlight narrowing
          onto the icon) without getting clipped by its own box.
          clip-path is a static shape here (only `x` animates), so it can
          stay on the compositor as long as it gets its own layer — hence
          willChange below. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: 0,
          height: 58,
          width: BEAM_BOX_W,
          x: beamX,
          willChange: "transform",
          opacity: ready ? 1 : 0,
          clipPath: `polygon(${TOP_LEFT}px 0, ${TOP_RIGHT}px 0, ${BOTTOM_RIGHT}px 100%, ${BOTTOM_LEFT}px 100%)`,
          background: `linear-gradient(180deg, ${accentFrom}66 0%, ${accentTo}22 60%, transparent 100%)`,
        }}
      />

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
            className="relative z-10 flex-1 flex items-center justify-center outline-none"
            style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <motion.span
              animate={{
                scale: isActive ? 1.08 : 1,
                color: isActive ? iconColorActive : iconColorInactive,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Icon size={24} strokeWidth={2.2} fill={isActive ? iconColorActive : "none"} />
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}
