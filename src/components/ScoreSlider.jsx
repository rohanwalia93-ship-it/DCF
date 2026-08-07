import { bandColorFor1to5 } from "../lib/framework";

export default function ScoreSlider({ label, value, onChange }) {
  const color = bandColorFor1to5(value);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-ink-800" style={{ color: "var(--color-ink-800)" }}>
          {label}
        </label>
        <span
          className="font-mono-num text-sm font-semibold w-6 text-right"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-thumb w-full"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${
            ((value - 1) / 4) * 100
          }%, rgba(93,143,181,0.18) ${((value - 1) / 4) * 100}%, rgba(93,143,181,0.18) 100%)`,
        }}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={5}
      />
    </div>
  );
}
