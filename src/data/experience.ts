/**
 * ─────────────────────────────────────────────────────────────
 *  WORK EXPERIENCE — sourced from Advait's resume.
 * ─────────────────────────────────────────────────────────────
 */
import { patentCount } from "./publications";

export interface Experience {
  position: string;
  company: string;
  /** Company website (only set if known — do not invent) */
  url?: string | null;
  duration: string;
  current?: boolean;
  description: string;
  points: string[];
}

export const experience: Experience[] = [
  {
    position: "Research Intern",
    company: "NeuroParadigm",
    url: null,
    duration: "Feb 2026 — Present",
    current: true,
    description:
      "Researching early detection of neuroscience disorders using computer vision and machine learning.",
    points: [
      `Patents: ${patentCount}`,
      "Maintenance of the TSRS website",
    ],
  },
  {
    position: "Social Media Manager",
    company: "90's Kids",
    url: null,
    duration: "May 2025 — Jul 2025",
    current: false,
    description:
      "Worked as a social media manager for an e-commerce company, updating their website on WooCommerce / WordPress for better UI and increasing SEO engagement.",
    points: [],
  },
];
