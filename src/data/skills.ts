/**
 * ─────────────────────────────────────────────────────────────
 *  SKILLS — organised from Advait's resume.
 * ─────────────────────────────────────────────────────────────
 */
export interface SkillGroup {
  category: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Programming",
    skills: ["Python", "C", "C++", "Java", "JavaScript"],
  },
  {
    category: "AI / Machine Learning",
    skills: ["Machine Learning", "Neural Networks", "Computer Vision"],
  },
  {
    category: "Web Development",
    skills: ["Node JS", "Express JS", "Tailwind CSS", "WooCommerce", "WordPress"],
  },
  {
    category: "Databases",
    skills: ["DBMS"],
  },
  {
    category: "Professional",
    skills: ["Verbal Communication"],
  },
];
