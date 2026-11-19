/**
 * ─────────────────────────────────────────────────────────────
 *  SOCIALS — only links present on the resume.
 *  Add more (GitHub, X, etc.) as they become available.
 * ─────────────────────────────────────────────────────────────
 */
export interface Social {
  label: string;
  handle: string;
  url: string;
  icon: string; // resolved by <SocialIcon />
}

export const socials: Social[] = [
  {
    label: "LinkedIn",
    handle: "advait-sreekumar",
    url: "https://linkedin.com/in/advait-sreekumar-13b962330",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    handle: "advait-sreekumar",
    url: "https://github.com/advait-sreekumar",
    icon: "github",
  },
];
