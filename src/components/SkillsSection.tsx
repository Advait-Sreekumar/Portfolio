import Section from "@/components/Section";
import { skillGroups } from "@/data/skills";
import { certifications } from "@/data/certifications";

export default function SkillsSection() {
  return (
    <Section
      id="skills"
      numeral="V"
      title="Skills & Certifications"
      lead="The edge, and everything that keeps it sharp."
    >
      <div className="skill-grid">
        {skillGroups.map((group, i) => (
          <article className={`skill-card rv rv-${i + 2}`} key={group.category}>
            <h3 className="skill-category">{group.category}</h3>
            <ul className="skill-chips">
              {group.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="cert-block rv rv-4">
        <h3 className="cert-heading">Certifications</h3>
        {certifications.length === 0 ? (
          <p className="cert-empty">
            Certificates will appear here as they become available.
          </p>
        ) : (
          <ul className="cert-list">
            {certifications.map((c) => (
              <li key={c.verifyUrl}>
                <a className="cert-card" href={c.verifyUrl} target="_blank" rel="noreferrer noopener" aria-label={`Open ${c.name} (${c.format}, new tab)`}>
                {c.image ? (
                  <figure className="cert-figure">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt={`${c.name} certificate preview`} loading="lazy" width={1000} height={750} />
                  </figure>
                ) : <span className="cert-file" aria-hidden="true">{c.format}</span>}
                <div>
                  <h4>{c.name}</h4>
                  <p>{c.format} document</p>
                  <span className="cert-open">View certificate</span>
                </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
