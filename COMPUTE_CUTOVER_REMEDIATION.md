# Compute cutover remediation (3 November 2026)

This records the disposition of the 2 November validation, remediation and Slack
reports supplied by the web team. The reports describe three different releases:
Vercel production, Compute production and an older custom-domain preview. A
successful local build is not approval to switch production traffic.

## Repository changes

| Audit IDs | Change |
| --- | --- |
| G1 | Match exported Next redirect regexes case-sensitively when deciding which zone owns a request. The lower-case Remix article stays in Blog; its mixed-case legacy URL still reaches the existing redirect. |
| G2 | Reject impossible single byte ranges with 416 and `Content-Range: bytes */size` before Bun/Next sees the bad range. Preconditions still precede range evaluation; stale If-Range requests get the full file. Covers public-file inventory and current/retained static files. |
| G3 | Bound mutable sitemap, robots, Markdown and LLM text to 60 seconds at the edge plus 300 seconds SWR; browsers revalidate. Content-versioned media and static bundles remain immutable. |
| G4 | Stop adding User-Agent to browser HTML's cache key. Contrary to the audit's premise, the apps **do** negotiate Markdown by UA. UA-only Markdown is no-store; explicit `Accept: text/markdown` has the stable document Vary schema. Agents can still receive valid cached HTML; `.md` and explicit Accept avoid ambiguity. |
| G5, A4 | Share the existing Site/Docs/Blog security policy, including the union of their existing service hosts and the specifically observed Google collection endpoints. Apply it to external Data Guide responses too; only public, non-session editorial documents receive the short edge policy. |
| G6 | Prerendered public HTML 404s without credentials/session cookies get a 15-second edge lifetime. Missing Next static aliases get a tiny plain-text 404 without rendering an app. Dynamic/private responses keep their protections. This is not abuse prevention. |
| G7, A9 | Strip implementation-only response markers on all response branches; disable Next's powered-by header in all five apps. Keep legitimate robots directives. Add bounded shared freshness to Docs/Blog OG routes. |
| G8 | Precompress public static text once on the builder. Serve Brotli when accepted, identity byte ranges otherwise, with encoding variation and conditional validators. Stream from disk without runtime compression or buffering; include compressed files in existing artifact-budget checks. |
| G10, A1, A2 | Pin the public PostHog proxy URL in shared code, rather than falling back to the SDK's CSP-blocked default. Production CI fails before deployment if search is not enabled or the public analytics key is missing. Smoke the three search endpoints when enabled and the PostHog flags/config endpoint when a key is provided; no synthetic analytics event is captured. |
| G10, C1 | Extend smoke checks for case-only redirects, TTLs, static misses, range failures and leaked headers. Optional `WEB_PUBLIC_ORIGIN` verification checks the exact deployed release and rejects noindex on public pages. Generated preview URLs remain allowed to be noindex. |
| A2 | Bind Linear's team ID as well as its credentials; an unconfigured webhook returns 503 before parsing its payload or attempting HMAC/downstream calls. This does not provision credentials or pretend the integration works. |
| A3 | Blog JSON-LD and sitemap use the same validated editorial `updatedAt`, falling back to publication date. Remove the git plugin that mistakes synthetic deploy commits for editorial edits. |
| A5, A8 | Import the Eclipse avatar logo through the bundler so basePath is honored; fix the twelve image references covering eight files in the 2019 Serverless article. Constrain Blog's decorative mobile bloom, removing the 470 px overflow at a 390 px viewport. |
| A7 | Exclude the eight audited redirect stubs and externally canonicalized Blog posts from sitemaps; destinations retain their own entries. Guard these policies with regression tests and deployed smoke assertions. |
| A8 | Load GTM only after an explicit analytics or advertising grant, including restored CookieYes consent. Consent Mode's denied default alone did not prevent network requests. Container-level consent behavior after load still needs a vendor audit. |
| C2 | Export the known apex-to-www, docs-root and blog-root dashboard redirects in Site's Next config, retaining their 308/308/307 status codes. The compiled gateway can carry them once ingress accepts those hosts. |
| C4, F5, A10 | Document known-release redeployment/rollback, add optional hostname-scoped purge after gateway smoke, and pass an existing optional Sentry upload token to the build. No source maps are added to runtime bundles. |

The Vercel deployment path, domains and workflows remain in place. Shared app
fixes also apply to Vercel. Composer-specific cache policy and deploy checks do
not change Vercel's build/deploy command.

## Required work outside this repository

| Owner / IDs | Required action and acceptance evidence |
| --- | --- |
| Compute ingress — **C1, P0** | Make production custom-domain pages indexable, including headers returned by internal gateway-to-service requests. Verify on the actual registered public hostname. Do not merely strip every X-Robots-Tag: OG images, drafts and the static inventory intentionally carry noindex. Generated preview-host noindex alone does not prove the behavior of a registered production hostname. |
| Console + web operators — **A1/A2, P0** | Set the public PostHog key in GitHub's `prisma-production` environment. Set `COMPOSER_INTEGRATIONS=mixedbread` plus required `brevo,extensions,linear`; provision corresponding secrets in Console's **production branch/environment**. The production deployment now deliberately refuses a pages-only configuration. Successful preview pages do not close this gate. Read-only checks on 3 November still found no repository or `prisma-production` GitHub variables; production operators must configure the integration selection before merging. |
| Compute / DNS owners — **C2, P0** | Decide how all 15 hosts are bound under the three-domain-per-service limit, including Eclipse and legacy hosts. Ingress rejects unknown Host values: a CNAME or forwarded Host alone does not establish ownership. Bind the real production gateway, not the stale preview; test every hostname with its real TLS/Host routing. Purge after switching lineage. The three exported redirects do not solve binding or the domain cap. |
| Cloudflare + Compute security — **F1, C3, P0/P1** | Configure/review WAF, bot protection and rate limits; restrict or authenticate direct-origin traffic. Rehearse staging abuse checks. A few unchallenged audit requests do not establish which protections a zone has enabled; inspect actual settings. Do not add a per-process web limiter and treat it as distributed enforcement. |
| CDN/network owners — **F2/F3/C6** | Confirm Smart Tiered Cache configuration, evaluate Argo/origin connection reuse/private hops and investigate distant colo routing. Re-measure SG, IN, LK, AU, ZA and other target ASNs on cold keys and warm hits. HTTP timing alone does not prove whether tiering is enabled. No web cache-header change eliminates long cold-fill RTT to EWR. |
| Cloudflare zone owner — **F4/F7** | Disable email obfuscation for these documentation hosts; check plain code samples/mailto links. Review compression/ETag handling and repeat conditional reads through the edge. Web origin validators cannot force the CDN to preserve an ETag it rewrites or drops. |
| Cloudflare + CI operators — **F5** | Configure the optional hostname-purge inputs below, test a purge on staging, and verify the new release through the public host. Also purge at the preview-to-production lineage switch. An accepted API purge is not proof that every colo serves the new release. |
| Cloudflare/Compute + monitoring — **F6, O3, C5** | Investigate intermittent 530/1016 with request IDs, DNS/origin records and platform logs. Add alerting from US/EU/SG/IN/AU/BR/ZA for pages, article, search and hostname redirects; test the alert. Document Console service log access and correlate `prisma-request-id` across hops. A one-shot CI smoke is not continuous monitoring. |
| Vendor admins — **A6** | Verify CookieYes registration, FontAwesome kit domains and Promptwatch CORS on the final hostname. Do not weaken origin policies to make preview hosts pass. No guarantee that moving to www automatically fixes these; test the deployed build. |
| Sentry admins + web team — **A8/A10** | A fresh production browser load reproduced the tunnel 403 with Sentry response `{"detail":"event submission rejected with_reason: ProjectId"}`. The generated rewrite reaches the DSN's organization/region/project. Have the Sentry owner verify that project and public DSN/key (and supply the correct DSN if stale); a tunnel rewrite or upload token cannot repair a rejected project. Source maps require a valid upload token and a symbolicated test event; passing an optional CI secret does not verify either. No production test event was manufactured for this PR. |
| Platform + release owners — **C4/O2** | Rehearse a six-service rollback, record time to recover and resolve atomic promotion/rollback behavior. Keep Vercel deploying and its domains attached for at least one release cycle; agree the DNS rollback and TTLs in advance. Written instructions are not a rehearsal. |
| Release/SEO owners — **O1/O4** | Re-run the full routing/crawl/browser/CDN audit on the bound final hostname before changing traffic. Watch Search Console crawl errors, noindex exclusions and sitemap reads for 48 hours afterwards. |

### Deliberately deferred cache proposals

**G9: RSC caching.** Keep `no-store`. Next navigation varies on router state,
prefetch/segment-prefetch, Next-URL, actions and deployment identity, not just
RSC plus one router header. A CDN feature needs a framework-aware cache key and
deployment invalidation/retention before public RSC payloads can be shared safely.

**G11: tracking-key reuse.** Keep the browser URL and attribution intact.
Cloudflare looks up its cache before the gateway runs; normalizing there cannot
merge existing edge keys. Configure a CDN key excluding *only* agreed tracking
parameters while forwarding them to the app. Preserve functional query parameters
(image URL/width/quality, content versions, search/pagination and navigation).
Do not ignore all query strings or redirect away attribution.

**A8: hydration and Data Guide RSC.** The report identifies pre-existing
hydration errors and a Vercel-only Data Guide prefetch 404. These need a
reproducible component/request trace before changing rendering or Vercel's
rewrite behavior. Record current-build browser results below; do not call an
unreproduced hydration issue fixed. The report's Sentry 403s came from actual
browser SDK requests, not merely an invalid synthetic envelope.

## Deployment configuration

Production GitHub environment (`prisma-production`):

- `NEXT_PUBLIC_POSTHOG_KEY`: existing public project key (secret or variable).
  The host is the shared constant `https://proxyhog.prisma-data.net`; no host
  environment setting is needed. Never use a personal/admin PostHog API key.
- `COMPOSER_INTEGRATIONS`: must include `mixedbread`; optional groups bind only
  where consumed. Console must already contain `MIXEDBREAD_API_KEY`, optional
  `BREVO_API_KEY`, `GITHUB_EXTENSIONS_TOKEN`, and for `linear` all of
  `GITHUB_WEBHOOK_SECRET`, `BOT_TOKEN_GITHUB_PR_LINEAR_WEBHOOK`, `LINEAR_API_KEY`,
  `LINEAR_TEAM_ID`. GitHub repository secrets do **not** provision Console
  `envSecret` values.
- Optional `SENTRY_AUTH_TOKEN` secret: build-time upload only, never runtime.
- Optional purge: set **all three** `CLOUDFLARE_ZONE_ID` (variable),
  `WEB_CLOUDFLARE_HOSTS` (comma-separated explicit hostnames, variable),
  `CLOUDFLARE_API_TOKEN` (secret with Cache Purge permission for that zone).
  All unset leaves the step inert; partial/invalid configuration fails before
  deploying. The request purges only those hosts, never the entire zone.
- Optional `WEB_PUBLIC_ORIGIN`: HTTPS URL of the gateway's bound production
  custom domain. Set only after binding/routing is ready. After gateway smoke
  and optional purge, CI verifies release identity, indexability, pages, assets
  and integrations through that host. Setting it to Vercel or the stale preview
  intentionally fails release verification. Leave preview environment purge
  credentials unset.

Local `pnpm dev` and pages-only previews still work without external integration
credentials. Local smoke does not pretend to verify disabled search/analytics.
Generated-host smoke permits preview noindex; the optional public-host check
is the explicit cutover indexability gate.

## Rollback and release verification

1. Before cutover, record the last successful **production** Prisma workflow
   run ID, immutable commit SHA, gateway URL, service versions, Vercel deployment
   IDs and DNS/Cloudflare settings. Preserve both deployment paths.
2. If a release is broken, follow the agreed DNS rollback to the still-verified
   Vercel release first where appropriate. Purge affected CDN hosts after any
   lineage change; do not assume asset retention crosses unrelated previews.
3. To rebuild a known Compute release, inspect its recorded production run with
   `gh run view RUN_ID --repo prisma/web --json headSha,headBranch,workflowName`
   and confirm the expected SHA/main/Prisma workflow. Then an authorized operator
   can use `gh run rerun RUN_ID --repo prisma/web`. GitHub re-runs keep the original
   SHA/ref and workflow, so the action's deployment metadata and retention branch
   still match the source. Do not dispatch a preview branch as “production” or
   just checkout an old SHA under a new run's identity. GitHub's rerun retention
   window applies; keep a normal reviewed revert/roll-forward path too.
4. A rebuild is not an atomic service rollback, and older dependencies/build
   services might no longer reproduce. For immediate version restoration,
   coordinate the platform's supported service rollback across **all six**
   services. Rehearse this before treating it as the primary recovery plan.
5. Run `pnpm composer:smoke GATEWAY_URL` with `WEB_EXPECTED_RELEASE=SHA`.
   On the bound public host also set `WEB_REQUIRE_INDEXABLE=1` and production
   integration flags/key. Check new HTML's chunk URLs, all host redirects and
   real vendor behavior. Re-run the wider audit and regional probes; retain
   request IDs and both cold/warm measurements.

References: [Cloudflare hostname purge](https://developers.cloudflare.com/cache/how-to/purge-cache/purge-by-hostname/),
[Cloudflare purge API](https://developers.cloudflare.com/api/resources/cache/methods/purge/),
[selective cache keys](https://developers.cloudflare.com/cache/how-to/cache-keys/),
[GitHub rerun identity](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/re-run-workflows-and-jobs?tool=cli).

## Verification for this PR

- Proxy unit/transport tests: 42 passed; Composer/config/cache/retention tests:
  60 passed; root script tests: 65 passed. Shared UI 103, Site 351, Blog 102
  and Docs 117 tests passed. All eight type tasks passed.
- Focused cache/range/retention and HTTP transport checks also passed on pinned
  Bun 1.4.3 (34 tests). Existing bounded-memory image-cache tests still verify
  origin reuse; public smoke checks do not depend on stripped internal headers.
- Docs link lint: 735 current files, zero errors; strict redirect audit checked
  1,518 rules against 736 routes, with its existing broad-redirect review list.
- Full six-service Composer build and expanded/compressed artifact checks passed:
  Site 345.7/169.7 MB, Docs 435.8/231.2 MB, Blog 863.7/689.4 MB,
  Handbook 47.5/15.9 MB, Eclipse 83.0/19.4 MB, gateway 37.9/16.5 MB.
  Limits remain 900 MB expanded and 750 MB compressed.
- Mobile browser: Blog's document width changed from 470 to 390 px at a 390 px
  viewport; menu opens and closes. Eclipse's built avatar page references the
  imported logo under `/eclipse-static/_next/static/media/`, not `/img/logo.svg`.
- Fresh production browser loads of `/`, `/postgres`, `/compute`, `/orm`,
  `/stack`, `/docs/composer` and `/docs/orm` produced no hydration errors in this
  run. That is not proof that the audit's earlier failures cannot recur.
- The production Sentry SDK's 403 was independently reproduced with the
  ProjectId rejection above. No event was synthesized/replayed or production
  vendor/security setting changed.

- Expanded local Composer smoke passed: all five sites, original media and
  image variants, canonical-host rules, sitemap source/destination assertions,
  case-only redirects, text TTLs, 416s, small static misses and Markdown/RSC
  separation. RSS after requests: Site 221.0 MB, Docs 501.1 MB, Blog 250.9 MB,
  Handbook 106.1 MB, Eclipse 130.2 MB, gateway 180.2 MB (all below 900 MB).
- Production-built browser checks through the local proxy found no asset failures
  on the changed Eclipse avatar page. All eight repaired 2019 article images
  returned 200. Mobile Blog measured 390/390 px viewport/document width with the
  menu button inside the viewport and working open/close. Known CookieYes local
  hostname rejection and Sentry 403 remain, as documented above.

Ordinary production builds (`pnpm --filter APP build`) passed for Site, Docs,
Blog and Eclipse, including the Eclipse static export. Live configuration, cutover, real enabled integrations and
external vendor acceptance remain explicitly pending.
