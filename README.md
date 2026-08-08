# Strategic Partnership Assessment

A weighted multi-criteria decision instrument for the **preliminary screening**
of partnership, joint-venture, and investment opportunities. Score an
opportunity across 8 weighted categories, watch a live decision gauge and
radar chart recalculate as you adjust scores or reweight the model, compare
multiple partners side by side, and read a board-ready recommendation
narrative generated entirely client-side.

All state lives in the browser (React state, persisted to `localStorage`).
There is no backend, no database, and no authentication. Every partner
preloaded on first run is illustrative sample data — no real or
client-specific information.

## How it works

- **8 weighted categories**, each scored via 3 sub-criteria (1–5):
  Strategic Fit & Alignment, Synergy & Value Potential, Partner Strength &
  Credibility, Market & Commercial Attractiveness, Capability & Resource
  Complementarity, Risk & Governance, Cultural & Organisational Fit, and
  ESG & Sustainability.
- **Overall score (0–100)** = the weighted sum of each category's average
  (normalised so the model always resolves correctly, even if the weights
  don't sum to exactly 100%).
- **Verdict thresholds**: Pursue ≥ 70 · Explore Further 50–69 · Decline < 50.
- **Hard red-line rule**: if the Risk & Governance average falls below 2.0,
  the verdict is forced to **Conditional** regardless of the headline score.
- **Deep Assessment** view: score a single partner, adjust the weighting
  model live, and read the auto-generated recommendation.
- **Comparison** view: a ranked bar chart and a category heat map across all
  partners, reflecting the current weighting model.

See the in-app "How this works" drawer for the full methodology and
weighting philosophy.

## Additional features

- **Editable framework** — rename any category or sub-criterion, add or
  remove sub-criteria, or add/remove whole categories from the "Edit
  assessment framework" panel in Deep Assessment. Risk & Governance can be
  renamed but not deleted, since the red-line rule depends on it. Newly
  added items start at a neutral score of 3; renaming preserves existing
  scores.
- **Deal stage tracker** — tag each partner with a pipeline stage
  (Screening → Diligence → Negotiation → Closed) from the selector next to
  the partner chips, and filter the Comparison view by stage.
- **PDF export** — the "Export PDF" button in Deep Assessment opens the
  browser print dialog with a clean, board-ready one-page report for the
  active partner (score, verdict, category breakdown, and narrative); choose
  "Save as PDF" as the destination.
- **Workspace backup/restore** — the "Data" menu in the header can export
  the entire workspace (framework, weights, and all partners) as a JSON
  file, re-import it later or on another device, or reset back to the
  illustrative sample data.

## Tech stack

- [Vite](https://vite.dev) + [React](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- Hand-built, dependency-free SVG charts (gauge, radar, bars, heat map)
- No backend — build output is 100% static

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site to `dist/`.

## Deploy to Vercel

This project needs zero configuration — Vercel auto-detects Vite and runs
`npm run build`, serving the `dist/` directory.

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel        # first deploy, follow the prompts (accept the detected Vite settings)
vercel --prod # promote to production
```

### Option B — Drag-and-drop

1. Run `npm run build` locally to generate the `dist/` folder.
2. Go to [vercel.com/new](https://vercel.com/new) and choose the option to
   deploy without Git (drag-and-drop).
3. Drag the `dist/` folder onto the upload area.
4. Vercel serves it immediately at a generated URL.

### Option C — Git integration

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In the Vercel dashboard, choose **Add New → Project** and import the repo.
3. Framework preset: **Vite** (auto-detected). Build command: `npm run build`.
   Output directory: `dist`. Leave everything else as default.
4. Deploy — every push to the connected branch redeploys automatically.

## Notes

- All scoring state is stored client-side in `localStorage` under the key
  `spa-tool:v1`. Clearing site data resets the tool to its seed state.
- The recommendation narrative is fully rule-based (string composition over
  the current scores/weights) — no API calls, no network dependency, no
  latency.
