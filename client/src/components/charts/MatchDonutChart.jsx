import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const PIE_COLORS = ["var(--color-accent)", "var(--color-rule)"];

export default function MatchDonutChart({ matchPercent, size = "default" }) {
  const pieData = [
    { name: "Match", value: matchPercent },
    { name: "Gap", value: Math.max(0, 100 - matchPercent) },
  ];

  const isLarge = size === "large";

  return (
    <div className={isLarge ? "h-64" : "h-52"} role="img" aria-label={`Match score: ${matchPercent}% match, ${100 - matchPercent}% gap`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            innerRadius={isLarge ? 50 : 54}
            outerRadius={isLarge ? 90 : 86}
            stroke="var(--color-paper)"
            strokeWidth={2}
            startAngle={90}
            endAngle={-270}
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--color-paper)",
              border: "1px solid var(--color-rule)",
              borderRadius: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}