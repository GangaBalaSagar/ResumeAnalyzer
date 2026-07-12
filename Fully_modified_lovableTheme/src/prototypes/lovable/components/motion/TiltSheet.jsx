import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

export default function TiltSheet({
  children, className = "", max = 4, lift = 6, perspective = 1200, style, ...rest
}) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.9 });
  const sy = useSpring(my, { stiffness: 220, damping: 26, mass: 0.9 });
  const rotateY = useTransform(sx, [-1, 1], [-max, max]);
  const rotateX = useTransform(sy, [-1, 1], [max, -max]);
  const translateY = useTransform(sy, [-1, 1], [0, -lift]);

  const isCoarse =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)")?.matches;

  if (reduce || isCoarse) {
    return <div className={className} style={style} {...rest}>{children}</div>;
  }
  const handleMove = (e) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(Math.max(-1, Math.min(1, nx)));
    my.set(Math.max(-1, Math.min(1, ny)));
  };
  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave}
      className={className}
      style={{ perspective, transformStyle: "preserve-3d", ...style }}
      {...rest}
    >
      <motion.div style={{ rotateX, rotateY, y: translateY, transformStyle: "preserve-3d", willChange: "transform" }}>
        {children}
      </motion.div>
    </motion.div>
  );
}