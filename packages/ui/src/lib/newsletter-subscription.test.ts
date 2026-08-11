import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import {
  NEWSLETTER_CONSENT_AT_ATTRIBUTE,
  NEWSLETTER_SOURCE_ATTRIBUTE,
  NEWSLETTER_WELCOME_TEMPLATE_ID,
  NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE,
  PRISMA_NEWSLETTER_LIST_ID,
  NewsletterServiceError,
  isValidNewsletterEmail,
  subscribeToPrismaNewsletter,
  unsubscribeFromPrismaNewsletter,
} from "./newsletter-subscription";

describe("isValidNewsletterEmail", () => {
  it("accepts a normal address and rejects malformed or oversized input", () => {
    assert.equal(isValidNewsletterEmail("dev@example.com"), true);
    assert.equal(isValidNewsletterEmail("dev@@example.com"), false);
    assert.equal(isValidNewsletterEmail("dev@example"), false);
    assert.equal(isValidNewsletterEmail(`dev@${"a".repeat(250)}.com`), false);
  });

  it("handles repeated punctuation without a backtracking expression", () => {
    assert.equal(isValidNewsletterEmail(`!@!${"!.".repeat(10_000)}`), false);
  });
});

type FetchCall = {
  input: string;
  init?: RequestInit;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function createFetch(responses: (Response | Error)[]) {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ input: String(input), init });
    const response = responses.shift();
    assert.ok(response, "Unexpected Brevo request");
    if (response instanceof Error) throw response;
    return response;
  }) as typeof fetch;

  return { calls, fetcher };
}

function silenceWarn() {
  return mock.method(console, "warn", () => {});
}

describe("subscribeToPrismaNewsletter", () => {
  it("subscribes a new website contact and sends one welcome email", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({}, 404),
      jsonResponse({ id: 123 }, 201),
      jsonResponse({ messageId: "welcome-1" }, 201),
    ]);

    const result = await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: " Dev@Example.com ",
      fetcher,
      source: "website",
    });

    assert.deepEqual(result, { status: "subscribed", welcomeSent: true });
    assert.equal(calls.length, 3);

    const contactBody = JSON.parse(String(calls[1]?.init?.body));
    assert.equal(contactBody.email, "dev@example.com");
    assert.equal(contactBody.updateEnabled, true);
    assert.equal(contactBody.attributes.EMAIL, "dev@example.com");
    assert.equal(contactBody.attributes[NEWSLETTER_SOURCE_ATTRIBUTE], "website");
    assert.equal(contactBody.attributes.SOURCE, "website");
    assert.match(contactBody.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE], /^[0-9a-f]{64}$/);
    assert.match(
      contactBody.attributes[NEWSLETTER_CONSENT_AT_ATTRIBUTE],
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
    assert.equal(contactBody.emailBlacklisted, false);
    assert.deepEqual(contactBody.listIds, [PRISMA_NEWSLETTER_LIST_ID]);

    const emailBody = JSON.parse(String(calls[2]?.init?.body));
    assert.equal(emailBody.templateId, NEWSLETTER_WELCOME_TEMPLATE_ID);
    assert.deepEqual(emailBody.to, [{ email: "dev@example.com" }]);
    assert.equal(
      emailBody.params.unsubscribeUrl,
      `https://www.prisma.io/api/newsletter/unsubscribe?token=${contactBody.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE]}`,
    );
    assert.match(
      emailBody.headers["Idempotency-Key"],
      /^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it("rejects an invalid email inside the service without calling Brevo", async () => {
    const { calls, fetcher } = createFetch([]);

    await assert.rejects(
      subscribeToPrismaNewsletter({
        apiKey: "test-key",
        email: " not an email ",
        fetcher,
        source: "website",
      }),
      (error: unknown) => {
        assert.ok(error instanceof NewsletterServiceError);
        assert.equal(error.code, "invalid_email");
        return true;
      },
    );
    assert.equal(calls.length, 0);
  });

  it("issues an unpredictable unsubscribe token for each new contact", async () => {
    const tokens: string[] = [];

    for (let run = 0; run < 2; run += 1) {
      const { calls, fetcher } = createFetch([
        jsonResponse({}, 404),
        jsonResponse({ id: run }, 201),
        jsonResponse({ messageId: `welcome-${run}` }, 201),
      ]);

      await subscribeToPrismaNewsletter({
        apiKey: "test-key",
        email: "dev@example.com",
        fetcher,
        source: "website",
      });

      tokens.push(
        JSON.parse(String(calls[1]?.init?.body)).attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE],
      );
    }

    assert.match(tokens[0], /^[0-9a-f]{64}$/);
    assert.match(tokens[1], /^[0-9a-f]{64}$/);
    assert.notEqual(tokens[0], tokens[1]);
  });

  it("keeps an existing unsubscribe token when a contact resubscribes", async () => {
    const token = "a".repeat(64);
    const { calls, fetcher } = createFetch([
      jsonResponse({
        attributes: {
          [NEWSLETTER_SOURCE_ATTRIBUTE]: "console-signup",
          [NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE]: token,
          SOURCE: "console-signup",
        },
        emailBlacklisted: false,
        listIds: [],
      }),
      jsonResponse({}, 204),
      jsonResponse({ messageId: "welcome-2" }, 201),
    ]);

    await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: "returning@example.com",
      fetcher,
      source: "blog",
    });

    const contactBody = JSON.parse(String(calls[1]?.init?.body));
    const emailBody = JSON.parse(String(calls[2]?.init?.body));
    assert.equal(contactBody.attributes[NEWSLETTER_SOURCE_ATTRIBUTE], "blog");
    assert.equal(contactBody.attributes[NEWSLETTER_UNSUBSCRIBE_TOKEN_ATTRIBUTE], token);
    assert.equal(contactBody.attributes.SOURCE, "console-signup");
    assert.equal(
      emailBody.params.unsubscribeUrl,
      `https://www.prisma.io/api/newsletter/unsubscribe?token=${token}`,
    );
  });

  it("does not send a welcome when the contact is already subscribed", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({ emailBlacklisted: false, listIds: [PRISMA_NEWSLETTER_LIST_ID] }),
    ]);

    const result = await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: "console-user@example.com",
      fetcher,
      source: "blog",
    });

    assert.deepEqual(result, { status: "already_subscribed", welcomeSent: false });
    assert.equal(calls.length, 1);
  });

  it("resubscribes a blacklisted contact before sending the welcome", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({ emailBlacklisted: true, listIds: [PRISMA_NEWSLETTER_LIST_ID] }),
      jsonResponse({}, 204),
      jsonResponse({ messageId: "welcome-2" }, 201),
    ]);

    const result = await subscribeToPrismaNewsletter({
      apiKey: "test-key",
      email: "returning@example.com",
      fetcher,
      source: "docs",
    });

    assert.deepEqual(result, { status: "subscribed", welcomeSent: true });
    assert.equal(calls[1]?.init?.method, "PUT");
    assert.equal(calls.length, 3);
  });

  it("reuses one idempotency key per address so duplicate welcomes collapse", async () => {
    const keys: string[] = [];

    for (const email of ["dev@example.com", "dev@example.com", "other@example.com"]) {
      const { calls, fetcher } = createFetch([
        jsonResponse({}, 404),
        jsonResponse({ id: 1 }, 201),
        jsonResponse({ messageId: "welcome" }, 201),
      ]);

      await subscribeToPrismaNewsletter({ apiKey: "test-key", email, fetcher, source: "website" });
      keys.push(JSON.parse(String(calls[2]?.init?.body)).headers["Idempotency-Key"]);
    }

    assert.equal(keys[0], keys[1]);
    assert.notEqual(keys[0], keys[2]);
  });

  it("keeps a completed subscription and surfaces the reason when the welcome send fails", async () => {
    const warn = silenceWarn();
    try {
      const { fetcher } = createFetch([
        jsonResponse({}, 404),
        jsonResponse({ id: 123 }, 201),
        jsonResponse({ code: "temporary_failure" }, 503),
      ]);

      const result = await subscribeToPrismaNewsletter({
        apiKey: "test-key",
        email: "dev@example.com",
        fetcher,
        source: "website",
      });

      assert.deepEqual(result, {
        status: "subscribed",
        welcomeSent: false,
        welcomeFailure: {
          code: "brevo_request_failed",
          status: 503,
          providerCode: "temporary_failure",
        },
      });

      assert.equal(warn.mock.callCount(), 1);
      const logged = JSON.stringify(warn.mock.calls[0]?.arguments);
      assert.doesNotMatch(logged, /dev@example\.com/);
      assert.match(logged, /temporary_failure/);
    } finally {
      warn.mock.restore();
    }
  });

  it("reports a timed-out welcome send distinctly from other failures", async () => {
    const warn = silenceWarn();
    try {
      const { fetcher } = createFetch([
        jsonResponse({}, 404),
        jsonResponse({ id: 123 }, 201),
        new DOMException("The operation timed out", "TimeoutError"),
      ]);

      const result = await subscribeToPrismaNewsletter({
        apiKey: "test-key",
        email: "dev@example.com",
        fetcher,
        source: "website",
      });

      assert.deepEqual(result, {
        status: "subscribed",
        welcomeSent: false,
        welcomeFailure: { code: "brevo_request_timed_out" },
      });
    } finally {
      warn.mock.restore();
    }
  });

  it("maps aborted and failed Brevo requests to service errors without PII", async () => {
    for (const [thrown, expectedCode] of [
      [new DOMException("The operation timed out", "TimeoutError"), "brevo_request_timed_out"],
      [new DOMException("The operation was aborted", "AbortError"), "brevo_request_timed_out"],
      [new TypeError("fetch failed"), "brevo_request_failed"],
    ] as const) {
      const { fetcher } = createFetch([thrown]);

      await assert.rejects(
        subscribeToPrismaNewsletter({
          apiKey: "test-key",
          email: "private@example.com",
          fetcher,
          source: "website",
        }),
        (error: unknown) => {
          assert.ok(error instanceof NewsletterServiceError);
          assert.equal(error.code, expectedCode);
          assert.doesNotMatch(error.message, /private@example\.com/);
          return true;
        },
      );
    }
  });

  it("rejects an invalid Brevo response body as invalid_brevo_response", async () => {
    const { fetcher } = createFetch([
      new Response("<html>gateway error</html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      }),
    ]);

    await assert.rejects(
      subscribeToPrismaNewsletter({
        apiKey: "test-key",
        email: "dev@example.com",
        fetcher,
        source: "website",
      }),
      (error: unknown) => {
        assert.ok(error instanceof NewsletterServiceError);
        assert.equal(error.code, "invalid_brevo_response");
        assert.equal(error.status, 200);
        return true;
      },
    );
  });

  it("does not include the subscriber email in subscription errors", async () => {
    const { fetcher } = createFetch([jsonResponse({ code: "unauthorized" }, 401)]);

    await assert.rejects(
      subscribeToPrismaNewsletter({
        apiKey: "test-key",
        email: "private@example.com",
        fetcher,
        source: "website",
      }),
      (error: unknown) => {
        assert.ok(error instanceof NewsletterServiceError);
        assert.equal(error.code, "brevo_request_failed");
        assert.equal(error.providerCode, "unauthorized");
        assert.equal(error.status, 401);
        assert.doesNotMatch(error.message, /private@example\.com/);
        return true;
      },
    );
  });
});

describe("unsubscribeFromPrismaNewsletter", () => {
  it("removes the contact from only the newsletter list", async () => {
    const token = "b".repeat(64);
    const { calls, fetcher } = createFetch([
      jsonResponse({
        contacts: [
          {
            email: "dev@example.com",
            listIds: [PRISMA_NEWSLETTER_LIST_ID, 99],
          },
        ],
      }),
      jsonResponse({}, 204),
    ]);

    const result = await unsubscribeFromPrismaNewsletter({
      apiKey: "test-key",
      fetcher,
      token,
    });

    assert.deepEqual(result, { status: "unsubscribed" });
    assert.match(calls[0].input, /filter=equals%28NEWSLETTER_UNSUBSCRIBE_TOKEN%2C%22b{64}%22%29/);
    assert.match(calls[1].input, /contacts\/dev%40example\.com\?identifierType=email_id$/);
    assert.deepEqual(JSON.parse(String(calls[1].init?.body)), {
      unlinkListIds: [PRISMA_NEWSLETTER_LIST_ID],
    });
  });

  it("does not update a contact that already left the newsletter list", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({ contacts: [{ email: "dev@example.com", listIds: [99] }] }),
    ]);

    const result = await unsubscribeFromPrismaNewsletter({
      apiKey: "test-key",
      fetcher,
      token: "c".repeat(64),
    });

    assert.deepEqual(result, { status: "already_unsubscribed" });
    assert.equal(calls.length, 1);
  });

  it("treats a token matching more than one contact as invalid", async () => {
    const { calls, fetcher } = createFetch([
      jsonResponse({
        contacts: [
          { email: "one@example.com", listIds: [PRISMA_NEWSLETTER_LIST_ID] },
          { email: "two@example.com", listIds: [PRISMA_NEWSLETTER_LIST_ID] },
        ],
      }),
    ]);

    const result = await unsubscribeFromPrismaNewsletter({
      apiKey: "test-key",
      fetcher,
      token: "d".repeat(64),
    });

    assert.deepEqual(result, { status: "invalid_token" });
    assert.equal(calls.length, 1);
  });

  it("rejects an invalid token without calling Brevo", async () => {
    const { calls, fetcher } = createFetch([]);

    const result = await unsubscribeFromPrismaNewsletter({
      apiKey: "test-key",
      fetcher,
      token: "not-a-token",
    });

    assert.deepEqual(result, { status: "invalid_token" });
    assert.equal(calls.length, 0);
  });
});
