# Prisma ORM 8 docs audit

Working documents behind the Prisma ORM 8 docs corrections (prisma/web #8236, #8237, #8238) and the proposed restructure. Written September 2026 against `@prisma/orm-postgres@8.0.0-rc.9`; source paths refer to the prisma/orm monorepo at that tag (`packages/`, `docs/releases/`, `examples/`, `skills/prisma-8/`) and to prisma/create-prisma. Site paths are relative to `apps/docs/content/docs/`.

Read in this order:

1. `personas.md` — who reads the ORM docs: the Newcomer, the Upgrader, the Builder, the Agent.
2. `journeys.md` — ten jobs those readers come to do, with an entry point, a done criterion, the path through today's pages, and a verdict.
3. `mental-model.md` — the standalone explanation of Prisma ORM 8 (contract, emit, signature, plans, migrations and refs) that pages get written from.
4. `ia.md` — the proposed sidebar trees and `/orm` page structure, then the current state and the reasons.
5. `changes.md` — every proposed change by kind: restructure (A), corrections to existing pages (B, shipped), new pages (C), ORM changes (D). Leads with the suggested order.
6. `naming.md` — the "Prisma ORM" naming rule.
7. `slice-corrections.md` — how the shipped corrections were sliced, and the decisions taken.
8. `brief-db-ref-on-adoption.md`, `brief-skills-opt-out.md` — two ORM changes handed to other agents.
9. `audit/` — the page-by-page audit findings that section B and much of C and D were built from. `INSTRUCTIONS.md` and `AREAS.md` describe how the audit was run; the seven area files hold the findings with source citations.

Prose is a draft throughout; the structure and the cited facts are what has been verified.
