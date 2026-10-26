import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { renderFaqAnswer } from "@/lib/faq-answer";

const HOSTING_GUIDE = "https://hipaacomplianthosting.com/blog/hipaa-compliant-app-hosting";

test("third-party FAQ links open in a new tab with nofollow noopener", () => {
  const html = renderToStaticMarkup(
    <>
      {renderFaqAnswer(
        `This third-party [guide to HIPAA compliant app hosting](${HOSTING_GUIDE}) walks through the options.`,
      )}
    </>,
  );

  assert.match(html, /href="https:\/\/hipaacomplianthosting\.com\/blog\/hipaa-compliant-app-hosting"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="nofollow noopener"/);
  assert.match(html, />guide to HIPAA compliant app hosting</);
});

test("Prisma-hosted FAQ links keep their existing attributes", () => {
  const html = renderToStaticMarkup(
    <>{renderFaqAnswer("Audit reports are in the [Prisma Trust Center](https://trust.prisma.io).")}</>,
  );

  assert.match(html, /href="https:\/\/trust\.prisma\.io"/);
  assert.ok(!html.includes("nofollow"));
  assert.ok(!html.includes('target="_blank"'));
});
