"use client";

import { useRef, useState, useLayoutEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
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
  borderColor?: string;
  cornerRadius?: number;
  iconColorInactive?: string;
  iconColorActive?: string;
  beamColor?: string;
  accentFrom?: string;
  accentTo?: string;
  springConfig?: SpringConfig;
}

// Bar dengan lembah/dip di tengah atas. Sudut luar bisa kotak tegas
// (cornerRadius = 0) atau sedikit membulat (cornerRadius > 0).
function buildPillPath(
  w: number,
  h: number,
  cx: number,
  dipWidth: number,
  dipDepth: number,
  cornerRadius: number
) {
  const r = Math.max(0, Math.min(cornerRadius, h / 2));
  const left = Math.max(cx - dipWidth / 2, r + 4);
  const right = Math.min(cx + dipWidth / 2, w - r - 4);
  const c = dipWidth * 0.28;

  const topRightCorner = r > 0 ? `A ${r} ${r} 0 0 1 ${w} ${r}` : `L ${w} 0`;
  const bottomRightCorner = r > 0 ? `A ${r} ${r} 0 0 1 ${w - r} ${h}` : `L ${w} ${h}`;
  const bottomLeftCorner = r > 0 ? `A ${r} ${r} 0 0 1 0 ${h - r}` : `L 0 ${h}`;
  const topLeftCorner = r > 0 ? `A ${r} ${r} 0 0 1 ${r} 0` : `L 0 0`;

  return [
    `M ${r} 0`,
    `L ${left} 0`,
    `C ${left + c} 0, ${cx - c} ${dipDepth}, ${cx} ${dipDepth}`,
    `C ${cx + c} ${dipDepth}, ${right - c} 0, ${right} 0`,
    `L ${w - r} 0`,
    topRightCorner,
    `L ${w} ${h - r}`,
    bottomRightCorner,
    `L ${r} ${h}`,
    bottomLeftCorner,
    `L 0 ${r}`,
    topLeftCorner,
    "Z",
  ].join(" ");
}

export default function SpotlightBottomNav({
  items,
  activeId,
  onChange,
  // Diganti dari hitam ke abu-abu gelap netral, supaya kelihatan sebagai
  // elemen terpisah di atas background page yang full hitam.
  surfaceColor = "#1c1c22",
  borderColor = "transparent",
  cornerRadius = 0,
  iconColorInactive = "rgba(255,255,255,0.45)",
  iconColorActive = "#fff",
  beamColor = "#ff9142",
  accentFrom = "#ff9142",
  accentTo = "#e84c00",
  springConfig = { stiffness: 260, damping: 24, mass: 1 },
}: SpotlightBottomNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const PILL_H = 76;
  const BAR_H = 116; // headroom above the pill for the circle to float in
  const CIRCLE_D = 60;
  const GAP = 0; // visible gap between the circle's underside and the valley
  const DIP_DEPTH = 34; // how far the valley pushes down into the pill
  const DIP_WIDTH = 130; // wide enough that the gap tapers gently, not abruptly

  const targetCenter = useMotionValue(0);
  const center = useSpring(targetCenter, springConfig);
  const circleX = useTransform(center, (v) => v - CIRCLE_D / 2);
  // Posisi X label nama menu ikut center yang sama dengan lingkaran aktif,
  // supaya teksnya selalu ada di bawah item yang sedang aktif.
  const labelX = useTransform(center, (v) => v);

  // Circle's vertical position is fixed (it doesn't bounce up/down, only
  // side to side) — only the pill's valley position animates to track it.
  const circleTop = DIP_DEPTH - GAP - CIRCLE_D / 2;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setContainerWidth(container.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) setContainerWidth(entry.contentRect.width);
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Redraw the path directly on the DOM node on every spring tick instead
  // of going through React state — a `d` attribute change can't be
  // compositor-only like a transform, so keeping it out of React's render
  // cycle is what keeps this from adding a second, redundant re-render on
  // top of the unavoidable one.
  useMotionValueEvent(center, "change", (latest) => {
    if (pathRef.current && containerWidth) {
      pathRef.current.setAttribute(
        "d",
        buildPillPath(containerWidth, PILL_H, latest, DIP_WIDTH, DIP_DEPTH, cornerRadius)
      );
    }
  });

  const activeIndex = items.findIndex((it) => it.id === activeId);

  useLayoutEffect(() => {
    if (!containerWidth || activeIndex === -1) return;

    const itemWidth = containerWidth / items.length;
    let nextCenter = itemWidth * activeIndex + itemWidth / 2;

    const margin = DIP_WIDTH / 2 + 4;
    nextCenter = Math.min(Math.max(nextCenter, margin), containerWidth - margin);

    targetCenter.set(nextCenter);
    if (!ready) {
      center.jump(nextCenter);
      if (pathRef.current) {
        pathRef.current.setAttribute(
          "d",
          buildPillPath(containerWidth, PILL_H, nextCenter, DIP_WIDTH, DIP_DEPTH, cornerRadius)
        );
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, containerWidth, items.length]);

  const gradient = `linear-gradient(135deg, ${accentFrom}, ${accentTo})`;

  return (
    <div ref={containerRef} className="relative w-full select-none" style={{ height: BAR_H }}>
      {/* ---- bar dengan dip/valley di top edge ---- */}
      <svg
        className="absolute left-0 right-0 bottom-0"
        width="100%"
        height={PILL_H}
        style={{ overflow: "visible" }}
      >
        <path
          ref={pathRef}
          d={containerWidth ? buildPillPath(containerWidth, PILL_H, containerWidth / 2, DIP_WIDTH, DIP_DEPTH, cornerRadius) : ""}
          fill={surfaceColor}
          stroke={borderColor}
          strokeWidth={1}
        />
      </svg>

      {/* ---- floating orange circle, separated from the valley by a gap ---- */}
      <motion.div
        className="absolute rounded-full pointer-events-none flex items-center justify-center"
        style={{
          top: circleTop,
          width: CIRCLE_D,
          height: CIRCLE_D,
          x: circleX,
          background: gradient,
          opacity: ready ? 1 : 0,
          boxShadow: `0 6px 18px -2px ${beamColor}99, 0 0 0 1px rgba(255,255,255,0.06)`,
          willChange: "transform",
        }}
      >
        {activeIndex !== -1 &&
          (() => {
            const ActiveIcon = items[activeIndex].icon;
            return (
              <motion.span
                key={activeId}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ color: iconColorActive, display: "flex" }}
              >
                <ActiveIcon size={24} strokeWidth={2.4} />
              </motion.span>
            );
          })()}
      </motion.div>

      {/* ---- label nama menu, hanya muncul untuk item yang sedang aktif ----
          x mengikuti posisi ikon aktif (labelX, sama seperti lingkaran),
          dan posisinya di dekat bagian bawah tab — bukan di tengah-tengah. */}
      {activeIndex !== -1 && (
        <motion.div
          key={activeId}
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            top: BAR_H - 30,
            x: labelX,
            translateX: "-50%",
            whiteSpace: "nowrap",
          }}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <span
            className="text-[11px] font-medium"
            style={{ color: iconColorActive }}
          >
            {items[activeIndex].label}
          </span>
        </motion.div>
      )}

      {/* ---- inactive icons + tap targets, sitting inside the pill ---- */}
      <div
        className="absolute left-0 right-0 bottom-0 flex items-stretch"
        style={{ height: PILL_H }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className="relative z-10 flex-1 flex items-center justify-center outline-none"
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <motion.span
                animate={{ opacity: isActive ? 0 : 1, scale: isActive ? 0.6 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={{ color: iconColorInactive }}
              >
                <Icon size={22} strokeWidth={2.2} />
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
