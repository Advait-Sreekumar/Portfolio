"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/sections";

/** Read live bounds once per animation frame; no stale centers after fonts/assets load. */
export function useActiveSection(): number {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const anchor = window.innerHeight * 0.3;
      let next = 0;
      SECTIONS.forEach((section, i) => {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= anchor) next = i;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) next = SECTIONS.length - 1;
      setIndex((current) => current === next ? current : next);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return index;
}
