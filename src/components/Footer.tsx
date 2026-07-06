"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  // Transparan (grid overlay dari layout.tsx kelihatan tembus) khusus di
  // Beranda, seperti sebelumnya sebelum di-fix. Solid (bg-black) di
  // halaman lain supaya gak ada garis grid yang nembus di sana.
  const isHome = pathname === "/";

  return (
    <footer className="will-change-transform relative overflow-hidden">
      <div className={`relative pt-20 pb-16 text-center overflow-hidden ${isHome ? "" : "bg-black"}`}>
        <div className="absolute bottom-[-170px] left-1/2 -translate-x-1/2 w-[1000px] h-[190px] bg-[radial-gradient(ellipse_at_center,rgba(255,95,0,0.95)_60%,rgba(255,95,0,0.55)_65%,rgba(255,95,0,0.20)_85%,transparent_100%)] blur-[60px] pointer-events-none" />

        <p className="relative z-[2] text-[11px] tracking-[4px] text-orange-600 mb-6">
          LET’S WORK TOGETHER
        </p>

        <h2 className="relative z-[2] text-4xl sm:text-5xl md:text-[64px] font-medium leading-[1.2] text-white">
          Let’s build something <br />
          great <span className="text-orange-600">together.</span>
        </h2>

        <a
          href="https://wa.me/6281299491922?text=Halo%20Adam%2C%20saya%20melihat%20portfolio%20kamu%20dan%20tertarik%20untuk%20bekerja%20sama!"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-[2] mt-10 inline-flex items-center justify-center px-7 py-3 rounded-xl border border-orange-500/40 bg-black/40 backdrop-blur-md hover:bg-orange-500/10 transition cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25)]"
        >
          Get in touch
        </a>
      </div>

      <div className="relative w-full h-[2px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,120,0,0.15)_20%,rgba(255,120,0,0.4)_35%,rgba(255,140,0,0.9)_50%,rgba(255,120,0,0.4)_65%,rgba(255,120,0,0.15)_80%,transparent_100%)] blur-[2px]" />
      </div>

      <div className="pt-10 pb-10 bg-black">
        <div className="container-custom grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <Image
                src="/images/navbar/Logo-A.svg"
                alt="Adam Maulana logo"
                width={32}
                height={32}
                className="h-8 w-8 mb-6"
              />
            </Link>

            <p className="text-white mb-2 text-[15px]">Adam Maulana</p>
            <p className="text-gray-400 text-sm mb-6">Frontend Developer & Graphic Designer</p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[320px]">
              Building brand-driven, responsive web experiences — from Figma to production code.
            </p>
          </div>

          <div>
            <p className="text-orange-500 text-xs tracking-[3px] mb-6">LINKS</p>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <a href="/" className="w-fit hover:text-orange-500 hover:pl-2 transition-all duration-300 ease-in-out">Home</a>
              <a href="/about" className="w-fit hover:text-orange-500 hover:pl-2 transition-all duration-300 ease-in-out">About</a>
              <a href="/projects" className="w-fit hover:text-orange-500 hover:pl-2 transition-all duration-300 ease-in-out">Projects</a>
              <a href="/skills" className="w-fit hover:text-orange-500 hover:pl-2 transition-all duration-300 ease-in-out">Skills</a>
              <a href="/contact" className="w-fit hover:text-orange-500 hover:pl-2 transition-all duration-300 ease-in-out">Contact</a>
            </div>
          </div>

          <div>
            <p className="text-orange-500 text-xs tracking-[3px] mb-6">SERVICES</p>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <p>UI/UX Design</p>
              <p>Web Design</p>
              <p>Web Development</p>
              <p>Branding</p>
              <p>Illustration</p>
            </div>
          </div>

          <div>
            <p className="text-orange-500 text-xs tracking-[3px] mb-6">CONTACT</p>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <p>adammaulana.design@gmail.com</p>
              <p>+62 812 9949 1922</p>
              <p>Indonesia, ID</p>

              <div className="mt-6">
                <p className="text-orange-500 text-xs tracking-[3px] mb-4">FOLLOW ME</p>
                <div className="flex gap-5 flex-wrap">
                  <a
                    href="https://www.instagram.com/amaulana.09"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/images/footer/ig.svg"
                      alt="Instagram"
                      width={20}
                      height={20}
                      className="brightness-0 invert opacity-70 hover:opacity-100 transition"
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/adammaulana-dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/footer/linkedin.svg"
                      alt="LinkedIn"
                      className="w-5 h-5 brightness-0 invert opacity-70 hover:opacity-100 transition"
                    />
                  </a>
                  <a
                    href="https://github.com/itsdamsky"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/footer/github.svg"
                      alt="GitHub"
                      className="w-5 h-5 opacity-70 hover:opacity-100 hover:scale-110 transition"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black pt-2">
        <div className="container-custom py-6 flex items-center justify-center text-xs text-gray-500">
          <p>© 2026 Adam Maulana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
