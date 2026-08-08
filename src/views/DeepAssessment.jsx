import PartnerSelector from "../components/PartnerSelector";
import CategoryBlock from "../components/CategoryBlock";
import WeightingPanel from "../components/WeightingPanel";
import FrameworkEditor from "../components/FrameworkEditor";
import AnalyticsPanel from "../components/AnalyticsPanel";
import StageSelector from "../components/StageSelector";
import { RISK_CATEGORY_KEY, isRiskRedline } from "../lib/framework";

export default function DeepAssessment({
  partners,
  categories,
  weights,
  activeId,
  onSelect,
  onAdd,
  onRename,
  onRemove,
  onScoreChange,
  onWeightChange,
  onResetWeights,
  onStageChange,
  onRenameCategory,
  onRenameCriterion,
  onAddCriterion,
  onRemoveCriterion,
  onAddCategory,
  onRemoveCategory,
}) {
  const partner = partners.find((p) => p.id === activeId) ?? partners[0];
  const redlineActive = partner ? isRiskRedline(partner.scores, categories) : false;

  if (!partner) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-lg mb-3" style={{ color: "var(--color-ink-950)" }}>
            Partners
          </h2>
          <PartnerSelector
            partners={partners}
            categories={categories}
            weights={weights}
            activeId={partner.id}
            onSelect={onSelect}
            onAdd={onAdd}
            onRename={onRename}
            onRemove={onRemove}
          />
        </div>
        <StageSelector stage={partner.stage} onChange={(stage) => onStageChange(partner.id, stage)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
        <div className="space-y-4">
          {categories.map((cat, i) => (
            <CategoryBlock
              key={cat.key}
              category={cat}
              scores={partner.scores}
              weights={weights}
              defaultOpen={i === 0}
              isRedlineCategory={cat.key === RISK_CATEGORY_KEY}
              redlineActive={redlineActive}
              onScoreChange={(catKey, critKey, value) =>
                onScoreChange(partner.id, catKey, critKey, value)
              }
            />
          ))}
          <WeightingPanel
            categories={categories}
            weights={weights}
            onWeightChange={onWeightChange}
            onReset={onResetWeights}
          />
          <FrameworkEditor
            categories={categories}
            onRenameCategory={onRenameCategory}
            onRenameCriterion={onRenameCriterion}
            onAddCriterion={onAddCriterion}
            onRemoveCriterion={onRemoveCriterion}
            onAddCategory={onAddCategory}
            onRemoveCategory={onRemoveCategory}
          />
        </div>

        <div className="lg:sticky lg:top-20">
          <AnalyticsPanel
            partnerName={partner.name}
            scores={partner.scores}
            categories={categories}
            weights={weights}
            exportSlot={
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
                style={{ borderColor: "rgba(11,31,51,0.15)", color: "var(--color-ink-600)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24">
                  <path
                    d="M7 8V3h10v5M7 17h10v5H7v-5zM5 8h14a2 2 0 012 2v6h-4M5 8a2 2 0 00-2 2v6h4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Export PDF
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
