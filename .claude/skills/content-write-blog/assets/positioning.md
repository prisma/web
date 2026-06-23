# Prisma Positioning

---

> **Prisma is the integrated TypeScript infrastructure for agentic software development.**
>
> ORM, Postgres, and Compute designed to work together as one platform, so your coding agent can build, deploy, and iterate end-to-end without stitching vendors together. We don't compete head-to-head in any single category — we compete on the integration across all three.

_This is the shared source of truth for how we talk about Prisma — the category we own, who we're for, the problem we solve, and how we're different. Use it to keep messaging consistent across the site, sales, docs, and DevRel._

---

## 1. The strategic frame

Three things define the positioning:

- **Category:** Integrated TypeScript infrastructure for agentic software development — ORM + managed Postgres + app hosting, designed to work together as one platform.
- **Differentiator:** Not best-in-class at any single layer. The value is the thin integrated slice across all three layers — the one platform where ORM, database, and hosting actually work together natively, qualified by TypeScript (competitors are language-agnostic and can't claim it).
- **Credibility anchor:** The ORM's track record — 28% market share, 500K+ monthly active developers, 45K+ GitHub stars — is the reason to believe in the platform, not a ceiling on it.

**This is an Evolution, not a revolution.**

The audience, the developer-first philosophy, and the ORM foundation haven't changed. What changes is the frame: away from "Postgres, perfectly managed" (a single-product story indistinguishable from Neon or Supabase) and toward the only integrated TypeScript infrastructure built for how developers actually build now.

## 2. Who we help

Primary audience today: developer-led startup and SMB teams building on TypeScript with AI coding agents (Claude Code, Cursor, Codex, Windsurf). Decision-makers are individual developers, founding engineers, and fullstack/backend developers, with engineering leads and CTOs as secondary. We are not targeting enterprise procurement or non-TypeScript teams.

_Tomorrow: less technical "product builders" who want to build real software without deep infrastructure knowledge._

### The five personas

| Persona                                            | What they care about / why Prisma                                                                                                                                                                                                                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Individual developer / founding engineer**       | Ships product fast, increasingly directing an agent to do the building. Chooses Prisma because the agent handles the full loop — init, schema, deploy, debug, iterate — without coordinating three vendors.                                                                     |
| **Technical co-founder / engineering lead**        | Wants the team to move fast without accruing tech debt. Cares about standardizing on one platform where ORM, DB, and hosting share context and stay aligned across environments.                                                                                                |
| **CTO / VP Engineering**                           | Makes platform-level decisions and must justify them as the company grows. Values consolidation on a TypeScript-native stack, compliance headroom, and predictable costs — especially as the market consolidates (PlanetScale acquiring Drizzle) away from Postgres/TypeScript. |
| **CEO / Founder (financial buyer)**                | Keeps infra spend predictable; wants one line item, not three. ~$70–90/mo vs $385–450 for a comparable Neon + Vercel stack at ~50K MAU is the concrete story.                                                                                                                   |
| **Senior engineer / security-conscious developer** | Influences tooling on reliability, security, maintainability. Needs the technical story — unikernel microVMs, no cold starts, GDPR/HIPAA/SOC2 at higher tiers — before advocating internally.                                                                                   |

## 3. The problem we solve

The backend is the unsolved part of agentic development. The front end is solved; the backend is still a hodgepodge of duct-taped vendors. The agent can write the code, but it can't deploy, manage infrastructure, or iterate across the full stack without the developer manually coordinating between tools.

- **Fragmented by default:** Developers (or their agents) assemble a database, an ORM, and a hosting platform from separate vendors — none designed to work together. Agents default to Neon + Drizzle via Vercel templates, setting the stack before alternatives are evaluated.
- **Setup time before product time:** Getting a database running still means Docker, config files, and connection-string management before a line of product code.
- **Runtime errors that should never ship:** Loosely-typed ORMs and scattered schema mean type mismatches surface at runtime. Agents can't reliably reason about a fragmented schema — and Drizzle compile performance degrades exponentially on complex models (~41K type instantiations vs Prisma's ~428).
- **The ORM brand ceiling:** Prisma is the most trusted name in the TypeScript DB ecosystem, but that trust hasn't carried to the database and hosting products. Developers think "Prisma = ORM," not integrated infrastructure.
- **Fragmentation compounds quietly:** Multiple vendors mean multiple bills, multiple failure points, and a growing surface area of things that can break — slowing teams in ways hard to attribute to any single cause. Infrastructure has high switching costs, so painful early choices compound.

## 4. Our solution

- **Integrated TypeScript infrastructure:** A type-safe ORM, managed Postgres, and app hosting in one platform, designed to work together natively — one declarative schema all three products consume, one `prisma.config.ts` where ORM and Compute are declared together. No glue code, no separate vendor relationships.
- **The agent interface is the platform:** A structured CLI (`--json` modes everywhere) and a Management API with full CLI parity give agents a predictable, parseable surface to drive the full stack — init, schema, deploy, read logs, fix, redeploy — without the developer in the middle of every step.
- **App and database on the same host:** Compute runs co-located with Prisma Postgres in the same region — single-digit ms query latency, long-running workloads (WebSockets, background jobs, cron, agents) supported natively.
- **Predictable pricing that scales:** Operation-based pricing with spend caps across the platform. ~$70–90/mo vs $385–450 for a comparable Neon + Vercel stack at ~50K MAU. One bill instead of three.

## 5. The homepage hero ("X for Y")

> ### Integrated TypeScript infrastructure for developers building with AI agents
>
> Build, deploy, and iterate end-to-end in one conversation _with_ ORM, Postgres, and Compute designed to work together natively.

**Structure:** [Product category] for [Persona] — [The big unlock] with [Key feature]. Category = integrated TypeScript infrastructure for agentic software development; Persona = TypeScript developers building with AI coding agents; Unlock = build, deploy, and iterate end-to-end in one conversation; Feature = ORM + Postgres + Compute designed to work together natively.

## 6. What makes Prisma different

- **The only integrated TypeScript stack:** ORM, database, and hosting designed to work together natively — not three products that share a brand. Competitors are either single-layer (Neon, Drizzle) or language-agnostic (Supabase, Vercel).
- **Integration is the differentiator, not the individual layers:** We're not trying to win ORM, database, or hosting individually. The value is the thin integrated slice across all three.
- **The only managed Postgres with no cold starts:** Unikernel microVMs on bare metal — a genuinely unique infrastructure claim.
- **Agent-ready by design, not by retrofit:** CLI and Management API built from the ground up for agents — structured output, predictable command shapes, informative exit codes. Not a plugin on a human-facing tool.
- **Unmatched ecosystem trust:** 28% ORM market share, 500K+ MADs, 45K+ stars. The commercial platform earns authority from the ORM's track record.
- **Compile performance that compounds:** ~428 type instantiations on complex schemas vs Drizzle's ~41K — a material difference in how reliably agents can reason about the codebase at scale.

### Who we don't serve (anti-positioning)

We explicitly don't target teams who want a bundled backend with auth, storage, and realtime out of the box (→ Supabase), or who aren't building with AI coding agents. Naming this anti-persona protects the positioning from dilution and gives us permission to be opinionated about the TypeScript and agent-first bets.

## 7. Competitive landscape

We aren't competing head-to-head in any single category. The competition is the stitched-together stack.

| Alternative                 | Role                         | Where it falls short                                                                                                                                                       |
| --------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vercel + Neon + Drizzle** | The agent-era default        | Three vendors, three billing relationships, no native integration between layers. No per-branch DBs integrated with hosting previews. No default hard spend cap on Vercel. |
| **Supabase**                | The all-in-one backend       | Bundles auth + DB + storage, but app hosting is rough (many frameworks unsupported). Pro→Team cliff ($25 → $599 for SOC2), branches ~$10/mo each.                          |
| **PlanetScale + Drizzle**   | Emerging (acquired Mar 2026) | Forming a comparable DB + ORM platform threat — but MySQL not Postgres, no hosting, code-based not declarative schema.                                                     |

Secondary: AWS / GCP / Azure, self-hosted Postgres on Railway or Render, Heroku Postgres (legacy) — more setup and management than our market wants. Indirect: AI app builders (Lovable, Bolt, v0) that provision Supabase under the hood (great prototypes, break down for production), plus "good enough" — teams who feel the friction but work around it. High switching costs keep teams on painful stacks longer than they should.

## 8. Why developers switch (JTBD four forces)

### PUSH — driving them away from today's setup

- The agent writes great code but can't deploy or iterate full-stack without you coordinating vendors
- Front end is solved; the backend is a hodgepodge of duct-taped tools
- Three vendors = three configs, three bills, integration friction on every change
- Per-branch databases aren't integrated with hosting previews
- Agents default to Neon + Drizzle via Vercel templates
- Surprise bills from Vercel bandwidth or Supabase pricing cliffs
- High switching costs mean painful early choices compound

### PULL — attracting them to Prisma

- One integrated TypeScript stack — agent can build, deploy, read logs, fix, redeploy end-to-end
- Deploy your app and it comes with a database by default
- One declarative schema all three products consume natively
- Per-branch databases integrated with hosting previews out of the box
- CLI + Management API designed for agents to drive — structured, parseable output
- Operation-based pricing with spend caps (no bill shock)
- No cold starts on Postgres (unikernel microVMs)

### HABIT — keeping them stuck

- "My current stack ships product, even if it's painful — there's always something more urgent than a migration"
- Agents default to Neon + Drizzle templates, setting expectations early
- Supabase bundles auth + DB + storage in one click
- Prisma is still "the ORM" in most developers' minds
- Skepticism about agentic workflows generally

### ANXIETY — worrying them about switching

- "What if my agent does something stupid?" — addressed by the structured CLI / Management API design
- Compute is in public beta — CTOs won't bet production hosting on it yet
- "Built to work together" can read as lock-in (answer: standard Postgres, the schema is yours)
- No quantified bundle-savings story yet (Compute pricing not public)
- Operation-based pricing uncertainty for heavy-read / N+1 workloads

## 9. Key features

The platform's headline capabilities, with the ORM, Prisma Postgres, and Compute leading the messaging.

| Feature                  | What it is                                                                                                                                                                                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Prisma Next/ORM**      | The most trusted type-safe TypeScript ORM, with a next-gen rewrite for agentic workflows. Schema-as-LLM-context as a first-class concern (small, dense, machine-readable), errors structured for agent consumption, strongest compile performance at scale. Deliberately narrower than Prisma 7; becomes Prisma 8 at GA. |
| **Prisma Postgres**      | Fully managed Postgres. Operation-based pricing with spend caps. Free branching. Co-located with Compute. Agentic feedback loops.                                                                                                                                                                                        |
| **Prisma Compute**       | TypeScript app hosting (Bun on bare metal, near-zero cold starts) built natively alongside Prisma Postgres. Long-running workloads, cron as a first-class `prisma.config.ts` concept, versioned deployments with preview URLs. Public beta — pricing not yet public.                                                     |
| **CLI + Management API** | The agent interface for the full platform. Structured, parseable output, `-json` modes everywhere, full CLI/API parity — anything the CLI can do, an agent can call via the API.                                                                                                                                         |
| **Prisma Studio**        | Visual data browser and editor built into the Console. Real-time collaboration, zero setup, embeddable. See what your agent built without writing SQL.                                                                                                                                                                   |

## 10. Product benefits

Benefits articulated across three levels, with integration as the through-line — not any individual product.

### For the individual developer & team

- Your agent handles the full loop — build, deploy, read logs, fix, redeploy — without you coordinating between vendors.
- Stop context-switching between a DB provider, an ORM, a hosting platform, and a data browser to ship one feature.
- Type-safety, structured errors, and a schema that works the same way across every layer — fewer bugs reach production.

### For the company

- One platform instead of three vendors: one schema, one config file, one bill. Integration overhead disappears.
- Ship faster with less operational overhead — no cross-vendor debugging or migration mismatches.
- Predictable, defensible costs (operation-based pricing with spend caps) and a natural expansion path from free ORM user to paid infrastructure customer.

### For the industry

- End the fragmentation era of TypeScript backend development — ORM, database, and hosting no longer sourced and stitched separately.
- Lower the floor for building production-grade software with AI agents (and eventually non-developers).
- Set the standard for agent-era developer infrastructure: one platform where agents and developers work from the same primitives natively.
