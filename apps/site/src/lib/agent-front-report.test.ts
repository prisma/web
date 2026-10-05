import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest, type NextFetchEvent } from "next/server";

// Agent Front reads its configuration at module load, so set it before the
// import. Each test file runs in its own process, so this does not leak into
// proxy-matcher.test.ts, which imports the same module with no key.
process.env.ORA_INGEST_KEY = "test-key";
for (const name of ["ORA_KEY", "ORA_DOMAIN_ID", "ORA_SALT"]) {
  delete process.env[name];
}

// Capture what would be sent to ora instead of sending it.
const sent: { url: string; body: string }[] = [];
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  sent.push({ url: String(input), body: String(init?.body ?? "") });
  return new Response(JSON.stringify({ accepted: 1 }), { status: 202 });
}) as typeof fetch;

const { handleAgentFront } = await import("@/agent-front");

async function reportOf(url: string, headers: Record<string, string>) {
  sent.length = 0;
  const pending: Promise<unknown>[] = [];
  const event = {
    waitUntil: (p: Promise<unknown>) => pending.push(p),
  } as unknown as NextFetchEvent;

  const answered = await handleAgentFront(new NextRequest(url, { headers }), event);
  await Promise.all(pending);

  assert.equal(answered, null, "reporting only: the app answers");
  assert.equal(sent.length, 1, "exactly one call, to ora's ingest");
  assert.match(sent[0].url, /\/v1\/events$/);
  return JSON.parse(sent[0].body) as Record<string, unknown>;
}

test("the referer reaches ora without its query string or fragment", async () => {
  const event = await reportOf("https://www.prisma.io/pricing", {
    "user-agent": "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    referer: "https://www.prisma.io/docs/orm?email=someone%40example.com&token=abc#setup",
  });
  assert.equal(event.referer, "https://www.prisma.io/docs/orm");
});

test("an unparseable referer is dropped rather than sent", async () => {
  const event = await reportOf("https://www.prisma.io/pricing", {
    "user-agent": "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    referer: "not a url?secret=1",
  });
  assert.equal(event.referer, undefined);
});

test("only the allow-listed query parameters of the page are reported", async () => {
  const event = await reportOf(
    "https://www.prisma.io/pricing?utm_source=chatgpt.com&email=someone%40example.com",
    { "user-agent": "Mozilla/5.0 (compatible; GPTBot/1.2; +https://openai.com/gptbot)" },
  );
  assert.equal(event.path, "/pricing");
  assert.equal(event.query, "?utm_source=chatgpt.com");
});
