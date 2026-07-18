/**
 * DeskSurface
 * -----------
 * The physical room. Every layer positioned in % of its own
 * container so it fills any stage from 360px to 2560px without
 * a single breakpoint.
 */
export default function DeskSurface() {
  return (
    <div aria-hidden="true" className="hero-desk-surface">
      {/* L0 vignette */}
      <div
        className="hero-layer"
        style={{
          background:
            "radial-gradient(130% 90% at 50% 55%, transparent 55%, rgba(26,26,26,0.08) 82%, rgba(26,26,26,0.14) 100%)",
        }}
      />
      {/* L1 wall wash */}
      <div
        className="hero-layer"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,232,190,0.22) 0%, rgba(247,244,238,0) 45%, rgba(26,26,26,0.05) 100%)",
        }}
      />
      {/* L2 desk wood */}
      <div
        className="hero-desk-wood"
        style={{
          background:
            "linear-gradient(180deg, rgba(200,175,130,0.28) 0%, rgba(170,140,95,0.30) 55%, rgba(140,110,70,0.36) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.30), 0 40px 80px -40px rgba(26,26,26,0.55)",
        }}
      />
      {/* wood grain */}
      <div
        className="hero-desk-wood hero-desk-grain"
        style={{
          backgroundImage:
            "repeating-linear-gradient(92deg, rgba(60,40,15,0.10) 0 1px, transparent 1px 5px), repeating-linear-gradient(88deg, rgba(60,40,15,0.06) 0 1px, transparent 1px 9px)",
        }}
      />
      {/* L3 blotter */}
      <div
        className="hero-desk-blotter"
        style={{
          background:
            "linear-gradient(180deg, rgba(232,222,201,0.72) 0%, rgba(220,208,182,0.72) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.40), inset 0 -1px 0 rgba(26,26,26,0.06), 0 30px 60px -40px rgba(26,26,26,0.40)",
        }}
      />
      {/* felt grain */}
      <div
        className="hero-desk-blotter hero-desk-felt"
        style={{
          backgroundImage:
            "repeating-linear-gradient(37deg, rgba(60,45,20,0.05) 0 1px, transparent 1px 3px), repeating-linear-gradient(-42deg, rgba(60,45,20,0.04) 0 1px, transparent 1px 4px)",
        }}
      />
      {/* L4 lamp */}
      <div className="hero-layer hero-parallax" style={{ ["--depth"]: "14px" }}>
        <div
          className="hero-lamp hero-lamp-breath"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,226,168,0.60) 0%, rgba(255,214,140,0.30) 32%, rgba(255,214,140,0.10) 58%, transparent 74%)",
            filter: "blur(2px)",
          }}
        />
      </div>
      {/* L5 coffee ring */}
      <div
        className="hero-coffee-ring"
        style={{
          background:
            "radial-gradient(closest-side, transparent 62%, rgba(88,54,20,0.18) 66%, rgba(88,54,20,0.09) 72%, transparent 78%)",
          transform: "rotate(-8deg)",
        }}
      />
      {/* L6 accent bounce */}
      <div
        className="hero-accent-bounce"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.04) 45%, transparent 75%)",
        }}
      />
    </div>
  );
}