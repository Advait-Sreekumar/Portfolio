"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/lib/sections";
import { SectionIcon } from "@/components/Icons";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STEP = 360 / SECTIONS.length;
/** the wheel slot that faces into the viewport (9 o'clock) */
const ACTIVE_ANGLE = -90;
/** ms between accepted wheel ticks over the dial */
const TICK_COOLDOWN = 190;

function nearestEquivalent(target: number, current: number): number {
  const d = (((target - current) % 360) + 540) % 360 - 180;
  return current + d;
}

/**
 * Mechanical circular navigation wheel.
 *
 * Idle: rotation is driven by page scroll — the section on screen is the
 * source of truth. Hovered/expanded: scrolling OVER the dial rotates it
 * one segment per tick (page does not move — wheel events are captured);
 * clicking a segment commits navigation. Leaving the dial never resets
 * its logical position; it simply returns to mirroring the page.
 */
export default function NavWheel() {
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  /** which segment the user has dialled to while hovering (null = idle) */
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const discRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const rot = useRef({ target: ACTIVE_ANGLE, current: ACTIVE_ANGLE, raf: 0 });
  const centers = useRef<number[]>([]);
  const lastProgress = useRef(0);
  const hoverRef = useRef<number | null>(null);
  const activeRef = useRef(0);
  const reduced = useReducedMotion();

  hoverRef.current = hoverIndex;
  activeRef.current = activeIndex;

  /* ── measure section centers ────────────────────────────────── */
  const measure = useCallback(() => {
    centers.current = SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY + rect.height / 2;
    });
  }, []);

  /* ── page position → continuous progress ───────────────────── */
  const updateFromScroll = useCallback(() => {
    if (!centers.current.length) return;
    const anchor = window.scrollY + window.innerHeight * 0.45;
    const c = centers.current;
    let p: number;

    if (anchor <= c[0]) p = 0;
    else if (anchor >= c[c.length - 1]) p = c.length - 1;
    else {
      let i = 0;
      while (i < c.length - 2 && anchor >= c[i + 1]) i++;
      p = i + (anchor - c[i]) / (c[i + 1] - c[i]);
    }

    lastProgress.current = p;
    if (hoverRef.current === null) {
      rot.current.target = nearestEquivalent(ACTIVE_ANGLE - p * STEP, rot.current.current);
    }

    const idx = Math.max(0, Math.min(SECTIONS.length - 1, Math.round(p)));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  }, []);

  /* ── interpolation loop (runs only while settling) ──────────── */
  const tick = useCallback(() => {
    const r = rot.current;
    const diff = r.target - r.current;
    if (Math.abs(diff) < 0.02) {
      r.current = r.target;
    } else {
      r.current += diff * (reduced ? 1 : 0.11);
      r.raf = requestAnimationFrame(tick);
    }
    discRef.current?.style.setProperty("--rot", r.current.toFixed(3));
    // tick ring counter-rotates at a fraction of the dial speed — mechanical parallax
    frameRef.current?.style.setProperty(
      "--tick",
      (r.current * 0.32).toFixed(3),
    );
  }, [reduced]);

  const kickLoop = useCallback(() => {
    cancelAnimationFrame(rot.current.raf);
    rot.current.raf = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    const onSettled = () => {
      measure();
      updateFromScroll();
      kickLoop();
    };

    measure();
    updateFromScroll();
    discRef.current?.style.setProperty("--rot", rot.current.current.toFixed(3));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateFromScroll();
        // while dialling we keep the page-driven target frozen
        if (hoverRef.current === null && Math.abs(rot.current.target - rot.current.current) > 0.05)
          kickLoop();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onSettled);
    window.addEventListener("load", onSettled);
    const t = window.setTimeout(onSettled, 1200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onSettled);
      window.removeEventListener("load", onSettled);
      clearTimeout(t);
      cancelAnimationFrame(rot.current.raf);
    };
  }, [measure, updateFromScroll, kickLoop]);

  /* ── dialling: rotate target follows hover selection ────────── */
  useEffect(() => {
    if (hoverIndex === null) {
      rot.current.target = nearestEquivalent(
        ACTIVE_ANGLE - lastProgress.current * STEP,
        rot.current.current,
      );
    } else {
      rot.current.target = nearestEquivalent(
        ACTIVE_ANGLE - hoverIndex * STEP,
        rot.current.current,
      );
    }
    kickLoop();
  }, [hoverIndex, activeIndex, kickLoop]);

  /* ── scroll-over-the-wheel rotates the dial, not the page ───── */
  useEffect(() => {
    if (isMobile || !ready) return;
    const el = navRef.current;
    if (!el) return;
    let cooling = false;

    const onWheelEvt = (e: WheelEvent) => {
      e.preventDefault(); // page must not move while dialling
      if (cooling) return;
      cooling = true;
      window.setTimeout(() => {
        cooling = false;
      }, TICK_COOLDOWN);
      const dir = e.deltaY > 0 ? 1 : -1;
      setHoverIndex((prev) => {
        const base = prev === null ? activeRef.current : prev;
        return (base + dir + SECTIONS.length) % SECTIONS.length;
      });
    };

    el.addEventListener("wheel", onWheelEvt, { passive: false });
    return () => el.removeEventListener("wheel", onWheelEvt);
  }, [isMobile, ready]);

  /* ── appear after the katana intro (with a mechanical spin-up) ── */
  useEffect(() => {
    const show = () => {
      if (!ready) {
        rot.current.current -= 260; // one dramatic sweep into position
        kickLoop();
      }
      setReady(true);
    };
    window.addEventListener("kx:nav-ready", show, { once: true });
    const t = window.setTimeout(() => {
      const s = document.body.dataset.intro;
      if (s === "complete" || s === "nav") show();
    }, 600);
    return () => {
      window.removeEventListener("kx:nav-ready", show);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── responsive mode ────────────────────────────────────────── */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* ── mobile overlay focus & escape handling ─────────────────── */
  const overlayRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    overlayRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      dockRef.current?.focus();
    };
  }, [mobileOpen]);

  /* ── navigation ─────────────────────────────────────────────── */
  const goTo = useCallback(
    (id: string, index: number) => {
      const el = document.getElementById(id);
      if (!el) return;
      setActiveIndex(index);
      setHoverIndex(index); // stays consistent until the mouse leaves
      if (isMobile) setMobileOpen(false);
      el.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [isMobile, reduced],
  );

  const shownIndex = hoverIndex ?? activeIndex;

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
                  onClick={() => goTo(s.id, i)}
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
          {renderWheel()}
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
            setHoverIndex(null); // expansion only — page truth resumes
          }}
          onFocus={() => setExpanded(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setExpanded(false);
              setHoverIndex(null);
            }
          }}
        >
          {renderWheel()}
        </nav>
      ) : null}
    </>
  );
}
