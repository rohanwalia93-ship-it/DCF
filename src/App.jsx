import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import MethodologyDrawer from "./components/MethodologyDrawer";
import DeepAssessment from "./views/DeepAssessment";
import Comparison from "./views/Comparison";
import { defaultWeights, defaultScores, seedPartners } from "./lib/framework";
import { loadState, saveState } from "./lib/storage";

function uid() {
  return `partner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nextPartnerName(existing) {
  let n = existing.length + 1;
  let name = `New Partner ${n}`;
  const names = new Set(existing.map((p) => p.name));
  while (names.has(name)) {
    n += 1;
    name = `New Partner ${n}`;
  }
  return name;
}

export default function App() {
  const persisted = useMemo(() => loadState(), []);

  const [partners, setPartners] = useState(persisted?.partners ?? seedPartners());
  const [weights, setWeights] = useState(persisted?.weights ?? defaultWeights());
  const [activeId, setActiveId] = useState(persisted?.activeId ?? partners[0]?.id);
  const [view, setView] = useState("Deep Assessment");
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  useEffect(() => {
    saveState({ partners, weights, activeId });
  }, [partners, weights, activeId]);

  const handleScoreChange = (partnerId, categoryKey, criterionKey, value) => {
    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? {
              ...p,
              scores: {
                ...p.scores,
                [categoryKey]: { ...p.scores[categoryKey], [criterionKey]: value },
              },
            }
          : p
      )
    );
  };

  const handleWeightChange = (categoryKey, value) => {
    setWeights((prev) => ({ ...prev, [categoryKey]: value }));
  };

  const handleResetWeights = () => setWeights(defaultWeights());

  const handleAddPartner = () => {
    const id = uid();
    const newPartner = {
      id,
      name: nextPartnerName(partners),
      note: "",
      scores: defaultScores(),
    };
    setPartners((prev) => [...prev, newPartner]);
    setActiveId(id);
  };

  const handleRename = (id, name) => {
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleRemove = (id) => {
    setPartners((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (activeId === id && next.length > 0) setActiveId(next[0].id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header view={view} onViewChange={setView} onOpenMethodology={() => setMethodologyOpen(true)} />

      <main className="flex-1">
        {view === "Deep Assessment" ? (
          <DeepAssessment
            partners={partners}
            weights={weights}
            activeId={activeId}
            onSelect={setActiveId}
            onAdd={handleAddPartner}
            onRename={handleRename}
            onRemove={handleRemove}
            onScoreChange={handleScoreChange}
            onWeightChange={handleWeightChange}
            onResetWeights={handleResetWeights}
          />
        ) : (
          <Comparison partners={partners} weights={weights} />
        )}
      </main>

      <footer className="border-t py-5 px-4 sm:px-6" style={{ borderColor: "rgba(11,31,51,0.1)" }}>
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ color: "var(--color-ink-500)" }}>
          <span>Strategic Partnership Assessment — preliminary screening instrument. Illustrative sample data only.</span>
          <span>All data stored locally in your browser.</span>
        </div>
      </footer>

      <MethodologyDrawer open={methodologyOpen} onClose={() => setMethodologyOpen(false)} />
    </div>
  );
}
