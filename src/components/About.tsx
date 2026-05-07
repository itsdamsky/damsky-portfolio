"use client";

import Image from "next/image";
import Counter from "@/components/Counter";

export default function About() {
  return (
    <section className="relative text-white py-24 overflow-hidden" id="about">

      {/* 🔥 TOP FADE (INI YANG KAMU BUTUH) */}
        <div className="will-change-transform absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10" />

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <p className="text-orange-400 tracking-[3px] text-sm mb-4">
              ABOUT ME
            </p>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Designing with purpose. <br />
              Building with{" "}
              <span className="text-orange-500">passion.</span>
            </h2>

            <p className="text-gray-400 mt-6 max-w-lg leading-relaxed">
              I'm a Graphic Designer & Web Developer based in Indonesia.
              I love turning ideas into visual stories and building modern,
              clean, and functional websites that deliver great user experiences.
            </p>

            {/* BUTTON */}
            <button className="mt-8 px-6 py-3 border border-orange-500 rounded-lg hover:bg-orange-500/10 transition flex items-center gap-2 cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25">
              More About Me →
            </button>

            {/* STATS */}
            <div className="flex flex-wrap gap-10 mt-10">

              <div>
                <p className="text-orange-500 text-2xl font-medium">
                    <Counter target={3} suffix="+" />
                </p>
                <p className="text-xs text-gray-400 mt-1">Years Experience</p>
              </div>

              <div>
                <p className="text-2xl font-medium text-orange-500">
                    <Counter target={30} suffix="+" />
                </p>
                <p className="text-xs text-gray-400 mt-1">Projects Completed</p>
              </div>

              <div>
                <p className="text-orange-500 text-2xl font-medium">
                    <Counter target={20} suffix="+" />
                </p>
                <p className="text-xs text-gray-400 mt-1">Happy Clients</p>
              </div>

              <div>
                <p className="text-orange-500 text-2xl font-medium">
                    <Counter target={5} suffix="+" />
                </p>
                <p className="text-xs text-gray-400 mt-1">Awards Won</p>
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">

            {/* IMAGE CARD */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <Image
                src="/images/about/coding.jpg" // ganti sesuai asset kamu
                alt="work"
                width={500}
                height={600}
                className="object-cover"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* FLOATING CARD */}
            <div className="absolute bottom-6 right-[-20px] backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex items-center gap-4 shadow-xl">

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

        </div>
      </div>
    </section>
  );
}