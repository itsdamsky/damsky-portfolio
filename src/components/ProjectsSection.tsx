"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, GitBranch } from "lucide-react";

const projects = [
  {
    title: "Jembatan Bisnis",
    category: "Freelance — Design & Development",
    year: "2024",
    desc: "Full company profile website for a Jakarta-based business brokerage firm. Designed and built end-to-end using WordPress & Elementor, covering UI design, layout, and content structure.",
    tags: ["WordPress", "Elementor", "UI Design", "Web Design"],
    link: "https://jembatanbisnis.com",
    github: null,
    featured: true,
  },
  {
    title: "Afra Konektra",
    category: "Freelance — Development",
    year: "2025",
    desc: "Company profile site for an industrial automation & electrical systems integrator. Translated a provided UI design into a fully working WordPress/Elementor build.",
    tags: ["WordPress", "Elementor", "Frontend Dev"],
    link: "https://afrakonektra.com",
    github: null,
    featured: true,
  },
  {
    title: "VibeTravelPlan",
    category: "Personal Project",
    year: "2024",
    desc: "AI-powered travel planning platform built with Next.js, TypeScript, and Tailwind CSS. Uses Google Gemini API for AI-assisted itinerary planning and destination recommendations.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Gemini API", "Docker"],
    link: null,
    github: "https://github.com/itsdamsky/VibeTravelPlan",
    featured: false,
  },
  {
    title: "Personal Portfolio",
    category: "Personal Project",
    year: "2026",
    desc: "Personal portfolio site built with Next.js to showcase design and development work. Featuring smooth animations, responsive layout, and modern dark UI.",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    link: null,
    github: "https://github.com/itsdamsky/damsky-portfolio",
    featured: false,
  },
];

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShow(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative min-h-screen py-42 overflow-hidden">
      <div className="container-custom">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[3px] text-orange-500 mb-3">MY WORK</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Projects
          </h1>
          <p className="text-neutral-400 max-w-xl">
            A selection of freelance work and personal projects — from design to production-ready code.
          </p>
        </div>

        {/* Projects Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
                key={i}
                className={`group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,115,0,0.1)] flex flex-col
                    ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
                style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Featured badge */}
              {project.featured && (
                <span className="absolute top-4 right-4 text-[10px] tracking-widest text-orange-500 border border-orange-500/30 px-2 py-0.5 rounded-full">
                  FREELANCE
                </span>
              )}

              {/* Year */}
              <p className="text-xs text-neutral-500 mb-3">{project.year}</p>

              {/* Title */}
              <h2 className="text-xl font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors duration-300">
                {project.title}
              </h2>

              {/* Category */}
              <p className="text-xs text-orange-500 mb-4">{project.category}</p>

              {/* Description */}
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                {project.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, j) => (
                  <span key={j} className="text-xs text-neutral-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 mt-auto">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-white bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300"
                  >
                    <ExternalLink size={14} />
                    Visit Site
                  </a>
                )}
                {project.github && (
                <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-white border border-white/20 px-4 py-2 rounded-full hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}