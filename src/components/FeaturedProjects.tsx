"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedProjects() {
  const projects = [
    {
      title: "Industrial Solutions Website",
      category: "Web Design & Development",
      image: "/images/projects/Afrakonektra.png",
    },
    {
      title: "Custom Box Packaging Platform",
      category: "Web Design & Development",
      image: "/images/projects/Customboxid.png",
    },
    {
      title: "Business Brokerage Website",
      category: "Corporate Website",
      image: "/images/projects/Jembatanbisnis.png",
    },
  ];

  return (
    <section className="relative py-12 overflow-hidden">

      <div className="container-custom">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-14">

          <div>
            <p className="text-xs tracking-[3px] text-orange-500 mb-3">
              FEATURED PROJECTS
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              Some of my recent work
            </h2>
          </div>

          <button className="text-sm text-orange-500 flex items-center gap-2 hover:opacity-80 transition">
            View All Projects <span>↗</span>
          </button>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6 cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25">

          {projects.map((project, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-sm hover:border-orange-500/30 transition"
            >

              {/* IMAGE */}
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top group-hover:scale-110 transition duration-500"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

              {/* 🔥 GARIS PEMBATAS */}
                <div className="h-px w-full bg-white/10" />

              {/* CONTENT */}
              <div className="p-6 relative">

                <h3 className="text-white text-lg font-medium mb-1">
                  {project.title}
                </h3>

                <p className="text-sm text-neutral-400">
                  {project.category}
                </p>

                {/* BUTTON BULAT */}
                <div className="absolute right-6 bottom-6 ">
                    <div className="relative">

                        {/* GLOW */}
                        <div className="absolute inset-0 bg-orange-500 blur-xl opacity-10 group-hover:opacity-30 transition rounded-full" />

                        {/* BUTTON */}
                        <button className="relative w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25">
                        <ArrowUpRight className="w-6 h-6 stroke-[2.5]" />
                        </button>

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