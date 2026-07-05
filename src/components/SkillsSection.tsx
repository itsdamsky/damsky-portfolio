"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const categories = [
  {
    label: "Design & Visual",
    color: "from-orange-500/20 to-transparent",
    accent: "bg-orange-500",
    skills: [
      { name: "Figma", level: 60, icon: "/images/Skills/fgm.svg" },
      { name: "Photoshop", level: 90, icon: "/images/Skills/psd.svg" },
      { name: "Illustrator", level: 85, icon: "/images/Skills/ai.svg" },
      { name: "CorelDRAW", level: 85, icon: "/images/Skills/coreldraw.svg" },
    ],
  },
  {
    label: "Frontend Development",
    color: "from-blue-500/20 to-transparent",
    accent: "bg-blue-500",
    skills: [
      { name: "HTML", level: 85, icon: "/images/Skills/html.svg" },
      { name: "CSS", level: 80, icon: "/images/Skills/css.svg" },
      { name: "JavaScript", level: 60, icon: "/images/Skills/js.svg" },
      { name: "React", level: 55, icon: "/images/Skills/rct.svg" },
      { name: "Next.js", level: 55, icon: "/images/Skills/nextdotjs.svg" },
      { name: "Tailwind CSS", level: 70, icon: "/images/tools/tailwindcss.svg", invert: true },
    ],
  },
  {
    label: "CMS & Tools",
    color: "from-purple-500/20 to-transparent",
    accent: "bg-purple-500",
    skills: [
      { name: "WordPress", level: 85, icon: "/images/Skills/wordpress.svg" },
      { name: "Git / GitHub", level: 70, icon: "", github: true },
      { name: "VS Code", level: 90, icon: "/images/Skills/vscode.svg" },
    ],
  },
];

// Batas atas untuk delay per-item di desktop. Dulu `i * 0.08` naik terus
// tanpa batas — kategori dengan 6 skill (Frontend Dev) bikin item terakhir
// baru mulai animasi 0.48s setelah yang pertama.
const MAX_STAGGER_DELAY = 0.18;
const staggerDelay = (i: number, step: number) => Math.min(i * step, MAX_STAGGER_DELAY);

function SkillBar({ level, accent, show, isMobile }: { level: number; accent: string; show: boolean; isMobile: boolean }) {
  return (
    <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${accent} rounded-full ${isMobile ? "" : "transition-all duration-700 ease-out"}`}
        style={{ width: show ? `${level}%` : "0%" }}
      />
    </div>
  );
}

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  // Sama seperti Counter.tsx dan ScrollReveal.tsx — di mobile, animasi
  // masuknya skill card & progress bar di-skip total (bukan cuma
  // dipercepat), karena di sinilah beberapa animasi numpuk sekaligus
  // tiap kali halaman Skills dibuka.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  const handleCategoryChange = (i: number) => {
    setActiveCategory(i);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShow(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen py-32 overflow-hidden">
      <div className="container-custom">
        <ScrollReveal>
          <div className="mb-10">
            <p className="text-xs tracking-[3px] text-orange-500 mb-3">MY STACK</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">Skills & Tools</h1>
            <p className="text-neutral-400 max-w-xl">
              A mix of design craft and frontend engineering — built over 5+ years of hands-on work.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.06}>
          <div className="flex gap-2 mb-12 flex-wrap">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryChange(i)}
                className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                  activeCategory === i
                    ? "border-orange-500 text-orange-500 bg-orange-500/10"
                    : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div ref={ref}>
          <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories[activeCategory].skills.map((skill, i) =>
              isMobile ? (
                // Mobile: langsung tampil, tanpa motion sama sekali.
                <div key={skill.name}>
                  <SkillCardBody skill={skill} accent={categories[activeCategory].accent} show={show} isMobile />
                </div>
              ) : (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.28,
                    delay: staggerDelay(i, 0.05),
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <SkillCardBody skill={skill} accent={categories[activeCategory].accent} show={show} isMobile={false} />
                </motion.div>
              )
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "5+", label: "Years in Design" },
            { value: "1+", label: "Years in Dev" },
            { value: "10+", label: "Tools Mastered" },
            { value: "4", label: "Projects Shipped" },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={staggerDelay(i, 0.05)}>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-5 text-center hover:border-orange-500/30 transition-all duration-300">
                <p className="text-2xl font-bold text-orange-500 mb-1">{stat.value}</p>
                <p className="text-xs text-neutral-400">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// Dipisah supaya isi kartu (icon, nama, progress bar) sama persis baik
// yang dibungkus motion.div (desktop) maupun div biasa (mobile) — cuma
// wrapper animasinya yang beda.
function SkillCardBody({
  skill,
  accent,
  show,
  isMobile,
}: {
  skill: { name: string; level: number; icon: string; github?: boolean; invert?: boolean };
  accent: string;
  show: boolean;
  isMobile: boolean;
}) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-orange-500/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,115,0,0.08)]">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl pointer-events-none" />
      <div className="relative z-10 flex items-center gap-4 mb-4">
        <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-white/5 rounded-xl border border-white/10">
          {"github" in skill && skill.github ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          ) : (
            <Image
              src={skill.icon}
              alt={skill.name}
              width={24}
              height={24}
              className={`w-6 h-6 object-contain ${"invert" in skill && skill.invert ? "brightness-0 invert" : ""}`}
            />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-white font-medium">{skill.name}</p>
            <p className="text-xs text-neutral-500">{skill.level}%</p>
          </div>
          <SkillBar level={skill.level} accent={accent} show={show} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}
