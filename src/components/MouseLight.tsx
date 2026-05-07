"use client";

import { useEffect } from "react";

export default function MouseLight() {
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      document.documentElement.style.setProperty("--mouse-x", `${currentX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${currentY}px`);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[2] pointer-events-none 
      bg-[radial-gradient(circle_300px_at_var(--mouse-x)_var(--mouse-y),rgba(255,95,0,0.10),transparent_70%)]"
    />
  );
}