"use client";

import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Magnetic wrapper — the child gravitates a few pixels toward the cursor.
 * Desktop fine pointers only; inert for reduced motion / touch.
 */
export default function Magnetic({
  children,
  strength = 12,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    target.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(
      dy * strength * 0.7
    ).toFixed(1)}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    const target = el?.firstElementChild as HTMLElement | null;
    if (target) target.style.transform = "";
  };

  return (
    <span ref={ref} className="magnet" onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </span>
  );
}
