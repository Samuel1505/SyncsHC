"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  formatter?: (val: number) => string;
}

export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
  formatter,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    let startTime: number | null = null;
    let animationId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = eased * value;

      if (ref.current) {
        const formatted = formatter
          ? formatter(current)
          : current >= 1_000_000
          ? `${(current / 1_000_000).toFixed(2)}M`
          : current >= 1_000
          ? `${(current / 1_000).toFixed(1)}K`
          : Math.round(current).toLocaleString();
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(step);
      }
    };

    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [isInView, value, duration, prefix, suffix, formatter]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}
