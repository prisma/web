import assert from "node:assert/strict";
import {
  ACQUISITION_MAX_AGE_MS,
  acquisitionAtSignup,
  acquisitionCookieHeader,
  acquisitionEventProperties,
  mergeAcquisition,
  normalizeReferrer,
  observeAcquisition,
  readAcquisitionCookie,
  validateAcquisition,
} from "./acquisition";
import { test } from "node:test";

const now = Date.parse(`2026-10-14T10:00:00.000Z`);
const observe = (referrer: string, time = now) =>
  observeAcquisition({
    referrer,
    hasCampaign: false,
    surface: `website`,
    captureMethod: `browser`,
    now: time,
  });
const google = mergeAcquisition(
  undefined,
  observe(`https://WWW.Google.com./search?q=private#fragment`),
  now,
);

for (const [input, expected] of [
  [
    `https://WWW.Google.com./search?q=secret`,
    {
      kind: `external_referrer`,
      referrerHost: `google.com`,
      referrerDomain: `google.com`,
    },
  ],
  [
    `https://news.example.co.uk/a`,
    {
      kind: `external_referrer`,
      referrerHost: `news.example.co.uk`,
      referrerDomain: `example.co.uk`,
    },
  ],
  [
    `https://team.github.io/a`,
    {
      kind: `external_referrer`,
      referrerHost: `team.github.io`,
      referrerDomain: `team.github.io`,
    },
  ],
  [`https://www.prisma.io/docs`, { kind: `unknown`, unknownReason: `internal_only` }],
  [`https://console.prisma.io/login`, { kind: `unknown`, unknownReason: `internal_only` }],
  [
    `https://prisma.io.evil.com`,
    {
      kind: `external_referrer`,
      referrerHost: `prisma.io.evil.com`,
      referrerDomain: `evil.com`,
    },
  ],
  [`https://accounts.google.com/`, { kind: `unknown`, unknownReason: `auth_only` }],
  [`https://github.com/login/oauth/authorize`, { kind: `unknown`, unknownReason: `auth_only` }],
  [
    `https://github.com/prisma/prisma`,
    {
      kind: `external_referrer`,
      referrerHost: `github.com`,
      referrerDomain: `github.com`,
    },
  ],
  [`android-app://com.example.app`, { kind: `app_referrer` }],
  ...[
    `javascript:alert(1)`,
    `https://localhost/`,
    `https://127.0.0.1/a`,
    `https://user:pass@example.com`,
    `not a url`,
    `x`.repeat(2049),
  ].map((input) => [input, { kind: `unknown`, unknownReason: `invalid_input` }] as const),
] as const) {
  test(`normalizes referrer ${input.slice(0, 80)}`, () =>
    assert.deepEqual(normalizeReferrer(input), expected));
}

test(`only observed browser emptiness establishes direct; campaigns never infer websites`, () => {
  assert.equal(observe(``).kind, `direct`);
  assert.equal(
    observeAcquisition({
      referrer: ``,
      hasCampaign: false,
      surface: `console`,
      captureMethod: `request_header`,
      now,
    }).kind,
    `unknown`,
  );
  const campaign = observeAcquisition({
    referrer: ``,
    hasCampaign: true,
    surface: `docs`,
    captureMethod: `browser`,
    now,
  });
  assert.equal(campaign.kind, `campaign_only`);
  assert.equal(campaign.referrerDomain, undefined);
});

test(`an organic return replaces the latest external touch without changing first or expiry`, () => {
  const first = mergeAcquisition(
    undefined,
    observe(`https://chatgpt.com/`, now - 86400000),
    now - 86400000,
  );
  const returned = mergeAcquisition(first, observe(`https://google.com/`), now);
  assert.equal(returned.firstObserved.referrerDomain, `chatgpt.com`);
  assert.equal(returned.lastNonDirect?.referrerDomain, `google.com`);
  assert.equal(returned.capturedAt, first.capturedAt);
  assert.equal(returned.expiresAt, first.expiresAt);
  for (const referrer of [``, `https://console.prisma.io`, `https://accounts.google.com`]) {
    assert.deepEqual(
      mergeAcquisition(returned, observe(referrer, now + 1000), now + 1000),
      returned,
    );
  }
  assert.deepEqual(mergeAcquisition(returned, first.firstObserved, now), returned);
});

test(`the fixed window expires and malformed, future or forged domains are rejected`, () => {
  assert.equal(validateAcquisition(google, now + ACQUISITION_MAX_AGE_MS), undefined);
  assert.equal(
    validateAcquisition(
      {
        ...google,
        expiresAt: new Date(now + ACQUISITION_MAX_AGE_MS + 1).toISOString(),
      },
      now,
    ),
    undefined,
  );
  assert.equal(validateAcquisition(google, now - 1), undefined);
  assert.equal(
    validateAcquisition(
      {
        ...google,
        firstObserved: {
          ...google.firstObserved,
          referrerDomain: `chatgpt.com`,
        },
      },
      now,
    ),
    undefined,
  );
  assert.equal(
    validateAcquisition(
      {
        ...google,
        firstObserved: {
          ...google.firstObserved,
          referrerHost: `console.prisma.io`,
          referrerDomain: `prisma.io`,
        },
      },
      now,
    ),
    undefined,
  );
  assert.equal(validateAcquisition({ firstObserved: google.firstObserved }, now), undefined);
  const renewed = mergeAcquisition(
    google,
    observe(`https://bing.com`, now + ACQUISITION_MAX_AGE_MS),
    now + ACQUISITION_MAX_AGE_MS,
  );
  assert.equal(renewed.firstObserved.referrerDomain, `bing.com`);
});

test(`cookie round-trip is bounded, unambiguous and production-domain scoped`, () => {
  const header = acquisitionCookieHeader(google, `www.prisma.io`, now)!;
  assert.ok(header.includes(`Domain=prisma.io; Secure`));
  assert.ok(!header.includes(`private`));
  const cookie = header.split(`;`)[0]!;
  assert.deepEqual(readAcquisitionCookie(cookie, now), google);
  assert.equal(readAcquisitionCookie(`${cookie}; ${cookie}`, now), undefined);
  assert.equal(readAcquisitionCookie(`prisma_acquisition=%invalid`, now), undefined);
  assert.equal(readAcquisitionCookie(`prisma_acquisition=${`x`.repeat(2501)}`, now), undefined);
  assert.ok(!acquisitionCookieHeader(google, `prisma.io.example.com`, now)!.includes(`Domain=`));
  assert.ok(!acquisitionCookieHeader(google, `localhost`, now)!.includes(`Domain=`));
  assert.ok(acquisitionCookieHeader(undefined, `console.prisma.io`, now)!.includes(`Max-Age=0`));
});

test(`event-time snapshots exclude raw URLs, queries and campaign labels`, () => {
  const properties = acquisitionEventProperties(google);
  assert.equal(properties[`acquisition-first-referrer-domain`], `google.com`);
  assert.equal(properties[`acquisition_schema_version`], 2);
  assert.ok(!JSON.stringify(properties).includes(`private`));
  const unavailable = acquisitionAtSignup(google, false, `console`);
  assert.equal(unavailable.firstObserved.kind, `unknown`);
  assert.equal(unavailable.firstObserved.unknownReason, `unavailable`);
  assert.equal(unavailable.firstObserved.referrerDomain, undefined);
});
