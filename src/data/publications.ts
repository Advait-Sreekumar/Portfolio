/**
 * ─────────────────────────────────────────────────────────────
 *  PUBLICATIONS & AWARDS — sourced from Advait's resume.
 * ─────────────────────────────────────────────────────────────
 */
export interface Publication {
  title: string;
  role: string;
  patent?: string;
  note?: string;
  url?: string | null;
}

export interface Award {
  title: string;
  detail: string;
  year?: string;
}

export const publications: Publication[] = [
  {
    title:
      "Standardized oculomotor assessment using a commodity monochrome camera for neuropsychiatric screening",
    role: "Co-author",
    patent: "Indian Patent — Published",
    note: "Oculomotor screening research for neuropsychiatric applications, published as an Indian patent.",
    url: null,
  },
];

export const awards: Award[] = [
  {
    title: "Winner — Bower School of Excellence Hackathon",
    detail: "First place at the Bower School of Excellence Hackathon.",
    year: "2026",
  },
];
