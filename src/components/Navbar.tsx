"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, User, FolderOpen, Cpu, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import LiquidBottomNav, { LiquidNavItem } from "./LiquidBottomNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      setHeaderVisible(current < lastScroll || current < 10);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/skills", label: "Skills", icon: Cpu },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  // LiquidBottomNav butuh bentuk { id, label, icon } — id dipakai sebagai
  // key aktif/onChange, jadi kita reuse `label` sebagai id (sudah unik).
  const liquidNavItems: LiquidNavItem[] = menuItems.map((item) => ({
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
        animate={{
          opacity: scrolled ? 0 : 1,
          y: scrolled ? -20 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
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

      {/* ===== MOBILE BOTTOM NAVBAR — LIQUID "PIN-DOWN" NAV ===== */}
      {/*
        - full width, edge-to-edge: no px padding, no left/right inset.
        - flush to the very bottom: the bar's own background extends
          through the safe-area inset via paddingBottom, instead of
          floating above it with a gap.
        - no rounded corners anywhere (component itself draws square
          corners; this wrapper adds none either).
      */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "#1e1e22",
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
        }}
      >
        <LiquidBottomNav
          items={liquidNavItems}
          activeId={liquidNavItems[activeIndex]?.id}
          onChange={(id) => {
            const item = menuItems.find((m) => m.label === id);
            if (!item) return;
            if (item.href.startsWith("mailto")) {
              window.location.href = item.href;
            } else {
              router.push(item.href);
            }
          }}
          surfaceColor="#1e1e22"
          iconColorInactive="rgba(255,255,255,0.45)"
          iconColorActive="#ffffff"
          accentFrom="#ff9142"
          accentTo="#e84c00"
          springConfig={{ stiffness: 210, damping: 20, mass: 1 }}
        />
      </div>
    </>
  );
}
