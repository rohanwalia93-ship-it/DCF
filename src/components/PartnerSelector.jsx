import { useState } from "react";
import { computeVerdict, VERDICT_META } from "../lib/framework";
import StageBadge from "./StageBadge";

export default function PartnerSelector({ partners, categories, weights, activeId, onSelect, onAdd, onRename, onRemove }) {
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");

  const startEdit = (partner) => {
    setEditingId(partner.id);
    setDraftName(partner.name);
  };

  const commitEdit = () => {
    if (editingId && draftName.trim()) {
      onRename(editingId, draftName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {partners.map((p) => {
        const { verdict } = computeVerdict(p.scores, categories, weights);
        const meta = VERDICT_META[verdict];
        const active = p.id === activeId;
        const isEditing = editingId === p.id;

        if (isEditing) {
          return (
            <input
              key={p.id}
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") setEditingId(null);
              }}
              className="px-3 py-1.5 rounded-full text-sm border font-medium outline-none"
              style={{ borderColor: "var(--color-accent)", minWidth: 120 }}
            />
          );
        }

        return (
          <div key={p.id} className="group relative">
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              onDoubleClick={() => startEdit(p)}
              className="flex items-center gap-2 pl-3 pr-2.5 py-1.5 rounded-full text-sm font-medium border transition-colors"
              style={{
                borderColor: active ? "var(--color-ink-950)" : "rgba(11,31,51,0.15)",
                backgroundColor: active ? "var(--color-ink-950)" : "white",
                color: active ? "white" : "var(--color-ink-800)",
              }}
              title="Click to select, double-click to rename"
            >
              <span className="rounded-full shrink-0" style={{ width: 7, height: 7, backgroundColor: meta.color }} />
              {p.name}
              {!active && <StageBadge stage={p.stage} />}
              {partners.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(p.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onRemove(p.id);
                    }
                  }}
                  className="ml-0.5 rounded-full w-4 h-4 flex items-center justify-center opacity-50 hover:opacity-100"
                  style={{ fontSize: "13px", lineHeight: 1 }}
                  aria-label={`Remove ${p.name}`}
                >
                  ×
                </span>
              )}
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-dashed"
        style={{ borderColor: "var(--color-ink-500)", color: "var(--color-ink-600)" }}
      >
        <span aria-hidden="true">+</span> Add partner
      </button>
    </div>
  );
}
