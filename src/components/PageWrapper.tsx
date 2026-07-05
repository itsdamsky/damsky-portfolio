"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

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

  // BUG FIX: navigating away while scrolled far down (e.g. reading the
  // Skills page near the Footer) left the browser's scroll position
  // untouched. Footer lives outside this wrapper (rendered once in the
  // root layout), so it stays on screen across the swap — but the new
  // page's own content is much shorter, so the browser just clamps the
  // scroll to whatever's now at that old offset. That's the "blank,
  // then content pops back in" flash: it's not missing content, it's
  // sitting at the wrong scroll position for a split second before
  // anything corrects it.
  //
  // useLayoutEffect (not useEffect) so this runs synchronously right
  // after the new page's DOM is committed, before the browser paints —
  // that's what prevents the one-frame flash of the wrong scroll spot.
  // behavior: "instant" (not "smooth") on purpose: an animated scroll
  // here would itself look like the janky "content sliding in" people
  // are trying to get rid of.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
