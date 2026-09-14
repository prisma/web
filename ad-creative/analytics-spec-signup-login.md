# Signup and login conversion tracking

This draft is superseded by [the paid attribution implementation and rollout checklist](./analytics-spec-paid-attribution.md).

The current Console payload is `{ event: "sign_up" | "login", method: "github" | "google" | "email" }`. It contains no account identifier. Do not configure GA4 User-ID from this payload.
