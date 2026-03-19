# Page Types

## Quickstart / task page

### When to use it

Use for a single task with a clear happy path, such as connecting Prisma ORM, creating a database, or adding an integration.

### Required sections

- Outcome-first intro
- Prerequisites, only if they block the task
- Numbered happy-path steps
- Verify
- Next steps

### Optional sections

- One short caveat section
- One short troubleshooting section for the most likely failure

### What not to include

- Deep concept background
- Large option matrices
- Multiple equivalent implementations unless selection rules are explicit

### Example outline

- `## Prerequisites`
- `## 1. Install dependencies`
- `## 2. Configure Prisma`
- `## 3. Run the first command`
- `## Verify`
- `## Next steps`

## Decision page

### When to use it

Use when readers need to choose between two or more viable approaches.

### Required sections

- Intro that opens with the recommendation or tradeoff
- Compact decision matrix
- One section per option
- Explicit selection rules

### Optional sections

- Migration path from one option to another
- Limits or cost notes

### What not to include

- Step-by-step setup for every option
- Vague advice like "it depends" without concrete criteria

### Example outline

- `## Quick recommendation`
- `## Decision matrix`
- `## Use pooled connections when...`
- `## Use direct connections when...`
- `## Common mistakes`

## Client integration page

### When to use it

Use for tool-specific setup such as Raycast, Cursor, GitHub Copilot, or framework-specific client wiring.

### Required sections

- Intro that states when this client is the right fit
- Link to the canonical shared setup page
- Client-specific setup only
- One minimal query or command example
- Client-specific pitfalls

### Optional sections

- Verify
- One short limitations section

### What not to include

- Repeated connection theory
- Generic product overview
- Several client variants on one page

### Example outline

- `## When to use this client`
- `## Before you start`
- `## 1. Add the client-specific configuration`
- `## 2. Run a minimal query`
- `## Common pitfalls`
- `## Verify`

## Concept / deep-dive page

### When to use it

Use when the primary job is to understand behavior, constraints, or tradeoffs.

### Required sections

- Intro with the main rule or mental model
- Concrete explanation sections
- Constraints and caveats
- Real examples

### Optional sections

- Comparison table
- Related task pages

### What not to include

- Full setup walkthroughs already covered elsewhere
- Long procedural sections without a strong conceptual reason

### Example outline

- `## Core idea`
- `## How it works`
- `## Constraints`
- `## Example`
- `## Related tasks`

## Migrate / import / export page

### When to use it

Use for moving data or schema between systems, including provider migrations and import or export flows.

### Required sections

- Intro that leads with method selection
- Selection criteria based on size, downtime tolerance, and complexity
- Procedure
- Cutover
- Validation
- Rollback or fallback guidance when relevant

### Optional sections

- Compatibility notes
- Known caveats

### What not to include

- Tool history or background
- A single linear procedure when there are materially different migration paths

### Example outline

- `## Choose a migration method`
- `## Prerequisites`
- `## 1. Export from the source`
- `## 2. Import into Prisma Postgres`
- `## 3. Cut over application traffic`
- `## Validate`
- `## Roll back if needed`

## Operate / manage page

### When to use it

Use for ongoing operation of a feature, database, setting, or control plane capability.

### Required sections

- Intro that states what the feature controls
- Default behavior
- How to inspect current state
- How to change it
- Tradeoffs, limits, and cost or performance implications

### Optional sections

- Recommended defaults
- Verify

### What not to include

- General product onboarding
- Troubleshooting sections that deserve their own page

### Example outline

- `## Default behavior`
- `## Inspect current settings`
- `## Change the setting`
- `## Tradeoffs and limits`
- `## Verify`

## Troubleshooting page

### When to use it

Use when the page exists to resolve concrete failures or symptoms.

### Required sections

- Titles and headings that use the exact symptom or error string
- Symptom
- Cause
- Fix
- Verify

### Optional sections

- Related symptoms that share the same root cause
- Escalation path

### What not to include

- Broad conceptual content
- Long historical explanations
- Advice that requires readers to infer which fix applies

### Example outline

- `## \`prepared statement "s0" already exists\``
- `### Cause`
- `### Fix`
- `### Verify`

## Reference page

### When to use it

Use for exact facts, flags, defaults, limits, schemas, and endpoint details.

### Required sections

- Terse intro
- Tables, definitions, limits, defaults, or examples
- Scannable heading structure

### Optional sections

- One minimal example
- Related references

### What not to include

- Long narrative paragraphs
- Hidden key facts
- Full tutorials

### Example outline

- `## Flags`
- `## Options`
- `## Examples`
- `## Related commands`
