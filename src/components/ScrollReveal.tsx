"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
};

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // Sama seperti pola di Counter.tsx: animasi fade/slide-in ini murah di
  // desktop, tapi di HP — apalagi kalau ada banyak ScrollReveal berurutan
  // di satu halaman (Skills, Contact) — jadi beban ekstra yang bikin
  // halaman kerasa lebih berat waktu di-buka. Dicek lewat useEffect
  // (bukan langsung saat render) supaya server-render & client hydration
  // tetap konsisten sebelum kita tahu ukuran layarnya.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  // Di mobile: tampil langsung, tanpa transform/opacity animation sama
  // sekali — bukan cuma dipercepat, tapi benar-benar di-skip supaya
  // browser tidak perlu kerja ekstra pas halaman baru dibuka.
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const directionMap = {
    up:    { x: 0,   y: 24 },
    down:  { x: 0,   y: -24 },
    left:  { x: 24,  y: 0 },
    right: { x: -24, y: 0 },
  };

  const { x, y } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x, y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier Apple-style
      }}
    >
      {children}
    </motion.div>
  );
}
