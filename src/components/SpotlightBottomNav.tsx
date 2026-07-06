"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface SpotlightNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
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
  // Ganti dari springConfig (framer motion spring, JS-driven per-frame)
  // ke durasi CSS transition biasa — browser yang menginterpolasikan,
  // bukan JS yang menghitung ulang di setiap frame.
  transitionMs?: number;
}

// Bentuk lekukan/dip, statis — dihitung SEKALI saja (tidak tergantung
// posisi atau lebar container), lalu digeser dengan CSS transform. Dulu
// seluruh bentuk bar (termasuk lekukan) dihitung ulang dari nol di setiap
// frame animasi via `setAttribute("d", ...)`, yang memaksa browser
// menghitung ulang geometri SVG berulang kali — kerja itu butuh main
// thread, dan begitu halaman tujuan (Beranda) sibuk me-mount kontennya,
// keduanya rebutan waktu proses dan animasinya kelihatan patah-patah.
function buildDipShape(dipWidth: number, dipDepth: number) {
  const half = dipWidth / 2;
  const c = dipWidth * 0.28;
  const overflow = 200; // jauh melebihi tinggi bar, supaya area di atas kurva ikut "terhapus" penuh oleh mask
  return [
    `M ${-half} 0`,
    `C ${-half + c} 0, ${-c} ${dipDepth}, 0 ${dipDepth}`,
    `C ${c} ${dipDepth}, ${half - c} 0, ${half} 0`,
    `L ${half} ${-overflow}`,
    `L ${-half} ${-overflow}`,
    "Z",
  ].join(" ");
}

export default function SpotlightBottomNav({
  items,
  activeId,
  onChange,
  surfaceColor = "#1c1c22",
  borderColor = "transparent",
  cornerRadius = 0,
  iconColorInactive = "rgba(255,255,255,0.45)",
  iconColorActive = "#fff",
  beamColor = "#ff9142",
  accentFrom = "#ff9142",
  accentTo = "#e84c00",
  transitionMs = 320,
}: SpotlightBottomNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskId = useId();
  const [containerWidth, setContainerWidth] = useState(0);
  const [ready, setReady] = useState(false);

  const PILL_H = 76;
  const BAR_H = 116;
  const CIRCLE_D = 60;
  const GAP = 0;
  const DIP_DEPTH = 34;
  const DIP_WIDTH = 130;

  const circleTop = DIP_DEPTH - GAP - CIRCLE_D / 2;

  const dipShape = useMemo(() => buildDipShape(DIP_WIDTH, DIP_DEPTH), []);

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

  const activeIndex = items.findIndex((it) => it.id === activeId);

  const targetCenter = useMemo(() => {
    if (!containerWidth || activeIndex === -1) return containerWidth / 2;
    const itemWidth = containerWidth / items.length;
    let next = itemWidth * activeIndex + itemWidth / 2;
    const margin = DIP_WIDTH / 2 + 4;
    next = Math.min(Math.max(next, margin), containerWidth - margin);
    return next;
  }, [containerWidth, activeIndex, items.length]);

  // Posisi pertama kali (saat width baru terukur) di-"jump" tanpa
  // transition, supaya tidak meluncur dari kiri layar pas halaman baru
  // dibuka. Baru setelah itu transition dinyalakan untuk perpindahan
  // berikutnya.
  useEffect(() => {
    if (containerWidth && !ready) {
      const id = requestAnimationFrame(() => setReady(true));
      return () => cancelAnimationFrame(id);
    }
  }, [containerWidth, ready]);

  const gradient = `linear-gradient(135deg, ${accentFrom}, ${accentTo})`;

  const transitionStyle = ready
    ? `transform ${transitionMs}ms cubic-bezier(0.34, 1.56, 0.64, 1)`
    : "none";

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: BAR_H, contain: "layout paint" }}
    >
      {/* ---- bar dengan lekukan, sekarang lewat SVG mask + CSS transform ---- */}
      <svg
        className="absolute left-0 right-0 bottom-0"
        width="100%"
        height={PILL_H}
        style={{ overflow: "visible" }}
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={0}
            y={-200}
            width={containerWidth || 1}
            height={PILL_H + 200}
          >
            <rect x={0} y={-200} width={containerWidth || 0} height={PILL_H + 200} fill="white" />
            <g style={{ transform: `translateX(${targetCenter}px)`, transition: transitionStyle }}>
              <path d={dipShape} fill="black" />
            </g>
          </mask>
        </defs>
        <rect
          x={0}
          y={0}
          width={containerWidth || 0}
          height={PILL_H}
          rx={cornerRadius}
          ry={cornerRadius}
          fill={surfaceColor}
          stroke={borderColor}
          strokeWidth={1}
          mask={`url(#${maskId})`}
        />
      </svg>

      {/* ---- floating orange circle — posisi digerakkan lewat CSS
          transition di `transform`, bukan lagi JS spring per-frame ---- */}
      <div
        className="absolute rounded-full pointer-events-none flex items-center justify-center"
        style={{
          top: circleTop,
          width: CIRCLE_D,
          height: CIRCLE_D,
          left: 0,
          transform: `translateX(${targetCenter - CIRCLE_D / 2}px)`,
          transition: transitionStyle,
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
      </div>

      {/* ---- label nama menu — wrapper posisi pakai CSS transition,
          isi di dalamnya (fade+pop kecil) tetap pakai framer motion
          karena itu animasi lokal singkat, bukan animasi posisi
          berkelanjutan yang butuh redraw tiap frame ---- */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: BAR_H - 34,
          left: 0,
          transform: `translateX(${targetCenter}px) translateX(-50%)`,
          transition: transitionStyle,
          whiteSpace: "nowrap",
        }}
      >
        {activeIndex !== -1 && (
          <motion.span
            key={activeId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="text-[11px] font-medium inline-block"
            style={{ color: iconColorActive }}
          >
            {items[activeIndex].label}
          </motion.span>
        )}
      </div>

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
