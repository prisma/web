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
