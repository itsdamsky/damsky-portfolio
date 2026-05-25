"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
      <nav className="container-custom h-[70px] flex items-center justify-between" aria-label="Primary navigation">
        <a
          href="#home"
          className="flex items-center gap-1 cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25)]"
        >
          <img
            src="/images/navbar/Logo-A.svg"
            alt="Adam Maulana logo"
            className="h-10 w-auto"
          />

          <p className="text-white font-semibold text-md">Maulana</p>
        </a>

        <div className="hidden md:flex items-center gap-10 text-sm">
          <a href="#home" className="text-orange-500 relative">
            Home
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></span>
          </a>

          <a href="#about" className="text-neutral-400 hover:text-white transition">
            About
          </a>

          <a href="#projects" className="text-neutral-400 hover:text-white transition">
            Projects
          </a>

          <a href="#skills" className="text-neutral-400 hover:text-white transition">
            Skills
          </a>

          <a href="mailto:adammaulana.design@gmail.com" className="text-neutral-400 hover:text-white transition">
            Contact
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:adammaulana.design@gmail.com"
            className="hidden md:flex text-sm text-white items-center gap-1"
          >
            Let&apos;s Talk <span className="text-orange-500">↗</span>
          </a>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full border border-white/10 bg-black/40 text-white backdrop-blur-md transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <span
              className={`block h-[2px] w-5 bg-current transition-all ${
                menuOpen ? "rotate-45 translate-y-[6px]" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-current transition-all ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-current transition-all ${
                menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-white/10 bg-black/95">
          <div className="container-custom py-5 flex flex-col gap-4 text-sm">
            <a href="#home" className="text-white hover:text-orange-500 transition">
              Home
            </a>
            <a href="#about" className="text-neutral-400 hover:text-white transition">
              About
            </a>
            <a href="#projects" className="text-neutral-400 hover:text-white transition">
              Projects
            </a>
            <a href="#skills" className="text-neutral-400 hover:text-white transition">
              Skills
            </a>
            <a href="mailto:adammaulana.design@gmail.com" className="text-neutral-400 hover:text-white transition">
              Contact
            </a>
            <button
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-left text-orange-500"
            >
              Close menu
            </button>
          </div>
        </div>
      )}
    </header>
  );
}