/**
 * ─────────────────────────────────────────────────────────────
 *  EDUCATION — sourced from Advait's resume.
 * ─────────────────────────────────────────────────────────────
 */
export interface Education {
  institution: string;
  abbreviation: string;
  degree: string;
  field: string;
  duration: string;
  notes?: string[];
}

export const education: Education[] = [
  {
    institution: "Keshav Memorial Engineering College",
    abbreviation: "KMEC",
    degree: "Bachelor of Engineering",
    field: "Computer Science",
    duration: "September 2024 — July 2028",
    notes: [],
  },
  {
    institution: "Indian Institute of Technology, Madras",
    abbreviation: "IITM",
    degree: "Bachelor of Science",
    field: "Data Science and Programming",
    duration: "December 2024 — July 2027",
    notes: [],
  },
];
