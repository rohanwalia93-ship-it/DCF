import { useState } from "react";
import RankedBarChart from "../components/RankedBarChart";
import HeatMap from "../components/HeatMap";
import { DEAL_STAGES } from "../lib/framework";

export default function Comparison({ partners, categories, weights }) {
  const [stageFilter, setStageFilter] = useState("All");
  const filtered =
    stageFilter === "All" ? partners : partners.filter((p) => p.stage === stageFilter);

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium" style={{ color: "var(--color-ink-500)" }}>
          Filter by stage
        </span>
        {["All", ...DEAL_STAGES].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStageFilter(s)}
            className="text-xs font-medium px-2.5 py-1 rounded-full border transition-colors"
            style={{
              borderColor: stageFilter === s ? "var(--color-ink-950)" : "rgba(11,31,51,0.15)",
              backgroundColor: stageFilter === s ? "var(--color-ink-950)" : "white",
              color: stageFilter === s ? "white" : "var(--color-ink-700)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <h2 className="font-display font-semibold text-lg mb-1" style={{ color: "var(--color-ink-950)" }}>
          Ranked by Weighted Score
        </h2>
        <p className="text-xs mb-5" style={{ color: "var(--color-ink-500)" }}>
          Reflects the current weighting model — adjust it in Deep Assessment to re-rank.
        </p>
        <RankedBarChart partners={filtered} categories={categories} weights={weights} />
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <h2 className="font-display font-semibold text-lg mb-1" style={{ color: "var(--color-ink-950)" }}>
          Category Heat Map
        </h2>
        <p className="text-xs mb-5" style={{ color: "var(--color-ink-500)" }}>
          Sub-criteria averages per category, 1 (weak) to 5 (strong).
        </p>
        <HeatMap partners={filtered} categories={categories} weights={weights} />
      </div>
    </div>
  );
}
