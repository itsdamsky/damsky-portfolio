"use client";

import { usePathname } from "next/navigation";

// Was framer-motion's AnimatePresence + motion.div here. That's a JS
// library doing per-frame math on the main thread for every single route
// change — and across three different `mode` settings ("wait", default
// "sync", "popLayout") it kept producing a different flavor of jank
// (slow sequential wait, layout jump, or subtle glitches depending on the
// device). Lighthouse confirmed the pages themselves load fast, which
// pointed straight at this wrapper as the one thing happening on every
// nav that a cold-load audit can't see.
//
// Swapping to a plain CSS `animation` (defined in globals.css as
// `.page-transition`) removes JS from the critical path entirely: the
// browser's own compositor drives it, so it can't stutter under React/JS
// load the way the old version could. `key={pathname}` forces a fresh
// element on every route change, which re-triggers the CSS animation
// automatically — no exit animation needed since React just swaps the
// old element out instantly, which is what actually reads as "smooth"
// on a real tap rather than a lingering crossfade.
export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
