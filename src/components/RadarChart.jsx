import { shortLabel } from "../lib/text";

const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 88;
const MAX = 5;
const RINGS = [1, 2, 3, 4, 5];

function pointFor(index, value, count) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  const r = (value / MAX) * R;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

function labelPointFor(index, count) {
  const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
  const r = R + 34;
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

export default function RadarChart({ averages, categories }) {
  const count = categories.length;
  if (count < 3) {
    return (
      <p className="text-xs text-center py-8" style={{ color: "var(--color-ink-500)" }}>
        Add at least 3 categories to render a radar chart.
      </p>
    );
  }

  const points = categories.map((cat, i) => pointFor(i, averages[cat.key] ?? 0, count));
  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[300px] mx-auto"
      style={{ overflow: "visible" }}
      role="img"
      aria-label="Radar chart of category averages"
    >
      {RINGS.map((ring) => {
        const r = (ring / MAX) * R;
        const ringPoints = categories.map((_, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
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

      {categories.map((cat, i) => {
        const p = pointFor(i, MAX, count);
        return (
          <line
            key={cat.key}
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
        <circle key={categories[i].key} cx={p.x} cy={p.y} r="3" fill="var(--color-accent)" style={{ transition: "all 250ms ease" }} />
      ))}

      {categories.map((cat, i) => {
        const lp = labelPointFor(i, count);
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
            {shortLabel(cat.name, 12)}
          </text>
        );
      })}
    </svg>
  );
}
