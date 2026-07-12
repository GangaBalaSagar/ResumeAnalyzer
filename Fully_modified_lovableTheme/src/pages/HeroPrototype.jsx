import MotionConfigProvider from "../prototypes/lovable/components/motion/MotionConfigProvider.jsx";
import CinematicHero from "../prototypes/lovable/components/landing/CinematicHero.jsx";
import "../prototypes/lovable/HeroPrototype.css";

export default function HeroPrototype() {
  return (
    <MotionConfigProvider>
      <CinematicHero />
    </MotionConfigProvider>
  );
}