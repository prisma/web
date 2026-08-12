const BREVO_API_BASE_URL = "https://api.brevo.com/v3";
// One deadline shared by every Brevo call in a workflow (lookup → upsert → welcome),
// not a per-request timeout: the whole subscribe or unsubscribe flow settles within
// this budget so the user-facing request cannot hang on a slow Brevo response.
const BREVO_WORKFLOW_TIMEOUT_MS = 8_000;
// Intentionally hardcoded to production: welcome emails triggered from previews and
// staging still reach real inboxes, so their unsubscribe links must work in production.
const NEWSLETTER_UNSUBSCRIBE_URL = "https://www.prisma.io/api/newsletter/unsubscribe";

export const PRISMA_NEWSLETTER_LIST_ID = 15;
export const NEWSLETTER_WELCOME_TEMPLATE_ID = 228;
export const NEWSLETTER_UNSUBSCRIBE_COOKIE_NAME = "prisma_newsletter_unsubscribe";
export const NEWSLETTER_SOURCE_ATTRIBUTE = "NEWSLETTER_SOURCE";
export const NEWSLETTER_CONSENT_AT_ATTRIBUTE = "NEWSLETTER_CONSENT_AT";
export const NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE = "NEWSLETTER_UNSUBSCRIBE_TOKEN";

export type NewsletterSource = "blog" | "docs" | "website";

type BrevoContact = {
  attributes: Record<string, unknown>;
  email: string | null;
  emailBlacklisted: boolean;
  listIds: number[];
};

type BrevoResponseBody = Record<string, unknown>;

export type NewsletterServiceErrorCode =
  | "brevo_request_failed"
  | "brevo_request_timed_out"
  | "invalid_brevo_response"
  | "invalid_email";

export type NewsletterWelcomeFailure = {
  code: NewsletterServiceErrorCode | "unexpected_error";
  status?: number;
  providerCode?: string;
};

export type NewsletterSubscriptionResult = {
  status: "already_subscribed" | "subscribed";
  welcomeSent: boolean;
  welcomeFailure?: NewsletterWelcomeFailure;
};

export type NewsletterUnsubscribeResult = {
  status: "already_unsubscribed" | "invalid_token" | "unsubscribed";
};

export class NewsletterServiceError extends Error {
  readonly code: NewsletterServiceErrorCode;
  readonly status?: number;
  // Brevo's own error code, kept separate so our domain codes stay a closed union.
  readonly providerCode?: string;

  constructor(
    message: string,
    options: {
      code: NewsletterServiceErrorCode;
      status?: number;
      providerCode?: string;
      cause?: unknown;
    },
  ) {
    super(message, { cause: options.cause });
    this.name = "NewsletterServiceError";
    this.code = options.code;
    this.status = options.status;
    this.providerCode = options.providerCode;
  }
}

type SubscribeToNewsletterOptions = {
  apiKey: string;
  email: string;
  fetcher?: typeof fetch;
  source: NewsletterSource;
};

type UnsubscribeFromNewsletterOptions = {
  apiKey: string;
  fetcher?: typeof fetch;
  token: string;
};

const unsubscribeTokenPattern = /^[0-9a-f]{64}$/;

export function isValidNewsletterEmail(email: string): boolean {
  if (email.length === 0 || email.length > 254 || /\s/.test(email)) return false;

  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) return false;

  const localPart = email.slice(0, atIndex);
  const domainParts = email.slice(atIndex + 1).split(".");
  return (
    localPart.length <= 64 &&
    domainParts.length >= 2 &&
    domainParts.every((part) => part.length > 0 && part.length <= 63)
  );
}

type BrevoTransport = {
  apiKey: string;
  fetcher: typeof fetch;
  signal: AbortSignal;
};

type BrevoRequestOptions = {
  allowNotFound?: boolean;
  body?: unknown;
  method?: "GET" | "POST" | "PUT";
};

async function readJson(operation: string, response: Response): Promise<BrevoResponseBody> {
  const responseText = await response.text();
  if (!responseText) return {};

  try {
    return JSON.parse(responseText) as BrevoResponseBody;
  } catch (cause) {
    throw new NewsletterServiceError(`Brevo ${operation} returned an invalid response`, {
      code: "invalid_brevo_response",
      status: response.status,
      cause,
    });
  }
}

async function brevoRequest(
  transport: BrevoTransport,
  operation: string,
  url: string | URL,
  options: BrevoRequestOptions & { allowNotFound: true },
): Promise<BrevoResponseBody | null>;
async function brevoRequest(
  transport: BrevoTransport,
  operation: string,
  url: string | URL,
  options?: BrevoRequestOptions,
): Promise<BrevoResponseBody>;
// Thin, consistent transport for every Brevo call — shared headers, JSON handling,
// and error conversion. Business rules stay in the callers.
async function brevoRequest(
  transport: BrevoTransport,
  operation: string,
  url: string | URL,
  { allowNotFound = false, body, method = "GET" }: BrevoRequestOptions = {},
): Promise<BrevoResponseBody | null> {
  let response: Response;
  try {
    response = await transport.fetcher(url, {
      method,
      headers: {
        accept: "application/json",
        "api-key": transport.apiKey,
        "content-type": "application/json",
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: transport.signal,
    });
  } catch (cause) {
    if (cause instanceof Error && (cause.name === "TimeoutError" || cause.name === "AbortError")) {
      throw new NewsletterServiceError(`Brevo ${operation} timed out`, {
        code: "brevo_request_timed_out",
        cause,
      });
    }
    throw new NewsletterServiceError(`Brevo ${operation} failed`, {
      code: "brevo_request_failed",
      cause,
    });
  }

  if (allowNotFound && response.status === 404) return null;

  const responseBody = await readJson(operation, response);
  if (!response.ok) {
    throw new NewsletterServiceError(`Brevo ${operation} failed`, {
      code: "brevo_request_failed",
      status: response.status,
      providerCode: typeof responseBody.code === "string" ? responseBody.code : undefined,
    });
  }

  return responseBody;
}

function parseContact(body: BrevoResponseBody): BrevoContact {
  const listIds = Array.isArray(body.listIds)
    ? body.listIds.filter((listId): listId is number => typeof listId === "number")
    : [];

  return {
    attributes:
      typeof body.attributes === "object" && body.attributes !== null
        ? (body.attributes as Record<string, unknown>)
        : {},
    email: typeof body.email === "string" ? body.email : null,
    emailBlacklisted: body.emailBlacklisted === true,
    listIds,
  };
}

export function isValidNewsletterUnsubscribeToken(token: string): boolean {
  return unsubscribeTokenPattern.test(token);
}

function getExistingUnsubscribeToken(contact: BrevoContact | null): string | null {
  const token = contact?.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE];
  return typeof token === "string" && isValidNewsletterUnsubscribeToken(token) ? token : null;
}

// A random value rather than an HMAC so the token shares no secret with the Brevo
// API key: unsubscribe lookups go through the stored NEWSLETTER_UNSUBSCRIBE_TOKEN
// attribute, so determinism buys nothing, and rewriting the attribute revokes a token.
function createUnsubscribeToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function getContact(transport: BrevoTransport, email: string): Promise<BrevoContact | null> {
  const body = await brevoRequest(
    transport,
    "contact lookup",
    `${BREVO_API_BASE_URL}/contacts/${encodeURIComponent(email)}?identifierType=email_id`,
    { allowNotFound: true },
  );

  return body === null ? null : parseContact(body);
}

async function upsertContact(
  transport: BrevoTransport,
  email: string,
  source: NewsletterSource,
  contact: BrevoContact | null,
  unsubscribeToken: string,
): Promise<void> {
  const originalSource = contact?.attributes.SOURCE;
  const body = {
    attributes: {
      EMAIL: email,
      // Consent evidence for the single opt-in flow: refreshed on every (re)subscribe.
      [NEWSLETTER_CONSENT_AT_ATTRIBUTE]: new Date().toISOString(),
      [NEWSLETTER_SOURCE_ATTRIBUTE]: source,
      [NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE]: unsubscribeToken,
      SOURCE: typeof originalSource === "string" && originalSource ? originalSource : source,
    },
    emailBlacklisted: false,
    // `listIds` is additive per the Brevo docs — it never removes other list
    // memberships. `unlinkListIds`, used by the unsubscribe flow, is the removal field.
    listIds: [PRISMA_NEWSLETTER_LIST_ID],
  };

  if (contact) {
    await brevoRequest(
      transport,
      "contact subscription",
      `${BREVO_API_BASE_URL}/contacts/${encodeURIComponent(email)}`,
      { method: "PUT", body },
    );
  } else {
    await brevoRequest(transport, "contact subscription", `${BREVO_API_BASE_URL}/contacts`, {
      method: "POST",
      body: { email, updateEnabled: true, ...body },
    });
  }
}

// The key derives from the email alone, so every welcome for one address shares it.
// Chosen semantics: at most one welcome per address within Brevo's idempotency
// retention window — a concurrent double-submit collapses into a single send, and an
// unsubscribe → resubscribe inside the window intentionally gets no second welcome
// (even though the result still reports `welcomeSent: true`). A resubscribe after
// the window ages out receives a fresh welcome.
async function createWelcomeIdempotencyKey(email: string): Promise<string> {
  const input = new TextEncoder().encode(`prisma-newsletter-welcome:${email}`);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", input)).slice(0, 16);

  // UUID v8 reserves the version for application-defined deterministic identifiers.
  digest[6] = (digest[6] & 0x0f) | 0x80;
  digest[8] = (digest[8] & 0x3f) | 0x80;

  const hex = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function sendWelcomeEmail(
  transport: BrevoTransport,
  email: string,
  unsubscribeToken: string,
): Promise<void> {
  await brevoRequest(transport, "welcome email send", `${BREVO_API_BASE_URL}/smtp/email`, {
    method: "POST",
    body: {
      to: [{ email }],
      templateId: NEWSLETTER_WELCOME_TEMPLATE_ID,
      params: {
        unsubscribeUrl: `${NEWSLETTER_UNSUBSCRIBE_URL}?token=${unsubscribeToken}`,
      },
      tags: ["newsletter-welcome"],
      headers: {
        "Idempotency-Key": await createWelcomeIdempotencyKey(email),
      },
    },
  });
}

export async function subscribeToPrismaNewsletter({
  apiKey,
  email,
  fetcher = fetch,
  source,
}: SubscribeToNewsletterOptions): Promise<NewsletterSubscriptionResult> {
  const normalizedEmail = email.trim().toLowerCase();
  // The service enforces its own invariant; route and UI validation is UX, not enforcement.
  if (!isValidNewsletterEmail(normalizedEmail)) {
    throw new NewsletterServiceError("Invalid newsletter email", { code: "invalid_email" });
  }

  const transport: BrevoTransport = {
    apiKey,
    fetcher,
    signal: AbortSignal.timeout(BREVO_WORKFLOW_TIMEOUT_MS),
  };

  const contact = await getContact(transport, normalizedEmail);

  if (contact?.listIds.includes(PRISMA_NEWSLETTER_LIST_ID) && !contact.emailBlacklisted) {
    return { status: "already_subscribed", welcomeSent: false };
  }

  const unsubscribeToken = getExistingUnsubscribeToken(contact) ?? createUnsubscribeToken();

  await upsertContact(transport, normalizedEmail, source, contact, unsubscribeToken);

  try {
    await sendWelcomeEmail(transport, normalizedEmail, unsubscribeToken);
    return { status: "subscribed", welcomeSent: true };
  } catch (error) {
    // The subscription is complete even when the non-essential welcome email fails,
    // but the reason must survive so operators can tell a timeout from an inactive
    // template. Codes and statuses only — never the subscriber email.
    const welcomeFailure: NewsletterWelcomeFailure =
      error instanceof NewsletterServiceError
        ? {
            code: error.code,
            ...(error.status === undefined ? {} : { status: error.status }),
            ...(error.providerCode === undefined ? {} : { providerCode: error.providerCode }),
          }
        : { code: "unexpected_error" };
    console.warn("Newsletter welcome email failed", welcomeFailure);
    return { status: "subscribed", welcomeSent: false, welcomeFailure };
  }
}

export async function unsubscribeFromPrismaNewsletter({
  apiKey,
  fetcher = fetch,
  token,
}: UnsubscribeFromNewsletterOptions): Promise<NewsletterUnsubscribeResult> {
  if (!isValidNewsletterUnsubscribeToken(token)) return { status: "invalid_token" };

  const transport: BrevoTransport = {
    apiKey,
    fetcher,
    signal: AbortSignal.timeout(BREVO_WORKFLOW_TIMEOUT_MS),
  };

  const contactsUrl = new URL(`${BREVO_API_BASE_URL}/contacts`);
  contactsUrl.searchParams.set("limit", "2");
  contactsUrl.searchParams.set(
    "filter",
    `equals(${NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE},"${token}")`,
  );

  const lookupBody = await brevoRequest(transport, "unsubscribe lookup", contactsUrl);

  const contacts = Array.isArray(lookupBody.contacts)
    ? lookupBody.contacts.filter(
        (contact): contact is Record<string, unknown> =>
          typeof contact === "object" && contact !== null,
      )
    : [];
  if (contacts.length !== 1) return { status: "invalid_token" };

  const contact = parseContact(contacts[0]);
  if (!contact.email) return { status: "invalid_token" };
  if (!contact.listIds.includes(PRISMA_NEWSLETTER_LIST_ID)) {
    return { status: "already_unsubscribed" };
  }

  await brevoRequest(
    transport,
    "newsletter unsubscribe",
    `${BREVO_API_BASE_URL}/contacts/${encodeURIComponent(contact.email)}?identifierType=email_id`,
    { method: "PUT", body: { unlinkListIds: [PRISMA_NEWSLETTER_LIST_ID] } },
  );

  return { status: "unsubscribed" };
}
