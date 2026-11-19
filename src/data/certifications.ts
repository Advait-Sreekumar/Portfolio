/**
 * ─────────────────────────────────────────────────────────────
 *  CERTIFICATIONS — none are listed on the current resume.
 *
 *  To add one later, append an entry:
 *  {
 *    name: "Certification Name",
 *    issuer: "Issuing Organization",
 *    date: "2026",
 *    image: "/images/cert-xyz.jpg",   // optional — elegant framed display
 *    verifyUrl: "https://…",          // optional verification link
 *  }
 *
 *  The section renders automatically once entries exist.
 * ─────────────────────────────────────────────────────────────
 */
export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  image?: string;
  verifyUrl?: string;
}

export const certifications: Certification[] = [];
