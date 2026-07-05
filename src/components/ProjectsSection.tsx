"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

type Project = {
  title: string;
  category: string;
  year: string;
  desc: string;
  tags: string[];
  link?: string | null;
  github?: string | null;
  type: "web" | "design";
  preview?: string;
  file?: string;
};

const projects: Project[] = [
  {
    title: "Jembatan Bisnis",
    category: "Freelance — Design & Development",
    year: "2024",
    desc: "Full company profile website for a Jakarta-based business brokerage firm. Designed and built end-to-end using WordPress & Elementor.",
    tags: ["WordPress", "Elementor", "UI Design"],
    link: "https://jembatanbisnis.com",
    github: null,
    type: "web",
  },
  {
    title: "Afra Konektra",
    category: "Freelance — Development",
    year: "2025",
    desc: "Company profile site for an industrial automation & electrical systems integrator. Translated a provided UI into a fully working WordPress/Elementor build.",
    tags: ["WordPress", "Elementor", "Frontend Dev"],
    link: "https://afrakonektra.com",
    github: null,
    type: "web",
  },
  {
    title: "VibeTravelPlan",
    category: "Personal Project",
    year: "2026",
    desc: "AI-powered travel planning platform built with Next.js, TypeScript, and Tailwind CSS. Uses Google Gemini API for AI-assisted itinerary planning.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API"],
    link: null,
    github: "https://github.com/itsdamsky/VibeTravelPlan",
    type: "web",
  },
  {
    title: "Personal Portfolio",
    category: "Personal Project",
    year: "2026",
    desc: "Personal portfolio site built with Next.js to showcase design and development work.",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    link: null,
    github: "https://github.com/itsdamsky/damsky-portfolio",
    type: "web",
  },
  {
    title: "Portfolio Karpet",
    category: "PT Johannes Carpet Indonesia",
    year: "2022",
    desc: "Custom carpet design portfolio for five-star hotels and luxury residences.",
    tags: ["Print Design", "Custom Pattern", "Branding"],
    type: "design",
    file: "https://drive.google.com/file/d/1kQ5nrn7xBZ9DqVVwgrvFW2g98W6yq7pc/preview",
  },
  {
    title: "LKD Desa Jatake",
    category: "Freelance",
    year: "2024",
    desc: "Logo and merchandise design for LKD Desa Jatake including t-shirt mockup.",
    tags: ["Logo Design", "Merchandise", "Branding"],
    type: "design",
    file: "https://drive.google.com/file/d/1iTx26IgQJ-Ju0C8C3JNRm7NfcEz7AOyO/preview",
  },
  {
    title: "Design Box Chicken",
    category: "Custombox Indonesia",
    year: "2024",
    desc: "Custom food packaging design for chicken box product branding.",
    tags: ["Packaging", "Print Design", "Branding"],
    type: "design",
    file: "https://drive.google.com/file/d/1nhacGvjxn0Jk0XCKEgj_oxGzDZz1fFON/preview",
  },
  {
    title: "Urban Escape Series SS 2026",
    category: "Freelance",
    year: "2026",
    desc: "Seasonal carpet collection design series with modern urban aesthetic.",
    tags: ["Collection Design", "Print", "Pattern"],
    type: "design",
    file: "https://drive.google.com/file/d/1d1Aa75-htWLP8N7ak3Sx8S6WVmGqnnPD/preview",
  },
  {
    title: "Design Barbershop",
    category: "Freelance",
    year: "2023",
    desc: "Branding and visual design for a barbershop client.",
    tags: ["Branding", "Visual Design", "Print"],
    type: "design",
    preview: "/images/projects/design/Design barbershoop.jpg",
    file: "/images/projects/design/Design barbershoop.jpg",
  },
  {
    title: "Design Carpet Aston Serang",
    category: "PT Johannes Carpet Indonesia",
    year: "2026",
    desc: "Custom carpet design for Aston Hotel Serang lobby and room areas.",
    tags: ["Custom Pattern", "Hotel Design", "Print"],
    type: "design",
    preview: "/images/projects/design/Design Carpet Aston Serang.jpg",
    file: "/images/projects/design/Design Carpet Aston Serang.jpg",
  },
  {
    title: "Logo Delima",
    category: "Freelance",
    year: "2024",
    desc: "Logo design for Delima brand.",
    tags: ["Logo Design", "Branding", "Identity"],
    type: "design",
    preview: "/images/projects/design/Logo Delima.jpg",
    file: "/images/projects/design/Logo Delima.jpg",
  },
  {
    title: "Logo IGD",
    category: "Freelance",
    year: "2024",
    desc: "Logo design for IGD brand.",
    tags: ["Logo Design", "Branding"],
    type: "design",
    preview: "/images/projects/design/Logo IGD.jpg",
    file: "/images/projects/design/Logo IGD.jpg",
  },
  {
    title: "Tag Mango",
    category: "Freelance",
    year: "2023",
    desc: "Product tag design for Mango branded packaging.",
    tags: ["Print Design", "Tag Design", "Packaging"],
    type: "design",
    preview: "/images/projects/design/Tag Mango.png",
    file: "/images/projects/design/Tag Mango.png",
  },
];

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "web" | "design">("all");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShow(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeTab === "all" ? projects : projects.filter(p => p.type === activeTab);

  return (
    <section id="projects" className="relative min-h-screen py-26 overflow-hidden">
      <div className="container-custom">
        <ScrollReveal>
          <div className="mb-10">
            <p className="text-xs tracking-[3px] text-orange-500 mb-3">MY WORK</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">Projects</h1>
            <p className="text-neutral-400 max-w-xl">
              A selection of web development and graphic design work — from Figma to production code, and print to branding.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex gap-2 mb-10">
            {[
              { key: "all", label: "All Projects" },
              { key: "web", label: "Web Dev" },
              { key: "design", label: "Graphic Design" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "all" | "web" | "design")}
                className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                  activeTab === tab.key
                    ? "border-orange-500 text-orange-500 bg-orange-500/10"
                    : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <ScrollReveal key={i} delay={i * 0.07}>
              <div className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/40 transition-all duration-300 flex flex-col h-full">
                {project.type === "design" && project.preview && !project.preview.endsWith(".pdf") && (
                  <div className="w-full h-36 overflow-hidden border-b border-white/10">
                    <img
                      src={project.preview}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                {project.type === "design" && project.preview?.endsWith(".pdf") && (
                  <div className="w-full h-48 bg-white/5 border-b border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl mb-2">📄</p>
                      <p className="text-xs text-neutral-500">PDF Document</p>
                    </div>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] tracking-widest px-2 py-0.5 rounded-full border ${
                        project.type === "web"
                          ? "text-blue-400 border-blue-400/30"
                          : "text-orange-400 border-orange-400/30"
                      }`}>
                        {project.type === "web" ? "WEB DEV" : "DESIGN"}
                      </span>
                      {project.type === "design" && (
                        <span className="text-[10px] tracking-widest px-2 py-0.5 rounded-full border border-white/20 text-neutral-400">
                          {project.file?.endsWith(".pdf") || project.file?.includes("drive.google")
                            ? "PDF"
                            : project.preview?.endsWith(".png")
                            ? "PNG"
                            : "JPG"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">{project.year}</p>
                  </div>
                  <h2 className="text-base font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors duration-300">
                    {project.title}
                  </h2>
                  <p className="text-xs text-orange-500 mb-3">{project.category}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-5 flex-1">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag, j) => (
                      <span key={j} className="text-xs text-neutral-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    {project.link && (
                      <button
                        onClick={() => window.open(project.link!, "_blank")}
                        className="flex items-center gap-1.5 text-sm text-white bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        Visit Site
                      </button>
                    )}
                    {project.file && (
                      <button
                        onClick={() => window.open(project.file!, "_blank")}
                        className="flex items-center gap-1.5 text-sm text-white bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 transition-all duration-300 cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        View Work
                      </button>
                    )}
                    {project.github && (
                      <button
                        onClick={() => window.open(project.github!, "_blank")}
                        className="flex items-center gap-1.5 text-sm text-neutral-300 border border-white/10 px-4 py-2 rounded-full hover:border-white/30 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                        GitHub
                      </button>
                    )}
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