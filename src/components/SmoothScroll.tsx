"use client";

import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothScroll() {
  useEffect(() => {
    // Disable smooth scroll on mobile for better performance
    if (window.matchMedia("(max-width: 768px)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}