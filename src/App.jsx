import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import MethodologyDrawer from "./components/MethodologyDrawer";
import PrintReport from "./components/PrintReport";
import DeepAssessment from "./views/DeepAssessment";
import Comparison from "./views/Comparison";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_STAGE,
  defaultWeights,
  defaultScores,
  ensureScoreDefaults,
  ensureWeightDefaults,
  seedPartners,
  createCategory,
  createCriterion,
} from "./lib/framework";
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

function normaliseWorkspace(raw) {
  const categories = raw?.framework?.length ? raw.framework : DEFAULT_CATEGORIES;
  const weights = ensureWeightDefaults(raw?.weights ?? defaultWeights(categories), categories);
  const partnersRaw = raw?.partners?.length ? raw.partners : seedPartners();
  const partners = partnersRaw.map((p) => ({
    ...p,
    stage: p.stage ?? DEFAULT_STAGE,
    scores: ensureScoreDefaults(p.scores ?? {}, categories),
  }));
  return { categories, weights, partners, activeId: raw?.activeId ?? partners[0]?.id };
}

export default function App() {
  const persisted = useMemo(() => loadState(), []);
  const initial = useMemo(() => normaliseWorkspace(persisted), [persisted]);

  const [categories, setCategories] = useState(initial.categories);
  const [partners, setPartners] = useState(initial.partners);
  const [weights, setWeights] = useState(initial.weights);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [view, setView] = useState("Deep Assessment");
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const importInputRef = useRef(null);

  useEffect(() => {
    saveState({ framework: categories, partners, weights, activeId });
  }, [categories, partners, weights, activeId]);

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

  const handleResetWeights = () => setWeights(defaultWeights(categories));

  const handleAddPartner = () => {
    const id = uid();
    const newPartner = {
      id,
      name: nextPartnerName(partners),
      note: "",
      stage: DEFAULT_STAGE,
      scores: defaultScores(categories),
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

  const handleStageChange = (id, stage) => {
    setPartners((prev) => prev.map((p) => (p.id === id ? { ...p, stage } : p)));
  };

  // --- Framework editing -------------------------------------------------

  const handleRenameCategory = (categoryKey, name) => {
    setCategories((prev) => prev.map((c) => (c.key === categoryKey ? { ...c, name } : c)));
  };

  const handleRenameCriterion = (categoryKey, criterionKey, name) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.key === categoryKey
          ? { ...c, criteria: c.criteria.map((cr) => (cr.key === criterionKey ? { ...cr, name } : cr)) }
          : c
      )
    );
  };

  const handleAddCriterion = (categoryKey) => {
    const newCriterion = createCriterion();
    setCategories((prev) =>
      prev.map((c) => (c.key === categoryKey ? { ...c, criteria: [...c.criteria, newCriterion] } : c))
    );
    setPartners((prev) =>
      prev.map((p) => ({
        ...p,
        scores: { ...p.scores, [categoryKey]: { ...p.scores[categoryKey], [newCriterion.key]: 3 } },
      }))
    );
  };

  const handleRemoveCriterion = (categoryKey, criterionKey) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.key === categoryKey && c.criteria.length > 1
          ? { ...c, criteria: c.criteria.filter((cr) => cr.key !== criterionKey) }
          : c
      )
    );
  };

  const handleAddCategory = () => {
    const newCat = createCategory();
    setCategories((prev) => [...prev, newCat]);
    setWeights((prev) => ({ ...prev, [newCat.key]: newCat.defaultWeight }));
    setPartners((prev) =>
      prev.map((p) => ({
        ...p,
        scores: { ...p.scores, [newCat.key]: Object.fromEntries(newCat.criteria.map((cr) => [cr.key, 3])) },
      }))
    );
  };

  const handleRemoveCategory = (categoryKey) => {
    if (categories.length <= 1) return;
    setCategories((prev) => prev.filter((c) => c.key !== categoryKey));
    setWeights((prev) => {
      const next = { ...prev };
      delete next[categoryKey];
      return next;
    });
  };

  // --- Data portability ---------------------------------------------------

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      framework: categories,
      weights,
      partners,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `partnership-assessment-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => importInputRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.partners)) throw new Error("Missing partners array");
      const confirmed = window.confirm(
        `Import "${file.name}"? This replaces every partner, category, and weight currently in this browser. This cannot be undone.`
      );
      if (!confirmed) return;
      const normalised = normaliseWorkspace(parsed);
      setCategories(normalised.categories);
      setWeights(normalised.weights);
      setPartners(normalised.partners);
      setActiveId(normalised.activeId);
    } catch {
      window.alert("Could not import this file — it doesn't look like a valid workspace export.");
    }
  };

  const handleResetToSample = () => {
    const confirmed = window.confirm(
      "Reset to illustrative sample data? This replaces every partner, category, and weight currently in this browser. This cannot be undone."
    );
    if (!confirmed) return;
    setCategories(DEFAULT_CATEGORIES);
    setWeights(defaultWeights(DEFAULT_CATEGORIES));
    const seeded = seedPartners();
    setPartners(seeded);
    setActiveId(seeded[0]?.id);
  };

  const activePartner = partners.find((p) => p.id === activeId) ?? partners[0];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="print:hidden flex flex-col min-h-screen">
        <Header
          view={view}
          onViewChange={setView}
          onOpenMethodology={() => setMethodologyOpen(true)}
          onExportJson={handleExportJson}
          onImportClick={handleImportClick}
          onResetToSample={handleResetToSample}
        />

        <input
          ref={importInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={handleImportFile}
        />

        <main className="flex-1">
          {view === "Deep Assessment" ? (
            <DeepAssessment
              partners={partners}
              categories={categories}
              weights={weights}
              activeId={activeId}
              onSelect={setActiveId}
              onAdd={handleAddPartner}
              onRename={handleRename}
              onRemove={handleRemove}
              onScoreChange={handleScoreChange}
              onWeightChange={handleWeightChange}
              onResetWeights={handleResetWeights}
              onStageChange={handleStageChange}
              onRenameCategory={handleRenameCategory}
              onRenameCriterion={handleRenameCriterion}
              onAddCriterion={handleAddCriterion}
              onRemoveCriterion={handleRemoveCriterion}
              onAddCategory={handleAddCategory}
              onRemoveCategory={handleRemoveCategory}
            />
          ) : (
            <Comparison partners={partners} categories={categories} weights={weights} />
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

      {activePartner && (
        <PrintReport partner={activePartner} categories={categories} weights={weights} />
      )}
    </div>
  );
}
