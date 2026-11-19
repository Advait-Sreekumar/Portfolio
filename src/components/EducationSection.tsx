import Section from "@/components/Section";
import { education } from "@/data/education";

export default function EducationSection() {
  return (
    <Section
      id="education"
      numeral="II"
      title="Education"
      lead="Two institutions, one discipline."
    >
      <div className="edu-grid">
        {education.map((ed, i) => (
          <article className={`edu-card rv rv-${i + 2}`} key={ed.institution}>
            <span className="edu-crest" aria-hidden="true">
              {ed.institution
                .split(" ")
                .filter((w) => /^[A-Z]/.test(w))
                .slice(0, 3)
                .map((w) => w[0])
                .join("")}
            </span>
            <h3 className="edu-institution">{ed.institution}</h3>
            <p className="edu-degree">
              {ed.degree} — <em>{ed.field}</em>
            </p>
            <p className="edu-duration">{ed.duration}</p>
            {ed.notes && ed.notes.length > 0 ? (
              <ul className="edu-notes">
                {ed.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}
