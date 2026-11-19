import KatanaHero from "@/components/KatanaHero";
import NavWheel from "@/components/NavWheel";
import Embers from "@/components/Embers";
import Grain from "@/components/Grain";
import MotionLayer from "@/components/MotionLayer";
import CursorWisp from "@/components/CursorWisp";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import PublicationsSection from "@/components/PublicationsSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import SocialsSection from "@/components/SocialsSection";
import ContactSection from "@/components/ContactSection";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#experience">
        Skip to content
      </a>

      <KatanaHero />
      <NavWheel />

      <main id="main">
        <ExperienceSection />
        <EducationSection />
        <PublicationsSection />
        <ProjectsSection />
        <SkillsSection />
        <SocialsSection />
        <ContactSection />
      </main>

      <footer className="site-footer">
        <div className="footer-rule" aria-hidden="true" />
        <p className="footer-name">{profile.name}</p>
        <p className="footer-tag">Forged in code — {new Date().getFullYear()}</p>
      </footer>

      <Embers />
      <CursorWisp />
      <MotionLayer />
      <Grain />
    </>
  );
}
