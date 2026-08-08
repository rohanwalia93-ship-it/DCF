import { useEffect } from "react";

export default function MethodologyDrawer({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(11,31,51,0.5)" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full sm:max-w-lg h-full bg-white overflow-y-auto shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="How this works"
      >
        <div
          className="sticky top-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b bg-white z-10"
          style={{ borderColor: "rgba(11,31,51,0.1)" }}
        >
          <h2 className="font-display font-semibold text-base" style={{ color: "var(--color-ink-950)" }}>
            How this works
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-surface)", color: "var(--color-ink-700)" }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-5 sm:px-6 py-6 space-y-6 text-sm leading-relaxed" style={{ color: "var(--color-ink-800)" }}>
          <section>
            <h3 className="font-display font-semibold text-sm mb-2" style={{ color: "var(--color-ink-950)" }}>
              Purpose &amp; scope
            </h3>
            <p>
              This tool supports the <strong>preliminary screening</strong> stage of a partnership,
              joint-venture, or investment decision — after an opportunity has been identified but
              before formal due diligence, valuation, and negotiation begin. It is designed to force
              a structured, multi-dimensional view of an opportunity rather than a single gut-feel
              judgement, and to make the reasoning behind that judgement explicit and auditable. It
              is not a substitute for financial modelling, legal review, or full diligence — it is
              the instrument that decides whether those efforts are warranted.
            </p>
          </section>

          <section>
            <h3 className="font-display font-semibold text-sm mb-2" style={{ color: "var(--color-ink-950)" }}>
              Weighting philosophy
            </h3>
            <p className="mb-2.5">
              The eight categories are not weighted equally, and that is deliberate. Value in a
              partnership is <strong>created</strong> by strategic fit and synergy potential — these
              answer "why do this at all" and carry the heaviest weights (22% and 16%). Value is{" "}
              <strong>protected</strong> by partner strength and risk discipline — a strong strategic
              rationale is worthless if the counterparty cannot deliver or the risk profile is
              unacceptable, so these categories carry meaningful weight (15% and 13%) even though
              they rarely make the case for a deal on their own. Value is <strong>realised</strong>{" "}
              through capability complementarity, market attractiveness, cultural fit and ESG
              standing — necessary conditions for execution, weighted accordingly (13%, 11%, 5%,
              5%).
            </p>
            <p>
              Weights can be adjusted in the scenario panel to reflect a specific deal's priorities;
              the framework re-normalises automatically so the model always resolves correctly even
              if the total drifts from 100%.
            </p>
          </section>

          <section>
            <h3 className="font-display font-semibold text-sm mb-2" style={{ color: "var(--color-ink-950)" }}>
              The Risk &amp; Governance red-line
            </h3>
            <p>
              Regardless of how strong the rest of the profile is, a Risk &amp; Governance category
              average below <strong>2.0</strong> forces the verdict to{" "}
              <strong>Conditional</strong>. This reflects a simple principle: no amount of strategic
              or commercial upside justifies proceeding past a severe, unresolved risk or governance
              concern without first addressing it. The red-line is a hard override, not an input
              blended into the weighted average.
            </p>
          </section>

          <section>
            <h3 className="font-display font-semibold text-sm mb-2" style={{ color: "var(--color-ink-950)" }}>
              Reading the output
            </h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>The headline score</strong> (0–100) is a useful summary, but thresholds at 50
                and 70 are guides, not cliffs — a score of 69 and a score of 71 are not meaningfully
                different opportunities.
              </li>
              <li>
                <strong>The radar chart</strong> reveals shape: two opportunities can share the same
                overall score for very different reasons — one broadly solid, another spiky with a
                critical weakness the average conceals.
              </li>
              <li>
                <strong>The red-line flag</strong> should always be checked independently of the
                score. A high score with an active red-line is not a strong opportunity — it is a
                strong opportunity with an unresolved blocker.
              </li>
            </ul>
            <p className="mt-2.5">
              Use the score, the radar, and the risk flag together. None of the three tells the full
              story alone.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
