import { useEffect } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";

export const SHARED_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

export default function MotionConfigProvider({ children }) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = document.body;
    root.style.setProperty("--mx", "0");
    root.style.setProperty("--my", "0");
    if (reduce) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      tx = (e.clientX / w) * 2 - 1;
      ty = (e.clientY / h) * 2 - 1;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          root.style.setProperty("--mx", tx.toFixed(3));
          root.style.setProperty("--my", ty.toFixed(3));
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
      root.style.setProperty("--mx", "0");
      root.style.setProperty("--my", "0");
    };
  }, [reduce]);

  return (
    <MotionConfig
      transition={reduce ? { duration: 0 } : SHARED_SPRING}
      reducedMotion="user"
    >
      {children}
    </MotionConfig>
  );
}