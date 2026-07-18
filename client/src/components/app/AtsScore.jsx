/**
 * AtsScore — the single, canonical presentation of the ATS match score
 * used across Report, Dashboard, and History.
 *
 * Why a shared component: the score is a product-identity element.
 * Rendering it consistently across pages is a hard requirement — users
 * should recognize the same numeral, the same accent color, the same
 * "/100" tail no matter where they land.
 *
 * Sizes (all reuse the same tokens — font-serif, text-accent, /100 tail):
 *   xs  → 24px  · inline in dense lists
 *   sm  → 32px  · list rows (Dashboard recent, History rows)
 *   md  → 48px  · at-a-glance cards
 *   xl  → 92px  · the Report "cover" score
 *
 * Bands are shared so the verdict label is identical everywhere.
 */

const SIZE_MAP = {
  xs: { num: "text-[24px]", slash: "text-[10px]", gap: "ml-0.5" },
  sm: { num: "text-[32px]", slash: "text-[11px]", gap: "ml-1" },
  md: { num: "text-[48px]", slash: "text-[13px]", gap: "ml-1" },
  xl: { num: "text-[92px]", slash: "text-2xl", gap: "ml-1" },
};

export function bandFor(p) {
  if (p == null) return "—";
  if (p >= 85) return "Excellent";
  if (p >= 65) return "Strong";
  if (p >= 40) return "Fair";
  return "Weak";
}

export function verdictFor(p) {
  if (p == null) return { label: "—", note: "" };
  if (p >= 85) return { label: "Send it.", note: "Strong alignment. Polish and submit." };
  if (p >= 65) return { label: "Edit it.", note: "Close — a few targeted edits will land it." };
  if (p >= 40) return { label: "Rework.", note: "The bones are there. Rewrite for the role." };
  return { label: "Rewrite.", note: "This resume is for a different role than the brief." };
}

export default function AtsScore({
  value,
  size = "md",
  showScale = true,
  className = "",
}) {
  const cfg = SIZE_MAP[size] ?? SIZE_MAP.md;
  const hasValue = typeof value === "number" && !Number.isNaN(value);
  return (
    <span
      className={`font-serif leading-none text-accent tabular-nums ${cfg.num} ${className}`}
    >
      {hasValue ? Math.round(value) : "—"}
      {hasValue && showScale && (
        <span className={`${cfg.slash} ${cfg.gap} text-ink-muted/70 align-top`}>
          /100
        </span>
      )}
    </span>
  );
}
