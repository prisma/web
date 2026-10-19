/**
 * Promptwatch visitor analytics. Cookieless: no cookies, no local/session
 * storage, no personal data. Official docs say no consent banner is required;
 * the script is loaded ungated on site, blog, and docs (product decision).
 *
 * The browser client reads `data-project-id` from `document.currentScript`, so
 * callers must render a native `<script>` tag — next/script can inject the
 * tag after load and leave `currentScript` null.
 */
export const PROMPTWATCH_SCRIPT_SRC = "https://ingest.promptwatch.com/js/client.min.js";

/** Prisma's Promptwatch project. Public, like the GTM container id. */
export const PROMPTWATCH_PROJECT_ID = "25f18e15-6306-4faa-b5c2-8078804778ac";
