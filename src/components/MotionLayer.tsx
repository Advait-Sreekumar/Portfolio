"use client";

import { useEffect } from "react";

/**
 * Scroll-velocity inertia: leans section content against scroll speed,
 * giving the whole page physical weight. Compositor-only (one custom
 * property, transforms downstream). Disabled for reduced motion.
 */
export default function MotionLayer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;

    let last = window.scrollY;
    let vel = 0;
    let raf = 0;
    let engaged = false;

    const loop = () => {
      const y = window.scrollY;
      const d = y - last;
      last = y;
      vel += (d - vel) * 0.1;

      const skew = Math.max(-1.3, Math.min(1.3, -vel * 0.05));
      if (Math.abs(skew) > 0.04) {
        root.style.setProperty("--skew", `${skew.toFixed(3)}deg`);
        engaged = true;
      } else if (engaged) {
        root.style.setProperty("--skew", "0deg");
        engaged = false;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
