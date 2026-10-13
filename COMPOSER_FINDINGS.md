# Composer and Compute findings from porting Prisma Web

Recorded on 12 October 2026. Tested with Composer and the Prisma Cloud target
0.29.1, Prisma CLI 8.0.0-rc.22, Next.js 16.3.4, pnpm 12.3.4, and Bun 1.4.3.
The target constraints are 1 GB memory and 1 GB files per Compute service.
These observations describe local tests; production workspace deployment is a
separate follow-up. The setup and reproduction commands are in [COMPOSER.md](COMPOSER.md).

## Application and build findings

| Observation | Evidence | Resolution in this PR |
| --- | --- | --- |
| The repository contains five websites, not just the three public zones | Site, docs, blog, handbook, and Eclipse each have their own Next.js app | One root module, five website services, and an HTTP gateway |
| One combined artifact cannot fit | Blog public media is about 653 MiB; site and docs public directories add about 138 MiB and 74 MiB before code or prerendered output | Keep website artifacts separate |
| Docs prerendering exceeds the file limit on its own | Initial standalone output was about 1.8 GiB on disk; server output included about 916 MB RSC and 372 MB HTML, measured as decimal bytes | Omit the article static-params generator in Composer mode and use request rendering |
| Eager MDX exceeds the memory budget | The local docs Bun process reached about 1.6 GB RSS before successful article navigation; the blog was about 677 MB | Enable Fumadocs async collections in Composer mode and materialize content at its consumers |
| Lazy collection data differs from eager data | Frontmatter is immediate, but body, toc, and last-modified exports require `load()` | Shared `pageContent()` helper; update pages, Markdown, prompts, RSS, sitemap, structured data, and link/agent checks |
| Returning an empty static-params array is insufficient | Next records a blocking fallback/ISR route; `connection()` in that route returned `DYNAMIC_SERVER_USAGE` at runtime | Export an undefined generator in Composer mode, preserving the original generator in Vercel mode |
| The native Next adapter understands this pnpm monorepo | It locates the app from Next's tracing manifest and repairs omitted/escaping traced dependency links | Reuse that assembler, rather than copying `node_modules` or building a custom Next server |
| Blog remains the tightest file budget | After the changes its artifact is approximately 846 MB, including public media | Enforce a 900 MB expanded-artifact budget; media offload is the next step if it grows |

The final complete smoke run measured site 129 MB, docs 467 MB, blog 211 MB,
handbook 115 MB, Eclipse 128 MB, and gateway 105 MB RSS after page/asset requests,
including current and legacy reference articles. Every process passed a 900 MB
RSS check. The largest expanded artifact was blog at about 846 MB. Both the
Composer build and the original Vercel-mode builds passed for all five websites.
The docs, blog, shared UI, root redirect/link tests, Composer tests, and docs/blog
link checks passed; the docs agent-readiness check reported zero failures.

Lazy imports and request rendering solve different problems. Lazy imports reduce
the startup heap; request rendering removes the stored HTML/RSC footprint.
Fumadocs documents [async collections and their content-loading contract](https://fumadocs.dev/docs/mdx/async).
Memory readings are process RSS samples on macOS, not a guarantee about all
production traffic, concurrency, or long-running module-cache growth. Preview
deployment should include a sustained request test against Compute's actual
memory limit and first-byte deadline.

Existing navigation and SEO intentionally include absolute `www.prisma.io`
links. Local requests to the gateway's zone paths work, but some existing
cross-site navigation still points at the canonical public host. This port does
not change that content convention. The original Turbo dev workflow also
requires local `NEXT_DOCS_ORIGIN`/`NEXT_BLOG_ORIGIN` overrides to avoid its
production fallback; the Composer gateway has no such fallback.

## Runtime and local development findings

### Bun compatibility and daemon isolation

The installed global Bun was 1.3.13. The first local HTTP requests failed while
loading `app-page-turbo.runtime.prod.js` with "Expected CommonJS module to have a
function wrapper". This has a [Bun issue with the same Next.js 16.3 reproduction](https://github.com/oven-sh/bun/issues/36866).
Bun 1.4.3 loads that runtime. The global installation was upgraded at the user's
request, and this repository pins 1.4.3 for repeatable local and CI runs.

A machine-wide compute daemon can retain the executable and state it started
with. The config therefore isolates the daemon by checkout. When changing from
the global daemon to a private daemon, existing local generated origin values
still pointed at old ports: gateway inputs contained ports 3010–3014 while the
new services were listening on 3003–3005 and other ports. Requests returned 502.
A fresh local run regenerated the origin bindings correctly. This is a local
state transition issue, not a reason to hardcode service URLs.

**Suggested improvements:** publish the exact Compute runtime version; make
local dev use or verify the same version; include it in `dev` diagnostics; scope
the default emulator by checkout; and regenerate local `serviceOrigin` bindings
when the daemon's identity or endpoint ports change.

### Watcher size and restart boundaries

The native Next adapter watches whole standalone trees and repaired tracing
targets. With these sites that produced repeated `EMFILE: too many open files,
watch` errors. Watching `.next/BUILD_ID` provides one completed-build marker per
website and avoids restarts while Next is still writing its output. Ctrl-C then
stopped the services successfully without the watcher flood.

**Suggested improvement:** give the Next adapter a completed-build watch mode,
preferably its default, with source HMR as a separately documented development
mode. Detect watcher exhaustion and emit one actionable error, rather than
repeating it for every attempted watch.

### Readiness and logs

The local control API can return a ready session before all HTTP listeners are
accepting connections. A smoke test's first gateway request received
`ECONNREFUSED`. The smoke runner now retries transport errors and startup
502/503 responses for up to 60 seconds, while application 500s fail immediately.

The CLI's startup stream did not include the Next.js service errors. Diagnosing
the CommonJS and dynamic-render failures required opening the emulator's
per-service logs. "Ready" alone did not establish that the pages worked.

**Suggested improvements:** verify listeners or a configurable HTTP health
check before readiness; expose a merged service-log option on `dev`; and
surface a failed boot with its service name, runtime version, and first error.

### Optional inputs differ between dev and deploy

The input schema supports optional fields, but the local target's preflight
requires every referenced `envParam` to exist even when its field is optional.
It also creates placeholder values for every referenced secret, including
optional secrets. Default bindings were narrowed to the integrations each
website uses; optional plain settings can be wired explicitly when configuring
the production workspace. Agent Front secrets are left unbound so a placeholder
does not enable reporting to an external ingest service.

**Suggested improvement:** resolve absent optional values consistently with
deploy/schema validation. Use placeholders only when explicitly requested for
testing an enabled integration. Explain which local features are disabled or
using placeholders, without requiring every application to write its own flags.

### Naming validation

A root module named `prismaWeb` passed authoring/typechecking but failed during
local convergence with `invalid path segment "prismaWeb"`. Changing it to
`prismaweb` resolved the failure. Validate names consistently across the
module graph, target, and local URL/path encoder, before spending time assembling
all services; include the permitted pattern in the error.

## Adapter, gateway, and deployment suggestions

1. **Add a supported Next.js pre-boot hook.** This PR wraps native assembly to
   inject typed service input before importing `server.js`. An official hook or
   typed legacy-environment mapping would remove that wrapper while preserving
   existing Next.js code. Bind Next's actual `HOSTNAME` setting as well as
   Composer's `HOST` setting, so container hostnames cannot cause binding errors.
2. **Provide an HTTP gateway module for multi-zone Next apps.** It should bind
   upstream origins per stage and preserve POST bodies, RSC headers, redirects,
   cookies, compression, ranges, cancellation, and streaming. A raw HTTP proxy
   fits these existing websites better than translating all requests into RPC.
3. **Make standalone asset-prefix behavior explicit.** Requests such as
   `/docs-static/_next/static/...` must reach `/docs/_next/static/...` on the
   standalone server. Include this in the adapter/gateway example and test it.
4. **Support importing existing routing rules.** The gateway reuses both Vercel
   redirect tables and the site's built Next routes manifest. Moving only the
   `/docs` and `/blog` forwards loses site-level legacy zone redirects. A
   migration helper should preserve ordering, conditions, query parameters,
   status codes, and base paths, and identify unsupported rules.
5. **Report expanded artifact size before provisioning.** Show compressed size,
   expanded bytes, file count, and remaining per-service headroom. The initial
   too-large docs build was valid Next output; its resource problem needed a
   separate check. Reject an oversized artifact early, with the largest folders
   and suggestions to reduce it.
6. **Offer static-asset offload for Next.js.** Public media and client assets are
   the next growth constraint. A managed object-store/CDN path with immutable
   build URLs and image-optimizer support would avoid an extra asset service.
   Keep server-side prerendered output and ISR storage in the size accounting too.
7. **Expose runtime memory in local tooling and preview diagnostics.** Eager MDX
   passed compilation and artifact checks but exceeded the runtime memory budget.
   Show per-service RSS/heap after startup and representative requests; offer a
   local limit matching the Compute VM rather than relying on the laptop's RAM.
8. **Make the build/run split and its costs visible.** Builds belong to the
   developer or CI machine; `dev` and `deploy` only assemble and run them.
   Sequential Next builds with one worker passed here, but local orchestration
   and packaging used several GB and took tens of seconds before ready. Display
   build, assembly, packaging, convergence, and boot durations separately, and
   cache unchanged assembly/archives on warm runs.

## Production follow-up

No production resources or domains were changed. Before moving traffic, verify
the runtime version, target region, actual filesystem and memory limits,
representative concurrent and sustained requests, integration credentials,
public build settings, gateway host/CSRF behavior, and cold starts in a preview
stage. Then connect the public domain and deployment automation to the gateway.
Vercel remains the existing deployment path while that work is done.

## PR validation follow-up

The first GitHub run passed the Composer build/smoke test, all five Vercel
previews, and the docs/Eclipse browser tests. The Links workflow failed in its
version check: npm's current `prisma` was 8.0.0-rc.22 with CLI engine 0.7.0,
while 16 current documentation references still used the previous versions.
Those current examples and the upgrade guide's historical-version clarification
were merged separately in [PR #8464](https://github.com/prisma/web/pull/8464).
No validation was weakened or skipped.

CodeQL and CodeRabbit identified the new workflow's default token permissions
and persisted checkout credentials. The Composer workflow now grants only
`contents: read` and disables credential persistence. The lazy-content test also
verifies preservation of `getText("processed")`. Header/cookie conditions already
worked for the generated Next redirect table; the same request headers are now
passed to both imported Vercel tables, with a conditional-redirect regression
test. Neither imported Vercel table currently contains header/cookie conditions.

## Routing parity audit

The gateway imports all 20 site and 1,439 docs Vercel redirects. An exhaustive
comparison against Next.js's path and destination compiler covers all 1,454
reachable rules, wildcard parameters, repeated/encoded query values,
destination fragments, status codes, and first-match table precedence.
Five pre-existing docs rules contain fragments in their **source**; browsers
never send those fragments to servers, so these rules cannot match on either
platform. They are retained unchanged and explicitly identified in the test.
Config tests also compare each app's redirects,
headers, and non-zone rewrites between Vercel and Composer modes.

The audit caught migration defects, now fixed:

- Already-prefixed docs redirects to `/customers` and `/company` were wrongly
  mounted under `/docs`. Only the two unprefixed docs aliases require a mounted
  destination; explicit public destinations keep their meaning.
- Forwarded repeated query values were dropped after the first value. The
  gateway now distinguishes keys provided by the destination from keys copied
  from the request, retaining all request values for non-overridden keys.
- The site's hostname-based external `beforeFiles` rewrite could be bypassed
  by `/docs` or `/blog` dispatch. The build now includes those rewrites in the
  gateway routing snapshot, and matching requests go to the site to execute
  its original Next.js rewrite. The gateway never proxies an arbitrary request
  hostname directly.
- Site Next.js redirects now execute in the site server instead of producing
  a bare gateway response. This keeps Next's own redirect response semantics
  and passes through any headers it returns. They take precedence over docs
  redirects. Next.js 16.3.4 intentionally clears configured response headers
  when returning a config redirect (`resolve-routes` returns `resHeaders: null`);
  the live test confirmed this. Page CSP/security headers remain present.
- Repeated slashes now produce a 308 normalization redirect before evaluating
  route rules, matching Vercel's documented CDN normalization behavior.

Zone-local Next.js redirects, rewrites, middleware, and headers remain in the
Next servers, including docs/blog Markdown, MCP, Sentry, analytics, and dataguide
forwarding. Repository parity is separate from Vercel dashboard domain redirects,
firewall/CDN rules, custom domains, and third-party integration credentials;
those need production access and verification before a traffic move. Composer
would benefit from a routing import/audit helper that exposes both kinds of rules
and reports precedence changes rather than only checking syntax.

The audit initially found a cross-zone behavior difference: the site's
Agent Front middleware observes docs/blog requests before Vercel forwards them.
The Composer gateway dispatches those requests directly to their own servers,
so configuring Agent Front only on the site would no longer cover those zones.
The library integration below now provides a gateway middleware bridge for
that hop, using the existing Agent Front implementation. It remains unbound
locally; enabling it requires the same ORA settings on the site and gateway.
Zone-local Markdown negotiation stays in each Next server.

Validation on 2026-10-12: all 22 Composer checks passed, all five websites
built, and the complete local smoke passed pages/assets, docs Markdown,
docs-to-marketing and legacy redirects, repeated/encoded query values,
slash normalization, site-before-docs redirect precedence, blog query-conditional
redirects, site/docs/blog Markdown negotiation, and page security headers.
No website content or Vercel configuration changed in this routing fix.

| Service | Expanded artifact, decimal MB | RSS after smoke, decimal MB |
| --- | ---: | ---: |
| Site | 264.3 | 132.9 |
| Docs | 425.7 | 453.7 |
| Blog | 848.2 | 211.5 |
| Handbook | 45.0 | 102.5 |
| Eclipse | 82.6 | 130.4 |
| Gateway | 0.9 | 107.6 |

These local macOS samples remain subject to the sustained-load and production
concurrency follow-up above. The blog artifact has about 52 MB left before the
repository's 900 MB guardrail, so media offload remains the first size improvement.

## Reusable OSS proxy from Vercel routing exports

The reusable component is now implemented as the vendored Apache-2.0
[`@prisma/proxy`](packages/proxy/README.md) package. Vercel already publishes
[`@vercel/routing-utils`](https://github.com/vercel/vercel/blob/main/packages/routing-utils/package.json)
under Apache-2.0. Its documented
[`getTransformedRoutes()`](https://vercel.com/docs/build-output-api/features#high-level-routing)
converts `vercel.json` redirects, headers, rewrites, clean URLs, and trailing-slash
settings into the lower-level Build Output API route format. It is a compiler
and validator; executing those routes requires a separate request-time router.

On 2026-10-12, a disposable probe using the published version **6.6.0** compiled
all 20 site redirects and all 1,439 docs redirects into 1,459 exported route
entries, with no compiler errors. A mixed headers/redirects/rewrites fixture
also produced a `filesystem` phase and a rewrite with `check: true`. This is
compilation evidence, not a claim that an exported-route runtime has been built
or that Vercel accepts source-fragment rules as meaningful HTTP routes. The
probe installed no dependencies in this repository and changed no app routing.

The architecture has three parts:

1. **Importer/compiler.** Accept a Build Output API v3
   [`.vercel/output/config.json`](https://vercel.com/docs/build-output-api/configuration#routes)
   export, or compile high-level `vercel.json` routing with Vercel's library.
   A separate Next.js manifest adapter can support the current standalone-build
   workflow without requiring a Vercel build. Preserve each project's route
   order, mount/base path, and middleware boundaries. Report the source file and
   rule index for invalid, unreachable, or unsupported entries.
2. **Portable HTTP runtime.** Expose a standard
   `(request: Request) => Promise<Response>` handler. Match compiled routes and
   execute redirects, internal/external rewrites, headers, methods, host/header/
   cookie/query conditions, and `continue` behavior in their exported order.
   Retain repeated and encoded query values, redirect statuses, POST bodies,
   cookies, streaming, compression, ranges, and cancellation. Support the
   export's regex dialect explicitly; a successful JavaScript `RegExp` parse
   alone does not establish equivalence with every PCRE expression.
3. **Composer adapter.** Provision a Bun gateway with typed service inputs and
   bind exported resource/service destinations to `serviceOrigin()` values.
   Rebind known old origin URLs explicitly and leave intentional external
   destinations external. Each imported project needs its own target/resource
   mapping; the JSON export alone cannot identify its replacement Compute
   services. Compile during the build and ship the routing plan with the
   gateway, then check expanded size and runtime memory as this PR already does.

Middleware and resource phases need explicit providers. A `middlewarePath`
references executable code, and `filesystem`/`check` require knowing which
resources exist; blindly skipping either changes route precedence. Require a
registered middleware/resource adapter or reject the affected export with a
clear diagnostic. This provides a place to preserve the site's global Agent
Front hop before docs/blog dispatch. A rule export alone cannot execute Agent
Front or any other application middleware. Likewise, caching/ISR, image
optimization, locale rules, transforms, platform mitigation, and dashboard
domain/firewall settings require dedicated support or a reported limitation.

The first release should publish a support matrix and reject unsupported
execution features by default. Its conformance corpus should include this
repository's redirect tables and the proxy smoke/regression cases, plus
multi-project mount precedence and middleware/resource phase fixtures. Prefer
Vercel's compiler and public schema over continuing to extend this repository's
custom destination-string substitution into a general-purpose implementation.
Vercel's OSS dev router is useful reference material, but is coupled to its dev
server and filesystem orchestration; it is not a drop-in Fetch/Compute gateway.

The library replaces the former handwritten gateway router/proxy in this PR.
Its core and Vercel adapter are independent of Prisma website names, Composer,
and Next.js. `composer/gateway/config.ts` supplies the five website definitions;
`composer/gateway/server.ts` is a 24-line runtime that binds their origins.
The published-style package has JS/declaration exports, a standalone build,
Apache-2.0 license, README, and Bun/Node raw transports. It is vendored and has
not been published to npm.

The implementation uses Vercel's compiler for high-level and v3 exported rules,
retains per-site order and parent-before-child precedence, handles mixed public
and mounted docs redirects, and delegates the site's Next redirects/external
beforeFiles rewrites to its own server. Resource and middleware providers are
explicit; unsupported phases, transforms, locale/mitigation, object-valued
conditions, and Vercel routing-only service path overrides fail at compilation
instead of being ignored. Routing providers compile into a common plan, so a
future Netlify adapter can be added without changing the HTTP runtime.

The optional Agent Front bridge calls the site's actual implementation for
child requests and preserves its asset/RSC exclusions. Root requests still
execute it in Next. Its integration test uses a local ingestion fixture and
verifies one event per eligible child request, with no external credential or
network dependency. Matching Vercel redirects are case-sensitive, verified
against the live `/accelerate` versus `/Accelerate` behavior during the audit;
framework delegate selectors preserve Next's own matching semantics.
