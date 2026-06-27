"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the page is already loaded (client-side navigation)
    if (document.readyState === "complete") {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    const handleLoad = () => {
      setLoading(false);
    };

    window.addEventListener("load", handleLoad);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black transition-opacity duration-500 pointer-events-none ${
        loading
          ? "opacity-100"
          : "opacity-0"
      }`}
      style={{
        transitionProperty: "opacity",
        transitionDuration: "500ms",
      }}
    />
  );
}