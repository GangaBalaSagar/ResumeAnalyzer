export default function DeskStage({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`stage pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* L0 — Room vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgba(26,26,26,0.06) 85%, rgba(26,26,26,0.10) 100%)",
        }}
      />
      {/* L1b — Blotter */}
      <div
        className="absolute left-[6%] right-[6%] top-[14%] bottom-[10%] rounded-[3px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(232,222,201,0.55) 0%, rgba(224,212,188,0.55) 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(26,26,26,0.05), 0 30px 60px -40px rgba(26,26,26,0.35), 0 2px 0 rgba(26,26,26,0.04)",
        }}
      />
      {/* L1d — Fibre grain */}
      <div
        className="absolute left-[6%] right-[6%] top-[14%] bottom-[10%] rounded-[3px] opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(37deg, rgba(60,45,20,0.05) 0 1px, transparent 1px 3px), repeating-linear-gradient(-42deg, rgba(60,45,20,0.04) 0 1px, transparent 1px 4px)",
        }}
      />
      {/* L1c — Coffee ring */}
      <div
        className="absolute w-[110px] h-[110px] right-[14%] top-[22%] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, transparent 62%, rgba(88,54,20,0.16) 66%, rgba(88,54,20,0.08) 72%, transparent 78%)",
          transform: "rotate(-8deg)",
        }}
      />
      {/* L1a — Lamp glow w/ cursor parallax + breath */}
      <div className="absolute inset-0 parallax" style={{ ["--depth"]: "10px" }}>
        <div
          className="absolute -top-[14%] -left-[10%] w-[70%] h-[70%] lamp-breath"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255, 226, 168, 0.55) 0%, rgba(255, 214, 140, 0.28) 30%, rgba(255, 214, 140, 0.10) 55%, transparent 72%)",
            filter: "blur(2px)",
          }}
        />
      </div>
      {/* Bounce accent */}
      <div
        className="absolute -bottom-[10%] -right-[10%] w-[55%] h-[55%] opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.10) 0%, rgba(139,92,246,0.04) 45%, transparent 75%)",
        }}
      />
      {/* Edge tape hint */}
      <div
        className="absolute left-[10%] w-[120px] h-[10px] top-[13%] opacity-40"
        style={{
          background: "rgba(255,255,255,0.65)",
          transform: "rotate(-1.6deg)",
          boxShadow: "0 1px 2px rgba(26,26,26,0.08)",
        }}
      />
    </div>
  );
}