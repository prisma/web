import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("../", import.meta.url));
function config(composer: boolean) {
  return JSON.parse(
    execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
    const result = {};
    for (const name of ['site', 'docs', 'blog', 'handbook', 'eclipse']) {
      const { default: config } = await import('./apps/' + name + '/next.config.mjs');
      result[name] = { output: config.output, basePath: config.basePath, assetPrefix: config.assetPrefix };
      result[name].routing = { redirects: await config.redirects?.() ?? [], rewrites: await config.rewrites?.() ?? [], headers: await config.headers?.() ?? [] };
      if (name === 'site') result.site.forwards = (await config.rewrites()).beforeFiles.filter(r => /^\\/(docs|blog)(?:[/:.-]|$)/.test(r.source)).length;
    }
    console.log(JSON.stringify(result));
  `,
      ],
      {
        cwd,
        env: {
          ...process.env,
          NODE_ENV: "production",
          COMPOSER_BUILD: composer ? "1" : "",
          NEXT_DOCS_ORIGIN: "https://docs.example",
          NEXT_BLOG_ORIGIN: "https://blog.example",
        },
        encoding: "utf8",
      },
    )
      .trim()
      .split("\n")
      .at(-1)!,
  );
}

test("default production configs preserve Vercel output, paths, and zone rewrites", () => {
  const result = config(false);
  for (const name of ["site", "docs", "blog", "handbook"])
    assert.equal(result[name].output, undefined);
  assert.equal(result.eclipse.output, "export");
  assert.equal(result.eclipse.basePath, undefined);
  assert.equal(result.docs.basePath, "/docs");
  assert.equal(result.blog.basePath, "/blog");
  assert.equal(result.site.forwards, 9);
});

test("Composer builds isolate all five servers and leave cross-zone routing to the gateway", () => {
  const result = config(true);
  for (const name of ["site", "docs", "blog", "handbook", "eclipse"])
    assert.equal(result[name].output, "standalone");
  assert.equal(result.eclipse.basePath, "/eclipse");
  assert.equal(result.eclipse.assetPrefix, "/eclipse-static");
  assert.equal(result.site.forwards, 0);
});

test("Composer preserves each app's declared redirects, headers, and non-zone rewrites", () => {
  const vercel = config(false);
  const composer = config(true);
  for (const name of ["site", "docs", "blog", "handbook", "eclipse"]) {
    assert.deepEqual(composer[name].routing.redirects, vercel[name].routing.redirects, name);
    assert.deepEqual(composer[name].routing.headers, vercel[name].routing.headers, name);
    if (name !== "site") {
      assert.deepEqual(composer[name].routing.rewrites, vercel[name].routing.rewrites, name);
    }
  }
  const rewrites = vercel.site.routing.rewrites;
  rewrites.beforeFiles = rewrites.beforeFiles.filter(
    (rule: { source: string }) => !/^\/(docs|blog)(?:[/:.-]|$)/.test(rule.source),
  );
  assert.deepEqual(composer.site.routing.rewrites, rewrites);
});
