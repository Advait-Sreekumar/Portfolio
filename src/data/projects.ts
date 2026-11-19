/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — sourced from Advait's resume (College Projects).
 *  Add github / live URLs when available — links render
 *  automatically once set. Do not invent URLs.
 * ─────────────────────────────────────────────────────────────
 */
export interface Project {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  highlights: string[];
  github?: string | null;
  live?: string | null;
}

export const projects: Project[] = [
  {
    name: "Apeiron",
    tagline: "Digital Accessibility Platform",
    description:
      "Built a comprehensive digital accessibility platform to help people with disabilities use a laptop or a PC.",
    stack: [],
    highlights: ["End-to-end accessibility experience for desktop users"],
    github: null,
    live: null,
  },
  {
    name: "Visual Narrator",
    tagline: "Image-to-Story Generation",
    description:
      "Developed a Python-based application using StoryWeaver that generates narrative stories from user-uploaded images.",
    stack: ["Python", "StoryWeaver"],
    highlights: ["Turns any uploaded image into a generated narrative"],
    github: null,
    live: null,
  },
  {
    name: "JavaScript Code Completer",
    tagline: "CLI Autocompletion Engine",
    description:
      "Developed a lightweight, CLI-based JavaScript autocompletion engine optimized for low-resource environments.",
    stack: ["JavaScript", "Node.js"],
    highlights: ["Maintains a memory footprint of under 100 MB RAM"],
    github: null,
    live: null,
  },
];
