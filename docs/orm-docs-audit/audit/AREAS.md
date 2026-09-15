# Audit areas and page lists

Site paths are relative to `apps/docs/content/docs/`.

## orm-client
orm/index.mdx, orm/core-concepts.mdx, orm/fundamentals/{reading-data,writing-data,relations-and-joins,advanced-queries,transactions}.mdx, orm/reference/{index,orm-client,transactions-and-runtime,error-reference}.mdx

## builders
orm/reference/{sql-query-builder,pipeline-builder,raw-queries}.mdx, orm/extensions/using-extensions.mdx, orm/middleware/{how-middleware-works,authoring-custom-middleware,built-in-lints,built-in-budgets,built-in-cache}.mdx

## contract
orm/contract-authoring/{the-data-contract,the-contract-artifact,psl-syntax,typescript-schema-builder,capabilities}.mdx, orm/data-modeling/{index,relational-databases,mongodb}.mdx, cli/{contract-emit,contract-infer}.mdx

## migrations-cli
orm/migrations/*.mdx (6), cli/{index,global-flags,configuration,error-reference,init,orm-init,skills,dev,git}.mdx, cli/db-{init,update,migrate,sign,verify,schema}.mdx, cli/migration-{new,plan,ref,show,status}.mdx. Platform commands (auth, branch, bucket, deploy, feedback, postgres, project, service, telemetry) out of scope.

## start-guides
(index)/{index,getting-started}.mdx, (index)/prisma-orm/{index,create-prisma}.mdx, (index)/prisma-orm/quickstart/{postgresql,mongodb}.mdx, (index)/prisma-orm/add-to-existing-project/{postgresql,mongodb}.mdx, (index)/prisma-postgres/quickstart/prisma-orm.mdx, guides/index.mdx, guides/upgrade-prisma-orm/{postgresql,mongodb}.mdx, guides/switch-to-prisma-orm/*.mdx (3), guides/database/*.mdx (3)

## gaps
Part 1: guides/frameworks/*.mdx (10), guides/deployment/*.mdx (6), guides/runtimes/*.mdx (2), guides/integrations/{github-actions,vercel-deployment,ai-sdk}.mdx. Part 2: reverse audit of skills/prisma-8/ and docs/glossary.md and the public export maps against the whole ORM 8 site.

## extras
(index)/full-stack-tutorial.mdx, ai/tools/skills.mdx, cli/telemetry.mdx, plus the targeted gap questions from the first session's gaps brief (RLS, expression indexes, Postgres extensions, JSON filtering, Decimal, SQLite, Vite plugin, @@control, soft delete, read replicas, await using, streaming, native provider, docs/reference/*, extension packages).
