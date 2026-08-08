// Strategic Partnership Assessment — scoring framework
// Categories are data, not a fixed schema: every scoring function below takes
// the current `categories` array as a parameter so the framework itself can
// be edited (renamed, added to, trimmed) at runtime.

export const DEFAULT_CATEGORIES = [
  {
    key: "strategicFit",
    name: "Strategic Fit & Alignment",
    defaultWeight: 22,
    description:
      "How well the opportunity advances where the organisation is deliberately trying to go.",
    criteria: [
      { key: "priorities", name: "Alignment with strategic priorities" },
      { key: "vision", name: "Contribution to long-term vision" },
      { key: "markets", name: "Fit with target markets & geographies" },
    ],
  },
  {
    key: "synergy",
    name: "Synergy & Value Potential",
    defaultWeight: 16,
    description:
      "The scale and speed of value the combination can plausibly create.",
    criteria: [
      { key: "revenue", name: "Revenue synergy potential" },
      { key: "cost", name: "Cost & operational synergy" },
      { key: "speed", name: "Speed to value" },
    ],
  },
  {
    key: "partnerStrength",
    name: "Partner Strength & Credibility",
    defaultWeight: 15,
    description:
      "Whether the counterparty is durable and credible enough to deliver on the deal.",
    criteria: [
      { key: "financial", name: "Financial stability" },
      { key: "trackRecord", name: "Track record & reputation" },
      { key: "marketPosition", name: "Market position" },
    ],
  },
  {
    key: "marketAttractiveness",
    name: "Market & Commercial Attractiveness",
    defaultWeight: 13,
    description:
      "The underlying market's quality and the commercial terms on offer.",
    criteria: [
      { key: "growth", name: "Market growth & attractiveness" },
      { key: "competitive", name: "Competitive positioning" },
      { key: "terms", name: "Commercial terms" },
    ],
  },
  {
    key: "capabilityFit",
    name: "Capability & Resource Complementarity",
    defaultWeight: 11,
    description:
      "How well each side's capabilities and assets fill genuine gaps in the other.",
    criteria: [
      { key: "capabilities", name: "Complementary capabilities" },
      { key: "resources", name: "Resource & asset access" },
      { key: "technology", name: "Technology & know-how" },
    ],
  },
  {
    key: "riskGovernance",
    name: "Risk & Governance",
    defaultWeight: 13,
    description:
      "Regulatory, counterparty and governance risk — the category with a hard red-line.",
    criteria: [
      { key: "regulatory", name: "Regulatory & compliance risk" },
      { key: "counterparty", name: "Counterparty & financial risk" },
      { key: "governance", name: "Governance & transparency" },
    ],
  },
  {
    key: "culturalFit",
    name: "Cultural & Organisational Fit",
    defaultWeight: 5,
    description:
      "Whether the two organisations can actually work together day to day.",
    criteria: [
      { key: "values", name: "Values alignment" },
      { key: "waysOfWorking", name: "Ways of working" },
      { key: "management", name: "Management compatibility" },
    ],
  },
  {
    key: "esg",
    name: "ESG & Sustainability",
    defaultWeight: 5,
    description:
      "Environmental, social and governance standing of the prospective partner.",
    criteria: [
      { key: "environmental", name: "Environmental practices" },
      { key: "social", name: "Social & ethical standards" },
      { key: "credentials", name: "ESG credentials & disclosure" },
    ],
  },
];

// Anchor key for the hard red-line rule. This category can be renamed but
// never deleted from the framework editor, so the rule always has a target.
export const RISK_CATEGORY_KEY = "riskGovernance";
export const RISK_REDLINE_THRESHOLD = 2.0;

export const DEAL_STAGES = ["Screening", "Diligence", "Negotiation", "Closed"];
export const DEFAULT_STAGE = "Screening";

export const VERDICT = {
  PURSUE: "Pursue",
  EXPLORE: "Explore Further",
  DECLINE: "Decline",
  CONDITIONAL: "Conditional",
};

export const VERDICT_META = {
  [VERDICT.PURSUE]: {
    color: "var(--color-pursue)",
    soft: "var(--color-pursue-soft)",
    summary: "meets the bar for active pursuit",
  },
  [VERDICT.EXPLORE]: {
    color: "var(--color-explore)",
    soft: "var(--color-explore-soft)",
    summary: "warrants further exploration before commitment",
  },
  [VERDICT.DECLINE]: {
    color: "var(--color-decline)",
    soft: "var(--color-decline-soft)",
    summary: "falls short of the threshold to proceed",
  },
  [VERDICT.CONDITIONAL]: {
    color: "var(--color-conditional)",
    soft: "var(--color-conditional-soft)",
    summary: "carries a governance red-line that overrides the headline score",
  },
};

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createCriterion(name = "New criterion") {
  return { key: uid("crit"), name };
}

export function createCategory(name = "New Category") {
  return {
    key: uid("cat"),
    name,
    defaultWeight: 5,
    description: "",
    criteria: [createCriterion("New criterion")],
  };
}

export function defaultWeights(categories) {
  const weights = {};
  for (const cat of categories) weights[cat.key] = cat.defaultWeight;
  return weights;
}

export function defaultScores(categories) {
  const scores = {};
  for (const cat of categories) {
    scores[cat.key] = {};
    for (const crit of cat.criteria) scores[cat.key][crit.key] = 3;
  }
  return scores;
}

/** Fill in any category/criterion scores missing from a partner's score map (e.g. after a framework edit), defaulting to a neutral 3. */
export function ensureScoreDefaults(scores, categories) {
  const next = { ...scores };
  for (const cat of categories) {
    next[cat.key] = { ...next[cat.key] };
    for (const crit of cat.criteria) {
      if (typeof next[cat.key][crit.key] !== "number") next[cat.key][crit.key] = 3;
    }
  }
  return next;
}

/** Fill in any category weights missing from the weight map (e.g. a newly added category), using its default weight. */
export function ensureWeightDefaults(weights, categories) {
  const next = { ...weights };
  for (const cat of categories) {
    if (typeof next[cat.key] !== "number") next[cat.key] = cat.defaultWeight;
  }
  return next;
}

/** Category average (1-5) from its sub-criteria. */
export function categoryAverage(scores, categories, categoryKey) {
  const cat = categories.find((c) => c.key === categoryKey);
  if (!cat || cat.criteria.length === 0) return 0;
  const vals = cat.criteria.map((c) => scores[categoryKey]?.[c.key] ?? 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** All category averages keyed by category key. */
export function categoryAverages(scores, categories) {
  const out = {};
  for (const cat of categories) out[cat.key] = categoryAverage(scores, categories, cat.key);
  return out;
}

/** Normalised weight (0-1) for a category given the current weight map. */
export function normalisedWeight(weights, categoryKey) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (total <= 0) return 0;
  return (weights[categoryKey] ?? 0) / total;
}

export function weightsTotal(weights) {
  return Object.values(weights).reduce((a, b) => a + b, 0);
}

/** Overall weighted score 0-100. */
export function overallScore(scores, categories, weights) {
  const total = weightsTotal(weights);
  if (total <= 0) return 0;
  let sum = 0;
  for (const cat of categories) {
    const avg = categoryAverage(scores, categories, cat.key);
    const w = (weights[cat.key] ?? 0) / total;
    sum += (avg / 5) * w * 100;
  }
  return sum;
}

/** Points out of 100 each category contributes to the overall score. */
export function weightedContributions(scores, categories, weights) {
  const total = weightsTotal(weights);
  return categories.map((cat) => {
    const avg = categoryAverage(scores, categories, cat.key);
    const w = total > 0 ? (weights[cat.key] ?? 0) / total : 0;
    return {
      key: cat.key,
      name: cat.name,
      average: avg,
      weight: w,
      points: (avg / 5) * w * 100,
      maxPoints: w * 100,
    };
  });
}

export function isRiskRedline(scores, categories) {
  if (!categories.some((c) => c.key === RISK_CATEGORY_KEY)) return false;
  return categoryAverage(scores, categories, RISK_CATEGORY_KEY) < RISK_REDLINE_THRESHOLD;
}

/** Full verdict logic including hard red-line override. */
export function computeVerdict(scores, categories, weights) {
  const score = overallScore(scores, categories, weights);
  const redline = isRiskRedline(scores, categories);
  if (redline) return { verdict: VERDICT.CONDITIONAL, score, redline };
  if (score >= 70) return { verdict: VERDICT.PURSUE, score, redline };
  if (score >= 50) return { verdict: VERDICT.EXPLORE, score, redline };
  return { verdict: VERDICT.DECLINE, score, redline };
}

// --- Prioritization matrix ----------------------------------------------
// Two composite axes built from the default category keys, matching the
// "value is created / protected" split explained in the methodology drawer.
// Categories the user has renamed still match (key is stable); categories
// the user has deleted or added are simply excluded from whichever bucket
// they don't belong to, with a same-value fallback so the axis never NaNs.

export const VALUE_AXIS_KEYS = ["strategicFit", "synergy", "marketAttractiveness"];
export const CONFIDENCE_AXIS_KEYS = ["partnerStrength", "riskGovernance", "capabilityFit"];

export const PRIORITY_QUADRANTS = {
  PRIORITISE: "Prioritise",
  DE_RISK: "De-risk First",
  OPPORTUNISTIC: "Opportunistic",
  DEPRIORITISE: "Deprioritise",
};

function axisAverage(scores, categories, keys) {
  const matched = categories.filter((c) => keys.includes(c.key));
  if (matched.length === 0) return null;
  const vals = matched.map((c) => categoryAverage(scores, categories, c.key));
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** { value, confidence } each 1-5. Falls back to the all-category average on either axis if no categories match its bucket (e.g. the user deleted or renamed away the underlying keys). */
export function priorityAxes(scores, categories) {
  const overall = categories.length
    ? categories.reduce((sum, c) => sum + categoryAverage(scores, categories, c.key), 0) / categories.length
    : 0;
  const value = axisAverage(scores, categories, VALUE_AXIS_KEYS) ?? overall;
  const confidence = axisAverage(scores, categories, CONFIDENCE_AXIS_KEYS) ?? overall;
  return { value, confidence };
}

export function priorityQuadrant(value, confidence) {
  const highValue = value >= 3;
  const highConfidence = confidence >= 3;
  if (highValue && highConfidence) return PRIORITY_QUADRANTS.PRIORITISE;
  if (highValue && !highConfidence) return PRIORITY_QUADRANTS.DE_RISK;
  if (!highValue && highConfidence) return PRIORITY_QUADRANTS.OPPORTUNISTIC;
  return PRIORITY_QUADRANTS.DEPRIORITISE;
}

/** Score band colour for slider/heatmap coding, 1-5 scale. */
export function bandColorFor1to5(value) {
  if (value >= 4) return "var(--color-pursue)";
  if (value >= 3) return "var(--color-explore)";
  if (value <= 2) return "var(--color-decline)";
  return "var(--color-explore)";
}

/** Score band colour for the 0-100 gauge. */
export function bandColorFor0to100(value) {
  if (value >= 70) return "var(--color-pursue)";
  if (value >= 50) return "var(--color-explore)";
  return "var(--color-decline)";
}

function ordinalStrength(avg) {
  if (avg >= 4.3) return "exceptional";
  if (avg >= 3.7) return "strong";
  if (avg >= 3) return "adequate";
  if (avg >= 2.3) return "weak";
  return "materially deficient";
}

/**
 * Rule-based, board-ready narrative. No API calls — pure string composition
 * from the current scores/weights so it updates live with every slider drag.
 */
export function generateNarrative(partnerName, scores, categories, weights) {
  const { verdict, score, redline } = computeVerdict(scores, categories, weights);
  const contributions = weightedContributions(scores, categories, weights)
    .slice()
    .sort((a, b) => b.average - a.average);
  const strongest = contributions.slice(0, 2);
  const weakest = contributions.slice(-2).reverse();
  const riskCategory = categories.find((c) => c.key === RISK_CATEGORY_KEY);
  const riskAvg = riskCategory ? categoryAverage(scores, categories, RISK_CATEGORY_KEY) : null;

  const name = partnerName || "This opportunity";
  const sentences = [];

  sentences.push(
    `${name} scores ${score.toFixed(1)} out of 100 under the current weighting model, a result that ${VERDICT_META[verdict].summary}.`
  );

  if (redline && riskCategory) {
    sentences.push(
      `This verdict is set to Conditional irrespective of the headline score: ${riskCategory.name} averages ${riskAvg.toFixed(
        1
      )}/5, below the ${RISK_REDLINE_THRESHOLD.toFixed(
        1
      )} red-line, and the framework treats that as disqualifying until the underlying risk items are remediated or independently mitigated.`
    );
  }

  if (strongest.length >= 2) {
    sentences.push(
      `The case is carried by ${strongest[0].name} (${strongest[0].average.toFixed(
        1
      )}/5) and ${strongest[1].name} (${strongest[1].average.toFixed(
        1
      )}/5), which together account for ${(
        strongest[0].points + strongest[1].points
      ).toFixed(1)} of the ${score.toFixed(1)} points on the board.`
    );
  }

  if (weakest.length >= 2) {
    sentences.push(
      `The principal drags are ${weakest[0].name} (${weakest[0].average.toFixed(
        1
      )}/5) and ${weakest[1].name} (${weakest[1].average.toFixed(
        1
      )}/5) — ${
        weakest[0].average < 3 || weakest[1].average < 3
          ? "both warrant targeted diligence before this moves further, as either could reprice the deal."
          : "neither is disqualifying on its own, but both are worth probing in the next round of diligence."
      }`
    );
  }

  if (!redline) {
    const distToNext =
      score >= 70
        ? score - 70
        : score >= 50
        ? Math.min(score - 50, 70 - score)
        : 50 - score;
    if (distToNext < 4) {
      const boundary = score >= 70 ? 70 : score >= 50 ? "50 or 70" : 50;
      sentences.push(
        `At ${score.toFixed(
          1
        )}, the score sits within a narrow margin of the ${boundary} threshold, so this classification is sensitive to small movements in scoring or weighting and should be treated as provisional rather than final.`
      );
    }
  }

  if (contributions.length > 0) {
    sentences.push(
      `Overall assessment: ${ordinalStrength(
        contributions.reduce((a, b) => a + b.average, 0) / contributions.length
      )} across the framework on balance — the recommendation is to ${verdictAction(
        verdict,
        riskCategory
      )}.`
    );
  }

  return sentences.join(" ");
}

function verdictAction(verdict, riskCategory) {
  switch (verdict) {
    case VERDICT.PURSUE:
      return "advance to formal due diligence and term negotiation";
    case VERDICT.EXPLORE:
      return "commission targeted diligence on the weaker dimensions before committing further resource";
    case VERDICT.CONDITIONAL:
      return `hold pending resolution of the ${riskCategory?.name ?? "Risk & Governance"} red-line, even though other dimensions may be favourable`;
    case VERDICT.DECLINE:
    default:
      return "decline at this time, absent a material change in terms or circumstances";
  }
}

// --- Seed data -------------------------------------------------------
// Seed scores are keyed against DEFAULT_CATEGORIES' criterion keys and are
// only meaningful when the framework hasn't been edited away from default.

function s(strategicFit, synergy, partnerStrength, marketAttractiveness, capabilityFit, riskGovernance, culturalFit, esg) {
  return {
    strategicFit: { priorities: strategicFit[0], vision: strategicFit[1], markets: strategicFit[2] },
    synergy: { revenue: synergy[0], cost: synergy[1], speed: synergy[2] },
    partnerStrength: { financial: partnerStrength[0], trackRecord: partnerStrength[1], marketPosition: partnerStrength[2] },
    marketAttractiveness: { growth: marketAttractiveness[0], competitive: marketAttractiveness[1], terms: marketAttractiveness[2] },
    capabilityFit: { capabilities: capabilityFit[0], resources: capabilityFit[1], technology: capabilityFit[2] },
    riskGovernance: { regulatory: riskGovernance[0], counterparty: riskGovernance[1], governance: riskGovernance[2] },
    culturalFit: { values: culturalFit[0], waysOfWorking: culturalFit[1], management: culturalFit[2] },
    esg: { environmental: esg[0], social: esg[1], credentials: esg[2] },
  };
}

export function seedPartners() {
  return [
    {
      id: "seed-alpha",
      name: "Alpha Holdings",
      note: "Illustrative sample data — clear Pursue candidate.",
      stage: "Diligence",
      scores: s(
        [5, 4, 5],
        [4, 4, 5],
        [5, 4, 4],
        [4, 4, 3],
        [4, 4, 3],
        [4, 4, 5],
        [4, 3, 4],
        [4, 3, 4]
      ),
    },
    {
      id: "seed-northbridge",
      name: "Northbridge Group",
      note: "Illustrative sample data — strong upside, red-line risk trips Conditional.",
      stage: "Screening",
      scores: s(
        [5, 5, 4],
        [5, 4, 4],
        [3, 3, 4],
        [4, 5, 3],
        [4, 3, 4],
        [1, 2, 2],
        [3, 3, 3],
        [2, 3, 2]
      ),
    },
    {
      id: "seed-summit",
      name: "Summit Ventures",
      note: "Illustrative sample data — middling all-rounder, Explore Further.",
      stage: "Screening",
      scores: s(
        [3, 3, 3],
        [3, 3, 2],
        [3, 4, 3],
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
        [4, 3, 3],
        [3, 3, 3]
      ),
    },
  ];
}
