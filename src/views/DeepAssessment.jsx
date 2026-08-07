import PartnerSelector from "../components/PartnerSelector";
import CategoryBlock from "../components/CategoryBlock";
import WeightingPanel from "../components/WeightingPanel";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { CATEGORIES, RISK_CATEGORY_KEY, isRiskRedline } from "../lib/framework";

export default function DeepAssessment({
  partners,
  weights,
  activeId,
  onSelect,
  onAdd,
  onRename,
  onRemove,
  onScoreChange,
  onWeightChange,
  onResetWeights,
}) {
  const partner = partners.find((p) => p.id === activeId) ?? partners[0];
  const redlineActive = partner ? isRiskRedline(partner.scores) : false;

  if (!partner) return null;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h2 className="font-display font-semibold text-lg mb-3" style={{ color: "var(--color-ink-950)" }}>
          Partners
        </h2>
        <PartnerSelector
          partners={partners}
          weights={weights}
          activeId={partner.id}
          onSelect={onSelect}
          onAdd={onAdd}
          onRename={onRename}
          onRemove={onRemove}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
        <div className="space-y-4">
          {CATEGORIES.map((cat, i) => (
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
          <WeightingPanel weights={weights} onWeightChange={onWeightChange} onReset={onResetWeights} />
        </div>

        <div className="lg:sticky lg:top-20">
          <AnalyticsPanel partnerName={partner.name} scores={partner.scores} weights={weights} />
        </div>
      </div>
    </div>
  );
}
