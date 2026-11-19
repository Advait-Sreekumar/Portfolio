export type SectionId =
  | "experience"
  | "education"
  | "publications"
  | "projects"
  | "skills"
  | "socials"
  | "contact";

export interface SectionMeta {
  id: SectionId;
  /** Short label used on the navigation wheel */
  shortLabel: string;
  /** Full label used for headings / accessibility */
  fullLabel: string;
  /** Roman numeral shown as the section eyebrow */
  numeral: string;
  /** Icon key resolved by <SectionIcon /> */
  icon: string;
}

export const SECTIONS: readonly SectionMeta[] = [
  {
    id: "experience",
    shortLabel: "Experience",
    fullLabel: "Work Experience",
    numeral: "I",
    icon: "experience",
  },
  {
    id: "education",
    shortLabel: "Education",
    fullLabel: "Education",
    numeral: "II",
    icon: "education",
  },
  {
    id: "publications",
    shortLabel: "Publications",
    fullLabel: "Publications & Awards",
    numeral: "III",
    icon: "publication",
  },
  {
    id: "projects",
    shortLabel: "Projects",
    fullLabel: "Projects",
    numeral: "IV",
    icon: "projects",
  },
  {
    id: "skills",
    shortLabel: "Skills",
    fullLabel: "Skills & Certifications",
    numeral: "V",
    icon: "skills",
  },
  {
    id: "socials",
    shortLabel: "Socials",
    fullLabel: "Socials",
    numeral: "VI",
    icon: "socials",
  },
  {
    id: "contact",
    shortLabel: "Contact",
    fullLabel: "Contact Me",
    numeral: "VII",
    icon: "contact",
  },
] as const;

export function getSection(id: SectionId): SectionMeta {
  return SECTIONS.find((s) => s.id === id)!;
}
