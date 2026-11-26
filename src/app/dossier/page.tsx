import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/dossier/Hero";
import Crosshair from "@/components/dossier/Crosshair";
import ContactForm from "@/components/dossier/ContactForm";
import Reveal from "@/components/dossier/Reveal";
import { RailNav, ChapterBar } from "@/components/dossier/RailNav";
import { SECTIONS } from "@/lib/sections";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { publications, awards } from "@/data/publications";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { certifications } from "@/data/certifications";
import { socials } from "@/data/socials";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Advait Sreekumar — Dossier Edition",
};

const pad = (n: number) => String(n).padStart(2, "0");

function PlateHeader({
  no,
  title,
  meta,
}: {
  no: string;
  title: string;
  meta: string;
}) {
  return (
    <header className="d-plate-head">
      <Reveal>
        <p className="d-mono d-plate-meta">{meta}</p>
      </Reveal>
      <div className="d-plate-row">
        <Reveal delay={60}>
          <span className="d-plate-no" aria-hidden="true">
            {no}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="d-plate-title">{title}</h2>
        </Reveal>
      </div>
      <div className="d-plate-rules" aria-hidden="true">
        <span className="d-rule-heavy" />
        <span className="d-rule-light" />
      </div>
    </header>
  );
}

export default function DossierPage() {
  return (
    <>
      {/* crop marks + paper grain + crosshair */}
      <div className="d-cropmarks" aria-hidden="true">
        <span /> <span /> <span /> <span />
      </div>
      <Crosshair />
      <RailNav />
      <ChapterBar />

      <main className="d-main">
        <Hero />

        {/* ── PLATE 01 — EXPERIENCE ─────────────────────────── */}
        <section id="experience" className="d-plate" aria-labelledby="t-experience">
          <PlateHeader no="01" title="WORK EXPERIENCE" meta="FIELD RECORD — ENGAGEMENTS" />
          <div className="d-xp">
            {experience.map((job, i) => (
              <Reveal as="article" className="d-xp-row" key={job.company} delay={i * 80}>
                <div className="d-xp-period d-mono">
                  {job.duration}
                  {job.current ? (
                    <span className="d-live">
                      <i /> ACTIVE
                    </span>
                  ) : null}
                </div>
                <div>
                  <h3>{job.position}</h3>
                  <p className="d-xp-co d-mono">{job.company}</p>
                  <p className="d-xp-desc">{job.description}</p>
                  {job.points.length > 0 ? (
                    <ul className="d-points d-mono">
                      {job.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="d-xp-tags">
                  {job.current ? <span className="d-tag d-tag-red">CURRENT</span> : null}
                  <span className="d-tag">RECORD {pad(i + 1)}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PLATE 02 — EDUCATION ──────────────────────────── */}
        <section id="education" className="d-plate" aria-labelledby="t-education">
          <PlateHeader no="02" title="EDUCATION" meta="INSTITUTIONS — FOUNDATION" />
          <div className="d-edu-grid">
            {education.map((ed, i) => (
              <Reveal as="article" className="d-edu-card" key={ed.institution} delay={i * 90}>
                <span className="d-edu-mark" aria-hidden="true">
                  {ed.institution
                    .split(" ")
                    .filter((w) => /^[A-Z]/.test(w))
                    .slice(0, 3)
                    .map((w) => w[0])
                    .join("")}
                </span>
                <h3>{ed.institution}</h3>
                <p className="d-edu-degree">
                  {ed.degree} · {ed.field}
                </p>
                <p className="d-mono d-edu-period">{ed.duration}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PLATE 03 — PUBLICATIONS & AWARDS ─────────────── */}
        <section id="publications" className="d-plate" aria-labelledby="t-publications">
          <PlateHeader no="03" title="PUBLICATIONS & AWARDS" meta="FORMAL RECORD — RECOGNITION" />
          <ol className="d-pubs">
            {publications.map((pub, i) => (
              <Reveal as="li" className="d-pub" key={pub.title} delay={i * 70}>
                <span className="d-pub-n d-mono">P-{pad(i + 1)}</span>
                <div>
                  <h3>{pub.title}</h3>
                  <p className="d-mono d-pub-meta">
                    {pub.role}
                    {pub.patent ? ` · ${pub.patent}` : ""}
                  </p>
                  {pub.note ? <p className="d-pub-note">{pub.note}</p> : null}
                </div>
              </Reveal>
            ))}
            {awards.map((a, i) => (
              <Reveal as="li" className="d-pub" key={a.title} delay={(i + publications.length) * 70}>
                <span className="d-pub-n d-mono">A-{pad(i + 1)}</span>
                <div>
                  <h3>{a.title}</h3>
                  <p className="d-mono d-pub-meta">
                    {a.year ? `${a.year} · ` : ""}HACKATHON
                  </p>
                  <p className="d-pub-note">{a.detail}</p>
                </div>
                <span className="d-stamp-mini" aria-hidden="true">
                  WINNER
                </span>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ── PLATE 04 — PROJECTS ───────────────────────────── */}
        <section id="projects" className="d-plate" aria-labelledby="t-projects">
          <PlateHeader no="04" title="PROJECTS" meta="SELECTED WORKS — SPECIFICATIONS" />
          <div className="d-prj-list">
            {projects.map((p, i) => (
              <Reveal as="article" className="d-prj" key={p.name} delay={i * 60}>
                <span className="d-prj-no" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <div className="d-prj-main">
                  <h3>{p.name}</h3>
                  <p className="d-mono d-prj-tag">{p.tagline.toUpperCase()}</p>
                  <ul className="d-chips d-mono">
                    {p.stack.map((t) => (
                      <li key={t}>{t.toUpperCase()}</li>
                    ))}
                  </ul>
                  {(p.github || p.live) && (
                    <div className="d-links d-mono">
                      {p.github ? (
                        <a href={p.github} target="_blank" rel="noreferrer noopener">
                          SOURCE ↗
                        </a>
                      ) : null}
                      {p.live ? (
                        <a href={p.live} target="_blank" rel="noreferrer noopener">
                          DEPLOYED ↗
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
                <div className="d-prj-side">
                  <p>{p.description}</p>
                  {p.highlights.map((h) => (
                    <p className="d-prj-hl" key={h}>
                      <span aria-hidden="true">※ </span>
                      {h}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PLATE 05 — SKILLS & CERTIFICATIONS ───────────── */}
        <section id="skills" className="d-plate" aria-labelledby="t-skills">
          <PlateHeader no="05" title="SKILLS & CERTIFICATIONS" meta="TOOLING — CAPABILITY INDEX" />
          <div className="d-skill-grid">
            {skillGroups.map((g, i) => (
              <Reveal className="d-sk-col" key={g.category} delay={i * 60}>
                <h4 className="d-mono">{g.category.toUpperCase()}</h4>
                <ul>
                  {g.skills.map((s) => (
                    <li key={s}>
                      <span>{s}</span>
                      <span className="d-leader" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal className="d-cert-note">
            <h4 className="d-mono">CERTIFICATIONS</h4>
            {certifications.length === 0 ? (
              <p className="d-mono d-empty">NONE ON FILE — SECTION UPDATES AUTOMATICALLY.</p>
            ) : (
              <ul className="d-cert-list">
                {certifications.map((c) => (
                  <li key={c.name}>
                    <strong>{c.name}</strong>
                    <span className="d-mono">
                      {c.issuer}
                      {c.date ? ` — ${c.date}` : ""}
                    </span>
                    {c.verifyUrl ? (
                      <a className="d-mono" href={c.verifyUrl} target="_blank" rel="noreferrer noopener">
                        VERIFY ↗
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </section>

        {/* ── PLATE 06 — SOCIALS ────────────────────────────── */}
        <section id="socials" className="d-plate" aria-labelledby="t-socials">
          <PlateHeader no="06" title="SOCIALS" meta="EXTERNAL CHANNELS" />
          <div className="d-socials">
            {socials.map((s, i) => (
              <Reveal key={s.url} delay={i * 60}>
                <a className="d-social" href={s.url} target="_blank" rel="noreferrer noopener">
                  <span className="d-social-label">{s.label}</span>
                  <span className="d-mono d-social-handle">{s.handle}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </Reveal>
            ))}
            <Reveal delay={socials.length * 60}>
              <a className="d-social" href={`mailto:${profile.email}`}>
                <span className="d-social-label">Direct Mail</span>
                <span className="d-mono d-social-handle">{profile.email}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── PLATE 07 — CONTACT ────────────────────────────── */}
        <section id="contact" className="d-plate" aria-labelledby="t-contact">
          <PlateHeader no="07" title="CONTACT ME" meta="OPEN A LINE — TRANSMISSION FORM" />
          <div className="d-contact-grid">
            <Reveal>
              <ContactForm />
            </Reveal>
            <Reveal delay={100}>
              <aside className="d-contact-details">
                <h3>Start a conversation.</h3>
                {socials.map((social) => <p key={social.url}><a href={social.url} target="_blank" rel="noopener noreferrer">{social.label}</a></p>)}
              </aside>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="d-footer">
        <p className="d-mono">
          DOSSIER Nº AS-2026 · SET IN SPACE GROTESK, SPECTRAL & IBM PLEX MONO
        </p>
        <p className="d-footer-name">{profile.name.toUpperCase()} — FORGED IN CODE</p>
        <p className="d-mono">
          <Link href="/" className="d-link">
            ← RETURN TO THE FORGE EDITION
          </Link>
        </p>
      </footer>
    </>
  );
}
