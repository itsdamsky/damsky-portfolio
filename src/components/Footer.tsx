"use client";

export default function Footer() {
  return (
    <footer className="relative mt-2 overflow-hidden border-t border-white/5">

      {/* 🔥 CTA */}
      <div className="relative pt-24 pb-20 text-center overflow-hidden">

        {/* 🔥 SUNRISE GLOW */}
        <div className="absolute bottom-[-170px] left-1/2 -translate-x-1/2 w-[1000px] h-[190px] bg-[radial-gradient(ellipse_at_center,rgba(255,120,0,0.65)_60%,rgba(255,120,0,0.3)_65%,rgba(255,120,0,0.1)_85%,transparent_100%)] blur-[60px] pointer-events-none" />

        <p className="relative z-[2] text-[11px] tracking-[4px] text-orange-600 mb-6">
          LET’S WORK TOGETHER
        </p>

        <h2 className="relative z-[2] text-[44px] md:text-[64px] font-medium leading-[1.2] text-white">
          Let’s build something <br />
          great{" "}
          <span className="text-orange-600">together.</span>
        </h2>

        <button className="relative z-[2] mt-10 px-7 py-3 rounded-xl border border-orange-500/40 bg-black/40 backdrop-blur-md hover:bg-orange-500/10 transition cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25">
          Get in touch <span className="text-orange-500 ml-1">↗</span>
        </button>
      </div>

      {/* 🔥 SMOOTH LIGHT LINE */}
      <div className="relative w-full h-[2px]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,120,0,0.15)_20%,rgba(255,120,0,0.4)_35%,rgba(255,140,0,0.9)_50%,rgba(255,120,0,0.4)_65%,rgba(255,120,0,0.15)_80%,transparent_100%)] blur-[2px]" />
      </div>

      {/* 🔥 MAIN FOOTER */}
      <div className="pt-10 pb-10 bg-black">

        <div className="container-custom grid md:grid-cols-4 gap-[80px]">

          {/* LEFT */}
          <div>
            <a href="/">
            <img
              src="/images/navbar/logo-A.svg"
              alt="Adam Logo"
              className="h-8 w-auto mb-6"
            />
          </a>

            <p className="text-white mb-2 text-[15px]">
              Adam Maulana
            </p>

            <p className="text-gray-400 text-sm mb-6">
              Graphic Designer & Web Developer
            </p>

            <p className="text-gray-500 text-sm leading-relaxed max-w-[260px]">
              I design and build digital experiences that are clean,
              functional and user-focused.
            </p>
          </div>

          {/* LINKS */}
          <div>
            <p className="text-orange-500 text-xs tracking-[3px] mb-6">
              LINKS
            </p>

            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <a href="#">Home</a>
              <a href="#">About</a>
              <a href="#">Projects</a>
              <a href="#">Skills</a>
              <a href="#">Contact</a>
            </div>
          </div>

          {/* SERVICES */}
          <div>
            <p className="text-orange-500 text-xs tracking-[3px] mb-6">
              SERVICES
            </p>

            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <p>UI/UX Design</p>
              <p>Web Design</p>
              <p>Web Development</p>
              <p>Branding</p>
              <p>Illustration</p>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <p className="text-orange-500 text-xs tracking-[3px] mb-6">
              CONTACT
            </p>

            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <p>adammaulana.design@gmail.com</p>
              <p>+62 812 9949 1922</p>
              <p>Indonesia, ID</p>

              <div className="mt-6">
                <p className="text-orange-500 text-xs tracking-[3px] mb-4">
                  FOLLOW ME
                </p>

                <div className="flex gap-5">

                  <a 
                    href="https://www.instagram.com/amaulana.09?igsh=MWN0dnl2bmxxM3BpMg%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/images/footer/ig.svg"
                      alt="Instagram"
                      className="w-5 h-5 brightness-0 invert opacity-70 hover:opacity-100 transition"
                    />
                  </a>

                  <a href="#">
                    <img
                      src="/images/footer/dribbble.svg"
                      alt="Dribbble"
                      className="w-5 h-5 brightness-0 invert opacity-70 hover:opacity-100 transition"
                    />
                  </a>

                  <a href="#">
                    <img
                      src="/images/footer/linkedin.svg"
                      alt="LinkedIn"
                      className="w-5 h-5 brightness-0 invert opacity-70 hover:opacity-100 transition"
                    />
                  </a>

                  <a href="#">
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

      {/* 🔥 DIVIDER */}
      <div className="border-t border-white/10 mx-12 bg-black pt-5"/>

      {/* 🔥 BOTTOM */}
      <div className="bg-black pb-5">

        <div className="container-custom py-6 flex items-center justify-center text-xs text-gray-500">

          <p>
            © 2026 Adam Maulana. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}