"use client";

import { useEffect, useRef } from "react";

/** Precise SVG pointer; only its blade animates, never the pointer position. */
export default function CursorWisp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cursor = ref.current;
    if (!cursor) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let x = 0;
    let y = 0;
    let target: Element | null = null;
    const hide = () => {
      cursor.classList.remove("is-visible");
      document.documentElement.classList.remove("katana-cursor-active");
    };
    const render = () => {
      raf = 0;
      if (!fine.matches || reduced.matches || document.hidden) { hide(); return; }
      // Recheck after scrolling and layout shifts, including under a stationary pointer.
      target = document.elementFromPoint(x, y);
      const editing = target?.closest('input, textarea, [contenteditable="true"], [data-native-cursor]');
      if (editing) { hide(); return; }
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      cursor.classList.toggle("is-drawn", !!target?.closest('a[href], button:not(:disabled), [role="button"], summary, [data-cursor="pointer"]'));
      cursor.classList.add("is-visible");
      document.documentElement.classList.add("katana-cursor-active");
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") { hide(); return; }
      x = event.clientX; y = event.clientY;
      schedule();
    };
    const leave = () => { cancelAnimationFrame(raf); raf = 0; hide(); };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", schedule, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("blur", leave);
    fine.addEventListener("change", leave);
    reduced.addEventListener("change", leave);
    return () => {
      leave();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", schedule);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("blur", leave);
      fine.removeEventListener("change", leave);
      reduced.removeEventListener("change", leave);
    };
  }, []);

  return (
    <div className="katana-cursor" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 64 64" width="42" height="42">
        <g transform="rotate(-42 30 32)">
          <g className="cursor-sword">
            <path d="M11 30H43V34H11L7 32Z" fill="#dce2e7" stroke="#626b74" strokeWidth=".7" />
            <rect x="43" y="28" width="2.5" height="8" rx="1" fill="#e8c98a" />
            <path d="M46 30H59V34H46Z" fill="#261114" stroke="#8a6a3e" strokeWidth=".7" />
            <path d="m48 30 4 4m1-4 4 4m-9 0 4-4m1 4 4-4" stroke="#b2a18c" strokeWidth=".75" />
            <path d="M59 30V34" stroke="#e8c98a" strokeWidth="2" />
          </g>
          <path d="M6 29.5H42V34.5H6Q2 32 6 29.5Z" fill="#101215" stroke="#8a6a3e" strokeWidth="1" />
          <path d="M40 29.5V34.5" stroke="#e8c98a" strokeWidth="2" />
          <path d="M8 31H37" stroke="#9aa3ad" strokeOpacity=".25" strokeWidth=".6" />
        </g>
        <circle cx="1.5" cy="1.5" r="1.2" fill="#e8c98a" />
      </svg>
    </div>
  );
}
