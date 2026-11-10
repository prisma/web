import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../app/api/github-webhook/route";

test("disabled GitHub/Linear integration is 503 and configured unsigned requests stay unauthorized", async () => {
  const names = [
    "GITHUB_WEBHOOK_SECRET",
    "BOT_TOKEN_GITHUB_PR_LINEAR_WEBHOOK",
    "LINEAR_API_KEY",
    "LINEAR_TEAM_ID",
  ];
  const previous = names.map((name) => process.env[name]);
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => {
    throw new Error("unauthorized webhook must not call a vendor");
  }) as typeof fetch;
  try {
    for (const name of names) delete process.env[name];
    assert.equal(
      (
        await POST(
          new Request("https://web.test/docs/api/github-webhook", { method: "POST", body: "{}" }),
        )
      ).status,
      503,
    );
    for (const name of names) process.env[name] = "test";
    assert.equal(
      (
        await POST(
          new Request("https://web.test/docs/api/github-webhook", { method: "POST", body: "{}" }),
        )
      ).status,
      401,
    );
  } finally {
    globalThis.fetch = originalFetch;
    names.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  }
});
