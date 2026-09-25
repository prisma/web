# ppg-proxy blog series (proposal)

A four-part series on how we manage Prisma Postgres connectivity: what the ppg-proxy is, the problems it solves, how it evolved, the challenges we hit, and the revamp we did as a result.

## Series framing

**Promise:** How Prisma Postgres builds a secure, serverless-friendly connectivity layer for Postgres, and the engineering behind it.

**Audience:** senior backend and platform engineers, plus database/protocol-curious readers. We keep the depth. Every post opens on a user-visible problem before going low-level.

**Goal / definition of success:** build technical trust in Prisma Postgres connectivity and show the engineering rigor behind it. Secondary: it doubles as a recruiting signal for infra engineers. The structure below serves that goal.

**Repeated structure per post** (makes each post easier to write and to follow):

1. The problem a developer or operator actually hits
2. Why the obvious solution breaks down
3. Prisma's approach
4. Tradeoffs and lessons learned
5. What this unlocks next

Each post opens with a one-line "After reading, you'll understand X" and closes with a concrete takeaway, not just a "what's next".

**War stories** (logging-to-stdout, noisy neighbor, protocol rewrites, fakepg) appear as sidebars that support the reader-facing point. They are not the spine.

**Jargon** (ingress, framing, flow control, terminal adapters, clean/busy/dirty connections, transaction-boundary detection, pgproto3, sub-message streaming) is introduced progressively and defined at first use, not assumed.

---

# Post 1 - Why Prisma Postgres needs a gateway

_Subtitle: the connectivity, security, and isolation problems a multi-tenant Postgres platform must solve._

**After reading, you'll understand** what sits between your app and a Prisma Postgres database, and why "a thin proxy" is the wrong mental model.

1. The problem: connecting to a database in a multi-tenant, multi-region platform
    - What Prisma Postgres is and where it runs (brief; we covered microVMs/unikernels before)
    - Why "just expose Postgres on a port" does not survive contact with multi-tenancy, isolation, credential rotation, and abuse
2. The gateway mental model (establish this early, before internals)
    - ppg-proxy as a single control point: routing and tenant isolation, auth boundary, metering point, observability boundary. State plainly that it is all of these, and why co-locating them is deliberate.
    - Security first: the gateway lets us cordon the Postgres hosts off from public traffic entirely. That is a structural security and maintenance win, not a side effect.
3. What the gateway gives you (framed as reader value)
    - Auth: API-key based, rotation without touching database credentials
    - Usage visibility and fair resource accounting (queries, ingress/egress, backup traffic), framed as fairness, abuse protection, and operational safety rather than vendor billing
    - Unified throttling, observability, access logging
4. The hard parts (short teaser for the rest of the series)
    - Distributing the routing data: choices and tradeoffs
    - The Postgres wire protocol is message-oriented, and the open-source library landscape is uneven
    - Buffering and the noisy-neighbor problem: horizontal scaling hides it, it does not solve it
    - Why we committed to end-to-end low-level streaming while still inspecting selected messages (error reporting, query counting)
    - Sidebar: our logging-to-stdout adventure, a short war story on why observability at a gateway is harder than it looks

**Key takeaway:** the gateway is what makes secure, isolated, meterable Postgres access possible. The rest of the series is how we make it fast and serverless-friendly.

**What's next:** we still need a serverless-friendly entry point and per-tenant pooling.

---

# Post 2 - Why serverless apps are hard on Postgres connections

_Subtitle: connection lifecycle pressure, and what pooling can and cannot fix._

**After reading, you'll understand** why ephemeral compute breaks the Postgres connection model, and exactly which part of that problem pooling solves.

1. The problem: ephemeral compute meets a stateful connection model (keep tight, tie every point to DB connectivity)
    - Short-lived processes and connection storms
    - Persistent connection and transaction model vs throwaway compute (Lambda-style) vs a long-lived VM/EC2
    - Sometimes no native TCP/TLS client connectivity at all (foreshadow Post 3, do not resolve it here)
2. Why the obvious fix (a fresh connection per invocation) breaks down
    - Connection create/teardown cost on the database
    - Approaches to bridge the gap: dedicated pooler, HTTP/WS wrapper, or pooler-as-a-service (Accelerate does both, with limits)
3. Prisma's approach: pooling
    - What pooling is and its actual goal: relieve connection lifecycle pressure on the database
    - Pooling levels (statement, transaction, connection) and how each reuses connections (query boundaries, transaction detection)
    - How Prisma Postgres does it today (per-db pgbouncer) and its limits alongside the ppg-proxy
4. Tradeoffs and non-goals
    - Pooling does not make queries faster, and can add latency
    - It helps connection lifecycle, not query performance
    - The cases where a pooler actively slows you down
5. What this unlocks / what is still missing
    - Pooling fixes lifecycle pressure, not transport. Not every environment can open a TCP/TLS socket.

**Explicit boundary with Post 3:** Post 2 is about connection lifecycle pressure. Post 3 is about transport and protocol limitations. Keeping these separate stops the two posts from overlapping.

**Key takeaway:** pooling is the right tool for connection lifecycle pressure and the wrong tool for most of what people expect it to fix.

**What's next:** the transport problem, reaching Postgres where TCP/TLS is not available.

---

# Post 3 - Designing a streaming API for serverless Postgres

_Subtitle: an HTTP/WS access path that keeps Postgres semantics without buffering everything._

**After reading, you'll understand** why request/response HTTP breaks down for a database, and what a streaming-first serverless Postgres API looks like.

1. The problem: no TCP/TLS, but you still need real Postgres semantics
    - Where we left off in Post 2: the transport gap
    - Industry approaches: a bare pg-protocol wrapper vs a bespoke HTTP/WS API, and their tradeoffs
2. Why request/response breaks down (lead with the hook: streaming)
    - The driver is the easy part; the API contract is the hard part
    - Neon's serverless driver as a technical case study: a mechanics-first deep dive into its protocol (neutral, no editorializing)
    - Lessons from operating query engines and managed proxies at scale (Data Proxy, Accelerate): the noisy-neighbor problem, and why buffering forces caps on query duration and body size. Framed as our own hard-won lessons, not as products being broken.
3. Prisma's approach: streaming as a first-class citizen
    - The end-to-end streaming chain: ingress, encode/decode, framing and flow control, database session and sub-message streaming
    - What streaming-first unlocks: no artificial duration or body-size caps, predictable behavior under load
4. The client side (kept, but contained to the API/driver contract)
    - Streaming as first-class but optional on the client: CollectableIterator
    - Free wins from the model: query batching and pipelining vs traditional request/response, and how it blends into the driver API
5. What this unlocks next
    - A driver for every language, with a JDBC sketch. Positioned as a forward-looking close, not a structural pillar.

**Key takeaway:** streaming-first is what lets a serverless HTTP/WS path behave like a real Postgres connection instead of a capped RPC.

**What's next:** two access paths (raw TCP and serverless) still run as separate stacks. That is the revamp.

---

# Post 4 - Unifying TCP and serverless connectivity

_Subtitle: one protocol pipeline, two terminal adapters, and embedded pooling._

**After reading, you'll understand** how we collapsed two parallel connectivity stacks into one streaming pipeline, and why that unlocks better pooling.

**Lead with the conceptual takeaway:** connection lifecycle and protocol handling are separate problems. Everything else in this post follows from that one idea.

1. Before: two stacks that grew apart
    - The raw pg-protocol TCP proxy and the serverless HTTP/WS API evolved on separate timelines and EA/GA phases
    - The cost: duplicated or missing building blocks, inconsistent lifecycle logic, harder pooling
    - Pooling as the forcing function: pgbouncer was a good quick win, but embedding pooling properly needs one centralized protocol handler (clean/busy/dirty connection state, transaction tracking)
2. The problem to solve: a boundary contract between lifecycle and protocol, without giving up the streaming promise
3. After: a unified pipeline (the architecture)
    - Step 1: one cohesive raw pg-protocol library with first-class streaming, replacing a mixed pgproto3 and bespoke utility set
    - Step 2: the core pg-protocol pipeline
    - Step 3: serverless API and TCP terminal adapters on top of the same pipeline
    - Sidebar: fakepg, and why deterministic pre-baked message sequences make protocol bugs testable. A concrete example after the architecture is clear, not a detour before it.
4. The payoff (explicit before/after benefit)
    - Better pooling, easier testing, consistent streaming, less duplication, room for future features
    - Lessons learned about re-architecting under fast-paced evolution (one honest line on tooling; not a structural pillar, since that framing ages badly)
5. What's next
    - Pooling as a two-facet system: protocol sensing plus connection factory
    - The rollout plan: query detection first, then transaction-boundary tracking, then unsupported-statement detection last

**Key takeaway:** separating lifecycle from protocol turned two fragile stacks into one testable, streaming pipeline that pooling can finally sit inside.
