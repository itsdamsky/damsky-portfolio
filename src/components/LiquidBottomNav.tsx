"use client";

/**
 * LiquidBottomNav — "pin-down" variant
 * ------------------------------------------------------------------
 * Matches the reference video: instead of a blob rising ABOVE the bar
 * (a hill), the bar's own top edge dips DOWN into a socket/valley, and
 * a solid marble (with the active icon inside it, in white) nests into
 * that socket — mostly sitting inside the bar, with just the top of
 * the ball poking above the flat edge. Small raised "lips" on either
 * side of the socket sell the liquid/metaball feel (surface tension
 * pulling up right before it dips to cradle the marble).
 *
 * Layout requirements from the brief:
 *  - full width, edge-to-edge (no side margins)
 *  - flush against the bottom of the screen (no floating gap)
 *  - square corners — no border-radius anywhere on the bar
 *
 * Physics (unchanged in spirit from the original):
 *  - indicatorX : spring-driven horizontal position of the marble
 *  - velocity   : real-time rate of change of indicatorX
 *  - stretch    : |velocity| -> extra socket width (liquid drag)
 *  - lean       : velocity  -> asymmetric control-point skew (tail)
 *  - lift       : underdamped spring impulse (0 -> 1 -> 0) fired on
 *                 every tab change for a natural overshoot + settle
 *
 * All per-frame writes touch the DOM directly (refs) inside
 * useAnimationFrame — React only re-renders on actual tab changes.
 * ------------------------------------------------------------------
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  /** Marble / blob gradient */
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

const BAR_HEIGHT = 76; // flat bar height (excludes safe-area strip below)
const MARBLE_R = 30; // resting marble radius
const POKE_ABOVE = 15; // how much of the marble pokes above the flat top edge
const NOTCH_HALF_WIDTH = MARBLE_R + 8; // resting socket half-width
const MAX_STRETCH = 16; // extra socket half-width while moving fast
const MAX_LEAN = 16; // max asymmetric control-point skew
const STRETCH_FACTOR = 0.045; // px/s -> stretch px
const LEAN_FACTOR = 0.026; // px/s -> lean px
const SHOULDER_SPAN = 22; // horizontal reach of the raised "lip" beside the socket
const SHOULDER_RISE = 5; // resting lip rise above the flat edge
const LIFT_EXTRA = 6; // additional lip rise + depth added by the bounce impulse
const NOTCH_DEPTH = MARBLE_R + 12; // resting socket depth (how far it cuts into the bar)
const TOP_PAD = POKE_ABOVE + SHOULDER_RISE + LIFT_EXTRA + 6; // room above the bar for the marble to poke into

const MARBLE_CY = TOP_PAD + MARBLE_R - POKE_ABOVE; // marble center, relative to svg y=0

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
  /* This is what actually sells "melting rubber ball" — on every tab
     change we kick this value with a hard velocity impulse and let a
     very underdamped spring settle it back to 0. Because damping is so
     low, it overshoots past zero repeatedly (like a rubber band being
     let go), and we read that oscillation every frame to squash/stretch
     the marble and ripple the socket membrane in sync. */
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

  /* ---------------- dynamic bar path + marble — recomputed every frame ---------------- */
  const barRef = useRef<SVGPathElement>(null);
  const marbleRef = useRef<SVGEllipseElement>(null);
  const gradientRef = useRef<SVGRadialGradientElement>(null);
  const marbleIconRef = useRef<HTMLDivElement>(null);

  useAnimationFrame(() => {
    if (!barRef.current || barWidth === 0) return;

    const cx = indicatorX.get();
    const liftV = lift.get();
    const s = stretch.get();
    const l = lean.get();
    const w = wobble.get(); // decaying oscillation, plucked on tab change

    const top = TOP_PAD;
    const bottom = TOP_PAD + BAR_HEIGHT;
    const halfW = NOTCH_HALF_WIDTH + s;
    const shoulderRise = SHOULDER_RISE + liftV * LIFT_EXTRA - w * 0.012;
    const notchDepth = NOTCH_DEPTH + liftV * LIFT_EXTRA * 0.6 + w * 0.02;
    const valleyY = top + notchDepth;

    const leftOuter = clamp(cx - halfW - SHOULDER_SPAN, 0, barWidth);
    const leftInner = clamp(cx - halfW, 0, barWidth);
    const rightInner = clamp(cx + halfW, 0, barWidth);
    const rightOuter = clamp(cx + halfW + SHOULDER_SPAN, 0, barWidth);

    // Control points skewed by `lean` toward the direction of travel —
    // gives the socket a subtle asymmetric drag as the marble slides.
    const lc1x = leftOuter + (leftInner - leftOuter) * 0.35 - l * 0.4;
    const lc2x = cx - halfW * 0.55 - l * 0.5;
    const rc1x = cx + halfW * 0.55 - l * 0.5;
    const rc2x = rightInner + (rightOuter - rightInner) * 0.65 - l * 0.4;

    const d = [
      `M 0 ${top}`,
      `L ${leftOuter} ${top}`,
      // raised lip, then dive down into the socket to the valley floor
      `C ${lc1x} ${top - shoulderRise}, ${lc2x} ${valleyY}, ${cx} ${valleyY}`,
      // climb back out of the socket, raised lip on the way up, back to flat
      `C ${rc1x} ${valleyY}, ${rc2x} ${top - shoulderRise}, ${rightOuter} ${top}`,
      `L ${barWidth} ${top}`,
      `L ${barWidth} ${bottom}`,
      `L 0 ${bottom}`,
      "Z",
    ].join(" ");

    barRef.current.setAttribute("d", d);

    const marbleCy = MARBLE_CY - liftV * (LIFT_EXTRA * 0.5);
    // Squash & stretch: positive wobble widens+flattens (impact squash),
    // negative wobble narrows+elongates (rebound stretch) — classic
    // rubber-ball deformation, volume roughly preserved either way.
    const squashStretch = clamp(w * 0.0009, -0.32, 0.32);
    const rx = clamp(MARBLE_R + s * 0.3 + MARBLE_R * squashStretch, MARBLE_R * 0.6, MARBLE_R * 1.5);
    const ry = clamp(MARBLE_R - MARBLE_R * squashStretch * 0.85, MARBLE_R * 0.6, MARBLE_R * 1.5);
    if (marbleRef.current) {
      marbleRef.current.setAttribute("cx", String(cx));
      marbleRef.current.setAttribute("cy", String(marbleCy));
      marbleRef.current.setAttribute("rx", String(rx));
      marbleRef.current.setAttribute("ry", String(ry));
    }
    if (gradientRef.current) {
      gradientRef.current.setAttribute("cx", String(cx - MARBLE_R * 0.3));
      gradientRef.current.setAttribute("cy", String(marbleCy - MARBLE_R * 0.35));
    }
    if (marbleIconRef.current) {
      marbleIconRef.current.style.transform = `translate(${cx}px, ${marbleCy}px) translate(-50%, -50%)`;
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
            ref={gradientRef}
            id="liquidMarbleGradient"
            gradientUnits="userSpaceOnUse"
            r={MARBLE_R * 1.6}
          >
            <stop offset="0%" stopColor={accentFrom} />
            <stop offset="100%" stopColor={accentTo} />
          </radialGradient>
          <filter id="marbleShadow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* the bar surface itself, square corners, full width — with the
            socket cut straight into its top edge */}
        <path
          ref={barRef}
          fill={surfaceColor}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />

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
              animate={{ opacity: 0, r: 46 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* the marble, nested into the socket */}
        <ellipse
          ref={marbleRef}
          cx={0}
          cy={MARBLE_CY}
          rx={MARBLE_R}
          ry={MARBLE_R}
          fill="url(#liquidMarbleGradient)"
          filter="url(#marbleShadow)"
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
                  the marble instead */}
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
