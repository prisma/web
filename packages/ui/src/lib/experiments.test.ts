import assert from "node:assert/strict";
import test from "node:test";
import {
  EXPERIMENT_STORAGE_KEY,
  readExperimentVariants,
  recordExperimentExposure,
  syncExperimentParams,
} from "./experiments";

function installStorage(t: test.TestContext) {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    },
  });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  });
  return storage;
}

const flagCalled = (flag: string, variant: unknown, hasExperiment?: boolean) => ({
  $feature_flag: flag,
  $feature_flag_response: variant,
  ...(hasExperiment !== undefined && { $feature_flag_has_experiment: hasExperiment }),
});

test("records the variant of an experiment flag and keeps the latest per flag", (t) => {
  installStorage(t);
  recordExperimentExposure(flagCalled("homepage-hero", "control", true));
  recordExperimentExposure(flagCalled("postgres-page", "test"));
  recordExperimentExposure(flagCalled("homepage-hero", "test", true));

  assert.deepEqual(readExperimentVariants(), {
    "homepage-hero": "test",
    "postgres-page": "test",
  });
});

test("skips rollout flags and values PostHog would not issue as variants", (t) => {
  const storage = installStorage(t);
  recordExperimentExposure(flagCalled("new-nav", true, true));
  recordExperimentExposure(flagCalled("pricing-copy", "b", false));
  recordExperimentExposure(flagCalled("bad key", "test"));
  recordExperimentExposure(flagCalled("homepage-hero", "has space"));
  recordExperimentExposure(undefined);

  assert.equal(storage.has(EXPERIMENT_STORAGE_KEY), false);
  assert.deepEqual(readExperimentVariants(), {});
});

test("keeps the five most recently seen experiments", (t) => {
  const storage = installStorage(t);
  const now = Date.now();
  storage.set(
    EXPERIMENT_STORAGE_KEY,
    JSON.stringify(
      Object.fromEntries(
        Array.from({ length: 5 }, (_, i) => [
          `flag${i}`,
          { variant: "test", seenAt: new Date(now - (i + 1) * 1000).toISOString() },
        ]),
      ),
    ),
  );

  recordExperimentExposure(flagCalled("latest", "test"));

  assert.deepEqual(Object.keys(readExperimentVariants()), [
    "latest",
    "flag0",
    "flag1",
    "flag2",
    "flag3",
  ]);
});

test("forgets experiments seen more than 90 days ago and malformed storage", (t) => {
  const storage = installStorage(t);
  storage.set(
    EXPERIMENT_STORAGE_KEY,
    JSON.stringify({
      old: { variant: "test", seenAt: new Date(Date.now() - 91 * 86_400_000).toISOString() },
      fresh: { variant: "control", seenAt: new Date().toISOString() },
      broken: { variant: "test" },
    }),
  );
  assert.deepEqual(readExperimentVariants(), { fresh: "control" });

  storage.set(EXPERIMENT_STORAGE_KEY, "not json");
  assert.deepEqual(readExperimentVariants(), {});
});

test("puts one exp_ param per experiment on a Console link and drops stale ones", () => {
  const url = new URL(
    "https://console.prisma.io/sign-up?utm_source=newsletter&exp_old=test&exp_homepage-hero=control",
  );

  assert.equal(
    syncExperimentParams(url, { "homepage-hero": "test", "postgres-page": "control" }),
    true,
  );
  assert.equal(url.searchParams.get("utm_source"), "newsletter");
  assert.equal(url.searchParams.get("exp_homepage-hero"), "test");
  assert.equal(url.searchParams.get("exp_postgres-page"), "control");
  assert.equal(url.searchParams.has("exp_old"), false);

  assert.equal(
    syncExperimentParams(url, { "homepage-hero": "test", "postgres-page": "control" }),
    false,
  );
  assert.equal(syncExperimentParams(new URL("https://console.prisma.io/login"), {}), false);
});
