import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import { OPENAI_ADS_PIXEL_ID, OPENAI_ADS_SDK_URL } from "@prisma-docs/ui/lib/openai-pixel";

const script = readFileSync(new URL("../public/console-analytics.js", import.meta.url), "utf8");
function setup() {
  const messages: unknown[][] = [];
  const scripts: Record<string, unknown>[] = [];
  let receive: (event: unknown) => void = () => {};
  const parent = { postMessage: (...args: unknown[]) => messages.push(args) };
  const window: Record<string, any> = {
    parent,
    addEventListener: (_: string, listener: (event: unknown) => void) => {
      receive = listener;
    },
  };
  vm.runInNewContext(script, {
    window,
    URL,
    document: {
      createElement: () => ({}),
      head: { appendChild: (node: Record<string, unknown>) => scripts.push(node) },
    },
  });
  return {
    window,
    scripts,
    messages,
    send: (
      data: unknown,
      origin = "https://console.prisma.io",
      source: { postMessage: (...args: unknown[]) => unknown } = parent,
    ) => receive({ data, origin, source }),
    commands: () => (window.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry)),
  };
}
const grant = {
  type: "console-analytics",
  consent: { decided: true, analytics: true, advertisement: true },
  attribution: { gclid: "CurrentClick", utm_campaign: "launch", token: "secret" },
  conversion: {
    id: "handoff-1",
    event: "sign_up",
    method: "google",
    email: "private@example.com",
    openaiEventId: "a1b2c3d4e5f6",
  },
};
const googleSdk = "https://www.googletagmanager.com/gtag/js?id=G-4B72WBX9ET";
const openaiSdk = OPENAI_ADS_SDK_URL;
const googleScripts = (app: ReturnType<typeof setup>) =>
  app.scripts.filter((s) => s.src === googleSdk);
const oaiqCalls = (app: ReturnType<typeof setup>) =>
  ((app.window.oaiq?.q ?? []) as ArrayLike<unknown>[]).map((entry) => Array.from(entry));

test("ignores untrusted origins and message sources", () => {
  const app = setup();
  app.send(grant, "https://evil.example");
  app.send(grant, "https://console.prisma.io", { postMessage: () => {} });
  assert.equal(app.scripts.length, 0);
  assert.equal(app.commands().filter(([command]) => command === "event").length, 0);
  assert.equal(app.window.oaiq, undefined);
});

test("requires explicit analytics consent before loading Google", () => {
  for (const consent of [undefined, {}, { analytics: true }, { decided: true, analytics: false }]) {
    const app = setup();
    app.send({ ...grant, consent });
    assert.equal(googleScripts(app).length, 0);
  }
});

test("loads direct gtag once, deduplicates handoffs, and sends only allowlisted fields", () => {
  const app = setup();
  app.send(grant);
  app.send(grant);
  assert.equal(googleScripts(app).length, 1);
  const events = app.commands().filter(([command]) => command === "event");
  assert.equal(events.length, 1);
  assert.equal(events[0]?.[1], "sign_up");
  assert.equal(
    (events[0]?.[2] as Record<string, string>).page_location,
    "https://console.prisma.io/?gclid=CurrentClick",
  );
  assert.doesNotMatch(JSON.stringify(app.commands()), /secret|private@example|handoff-1/);
  assert.equal(app.messages.length, 3);
  app.send({ ...grant, conversion: { id: "handoff-2", event: "login", method: "email" } });
  assert.equal(app.commands().filter(([command]) => command === "event").length, 2);
});

test("separates advertising consent and disables automatic hits on revocation", () => {
  const app = setup();
  app.send({ ...grant, consent: { decided: true, analytics: true, advertisement: false } });
  assert.doesNotMatch(JSON.stringify(app.commands()), /CurrentClick/);
  app.send({
    ...grant,
    consent: { decided: true, analytics: false, advertisement: false },
    conversion: null,
  });
  assert.equal(app.window["ga-disable-G-4B72WBX9ET"], true);
  assert.equal(app.commands().filter(([command]) => command === "event").length, 1);
});

test("rejects empty handoff IDs without measuring or acknowledging them", () => {
  const app = setup();
  app.send({ ...grant, conversion: { ...grant.conversion, id: "" } });
  assert.equal(app.commands().filter(([command]) => command === "event").length, 0);
  assert.equal(app.messages.length, 1);
  app.send(grant);
  assert.equal(app.commands().filter(([command]) => command === "event").length, 1);
});

test("deduplicates retries while the Google script has not loaded", () => {
  const app = setup();
  for (let retry = 0; retry < 5; retry++) app.send(grant);
  assert.equal(googleScripts(app).length, 1);
  assert.equal(app.commands().filter(([command]) => command === "event").length, 1);
  assert.equal(app.messages.length, 6);
});

test("loads the OpenAI pixel on advertising consent only and measures a signup once", () => {
  const app = setup();
  app.send({ ...grant, consent: { decided: true, analytics: true, advertisement: false } });
  assert.equal(app.scripts.filter((s) => s.src === openaiSdk).length, 0);
  assert.equal(app.window.oaiq, undefined);

  app.send(grant);
  app.send(grant);
  assert.equal(app.scripts.filter((s) => s.src === openaiSdk).length, 1);
  // Objects come from the vm context, so compare serialized forms.
  const calls = oaiqCalls(app).map((call) => JSON.stringify(call));
  // Loaded only after a grant, so the SDK never sees a denial that would drop its click-id cookie.
  assert.equal(calls[0], JSON.stringify(["init", { pixelId: OPENAI_ADS_PIXEL_ID }]));
  assert.equal(calls.filter((c) => c.startsWith('["consent"')).length, 0);
  const measures = calls.filter((call) => call.startsWith('["measure"'));
  assert.equal(measures.length, 1);
  assert.equal(
    measures[0],
    JSON.stringify([
      "measure",
      "registration_completed",
      { type: "customer_action" },
      { event_id: "a1b2c3d4e5f6" },
    ]),
  );
  assert.doesNotMatch(JSON.stringify(calls), /handoff-1|private@example|CurrentClick/);

  // A login, a signup without a server id, or an id with unexpected characters measures nothing.
  app.send({
    ...grant,
    conversion: { id: "handoff-2", event: "login", method: "email", openaiEventId: "ffff" },
  });
  app.send({ ...grant, conversion: { id: "handoff-3", event: "sign_up", method: "email" } });
  app.send({
    ...grant,
    conversion: { id: "handoff-4", event: "sign_up", method: "email", openaiEventId: "bad id!" },
  });
  assert.equal(oaiqCalls(app).filter(([command]) => command === "measure").length, 1);

  // Revoking advertising consent is passed to the SDK, which drops its cookies.
  app.send({
    ...grant,
    consent: { decided: true, analytics: true, advertisement: false },
    conversion: null,
  });
  assert.equal(JSON.stringify(oaiqCalls(app).at(-1)), JSON.stringify(["consent", false]));
});

test("the relay frame uses the same pixel id and SDK as the site", () => {
  assert.ok(script.includes(`openaiPixelId = "${OPENAI_ADS_PIXEL_ID}"`));
  assert.ok(script.includes(`openaiSdkUrl = "${OPENAI_ADS_SDK_URL}"`));
});

test("an ads-only visitor's signup is measured by the pixel and acknowledged without loading Google", () => {
  const app = setup();
  app.send({ ...grant, consent: { decided: true, analytics: false, advertisement: true } });
  assert.equal(googleScripts(app).length, 0);
  assert.equal(oaiqCalls(app).filter(([command]) => command === "measure").length, 1);
  assert.equal(app.messages.length, 2);
  assert.equal(
    JSON.stringify(app.messages[1]?.[0]),
    JSON.stringify({ type: "console-analytics-accepted", id: "handoff-1" }),
  );
});

test("an invalid handoff is neither measured by the pixel nor acknowledged", () => {
  const app = setup();
  app.send({ ...grant, conversion: { ...grant.conversion, id: "" } });
  assert.equal(oaiqCalls(app).filter(([command]) => command === "measure").length, 0);
  assert.equal(app.messages.length, 1);
});

test("an ads-only login or a signup without a pixel id is not acknowledged", () => {
  const app = setup();
  const adsOnly = { decided: true, analytics: false, advertisement: true };
  app.send({
    ...grant,
    consent: adsOnly,
    conversion: { id: "h-login", event: "login", method: "email" },
  });
  app.send({
    ...grant,
    consent: adsOnly,
    conversion: { id: "h-anon", event: "sign_up", method: "email" },
  });
  assert.equal(oaiqCalls(app).filter(([command]) => command === "measure").length, 0);
  assert.equal(app.messages.length, 1);
});
