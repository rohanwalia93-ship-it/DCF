const STAGE_COLORS = {
  Screening: "var(--color-ink-500)",
  Diligence: "var(--color-accent)",
  Negotiation: "var(--color-explore)",
  Closed: "var(--color-pursue)",
};

export default function StageBadge({ stage }) {
  const color = STAGE_COLORS[stage] ?? "var(--color-ink-500)";
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-mono-num font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
      style={{ backgroundColor: `color-mix(in srgb, ${color} 14%, white)`, color }}
    >
      {stage}
    </span>
  );
}
