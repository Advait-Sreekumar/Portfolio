"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/lib/sections";
import { useActiveSection } from "@/lib/useActiveSection";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Drafting-table crosshair — hairline rules chase the cursor across the
 * whole viewport with a live coordinate readout and current-plate label.
 * Desktop fine pointers only.
 */
export default function Crosshair() {
  const vRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const active = useActiveSection();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    setEnabled(true);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const loop = () => {
      x += (tx - x) * 0.3;
      y += (ty - y) * 0.3;
      if (vRef.current) vRef.current.style.transform = `translateX(${x.toFixed(1)}px)`;
      if (hRef.current) hRef.current.style.transform = `translateY(${y.toFixed(1)}px)`;
      if (readoutRef.current) {
        readoutRef.current.textContent =
          `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(
            Math.round(y),
          ).padStart(4, "0")}`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="d-cross" aria-hidden="true">
      <div className="d-cross-v" ref={vRef} />
      <div className="d-cross-h" ref={hRef} />
      <div className="d-cross-read">
        <span ref={readoutRef}>
          X 0000 · Y 0000
        </span>
        <span className="d-cross-plate">
          PLATE {String(active + 1).padStart(2, "0")} —{" "}
          {SECTIONS[active].shortLabel.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
