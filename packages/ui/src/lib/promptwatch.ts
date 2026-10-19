/**
 * Promptwatch visitor analytics. Cookieless: no cookies, no local/session
 * storage, no personal data. Official docs say no consent banner is required;
 * the script is loaded ungated on site, blog, and docs (product decision).
 *
 * The browser client reads `data-project-id` from `document.currentScript`
 * when it first runs, so callers render a native `<script async>` tag:
 * `currentScript` is set for async classic scripts, and async keeps the
 * request off the render path (the file is served with `max-age=0`).
 */
export const PROMPTWATCH_SCRIPT_SRC = "https://ingest.promptwatch.com/js/client.min.js";

/** Prisma's Promptwatch project. Public, like the GTM container id. */
export const PROMPTWATCH_PROJECT_ID = "25f18e15-6306-4faa-b5c2-8078804778ac";
