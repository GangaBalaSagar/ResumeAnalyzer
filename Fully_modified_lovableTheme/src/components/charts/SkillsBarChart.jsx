import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

export default function SkillsBarChart({ matchedCount, missingCount }) {
  const barData = [
    { name: "Matched", count: matchedCount },
    { name: "Missing", count: missingCount },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} margin={{ top: 12, right: 12, left: -8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-rule)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="var(--color-ink-muted)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "var(--color-rule)" }}
          />
          <YAxis
            stroke="var(--color-ink-muted)"
            fontSize={11}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--color-secondary)" }}
            contentStyle={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-rule)",
              borderRadius: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
            }}
          />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            <Cell fill="var(--color-accent)" />
            <Cell fill="var(--color-ink-muted)" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}