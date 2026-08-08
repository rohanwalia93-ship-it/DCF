import { computeVerdict, priorityAxes, bandColorFor0to100 } from "../lib/framework";
import { shortLabel } from "../lib/text";

const SIZE = 400;
const PAD_LEFT = 46;
const PAD_RIGHT = 20;
const PAD_TOP = 20;
const PAD_BOTTOM = 44;
const PLOT_W = SIZE - PAD_LEFT - PAD_RIGHT;
const PLOT_H = SIZE - PAD_TOP - PAD_BOTTOM;
const MID_X = PAD_LEFT + PLOT_W / 2;
const MID_Y = PAD_TOP + PLOT_H / 2;

function toPx(value, confidence) {
  const x = PAD_LEFT + ((value - 1) / 4) * PLOT_W;
  const y = PAD_TOP + PLOT_H - ((confidence - 1) / 4) * PLOT_H;
  return { x, y };
}

const QUADRANTS = [
  { label: "De-risk First", x: PAD_LEFT, y: PAD_TOP, anchor: "start", color: "var(--color-explore)" },
  { label: "Prioritise", x: SIZE - PAD_RIGHT, y: PAD_TOP, anchor: "end", color: "var(--color-pursue)" },
  { label: "Deprioritise", x: PAD_LEFT, y: SIZE - PAD_BOTTOM, anchor: "start", color: "var(--color-decline)" },
  { label: "Opportunistic", x: SIZE - PAD_RIGHT, y: SIZE - PAD_BOTTOM, anchor: "end", color: "var(--color-accent)" },
];

export default function PriorityMatrix({ partners, categories, weights }) {
  if (partners.length === 0) {
    return (
      <p className="text-sm py-10 text-center" style={{ color: "var(--color-ink-500)" }}>
        No partners match the current filter.
      </p>
    );
  }

  const points = partners.map((p) => {
    const { value, confidence } = priorityAxes(p.scores, categories);
    const { verdict, score } = computeVerdict(p.scores, categories, weights);
    return { partner: p, value, confidence, verdict, score, ...toPx(value, confidence) };
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[440px] mx-auto"
      style={{ overflow: "visible" }}
      role="img"
      aria-label="Priority matrix: strategic and commercial value versus execution confidence"
    >
      {/* Quadrant tints */}
      <rect x={PAD_LEFT} y={PAD_TOP} width={PLOT_W / 2} height={PLOT_H / 2} fill="var(--color-explore)" fillOpacity="0.06" />
      <rect x={MID_X} y={PAD_TOP} width={PLOT_W / 2} height={PLOT_H / 2} fill="var(--color-pursue)" fillOpacity="0.07" />
      <rect x={PAD_LEFT} y={MID_Y} width={PLOT_W / 2} height={PLOT_H / 2} fill="var(--color-decline)" fillOpacity="0.05" />
      <rect x={MID_X} y={MID_Y} width={PLOT_W / 2} height={PLOT_H / 2} fill="var(--color-accent)" fillOpacity="0.06" />

      {/* Border + midlines */}
      <rect x={PAD_LEFT} y={PAD_TOP} width={PLOT_W} height={PLOT_H} fill="none" stroke="var(--color-ink-400)" strokeOpacity="0.3" />
      <line x1={MID_X} y1={PAD_TOP} x2={MID_X} y2={SIZE - PAD_BOTTOM} stroke="var(--color-ink-400)" strokeOpacity="0.35" strokeDasharray="3 3" />
      <line x1={PAD_LEFT} y1={MID_Y} x2={SIZE - PAD_RIGHT} y2={MID_Y} stroke="var(--color-ink-400)" strokeOpacity="0.35" strokeDasharray="3 3" />

      {/* Quadrant labels */}
      {QUADRANTS.map((q) => (
        <text
          key={q.label}
          x={q.anchor === "start" ? q.x + 6 : q.x - 6}
          y={q.y === PAD_TOP ? q.y + 14 : q.y - 8}
          textAnchor={q.anchor}
          style={{ fontSize: "10px", fontWeight: 600, fill: q.color, letterSpacing: "0.02em" }}
        >
          {q.label.toUpperCase()}
        </text>
      ))}

      {/* Axis labels */}
      <text x={PAD_LEFT + PLOT_W / 2} y={SIZE - 10} textAnchor="middle" style={{ fontSize: "10.5px", fill: "var(--color-ink-500)" }}>
        Strategic &amp; Commercial Value →
      </text>
      <text
        x={0}
        y={0}
        transform={`translate(14, ${PAD_TOP + PLOT_H / 2}) rotate(-90)`}
        textAnchor="middle"
        style={{ fontSize: "10.5px", fill: "var(--color-ink-500)" }}
      >
        Execution Confidence →
      </text>

      {/* Partner bubbles */}
      {points.map((p) => (
        <g key={p.partner.id}>
          <circle cx={p.x} cy={p.y} r="9" fill={bandColorFor0to100(p.score)} fillOpacity="0.85" stroke="white" strokeWidth="1.5" />
          <text
            x={p.x}
            y={p.y - 14}
            textAnchor="middle"
            style={{ fontSize: "10px", fontWeight: 600, fill: "var(--color-ink-950)" }}
          >
            {shortLabel(p.partner.name, 16)}
          </text>
        </g>
      ))}
    </svg>
  );
}
