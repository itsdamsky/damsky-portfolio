import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MouseLight from "@/components/MouseLight";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import PageLoader from "@/components/PageLoader";
import TopLoader from "@/components/TopLoader";
import PageWrapper from "@/components/PageWrapper";

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

// BUG FIX: `viewport` dan `colorScheme` sebelumnya ada di dalam `metadata`,
// tapi Next.js versi ini sudah memisahkannya ke export `viewport` sendiri.
// Naruh keduanya di `metadata` masih "jalan" tapi memicu warning di setiap
// build ("Unsupported metadata viewport/colorScheme is configured in
// metadata export ..."). Dipindah ke sini supaya buildnya bersih.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
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
      <head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body className="bg-black text-white relative">

        <TopLoader />
        <PageLoader />
        <SmoothScroll />

        <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.35] bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:60px_60px] hidden md:block" />

        <MouseLight />

        <div className="relative z-[10] flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-1">
            <PageWrapper>
              {children}
            </PageWrapper>
          </main>

          <Footer />
        </div>

      </body>
    </html>
  );
}
