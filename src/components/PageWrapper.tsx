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
    // mode="wait" (an earlier setting) forced the OLD page to fully finish
    // exiting before the NEW page started entering — up to two full 300ms
    // animations back-to-back before anything new was visible.
    //
    // But the default "sync" mode has its own problem: while both pages
    // crossfade, they're BOTH sitting in normal document flow at the same
    // time — not stacked on top of each other — so the page's layout
    // visibly jumps/shoves for a moment on every single navigation. That's
    // the "not smooth" jump people were feeling, and it's a layout bug,
    // not a performance one.
    //
    // mode="popLayout" fixes both: the exiting page is pulled out of
    // document flow the instant the new one mounts (framer-motion
    // absolutely-positions it internally) while it finishes fading out on
    // top, so there's no layout shove and no sequential wait.
    <AnimatePresence mode="popLayout">
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
