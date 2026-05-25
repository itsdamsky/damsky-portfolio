"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Counter from "@/components/Counter";

type Dot = {
  top: number;
  left: number;
  duration: number;
  delay: number;
};

export default function Hero() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    setDots(
      [...Array(20)].map(() => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  // ✅ TYPEWRITER STATE
  const text1 = "Graphic Designer &";
  const text2 = "Web Developer";

  const [display1, setDisplay1] = useState("");
  const [display2, setDisplay2] = useState("");

  const i1 = useRef(0);
  const i2 = useRef(0);
  const phase = useRef<"line1" | "line2" | "pause" | "delete">("line1");

  useEffect(() => {
  const interval = setInterval(() => {
    if (phase.current === "line1") {
      const next = text1.slice(0, i1.current + 1);
      setDisplay1(next);
      i1.current++;

      if (i1.current === text1.length) {
        phase.current = "line2";

        // 🔥 RESET LINE 2 (INI KUNCI)
        i2.current = 0;
        setDisplay2("");
      }
    }

    else if (phase.current === "line2") {
      const next = text2.slice(0, i2.current + 1);
      setDisplay2(next);
      i2.current++;

      if (i2.current === text2.length) {
        phase.current = "pause";

        setTimeout(() => {
          phase.current = "delete";
        }, 1200);
      }
    }

    else if (phase.current === "delete") {
      if (i2.current > 0) {
        i2.current--;
        setDisplay2(text2.slice(0, i2.current));
      } else if (i1.current > 0) {
        i1.current--;
        setDisplay1(text1.slice(0, i1.current));
      } else {
        phase.current = "line1";

        // 🔥 RESET SEMUA
        i1.current = 0;
        i2.current = 0;
        setDisplay1("");
        setDisplay2("");
      }
    }

  }, 120);

  return () => clearInterval(interval);
}, []);



  return (
    <section
      id="home"
      className="relative will-change-transform w-full min-h-[calc(100vh-90px)] h-auto flex items-center text-white overflow-hidden scroll-mt-[70px] py-16 md:py-0"
    >

      {/* GLOW */}
      <div className="hidden lg:block absolute right-[12%] top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/15 blur-[140px] rounded-full" />

      {/* DOTS */}
      <div className="absolute inset-0 pointer-events-none">
        {dots.map((dot, i) => (
          <span
            key={i}
            className="absolute w-[4px] h-[4px] bg-orange-400 rounded-full opacity-70"
            style={{
              top: `${dot.top}%`,
              left: `${dot.left}%`,
              animation: `float ${dot.duration}s ease-in-out infinite`,
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-[1.2fr_1fr] items-center">

          {/* LEFT */}
          <div>
            <p className="text-gray-400 text-sm sm:text-base mb-4">
              Hi, I&apos;m{" "}
              <span className="text-orange-500 font-medium">Adam Maulana</span>{" "}
              👋
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05]">
              <div className="text-white">
                {display1}
                {display2.length === 0 && (
                  <span className="inline-block ml-1 w-[3px] h-[1em] bg-white animate-pulse align-bottom" />
                )}
              </div>

              {display2 && (
                <div className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  {display2}
                  {display2.length > 0 && (
                    <span className="inline-block ml-1 w-[3px] h-[1em] bg-orange-500 animate-pulse align-bottom" />
                  )}
                </div>
              )}
            </h1>

            <p className="text-gray-400 flex flex-col gap-4 max-w-full sm:max-w-lg leading-relaxed mt-6 text-sm sm:text-base">
              I create visually stunning designs and build modern,
              responsive websites that help brands stand out and achieve their goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-medium hover:scale-105 transition cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25)]">
                View My Work ↗
              </button>

              <a
                href="/files/cv-adam.pdf"
                download
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-orange-500/40 bg-black/40 backdrop-blur-md hover:bg-orange-500/10 transition text-center"
              >
                Download CV ↓
              </a>
            </div>

            <button
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-12 flex items-center gap-3 text-gray-500 text-sm cursor-pointer"
            >
              <div className="w-6 h-10 border border-orange-500 rounded-full flex justify-center items-start p-1">
                <div className="w-1 h-2 bg-orange-500 rounded-full animate-bounce" />
              </div>

              SCROLL DOWN
            </button>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center pt-6 md:pt-0">
            <div className="hidden md:block absolute w-[600px] h-[600px] bg-orange-600/25 blur-[180px] rounded-full z-0" />
            <div className="hidden md:block absolute w-[450px] h-[450px] bg-orange-600/35 blur-[140px] rounded-full z-0" />
            <div className="hidden md:block absolute w-[300px] h-[300px] bg-orange-600/70 blur-[90px] rounded-full z-0" />
            <div className="absolute w-[200px] h-[200px] bg-orange-500/80 blur-[60px] rounded-full z-0" />

            <div
              className="absolute hidden md:block w-[420px] h-[420px] rounded-full z-10 border-2 border-orange-500/80 shadow-[0_0_25px_rgba(255,140,0,0.6),0_0_60px_rgba(255,120,0,0.25)]"
            />

            <div className="relative z-10 -translate-y-10 sm:-translate-y-20 flex justify-center items-center w-full max-w-[520px]">
              <Image
                src="/images/hero/photome.webp"
                alt="Portrait of Adam Maulana"
                width={520}
                height={620}
                className="object-contain max-h-[60vh] sm:max-h-[70vh] w-auto scale-105 drop-shadow-[0_0_60px_rgba(255,120,0,0.15)]"
              />
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6 z-20">
              <div className="relative flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-lg">
                    👤
                  </div>
                  <div>
                    <p className="text-2xl font-medium text-white">
                      <Counter target={3} suffix="+" />
                    </p>
                    <p className="text-sm text-gray-400">Years Experience</p>
                  </div>
                </div>

                <div className="w-full h-px bg-white/10 md:w-[1px] md:h-12 md:bg-white/10" />

                <div>
                  <p className="text-2xl font-medium text-white">
                    <Counter target={30} suffix="+" />
                  </p>
                  <p className="text-sm text-gray-400">Projects Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOOLS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 z-20">
        <p className="text-center text-[10px] tracking-[3px] text-gray-500 mb-6">
          TOOLS I USE
        </p>

        <div className="flex justify-center items-center gap-10 flex-wrap">
          {[
            "/images/tools/figma.svg",
            "/images/tools/photoshop.svg",
            "/images/tools/illustrator.svg",
            "/images/tools/corel.svg",
            "/images/tools/vscode.svg",
            "/images/tools/react.svg",
            "/images/tools/nextdotjs.svg",
            "/images/tools/tailwindcss.svg",
          ].map((src, i) => (
            <div key={i} className="group relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition blur-xl bg-orange-500/20 rounded-full" />
              <Image
                src={src}
                alt="tool"
                width={50}
                height={50}
                className="relative z-10 opacity-40 grayscale invert group-hover:opacity-100 group-hover:scale-110 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* FADE */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}