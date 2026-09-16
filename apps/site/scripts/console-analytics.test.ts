import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const script = readFileSync(new URL("../public/console-analytics.js", import.meta.url), "utf8");
function setup() {
  const messages: unknown[] = [];
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
  conversion: { id: "handoff-1", event: "sign_up", method: "google", email: "private@example.com" },
};

test("ignores untrusted origins and message sources", () => {
  const app = setup();
  app.send(grant, "https://evil.example");
  app.send(grant, "https://console.prisma.io", { postMessage: () => {} });
  assert.equal(app.scripts.length, 0);
  assert.equal(app.commands().filter(([command]) => command === "event").length, 0);
});

test("requires explicit analytics consent before loading Google", () => {
  for (const consent of [undefined, {}, { analytics: true }, { decided: true, analytics: false }]) {
    const app = setup();
    app.send({ ...grant, consent });
    assert.equal(app.scripts.length, 0);
  }
});

test("loads direct gtag once, deduplicates handoffs, and sends only allowlisted fields", () => {
  const app = setup();
  app.send(grant);
  app.send(grant);
  assert.equal(app.scripts.length, 1);
  assert.equal(app.scripts[0]?.src, "https://www.googletagmanager.com/gtag/js?id=G-4B72WBX9ET");
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
  assert.equal(app.scripts.length, 1);
  assert.equal(app.commands().filter(([command]) => command === "event").length, 1);
  assert.equal(app.messages.length, 6);
});
