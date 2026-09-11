# Prisma ORM 8 docs audit

Working documents behind the Prisma ORM 8 docs corrections (prisma/web #8236, #8237, #8238) and the proposed restructure. Written September 2026 against `@prisma/orm-postgres@8.0.0-rc.9`; source paths refer to the prisma/orm monorepo at that tag (`packages/`, `docs/releases/`, `examples/`, `skills/prisma-8/`) and to prisma/create-prisma. Site paths are relative to `apps/docs/content/docs/`.

Citations in `audit/` use the worktree layout the audit was run in: `wip/prisma-src/` is prisma/orm (formerly prisma/prisma; the old name still redirects) at `v8.0.0-rc.9`, `wip/create-prisma-src/` is prisma/create-prisma, and `wip/docs-audit/` is this directory. Strip the prefix to get the path in the named repository.

Read in this order:

1. `personas.md` — who reads the ORM docs: the Newcomer, the Upgrader, the Builder, the Agent.
2. `journeys.md` — ten jobs those readers come to do, with an entry point, a done criterion, the path through today's pages, and a verdict.
3. `mental-model.md` — the standalone explanation of Prisma ORM 8 (contract, emit, signature, plans, migrations and refs) that pages get written from.
4. `ia.md` — the proposed sidebar trees and `/orm` page structure, then the current state and the reasons.
5. `changes.md` — every proposed change by kind: restructure (A), corrections to existing pages (B; #8236 and #8237 are merged, #8238 is open as of 2026-09-11), new pages (C), ORM changes (D). Leads with the suggested order.
6. `naming.md` — the "Prisma ORM" naming rule.
7. `slice-corrections.md` — how the section B corrections were sliced, and the decisions taken.
8. `brief-db-ref-on-adoption.md`, `brief-skills-opt-out.md`, `brief-skill-staleness.md` — three ORM-side changes handed to other agents (adoption sets the `db` ref; a skills opt-out in create-prisma; bringing the `prisma-8` agent skill up to rc.9).
9. `audit/` — the page-by-page audit findings that section B and much of C and D were built from. `INSTRUCTIONS.md` and `AREAS.md` describe how the audit was run; the seven area files hold the findings with source citations. The audit is a snapshot of the site on 2026-09-10; the guides pages it flags as Prisma 7 content were rewritten for Prisma ORM 8 in #8242 on 2026-09-11.

Prose is a draft throughout; the structure and the cited facts are what has been verified.
