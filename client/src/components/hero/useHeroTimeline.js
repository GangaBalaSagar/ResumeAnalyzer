import { useRef } from "react";
import { useScroll, useSpring, useTransform } from "framer-motion";

/**
 * One shared, spring-smoothed scroll progress (0..1) for the
 * whole cinematic sequence. Every scene, camera and mark inside
 * the hero derives from this one value — that's how the scene
 * stays "one continuous take" instead of a stack of independent
 * animations.
 */
export function useHeroTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 30,
    mass: 0.85,
    restDelta: 0.0005,
  });
  return { ref, p };
}

/** Enter → hold → exit envelope. */
export function useEnvelope(p, [a, b, c, d]) {
  return useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
}

/** Linear draw from a→b, 0..1. */
export function useDraw(p, [a, b]) {
  return useTransform(p, [a, b], [0, 1]);
}