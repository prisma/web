import { openApiSpecResponse } from "@/lib/openapi-spec";

/**
 * Revalidate the cached response daily. Must stay in sync with
 * `SPEC_REVALIDATE_SECONDS` in `@/lib/openapi-spec`; Next.js requires this
 * export to be a literal, so it cannot be imported.
 */
export const revalidate = 86400;

/**
 * Serves the Prisma Postgres Management API OpenAPI spec at
 * https://www.prisma.io/openapi.json, the conventional path scanners, agents,
 * and API tooling probe. The document is proxied from api.prisma.io/v1/doc.
 */
export async function GET() {
  return openApiSpecResponse();
}
