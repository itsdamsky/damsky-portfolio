"use client";

import { useEffect, useState } from "react";

interface CounterProps {
  target: number;
  suffix?: string;
}

export default function Counter({
  target,
  suffix = "",
}: CounterProps) {

  const [count, setCount] = useState(0);

  useEffect(() => {

    let start = 0;

    const duration = 1500;
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

  }, [target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}