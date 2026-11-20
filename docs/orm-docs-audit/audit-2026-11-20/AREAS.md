# Audit areas and page lists, 2026-11-20

Site paths are relative to `apps/docs/content/docs/`.

## orm-client
orm/index.mdx, orm/core-concepts.mdx, orm/coming-from-prisma-orm-7.mdx, orm/fundamentals/*.mdx (6), orm/reference/{index,orm-client,transactions-and-runtime}.mdx, orm/{release-status,supported-databases,supported-versions}.mdx

## builders
orm/reference/{sql-query-builder,pipeline-builder,raw-queries}.mdx, orm/extensions/*.mdx (5), orm/middleware/*.mdx (5)

## contract
orm/contract-authoring/*.mdx (7), orm/data-modeling/*.mdx (4), cli/{contract-emit,contract-infer,contract-print}.mdx

## migrations
orm/migrations/*.mdx (6), orm/reference/migration-api.mdx, cli/db-{init,update,migrate,sign,verify,schema}.mdx, cli/migration-{new,plan,ref,show,status}.mdx, guides/database/{data-migration,schema-changes}.mdx

## cli
cli/{index,global-flags,configuration,environment-variables,init,orm-init,skills,dev,emulator,git,telemetry,feedback}.mdx, ai/tools/skills.mdx, and the two generated error references cli/error-reference.mdx and orm/reference/error-reference.mdx (compare each with the codes the tagged sources define; report codes missing, extra, or with a different message). Platform commands (auth, branch, bucket, deploy, postgres, project, service) are out of scope.

## start
(index)/{index,getting-started,full-stack-tutorial}.mdx, (index)/prisma-orm/**/*.mdx (9), (index)/prisma-postgres/quickstart/prisma-orm.mdx, (index)/prisma-postgres/from-the-cli.mdx, guides/index.mdx. Compare every scaffold claim with create-prisma 0.14.8 and `prisma orm init`.

## upgrade-switch
guides/upgrade-prisma-orm/{index,postgresql,postgresql-incremental,mongodb}.mdx, guides/switch-to-prisma-orm/*.mdx (3), guides/database/multiple-databases.mdx. Compare the upgrade guides with `upgrade-instructions/` and the release notes.

## frameworks
guides/frameworks/*.mdx (11), guides/runtimes/*.mdx (2)

## deploy-integrations
guides/deployment/*.mdx (6), guides/integrations/*.mdx (11), guides/authentication/**/*.mdx (5), guides/postgres/*.mdx (6), guides/compute/*.mdx (2), guides/switch-to-prisma-postgres/*.mdx (2). Many of these may not be Prisma ORM 8 pages: audit the ones that are, and for each of the others say in one line which Prisma version it documents and whether the page says so.

## reverse
No page list. Read `skills/prisma-8/` (SKILL.md and every reference), `docs/glossary.md`, the export maps of every package under `packages/9-public/@prisma/`, and the release notes from rc.10 to rc.24. For each feature, export, command, flag, config key and behaviour change you find, search the whole Prisma ORM 8 site for it. Report what the site never mentions under "Missing", and what the site states differently under "Misleading". Include the packages that have no page at all (for example other database targets and extension packs).
