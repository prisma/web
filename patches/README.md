# Dependency patches

## Alchemy 2.0.0-beta.83

`alchemy@2.0.0-beta.83.patch` backports
[Alchemy PR #2257](https://github.com/alchemy-run/alchemy/pull/2257), merged as
[`891c46f23e9403a8d21cce164938d2fac492a8a0`](https://github.com/alchemy-run/alchemy/commit/891c46f23e9403a8d21cce164938d2fac492a8a0).
It raises the deployment, archive, staging and website totals from 256 MiB to
768 MiB and the upload timeout from five to fifteen minutes. Per-file and
entry-count bounds are unchanged.

The package exports TypeScript source under Bun and compiled JavaScript under
Node, so both are patched, together with the archive declaration comments.
`composer/budget.test.ts` checks the provider actually selected by each runtime.
The patch is applied by pnpm during a frozen-lockfile install.

The npm release used by Composer predates the change. The upstream PR's package
preview expires on 21 October 2026; this repository therefore carries the small
reviewable patch instead of depending on that expiring download. Remove the
patch and its `patchedDependencies` entry together after validating a compatible
Alchemy release that includes #2257.
