import { useState } from "react";
import { RISK_CATEGORY_KEY } from "../lib/framework";

function TextField({ value, onChange, className = "", ...rest }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent outline-none border-b border-transparent focus:border-current px-0.5 ${className}`}
      {...rest}
    />
  );
}

export default function FrameworkEditor({
  categories,
  onRenameCategory,
  onRenameCriterion,
  onAddCriterion,
  onRemoveCriterion,
  onAddCategory,
  onRemoveCategory,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-xl border bg-white overflow-hidden"
      style={{ borderColor: "rgba(11,31,51,0.1)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <div>
          <h3 className="font-display font-semibold text-sm" style={{ color: "var(--color-ink-950)" }}>
            Edit assessment framework
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-500)" }}>
            Rename, add, or remove categories and sub-criteria
          </p>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className="shrink-0"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 200ms ease", color: "var(--color-ink-500)" }}
        >
          <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-5 border-t" style={{ borderColor: "rgba(11,31,51,0.08)" }}>
          <p className="text-xs pt-3" style={{ color: "var(--color-ink-500)" }}>
            Renaming a category or criterion keeps its scores. Adding a new item starts it at a neutral
            score of 3. Risk &amp; Governance can be renamed but not removed — the red-line rule depends
            on it.
          </p>
          {categories.map((cat) => {
            const isProtected = cat.key === RISK_CATEGORY_KEY;
            return (
              <div key={cat.key} className="rounded-lg p-3" style={{ backgroundColor: "var(--color-surface)" }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <TextField
                    value={cat.name}
                    onChange={(v) => onRenameCategory(cat.key, v)}
                    className="font-display font-semibold text-sm flex-1"
                    style={{ color: "var(--color-ink-950)" }}
                    aria-label="Category name"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveCategory(cat.key)}
                    disabled={isProtected || categories.length <= 1}
                    className="text-xs font-medium px-2 py-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: "var(--color-decline)" }}
                    title={isProtected ? "Risk & Governance cannot be removed" : "Remove category"}
                  >
                    Remove category
                  </button>
                </div>
                <div className="space-y-1.5 pl-1">
                  {cat.criteria.map((crit) => (
                    <div key={crit.key} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "var(--color-ink-400)" }} />
                      <TextField
                        value={crit.name}
                        onChange={(v) => onRenameCriterion(cat.key, crit.key, v)}
                        className="text-sm flex-1"
                        style={{ color: "var(--color-ink-800)" }}
                        aria-label="Criterion name"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveCriterion(cat.key, crit.key)}
                        disabled={cat.criteria.length <= 1}
                        className="text-xs w-5 h-5 rounded flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: "var(--color-decline)" }}
                        aria-label={`Remove ${crit.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onAddCriterion(cat.key)}
                  className="text-xs font-medium mt-2 ml-1"
                  style={{ color: "var(--color-accent)" }}
                >
                  + Add criterion
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={onAddCategory}
            className="w-full text-sm font-medium py-2 rounded-lg border border-dashed"
            style={{ borderColor: "var(--color-ink-500)", color: "var(--color-ink-600)" }}
          >
            + Add category
          </button>
        </div>
      )}
    </div>
  );
}
