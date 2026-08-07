import { CATEGORIES } from "../lib/framework";

const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 105;
const MAX = 5;
const RINGS = [1, 2, 3, 4, 5];

function pointFor(index, value) {
  const angle = (Math.PI * 2 * index) / CATEGORIES.length - Math.PI / 2;
  const r = (value / MAX) * R;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function labelPointFor(index) {
  const angle = (Math.PI * 2 * index) / CATEGORIES.length - Math.PI / 2;
  const r = R + 30;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

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

export default function RadarChart({ averages }) {
  const points = CATEGORIES.map((cat, i) => pointFor(i, averages[cat.key] ?? 0));
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[340px] mx-auto" role="img" aria-label="Radar chart of category averages">
      {RINGS.map((ring) => {
        const r = (ring / MAX) * R;
        const ringPoints = CATEGORIES.map((_, i) => {
          const angle = (Math.PI * 2 * i) / CATEGORIES.length - Math.PI / 2;
          return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`;
        }).join(" ");
        return (
          <polygon
            key={ring}
            points={ringPoints}
            fill="none"
            stroke="var(--color-ink-400)"
            strokeOpacity={ring === MAX ? 0.35 : 0.15}
            strokeWidth="1"
          />
        );
      })}

      {CATEGORIES.map((_, i) => {
        const p = pointFor(i, MAX);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={p.x}
            y2={p.y}
            stroke="var(--color-ink-400)"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={polygon}
        fill="var(--color-accent)"
        fillOpacity="0.22"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinejoin="round"
        style={{ transition: "all 250ms ease" }}
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-accent)" style={{ transition: "all 250ms ease" }} />
      ))}

      {CATEGORIES.map((cat, i) => {
        const lp = labelPointFor(i);
        const anchor = Math.abs(lp.x - CX) < 8 ? "middle" : lp.x > CX ? "start" : "end";
        return (
          <text
            key={cat.key}
            x={lp.x}
            y={lp.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            style={{ fontSize: "9.5px", fill: "var(--color-ink-700)", fontWeight: 500 }}
          >
            {SHORT_LABELS[cat.key]}
          </text>
        );
      })}
    </svg>
  );
}
