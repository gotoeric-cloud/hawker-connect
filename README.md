# Hawker Connect

**Find your shiok. Find your makan.**

Version 0.2: recommendation-first discovery for diners, tourists and health-conscious eaters, with hawker insights and profitability planning.

A responsive, dependency-free demonstration of the B2B hawker-media proposal. Venue operators fund promotion. Diners explore food matched to their preferences. Fictional stalls and synthetic reviews avoid implying real endorsements.

## Run

Requires Node.js 22 or later. No npm packages or API keys are needed.

```sh
npm test
npm start
```

Open http://localhost:3000. `npm run build` creates `dist/` for static hosting.

## Included

- Content-based food recommendations with budget, cuisine, spice, area and vegetarian filters, transparent ranking and match explanations.
- Personal nutrition thresholds on clearly labelled simplified fictional recipe examples. Unknown nutrition is excluded when a threshold applies. Recipes and coefficients appear in dish details. No health ratings or outcomes are claimed.
- Browser-local saved dishes and a visitor mode with plain-language food information.
- Hawker workspace with a 48-signal synthetic cohort, area filters, aggregate interest counts and small-bucket suppression. No visitor preferences feed into it.
- Profitability scenario calculator that subtracts variable costs, other daily costs and food waste. Outcomes are arithmetic based on inputs, not forecasts.
- Content studio with editable template drafts, review checklist, browser-local approval and copy action. No social posts are sent.
- Review screening with text similarity, rating bursts and reviewer/stall overlap. Local moderator decisions require a reason. Flags are not fraud verdicts.
- Local image upload, dimensions and an origin/permission checklist. There is no connected AI-image detector or cryptographic provenance verifier.
- Recipe nutrition calculator using ingredient quantities and serving count. Coefficients are illustrative, not a licensed nutrition dataset or medical guidance.
- Operator view with explicitly illustrative traffic metrics, local action counts and a resettable local activity log.

## GitHub and Render

1. Create a repository named `hawker-connect` in your chosen GitHub account. A private repository is suitable while developing.
2. Commit these files to the repository. Do not commit credentials or personal review data.
3. In Render, connect that repository and create a Blueprint using `render.yaml`, or create a Static Site with build command `npm run build` and publish directory `dist`.
4. Review Render's current account and billing terms before accepting a plan. This blueprint declares a static site and no paid database or compute plan.

The app contains no backend secrets and requires no environment variables. It can also run as a Node web service (`npm start`) if you prefer, but static hosting is enough for this demo.

## Mission and vision

Mission: Connect diners with suitable hawker food and give hawkers local demand insights to improve profitability.

Vision: A thriving hawker culture where every diner finds food that fits and hawkers earn a sustainable living.

## Production boundaries

This is a working local-interaction prototype, not a multi-tenant production service. The operator view is intentionally open demo mode. Approvals, decisions and logs exist only in localStorage and can be edited by a visitor. Never put real confidential business records into this demo.

There is no live model provider connected. The recommender is a transparent content-based algorithm, while the content studio uses templates. Illustrations are AI-generated concept artwork and do not show real stalls or customers.

Before a paid pilot, add authenticated roles, tenant isolation, server-side storage, immutable approval history, consent and deletion workflows, monitoring, rate limits and backup/recovery. Separately scope real AI services, licensed nutrition data, review ingestion rights, provenance verification and moderator staffing. Treat preference-based dietary matches as suggestions rather than safety guarantees.

The review rules use demonstration thresholds: Jaccard word-set overlap ≥0.85, three same-extreme ratings within a 30-minute window and recurring cross-stall account overlap. These require locally labelled validation, error-rate analysis, appeal handling and tuning. A legitimate promotion or viral post may create similar patterns. Do not use a pattern flag to accuse a business or suppress criticism. External-platform reviews must be reported to their source for adjudication.

## Roadmap

1. Paid pilot and validated workflow with a venue operator.
2. Authenticated operator/hawker roles and persistent approval records.
3. Validated recommendation ranking, licensed nutrition data and privacy-preserving demand analytics.
4. Server-side generative AI drafts with traceable stall facts and human approval.
5. Provenance verification and separately validated image-screening services.
6. Validated review screening and source-platform reporting.

## Reference principles

- Proposal: the group's AI-powered hawker promotion and discovery pitch.
- Google review-pattern discussion: https://blog.google/products-and-platforms/products/maps/how-machine-learning-keeps-contributed-content-helpful/
- Google Maps content policy: https://support.google.com/contributionpolicy/answer/7400114
- Render Blueprints: https://render.com/docs/blueprint-spec

These sources inform the design. They do not endorse this app or supply production detection, nutrition data or business partnerships.

## Validation

`npm test` covers 12 checks for hard preference filters, nutrition handling, unknown-data exclusion, area and sorting behaviour, aggregate suppression, profitability arithmetic, review-screening indicators, validation of review input, draft facts and HTTP serving/security headers. The static build also succeeds. The remote preview browser could not access the workspace localhost server, so browser rendering and end-to-end UI verification remain pending.
