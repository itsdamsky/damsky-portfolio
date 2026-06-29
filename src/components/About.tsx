"use client";

import Image from "next/image";
import Counter from "@/components/Counter";
import ScrollReveal from "@/components/ScrollReveal";

export default function About() {
  return (
    <section className="relative text-white py-20 md:py-24 overflow-visible md:overflow-hidden" id="about">

      <div className="will-change-transform absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />

      <div className="container-custom">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">

          {/* Left column */}
          <div>
            <ScrollReveal delay={0}>
              <p className="text-orange-400 tracking-[3px] text-sm mb-4">ABOUT ME</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Designing with purpose. <br />
                Building with <span className="text-orange-500">passion.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-gray-400 mt-6 max-w-full sm:max-w-xl leading-relaxed text-sm sm:text-base">
                I&apos;m a <span className="text-white font-medium">Frontend Developer & Graphic Designer</span> based in Parungpanjang, Bogor, Indonesia. With 5+ years in design and 1+ year in web development, I build responsive and visually engaging digital experiences.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <a
                href="/about"
                className="mt-8 px-6 py-3 border border-orange-500 rounded-lg hover:bg-orange-500/10 transition flex items-center gap-2 cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25)] w-fit"
              >
                More About Me →
              </a>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-wrap gap-10 mt-10">
                <div>
                  <p className="text-orange-500 text-2xl font-medium">
                    <Counter target={5} suffix="+" />
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Years in Design</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-orange-500">
                    <Counter target={4} suffix="" />
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Projects Completed</p>
                </div>
                <div>
                  <p className="text-orange-500 text-2xl font-medium">
                    <Counter target={2} suffix="" />
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Freelance Clients</p>
                </div>
                <div>
                  <p className="text-orange-500 text-2xl font-medium">
                    <Counter target={1} suffix="+" />
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Years in Dev</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column — image */}
          <ScrollReveal delay={0.2} direction="left">
            <div className="relative flex justify-center md:justify-end pb-10 md:pb-0">
              <div className="relative w-full max-w-xl">
                <div className="rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src="/images/about/coding.webp"
                    alt="Person coding on a laptop"
                    width={500}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Card mobile */}
                <div className="absolute -bottom-[26px] right-4 z-20 md:hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {"</>"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Available for</p>
                    <p className="text-sm text-gray-400">freelance</p>
                  </div>
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse ml-1 shrink-0" />
                </div>
              </div>

              {/* Card desktop */}
              <div className="hidden md:flex absolute bottom-6 right-[-20px] w-full max-w-xs backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-5 py-4 items-center gap-4 shadow-xl">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-lg">
                  {"</>"}
                </div>
                <div>
                  <p className="text-sm font-medium">Available for</p>
                  <p className="text-sm text-gray-400">freelance</p>
                </div>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse ml-2" />
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}