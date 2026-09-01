# Spec: `sign_up` / `login` conversion tracking (GTM → GA4 → Google Ads)

> **Status (28 Aug 2026): SUPERSEDED.**
> Replaced by [`analytics-spec-paid-attribution.md`](./analytics-spec-paid-attribution.md),
> which covers the same signup/login work plus the part this spec was missing:
> attributing a **purchase that happens months later**, which no ad platform can
> do. Legal approved the tracking on 28 Aug.
>
> This file is kept only for the `trackSignUp` / `trackLogin` helper source in
> the appendix. Read the new spec instead.

---

**Why:** Google Ads currently has no signup or login conversion action. The only
primary goals are GA4-imported click proxies (`cta_click`, `cta_click_auto`,
`pricing`), so Smart Bidding optimises toward link clicks, not accounts. Google's
own Conversions page reports the account as **"Misconfigured — 0 primary
conversion actions."**

**Owner split:** console app (engineering) → GTM (marketing) → GA4 → Google Ads.

- GTM container: `GTM-KRTRXXQ6`
- GA4 measurement ID: `G-4B72WBX9ET` (property `prisma.io`)
- Google Ads: `AW-18370334973`, account `848-571-6211`

---

## 0. Prerequisites (the blocking part)

Today `GTM-KRTRXXQ6` is only on the marketing surfaces — `www.prisma.io`,
`blog`, `docs` — via `packages/ui/src/components/google-tag-manager.tsx`.
**Signup and login happen on `console.prisma.io`, which has no container.**
Nothing below works until these three land:

1. **Install GTM on `console.prisma.io`** — same container ID. Reuse the existing
   component if the console can import from `@prisma-docs/ui`; otherwise port the
   loader verbatim, including the Consent Mode v2 defaults.

2. **Bridge consent on the console** — the marketing loader defaults
   `ad_storage`/`analytics_storage` to `denied` and only grants on the CookieYes
   `cookieyes_consent_update` / `cookieyes_banner_load` events. The console must
   do the same, or conversions and remarketing silently under-report.

3. **Cross-domain measurement** — GA4 Admin → Data Streams → Configure tag
   settings → Configure your domains. Include `prisma.io` and `console.prisma.io`.
   Without this, an ad click on `www` followed by signup on `console` starts a new
   session attributed to `(direct)` and **the conversion never links to the ad
   click** — the single most common cause of "conversions aren't recording."

---

## 1. Events the console must emit

Both are [GA4 recommended events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
— use these exact names so GA4 reporting treats them natively.

### `sign_up`

Fire **once**, on server-confirmed account creation — not on button click, not on
form submit.

```js
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "sign_up",
  method: "github",        // "github" | "google" | "email"
  user_id: "usr_01H...",   // stable Prisma user id
  workspace_id: "ws_01H...", // optional
});
```

### `login`

Fire on server-confirmed authentication.

```js
window.dataLayer.push({
  event: "login",
  method: "github",
  user_id: "usr_01H...",
});
```

### Rules

- **Never send PII.** No email, no name. `user_id` must be an opaque internal id.
  Sending email to GA4 violates Google's policy and risks the property.
- **Fire once per event.** Guard `sign_up` behind a server response, not a
  client route. A redirect-based OAuth flow that re-renders must not re-fire —
  key it off a one-time server signal (e.g. `?welcome=1`, consumed immediately) or
  a server-set flag, never `localStorage` alone.
- **Success only.** Failed auth must not push.
- Re-use the existing `trackCTA` conventions in
  `packages/ui/src/lib/analytics.ts` — add typed `trackSignUp()` / `trackLogin()`
  helpers alongside it so the payload shape stays enforced.

---

## 2. GTM configuration

### Variables — Data Layer Variable

| Name | Data layer key |
| --- | --- |
| `dlv_method` | `method` |
| `dlv_user_id` | `user_id` |
| `dlv_workspace_id` | `workspace_id` |

### Triggers — Custom Event

| Name | Event name |
| --- | --- |
| `CE – sign_up` | `sign_up` |
| `CE – login` | `login` |

### Tags — GA4 Event

| Name | Event name | Parameters | Trigger |
| --- | --- | --- | --- |
| `GA4 – sign_up` | `sign_up` | `method` = `{{dlv_method}}` | `CE – sign_up` |
| `GA4 – login` | `login` | `method` = `{{dlv_method}}` | `CE – login` |

Both use the existing GA4 configuration tag (`G-4B72WBX9ET`).

**Also set User-ID** on the GA4 configuration tag: field `user_id` =
`{{dlv_user_id}}`. This enables cross-device stitching and materially improves
attribution quality.

> Publishing requires the **Publish** permission on the container — `boch@prisma.io`
> currently has Edit only. Nurul Sundarani has Publish.

---

## 3. GA4 configuration

1. **Verify** — GTM Preview + GA4 **DebugView** show `sign_up` / `login` with the
   `method` parameter. (Admin → Events takes 24–48h; DebugView is immediate.)
2. **Mark as key events** — Admin → Key events → toggle `sign_up` and `login`.
3. **Custom dimension** (optional but useful) — register `method` as an
   event-scoped custom dimension so signup-method breakdowns work in reports.
4. **Google Ads link** — Admin → Product links → Google Ads. Confirm the link to
   `848-571-6211` is active with **Personalised advertising** and **auto-tagging**
   enabled (auto-tagging is what writes `gclid`).

---

## 4. Google Ads configuration

Goals → Conversions → **New conversion action** → **Import** → **Google Analytics 4
properties** → select `sign_up` and `login`.

Configure each:

| Setting | `sign_up` | `login` |
| --- | --- | --- |
| Goal category | Sign-up | Other / Engagement |
| Primary or secondary | **Primary** | **Secondary** by default |
| Count | **One** | **One** |
| Click-through window | 30 days | 30 days |
| Attribution | Data-driven | Data-driven |

**Count = One is essential.** The existing broken actions use "Every conversion,"
which is how one bot session inflated into thousands of conversions.

**On optimising for logins:** `login` is a *returning-user* action — for an
acquisition campaign it rewards traffic that was already going to convert. Keep it
Secondary account-wide, and promote it to Primary **only inside the retargeting
campaign** via campaign-specific goals. Use `sign_up` as the primary goal
everywhere else.

Once both are recording, demote `cta_click` and `pricing` to Secondary as well —
keep them for observation, not bidding.

---

## 5. Validation checklist

- [ ] GTM Preview on `console.prisma.io` shows `sign_up` firing once per signup
- [ ] GA4 DebugView shows the event with `method` populated
- [ ] GA4 realtime shows `user_id` set
- [ ] A signup started from a `gclid` landing on `www` is attributed to Google /
      cpc in GA4 (proves cross-domain works)
- [ ] Google Ads conversion status moves from "No recent conversions" →
      **"Recording conversions"** (up to 24h)
- [ ] Counts sanity-check against PostHog `console:user_signed_up`
      (~400–550/day) — order of magnitude, not exact; consent gating means GA4
      will read lower

---

## 6. Follow-on: audiences for retargeting

Once `sign_up` / `login` land, build these in GA4 (Admin → Audiences) and they
auto-share to Google Ads:

| Audience | Definition | Use |
| --- | --- | --- |
| `Engaged visitors – 30d` | ≥2 pageviews **or** session ≥30s, excluding `sign_up` | Retargeting, quality-filtered |
| `Pricing viewers – 30d` | viewed `/pricing`, no `sign_up` | High-intent retargeting |
| `Signed up – no login 7d` | `sign_up` and not `login` since | Activation |
| `Active users – 30d` | `login` in last 30 days | **Exclude** from acquisition |

The engagement filter matters: the current `All visitors (Google Ads)` list was
populated largely while the Performance Max campaign was serving junk display
traffic that bounced at 1.13 pages/visit. Retargeting it unfiltered re-targets
those bounces.

---

## Appendix: the `trackSignUp` / `trackLogin` helpers

Written 26 Aug 2026, then reverted out of `packages/ui/src/lib/analytics.ts`
unmerged — with the console work deferred there were no call sites, and dead
exported code invites accidental use. Kept here so §6 doesn't restart from
scratch. Drop it back in below `trackCTA`, unchanged.

```ts
/** How the account was authenticated. */
export type AuthMethod = "github" | "google" | "email";

export type SignUpPayload = {
  /** Identity provider used to create the account. */
  method: AuthMethod;
  /**
   * Opaque internal Prisma user id. Never pass PII (email, name) — sending PII
   * to GA4 violates Google's policy.
   */
  user_id: string;
  /** Opaque workspace id, when the account is created inside a workspace. */
  workspace_id?: string;
};

export type LoginPayload = {
  /** Identity provider used to sign in. */
  method: AuthMethod;
  /**
   * Opaque internal Prisma user id. Never pass PII (email, name) — sending PII
   * to GA4 violates Google's policy.
   */
  user_id: string;
};

/**
 * Records an account creation as a `sign_up` event (a GA4 recommended event) in
 * the GTM dataLayer.
 *
 * Must fire exactly once, on server-confirmed account creation — not on the
 * signup button click, and not re-fired when an OAuth redirect re-renders the
 * page.
 *
 * Never pass PII (email, name) in the payload; sending PII to GA4 violates
 * Google's policy.
 *
 * Safe no-op during SSR or before GTM has initialised (e.g. consent not granted),
 * because `window.dataLayer` will be absent.
 */
export function trackSignUp(payload: SignUpPayload): void {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;

  window.dataLayer.push({ event: "sign_up", ...payload });
}

/**
 * Records a sign-in as a `login` event (a GA4 recommended event) in the GTM
 * dataLayer.
 *
 * Never pass PII (email, name) in the payload; sending PII to GA4 violates
 * Google's policy.
 *
 * Safe no-op during SSR or before GTM has initialised (e.g. consent not granted),
 * because `window.dataLayer` will be absent.
 */
export function trackLogin(payload: LoginPayload): void {
  if (typeof window === "undefined" || !Array.isArray(window.dataLayer)) return;

  window.dataLayer.push({ event: "login", ...payload });
}
```
