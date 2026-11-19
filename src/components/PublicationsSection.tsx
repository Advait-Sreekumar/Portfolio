import Section from "@/components/Section";
import { publications, awards } from "@/data/publications";

export default function PublicationsSection() {
  return (
    <Section
      id="publications"
      numeral="III"
      title="Publications & Awards"
      lead="Research set to paper, recognition earned in the field."
    >
      <div className="pub-list">
        {publications.map((pub, i) => (
          <article className={`pub-card rv rv-${i + 2}`} key={pub.title}>
            <div className="pub-badges">
              <span className="badge badge-brass">{pub.role}</span>
              {pub.patent ? (
                <span className="badge badge-ember">{pub.patent}</span>
              ) : null}
            </div>
            <h3 className="pub-title">
              {pub.url ? (
                <a href={pub.url} target="_blank" rel="noreferrer noopener">
                  {pub.title}
                </a>
              ) : (
                pub.title
              )}
            </h3>
            {pub.note ? <p className="pub-note">{pub.note}</p> : null}
          </article>
        ))}

        {awards.map((award, i) => (
          <article
            className={`pub-card pub-card--award rv rv-${i + 3}`}
            key={award.title}
          >
            <div className="pub-badges">
              <span className="badge badge-ember">Winner</span>
              {award.year ? (
                <span className="badge">{award.year}</span>
              ) : null}
            </div>
            <h3 className="pub-title">{award.title}</h3>
            <p className="pub-note">{award.detail}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
