"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Scroll inertia settles and parks; touch and reduced-motion views stay still. */
export default function MotionLayer() {
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = document.documentElement;
    if (reduced || matchMedia("(pointer: coarse)").matches) { root.style.removeProperty("--skew"); return; }
    let last = window.scrollY, velocity = 0, raf = 0;
    const frame = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      velocity += (delta - velocity) * .2;
      const skew = Math.max(-1.3, Math.min(1.3, -velocity * .05));
      root.style.setProperty("--skew", Math.abs(skew) > .04 ? `${skew.toFixed(3)}deg` : "0deg");
      if (Math.abs(velocity) > .1 || delta !== 0) raf = requestAnimationFrame(frame);
      else raf = 0;
    };
    const start = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(frame); };
    window.addEventListener("scroll", start, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", start); root.style.removeProperty("--skew"); };
  }, [reduced]);
  return null;
}
