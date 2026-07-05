"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
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
        // Diturunkan dari 0.7s ke 0.45s — dikombinasikan dengan beberapa
        // ScrollReveal berurutan (masing-masing punya delay sendiri) di
        // satu halaman, 0.7s per elemen bikin halaman terasa "lama penuh"
        // meski datanya sudah ada dari awal.
        duration: 0.45,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier Apple-style
      }}
    >
      {children}
    </motion.div>
  );
}
