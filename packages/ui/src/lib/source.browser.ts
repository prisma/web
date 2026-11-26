import {
  FIRST_SOURCE_PARAM,
  SOURCE_PARAM,
  type SourceTouches,
  isObservedSource,
  mergeSourceTouches,
  sourceFromParams,
} from "./source";

/**
 * First- and last-touch source, kept apart from `prisma_utm_attribution`.
 *
 * That record's validity, its first touch and its 90-day clock are all tied to
 * campaign tags, and any active record changes how Console links are rewritten.
 * A referrer-only visit must not create one, so the source has its own key and
 * its own 90-day clock. It holds two values from the fixed list and two
 * timestamps, never a referrer, so it is stored without consent like the tags.
 */
export const SOURCE_STORAGE_KEY = "prisma_source";
const SOURCE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

interface StoredSource extends SourceTouches {
  firstSeenAt: string;
  lastSeenAt: string;
}

let entryReferrer: string | undefined;

/**
 * The referrer of the document the visitor entered on, read once. Soft
 * navigations keep the same document, so a later read would repeat the entry
 * referrer for a page the visitor reached from inside the site.
 */
export function readEntryReferrer(): string {
  if (entryReferrer === undefined) {
    // A framed page's referrer is the page that embeds it, not a visit.
    entryReferrer =
      typeof document === "undefined" || typeof window === "undefined" || window.top !== window.self
        ? ""
        : document.referrer;
  }
  return entryReferrer;
}

let entryClassified = false;
/** The touches seen in this page session, for when storage is unavailable. */
let sessionSource: SourceTouches | undefined;

/** Forgets the entry referrer and the touches seen in this page session. For tests. */
export function resetSourceEntry() {
  entryReferrer = undefined;
  entryClassified = false;
  sessionSource = undefined;
}

function readStoredRecord(): StoredSource | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(SOURCE_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Partial<StoredSource> | null;
    const firstSeenAt = Date.parse(parsed?.firstSeenAt ?? "");
    const now = Date.now();
    if (
      !parsed ||
      !isObservedSource(parsed.first) ||
      !isObservedSource(parsed.last) ||
      typeof parsed.firstSeenAt !== "string" ||
      typeof parsed.lastSeenAt !== "string" ||
      !Number.isFinite(firstSeenAt) ||
      firstSeenAt > now ||
      now - firstSeenAt >= SOURCE_MAX_AGE_MS
    ) {
      window.localStorage.removeItem(SOURCE_STORAGE_KEY);
      return undefined;
    }
    return {
      first: parsed.first,
      last: parsed.last,
      firstSeenAt: parsed.firstSeenAt,
      lastSeenAt: parsed.lastSeenAt,
    };
  } catch {
    return undefined;
  }
}

/** The stored first and last source, or `undefined` when none is recorded or it expired. */
export function readStoredSource(): SourceTouches | undefined {
  const record = readStoredRecord();
  return record ? { first: record.first, last: record.last } : undefined;
}

/**
 * The entry referrer unless it is this site itself. prisma.io hosts are
 * skipped by the classifier; this also covers previews and local servers.
 */
function externalEntryReferrer() {
  const referrer = readEntryReferrer();
  try {
    return new URL(referrer).origin === window.location.origin ? "" : referrer;
  } catch {
    return referrer;
  }
}

/** Campaign tags, click ids or an upstream source on the current URL. */
function hasCampaignSignal(params: URLSearchParams) {
  return Array.from(params).some(
    ([key, value]) =>
      Boolean(value) &&
      (key.startsWith("utm_") ||
        key === SOURCE_PARAM ||
        ["gclid", "wbraid", "gbraid", "oppref", "msclkid"].includes(key)),
  );
}

/**
 * Classifies this page's touch and records it in `prisma_source`. The entry
 * referrer counts once per document; later calls only add a touch when the URL
 * carries new campaign tags. Returns the stored first and last source.
 */
export function captureSourceTouch(): SourceTouches | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const record = readStoredRecord();
  const stored = record ? { first: record.first, last: record.last } : sessionSource;
  const isEntry = !entryClassified;
  if (!isEntry && !hasCampaignSignal(params)) return stored;
  entryClassified = true;

  const touch = sourceFromParams(params, isEntry ? externalEntryReferrer() : undefined);
  const merged = mergeSourceTouches(stored, touch);
  if (!merged?.first || !merged.last) return stored;
  sessionSource = merged;
  if (record && record.first === merged.first && record.last === merged.last) return merged;

  const now = new Date().toISOString();
  const next: StoredSource = {
    first: merged.first,
    last: merged.last,
    firstSeenAt: record?.firstSeenAt ?? now,
    lastSeenAt: now,
  };
  try {
    window.localStorage.setItem(SOURCE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable; this page session still carries the touch.
  }
  return merged;
}

/**
 * Puts `acq_source` (last touch) and `first_acq_source` (first touch) on a
 * Console link. A visitor with no recorded touch gets neither: `direct` is
 * never sent, so the Console's own classification of the landing stands.
 */
export function syncSourceParams(url: URL, source: SourceTouches | undefined) {
  let updated = false;
  for (const [param, value] of [
    [SOURCE_PARAM, source?.last],
    [FIRST_SOURCE_PARAM, source?.first],
  ] as const) {
    if (isObservedSource(value)) {
      if (url.searchParams.get(param) !== value) {
        url.searchParams.set(param, value);
        updated = true;
      }
    } else if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      updated = true;
    }
  }
  return updated;
}
