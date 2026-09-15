# Paid attribution and Google Ads signup conversions

Updated 2026-09-14. Implementation and rollout checklist; live account settings have not been verified by this change.

## Implementation

- Website PR #8207 captures supported click IDs after analytics consent, forwards first/last attribution to Console links, and records paid-touch properties on PostHog people. It does not put click IDs onto internal links.
- Console PR #5131 carries those IDs through signup attribution and records `signup_first_*` / `signup_last_*` properties and click-ID fields on `user_signed_up`.
- Console PR #4950 emits `sign_up` or `login` into `window.dataLayer` after server-confirmed account creation or authentication. OAuth and legacy email confirmation use the explicit `createdUser` result. Better Auth email signup emits only from its actual user-creation hook, not from a successful-looking duplicate-signup response. Email login emits `login`.

Each authentication handoff has a random ID in a secure, HttpOnly, 120-second cookie. The shared root loader expires it; the browser deduplicates navigation-cache replays by that ID. The ID is not sent to Google. Repeated authentications in one document still produce separate events.

```js
window.dataLayer.push({ event: "sign_up", method: "google" });
```

No email or account `user_id` is sent. PostHog and GA4 are separate identity systems; recording a click ID in PostHog does not itself send a conversion to Ads. Cross-device attribution is outside this change.

If User-ID is introduced later, set it through Google tag configuration (or GTM configuration settings) before the relevant event. Do not send it as an event parameter. See [Google's User-ID contract](https://developers.google.com/analytics/devguides/collection/ga4/user-id).

## GTM, GA4 and Ads rollout

1. Verify the current property/account IDs and access. Console code uses `GTM-P2BDTGRV`; the marketing container is `GTM-KRTRXXQ6`. Configure the container that actually runs on Console. Do not switch containers as part of these code fixes.
2. Verify consent defaults and updates on both hosts, including cross-host consent continuity. Confirm the Google tag respects `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization`. A dataLayer push alone makes no network request; publishing tags needs this separate check.
3. Configure GA4 event tags for exact custom events `sign_up` and `login`, passing `method`. Avoid a second tag that reports the same conversion.
4. Verify measurement continuity between `www.prisma.io` and `console.prisma.io`, including OAuth round trips, redirects and auto-tagging.
5. Verify `sign_up` in GA4 DebugView and mark it as a key event. Create/import its conversion in the linked Google Ads account. Configure signup Count as One; keep login observational.
6. Initially observe the new conversion as Secondary while validating it. The Ads owner decides when to make signup Primary and which existing click-proxy goals to replace after checking measured volume and campaign settings. This is a separate bidding change; there is no universal 30-signups-per-month requirement in this plan.
7. Confirm the publish owner. An earlier setup note recorded Gregory with Edit and Nurul with Publish; recheck current permissions.

Google explains [primary and secondary goals](https://support.google.com/google-ads/answer/10995103?hl=en) and [creating Ads conversions from GA4 key events](https://support.google.com/google-ads/answer/10632359?hl=en).

## Validation and completion evidence

- [ ] Website, Console attribution and conversion PRs deployed at recorded revisions.
- [ ] Test click ID survives landing → Console → OAuth/email signup.
- [ ] An organic return preserves the first touch; replay does not refresh paid timestamps.
- [ ] Declining or revoking analytics consent does not record paid person properties or forward stored click IDs from the website.
- [ ] PostHog signup event contains the expected first/last IDs on the expected user; verify anonymous identity continuity separately.
- [ ] OAuth new account emits `sign_up`; existing-account OAuth and email login emit `login`.
- [ ] Actual email account creation emits `sign_up`; duplicate signup, resend and invalid authentication do not.
- [ ] A replay emits no second event; a later authentication emits a new event.
- [ ] GTM Preview and GA4 DebugView show one event with the intended method and consent state.
- [ ] Google Ads receives the intended conversion; record the conversion action and diagnostic evidence.

Synthetic IDs validate transport only; they do not prove Ads attribution. Use Tag Assistant/debug traffic for event validation and legitimate campaign traffic for the final attributed-conversion check.

## Boundaries

Preview/local Console does not normally load production GTM. Local dataLayer assertions prove the application handoff, not GA4 delivery. Merge readiness and completed Ads setup are separate milestones.

Paid timestamps are preserved from capture time. Legacy stored touches with no timestamp remain unknown instead of being restamped at replay. Existing pre-release users must not be assigned guessed ad attribution.

Revenue attribution and server-side purchase delivery are follow-up work. They are not implemented by these three PRs. Ad-platform import windows and identifiers must be checked for that separate scope.
