import assert from "node:assert/strict";
import test from "node:test";
import { getAnswerEntries, renderAnswerMarkdown } from "./answer-page-content";
import { buildLlmsFullContent, buildLlmsIndexContent } from "../app/llms-content";
import { answerProductIds, answerProducts, getAnswerProduct } from "./answer-products";
import { getBaseUrl } from "./url";

test("every answer is discoverable with its Markdown URL and full FAQ content", () => {
  const entries = getAnswerEntries();
  assert.ok(entries.length > 0);
  const index = buildLlmsIndexContent();
  const full = buildLlmsFullContent();

  for (const entry of entries) {
    assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(
      ![
        "/postgres/guides",
        "/postgres/hipaa",
        "/postgres/free-postgresql-hosting",
        "/compute/guides",
      ].includes(entry.url),
      "answer collides with a static route",
    );
    assert.ok(index.includes(`${entry.url}.md`), `missing Markdown discovery for ${entry.url}`);
    assert.ok(full.includes(entry.data.title));
    for (const faq of entry.data.faq) {
      assert.ok(full.includes(faq.question));
      assert.ok(full.includes(faq.answer));
    }
  }
});

test("product collections partition discovery and register their guide indexes", () => {
  const index = buildLlmsIndexContent();
  const entries = getAnswerEntries();
  const collectedUrls: string[] = [];
  for (const product of answerProductIds) {
    const config = getAnswerProduct(product);
    assert.equal(config, answerProducts[product]);
    assert.ok(index.includes(new URL(config.guidesPath, getBaseUrl()).toString()));
    const productEntries = getAnswerEntries(product);
    assert.ok(productEntries.length > 0, `empty ${product} collection`);
    for (const entry of productEntries) {
      assert.equal(entry.product, product);
      assert.ok(entry.url.startsWith(`${config.path}/`));
      collectedUrls.push(entry.url);
    }
  }
  assert.deepEqual(collectedUrls.sort(), entries.map((entry) => entry.url).sort());
  assert.equal(new Set(collectedUrls).size, collectedUrls.length);
  assert.throws(() => getAnswerProduct("orm"), /Unknown answer-page product/);
  assert.throws(() => getAnswerProduct("__proto__"), /Unknown answer-page product/);
});

test("answer Markdown preserves the decision and custom diagram's meaning", () => {
  for (const entry of getAnswerEntries()) {
    const markdown = renderAnswerMarkdown(entry);
    assert.equal((markdown.match(/^# /gm) ?? []).length, 1);
    assert.ok(markdown.includes(entry.data.summary));
    assert.ok(!/<[A-Z][^>]*\/>/.test(markdown), "custom visual needs a Markdown equivalent");
    if (entry.content.includes("<EnvironmentDiagram")) {
      assert.ok(markdown.includes("synthetic records"));
      assert.ok(markdown.includes("customer database"));
    }
    for (const { title, href } of entry.data.related)
      assert.ok(markdown.includes(`[${title}](${href})`));
  }
});
