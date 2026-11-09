/**
 * PostHog experiment variants the visitor saw, carried to the Console on a
 * sign-up link so the signup can be credited to the page version that sent it.
 *
 * A variant is a label such as `control` or `test`, not an identifier, so it is
 * stored without consent, like the UTM params in `utm.ts`.
 */
export const EXPERIMENT_STORAGE_KEY = "prisma_experiment_variants";
/** One `exp_<flag-key>=<variant>` param per experiment on Console links. */
export const EXPERIMENT_PARAM_PREFIX = "exp_";
/** Same window as the stored UTM attribution. */
const EXPERIMENT_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
/** The Console keeps at most five; the most recently seen win. */
const EXPERIMENT_MAX_COUNT = 5;
/** PostHog flag and variant keys: letters, digits, `-` and `_`. */
const EXPERIMENT_KEY_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export type ExperimentVariants = Record<string, string>;
type StoredExperiments = Record<string, { variant: string; seenAt: string }>;

function readStoredExperiments(): StoredExperiments {
  if (typeof window === "undefined") return {};

  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(EXPERIMENT_STORAGE_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const now = Date.now();
    const stored: StoredExperiments = {};
    for (const [flag, entry] of Object.entries(parsed)) {
      const { variant, seenAt } = (entry ?? {}) as Record<string, unknown>;
      const seenAtMs = Date.parse(typeof seenAt === "string" ? seenAt : "");
      if (
        EXPERIMENT_KEY_PATTERN.test(flag) &&
        typeof variant === "string" &&
        EXPERIMENT_KEY_PATTERN.test(variant) &&
        seenAtMs <= now &&
        now - seenAtMs < EXPERIMENT_MAX_AGE_MS
      ) {
        stored[flag] = { variant, seenAt: seenAt as string };
      }
    }
    return stored;
  } catch {
    return {};
  }
}

/**
 * Records the variant from a PostHog `$feature_flag_called` event, which
 * posthog-js sends when page code (or a no-code experiment) reads a flag.
 * Only experiment flags count: PostHog marks them with
 * `$feature_flag_has_experiment`, and their variants are strings. A boolean
 * rollout flag is skipped.
 */
export function recordExperimentExposure(properties: Record<string, unknown> | undefined) {
  if (typeof window === "undefined" || !properties) return;

  const flag = properties.$feature_flag;
  const variant = properties.$feature_flag_response;
  if (
    properties.$feature_flag_has_experiment === false ||
    typeof flag !== "string" ||
    typeof variant !== "string" ||
    !EXPERIMENT_KEY_PATTERN.test(flag) ||
    !EXPERIMENT_KEY_PATTERN.test(variant)
  ) {
    return;
  }

  const others = readStoredExperiments();
  delete others[flag];
  const latestFirst = [
    [flag, { variant, seenAt: new Date().toISOString() }] as const,
    ...Object.entries(others).sort(([, a], [, b]) => b.seenAt.localeCompare(a.seenAt)),
  ].slice(0, EXPERIMENT_MAX_COUNT);

  try {
    window.localStorage.setItem(
      EXPERIMENT_STORAGE_KEY,
      JSON.stringify(Object.fromEntries(latestFirst)),
    );
  } catch {
    // Ignore storage failures in restricted environments.
  }
}

/** The variant per flag of every experiment seen in the last 90 days. */
export function readExperimentVariants(): ExperimentVariants {
  return Object.fromEntries(
    Object.entries(readStoredExperiments()).map(([flag, { variant }]) => [flag, variant]),
  );
}

/**
 * Puts one `exp_<flag-key>=<variant>` param on a Console link per experiment
 * and drops `exp_` params for experiments no longer stored.
 */
export function syncExperimentParams(url: URL, variants: ExperimentVariants) {
  let updated = false;

  for (const key of Array.from(url.searchParams.keys())) {
    if (
      key.startsWith(EXPERIMENT_PARAM_PREFIX) &&
      !(key.slice(EXPERIMENT_PARAM_PREFIX.length) in variants)
    ) {
      url.searchParams.delete(key);
      updated = true;
    }
  }

  for (const [flag, variant] of Object.entries(variants)) {
    const key = `${EXPERIMENT_PARAM_PREFIX}${flag}`;
    if (url.searchParams.get(key) !== variant) {
      url.searchParams.set(key, variant);
      updated = true;
    }
  }

  return updated;
}
