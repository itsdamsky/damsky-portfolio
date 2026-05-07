"use client";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
      <nav className="container-custom h-[70px] flex items-center justify-between">
        
        {/* LEFT - LOGO */}
        <button
            onClick={() => {
              document
                .getElementById("home")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-1 cursor-pointer will-change-transform hover:shadow-[0_0_40px_rgba(255,115,0,0.25"
          >

            <img
              src="/images/navbar/Logo-A.svg"
              alt="Logo"
              className="h-10 w-auto"
            />

            <p className="text-white font-semibold text-md">
              Maulana
            </p>

          </button>

        {/* CENTER MENU */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10 text-sm">
          
          <a href="#" className="text-orange-500 relative">
            Home
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full"></span>
          </a>

          <a href="#" className="text-neutral-400 hover:text-white transition">
            About
          </a>

          <a href="#" className="text-neutral-400 hover:text-white transition">
            Projects
          </a>

          <a href="#" className="text-neutral-400 hover:text-white transition">
            Skills
          </a>

          <a href="#" className="text-neutral-400 hover:text-white transition">
            Contact
          </a>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">
          
          <button className="text-sm text-white flex items-center gap-1">
            Let's Talk <span className="text-orange-500">↗</span>
          </button>

          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
            ☀️
          </div>

        </div>

      </nav>
    </header>
  );
}