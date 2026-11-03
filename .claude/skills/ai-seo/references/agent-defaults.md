# Agent Defaults: When the Agent Picks the Vendor

A growing share of buying decisions happens inside a task. A developer tells Claude Code "deploy this," "add auth," or "send a welcome email," and the agent chooses a vendor, installs it, and moves on. There is no search results page and no shortlist for the user to compare. Whatever the agent reaches for first wins.

This applies most to developer tools, APIs, infrastructure, and SaaS with a CLI or SDK. It is spreading to anything a computer-use agent can sign up for. The rest of this skill covers being cited and recommended in answers; this reference covers being **the default an agent acts on**.

**Case: Railway (October 2026).** Founder Jake Cooper said on a podcast that the company grew from about $20M to about $100M ARR in a year with a go-to-market team of about seven, and named getting the models to "recommend us more and more" as a go-to-market goal. Practitioner breakdowns of their site counted thousands of self-hosting template pages, a deploy guide per framework, comparison and migration pages for each major competitor, an `llms.txt` with a summary per docs page, plugins inside ChatGPT and Claude Code, and `ssh railway new` to get a server with no signup. The same breakdowns claimed Claude Code picks Railway for most Python apps and Vercel for every Next.js app tested. Those counts and percentages are third-party and unverified; the pattern is the point.

## Measure your share of agent defaults

You can't improve a default you haven't measured, and nobody reports this number for you.

1. **Build a task panel.** 20–50 realistic tasks spread across the stacks your buyers use (a FastAPI service, a Next.js app, a Rails app, a cron worker, a static site). Write each the way a user would: "deploy this," "add a Postgres database," not "deploy this to [you]."
2. **Run each task in a clean environment** on every agent your buyers use (Claude Code, Cursor, Codex, plus ChatGPT or Claude chat for the "how do I" version). No project rules, memory, or MCP servers that name a vendor.
3. **Run each task 3+ times.** Agent choices vary run to run, and one sample is noise.
4. **Record per run:** the vendor chosen, whether the agent got to a working result, where it stalled (signup, email verification, payment, a failing CLI step), and which docs or URLs it fetched.
5. **Report share by stack.** The gap is usually one stack ("we win Python, lose everything front-end"). That stack is where content and tooling work goes.
6. **Rerun on every major model release.** Defaults can move overnight when a model changes, and new models tend to bring more code to deploy. Run it monthly between releases; the agent-default check loop in **marketing-loops** schedules it.

Where the agent stalled tells you more than which vendor it picked. A run that chose you and then died at email verification is a loss you can fix.

## What moves the default

| Lever | Why agents respond to it | Railway's version |
|---|---|---|
| **Shortest path to a working result** | Agents favor the route with the fewest human-gated steps: account creation, email verification, CAPTCHA, a credit card before first use | `ssh railway new` provisions a server before any signup; the account is claimed later |
| **Agent setup in one step** | An agent that has your MCP server, CLI, or skill installed uses it instead of guessing | A docs section for agents with one command that installs what Claude Code or Cursor needs |
| **Presence inside the assistants** | If the assistant has a native connector or plugin, deploying never leaves the chat | Plugins in ChatGPT and Claude Code |
| **Task-shaped pages per stack** | Agents fetch docs mid-task; a page that matches the exact task ("deploy Django") and ends in a working result gets followed | A guide per framework, each ending with the app live |
| **Template pages per popular tool** | Self-hosting and setup queries ("how do I run n8n") are a long tail that programmatic pages cover, see **programmatic-seo** | Thousands of one-click template pages |
| **Migration guides per competitor** | An agent moving a project follows steps; see **competitors** for the comparison side | A comparison page with a migration guide for each major competitor |
| **Docs agents can read** | An `llms.txt` index with one-line summaries, plus a markdown version of every page, lets the agent find the right page and quote it correctly (the Discovery checks in [agent-readiness.md](agent-readiness.md)) | An index of every docs page with a summary each, and a plain-text version of each page |
| **Fresh, dated changes** | Recently updated docs and changelogs keep answers current for search and models | A changelog page every week since 2021 |
| **CLI output an agent can recover from** | Non-interactive flags, JSON output, and errors that say what to run next keep the run alive past a failure | (General practice, not from the Railway breakdowns) |

Fix the stall points from your measurement first. Content won't help if the agent picks you and then can't finish.

## Audit your docs for coding agents

Treat a coding agent as its own answer engine. In Profound's sample of 24,135 responses with web search enabled, Claude searched the web in 93% of responses and Claude Code in 13%, and the brands each one mentioned overlapped only about 20% (Profound, August 2026; observational). When Claude Code did fetch pages, nearly three-quarters of visits went to documentation, informational, and pricing pages. So your chat-assistant visibility tells you little about your coding-agent visibility, and the pages agents read are docs and pricing.

Profound sells AI visibility tracking; treat these as vendor research and run your own panel (above) before acting on them.

**1. Map tasks to pages.** List what users ask a coding agent to do with your product: install, authenticate, integrate, migrate, debug, compare, estimate cost, check compatibility. Give each task one canonical page and list the facts that page must state.

| Task | Canonical page | Facts it must state | Gap |
|---|---|---|---|
| Install in a Next.js app | /docs/nextjs | Package name, minimum version, env vars, one working example | Example uses a deprecated import |
| Estimate cost | /pricing | Pricing unit, free tier limits, overage rate | Overage only in a PDF |

**2. Check retrieval.** For each canonical page:

- The title and headings name the task and the stack
- The answer or command comes before background
- Prerequisites, versions, and dates are explicit
- Examples are copyable and current
- Anchors and URLs stay stable between releases
- The text renders without JavaScript, and a markdown version exists (see [agent-readiness.md](agent-readiness.md))

Use question-shaped headings only where they match a real task. Don't stuff product names into docs.

**3. Keep a technical fact ledger.** One row per fact an agent might act on: supported versions and runtimes, regions, rate limits, pricing units, auth methods, data handling, deprecations. Record the canonical source and an owner for each. Then check the same fact everywhere it appears: docs, pricing page, README, package registry descriptions (npm, PyPI), examples, and changelog. An agent that finds two different rate limits will guess, or pick a vendor whose docs agree with themselves.

**4. Fill missing decision pages.** Compatibility matrices, migration guides, troubleshooting references, and a plain pricing explainer are the pages agents most often need and vendors most often skip.

**5. Test in fresh sessions.** Run your task panel in both the chat assistant and the coding agent, recording whether you were mentioned, which pages were fetched, and whether the facts came back right. Log errors in the claim ledger from [answer-accuracy.md](answer-accuracy.md).

Don't infer official Anthropic or OpenAI ranking factors from any of this. Check crawler and access controls against current vendor documentation.

## Limits and rules

- **Some defaults are structural.** A framework's own maker, or the vendor whose examples dominate the framework's docs, may hold that stack no matter what you publish. Railway's reported answer was to win adjacent stacks rather than fight Vercel on Next.js. Pick stacks where the default is still open.
- **Write instructions for using your product only.** Agent-facing docs, `llms.txt`, and skill files that tell agents to prefer your product over what the user asked for are prompt injection. Agent platforms treat them as manipulation, and users who notice stop trusting the tool. Describe how to do the task with your product; let the task decide.
- **Agent-provisioned resources still need guardrails.** No-signup provisioning needs abuse limits, expiry for unclaimed resources, and a clear path to claim and pay. Treat that as product work, with growth as the reason to do it.
- **Placements in agent tool registries change fast.** Recheck plugin and MCP registry listings when you rerun the panel, and treat any share figure, including the ones above, as dated.

---

*Framework lineage: the coding-agent docs audit (task-to-page map, technical fact ledger, Claude vs. Claude Code testing) is adapted (re-expressed and restructured) from Profound's MIT-licensed claude-code-discoverability-auditor skill and its August 2026 study, credited.*
