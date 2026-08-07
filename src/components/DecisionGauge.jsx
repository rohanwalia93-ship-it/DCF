import { bandColorFor0to100 } from "../lib/framework";

const R = 96;
const CX = 110;
const CY = 106;
const STROKE = 16;

function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function angleForScore(score) {
  return 180 + (Math.max(0, Math.min(100, score)) / 100) * 180;
}

export default function DecisionGauge({ score, verdict }) {
  const clamped = Math.max(0, Math.min(100, score));
  const needleAngle = angleForScore(clamped);
  const color = bandColorFor0to100(clamped);

  const track = arcPath(CX, CY, R, 180, 360);
  const fill = arcPath(CX, CY, R, 180, needleAngle);

  const tick50 = polar(CX, CY, R + 12, angleForScore(50));
  const tick70 = polar(CX, CY, R + 12, angleForScore(70));

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 220 130"
        className="w-full max-w-[280px]"
        role="img"
        aria-label={`Decision gauge: weighted score ${clamped.toFixed(1)} out of 100, verdict ${verdict}`}
      >
        <path
          d={track}
          fill="none"
          stroke="var(--color-ink-400)"
          strokeOpacity="0.18"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
        <path
          d={fill}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          style={{ transition: "d 300ms ease, stroke 300ms ease" }}
        />
        <line
          x1={CX}
          y1={CY}
          x2={polar(CX, CY, R - STROKE / 2 - 4, needleAngle).x}
          y2={polar(CX, CY, R - STROKE / 2 - 4, needleAngle).y}
          stroke="var(--color-ink-950)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: "all 300ms ease" }}
        />
        <circle cx={CX} cy={CY} r="5" fill="var(--color-ink-950)" />

        <line
          x1={tick50.x}
          y1={tick50.y}
          x2={polar(CX, CY, R + 4, angleForScore(50)).x}
          y2={polar(CX, CY, R + 4, angleForScore(50)).y}
          stroke="var(--color-ink-500)"
          strokeWidth="2"
        />
        <line
          x1={tick70.x}
          y1={tick70.y}
          x2={polar(CX, CY, R + 4, angleForScore(70)).x}
          y2={polar(CX, CY, R + 4, angleForScore(70)).y}
          stroke="var(--color-ink-500)"
          strokeWidth="2"
        />

        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          className="font-mono-num"
          style={{ fontSize: "34px", fontWeight: 600, fill: "var(--color-ink-950)" }}
        >
          {clamped.toFixed(1)}
        </text>
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          style={{ fontSize: "11px", fill: "var(--color-ink-500)", letterSpacing: "0.06em" }}
        >
          WEIGHTED SCORE / 100
        </text>
      </svg>
      <div className="flex items-center justify-between w-full max-w-[220px] -mt-2 px-1 text-[10px] font-mono-num" style={{ color: "var(--color-ink-500)" }}>
        <span>0</span>
        <span>50</span>
        <span>70</span>
        <span>100</span>
      </div>
    </div>
  );
}
