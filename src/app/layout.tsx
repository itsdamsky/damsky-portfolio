import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MouseLight from "@/components/MouseLight";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import PageLoader from "@/components/PageLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adam Maulana — Portfolio",
  description: "Personal portfolio website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-black text-white relative">

        <PageLoader />

        <SmoothScroll />

        {/* GRID */}
        <div
          className="fixed inset-0 z-[1] pointer-events-none opacity-[0.35] bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:60px_60px]"
        />

        {/* MOUSE LIGHT */}
        <MouseLight />

        {/* CONTENT */}
        <div className="relative z-[10] flex flex-col min-h-screen">

          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </div>

      </body>
    </html>
  );
}