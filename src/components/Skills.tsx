"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

type Skill = {
  name: string;
  level: number;
  icon: string;
  scale: string;
  invert?: boolean;
  github?: boolean;
};

const skills: Skill[] = [
  { name: "Photoshop", level: 90, icon: "/images/Skills/psd.svg", scale: "scale-95" },
  { name: "Illustrator", level: 85, icon: "/images/Skills/ai.svg", scale: "scale-95" },
  { name: "CorelDRAW", level: 85, icon: "/images/Skills/coreldraw.svg", scale: "scale-95" },
  { name: "Figma", level: 60, icon: "/images/Skills/fgm.svg", scale: "scale-70" },
  { name: "HTML", level: 85, icon: "/images/Skills/html.svg", scale: "scale-100" },
  { name: "CSS", level: 80, icon: "/images/Skills/css.svg", scale: "scale-100" },
  { name: "JavaScript", level: 60, icon: "/images/Skills/js.svg", scale: "scale-95" },
  { name: "React", level: 55, icon: "/images/Skills/rct.svg", scale: "scale-110" },
  { name: "Next.js", level: 55, icon: "/images/Skills/nextdotjs.svg", scale: "scale-95" },
  { name: "Tailwind", level: 70, icon: "/images/tools/tailwindcss.svg", scale: "scale-110", invert: true },
  { name: "WordPress", level: 85, icon: "/images/Skills/wordpress.svg", scale: "scale-95" },
  { name: "VS Code", level: 90, icon: "/images/Skills/vscode.svg", scale: "scale-95" },
  { name: "Git / GitHub", level: 70, icon: "", scale: "scale-95", github: true },
];

export default function Skills() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShow(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      <div className="container-custom">
        <ScrollReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-xs tracking-[3px] text-orange-500 mb-3">MY STACK</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                My Design & Development Stack
              </h2>
            </div>
            <a href="/skills" className="text-orange-500 text-sm hover:opacity-80 transition">
              View All Skills ↗
            </a>
          </div>
        </ScrollReveal>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {skills.map((skill, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                // BUG FIX (mobile perf): `backdrop-blur-sm` was applied to
                // ALL 13 cards unconditionally. One backdrop-blur is cheap;
                // thirteen of them stacked in a grid is a real cost on a
                // mobile GPU, especially while scrolling past them. `isDesktop`
                // already exists in this component (it gates the 3D tilt
                // effect) — reusing it here means mobile gets a plain card
                // with no blur, desktop keeps the exact same glass look.
                className={`group relative bg-white/5 border border-white/10 rounded-2xl px-4 py-4 ${
                  isDesktop ? "backdrop-blur-sm" : ""
                } hover:border-orange-500/40 transition duration-300 cursor-pointer md:will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25)]`}
              >
                <div className="hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition blur-xl bg-orange-500/10 rounded-2xl" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    {skill.github ? (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ) : (
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={32}
                        height={32}
                        loading="lazy"
                        className={`w-[32px] h-[32px] object-contain ${skill.scale} ${skill.invert ? "brightness-0 invert" : ""}`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium mb-2">{skill.name}</p>
                    <div className="w-full h-[4px] bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: show ? `${skill.level}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
