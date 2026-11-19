"use client";

import { SECTIONS } from "@/lib/sections";
import { useActiveSection } from "@/lib/useActiveSection";
import { useReducedMotion } from "@/lib/useReducedMotion";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
}

/** Desktop dossier spine — fixed left rail with chapter index. */
export function RailNav() {
  const active = useActiveSection();
  const reduced = useReducedMotion();

  return (
    <nav className="d-rail" aria-label="Chapter navigation">
      <span className="d-rail-code" aria-hidden="true">
        AS—2026
      </span>
      <ol className="d-rail-index">
        {SECTIONS.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={`d-rail-dot${i === active ? " is-active" : ""}`}
              aria-label={`Plate ${String(i + 1).padStart(2, "0")} — ${s.fullLabel}`}
              aria-current={i === active ? "location" : undefined}
              onClick={() => scrollTo(s.id)}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          </li>
        ))}
      </ol>
      <span className="d-rail-current" aria-hidden="true" data-text={SECTIONS[active].shortLabel.toUpperCase()}>
        {reduced ? null : SECTIONS[active].shortLabel.toUpperCase()}
      </span>
    </nav>
  );
}

/** Mobile chapter bar — sticky top with prev/next stepping. */
export function ChapterBar() {
  const active = useActiveSection();

  return (
    <div className="d-bar" role="navigation" aria-label="Chapter navigation">
      <button
        type="button"
        className="d-bar-btn"
        aria-label="Previous chapter"
        disabled={active === 0}
        onClick={() => scrollTo(SECTIONS[active - 1].id)}
      >
        ‹
      </button>
      <span className="d-bar-label d-mono">
        {String(active + 1).padStart(2, "0")} / 07 —{" "}
        {SECTIONS[active].fullLabel.toUpperCase()}
      </span>
      <button
        type="button"
        className="d-bar-btn"
        aria-label="Next chapter"
        disabled={active === SECTIONS.length - 1}
        onClick={() => scrollTo(SECTIONS[active + 1].id)}
      >
        ›
      </button>
    </div>
  );
}
