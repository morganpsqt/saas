"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  target: number;
  duration?: number;
  suffix?: string;
  format?: (n: number) => string;
}

export default function AnimatedCounter({ target, duration = 1400, suffix = "", format }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  const display = format ? format(val) : val.toLocaleString("fr-FR");
  return <span ref={ref}>{display}{suffix}</span>;
}
