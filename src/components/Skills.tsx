"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const skills = [
  { name: "Figma", level: 90, icon: "/images/Skills/fgm.svg", scale: "scale-110" },
  { name: "Photoshop", level: 85, icon: "/images/Skills/psd.svg", scale: "scale-95" },
  { name: "Illustrator", level: 85, icon: "/images/Skills/ai.svg", scale: "scale-95" },
  { name: "HTML", level: 90, icon: "/images/Skills/html.svg", scale: "scale-100" },
  { name: "CSS", level: 85, icon: "/images/Skills/css.svg", scale: "scale-100" },
  { name: "JavaScript", level: 75, icon: "/images/Skills/js.svg", scale: "scale-95" },
  { name: "React", level: 70, icon: "/images/Skills/rct.svg", scale: "scale-110" },
];

export default function Skills() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  // 🔥 SCROLL ANIMATION
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // 🔥 TILT EFFECT
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
    <section id="skills" className="relative will-change-transform py-24 overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <p className="text-xs tracking-[3px] text-orange-500 mb-3">MY STACK</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              My Design & Development Stack
            </h2>
          </div>
          <a href="#skills" className="text-orange-500 text-sm">
            View All Skills ↗
          </a>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {skills.map((skill, i) => (
            <div
              key={i}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              className="group relative bg-white/5 border border-white/10 rounded-2xl px-4 py-4 backdrop-blur-xl hover:border-orange-500/40 transition duration-300 will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25)]"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition blur-xl bg-orange-500/10 rounded-2xl" />

              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={0}
                    height={0}
                    sizes="100%"
                    className={`w-[32px] h-[32px] object-contain ${skill.scale}`}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-white font-medium mb-2">{skill.name}</p>
                  <div className="w-full h-[4px] bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: show ? `${skill.level}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}