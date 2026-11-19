/**
 * ─────────────────────────────────────────────────────────────
 *  EDUCATION — sourced from Advait's resume.
 * ─────────────────────────────────────────────────────────────
 */
export interface Education {
  institution: string;
  degree: string;
  field: string;
  duration: string;
  notes?: string[];
}

export const education: Education[] = [
  {
    institution: "Keshav Memorial Engineering College",
    degree: "Bachelor of Engineering",
    field: "Computer Science",
    duration: "September 2024 — July 2028",
    notes: [],
  },
  {
    institution: "Indian Institute of Technology, Madras",
    degree: "Bachelor of Science",
    field: "Data Science and Programming",
    duration: "December 2024 — July 2027",
    notes: [],
  },
];
