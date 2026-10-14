import { parse } from "tldts";
import { z } from "zod/v3";

export const ACQUISITION_COOKIE_NAME = `prisma_acquisition`;
export const ACQUISITION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
export const ACQUISITION_MAX_ENCODED_LENGTH = 2500;

export const AcquisitionKindSchema = z.enum([
  `external_referrer`,
  `direct`,
  `campaign_only`,
  `app_referrer`,
  `unknown`,
]);

export const AcquisitionTouchSchema = z
  .object({
    kind: AcquisitionKindSchema,
    referrerHost: z.string().min(1).max(253).optional(),
    referrerDomain: z.string().min(1).max(253).optional(),
    observedAt: z.string().datetime().optional(),
    surface: z.enum([`website`, `docs`, `blog`, `console`, `auth`]),
    captureMethod: z.enum([`browser`, `request_header`]).optional(),
    transportMethod: z.enum([`local`, `handoff`]),
    unknownReason: z
      .enum([
        `missing_capture`,
        `internal_only`,
        `auth_only`,
        `invalid_input`,
        `expired`,
        `legacy_undated`,
        `unavailable`,
      ])
      .optional(),
  })
  .superRefine((touch, context) => {
    if (touch.kind === `external_referrer` && (!touch.referrerHost || !touch.referrerDomain)) {
      context.addIssue({
        code: `custom`,
        message: `External referrer needs a host and domain`,
      });
    }
    if (touch.kind !== `external_referrer` && (touch.referrerHost || touch.referrerDomain)) {
      context.addIssue({
        code: `custom`,
        message: `Only external referrers carry a website`,
      });
    }
    if (touch.kind === `unknown` ? !touch.unknownReason : touch.unknownReason !== undefined) {
      context.addIssue({
        code: `custom`,
        message: `Unknown source needs an explicit reason`,
      });
    }
    if (touch.kind !== `unknown` && (!touch.observedAt || !touch.captureMethod)) {
      context.addIssue({
        code: `custom`,
        message: `Observed source needs capture provenance`,
      });
    }
    if (touch.kind === `direct` && touch.captureMethod !== `browser`) {
      context.addIssue({
        code: `custom`,
        message: `An absent request header cannot establish direct traffic`,
      });
    }
  });
export type AcquisitionTouch = z.infer<typeof AcquisitionTouchSchema>;

export const AcquisitionSnapshotSchema = z.object({
  schemaVersion: z.literal(2),
  firstObserved: AcquisitionTouchSchema,
  lastNonDirect: AcquisitionTouchSchema.refine(
    (touch) => ![`direct`, `unknown`].includes(touch.kind),
    `Last non-direct touch must contain external, campaign, or app evidence`,
  ).optional(),
  capturedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
});
export type AcquisitionSnapshot = z.infer<typeof AcquisitionSnapshotSchema>;

/** Exact DNS boundaries keep lookalike domains from becoming self-referrals. */
export function isInternalAcquisitionHost(host: string): boolean {
  return [`prisma.io`, `prisma-data.net`, `prisma.sh`, `prismagraphql.com`, `prisma.build`].some(
    (domain) => host === domain || host.endsWith(`.${domain}`),
  );
}

export function normalizeReferrer(
  referrer: string,
):
  | { kind: `external_referrer`; referrerHost: string; referrerDomain: string }
  | { kind: `app_referrer` }
  | { kind: `unknown`; unknownReason: AcquisitionTouch[`unknownReason`] } {
  try {
    if (referrer.length > 2048) throw new Error(`Oversized referrer`);
    const url = new URL(referrer);
    if ([`android-app:`, `ios-app:`].includes(url.protocol)) return { kind: `app_referrer` };
    if (![`https:`, `http:`].includes(url.protocol) || url.username || url.password)
      throw new Error(`Invalid website`);
    const host = url.hostname
      .toLowerCase()
      .replace(/\.$/, ``)
      .replace(/^www\./, ``);
    if (isInternalAcquisitionHost(host)) return { kind: `unknown`, unknownReason: `internal_only` };
    if (
      host === `accounts.google.com` ||
      (host === `github.com` && /^\/login(?:\/|$)/.test(url.pathname))
    ) {
      return { kind: `unknown`, unknownReason: `auth_only` };
    }
    const parsed = parse(host, { allowPrivateDomains: true });
    if (parsed.isIp || !parsed.domain || (!parsed.isIcann && !parsed.isPrivate))
      throw new Error(`Invalid domain`);
    return {
      kind: `external_referrer`,
      referrerHost: host,
      referrerDomain: parsed.domain,
    };
  } catch {
    return { kind: `unknown`, unknownReason: `invalid_input` };
  }
}

export function observeAcquisition(input: {
  referrer: string;
  hasCampaign: boolean;
  surface: AcquisitionTouch[`surface`];
  captureMethod: `browser` | `request_header`;
  now?: number;
}): AcquisitionTouch {
  const source = input.referrer
    ? normalizeReferrer(input.referrer)
    : input.hasCampaign
      ? { kind: `campaign_only` as const }
      : input.captureMethod === `browser`
        ? { kind: `direct` as const }
        : {
            kind: `unknown` as const,
            unknownReason: `missing_capture` as const,
          };
  return {
    ...source,
    surface: input.surface,
    transportMethod: `local`,
    ...(source.kind !== `unknown` && {
      observedAt: new Date(input.now ?? Date.now()).toISOString(),
      captureMethod: input.captureMethod,
    }),
  };
}

/** Validates untrusted analytics metadata without retaining URLs or identifiers. */
export function validateAcquisition(
  value: unknown,
  now = Date.now(),
): AcquisitionSnapshot | undefined {
  const result = AcquisitionSnapshotSchema.safeParse(value);
  if (!result.success) return undefined;
  const snapshot = result.data;
  const capturedAt = Date.parse(snapshot.capturedAt);
  const expiresAt = Date.parse(snapshot.expiresAt);
  if (
    capturedAt > now ||
    expiresAt <= now ||
    expiresAt <= capturedAt ||
    expiresAt - capturedAt > ACQUISITION_MAX_AGE_MS
  )
    return undefined;
  for (const touch of [snapshot.firstObserved, snapshot.lastNonDirect]) {
    if (!touch) continue;
    if (
      touch.observedAt &&
      (Date.parse(touch.observedAt) < capturedAt || Date.parse(touch.observedAt) > now)
    )
      return undefined;
    if (touch.kind === `external_referrer`) {
      const normalized = normalizeReferrer(`https://${touch.referrerHost}`);
      if (
        normalized.kind !== `external_referrer` ||
        normalized.referrerHost !== touch.referrerHost ||
        normalized.referrerDomain !== touch.referrerDomain
      )
        return undefined;
    }
  }
  if (
    snapshot.firstObserved.observedAt &&
    Date.parse(snapshot.firstObserved.observedAt) !== capturedAt
  )
    return undefined;
  return snapshot;
}

export function mergeAcquisition(
  existing: AcquisitionSnapshot | undefined,
  touch: AcquisitionTouch,
  now = Date.now(),
): AcquisitionSnapshot {
  const valid = validateAcquisition(existing, now);
  const observedAt = touch.observedAt ? Date.parse(touch.observedAt) : now;
  // An internal navigation or OAuth callback is not a new acquisition touch.
  if (
    valid &&
    (touch.kind === `unknown` ||
      touch.kind === `direct` ||
      observedAt <= Date.parse(valid.lastNonDirect?.observedAt ?? valid.capturedAt))
  )
    return valid;
  const first = valid?.firstObserved ?? touch;
  const capturedAt = valid?.capturedAt ?? new Date(observedAt).toISOString();
  return {
    schemaVersion: 2,
    firstObserved: first,
    lastNonDirect:
      touch.kind !== `unknown` && touch.kind !== `direct` ? touch : valid?.lastNonDirect,
    capturedAt,
    expiresAt: valid?.expiresAt ?? new Date(observedAt + ACQUISITION_MAX_AGE_MS).toISOString(),
  };
}

export function readAcquisitionCookie(
  cookie: string | null,
  now = Date.now(),
): AcquisitionSnapshot | undefined {
  try {
    const values = (cookie ?? ``)
      .split(`;`)
      .map((part) => part.trim())
      .filter((part) => part.startsWith(`${ACQUISITION_COOKIE_NAME}=`));
    if (values.length !== 1) return undefined;
    const encoded = values[0]?.slice(ACQUISITION_COOKIE_NAME.length + 1) ?? ``;
    if (encoded.length > ACQUISITION_MAX_ENCODED_LENGTH) return undefined;
    return validateAcquisition(JSON.parse(decodeURIComponent(encoded)), now);
  } catch {
    return undefined;
  }
}

export function acquisitionCookieHeader(
  snapshot: AcquisitionSnapshot | undefined,
  hostname: string,
  now = Date.now(),
): string | undefined {
  const valid = snapshot && validateAcquisition(snapshot, now);
  if (snapshot && !valid) return undefined;
  const value = valid ? encodeURIComponent(JSON.stringify(valid)) : ``;
  if (value.length > ACQUISITION_MAX_ENCODED_LENGTH) return undefined;
  // Preview and localhost remain host-only; only the production parent is shared.
  const domain =
    hostname === `prisma.io` || hostname.endsWith(`.prisma.io`) ? `; Domain=prisma.io; Secure` : ``;
  return `${ACQUISITION_COOKIE_NAME}=${value}; Path=/; SameSite=Lax; Max-Age=${valid ? Math.max(0, Math.floor((Date.parse(valid.expiresAt) - now) / 1000)) : 0}${domain}`;
}

export function acquisitionEventProperties(
  snapshot: AcquisitionSnapshot,
): Record<string, string | number> {
  const properties: Record<string, string | number> = {
    acquisition_schema_version: 2,
    "acquisition-expires-at": snapshot.expiresAt,
  };
  for (const [prefix, touch] of [
    [`first`, snapshot.firstObserved],
    [`last-non-direct`, snapshot.lastNonDirect],
  ] as const) {
    if (!touch) continue;
    for (const [field, value] of Object.entries(touch)) {
      if (value !== undefined)
        properties[
          `acquisition-${prefix}-${field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
        ] = value;
    }
  }
  return properties;
}

/** Makes every v2 signup explicit, including captures unavailable on this browser. */
export function acquisitionAtSignup(
  snapshot: AcquisitionSnapshot | undefined,
  analyticsConsent: boolean | undefined,
  surface: AcquisitionTouch[`surface`],
): AcquisitionSnapshot {
  const valid = analyticsConsent && validateAcquisition(snapshot);
  if (valid)
    return {
      ...valid,
      firstObserved: {
        ...valid.firstObserved,
        transportMethod: valid.firstObserved.surface === surface ? `local` : `handoff`,
      },
      lastNonDirect: valid.lastNonDirect && {
        ...valid.lastNonDirect,
        transportMethod: valid.lastNonDirect.surface === surface ? `local` : `handoff`,
      },
    };
  return mergeAcquisition(undefined, {
    kind: `unknown`,
    surface,
    transportMethod: `local`,
    unknownReason: !analyticsConsent ? `unavailable` : snapshot ? `expired` : `missing_capture`,
  });
}
