"use client";

import { useEffect, useState, useMemo } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
  // Opsional — delay sebelum animasi hitung mulai jalan. Default 0 (jalan
  // langsung, perilaku lama, dipakai di halaman yang gak masalah seperti
  // About/Skills). Hero.tsx mengisi ini supaya rAF loop counter tidak
  // mulai kerja tepat di momen yang sama dengan animasi transisi halaman
  // + lingkaran bottom nav yang lagi settle ke posisi Home.
  startDelay?: number;
}

export default function Counter({
  target,
  suffix = "",
  startDelay = 0,
}: CounterProps) {

  const [count, setCount] = useState(0);
  const animationDuration = useMemo(() => {
    if (typeof window === 'undefined') return 1500;
    return window.matchMedia("(max-width: 768px)").matches ? 800 : 1500;
  }, []);

  useEffect(() => {
    // Was setInterval(..., 16) — a JS timer firing ~60x/sec independently of
    // the browser's actual paint cycle. That's an extra, uncoordinated timer
    // competing with the page-transition animation right when this
    // component mounts (Home page load). requestAnimationFrame ties the
    // update to the browser's own render cycle instead, so it never fires
    // more than needed and never fights the transition for the main thread.
    let rafId: number;
    let startTimeoutId: ReturnType<typeof setTimeout> | undefined;
    let startTime: number | null = null;
    const duration = animationDuration;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCount(Math.floor(progress * target));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      rafId = requestAnimationFrame(tick);
    };

    if (startDelay > 0) {
      startTimeoutId = setTimeout(start, startDelay);
    } else {
      start();
    }

    return () => {
      if (startTimeoutId) clearTimeout(startTimeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [target, animationDuration, startDelay]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}
