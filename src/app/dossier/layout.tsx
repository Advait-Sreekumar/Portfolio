import type { ReactNode } from "react";
import { Space_Grotesk, Spectral, IBM_Plex_Mono } from "next/font/google";
import "./dossier.css";

const grot = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grot",
  display: "swap",
});

const body = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-body-d",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-d",
  display: "swap",
});

export const metadata = {
  title: "Advait Sreekumar — Dossier Edition",
  description:
    "The atelier dossier — Advait Sreekumar's career as a technical document.",
};

export default function DossierLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`dossier ${grot.variable} ${body.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
