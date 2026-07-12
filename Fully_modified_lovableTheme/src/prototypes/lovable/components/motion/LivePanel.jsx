import { useRef } from "react";
import TiltSheet from "./TiltSheet.jsx";

export default function LivePanel({ children, tilt = 3, lift = 5, className = "", sheen = true }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--py", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <TiltSheet max={tilt} lift={lift} className={`live-panel ${className}`}>
      <div
        ref={ref}
        onPointerMove={sheen ? onMove : undefined}
        className={sheen ? "live-panel-inner has-sheen" : "live-panel-inner"}
      >
        {children}
      </div>
    </TiltSheet>
  );
}