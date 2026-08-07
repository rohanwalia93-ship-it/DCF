import { useState } from "react";
import ScoreSlider from "./ScoreSlider";
import { bandColorFor1to5, normalisedWeight } from "../lib/framework";

export default function CategoryBlock({ category, scores, weights, onScoreChange, defaultOpen = false, isRedlineCategory, redlineActive }) {
  const [open, setOpen] = useState(defaultOpen);
  const catScores = scores[category.key];
  const average =
    Object.values(catScores).reduce((a, b) => a + b, 0) / Object.values(catScores).length;
  const color = bandColorFor1to5(average);
  const weightPct = (normalisedWeight(weights, category.key) * 100).toFixed(0);

  return (
    <div
      className="rounded-xl border bg-white overflow-hidden"
      style={{ borderColor: "rgba(11,31,51,0.1)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="shrink-0"
            style={{
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 200ms ease",
              color: "var(--color-ink-500)",
            }}
          >
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-semibold text-sm" style={{ color: "var(--color-ink-950)" }}>
                {category.name}
              </h3>
              <span
                className="text-[10px] font-mono-num px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent)" }}
              >
                {weightPct}% weight
              </span>
              {isRedlineCategory && redlineActive && (
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
                  style={{ backgroundColor: "var(--color-decline-soft)", color: "var(--color-decline)" }}
                >
                  Red-line
                </span>
              )}
            </div>
            {!open && (
              <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-ink-500)" }}>
                {category.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs" style={{ color: "var(--color-ink-500)" }}>avg</span>
          <span className="font-mono-num text-base font-semibold" style={{ color }}>
            {average.toFixed(1)}
          </span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: "rgba(11,31,51,0.08)" }}>
          <p className="text-xs pt-3" style={{ color: "var(--color-ink-500)" }}>
            {category.description}
          </p>
          {category.criteria.map((crit) => (
            <ScoreSlider
              key={crit.key}
              label={crit.name}
              value={catScores[crit.key]}
              onChange={(v) => onScoreChange(category.key, crit.key, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
