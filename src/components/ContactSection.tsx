"use client";

import { useRef, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("loading");
    try {
      // emailjs was previously imported at the top of the file, which
      // means Next.js bundles it into this route's JS and the browser has
      // to download + parse it before the Contact page can even finish
      // rendering — that's the "lag" felt right when navigating here.
      // Importing it on demand (only when the form is submitted) keeps it
      // out of the page's initial load entirely.
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.sendForm(
        "service_vj9ul05",
        "ry8ljde",
        formRef.current,
        "vlVvVpOKfJjuhwdyO"
      );
      setStatus("success");
      formRef.current.reset();
    } catch {
      setStatus("error");
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "adammaulana.design@gmail.com",
      href: "mailto:adammaulana.design@gmail.com",
    },
    {
      icon: <Phone size={18} />,
      label: "WhatsApp",
      value: "+62 812 9949 1922",
      href: "https://wa.me/6281299491922",
    },
    {
      icon: <MapPin size={18} />,
      label: "Location",
      value: "Parungpanjang, Bogor, Indonesia",
      href: null,
    },
  ];

  const socials = [
    {
        label: "GitHub",
        href: "https://github.com/itsdamsky",
        icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/adammaulana-dev",
        icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://instagram.com",
        icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
        ),
    },
    ];

  return (
    <section className="relative min-h-screen py-26 overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[3px] text-orange-500 mb-3">GET IN TOUCH</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            Let&apos;s work <span className="text-orange-500">together.</span>
          </h1>
          <p className="text-neutral-400 max-w-xl">
            Have a project in mind or just want to say hi? Fill out the form or reach out directly — I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Kiri - Info kontak */}
          <div className="flex flex-col gap-6">
            {/* Contact cards */}
            {contactInfo.map((info, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:border-orange-500/40 transition-all duration-300">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">{info.label}</p>
                  {info.href ? (
                    <a href={info.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-orange-500 transition">
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm text-white">{info.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social media */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <p className="text-xs text-neutral-500 mb-4">FOLLOW ME</p>
              <div className="flex items-center gap-3">
                {socials.map((social, i) => (
                <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-orange-500/40 transition-all duration-300"
                >
                    {social.icon}
                </a>
                ))}
              </div>
            </div>

            {/* Available badge */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm text-white">Available for freelance projects</p>
            </div>
          </div>

          {/* Kanan - Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Your Name</label>
                <input
                  type="text"
                  name="from_name"
                  required
                  placeholder="John Doe"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Email Address</label>
                <input
                  type="email"
                  name="from_email"
                  required
                  placeholder="john@example.com"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Project collaboration"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-all duration-300"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 transition-all duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-3 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {status === "loading" ? "Sending..." : "Send Message →"}
              </button>

              {status === "success" && (
                <p className="text-green-500 text-sm text-center">
                  ✓ Message sent! I&apos;ll get back to you soon.
                </p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-sm text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
