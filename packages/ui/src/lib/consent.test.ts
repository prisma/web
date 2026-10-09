import assert from "node:assert/strict";
import { test } from "node:test";
import { readStoredConsentStatus } from "./consent";

test("reads a stored CookieYes decision per category", () => {
  const cookie =
    "other=1; cookieyes-consent=consentid:abc,consent:yes,action:yes,necessary:yes,analytics:yes,advertisement:no";
  assert.equal(readStoredConsentStatus("analytics", cookie), "granted");
  assert.equal(readStoredConsentStatus("advertisement", cookie), "denied");
});

test("an undecided, missing or malformed cookie is pending", () => {
  assert.equal(readStoredConsentStatus("analytics", ""), "pending");
  assert.equal(
    readStoredConsentStatus("analytics", "cookieyes-consent=consent:no,action:no,analytics:yes"),
    "pending",
  );
  assert.equal(
    readStoredConsentStatus("analytics", "cookieyes-consent=action:yes,analytics"),
    "pending",
  );
});
