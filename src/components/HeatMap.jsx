import { CATEGORIES, categoryAverages, computeVerdict, bandColorFor0to100 } from "../lib/framework";

const SHORT_LABELS = {
  strategicFit: "Strategic Fit",
  synergy: "Synergy",
  partnerStrength: "Partner Strength",
  marketAttractiveness: "Market Attract.",
  capabilityFit: "Capability Fit",
  riskGovernance: "Risk & Gov.",
  culturalFit: "Cultural Fit",
  esg: "ESG",
};

function cellColor(value) {
  // 1 -> decline red, 3 -> explore amber, 5 -> pursue green, interpolated
  const stops = [
    { v: 1, c: [192, 73, 47] },
    { v: 3, c: [200, 138, 30] },
    { v: 5, c: [30, 158, 106] },
  ];
  let lo = stops[0];
  let hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (value >= stops[i].v && value <= stops[i + 1].v) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const t = hi.v === lo.v ? 0 : (value - lo.v) / (hi.v - lo.v);
  const rgb = lo.c.map((c, i) => Math.round(c + (hi.c[i] - c) * t));
  return `rgb(${rgb.join(",")})`;
}

function textColorFor(value) {
  return value <= 1.6 || value >= 3.4 ? "white" : "#3a2a05";
}

export default function HeatMap({ partners, weights }) {
  const rows = partners.map((p) => ({
    partner: p,
    averages: categoryAverages(p.scores),
    ...computeVerdict(p.scores, weights),
  }));

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full border-collapse min-w-[720px]">
        <thead>
          <tr>
            <th className="text-left text-xs font-medium pb-2 px-2 sticky left-0 bg-inherit" style={{ color: "var(--color-ink-500)" }}>
              Partner
            </th>
            {CATEGORIES.map((cat) => (
              <th key={cat.key} className="text-center text-[10.5px] font-medium pb-2 px-1.5" style={{ color: "var(--color-ink-500)" }}>
                {SHORT_LABELS[cat.key]}
              </th>
            ))}
            <th className="text-right text-xs font-semibold pb-2 px-2" style={{ color: "var(--color-ink-950)" }}>
              Score /100
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.partner.id}>
              <td className="text-sm font-medium py-1.5 px-2 whitespace-nowrap" style={{ color: "var(--color-ink-950)" }}>
                {r.partner.name}
              </td>
              {CATEGORIES.map((cat) => {
                const val = r.averages[cat.key];
                return (
                  <td key={cat.key} className="p-1">
                    <div
                      className="rounded-md text-center py-1.5 font-mono-num text-xs font-semibold"
                      style={{ backgroundColor: cellColor(val), color: textColorFor(val) }}
                    >
                      {val.toFixed(1)}
                    </div>
                  </td>
                );
              })}
              <td
                className="text-right font-mono-num text-sm font-bold py-1.5 px-2"
                style={{ color: bandColorFor0to100(r.score) }}
              >
                {r.score.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-4 px-2 text-[11px]" style={{ color: "var(--color-ink-500)" }}>
        <span>1 (weak)</span>
        <div
          className="h-2.5 w-32 rounded-full"
          style={{ background: "linear-gradient(to right, rgb(192,73,47), rgb(200,138,30), rgb(30,158,106))" }}
        />
        <span>5 (strong)</span>
      </div>
    </div>
  );
}
