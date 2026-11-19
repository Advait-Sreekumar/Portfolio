"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/sections";

/** Shared active-chapter tracker (IntersectionObserver, mid-viewport band). */
export function useActiveSection(): number {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = SECTIONS.findIndex((s) => s.id === e.target.id);
          if (i > -1) setIdx(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  return idx;
}
