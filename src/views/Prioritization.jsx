import { useState } from "react";
import PriorityMatrix from "../components/PriorityMatrix";
import VerdictBadge from "../components/VerdictBadge";
import StageBadge from "../components/StageBadge";
import { DEAL_STAGES, computeVerdict, priorityAxes, priorityQuadrant } from "../lib/framework";

export default function Prioritization({ partners, categories, weights }) {
  const [stageFilter, setStageFilter] = useState("All");
  const filtered =
    stageFilter === "All" ? partners : partners.filter((p) => p.stage === stageFilter);

  const rows = filtered
    .map((p) => {
      const { value, confidence } = priorityAxes(p.scores, categories);
      const quadrant = priorityQuadrant(value, confidence);
      return { partner: p, value, confidence, quadrant, ...computeVerdict(p.scores, categories, weights) };
    })
    .sort((a, b) => b.value - a.value || b.confidence - a.confidence);

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
          Priority Matrix
        </h2>
        <p className="text-xs mb-5 max-w-prose" style={{ color: "var(--color-ink-500)" }}>
          Plots each partner on two composite axes: <strong>Strategic &amp; Commercial Value</strong>{" "}
          (Strategic Fit, Synergy, Market Attractiveness) against{" "}
          <strong>Execution Confidence</strong> (Partner Strength, Risk &amp; Governance, Capability
          Fit). Bubble colour reflects the headline score band. This is a triage lens, not a
          replacement for the full weighted verdict — a red-line Conditional partner can still plot
          in the top-right quadrant if its qualitative averages are otherwise strong.
        </p>
        <PriorityMatrix partners={filtered} categories={categories} weights={weights} />
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <h2 className="font-display font-semibold text-lg mb-4" style={{ color: "var(--color-ink-950)" }}>
          Quadrant Assignments
        </h2>
        {rows.length === 0 ? (
          <p className="text-sm py-6 text-center" style={{ color: "var(--color-ink-500)" }}>
            No partners match the current filter.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full border-collapse min-w-[560px]">
              <thead>
                <tr className="text-left text-xs font-medium" style={{ color: "var(--color-ink-500)" }}>
                  <th className="pb-2 px-2">Partner</th>
                  <th className="pb-2 px-2 text-right">Value</th>
                  <th className="pb-2 px-2 text-right">Confidence</th>
                  <th className="pb-2 px-2">Quadrant</th>
                  <th className="pb-2 px-2">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.partner.id} className="border-t" style={{ borderColor: "rgba(11,31,51,0.06)" }}>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: "var(--color-ink-950)" }}>
                          {r.partner.name}
                        </span>
                        <StageBadge stage={r.partner.stage} />
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right font-mono-num text-sm">{r.value.toFixed(1)}</td>
                    <td className="py-2 px-2 text-right font-mono-num text-sm">{r.confidence.toFixed(1)}</td>
                    <td className="py-2 px-2 text-sm">{r.quadrant}</td>
                    <td className="py-2 px-2">
                      <VerdictBadge verdict={r.verdict} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
