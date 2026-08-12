"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./arcade.module.css";

/** Fades + lifts its children into view the first time they intersect. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.in);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${styles.reveal} ${className ?? ""}`}>
      {children}
    </div>
  );
}
