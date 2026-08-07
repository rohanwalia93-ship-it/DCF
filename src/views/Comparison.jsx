import RankedBarChart from "../components/RankedBarChart";
import HeatMap from "../components/HeatMap";

export default function Comparison({ partners, weights }) {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <h2 className="font-display font-semibold text-lg mb-1" style={{ color: "var(--color-ink-950)" }}>
          Ranked by Weighted Score
        </h2>
        <p className="text-xs mb-5" style={{ color: "var(--color-ink-500)" }}>
          Reflects the current weighting model — adjust it in Deep Assessment to re-rank.
        </p>
        <RankedBarChart partners={partners} weights={weights} />
      </div>

      <div className="rounded-xl border bg-white p-5" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <h2 className="font-display font-semibold text-lg mb-1" style={{ color: "var(--color-ink-950)" }}>
          Category Heat Map
        </h2>
        <p className="text-xs mb-5" style={{ color: "var(--color-ink-500)" }}>
          Sub-criteria averages per category, 1 (weak) to 5 (strong).
        </p>
        <HeatMap partners={partners} weights={weights} />
      </div>
    </div>
  );
}
