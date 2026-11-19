"use client";

import { useEffect, useRef } from "react";
import Section from "@/components/Section";
import { SocialIcon } from "@/components/Icons";
import Magnetic from "@/components/Magnetic";
import { projects, type Project } from "@/data/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Scroll-driven cinematic entrance:
 * each card tracks its own viewport progress and drives CSS custom
 * properties (--e eased entrance, --d deep parallax). A single rAF
 * loop runs only while the section is near the viewport.
 */
export default function ProjectsSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduced) return;
    const cards = Array.from(wrap.querySelectorAll<HTMLElement>(".proj-card"));
    if (!cards.length) return;

    let raf = 0;
    let active = false;
    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -vh * 0.3 || rect.top > vh * 1.4) continue;

        // entrance progress (card rising into place)
        const eRaw = clamp01((vh * 0.96 - rect.top) / (vh * 0.82));
        const e = easeOutCubic(eRaw);
        // deep drift progress (keeps layers moving after entrance)
        const d = clamp01((vh - rect.top) / (vh * 1.9));

        el.style.setProperty("--e", e.toFixed(4));
        el.style.setProperty("--d", d.toFixed(4));
      }
    };

    const onScroll = () => {
      if (ticking || !active) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        active = entries.some((en) => en.isIntersecting);
        if (active && !ticking) {
          ticking = true;
          raf = requestAnimationFrame(update);
        }
      },
      { rootMargin: "30% 0px 30% 0px" },
    );
    io.observe(wrap);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <Section
      id="projects"
      numeral="IV"
      title="Projects"
      lead="Instruments built to be used."
    >
      <div className="proj-stack" ref={wrapRef}>
        {projects.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  const reversed = index % 2 === 1;
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  /* 3D tilt toward the cursor (desktop, fine pointers) */
  const onMediaMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const el = mediaRef.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", `${(x * 9).toFixed(2)}deg`);
    el.style.setProperty("--my", `${(y * -8).toFixed(2)}deg`);
  };

  const onMediaLeave = () => {
    const el = mediaRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "0deg");
    el.style.setProperty("--my", "0deg");
  };

  return (
    <article className={`proj-slot${reversed ? " is-reversed" : ""}`}>
      <div className="proj-card">
        <span className="proj-ghost" aria-hidden="true">
          {num}
        </span>

        <div
          className="proj-media"
          aria-hidden="true"
          ref={mediaRef}
          onMouseMove={onMediaMove}
          onMouseLeave={onMediaLeave}
        >
          <div className="proj-media-inner">
            <span className="proj-sigil">{project.name[0]}</span>
            <span className="proj-media-line" />
          </div>
          <div className="proj-scan" />
        </div>

        <div className="proj-content">
          <p className="proj-kicker">
            Project <span>{num}</span> — {project.tagline}
          </p>
          <h3 className="proj-name">{project.name}</h3>
          <p className="proj-desc">{project.description}</p>

          {project.highlights.length > 0 ? (
            <ul className="proj-highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          ) : null}

          {project.stack.length > 0 ? (
            <ul className="proj-stack-chips" aria-label="Technology stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          ) : null}

          {(project.github || project.live) && (
            <div className="proj-links">
              {project.github ? (
                <Magnetic strength={10}>
                  <a
                    className="btn btn-ghost"
                    href={project.github}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <SocialIcon name="github" size={16} />
                    GitHub
                  </a>
                </Magnetic>
              ) : null}
              {project.live ? (
                <Magnetic strength={10}>
                  <a
                    className="btn btn-solid"
                    href={project.live}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Live
                    <SocialIcon name="external" size={15} />
                  </a>
                </Magnetic>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
