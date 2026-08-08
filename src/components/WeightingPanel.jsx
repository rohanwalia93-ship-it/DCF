import { useState } from "react";
import { weightsTotal } from "../lib/framework";

export default function WeightingPanel({ categories, weights, onWeightChange, onReset }) {
  const [open, setOpen] = useState(false);
  const total = weightsTotal(weights);
  const totalOk = Math.abs(total - 100) < 0.01;

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
        <div>
          <h3 className="font-display font-semibold text-sm" style={{ color: "var(--color-ink-950)" }}>
            Adjust weighting model (scenario)
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-500)" }}>
            Reweight categories to stress-test the verdict
          </p>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className="shrink-0"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 200ms ease", color: "var(--color-ink-500)" }}
        >
          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: "rgba(11,31,51,0.08)" }}>
          <div className="flex items-center justify-between pt-3">
            <span
              className="font-mono-num text-xs px-2 py-1 rounded"
              style={{
                backgroundColor: totalOk ? "var(--color-pursue-soft)" : "var(--color-explore-soft)",
                color: totalOk ? "var(--color-pursue)" : "var(--color-explore)",
              }}
            >
              Total: {total.toFixed(0)}%{!totalOk && " (auto-normalised)"}
            </span>
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-medium underline underline-offset-2"
              style={{ color: "var(--color-accent)" }}
            >
              Reset to default
            </button>
          </div>
          {categories.map((cat) => {
            const w = weights[cat.key] ?? 0;
            return (
              <div key={cat.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm" style={{ color: "var(--color-ink-800)" }}>{cat.name}</label>
                  <span className="font-mono-num text-sm font-semibold" style={{ color: "var(--color-ink-950)" }}>
                    {w}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  step={1}
                  value={w}
                  onChange={(e) => onWeightChange(cat.key, Number(e.target.value))}
                  className="range-thumb w-full"
                  style={{
                    background: `linear-gradient(to right, var(--color-ink-700) 0%, var(--color-ink-700) ${
                      (w / 40) * 100
                    }%, rgba(93,143,181,0.18) ${(w / 40) * 100}%, rgba(93,143,181,0.18) 100%)`,
                  }}
                  aria-label={`${cat.name} weight`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
