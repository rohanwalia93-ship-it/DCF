import { computeVerdict } from "../lib/framework";
import VerdictBadge from "./VerdictBadge";
import { bandColorFor0to100 } from "../lib/framework";

export default function RankedBarChart({ partners, weights }) {
  const ranked = partners
    .map((p) => ({ partner: p, ...computeVerdict(p.scores, weights) }))
    .sort((a, b) => b.score - a.score);

  const max = Math.max(...ranked.map((r) => r.score), 100);

  return (
    <div className="space-y-4">
      {ranked.map((r, i) => (
        <div key={r.partner.id}>
          <div className="flex items-center justify-between mb-1.5 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="font-mono-num text-xs w-5 text-center shrink-0"
                style={{ color: "var(--color-ink-500)" }}
              >
                {i + 1}
              </span>
              <span className="font-medium text-sm truncate" style={{ color: "var(--color-ink-950)" }}>
                {r.partner.name}
              </span>
              <VerdictBadge verdict={r.verdict} size="sm" />
            </div>
            <span className="font-mono-num text-sm font-semibold shrink-0" style={{ color: "var(--color-ink-950)" }}>
              {r.score.toFixed(1)}
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(93,143,181,0.15)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(r.score / max) * 100}%`,
                backgroundColor: bandColorFor0to100(r.score),
                transition: "width 250ms ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
