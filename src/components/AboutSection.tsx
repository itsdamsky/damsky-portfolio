"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const stats = [
  { value: "5+", label: "Years in Design" },
  { value: "1+", label: "Years in Dev" },
  { value: "4", label: "Projects Completed" },
  { value: "2", label: "Freelance Clients" },
];

const experiences = [
  {
    role: "Graphic Designer",
    company: "PT Johannes Carpet Indonesia",
    period: "2021 – 2025",
    desc: "Custom carpet design & production for five-star hotels and luxury residences.",
  },
  {
    role: "Final Artwork & Graphic Designer",
    company: "PT Karya Aura Samasta",
    period: "2021",
    desc: "Prepared final artwork for production and adapted branding designs across packaging and media formats.",
  },
  {
    role: "Graphic Designer",
    company: "Custombox Indonesia",
    period: "2019 – 2021",
    desc: "Designed custom packaging and branding/logo assets across a range of client products.",
  },
];

export default function About() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen py-26 overflow-hidden">
      <div className="container-custom">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[3px] text-orange-500 mb-3">ABOUT ME</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white max-w-xl">
            Designing with purpose. <br />
            Building with <span className="text-orange-500">passion.</span>
          </h2>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-16 items-start">

          {/* Kiri - Bio */}
          <div className={`transition-all duration-700 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-neutral-400 leading-relaxed mb-6">
                I'm a <span className="text-white font-medium">Frontend Developer & Graphic Designer</span> based in Parungpanjang, Bogor, Indonesia. With 5+ years of experience in graphic design and web development, I focus on building responsive, functional, and visually engaging digital experiences.
            </p>
            <p className="text-neutral-400 leading-relaxed mb-10">
                My journey started in graphic design — packaging, branding, and print — before expanding into frontend development using Next.js, React, and Tailwind CSS. I'm comfortable working from a Figma file all the way to production-ready code.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:border-orange-500/40 transition duration-300"
                >
                  <p className="text-2xl font-bold text-orange-500">{stat.value}</p>
                  <p className="text-xs text-neutral-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link
                    href="/projects"
                    className="text-sm text-white border border-white/20 px-5 py-2.5 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
                  >
                    View My Work ↗
                  </Link>
              <a
                href="/cv/Adam_Maulana_CV.pdf"
                download
                className="text-sm text-white bg-orange-500 px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all duration-300"
              >
                Download CV ↓
              </a>
            </div>
          </div>

          {/* Kanan - Experience */}
          <div className={`transition-all duration-700 delay-200 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-xs tracking-[3px] text-orange-500 mb-6">WORK EXPERIENCE</p>

            <div className="flex flex-col gap-4">
              {experiences.map((exp, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-orange-500/40 transition duration-300 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-white font-medium text-sm">{exp.role}</p>
                      <p className="text-orange-500 text-xs mt-0.5">{exp.company}</p>
                    </div>
                    <span className="text-neutral-500 text-xs shrink-0">{exp.period}</span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <p className="text-xs tracking-[3px] text-orange-500 mt-10 mb-6">EDUCATION</p>
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-orange-500/40 transition duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-medium text-sm">Universitas Pamulang</p>
                    <p className="text-orange-500 text-xs mt-0.5">Informatics Engineering</p>
                  </div>
                  <span className="text-neutral-500 text-xs shrink-0">2016 – 2021</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-orange-500/40 transition duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-white font-medium text-sm">SMK Bina Putra Mandiri</p>
                    <p className="text-orange-500 text-xs mt-0.5">Multimedia</p>
                  </div>
                  <span className="text-neutral-500 text-xs shrink-0">2012 – 2015</span>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <p className="text-xs tracking-[3px] text-orange-500 mt-10 mb-6">CERTIFICATIONS</p>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-5 hover:border-orange-500/40 transition duration-300">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white font-medium text-sm">#JuaraVibeCoding — Certificate of Completion</p>
                  <p className="text-orange-500 text-xs mt-0.5">Google Developer Groups</p>
                  <p className="text-neutral-500 text-xs mt-1">Vibe Coding Study Jam · Participant</p>
                </div>
                <span className="text-neutral-500 text-xs shrink-0">May 2026</span>
              </div>
              <a
                href="https://drive.google.com/file/d/1zQ0mkv2xgOJUOMoXHj8Yms_y043f3i3V/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 transition mt-3"
              >
                Verify Certificate ↗
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}