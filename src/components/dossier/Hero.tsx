"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { experience } from "@/data/experience";
import { patentCount } from "@/data/publications";

/**
 * Dossier hero — the document draws itself in: ruled paper, name wipes,
 * vermilion seal stamps down, role types out on the mono line.
 */
export default function Hero() {
  const [ready, setReady] = useState(false);
  const [typed, setTyped] = useState("");
  const reduced = useTypedReady();
  const role = profile.role.toUpperCase();
  const current = experience.find((e) => e.current);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (reduced) {
      setTyped(role);
      return;
    }
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setTyped(role.slice(0, i));
      if (i >= role.length) window.clearInterval(t);
    }, 26);
    return () => window.clearInterval(t);
  }, [reduced, role]);

  return (
    <header className={`d-hero${ready ? " ready" : ""}`} id="dossier-top">
      <div className="d-hero-meta d-mono">
        <span>DOSSIER Nº AS-2026</span>
        <span>REV 2.1 — PAPER EDITION</span>
        <span>{new Date().getFullYear()}</span>
      </div>

      <h1 className="d-name" aria-label={profile.name}>
        <span className="d-name-line" aria-hidden="true">
          ADVAIT
        </span>
        <span className="d-name-line d-name-indent" aria-hidden="true">
          SREEKUMAR
        </span>
      </h1>

      {/* technical line-art, draws itself */}
      <svg
        className="d-hero-art"
        viewBox="0 0 520 520"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="260" cy="260" r="236" pathLength="100" />
        <circle cx="260" cy="260" r="168" pathLength="100" />
        <path d="M 24 260 L 496 260 M 260 24 L 260 496 M 92 92 L 428 428" pathLength="100" />
        <rect x="120" y="120" width="280" height="280" pathLength="100" />
      </svg>

      <div className="d-seal" aria-hidden="true">
        <span>AS</span>
      </div>

      <p className="d-typed d-mono" aria-label={profile.role}>
        {typed}
        {typed.length < role.length ? <span className="caret">▍</span> : null}
      </p>

      <dl className="d-meta">
        <div>
          <dt className="d-mono">Correspondence</dt>
          <dd>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </dd>
        </div>
        <div>
          <dt className="d-mono">Line</dt>
          <dd>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</a>
          </dd>
        </div>
        <div>
          <dt className="d-mono">Currently</dt>
          <dd>
            {current
              ? `${current.position} — ${current.company}`
              : profile.role}
          </dd>
        </div>
        <div>
          <dt className="d-mono">Papers</dt>
          <dd>{patentCount} Patents · 1 Publication · Hackathon Winner</dd>
        </div>
      </dl>

      <div className="d-scrollcue d-mono" aria-hidden="true">
        <span>SCROLL</span>
        <span className="d-scrollcue-line" />
        <span>PLATE 01 / 07</span>
      </div>
    </header>
  );
}

function useTypedReady(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}
