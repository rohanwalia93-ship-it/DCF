import DecisionGauge from "./DecisionGauge";
import VerdictBadge from "./VerdictBadge";
import RadarChart from "./RadarChart";
import ContributionBars from "./ContributionBars";
import {
  computeVerdict,
  categoryAverages,
  generateNarrative,
} from "../lib/framework";

export default function AnalyticsPanel({ partnerName, scores, weights }) {
  const { verdict, score, redline } = computeVerdict(scores, weights);
  const averages = categoryAverages(scores);
  const narrative = generateNarrative(partnerName, scores, weights);

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl border bg-white p-5 flex flex-col items-center"
        style={{ borderColor: "rgba(11,31,51,0.1)" }}
      >
        <DecisionGauge score={score} verdict={verdict} />
        <div className="mt-2">
          <VerdictBadge verdict={verdict} size="lg" />
        </div>
        {redline && (
          <div
            className="mt-4 w-full rounded-lg px-3 py-2.5 text-xs flex gap-2 items-start"
            style={{ backgroundColor: "var(--color-decline-soft)", color: "var(--color-decline)" }}
            role="alert"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0 mt-0.5">
              <path
                d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.5 20.5h17a1.5 1.5 0 001.39-2.46L13.71 3.86a1.5 1.5 0 00-2.42 0z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              <strong>Red-line triggered:</strong> Risk &amp; Governance average is below 2.0.
              Verdict forced to Conditional regardless of overall score.
            </span>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <h3 className="font-display font-semibold text-sm mb-3" style={{ color: "var(--color-ink-950)" }}>
          Category Radar
        </h3>
        <RadarChart averages={averages} />
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <h3 className="font-display font-semibold text-sm mb-4" style={{ color: "var(--color-ink-950)" }}>
          Weighted Contribution
        </h3>
        <ContributionBars scores={scores} weights={weights} />
      </div>

      <div
        className="rounded-xl border p-5"
        style={{ borderColor: "rgba(11,31,51,0.1)", backgroundColor: "var(--color-ink-950)" }}
      >
        <h3 className="font-display font-semibold text-sm mb-2.5 flex items-center gap-2" style={{ color: "white" }}>
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path
              d="M4 19.5V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H8l-4 3.5z"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          Recommendation
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
          {narrative}
        </p>
      </div>
    </div>
  );
}
