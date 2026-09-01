# Spec: paid attribution from ad click → signup → purchase

**Goal:** answer "how many people who came from a paid campaign signed up, logged
in, and later purchased" — where the purchase can happen **months** after the ad
click, far outside any ad platform's conversion window.

**Approach:** the paid touch is recorded on the **PostHog person**, not on a
conversion event. It then travels with that person from the anonymous marketing
visit, through signup on the console, onto every later event including a
server-side `purchase`. Google Ads never sees the purchase and does not need to.

Status: **Part 1 shipped in `prisma-web`. Parts 2–4 need the console repo.**

- GTM container `GTM-KRTRXXQ6` · GA4 `G-4B72WBX9ET` · Google Ads `AW-18370334973` (account 848-571-6211)
- PostHog project “Prisma Web Properties”

---

## 0. The constraint that shapes everything

**Coverage is bounded by analytics consent, not by legal approval.**

PostHog on prisma.io is initialised `opt_out_capturing_by_default: true` and only
opts in when CookieYes grants the **analytics** category
(`apps/*/src/instrumentation-client.ts` → `packages/ui/src/lib/consent.ts`).
A visitor who declines analytics produces **no PostHog data at all**, so they
cannot be attributed by any part of this design.

Legal sign-off permits the tracking; it does not raise the opt-in rate. Expect
attributed signups to under-count real ones, and never present these figures as
a complete census. Worth measuring the analytics opt-in rate first — it sets the
ceiling on everything below.

---

## 1. Marketing site — SHIPPED

Three changes in this repo:

**Click IDs are now captured.** `packages/ui/src/lib/utm.ts` previously matched
only `utm_*` and `ref`. Google auto-tagging appends **`gclid` and no UTM params
at all**, so every paid visit was being stored as if it were direct. `gclid`,
`wbraid`, `gbraid`, `msclkid`, `fbclid`, `li_fat_id`, `twclid` and `ttclid` are
now captured into the existing first/last-touch store.

Click IDs are deliberately **not** rewritten onto internal links — they are
opaque and long, and only matter at the console boundary. `syncUtmAttribution`
appends them to `console.prisma.io` links only.

**Attribution changes emit an event.** `UtmPersistence` dispatches
`prisma_attribution_change` on `document` when a landing carries attribution
params. Kept as a DOM event so `@prisma-docs/ui` needs no `posthog-js` dependency.

**Paid touches are written to the PostHog person.**
`packages/ui/src/lib/attribution.ts` classifies a touch as paid (a click ID is
decisive on its own; otherwise `utm_medium` in cpc/ppc/paid/paidsocial/display)
and maps it to person properties. Each app's `instrumentation-client.ts`
subscribes and calls `setPersonProperties`.

| `$set_once` (first touch, never overwritten) | `$set` (most recent) |
| --- | --- |
| `is_paid_acquired: true` | `last_paid_at` |
| `first_paid_at` | `last_paid_source` |
| `first_paid_source` — e.g. `google_ads` | `last_paid_campaign` |
| `first_paid_campaign` | `last_paid_medium` |
| `first_paid_medium` | `last_paid_click_id` |
| `first_paid_click_id` | `last_paid_click_id_param` |
| `first_paid_click_id_param` | |

Organic visitors get **no** paid properties at all.

> **Billing note:** the project runs `person_profiles: identified_only` (via
> `defaults: "2025-11-30"`). `setPersonProperties` *creates* a profile where none
> exists, so paid-touched anonymous visitors will now have person profiles they
> otherwise would not. That is intended — it is what makes months-later
> attribution possible — but it is a deliberate, billable change scoped to paid
> traffic only.

---

## 2. Console — signup and login

### 2a. Confirm PostHog identity carries across the domain

`prisma.io` and `console.prisma.io` share the root domain, so PostHog's
cross-subdomain cookie should already carry the same `distinct_id` across the
hop, and the anonymous person's paid properties survive into the identified user.

**Verify this before relying on it.** It only holds if the console uses the same
PostHog project and does not override `cross_subdomain_cookie` or
`persistence`. Check `posthog.get_distinct_id()` on prisma.io, follow a console
link, and confirm it is unchanged.

If it does not hold, the URL fallback in §2c is what saves the attribution.

### 2b. Emit `sign_up` and `login`

Both are [GA4 recommended events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).
Fire **once**, on server-confirmed success — not on button click, not on form
submit, and not re-fired when an OAuth redirect re-renders.

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "sign_up",          // or "login"
  method: "github",          // "github" | "google" | "email"
  user_id: "usr_01H...",     // opaque internal id
  workspace_id: "ws_01H...", // sign_up only, optional
});
```

**Never send PII.** No email, no name. Sending PII to GA4 violates Google's
policy and puts the property at risk.

### 2c. Identify in PostHog and apply the attribution fallback

On signup, after the server confirms:

```js
import { getPaidPersonProperties } from "@prisma-docs/ui/lib/attribution"; // or port it

posthog.identify(userId);

// Fallback for when the cross-subdomain cookie did not carry over: the console
// link already arrives with gclid / first_utm_* appended by the marketing site.
const params = new URLSearchParams(window.location.search);
const first = Object.fromEntries(
  [...params].filter(([k]) => k.startsWith("first_")).map(([k, v]) => [k.slice(6), v]),
);
const last = Object.fromEntries([...params].filter(([k]) => !k.startsWith("first_")));

const props = getPaidPersonProperties({ first, last }, new Date().toISOString());
if (props) posthog.setPersonProperties(props.set, props.setOnce);
```

`$set_once` semantics make this safe to run unconditionally — if the cookie
already carried the first touch, the fallback cannot overwrite it.

### 2d. Persist attribution to your own database

**Do this as well as PostHog, not instead of it.** PostHog person properties can
be merged, reset, or aged out, and a months-later revenue question is
finance-grade. Write once at signup, never update:

```
users.acq_first_paid_source      text  null
users.acq_first_paid_campaign    text  null
users.acq_first_click_id         text  null
users.acq_first_seen_at          timestamptz null
```

This is the auditable record. PostHog is the analysis surface.

---

## 3. Purchase — server-side

Emit from the server, never the client: purchases must not depend on a browser,
an ad blocker, or a consent banner.

```js
posthog.capture({
  distinctId: userId,            // same id used in identify()
  event: "purchase",
  properties: {
    amount: 4900,                // minor units
    currency: "USD",
    plan: "pro",
    is_first_purchase: true,
  },
});
```

Because the person already carries `first_paid_source`, no attribution work
happens here — the join is free at query time.

> Server-side capture is not consent-gated the way the browser SDK is. Confirm
> with legal that a server-side purchase event on an already-identified customer
> is covered by the approval given, since it is a different basis from the
> cookie-consent path in §0.

---

## 4. Answering the question

Once §2 and §3 land, the whole funnel is one HogQL query:

```sql
SELECT
    person.properties.first_paid_source                      AS source,
    person.properties.first_paid_campaign                    AS campaign,
    count(DISTINCT person_id)                                AS purchasers,
    sum(toFloat(properties.amount)) / 100                     AS revenue
FROM events
WHERE event = 'purchase'
  AND person.properties.is_paid_acquired
GROUP BY source, campaign
ORDER BY revenue DESC
```

Signups from paid, same shape:

```sql
SELECT person.properties.first_paid_source AS source, count(DISTINCT person_id)
FROM events
WHERE event = 'sign_up' AND person.properties.is_paid_acquired
GROUP BY source
```

**Time-to-purchase** — the number that justifies the whole design:

```sql
SELECT
    dateDiff('day', toDateTime(person.properties.first_paid_at), timestamp) AS days_to_purchase,
    count()
FROM events
WHERE event = 'purchase' AND person.properties.is_paid_acquired
GROUP BY days_to_purchase
ORDER BY days_to_purchase
```

---

## 5. Google Ads and GA4

Import `sign_up` and `login` from GA4 (Goals → Conversions → Import → GA4):

| Setting | `sign_up` | `login` |
| --- | --- | --- |
| Goal category | Sign-up | Other / Engagement |
| Primary or secondary | **Secondary** for now | **Secondary** |
| Count | **One** | **One** |
| Click-through window | 30 days | 30 days |

Keep both **Secondary** and leave `cta_click` as the bidding signal until signups
clear roughly **30/month** — below that, Smart Bidding cannot learn from them and
promoting them would make delivery worse, not better. See
[[google-ads-bids-on-cta-click]].

**Do not** try to push purchases into Google Ads. Offline conversion import is
capped at 90 days from the click; a purchase months later simply cannot be
imported, which is exactly why attribution lives in PostHog.

Also required in GTM: install the container on `console.prisma.io` with the same
Consent Mode v2 bridge as `packages/ui/src/components/google-tag-manager.tsx`,
and enable cross-domain measurement in GA4 (Admin → Data Streams → Configure your
domains) for `prisma.io` and `console.prisma.io`. Without the latter, a click on
`www` followed by a signup on `console` starts a new session attributed to
`(direct)`.

> Publishing GTM needs the **Publish** permission — `boch@prisma.io` has Edit
> only; Nurul Sundarani has Publish.

---

## 6. Validation

- [ ] `posthog.get_distinct_id()` is unchanged across `prisma.io` → `console.prisma.io`
- [ ] A visit to `prisma.io/?gclid=test123` creates a person with
      `first_paid_source = google_ads` and `first_paid_click_id = test123`
- [ ] A console link on that visit carries `gclid` in its href
- [ ] `gclid` does **not** appear on internal prisma.io links
- [ ] A second, organic visit does not overwrite `first_paid_*`
- [ ] Signing up merges the anonymous person — `first_paid_*` survives on the user
- [ ] Declining analytics consent produces no PostHog person and no properties
- [ ] `sign_up` appears in GA4 DebugView with `method` populated
- [ ] A server-side `purchase` lands on the same person and the §4 query returns it

---

## 7. Known gaps

**Existing:** `UtmPersistence` writes attribution to `localStorage` without
checking consent — this predates these changes and now includes click IDs. Given
legal approval it is likely acceptable, but it should be confirmed and ideally
gated on the CookieYes advertising category.

**Cross-device is unsolved.** Someone who clicks an ad on their phone and signs
up on a laptop cannot be joined by any of this. Undercount is structural.

**Retroactive attribution is impossible.** Everyone who signed up before this
ships has no `first_paid_*`. Do not backfill by guessing.
