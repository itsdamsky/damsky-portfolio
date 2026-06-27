"use client";

import { useEffect } from "react";

export default function MouseLight() {
  useEffect(() => {
    // Disable on mobile and low-power devices
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      document.documentElement.style.setProperty("--mouse-x", `${currentX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${currentY}px`);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="hidden md:block fixed inset-0 z-[2] pointer-events-none 
      bg-[radial-gradient(circle_300px_at_var(--mouse-x)_var(--mouse-y),rgba(255,95,0,0.28),transparent_70%)]"
    />
  );
}