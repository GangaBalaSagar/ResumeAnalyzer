import { motion, useTransform } from "framer-motion";

/**
 * Camera — the cinematographer for the RIGHT STAGE.
 * Operates ENTIRELY inside the fixed 780×700 stage; all
 * translations are in design-pixel units.
 *
 * Beats (scroll progress p ∈ 0..1):
 *   0.00  wide establishing, gentle downward tilt
 *   0.18  micro push-in as the résumé lands
 *   0.38  soft exhale back as the JD enters
 *   0.60  hold. The reading happens.
 *   0.86  quiet pull-back to reveal the verdict + score
 */
export default function Camera({ p, children }) {
  const scale = useTransform(
    p,
    [0.00, 0.18, 0.38, 0.60, 0.86, 1.00],
    [1.010, 1.028, 1.020, 1.020, 0.988, 0.978]
  );
  const rotateX = useTransform(p, [0.00, 0.38, 1.00], [4.5, 3.0, 2.0]);
  const rotateZ = useTransform(p, [0.00, 0.38, 0.60, 1.00], [0.0, -0.3, 0.15, 0.0]);
  const x = useTransform(p, [0.00, 0.38, 0.60, 1.00], [0, -10, 4, 0]);
  const y = useTransform(p, [0.00, 0.18, 0.60, 1.00], [0, -6, -3, 3]);

  return (
    <motion.div
      className="hero-camera"
      style={{ scale, rotateX, rotateZ, x, y, transformOrigin: "50% 52%" }}
    >
      {children}
    </motion.div>
  );
}