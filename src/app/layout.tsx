import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import { profile } from "@/data/profile";
import "./globals.css";

const cinzel = localFont({
  src: [
    { path: "../../public/fonts/cinzel-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/cinzel-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/cinzel-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/cinzel-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-cinzel",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Advait Sreekumar — Portfolio",
  description: profile.summary,
  keywords: [
    "Advait Sreekumar",
    "Computer Science Engineer",
    "AI",
    "Machine Learning",
    "Portfolio",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
