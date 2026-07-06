"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, User, FolderOpen, Cpu, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import SpotlightBottomNav, { SpotlightNavItem } from "./SpotlightBottomNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Hysteresis: hide only past HIDE_AT, show again only once back below
    // SHOW_AT, and do nothing while inside the dead zone between them.
    // Without this gap, scrolling to sit right around a single threshold
    // (e.g. 20px) flips `scrolled` back and forth on every tiny wobble,
    // which restarts the 0.4s fade mid-animation every time — that's what
    // reads as "not smooth" rather than an actual dropped frame.
    const HIDE_AT = 24;
    const SHOW_AT = 8;

    let ticking = false;

    const update = () => {
      const current = window.scrollY;
      setScrolled((prev) => {
        if (current > HIDE_AT) return true;
        if (current < SHOW_AT) return false;
        return prev;
      });
      ticking = false;
    };

    // Scroll fires far more often than the browser can paint, especially
    // on mobile momentum-scrolling. Running setState on every single event
    // queues a React re-render per event too — piling up work on the same
    // thread that's supposed to be driving the fade animation. Coalescing
    // to one state check per animation frame is what keeps the fade itself
    // uncontested.
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // The bottom nav navigates with router.push() from a plain <button>,
  // not <Link>. Next.js only auto-prefetches routes rendered through
  // <Link>, so without this, every single tap on Skills/Contact/etc was
  // a cold navigation — the browser only started downloading that route's
  // JS the moment you tapped, which is what read as "lag". Prefetching
  // every route once, right when the nav mounts, means the JS is already
  // sitting in the cache by the time someone taps it.
  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/skills", label: "Skills", icon: Cpu },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  useEffect(() => {
    menuItems.forEach((item) => {
      if (!item.href.startsWith("mailto")) {
        router.prefetch(item.href);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SpotlightBottomNav butuh bentuk { id, label, icon } — id dipakai sebagai
  // key aktif/onChange, jadi kita reuse `label` sebagai id (sudah unik).
  const spotlightNavItems: SpotlightNavItem[] = menuItems.map((item) => ({
    id: item.label,
    label: item.label,
    icon: item.icon,
  }));

  useEffect(() => {
    // Guard: Next.js App Router bisa return null sebelum hydration
    if (!pathname) return;

    // Home page — langsung set index 0
    if (pathname === "/") {
      setActiveIndex(0);
      return;
    }

    const index = menuItems.findIndex((item, i) => {
      // Lewati item pertama (home "/") — sudah di-handle di atas
      if (i === 0) return false;
      // Lewati mailto links — bukan route
      if (item.href.startsWith("mailto")) return false;

      const basePath = item.href.split("#")[0];
      // ⚠️  BUG FIX: "/#skills" → basePath = "/" yang cocok dengan SEMUA pathname.
      // Item seperti ini adalah section di home page, bukan route tersendiri.
      // Jadi skip — active state-nya dikontrol manual via scroll, bukan routing.
      if (!basePath || basePath === "/") return false;

      return pathname === basePath || pathname.startsWith(basePath + "/");
    });

    setActiveIndex(index !== -1 ? index : 0);
  }, [pathname]);

  return (
    <>
      {/* ===== DESKTOP NAVBAR (tidak berubah sama sekali) ===== */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 justify-center px-4 pt-4 pointer-events-none">
        <nav
          className={`pointer-events-auto w-full flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform
            ${scrolled
              ? "max-w-2xl px-5 py-2.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              : "max-w-[1200px] px-6 py-4 rounded-none border-transparent bg-transparent"
            }`}
          aria-label="Primary navigation"
        >
          <a href="/" className="flex items-center gap-1 cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
            <img
              src="/images/navbar/Logo-A.svg"
              alt="Adam Maulana logo"
              className={`object-contain transition-all duration-700 ${scrolled ? "h-9 w-9" : "h-7 w-7"}`}
            />
            <p className={`text-white font-semibold transition-all duration-700 ${scrolled ? "opacity-0 w-0 overflow-hidden" : "opacity-100 text-md"}`}>
              Maulana
            </p>
          </a>
          <div className={`flex items-center transition-all duration-700 ${scrolled ? "gap-0" : "gap-8 text-sm"}`}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <a key={item.label} href={item.href} className="group relative flex items-center justify-center transition-all duration-300">
                  {scrolled ? (
                    <>
                      <span className={`flex items-center justify-center px-6 py-2.5 rounded-full transition-all duration-300
                        ${isActive ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white"}`}>
                        <Icon size={20} />
                      </span>
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {item.label}
                      </span>
                    </>
                  ) : (
                    <span className={`transition ${isActive ? "text-orange-500 relative" : "text-neutral-400 hover:text-white"}`}>
                      {item.label}
                      {isActive && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></span>}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
          <a
            href="https://wa.me/6281299491922?text=Halo%20Adam%2C%20saya%20melihat%20portfolio%20kamu%20dan%20tertarik%20untuk%20bekerja%20sama!"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm items-center gap-1 transition-all duration-500 flex ${
              scrolled
                ? "text-white bg-orange-500 px-4 py-1.5 rounded-full hover:bg-orange-600"
                : "text-white hover:text-orange-500"
            }`}
          >
            Let&apos;s Talk <span className={scrolled ? "" : "text-orange-500"}>↗</span>
          </a>
        </nav>
      </header>

      {/* ===== MOBILE HEADER ATAS (tidak berubah sama sekali) ===== */}
      <motion.header
        className="md:hidden fixed top-0 left-0 right-0 z-502 flex items-center justify-between px-5 py-4"
        style={{ willChange: "transform, opacity" }}
        animate={{
          opacity: scrolled ? 0 : 1,
          y: scrolled ? -20 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
      >
        <Link href="/" className="flex items-center gap-1.5">
          <img src="/images/navbar/Logo-A.svg" alt="logo" className="h-7 w-7 object-contain" />
          <p className="text-white font-semibold text-sm">Maulana</p>
        </Link>
        <a
          href="https://wa.me/6281299491922?text=Halo%20Adam%2C%20saya%20melihat%20portfolio%20kamu%20dan%20tertarik%20untuk%20bekerja%20sama!"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white"
        >
          Let&apos;s Talk <span className="text-orange-500">↗</span>
        </a>
      </motion.header>

      {/* ===== MOBILE BOTTOM NAVBAR — SPOTLIGHT NAV ===== */}
      {/*
        - full width, edge-to-edge: no px padding, no left/right inset,
          no rounded corners on the bar itself (handled inside the
          component now).
        - flush to the very bottom: only safe-area inset padding, no
          extra gap floating the bar above the screen edge.
      */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <SpotlightBottomNav
          items={spotlightNavItems}
          activeId={spotlightNavItems[activeIndex]?.id}
          onChange={(id) => {
            const index = menuItems.findIndex((m) => m.label === id);
            const item = menuItems[index];
            if (!item) return;

            // Move the spotlight the instant a finger taps — don't wait
            // for the route to actually finish changing. The pathname
            // effect above will re-sync this if needed (e.g. browser
            // back/forward), but for a normal tap this is what makes it
            // feel like it registered on the first touch instead of
            // needing several taps before anything visibly happens.
            setActiveIndex(index);

            if (item.href.startsWith("mailto")) {
              window.location.href = item.href;
            } else {
              router.push(item.href);
            }
          }}
          // Diganti dari abu-abu netral ke hitam kehangatan — ada sedikit
          // undertone oranye gelap supaya nyambung ke aksen warna oranye
          // di seluruh situs, tapi tetap gelap dan menyatu ke background
          // page yang hitam pekat.
          surfaceColor="rgba(26, 18, 13, 0.95)"
          borderColor="rgba(255,255,255,0.08)"
          iconColorInactive="rgba(255,255,255,0.4)"
          iconColorActive="#ff9142"
          beamColor="#ff9142"
          accentFrom="#ff9142"
          accentTo="#e84c00"
          // BUG FIX: lingkaran ini menggambar ulang bentuk SVG bar di
          // SETIAP frame animasinya (lihat SpotlightBottomNav.tsx). Makin
          // jauh jarak tempuhnya (paling jauh: dari Skills/Contact ke
          // Home), makin lama animasi jalan, makin banyak frame yang
          // harus gambar ulang SVG — itu yang bikin lompatan ke Home
          // paling gampang kelihatan patah-patah. Stiffness dinaikkan
          // supaya spring settle lebih cepat, mempersingkat total durasi
          // (dan jumlah frame) yang perlu redraw, tanpa bikin gerakannya
          // kelihatan kaku/instan.
          // BUG FIX: SpotlightBottomNav sekarang pakai CSS transition
          // murni (bukan lagi framer-motion spring per-frame), supaya
          // gerakannya tidak ikut kena dampak main thread yang sibuk pas
          // Beranda mounting. transitionMs gantikan springConfig.
          transitionMs={320}
        />
      </div>
    </>
  );
}
