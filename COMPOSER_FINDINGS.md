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
`prismaweb` resolved the failure. The connected Console project is now `web`,
so the root module was renamed to `web` before setting up GitHub deploys.
Validate names consistently across the
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
compilation evidence from before the runtime implementation, not a claim that
Vercel accepts source-fragment rules as meaningful HTTP routes. The
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
   services. The initial proposal compiled during the build; the runtime-only
   follow-up below instead ships original inputs and prepares the tables at boot,
   while retaining expanded-size and memory checks.

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
`composer/gateway/server.ts` is a 22-line runtime that binds their origins.
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

Initial library validation on 2026-10-13, before the runtime-only follow-up,
after merging main through `3f690a1e3`: all 33 library tests and 9 Composer checks
passed, including the 1,454-rule reference comparison.
All eight workspace type checks passed using the original Vercel origin settings.
That Composer build/smoke passed all five websites and assets, current/legacy
docs, Markdown negotiation, redirects, query preservation, headers, and budgets.
A packed tarball installed in an independent npm project also passed ESM import,
compiler/serialized-plan execution, real Node gzip/cookie forwarding, and strict
declaration checks with invalid inputs rejected by TypeScript. Frozen install,
formatting/lint, and diff checks passed. The PR diff has no website content changes.

| Service | Expanded artifact, decimal MB | RSS after smoke, decimal MB |
| --- | ---: | ---: |
| Site | 265.9 | 131.7 |
| Docs | 426.1 | 467.6 |
| Blog | 848.0 | 218.9 |
| Handbook | 45.0 | 118.0 |
| Eclipse | 82.6 | 127.3 |
| Gateway | 0.9 | 100.2 |

In that initial build, the compiler was excluded from the runtime and the gateway
JavaScript bundle was about 0.58 MB. The runtime-only follow-up bundles it instead.
Root-only Next/React dev dependencies support the optional Agent Front bridge; the OSS package itself depends only on the Vercel compiler. React
is pinned to the websites' existing 19.2.8 version for that bridge. A shared
Composer gateway module could use this library's plan/provider interface and
offer the middleware/resource bindings without requiring application-specific
bootstrap code. These remain local memory samples; production concurrency,
dashboard routing, and credential verification are still required before moving
traffic.


## Runtime-only proxy follow-up (2026-10-13)

The library now prepares its routing tables at boot. `createProxy` accepts site
adapters directly; `vercel` accepts original `vercel.json`/v3 export paths or
file URLs and optionally a Next routes-manifest path. There is no public
compile/serialize-plan workflow or generated `routing.json`. An adapter reads
its files when `createProxy` initializes it, rather than when the adapter is
declared. Each proxy instance validates all routing and bindings before serving
requests; nonfatal diagnostics are reported once. Requests use that snapshot,
and a restart loads file changes. In-memory configs remain supported.

The HTTP core remains independent of filesystem APIs. File loading lives in
the Vercel adapter through `node:fs`, supported by Bun and Node. A future
Netlify adapter can read `_redirects`/`netlify.toml` at the same startup boundary
without changing the handler or transports. File URL inputs resolve relative
to the server, avoiding dependence on Composer's working directory. Bundlers
cannot infer these dynamic input files: the Composer build explicitly copies
the original site/docs configs and site Next manifest under the gateway's
`sites/` directory. Cleaning that directory removes the obsolete compiled plan.
Next's manifest remains necessary because some parent redirects and hostname
rewrites live in Next config rather than Vercel JSON. Next still executes them.

The compiler adds about 0.10 MB to the gateway JavaScript bundle (0.68 MB total).
The complete assembled gateway is 1.3 MB, including raw routing inputs and
Composer bootstrap files. A standalone Bun 1.4.3 probe initialized the actual
five-site tables in approximately 109 ms; this measures file reading,
compilation, and proxy initialization, excluding module import and HTTP startup.
The gateway build now also checks its copied inputs against the 900 MB budget.

**Composer/Compute improvement:** provide explicit runtime input-file declarations
for gateway adapters, with automatic copying and watching/restart when those
files change. This would remove the app-specific copy loop while keeping file
URLs reliable in local and production assembly. Report routing initialization
failures as failed readiness with their site/file context. Config changes should
require only a gateway restart when website artifacts are unchanged.

Validation passed: 37 library tests, 9 Composer checks (including comparison of
all 1,454 reachable Vercel redirects), all eight workspace type checks with the
existing Vercel origin settings, package formatting/lint, and the complete
Composer build/smoke. The smoke also verifies byte-for-byte copies of the
original configs/Next manifest and the absence of `routing.json`. An independent
npm consumer of the packed library passed file URL initialization, snapshot
routing after deleting the input file, real Node gzip/cookie forwarding, and
strict declaration checks with invalid API inputs rejected.

| Service | Expanded artifact, decimal MB | RSS after smoke, decimal MB |
| --- | ---: | ---: |
| Site | 265.9 | 130.7 |
| Docs | 426.1 | 459.7 |
| Blog | 848.0 | 216.2 |
| Handbook | 45.0 | 116.0 |
| Eclipse | 82.6 | 227.8 |
| Gateway | 1.3 | 138.7 |

These are single local samples, with GC and allocator variation between runs.
All services stayed below the 900 MB guards. Production load and concurrency
validation remain part of the production workspace follow-up. This change adds
no website content or dependency-version changes and leaves Vercel inputs and
build mode intact.


## GitHub connection setup (2026-10-13)

The Console project-create screenshot showed the `prisma` GitHub account but
only nine loaded repositories, with no match for `web`. Inspection of the
Console picker source (`RepoPickerBody` in the control-plane repository) showed
that its search filters loaded repositories by name; it does not search all of
GitHub. The likely first check is repository access in the workspace's Prisma
GitHub App installation: use **Add account**, choose the organization, and
include `prisma/web` in its selected repositories, then refresh the picker.
If more pages are available, **Load more** is also needed because the search
only covers loaded pages. The screenshot had no Load more control. Installation
access was not changed during this investigation; the CLI token could not list
organization installations without the `admin:org` scope.

Connecting the repository enables GitHub OIDC authentication, but deploys still
require the Prisma deploy workflow. The Console can propose that workflow in a
PR. Its build command must be `pnpm composer:build`, with the repo's pinned pnpm,
Node, and Bun available; the existing root `build` script retains Vercel mode.
The Composer setup was still on `codex/web-composer` in open PR #8458, so a first
preview must run code from that branch rather than unmodified `main`. Confirm
the target workspace, region, project identity, and integration variables before
production deployment. No project, connection, deployment, or domain was changed.

**Console improvement:** expose **Manage repository access** beside the account
picker and in empty search results, with a refresh action after the installation
changes. Explain that searches cover only loaded repositories, or implement
search across all accessible repositories. Distinguish missing installation
access from an empty search, and offer an existing Composer build-command
choice when proposing the deployment workflow.

References: [GitHub App repository access](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps)
and [Prisma deploy on push](https://www.prisma.io/docs/compute/deploy-on-push).

## Connected GitHub deployment setup — 13 October 2026

The repository is now connected to the Console project `web`. Console's setup
inspection still reads the default branch, where the Composer PR is not merged.
It identifies the shared `packages/ui` package as Next.js because it declares
Next dependencies, then blocks automatic setup because that library has no
build script. The five applications do have build scripts. The existing
Composer configuration on the PR branch is the intended deployment entrypoint.

The root module originally used `prismaweb`; it must be `web` to target the
connected project. The deployment workflow uses OIDC, an explicit
`pnpm install --frozen-lockfile`, and `pnpm composer:build`. The action's automatic
install detection supports npm/Bun rather than pnpm; its default build command
would also use the Vercel build path. Node 24 and Bun 1.4.3 are installed before
the action. Each website retains its separate artifact and 900 MB size guard.

The workflow selects the gateway from the action's service URL map and smoke
tests all five sites there. The gateway is also declared first: the action's
default URL selection chooses the first service with a root address when more
than one exists. A connected repository uses the platform's branch-deletion
automation for preview cleanup; the action currently cannot invoke CLI destroy.

**Product improvements:** distinguish workspace libraries from deployable apps
using app/config evidence instead of framework dependencies alone; show which
branch was inspected and let users choose an existing Composer branch and build
command; validate that the Composer module matches the connected project name;
support pnpm lockfiles directly in the deploy action; and let multi-service
modules declare their public entrypoint explicitly for deployment URLs and
Console links.

Local validation of the renamed module passed all 37 proxy tests, 9 Composer
checks, the complete build and six-service smoke test, all eight workspace type
checks, and workflow actionlint. The largest expanded artifact was blog at
848.0 MB. Docs had the highest sampled RSS at 488.1 MB; the other five processes
were below 224 MB. The smoke verified pages, static assets, Markdown, legacy
redirects, query handling, and current/legacy docs articles through the gateway.

The [first GitHub preview run](https://github.com/prisma/web/actions/runs/38428530811)
successfully exchanged GitHub OIDC for a short-lived workspace token and reused
the connected project. The Linux build passed every artifact guard (blog was
848.5 MB), but deploy preflight rejected six missing integration credentials.
`envSecret` bindings are required even when their input schema fields are
optional. Local dev had hidden this difference by supplying placeholders.

The fix makes external integrations explicit through `COMPOSER_INTEGRATIONS`
(`mixedbread`, `brevo`, `extensions`, `linear`). An empty selection binds no
credentials, allowing the initial pages/assets preview. Enabled integrations
still use real `envSecret` bindings, scoped to the websites that consume them;
missing values fail deployment. The workflow reads a non-secret GitHub variable,
with environment-level overrides for production or a particular preview. The
setup guide lists every required key and where to configure it. Unknown names
fail configuration, and regression tests cover empty selection, per-site secret
scope, and invalid selections. No fake cloud secrets are introduced.

**Compute/Composer improvements:** offer optional platform secret bindings that
honor optional schema fields, with an explicit unset value; clearly distinguish
local placeholder behavior from deploy requirements; and expose preflight before
the full build so missing credentials are caught before several minutes of work.

After merging the latest `main`, validation passed 37 library tests, 12 Composer
checks (including three credential-selection regressions), all eight workspace
type checks, the full build, and the six-service local smoke with no credential
bindings. The highest sampled RSS was docs at 488.2 MB. The deploy workflow skips
pushes limited to these two operational Composer guides so recording deployment
findings does not rebuild and redeploy unchanged services; website content is
not excluded.

## Compressed upload limit and blog media — 13 October 2026

The [second cloud attempt](https://github.com/prisma/web/actions/runs/38430380305)
passed OIDC, build and credential preflight. Five services deployed, but blog
failed in Alchemy before upload: `Prisma deployment artifact exceeds the
268435456 byte upload safety limit`. This is a separate hard 256 MiB archive
limit in `alchemy` 2.0.0-beta.78's `Prisma/Deployment.ts`; its validation does not
permit raising the limit. The 1 GB expanded filesystem guard alone therefore
did not establish deployability.

The blog's original public media is now distributed deterministically across
four small Compute services. Files are copied unchanged, with paths, sizes and
SHA-256 hashes in a catalog. Only the assembled Composer blog public directory
is removed; no source assets, website content, Vercel configuration or default
build output are changed. The gateway reads the catalog and original blog Next
manifest at boot, generating exact resource dispatch in memory. Parent rules
and Next redirects retain precedence; media receives the blog's original
headers. Static handlers stream files with ranges, HEAD, conditional requests
and validators, and serve only cataloged public files. The actual proxy entry
remains 22 lines; the vendored OSS library remains runtime-only.

Both expanded (900 MB) and compressed (240 MB) budgets now run during assembly.
The latter streams a system `tar` archive into a byte counter, leaving room
below the provider's 256 MiB cap for its bootstrap and tar-encoder differences.
Media shards have a separate 200 MB uncompressed cap, so incompressible images
cannot approach the upload limit. The first local build measured blog at
165.6 MB expanded / 38.1 MB compressed; media archives were 161–163 MB each.
Docs was largest at 426.1 MB expanded / 227.8 MB compressed.

Tests cover deterministic complete partitioning, oversized media, actual Bun
file streaming, ranges, HEAD, validators, private-file exclusion, retained
headers, exact dispatch, and Next redirect precedence. The full smoke now
checks an original file from every shard by hash through the gateway, as well
as ranges, HEAD, cache validation, and sampled memory across all ten services.

**Compute/Composer improvements:** advertise upload limits alongside memory and
expanded filesystem limits; include compressed-size checks in the normal
assembler and report the largest contributing files; align streaming upload
limits with supported runtime artifacts where possible; and provide a public
object-storage/CDN asset primitive so a large media collection does not require
four extra Compute services. The current packager builds the tar and gzip in
memory; streaming packaging would also reduce deployment-machine memory peaks.

Local validation on 14 October passed 37 proxy tests, 16 Composer checks, the
complete ten-service build and smoke, and lint. All 1,470 public media files were
cataloged; the smoke verified original bytes and HTTP behavior from every shard.
Docs sampled 421.6 MB RSS, the highest service sample; media services stayed below
95 MB. The local smoke initially caught a missing default service export in the
new media factory; each media service now has a small explicit default entrypoint.
Composer's node assembler could validate this bootstrap contract before
provisioning, and readiness could detect a process that immediately crashes
instead of first reporting deployment creation and relying on later HTTP checks.

## Compute ingress and public request origins — 14 October 2026

The [third cloud run](https://github.com/prisma/web/actions/runs/38436398041)
successfully deployed all ten services. Its gateway URL was selected correctly
by both the action and GitHub environment. One media startup took about three
minutes longer than its siblings, but deployment eventually succeeded. The
remote smoke then received 502 on the homepage, while the site service responded
200 directly. A controlled request to the site endpoint with the gateway's HTTP
`Host` returned the gateway's health response: Compute ingress routes by Host,
so preserving the public Host at the upstream connection caused a proxy loop.

The OSS proxy now sends the upstream Host and preserves public forwarded fields.
Its provider-neutral `upstreamHeaders` hook supports application header handling.
The web setup uses that hook to send authenticated public-origin metadata only
to the five named Next services. Their Composer bootstrap restores the public
host/scheme inside the Node HTTP request boundary, then removes the private
markers. This preserves hostname-based Next rewrites and server-action origin
checks without trusting arbitrary client headers or changing the Vercel path.

The workflow generates a masked CSPRNG key in `WEB_PROXY_KEY`. Existing values
are reused by deploy preflight; an absent key is provisioned into the target
environment from the workflow. Both ends use the same `envSecret` reference.
No external integration credentials are required for this internal hop. Tests
exercise actual HTTP forwarding, valid and forged markers, malformed hosts,
private-header removal, and exclusion of keys from media/external destinations.
The gateway entrypoint is now 24 lines, still just application wiring.

**Compute/Composer improvements:** document ingress Host routing and forwarded
header behavior; offer an authenticated service-to-service origin bridge in the
Next adapter; expose readiness/startup progress for a slow service; and make a
failed post-deploy smoke visible alongside deployment success in Console. The
action currently reports success before subsequent workflow verification runs.

The authenticated-hop revision passed all 37 library tests, 18 Composer checks,
the complete build and ten-service local smoke. The sampled maximum RSS was
461.6 MB (docs); each media service was below 90 MB. The internal key stayed out
of response headers and was excluded from external rewrites and media hops.

## Verified GitHub preview — 14 October 2026

[Run 38441243472](https://github.com/prisma/web/actions/runs/38441243472) succeeded
on code revision `9c8f63f4a`. All ten services deployed into the existing
project's `codex/web-composer` preview. GitHub OIDC authenticated through the
existing connection; the internal-key preflight checked one setting, filled
one absent value and reported no missing settings. Neither the repository
connection nor production domains were changed.

The public entrypoint is
[the gateway](https://dwgv6bi6aljw05msqzcpvtgg.ewr.prisma.build). Both the action's
primary URL and the GitHub deployment environment selected this gateway.
The remote smoke passed all five sites and their static assets, current and
legacy docs, Markdown content negotiation, imported redirects, repeated query
values, normalization and Next redirect precedence. Original media from all
four shards passed SHA-256, headers, range, HEAD and 304 validation checks.
Verification took about 16 seconds after deployment. The workflow completed
successfully, and all five Vercel preview checks also passed on that revision.

Linux artifact measurements: docs was largest at 425.4 MB expanded / 226.6 MB
compressed; blog was 166.1 / 37.7 MB; media shards were 171.3 MB expanded and
161.1–162.8 MB compressed; gateway was 1.7 / 0.4 MB. All budgets passed.
Local validation included 37 library tests, 18 Composer checks, all eight
workspace type checks, full build/smoke, lint and actionlint. Cloud RSS was not
measured by the remote smoke; the local samples remain in the setup guide.

External integrations remain an explicit opt-in requiring real keys. The next
production step is configuring the required integration/public build settings
before merging the workflow, then auditing domains and production load before
moving public traffic. The operational findings update does not redeploy
unchanged services because these two guides are excluded from push triggers.

## Ownership of the upload cap — 14 October 2026

The 256 MiB cap belongs to the **Prisma-specific provider inside Alchemy**,
not to a generic Alchemy engine limit. In the installed 2.0.0-beta.78 release,
`Prisma/Deployment.ts` defines `MAX_DEPLOYMENT_ARTIFACT_BYTES` as
`256 * 1024 * 1024`. The same constant remains in
[current upstream source](https://github.com/alchemy-run/alchemy/blob/1c1461cb8dad6c24a4824f36cb58b10cc3c5b7d1/packages/alchemy/src/Prisma/Deployment.ts#L46).
It governs file inspection, byte-array validation and the final upload guard.
The validation helper's `maxBytes` argument can lower the limit, but explicitly
rejects a higher value; deployment properties expose no override. An upstream
[regression test](https://github.com/alchemy-run/alchemy/blob/1c1461cb8dad6c24a4824f36cb58b10cc3c5b7d1/packages/alchemy/test/Prisma/Deployment.test.ts#L140)
also enforces that restriction. Updating Alchemy alone does not currently
remove it.

This proves the observed failure is client-side, before a PUT to the
presigned upload URL. It does **not** establish the maximum the hosted upload
and Foundry extraction paths accept. The inspected control-plane deployment
interactor asks Foundry to create a version and returns its upload URL; it does
not receive the artifact bytes or apply this 256 MiB check. Foundry's actual
upload/extraction limits still need confirmation or a live test.

The provider's file-backed hash and upload already stream in 64 KiB chunks.
The separate Composer Prisma Cloud packager remains memory-proportional to the
artifact: it reads every file into a buffer, concatenates the tar and calls
`gzipSync`. This is present in both the installed release and
[current Composer source](https://github.com/prisma/composer/blob/90a30381fb37bc204bcd003358c8bec28bec8d69/packages/1-prisma-cloud/0-lowering/lowering/src/compute/artifact.ts#L199).
Raising the provider cap does not solve that deployment-machine memory peak.

**Path to removing the workaround:** establish the platform's compressed and
expanded limits; align the Prisma provider's cap with the supported upload
limit; stream Composer's deterministic tar/gzip packaging to a temporary file;
then deploy a real artifact above 256 MiB and verify extraction, readiness,
original media bytes and memory. Preserve the Compute filesystem guard
independently. Consolidate the blog media services only after that succeeds.
The working Web preview and its limits are unchanged by this investigation.

## Proxy connections in the Console topology — 14 October 2026

The intended request path is Internet → gateway → the selected website or
media service. The gateway implements that path, but the Composer declaration
does not express its HTTP calls as dependency edges: every service currently
has `deps: {}`, and gateway upstream URLs arrive through `serviceOrigin()`
input bindings. Loading the real module with Composer 0.29.1 produced ten
services, zero dependency edges, zero authored edges and zero ports.

Console's `application-topology-layout.ts:publicServices()` infers entrypoints
as services that are not the provider of any submitted edge. With no edges,
it draws Internet arrows to all ten services. Those arrows are an inference
from declarations, not measured request traffic or configured routing rules.
The current diagram therefore omits the proxy connections. The Web runtime
works, but its communication topology is incompletely modeled.

This is also separate from network isolation. A read-only live check returned
200 from the gateway root and from the site root and docs page on their own
Compute URLs. Configuring the gateway as the public entrypoint does not make
the other endpoints private. `WEB_PROXY_KEY` authenticates public-origin
metadata in Next; it does not deny ordinary direct requests. A future
gateway-only access policy needs explicit enforcement, not a different diagram.

The installed SDK exports an untyped `http({ name })` dependency. A minimal
probe wiring a frontend's HTTP dependency to a provisioned backend produced a
flat dependency edge and a consumer input port, but **zero authored edges**:
the backend's bare ref has no exposed port for the topology exporter. The
exporter submits `graph.authoredEdges`, so replacing URL inputs with that bare
HTTP dependency alone would not fix this view. No cloud deployment was made
with the probe.

**Compute/Composer improvements:** support first-class raw HTTP provider ports
and dependency wiring through load, deployment and topology export; expose an
explicit ingress/access policy rather than inferring it from dependency
degree; and distinguish declared connections, public reachability and observed
traffic in Console. `serviceOrigin()` references could be shown separately as
configuration relationships, but should not automatically be treated as
traffic: website inputs also reference the gateway to form cross-site URLs.
Do not add unused RPC contracts solely to make a diagram look connected.
