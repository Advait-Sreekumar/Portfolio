/**
 * ─────────────────────────────────────────────────────────────
 *  PROFILE — sourced from Advait's resume.
 *  Edit values here and the whole site updates.
 * ─────────────────────────────────────────────────────────────
 */
export const profile = {
  name: "Advait Sreekumar",
  /** Rendered engraved on the katana blade */
  bladeEngraving: "ADVAIT SREEKUMAR",
  eyebrow: "Portfolio",
  role: "Computer Science Engineer — AI & Machine Learning",
  summary:
    "CS & Data Science student with published research in neuroscience applications. Experienced in full-stack development and building ML platforms.",
  email: "advaitsreekumar01@gmail.com",
  phone: "+91 8106412006",
  location: "", // not listed on resume — leave blank to hide
  /**
   * Drop your photo at:  public/images/portrait.jpg
   * Until then an engraved monogram placeholder is shown.
   */
  portrait: "/images/portrait.jpg",
} as const;

export type Profile = typeof profile;
