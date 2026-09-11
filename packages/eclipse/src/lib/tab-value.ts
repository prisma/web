/**
 * Tab values end up inside DOM ids: Radix Tabs derives
 * `id="{baseId}-trigger-{value}"` and `aria-controls="{baseId}-content-{value}"`
 * from the value of each tab. A value with whitespace in it (MDX authors write
 * ```ts tab="Relational databases"```) therefore produces an id containing a
 * space, and every IDREF attribute built from it splits into two tokens that
 * reference nothing — axe reports `aria-valid-attr-value`.
 *
 * `escapeTabValue` maps a human label onto a token that is safe to embed in an
 * id: lowercase, every run of whitespace collapsed to a single `-`, everything
 * outside `[a-z0-9_-]` dropped, repeated dashes collapsed.
 *
 * Two properties this function guarantees, both of which the tab components
 * rely on:
 *
 * 1. **Idempotent.** `escapeTabValue(escapeTabValue(x)) === escapeTabValue(x)`,
 *    so it is safe to apply at several layers (a label may pass through
 *    `Tabs` → `TabsTrigger` → the Radix primitive, each of which escapes).
 * 2. **Injective in practice.** Sanitising alone is lossy — "Relational
 *    databases", "relational databases" and "Relational (databases)" all
 *    collapse to `relational-databases`. Whenever sanitising changes the
 *    string, a short hash of the *original* label is appended, so two distinct
 *    labels only collide if they also collide in that hash (1 in ~2^32).
 *    Labels that are already id-safe (`npm`, `pnpm`, `yarn`) are passed through
 *    untouched, which keeps persisted values (`groupId` + `sessionStorage`)
 *    stable for the common package-manager tabs.
 */
const ID_SAFE = /^[a-z0-9_-]+$/;

export function escapeTabValue(value: string): string {
  if (!value || ID_SAFE.test(value)) return value;

  const slug = value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]+/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = hashLabel(value);
  return slug ? `${slug}-${suffix}` : `tab-${suffix}`;
}

/** FNV-1a, base36 — short, stable across server and client renders. */
function hashLabel(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).padStart(7, "0").slice(-7);
}
