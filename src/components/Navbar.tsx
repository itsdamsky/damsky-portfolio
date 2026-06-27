"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Home, User, FolderOpen, Cpu, Phone } from "lucide-react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  animate,
} from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [navWidth, setNavWidth] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const pillX = useMotionValue(0);
  const smoothPillX = useSpring(pillX, { stiffness: 380, damping: 36, mass: 0.8 });
  const pillWidth = useMotionValue(56);
  const smoothPillWidth = useSpring(pillWidth, { stiffness: 380, damping: 36, mass: 0.8 });

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
    { href: "/#skills", label: "Skills", icon: Cpu },
    { href: "mailto:adammaulana.design@gmail.com", label: "Contact", icon: Phone },
  ];

  useEffect(() => {
    if (pathname === "/") {
      setActiveIndex(0);
      return;
    }
    const index = menuItems.findIndex((item) => {
      if (item.href === "/") return false;
      return pathname === item.href || pathname.startsWith(item.href.split("#")[0]);
    });
    setActiveIndex(index !== -1 ? index : 0);
  }, [pathname]);

  useEffect(() => {
    if (!navRef.current) return;
    const ro = new ResizeObserver(() => {
      if (navRef.current) setNavWidth(navRef.current.offsetWidth);
    });
    ro.observe(navRef.current);
    return () => ro.disconnect();
  }, []);

  const snapToIndex = (index: number, instant = false) => {
    const el = itemRefs.current[index];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    const targetX = itemRect.left - navRect.left;
    const targetW = itemRect.width;
    if (instant) {
      pillX.set(targetX);
      pillWidth.set(targetW);
    } else {
      animate(pillX, targetX, { type: "spring", stiffness: 380, damping: 36, mass: 0.8 });
      animate(pillWidth, targetW, { type: "spring", stiffness: 380, damping: 36, mass: 0.8 });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => snapToIndex(activeIndex, true), 300);
    return () => clearTimeout(timer);
  }, [activeIndex, navWidth, scrolled]);

  const findNearestIndex = (currentX: number) => {
    const nav = navRef.current;
    if (!nav) return activeIndex;
    const pillCenter = currentX + pillWidth.get() / 2;
    let nearest = 0;
    let minDist = Infinity;
    const navRect = nav.getBoundingClientRect();
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.left - navRect.left + rect.width / 2;
      const dist = Math.abs(pillCenter - itemCenter);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    return nearest;
  };

  return (
    <>
      {/* ===== DESKTOP NAVBAR (tidak berubah) ===== */}
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
            href="mailto:adammaulana.design@gmail.com"
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

      {/* ===== MOBILE HEADER ATAS ===== */}
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
        <Link href="mailto:adammaulana.design@gmail.com" className="text-sm text-white">
          Let&apos;s Talk <span className="text-orange-500">↗</span>
        </Link>
      </motion.header>

      {/* ===== MOBILE BOTTOM NAVBAR ===== */}
      <motion.div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center px-6 pb-7"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      >
        <motion.div
          ref={navRef}
          animate={{
            width: scrolled ? "280px" : "380px",
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex items-center justify-around rounded-full py-2 px-1.5 border border-white/[0.12] select-none"
          style={{
            background: "rgba(18,18,18,0.78)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Draggable pill */}
          <motion.div
            ref={pillRef}
            drag="x"
            dragConstraints={navRef}
            dragElastic={0}
            dragMomentum={false}
            style={{
              x: smoothPillX,
              width: smoothPillWidth,
              position: "absolute",
              top: 6,
              height: "calc(100% - 12px)",
              borderRadius: 9999,
              background: "transparent",
              cursor: "grab",
              zIndex: 10,
            }}
            onDrag={(_, info) => {
              const nav = navRef.current;
              if (!nav) return;
              const navRect = nav.getBoundingClientRect();
              const currentPillX = pillX.get();
              const newX = Math.max(0, Math.min(currentPillX + info.delta.x, navRect.width - pillWidth.get()));
              pillX.set(newX);
              const speed = Math.abs(info.velocity.x);
              const stretch = Math.min(speed * 0.03, 12);
              pillWidth.set((itemRefs.current[activeIndex]?.offsetWidth ?? 56) + stretch);
            }}
            onDragEnd={() => {
              const currentX = pillX.get();
              const nearest = findNearestIndex(currentX);
              setActiveIndex(nearest);
              snapToIndex(nearest);
              const href = menuItems[nearest].href;
              if (href.startsWith("mailto")) {
                window.location.href = href;
              } else {
                router.push(href);
              }
            }}
            whileDrag={{ cursor: "grabbing" }}
          />

          {/* Icons */}
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeIndex === i;
            return (
              <div
                key={item.label}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative z-20"
              >
                <motion.button
                  onClick={() => {
                    setActiveIndex(i);
                    snapToIndex(i);
                    if (item.href.startsWith("mailto")) {
                      window.location.href = item.href;
                    } else {
                      router.push(item.href);
                    }
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1.08 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center justify-center rounded-full text-white"
                  style={{ padding: scrolled ? "8px 10px" : "10px 14px" }}
                >
                  <Icon size={scrolled ? 17 : 20} />
                </motion.button>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </>
  );
}