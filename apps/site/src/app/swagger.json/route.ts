import { openApiSpecResponse } from "@/lib/openapi-spec";

/**
 * Revalidate the cached response daily. Must stay in sync with
 * `SPEC_REVALIDATE_SECONDS` in `@/lib/openapi-spec`; Next.js requires this
 * export to be a literal, so it cannot be imported.
 */
export const revalidate = 86400;

/**
 * Alias of /openapi.json at the legacy `/swagger.json` filename, which many
 * scanners and API tools still probe. Serves the identical OpenAPI document.
 */
export async function GET() {
  return openApiSpecResponse();
}
