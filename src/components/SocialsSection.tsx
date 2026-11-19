import Section from "@/components/Section";
import { SocialIcon } from "@/components/Icons";
import { socials } from "@/data/socials";

export default function SocialsSection() {
  return (
    <Section
      id="socials"
      numeral="VI"
      title="Socials"
      lead="Professional ground, publicly held."
    >
      <div className="social-grid">
        {socials.map((s, i) => (
          <a
            className={`social-card rv rv-${i + 2}`}
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="social-icon">
              <SocialIcon name={s.icon} size={22} />
            </span>
            <span className="social-meta">
              <span className="social-label">{s.label}</span>
              <span className="social-handle">{s.handle}</span>
            </span>
            <span className="social-arrow" aria-hidden="true">
              <SocialIcon name="external" size={16} />
            </span>
          </a>
        ))}
      </div>
    </Section>
  );
}
