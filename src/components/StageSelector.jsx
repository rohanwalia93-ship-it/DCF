import { DEAL_STAGES } from "../lib/framework";

export default function StageSelector({ stage, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="deal-stage" className="text-xs font-medium" style={{ color: "var(--color-ink-500)" }}>
        Deal stage
      </label>
      <select
        id="deal-stage"
        value={stage}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-medium rounded-lg border px-2.5 py-1.5 bg-white outline-none"
        style={{ borderColor: "rgba(11,31,51,0.15)", color: "var(--color-ink-800)" }}
      >
        {DEAL_STAGES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
