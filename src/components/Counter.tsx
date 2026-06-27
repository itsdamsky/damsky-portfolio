"use client";

import { useEffect, useState, useMemo } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
}

export default function Counter({
  target,
  suffix = "",
}: CounterProps) {

  const [count, setCount] = useState(0);
  const animationDuration = useMemo(() => {
    if (typeof window === 'undefined') return 1500;
    return window.matchMedia("(max-width: 768px)").matches ? 800 : 1500;
  }, []);

  useEffect(() => {

    let start = 0;
    const duration = animationDuration;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {

      start += increment;

      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }

    }, 16);

    return () => clearInterval(timer);

  }, [target, animationDuration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}