# Measuring AI Search Impact Past the Referral Click

AI answers influence buyers who never click a link. They read a recommendation, then search your brand or type your URL a few days later. Referral reports miss most of that, so "AI sends us almost no traffic" is usually a measurement gap, and the impact sits in other channels.

Profound joined more than two million AI conversations with later browsing behavior (Profound, July 2026; observational, US-only, measured site visits rather than purchases). Two findings shape the setup below:

- Only **42%** of the downstream visits after an AI assistant introduced a brand happened within 24 hours. A same-session window misses most of the effect.
- More than **97%** of those visits carried no AI referral parameter, even after ChatGPT made its links easier to click.

SimilarWeb's journey data points the same way: about 9% of post-recommendation visits arrived as visible AI referrals (see [citations-vs-recommendations.md](citations-vs-recommendations.md)). Profound sells AI visibility tracking, so treat its numbers as vendor research, and don't present either study's lift as a forecast for one brand.

## Four layers

Report each layer separately. Rising visibility does not prove rising revenue.

| Layer | What it captures | Where it comes from |
|---|---|---|
| **Exposure** | Mentions, recommendations, prominence, framing, citations | Prompt tracking (see [prompt-portfolio.md](prompt-portfolio.md)) |
| **Immediate behavior** | AI referral sessions, landing pages, engaged sessions | Analytics, with AI referrers grouped (see the **analytics** skill) |
| **Delayed behavior** | Branded search, direct visits, return visits, cross-session conversions | Search Console branded queries, analytics, CRM |
| **Business outcome** | Signups, leads, qualified pipeline, purchases, revenue, retention | CRM and billing |

## Setup

1. **Name the decision.** "Should we keep funding AEO content?" needs a different design from "Did fixing our pricing page change anything?"
2. **Define exposure** by engine, prompt cohort, market, language, and date, so you know what changed and when.
3. **Fix referral capture.** Group known AI referrers (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai, and so on) into one channel. Preserve landing page, referrer, and query parameters. Expect it to undercount.
4. **Add delayed windows.** Measure branded search and direct visits to exposed pages over 1-hour, 24-hour, and 7-day windows after a known exposure change.
5. **Ask people.** A "How did you hear about us?" field with an AI option and a "What did you ask?" follow-up, plus tagged sales-call notes, catch journeys analytics can't see.
6. **Join to outcomes** in the CRM without counting the same conversion twice across layers.

## Evaluation designs

Pick the strongest design you can afford, and say which one you used.

| Design | Use when | Confidence |
|---|---|---|
| **Holdout** | You can leave comparable pages, products, or markets untouched | Highest |
| **Matched comparison** | Similar pages or markets exist, but you can't randomize | Medium |
| **Interrupted time series** | One clear intervention date and a long, stable baseline | Medium |
| **Pre/post on a stable cohort** | Nothing better is possible | Low; confounders easily swamp it |
| **Exposure panel or incrementality study** | Budget for a vendor panel | Varies with the panel's method |

List confounders before reading results: campaigns, launches, press, seasonality, pricing changes, and model or retrieval updates.

## Reporting language

Say which of three things you have: an **observation** ("branded search rose 18% after the change"), an **association** ("pages with more AI mentions saw more direct visits"), or a **causal result** ("the holdout pages didn't move; the treated pages did"). Most AEO reporting only supports the first two. Say so.

Respect privacy rules in panel and self-reported data: aggregate small groups and follow your consent and retention policies.

---

*Framework lineage: the four-layer model, attribution windows, and evaluation designs adapted (re-expressed and restructured) from Profound's MIT-licensed ai-search-attribution-planner skill and its "AI mention effect" study (July 2026), credited.*
