import { VERDICT_META } from "../lib/framework";

export default function VerdictBadge({ verdict, size = "md" }) {
  const meta = VERDICT_META[verdict];
  const sizeClasses =
    size === "lg"
      ? "text-sm px-4 py-2"
      : size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : "text-xs px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-display font-semibold tracking-wide uppercase ${sizeClasses}`}
      style={{ backgroundColor: meta.soft, color: meta.color }}
    >
      <span
        className="rounded-full"
        style={{
          width: size === "lg" ? 8 : 6,
          height: size === "lg" ? 8 : 6,
          backgroundColor: meta.color,
        }}
      />
      {verdict}
    </span>
  );
}
