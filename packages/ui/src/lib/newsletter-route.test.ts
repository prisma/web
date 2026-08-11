import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { createNewsletterRoute } from "./newsletter-route";

const ALLOWED_ORIGINS = ["https://prisma.io", "https://www.prisma.io"] as const;

function createRoute() {
  return createNewsletterRoute({ allowedOrigins: ALLOWED_ORIGINS, source: "website" });
}

function postRequest(body: string, origin = "https://www.prisma.io") {
  return new Request("https://www.prisma.io/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body,
  });
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("createNewsletterRoute", () => {
  const originalApiKey = process.env.BREVO_API_KEY;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-key";
  });

  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.BREVO_API_KEY;
    } else {
      process.env.BREVO_API_KEY = originalApiKey;
    }
    globalThis.fetch = originalFetch;
    mock.restoreAll();
  });

  it("requires at least one allowed CORS origin", () => {
    assert.throws(() => createNewsletterRoute({ allowedOrigins: [], source: "website" }));
  });

  it("echoes an allowed origin and varies on Origin", () => {
    const route = createRoute();
    const response = route.OPTIONS(
      new Request("https://prisma.io/api/newsletter", {
        method: "OPTIONS",
        headers: { origin: "https://prisma.io" },
      }),
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://prisma.io");
    assert.equal(response.headers.get("Vary"), "Origin");
  });

  it("falls back to the first allowed origin for unknown or missing origins", () => {
    const route = createRoute();

    const headerVariants: HeadersInit[] = [{ origin: "https://evil.example" }, {}];
    for (const headers of headerVariants) {
      const response = route.OPTIONS(
        new Request("https://prisma.io/api/newsletter", { method: "OPTIONS", headers }),
      );
      assert.equal(response.headers.get("Access-Control-Allow-Origin"), ALLOWED_ORIGINS[0]);
    }
  });

  it("rejects a request without a JSON body", async () => {
    const route = createRoute();
    const response = await route.POST(postRequest("this is not json"));

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "A valid JSON body is required" });
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), "https://www.prisma.io");
  });

  it("rejects missing, non-string, and invalid email values", async () => {
    const route = createRoute();

    for (const body of ["{}", '{"email":42}', '{"email":"not-an-email"}', '"just a string"']) {
      const response = await route.POST(postRequest(body));
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { error: "A valid email address is required" });
    }
  });

  it("fails closed when the Brevo API key is missing", async () => {
    const error = mock.method(console, "error", () => {});
    delete process.env.BREVO_API_KEY;

    const route = createRoute();
    const response = await route.POST(postRequest('{"email":"dev@example.com"}'));

    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "Newsletter service is not configured" });
    assert.equal(error.mock.callCount(), 1);
  });

  it("subscribes a valid email and reports success", async () => {
    const responses = [
      jsonResponse({}, 404),
      jsonResponse({ id: 1 }, 201),
      jsonResponse({ messageId: "welcome" }, 201),
    ];
    globalThis.fetch = (async () => {
      const next = responses.shift();
      assert.ok(next, "Unexpected Brevo request");
      return next;
    }) as typeof fetch;

    const route = createRoute();
    const response = await route.POST(postRequest('{"email":"dev@example.com"}'));

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { message: "Subscribed to the Prisma newsletter" });
    assert.equal(responses.length, 0);
  });

  it("logs the welcome failure reason without failing the subscription", async () => {
    const warn = mock.method(console, "warn", () => {});
    const responses = [
      jsonResponse({}, 404),
      jsonResponse({ id: 1 }, 201),
      jsonResponse({ code: "template_inactive" }, 400),
    ];
    globalThis.fetch = (async () => {
      const next = responses.shift();
      assert.ok(next, "Unexpected Brevo request");
      return next;
    }) as typeof fetch;

    const route = createRoute();
    const response = await route.POST(postRequest('{"email":"dev@example.com"}'));

    assert.equal(response.status, 200);
    const routeWarning = warn.mock.calls
      .map((call) => call.arguments)
      .find(([message]) => message === "Newsletter subscription completed without welcome email");
    assert.ok(routeWarning, "Expected the route to log the missing welcome email");
    assert.deepEqual(routeWarning[1], {
      source: "website",
      code: "brevo_request_failed",
      status: 400,
      providerCode: "template_inactive",
    });
    assert.doesNotMatch(JSON.stringify(routeWarning), /dev@example\.com/);
  });

  it("responds 405 to GET with an Allow header", () => {
    const route = createRoute();
    const response = route.GET(
      new Request("https://prisma.io/api/newsletter", {
        headers: { origin: "https://prisma.io" },
      }),
    );

    assert.equal(response.status, 405);
    assert.equal(response.headers.get("Allow"), "POST, OPTIONS");
  });
});
