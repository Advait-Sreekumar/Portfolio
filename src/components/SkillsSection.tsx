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
            No certifications listed on the current resume — this section
            updates automatically when they are added.
          </p>
        ) : (
          <ul className="cert-list">
            {certifications.map((c) => (
              <li className="cert-card" key={c.name}>
                {c.image ? (
                  <figure className="cert-figure">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt={`${c.name} certificate`} loading="lazy" />
                  </figure>
                ) : null}
                <div>
                  <h4>{c.name}</h4>
                  <p>
                    {c.issuer}
                    {c.date ? ` — ${c.date}` : ""}
                  </p>
                  {c.verifyUrl ? (
                    <a href={c.verifyUrl} target="_blank" rel="noreferrer noopener">
                      Verify certificate
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
