"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function FeaturedProjects() {
  const projects = [
    {
      title: "Afra Konektra",
      category: "Web Design & Development",
      image: "/images/featuredprojects/Afrakonektra.webp",
      href: "https://afrakonektra.com",
    },
    {
      title: "Jembatan Bisnis",
      category: "Corporate Website",
      image: "/images/featuredprojects/Jembatanbisnis.webp",
      href: "https://jembatanbisnis.com",
    },
    {
      title: "VibeTravelPlan",
      category: "Personal Project — Next.js",
      image: "/images/featuredprojects/vibetravel.jpg",
      href: "https://github.com/itsdamsky/VibeTravelPlan",
    },
  ];

  return (
    <section className="relative py-12 overflow-hidden">
      <div className="container-custom">
        <ScrollReveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-14">
            <div>
              <p className="text-xs tracking-[3px] text-orange-500 mb-3">FEATURED PROJECTS</p>
              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                Some of my recent work
              </h2>
            </div>
            <a
              href="/projects"
              className="text-sm text-orange-500 flex items-center gap-2 hover:opacity-80 transition cursor-pointer will-change-transform"
            >
              View All Projects <span>↗</span>
            </a>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-sm hover:border-orange-500/30 transition block"
              >
                <div className="relative h-60 sm:h-64 overflow-hidden bg-white/5">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover object-top group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>
                <div className="h-px w-full bg-white/10" />
                <div className="p-6 relative">
                  <h3 className="text-white text-lg font-medium mb-1">{project.title}</h3>
                  <p className="text-sm text-neutral-400">{project.category}</p>
                  <div className="absolute right-4 bottom-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-500 blur-xl opacity-10 group-hover:opacity-30 transition rounded-full" />
                      <div className="relative w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25)]">
                        <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}