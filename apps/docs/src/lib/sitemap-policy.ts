// Source pages retained as compatibility stubs; public redirects win before
// rendering them. Their destination pages already have their own entries.
export const redirectedDocsPages = new Set([
  "/docs/cli/dev",
  "/docs/guides/deployment/vercel",
  "/docs/orm/reference",
  "/docs/postgres/iac/alchemy",
  "/docs/prisma-orm",
]);
