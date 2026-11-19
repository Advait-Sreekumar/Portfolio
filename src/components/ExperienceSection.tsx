import Section from "@/components/Section";
import { experience } from "@/data/experience";

export default function ExperienceSection() {
  return (
    <Section
      id="experience"
      numeral="I"
      title="Work Experience"
      lead="Forged through practice — research, engineering and craft."
    >
      <ol className="exp-list">
        {experience.map((job, i) => (
          <li className={`exp-entry rv rv-${i + 2}`} key={job.company}>
            <span className="exp-node" aria-hidden="true" />
            <div className="exp-head">
              <h3 className="exp-position">{job.position}</h3>
              {job.current ? (
                <span className="exp-current">
                  <span className="pulse-dot" aria-hidden="true" /> Current
                </span>
              ) : null}
              <span className="exp-duration">{job.duration}</span>
            </div>
            <p className="exp-company">
              {job.url ? (
                <a href={job.url} target="_blank" rel="noreferrer noopener">
                  {job.company}
                </a>
              ) : (
                job.company
              )}
            </p>
            <p className="exp-desc">{job.description}</p>
            {job.points.length > 0 ? (
              <ul className="exp-points">
                {job.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
