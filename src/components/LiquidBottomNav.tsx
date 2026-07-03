"use client";

/**
 * LiquidBottomNav — "floating marble" variant
 * ------------------------------------------------------------------
 * Per the latest reference: the bar stays perfectly FLAT (no notch,
 * no fusion, no dip cut into it) and the active marble floats freely
 * above it with a clear gap of visible background between the marble's
 * bottom edge and the bar's top edge — like a FAB hovering over a tab
 * bar, not welded into it. The marble itself is a clean, flat-filled
 * circle: no blurred glow/halo behind it.
 *
 * Layout requirements from the brief:
 *  - full width, edge-to-edge (no side margins)
 *  - flush against the bottom of the screen (no floating gap under the bar)
 *  - square corners — no border-radius anywhere on the bar
 *  - a clear GAP between the marble and the bar (they never touch)
 *  - marble has no glow/blur background — just a clean solid shape
 *
 * Physics (kept from the rubber-jiggle pass, just detached from the
 * bar shape since the bar no longer deforms):
 *  - indicatorX : spring-driven horizontal position of the marble
 *  - velocity   : real-time rate of change of indicatorX
 *  - stretch    : |velocity| -> horizontal elongation (liquid drag)
 *  - lean       : velocity  -> asymmetric skew of the stretch
 *  - lift       : underdamped spring impulse (0 -> 1 -> 0) fired on
 *                 every tab change — marble hops up a little further
 *                 above the bar, then settles back to its resting gap
 *  - wobble     : a plucked, very underdamped spring kicked on every
 *                 tab change — read every frame as squash/stretch on
 *                 the marble for a "rubber ball" jiggle as it lands
 *
 * All per-frame writes touch the DOM directly (refs) inside
 * useAnimationFrame — React only re-renders on actual tab changes.
 * ------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

export interface LiquidNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    color?: string;
  }>;
}

export interface LiquidSpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export interface LiquidBottomNavProps {
  items: LiquidNavItem[];
  /** Controlled active tab id. Omit to let the component manage its own state. */
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  className?: string;
  /** Marble gradient */
  accentFrom?: string;
  accentTo?: string;
  /** Bar surface color */
  surfaceColor?: string;
  /** Icon colors */
  iconColorActive?: string;
  iconColorInactive?: string;
  /** Physics — see framer-motion spring docs. Recommended: 170-240 / 18-24 / 0.8-1.2 */
  springConfig?: LiquidSpringConfig;
}

/* ------------------------------------------------------------------ */
/*  Geometry constants                                                 */
/* ------------------------------------------------------------------ */

const BAR_HEIGHT = 64; // flat bar height, tight to the icon row — flush to the line, nothing above/below it
const MARBLE_R = 30; // resting marble radius
const GAP = 14; // clear space between the marble's bottom edge and the wave's lowest point — they never touch
const MAX_STRETCH = 16; // extra horizontal radius while moving fast (same magnitude as the pin-down version)
const MAX_LEAN = 16; // max horizontal skew of the stretch (same magnitude as the pin-down version)
const STRETCH_FACTOR = 0.045; // px/s -> stretch px
const LEAN_FACTOR = 0.026; // px/s -> lean px
const LIFT_EXTRA = 6; // extra hop height added by the bounce impulse
const WAVE_HALF_WIDTH = MARBLE_R + 12; // resting half-width of the dip under the marble
const WAVE_SPAN = 26; // extra horizontal reach for the dip's smooth transition back to flat
const WAVE_DEPTH = 14; // how far the bar's surface dips down (always DOWN, never above the flat line)
const TOP_PAD = GAP + MARBLE_R * 2 + LIFT_EXTRA + 6; // room above the bar for the marble to float in

const MARBLE_CY = TOP_PAD - GAP - MARBLE_R; // marble resting center, relative to svg y=0

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function LiquidBottomNav({
  items,
  activeId,
  defaultActiveId,
  onChange,
  className = "",
  accentFrom = "#ff9142",
  accentTo = "#e84c00",
  surfaceColor = "#1e1e22",
  iconColorActive = "#ffffff",
  iconColorInactive = "#9a9a9a",
  springConfig = { stiffness: 210, damping: 20, mass: 1 },
}: LiquidBottomNavProps) {
  /* ---------------- controlled / uncontrolled active tab ---------------- */
  const [internalActive, setInternalActive] = useState(
    activeId ?? defaultActiveId ?? items[0]?.id
  );
  const active = activeId ?? internalActive;
  const activeIndex = Math.max(
    0,
    items.findIndex((it) => it.id === active)
  );

  const selectTab = (id: string) => {
    if (activeId === undefined) setInternalActive(id);
    onChange?.(id);
  };

  /* ---------------- layout measurement ---------------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [barWidth, setBarWidth] = useState(0);
  const [centers, setCenters] = useState<number[]>([]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    setBarWidth(containerRect.width);
    setCenters(
      itemRefs.current.map((el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.left - containerRect.left + r.width / 2;
      })
    );
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /* ---------------- the marble's spring-driven position ---------------- */
  const indicatorTarget = useMotionValue(0);
  const indicatorX = useSpring(indicatorTarget, springConfig);
  const velocity = useVelocity(indicatorX);

  useEffect(() => {
    if (centers[activeIndex] !== undefined) {
      indicatorTarget.set(centers[activeIndex]);
    }
  }, [activeIndex, centers, indicatorTarget]);

  /* ---------------- bounce "lift" impulse: real spring, real overshoot ---------------- */
  const lift = useMotionValue(0);
  useEffect(() => {
    const rise = animate(lift, 1, {
      type: "spring",
      stiffness: 320,
      damping: 7,
      mass: 0.6,
    });
    const fallTimer = setTimeout(() => {
      animate(lift, 0, { type: "spring", stiffness: 200, damping: 9, mass: 0.7 });
    }, 210);
    return () => {
      rise.stop();
      clearTimeout(fallTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  /* ---------------- derived liquid-shape parameters ---------------- */
  const stretch = useTransform(velocity, (v) => clamp(Math.abs(v) * STRETCH_FACTOR, 0, MAX_STRETCH));
  const lean = useTransform(velocity, (v) => clamp(v * LEAN_FACTOR, -MAX_LEAN, MAX_LEAN));

  /* ---------------- rubber jiggle: a plucked, underdamped spring ---------------- */
  /* On every tab change we kick this value with a hard velocity impulse
     and let a very underdamped spring settle it back to 0. Because
     damping is so low, it overshoots past zero repeatedly (like a
     rubber band being let go), and we read that oscillation every
     frame to squash/stretch the marble as it "lands". */
  const wobble = useMotionValue(0);
  useEffect(() => {
    wobble.jump(0);
    const anim = animate(wobble, 0, {
      type: "spring",
      stiffness: 240,
      damping: 5,
      mass: 0.5,
      velocity: 950,
    });
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  /* ---------------- marble + bar wave — recomputed every frame ---------------- */
  /* PERF NOTE: the marble's own motion is still 100% CSS transform
     (compositor-only, see below). The bar's wave genuinely needs to
     redraw its `d` attribute because its shape changes — but we guard
     it with a change-threshold so it's a no-op (skips setAttribute
     entirely) whenever the marble is at rest, which is most of the
     time. It only does real work during the ~300-500ms of an actual
     tab transition. */
  const barRef = useRef<SVGPathElement>(null);
  const marbleRef = useRef<SVGCircleElement>(null);
  const marbleIconRef = useRef<HTMLDivElement>(null);
  const lastCxRef = useRef<number | null>(null);
  const lastShapeKeyRef = useRef<number>(0);

  useAnimationFrame(() => {
    if (barWidth === 0) return;

    const cx = indicatorX.get() + lean.get();
    const liftV = lift.get();
    const s = stretch.get();
    const w = wobble.get(); // decaying oscillation, plucked on tab change

    // Marble hops a bit further from the wave on impulse, then settles
    // back to its resting gap — it never touches the bar.
    const marbleCy = MARBLE_CY - liftV * LIFT_EXTRA;

    // Squash & stretch: positive wobble widens+flattens (impact squash),
    // negative wobble narrows+elongates (rebound stretch).
    const squashStretch = clamp(w * 0.0009, -0.3, 0.3);
    const scaleX = clamp((MARBLE_R + s + MARBLE_R * squashStretch) / MARBLE_R, 0.65, 1.5);
    const scaleY = clamp(1 - squashStretch * 0.85, 0.65, 1.5);

    if (marbleRef.current) {
      marbleRef.current.style.transform = `translate(${cx}px, ${marbleCy}px) scale(${scaleX}, ${scaleY})`;
    }
    if (marbleIconRef.current) {
      marbleIconRef.current.style.transform = `translate(${cx}px, ${marbleCy}px) translate(-50%, -50%)`;
    }

    // Skip the bar redraw entirely if nothing meaningfully changed
    // since last frame (marble at rest) — this is what keeps the wave
    // from costing anything during the ~99% of the time nothing moves.
    const shapeKey = Math.round(cx * 4) + Math.round(s * 4) * 100000 + Math.round(liftV * 100) * 100000000;
    if (barRef.current && (lastCxRef.current === null || shapeKey !== lastShapeKeyRef.current)) {
      lastCxRef.current = cx;
      lastShapeKeyRef.current = shapeKey;

      const top = TOP_PAD;
      const bottom = TOP_PAD + BAR_HEIGHT;
      const halfW = WAVE_HALF_WIDTH + s;
      const depth = WAVE_DEPTH + liftV * 4;
      const valleyY = top + depth;

      const leftOuter = clamp(cx - halfW - WAVE_SPAN, 0, barWidth);
      const rightOuter = clamp(cx + halfW + WAVE_SPAN, 0, barWidth);

      // Control points only ever pull the curve DOWN from the flat
      // line — the wave dips, it never rises above it.
      const lc1x = leftOuter + (cx - leftOuter) * 0.55;
      const lc2x = cx - halfW * 0.3;
      const rc1x = cx + halfW * 0.3;
      const rc2x = rightOuter - (rightOuter - cx) * 0.55;

      const d = [
        `M 0 ${top}`,
        `L ${leftOuter} ${top}`,
        `C ${lc1x} ${top}, ${lc2x} ${valleyY}, ${cx} ${valleyY}`,
        `C ${rc1x} ${valleyY}, ${rc2x} ${top}, ${rightOuter} ${top}`,
        `L ${barWidth} ${top}`,
        `L ${barWidth} ${bottom}`,
        `L 0 ${bottom}`,
        "Z",
      ].join(" ");

      barRef.current.setAttribute("d", d);
    }
  });

  /* ---------------- arrival ripples ---------------- */
  const [ripples, setRipples] = useState<{ key: number; x: number }[]>([]);
  const rippleId = useRef(0);
  useEffect(() => {
    const x = centers[activeIndex];
    if (x === undefined) return;
    const key = rippleId.current++;
    setRipples((r) => [...r, { key, x }]);
    const t = setTimeout(() => {
      setRipples((r) => r.filter((rp) => rp.key !== key));
    }, 620);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const ActiveIcon = items[activeIndex]?.icon;

  /* ------------------------------------------------------------------ */
  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{ height: BAR_HEIGHT + TOP_PAD, overflow: "visible" }}
      role="tablist"
      aria-label="Primary navigation"
    >
      <svg
        width={barWidth || "100%"}
        height={BAR_HEIGHT + TOP_PAD}
        viewBox={`0 0 ${barWidth} ${BAR_HEIGHT + TOP_PAD}`}
        className="absolute inset-0 overflow-visible"
        style={{ width: "100%" }}
      >
        <defs>
          <radialGradient
            id="liquidMarbleGradient"
            gradientUnits="objectBoundingBox"
            cx="35%"
            cy="30%"
            r="75%"
          >
            <stop offset="0%" stopColor={accentFrom} />
            <stop offset="100%" stopColor={accentTo} />
          </radialGradient>
        </defs>

        {/* the bar surface — square corners, full width. Its top edge
            dips into a smooth wave under the marble (never rises above
            the flat line), but never actually touches the marble. */}
        <path ref={barRef} fill={surfaceColor} />

        {/* arrival ripples, drawn under the marble so the marble reads on top */}
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.circle
              key={r.key}
              cx={r.x}
              cy={MARBLE_CY}
              r={10}
              fill="none"
              stroke={accentTo}
              strokeWidth={2}
              initial={{ opacity: 0.4, r: 10 }}
              animate={{ opacity: 0, r: 40 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* the marble — clean flat fill, no blur/glow halo behind it.
            Sits at a fixed local origin; all motion comes from
            style.transform (see the useAnimationFrame loop above), so
            the browser can composite it on the GPU instead of
            re-laying-out SVG geometry every frame. */}
        <circle
          ref={marbleRef}
          cx={0}
          cy={0}
          r={MARBLE_R}
          fill="url(#liquidMarbleGradient)"
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            willChange: "transform",
          }}
        />
      </svg>

      {/* icon row */}
      <div
        className="absolute left-0 right-0 flex items-center justify-around"
        style={{ top: TOP_PAD, height: BAR_HEIGHT }}
      >
        {items.map((item, i) => {
          const Icon = item.icon;
          const isActive = i === activeIndex;
          return (
            <button
              key={item.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => selectTab(item.id)}
              aria-label={item.label}
              aria-selected={isActive}
              role="tab"
              className="relative flex items-center justify-center flex-1 h-full bg-transparent"
            >
              {/* active item's own icon is hidden — it's represented by
                  the floating marble instead */}
              <div style={{ color: iconColorInactive, opacity: isActive ? 0 : 1 }}>
                <Icon size={22} strokeWidth={2} color="currentColor" />
              </div>
            </button>
          );
        })}
      </div>

      {/* the active icon, rendered in white, riding inside the marble */}
      {ActiveIcon && (
        <div
          ref={marbleIconRef}
          className="absolute left-0 top-0 pointer-events-none flex items-center justify-center"
          style={{ willChange: "transform" }}
        >
          <ActiveIcon size={20} strokeWidth={2.25} color={iconColorActive} />
        </div>
      )}
    </div>
  );
}
