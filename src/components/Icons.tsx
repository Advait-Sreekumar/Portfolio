interface IconProps {
  size?: number;
  className?: string;
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SectionIcon({
  name,
  size = 22,
  className,
}: IconProps & { name: string }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", className, "aria-hidden": true };
  switch (name) {
    case "experience":
      return (
        <svg {...common}>
          <g {...strokeProps}>
            <rect x="3" y="7.5" width="18" height="13" rx="2" />
            <path d="M9 7.5V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8v1.7" />
            <path d="M3 12.5h18" />
          </g>
        </svg>
      );
    case "education":
      return (
        <svg {...common}>
          <g {...strokeProps}>
            <path d="M12 4 2.5 8.8 12 13.6l9.5-4.8L12 4Z" />
            <path d="M6.2 10.8v4.6c0 1.6 2.6 3 5.8 3s5.8-1.4 5.8-3v-4.6" />
            <path d="M21.5 8.8v5.7" />
          </g>
        </svg>
      );
    case "publication":
      return (
        <svg {...common}>
          <g {...strokeProps}>
            <circle cx="12" cy="9" r="5" />
            <path d="M9.4 13.2 7.5 20l4.5-2.6L16.5 20l-1.9-6.8" />
          </g>
        </svg>
      );
    case "projects":
      return (
        <svg {...common}>
          <g {...strokeProps}>
            <path d="m12 3 9 4.8-9 4.8-9-4.8L12 3Z" />
            <path d="m3 12.4 9 4.8 9-4.8" />
            <path d="m3 16.8 9 4.8 9-4.8" opacity="0.45" />
          </g>
        </svg>
      );
    case "skills":
      return (
        <svg {...common}>
          <g {...strokeProps}>
            <path d="M4 7h16M4 12h16M4 17h16" />
            <circle cx="9" cy="7" r="2" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="12" r="2" fill="currentColor" stroke="none" />
            <circle cx="7" cy="17" r="2" fill="currentColor" stroke="none" />
          </g>
        </svg>
      );
    case "socials":
      return (
        <svg {...common}>
          <g {...strokeProps}>
            <path d="M10.5 13.5a4 4 0 0 0 5.66 0l3.2-3.2a4 4 0 1 0-5.66-5.66l-1.6 1.6" />
            <path d="M13.5 10.5a4 4 0 0 0-5.66 0l-3.2 3.2a4 4 0 1 0 5.66 5.66l1.6-1.6" />
          </g>
        </svg>
      );
    case "contact":
      return (
        <svg {...common}>
          <g {...strokeProps}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
          </g>
        </svg>
      );
    default:
      return null;
  }
}

export function SocialIcon({
  name,
  size = 20,
  className,
}: IconProps & { name: string }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", className, "aria-hidden": true };
  if (name === "linkedin") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z" />
      </svg>
    );
  }
  if (name === "github") {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    );
  }
  // generic external-link glyph
  return (
    <svg {...common}>
      <g {...strokeProps}>
        <path d="M14 4h6v6" />
        <path d="M20 4 11 13" />
        <path d="M19 14v5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 19V6.5A1.5 1.5 0 0 1 5.5 5H10" />
      </g>
    </svg>
  );
}

export function ExternalGlyph(props: IconProps) {
  return <SocialIcon {...props} name="external" />;
}
