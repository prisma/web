import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { GoogleTagManager } from "./google-tag-manager";

function browser(cookie = "") {
  const events = new Map<string, (event?: unknown) => void>();
  const requests: { src: string }[] = [];
  const document = {
    cookie,
    addEventListener: (name: string, callback: (event?: unknown) => void) =>
      events.set(name, callback),
    createElement: () => ({}),
    getElementsByTagName: () => [
      { parentNode: { insertBefore: (script: { src: string }) => requests.push(script) } },
    ],
  };
  const context: Record<string, unknown> = { document };
  context.window = context;
  const element = GoogleTagManager({ section: "website" });
  runInNewContext(element.props.dangerouslySetInnerHTML.__html, context);
  return { events, requests, context };
}

test("GTM makes no external requests before a decision or after rejection", () => {
  const { events, requests } = browser();
  assert.equal(requests.length, 0);
  events.get("cookieyes_consent_update")!({ detail: { accepted: ["necessary"] } });
  assert.equal(requests.length, 0);
});

test("an explicit grant loads the container once, including returning visitors", () => {
  const { events, requests } = browser();
  for (let i = 0; i < 2; i++)
    events.get("cookieyes_consent_update")!({ detail: { accepted: ["analytics"] } });
  assert.equal(requests.length, 1);
  assert.match(requests[0].src, /^https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=/);
  assert.equal(
    browser("cookieyes-consent=action:yes,analytics:yes,advertisement:no").requests.length,
    1,
  );
  assert.equal(
    browser("cookieyes-consent=action:yes,analytics:no,advertisement:no").requests.length,
    0,
  );
});
