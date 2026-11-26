"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { SECTIONS } from "@/lib/sections";
import { useActiveSection } from "@/lib/useActiveSection";
import { SectionIcon } from "@/components/Icons";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STEP = 360 / SECTIONS.length;
const ACTIVE_ANGLE = -90;
function nearestEquivalent(target: number, current: number) {
  return current + (((target - current) % 360 + 540) % 360 - 180);
}

export default function NavWheel() {
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const activeIndex = useActiveSection();
  const reduced = useReducedMotion();
  const shownIndex = preview ?? activeIndex;
  const discRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rotation = useRef(ACTIVE_ANGLE);
  const frozen = useRef<number | null>(null);

  useEffect(() => {
    const show = () => setReady(true);
    if (document.body.dataset.intro === "complete") show();
    window.addEventListener("kx:nav-ready", show);
    return () => window.removeEventListener("kx:nav-ready", show);
  }, []);

  useEffect(() => {
    const mq = matchMedia("(max-width: 1100px), (pointer: coarse)");
    const apply = () => { setIsMobile(mq.matches); setMobileOpen(false); };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    // Freeze page-driven wheel motion under the pointer; manual scrolling still works.
    if (expanded && frozen.current === null) frozen.current = activeIndex;
    if (!expanded) frozen.current = null;
    const index = preview ?? frozen.current ?? activeIndex;
    const target = nearestEquivalent(ACTIVE_ANGLE - index * STEP, rotation.current);
    let raf = 0, previous = 0;
    const frame = (now: number) => {
      const blend = reduced ? 1 : 1 - Math.exp(-(previous ? Math.min(64, now - previous) : 16.7) / 75);
      previous = now;
      rotation.current += (target - rotation.current) * blend;
      if (Math.abs(target - rotation.current) < 0.02) rotation.current = target;
      discRef.current?.style.setProperty("--rot", String(rotation.current));
      frameRef.current?.style.setProperty("--tick", String(rotation.current * 0.32));
      if (rotation.current !== target) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [activeIndex, preview, reduced, expanded, isMobile, ready]);

  useEffect(() => {
    if (!mobileOpen) return;
    const dialog = overlayRef.current;
    if (!dialog) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
      if (event.key !== "Tab") return;
      const buttons = Array.from(dialog.querySelectorAll<HTMLButtonElement>("button"));
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    dialog.querySelector<HTMLButtonElement>("button")?.focus();
    document.addEventListener("keydown", key);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", key);
      dockRef.current?.focus({ preventScroll: true });
    };
  }, [mobileOpen]);

  const goTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    // Restore the scrollbar and responsive layout before measuring the destination.
    flushSync(() => setMobileOpen(false));
    // Native scrolling replaces an in-flight scroll on rapid clicks; measure the target live.
    const offset = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset), behavior: reduced ? "auto" : "smooth" });
    history.replaceState(null, "", "#" + id);
  }, [reduced]);

  /* ── shared wheel markup ────────────────────────────────────── */
  const renderWheel = () => (
    <div className="nw-frame" ref={frameRef}>
      {/* counter-rotating tick ring — mechanical parallax against the dial */}
      <div className="nw-ticks" aria-hidden="true" />

      <svg className="nw-arcs" viewBox="0 0 760 760">
        <defs>
          <linearGradient id="nw-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3f45" />
            <stop offset="0.5" stopColor="#9aa3ad" stopOpacity="0.55" />
            <stop offset="1" stopColor="#23262b" />
          </linearGradient>
          <radialGradient id="nw-brassArc" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#e8c98a" />
            <stop offset="1" stopColor="#8a6a3e" />
          </radialGradient>
        </defs>
        <circle cx="380" cy="380" r="330" fill="none" stroke="url(#nw-metal)" strokeWidth="30" opacity="0.35" />
        <circle cx="380" cy="380" r="366" fill="none" stroke="#8a6a3e" strokeOpacity="0.4" strokeWidth="1.2" />
        <circle cx="380" cy="380" r="296" fill="none" stroke="#3a3f45" strokeOpacity="0.6" strokeWidth="1" />
      </svg>

      <div className="nw-disc" ref={discRef}>
        <svg className="nw-segments" viewBox="0 0 760 760">
          {SECTIONS.map((s, i) => {
            const startA = ((i * STEP + 3 - 90) * Math.PI) / 180;
            const endA = (((i + 1) * STEP - 3 - 90) * Math.PI) / 180;
            const R = 330;
            const x1 = 380 + R * Math.cos(startA);
            const y1 = 380 + R * Math.sin(startA);
            const x2 = 380 + R * Math.cos(endA);
            const y2 = 380 + R * Math.sin(endA);
            return (
              <path
                key={s.id}
                className={`nw-arc${i === shownIndex ? " is-active" : ""}`}
                d={`M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`}
                fill="none"
                stroke={i === shownIndex ? "url(#nw-brassArc)" : "url(#nw-metal)"}
              />
            );
          })}
        </svg>

        <div className="nw-hub" aria-hidden="true">
          <span>AS</span>
        </div>

        <ul className="nw-items">
          {SECTIONS.map((s, i) => {
            const angle = i * STEP;
            const isActive = i === shownIndex;
            const isCurrent = i === activeIndex;
            return (
              <li
                key={s.id}
                className="nw-item"
                style={{ "--ia": angle } as React.CSSProperties}
              >
                <button
                  type="button"
                  className={`nw-btn${isActive ? " is-active" : ""}`}
                  style={{ "--ia": angle } as React.CSSProperties}
                  aria-label={`${s.fullLabel}${isCurrent ? " (current section)" : ""}`}
                  aria-current={isCurrent ? "location" : undefined}
                  onClick={() => goTo(s.id)}
                  onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setPreview(i); }}
                >
                  <span className="nw-btn-icon">
                    <SectionIcon name={s.icon} size={22} />
                  </span>
                  <span className="nw-btn-label">{s.shortLabel}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="nw-notch" aria-hidden="true" />
    </div>
  );

  return (
    <>
      {isMobile ? (
        <nav
          className={`nav-wheel nav-wheel--dock${ready ? " is-ready" : ""}`}
          aria-label="Section navigation"
        >
          <button
            ref={dockRef}
            type="button"
            className="nw-dock"
            aria-label={`Open navigation — current section: ${SECTIONS[activeIndex].fullLabel}`}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <SectionIcon name={SECTIONS[activeIndex].icon} size={24} />
            <span className="nw-dock-ring" aria-hidden="true" />
          </button>
        </nav>
      ) : null}

      {isMobile && mobileOpen ? (
        <div
          className="nw-overlay"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Section navigation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div className="nw-mobile-menu">
            <div className="nw-menu-head"><p>Choose a chapter</p><button type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation">Close</button></div>
            <ul>{SECTIONS.map((section, index) => <li key={section.id}>
              <button type="button" aria-current={activeIndex === index ? "location" : undefined} onClick={() => goTo(section.id)}>
                <span className="nw-menu-seal">{section.numeral}</span><SectionIcon name={section.icon} size={20} /><span>{section.fullLabel}</span>
              </button>
            </li>)}</ul>
          </div>
        </div>
      ) : null}

      {!isMobile ? (
        <nav
          ref={navRef}
          className={[
            "nav-wheel",
            ready ? "is-ready" : "",
            expanded ? "is-expanded" : "",
          ].join(" ")}
          aria-label="Section navigation"
          onMouseEnter={() => setExpanded(true)}
          onMouseLeave={() => {
            setExpanded(false);
            setPreview(null);
          }}
          onFocus={() => setExpanded(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setExpanded(false);
              setPreview(null);
            }
          }}
        >
          {renderWheel()}
          <div className="nw-dial-controls">
            <button type="button" aria-label="Previous navigation item" onClick={() => setPreview(((preview ?? activeIndex) - 1 + SECTIONS.length) % SECTIONS.length)}>Prev</button>
            <button type="button" aria-label="Next navigation item" onClick={() => setPreview(((preview ?? activeIndex) + 1) % SECTIONS.length)}>Next</button>
          </div>
        </nav>
      ) : null}
    </>
  );
}
