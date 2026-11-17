import { test } from "node:test";
import assert from "node:assert/strict";
import { pageContent } from "./page-content";

test("lazy content keeps frontmatter and resolves the body only when requested", async () => {
  let loaded = false;
  const page = {
    title: "Guide",
    getText: async (format: string) => `${format} article`,
    load: async () => {
      loaded = true;
      return { body: "article", toc: ["heading"] };
    },
  };
  assert.equal(loaded, false);
  const content = await pageContent(page);
  assert.equal(loaded, true);
  assert.equal(content.title, "Guide");
  assert.equal(content.body, "article");
  assert.deepEqual(content.toc, ["heading"]);
  assert.equal(await content.getText("processed"), "processed article");
});

test("eager content is returned without copying or changing its shape", async () => {
  const content = { title: "Guide", body: "article" };
  assert.equal(await pageContent(content), content);
});
