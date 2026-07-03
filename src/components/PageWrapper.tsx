"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Mobile gets a much shorter, near-instant transition — consistent with
  // how MouseLight / SmoothScroll / Counter already scale down on mobile
  // in this project. Desktop keeps the fuller 0.3s feel.
  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const duration = isMobile ? 0.12 : 0.3;

  return (
    // mode="wait" (the previous setting) forces the OLD page to fully
    // finish exiting before the NEW page starts entering — on every
    // single tap that's up to two full 300ms animations back-to-back
    // (~600ms) before anything new is visible. That sequential wait is
    // what reads as "lag" when switching menus. Dropping mode="wait"
    // (default AnimatePresence behavior) lets exit and enter run at the
    // same time instead, so the new page shows up roughly twice as fast.
    <AnimatePresence>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
