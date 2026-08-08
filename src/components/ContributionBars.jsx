import { weightedContributions } from "../lib/framework";

export default function ContributionBars({ scores, categories, weights }) {
  const contributions = weightedContributions(scores, categories, weights).sort(
    (a, b) => b.points - a.points
  );
  const maxPoints = Math.max(...contributions.map((c) => c.maxPoints), 1);

  return (
    <div className="space-y-2.5">
      {contributions.map((c) => (
        <div key={c.key}>
          <div className="flex items-baseline justify-between text-xs mb-1">
            <span className="text-ink-800 font-medium" style={{ color: "var(--color-ink-800)" }}>
              {c.name}
            </span>
            <span className="font-mono-num" style={{ color: "var(--color-ink-500)" }}>
              {c.points.toFixed(1)} pts
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--color-ink-400)", opacity: 1, background: "rgba(93,143,181,0.15)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${(c.points / maxPoints) * 100}%`,
                backgroundColor: "var(--color-accent)",
                transition: "width 250ms ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
