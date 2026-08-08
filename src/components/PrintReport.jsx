import {
  computeVerdict,
  categoryAverages,
  weightedContributions,
  generateNarrative,
  RISK_CATEGORY_KEY,
  RISK_REDLINE_THRESHOLD,
} from "../lib/framework";

export default function PrintReport({ partner, categories, weights }) {
  const { verdict, score, redline } = computeVerdict(partner.scores, categories, weights);
  const averages = categoryAverages(partner.scores, categories);
  const contributions = weightedContributions(partner.scores, categories, weights).sort(
    (a, b) => b.points - a.points
  );
  const narrative = generateNarrative(partner.name, partner.scores, categories, weights);
  const riskCategory = categories.find((c) => c.key === RISK_CATEGORY_KEY);

  return (
    <div className="hidden print:block text-black" style={{ fontFamily: "Inter, sans-serif" }}>
      <header className="flex items-start justify-between border-b-2 border-black pb-3 mb-5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">
            Strategic Partnership Assessment · Preliminary Screening
          </p>
          <h1 className="text-2xl font-bold mt-1">{partner.name}</h1>
          <p className="text-xs text-gray-500 mt-1">
            Stage: {partner.stage} · Generated {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono">{score.toFixed(1)}</div>
          <div className="text-xs text-gray-500">/ 100 weighted score</div>
          <div className="text-sm font-semibold mt-1 uppercase">{verdict}</div>
        </div>
      </header>

      {redline && (
        <div className="border border-black rounded p-2.5 mb-5 text-xs">
          <strong>Red-line triggered:</strong> {riskCategory?.name ?? "Risk & Governance"} averages{" "}
          {averages[RISK_CATEGORY_KEY]?.toFixed(1)}/5, below the {RISK_REDLINE_THRESHOLD.toFixed(1)}{" "}
          threshold. Verdict forced to Conditional regardless of overall score.
        </div>
      )}

      <table className="w-full text-xs border-collapse mb-5">
        <thead>
          <tr className="border-b border-black">
            <th className="text-left py-1.5">Category</th>
            <th className="text-right py-1.5">Avg /5</th>
            <th className="text-right py-1.5">Weight</th>
            <th className="text-right py-1.5">Points /100</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((c) => (
            <tr key={c.key} className="border-b border-gray-300">
              <td className="py-1.5">{c.name}</td>
              <td className="text-right font-mono py-1.5">{c.average.toFixed(1)}</td>
              <td className="text-right font-mono py-1.5">{(c.weight * 100).toFixed(0)}%</td>
              <td className="text-right font-mono py-1.5 font-semibold">{c.points.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className="mb-5">
        <h2 className="text-sm font-bold mb-1.5">Recommendation</h2>
        <p className="text-xs leading-relaxed">{narrative}</p>
      </section>

      <footer className="text-[10px] text-gray-500 border-t border-gray-300 pt-2">
        Illustrative sample data for preliminary screening purposes only. Not a substitute for financial
        modelling, legal review, or full due diligence.
      </footer>
    </div>
  );
}
