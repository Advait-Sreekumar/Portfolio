"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Ghost calligraphy watermark per chapter (aria-hidden, decorative) */
const KANJI: Record<string, string> = {
  experience: "経験",
  education: "学問",
  publications: "名誉",
  projects: "作品",
  skills: "技術",
  socials: "縁",
  contact: "絆",
};

function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span className="w" key={`${w}-${i}`} aria-hidden="true">
          <span style={{ "--wi": i } as React.CSSProperties}>{w}</span>
        </span>
      ))}
    </>
  );
}

interface SectionProps {
  id: string;
  numeral: string;
  title: string;
  lead?: string;
  children: ReactNode;
}

/**
 * Shared cinematic section shell — chapter seal, ghost kanji watermark,
 * masked word-by-word title reveal, staggered .rv* children.
 */
export default function Section({ id, numeral, title, lead, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            io.disconnect();
          }
        }
      },
      { threshold: 0.16 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id={id} className="section" ref={ref} aria-labelledby={`${id}-title`}>
      <span className="watermark" aria-hidden="true">
        {KANJI[id] ?? ""}
      </span>

      <div className="section-inner">
        <header className="section-head">
          <p className="section-numeral rv rv-1">
            <span className="numeral">
              <svg viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="21" pathLength="100" />
              </svg>
              <i>{numeral}</i>
            </span>
            <span className="numeral-rule" aria-hidden="true" />
            <span className="section-kicker">Chapter</span>
          </p>
          <h2 className="section-title rv rv-2" id={`${id}-title`}>
            <span className="sr-text">{title}</span>
            <SplitWords text={title} />
          </h2>
          {lead ? <p className="section-lead rv rv-3">{lead}</p> : null}
        </header>
        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}
