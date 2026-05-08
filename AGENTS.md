# AGENTS.md

## Project Overview

This is a React + Vite single-page calculator for early-retirement planning. It estimates required savings, monthly savings, salary needs, and a savings trajectory based on age, expenses, investment return, inflation, legal retirement age, expected remaining savings, and pension assumptions.

## Common Commands

```bash
npm install
npm start
npm run build
npm run preview
npm run deploy
```

`npm run deploy` builds the app and publishes `build/` with `gh-pages`; do not deploy unless the user explicitly asks.

## Code Map

- `src/retirementCalculations.jsx` contains the core financial calculation.
- `src/RetirementCalculator.jsx` owns the top-level state and wires inputs, presets, results, charts, and formulas.
- `src/InputForm.jsx`, `src/Results.jsx`, `src/Chart.jsx`, `src/Formula.jsx`, and `src/Presets.jsx` are the main UI modules.
- `src/i18n/zh.json` and `src/i18n/en.json` hold translated UI copy.
- `CNAME` is copied into `build/` during `predeploy`.

## Calculation Model Notes

- `src/retirementCalculations.jsx` is the only math source of truth; UI components should consume its derived fields instead of recalculating.
- The yearly trajectory has three phases: `working`, `earlyRetirement`, and `legalRetirement`.
- During `working`, living costs are paid by work income, `contribution` is added to assets, and `incomeNeeded` equals yearly living costs plus yearly savings.
- During retirement phases, `withdrawal` is the amount spent from assets. In legal retirement, pension offsets living costs before assets are used.
- Amount inputs use current purchasing power; expenses, pension, and the legal-retirement keep amount inflate year by year.

## UX Wording Rules

- Prefer plain language such as "从资产支出" / "spent from assets" over accounting terms such as net expenses or withdrawals.
- Avoid exposing formulas in the primary UI. Explanations should describe who pays living costs in each phase.
- Keep Chinese and English copy aligned whenever labels, helper text, chart tooltips, or result text changes.

## Project Rules

- Treat `src/retirementCalculations.jsx` as the source of truth for math. Keep it deterministic and side-effect free.
- When changing labels, descriptions, form fields, or result text, update both Chinese and English i18n files.
- Keep financial wording clear about assumptions. Do not imply the calculator is investment advice or a guaranteed plan.
- Preserve responsive behavior for mobile and desktop; this is a public web calculator, not a dashboard.
- Avoid committing generated deployment output unless the user explicitly asks for a deploy-ready artifact.

## Verification

- Run `npm test` and `npm run build` after calculation changes.
- Run `npm run build` after UI-only code changes.
- For calculation changes, manually sanity-check at least one baseline scenario in the browser and compare the displayed results with the expected direction of change.
- For UI/i18n changes, check both `zh` and `en` language paths if the change touches visible copy.
