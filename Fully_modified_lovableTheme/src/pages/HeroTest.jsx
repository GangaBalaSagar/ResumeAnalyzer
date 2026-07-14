/**
 * Hero Test Page — isolated playground for the exported Lovable Hero.
 * Renders ONLY <CinematicHero /> with its own CSS.
 * No Landing-v2 sections. No production components.
 * Accessible at /hero-test
 */
import { CinematicHero } from "@/components/hero";
import "@/components/hero/hero.css";

export default function HeroTest() {
  return (
    <CinematicHero />
  );
}