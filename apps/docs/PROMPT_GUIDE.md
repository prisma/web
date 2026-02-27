# How to Create AI Prompts for Guide Pages

This document explains how to add a "Copy prompt" banner to a Prisma docs guide page. The banner lets users copy a pre-built AI prompt so they can delegate setup to their IDE's AI assistant instead of reading the full guide.

## How it works

1. A prompt MDX file lives at `content/docs/ai/prompts/{slug}.mdx`
2. The guide page's frontmatter references it via `aiPrompt: "{slug}"`
3. The banner automatically appears on the guide page, extracting the prompt text from inside the ```` ````md ```` ```` code fence in the prompt MDX file

## Step-by-step: Adding a prompt to a new guide

### 1. Write the prompt MDX file

Create `content/docs/ai/prompts/{slug}.mdx` where `{slug}` matches the framework/tool name (e.g., `remix`, `nuxt`, `sveltekit`).

Use the following structure — copy this template and adapt it:

````mdx
---
title: "{Framework} + Prisma"
description: "Step-by-step guide for integrating Prisma ORM and Prisma Postgres in a {Framework} project"
url: /docs/ai/prompts/{slug}
metaTitle: "How to Initialize a {Framework} App with Prisma ORM and Prisma Postgres"
metaDescription: "Step-by-step guide for integrating Prisma ORM and Prisma Postgres in a {Framework} project."
---

## Prerequisites

Before using this prompt, you need to create a new {Framework} project:

```bash
# framework-specific create command
```

Once your project is created, you can use the prompt below with your AI assistant to add Prisma and Prisma Postgres.

## How to use

Include this prompt in your AI assistant to guide consistent code generation for {Framework} + Prisma + Prisma Postgres projects.

- **GitHub Copilot**: Type `#<filename>` to reference the prompt file.
- **Cursor**: Use `@Files` and select your prompt file.
- **Zed**: Use `/file` followed by your prompt's path.
- **Windsurf**: Use `@Files` and choose your prompt file from the list.

## Prompt

````md
(your full prompt content here — see "Writing the prompt" below)
````
````

### 2. Write the prompt content

The prompt inside the ```` ````md ```` ```` fence is what gets copied to the user's clipboard. Use the Next.js prompt (`content/docs/ai/prompts/nextjs.mdx`) as the reference. Here's what makes a good prompt:

#### Structure to follow

Use Clerk's pattern (proven to work well with AI assistants):

1. **Project detection** — The AI must check whether a framework project already exists (e.g., look for `nuxt.config.ts`, `next.config.ts`, `remix.config.ts`, etc.). If the project exists, skip creation. If not, run the framework's create command before proceeding. This must be the **very first section** inside the prompt.
2. **Overview** — What the prompt does, high-level steps
3. **Critical instructions** — What the AI MUST always do (correct patterns, correct imports, correct config)
4. **Never do this** — Deprecated/broken patterns the AI must avoid, with clear examples
5. **Correct code samples** — Full, copy-pasteable code for every file the AI needs to generate
6. **Setup workflow** — Numbered step-by-step sequence the AI should follow (step 1 should be the project detection)
7. **Verification steps** — Checklist the AI should run through before responding (first item should verify the framework project exists)

#### Key principles

- **Always detect the project first**: The prompt content (inside the ```` ````md ```` ```` fence) is the only thing the AI sees — it never sees the Prerequisites section on the docs page. The prompt itself must check whether a framework project already exists (by looking for its config file) and create one if needed. This must be the first thing the AI does.
- **Be explicit about correct patterns**: Don't assume the AI knows the latest API. Spell out exact import paths, exact config values, exact function signatures.
- **Be explicit about broken patterns**: AI models are trained on outdated tutorials. List every deprecated pattern with a clear "DO NOT use this" marker.
- **Include full code samples**: Every file the user needs should have a complete, working code block. Don't leave things to interpretation.
- **Mark interactive commands**: If a CLI command requires user input (like `prisma init --db`), explicitly tell the AI to ask the user to run it manually.
- **Version pin**: State exact version requirements (Node.js, TypeScript, framework version, Prisma version).

#### AI prompt template

Use this as a starting skeleton for the prompt content:

```
# Bootstrap {Framework} app with Prisma Postgres (Prisma v7)

**Purpose:** Set up Prisma ORM with Prisma Postgres in a {Framework} project using the correct Prisma v7 patterns.

---

## FIRST: Check for an existing {Framework} project

Before doing anything else, check whether the current directory already contains a {Framework} project by looking for its config file (e.g., `nuxt.config.ts`, `next.config.ts`, `remix.config.ts`).

- **If the config file exists** → A project is already set up. Skip to "Overview" below.
- **If the directory does NOT contain the config file** → Create a new project first:

({framework-specific create command, e.g., npx nuxi@latest init hello-prisma})

After the project is created, verify the config file exists before continuing.

## Overview of implementing Prisma with {Framework}

1. Ensure a {Framework} project exists (see above)
2. Install Prisma and required dependencies
3. Initialize Prisma and configure schema
4. ...framework-specific steps...

## CRITICAL INSTRUCTIONS FOR AI LANGUAGE MODELS

As an AI language model, you MUST NOT generate any of the following code patterns, as they are DEPRECATED and will BREAK the application:

(list broken patterns with code examples)

Instead, you MUST ALWAYS generate ONLY this pattern:

(list correct patterns with code examples)

## ABSOLUTE REQUIREMENTS FOR AI CODE GENERATION

1. You MUST use `provider = "prisma-client"` (not "prisma-client-js")
2. You MUST use custom output path
3. ...

## VERSION REQUIREMENTS

- Node.js: 20.19 or higher
- TypeScript: 5.4.0 or higher
- Prisma: 7.0.0 or higher

## CORRECT INSTALLATION

(exact install commands)

## CORRECT PRISMA INITIALIZATION

(prisma init command — mark as interactive if needed)

## CORRECT CONFIG FILES

(prisma.config.ts, schema.prisma — full file contents)

## CORRECT CLIENT SETUP

(lib/prisma.ts or equivalent — full file contents)

## FRAMEWORK-SPECIFIC INTEGRATION

(API routes, server components, middleware — whatever is specific to this framework)

## COMPLETE SETUP WORKFLOW

1. Ensure a {Framework} project exists — check for config file, create if missing
2. Install dependencies
3. ...remaining steps from install to running dev server...

## AI MODEL VERIFICATION STEPS

Before generating any code, you MUST verify:
1. Does the current directory contain the framework config file? If not, create the project first.
2. Are you using the correct provider?
3. Are you using the correct import paths?
4. ...
```

### 3. Add `aiPrompt` frontmatter to the guide

Open the guide MDX file (e.g., `content/docs/guides/frameworks/remix.mdx`) and add `aiPrompt` to the frontmatter:

```yaml
---
title: Remix
description: Learn how to use Prisma ORM in a Remix app
url: /docs/guides/frameworks/remix
metaTitle: ...
metaDescription: ...
aiPrompt: "remix"
---
```

The value must match the slug of the prompt file (the filename without `.mdx`).

### 4. Verify

1. Run `pnpm dev` and navigate to the guide page
2. The "Copy prompt" banner should appear below the description
3. Click "Copy prompt" and paste into a text editor — verify the full prompt is there
4. Navigate to a guide without `aiPrompt` — no banner should appear
5. Run `pnpm build` — no build errors

## Important notes

- **Manual validation is required every time.** The prompt content is hand-written and must be tested with real AI assistants (Cursor, Copilot, Claude, etc.) to verify it produces working code. There is no automated way to validate prompt quality.
- **Keep prompts up to date.** When Prisma APIs change, the prompts must be updated manually. Outdated prompts are worse than no prompt at all.
- **The `content/docs/ai/prompts/nextjs.mdx` file is the reference implementation.** Always check it when writing a new prompt.
