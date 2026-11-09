import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createProxy, type Diagnostic, type SiteDefinition } from "./index.ts";
import { vercel } from "./vercel.ts";

function fixtures(t: import("node:test").TestContext) {
  const directory = mkdtempSync(join(tmpdir(), "proxy-runtime-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return (name: string, value: unknown) => {
    const file = join(directory, name);
    writeFileSync(file, JSON.stringify(value));
    return file;
  };
}
const options = {
  origins: { root: "http://root.test", docs: "http://docs.test" },
  fetch: async (url: string | URL) => new Response(String(url)),
};
const request = (path: string) => new Request(`https://public.test${path}`);

test("file-backed sites load at boot and use a snapshot until the next boot", async (t) => {
  const file = fixtures(t);
  const rootFile = file("root.json", {});
  rmSync(rootFile);
  // Declaring the adapter does not read files or compile rules.
  const root = vercel(pathToFileURL(rootFile));
  file("root.json", {
    redirects: [{ source: "/docs/parent", destination: "/home", permanent: true }],
  });
  const docsFile = file("docs.json", {
    redirects: [{ source: "/old", destination: "/first", permanent: true }],
    headers: [{ source: "/:path*", headers: [{ key: "x-docs", value: "yes" }] }],
  });
  const sites = [
    { name: "root", mount: "/", routing: root },
    { name: "docs", mount: "/docs", routing: vercel(docsFile) },
  ];
  const handler = createProxy(sites, options);
  file("docs.json", {
    redirects: [{ source: "/old", destination: "/second", permanent: true }],
  });
  const restarted = createProxy(sites, options);
  rmSync(rootFile);
  rmSync(docsFile);
  for (const [proxy, destination] of [
    [handler, "first"],
    [restarted, "second"],
  ] as const) {
    for (let count = 0; count < 2; count++) {
      const response = await proxy(request("/docs/old?ref=a&ref=b"));
      assert.equal(
        response.headers.get("location"),
        `https://public.test/docs/${destination}?ref=a&ref=b`,
      );
      assert.equal(response.status, 308);
    }
    assert.equal(
      (await proxy(request("/docs/parent"))).headers.get("location"),
      "https://public.test/home",
    );
    assert.equal(await (await proxy(request("/old"))).text(), "http://root.test/old");
  }
  assert.equal((await handler(request("/docs/page"))).headers.get("x-docs"), "yes");
  assert.throws(() => createProxy(sites, options), /Site root.*root\.json/);
});

test("Next manifest files preserve framework precedence and are read only at boot", async (t) => {
  const file = fixtures(t);
  const config = file("vercel.json", {});
  const manifest = file("routes-manifest.json", {
    redirects: [{ source: "/docs/legacy", destination: "https://legacy.test/docs/legacy" }],
    rewrites: {
      beforeFiles: [
        {
          source: "/:path*",
          destination: "https://speed.test/:path*",
          has: [{ type: "host", value: "speed.public.test" }],
        },
      ],
    },
  });
  const handler = createProxy(
    [
      { name: "root", mount: "/", routing: vercel(config, { nextjs: pathToFileURL(manifest) }) },
      { name: "docs", mount: "/docs", routing: vercel({}) },
    ],
    options,
  );
  rmSync(config);
  rmSync(manifest);
  assert.equal(
    await (await handler(request("/docs/legacy"))).text(),
    "http://root.test/docs/legacy",
  );
  assert.equal(
    await (await handler(new Request("https://speed.public.test/docs/page"))).text(),
    "http://root.test/docs/page",
  );
  assert.equal(await (await handler(request("/docs/page"))).text(), "http://docs.test/docs/page");
});

test("missing, invalid, and unsupported files fail startup with site and file context", (t) => {
  const file = fixtures(t);
  const config = file("vercel.json", {});
  const boot = () => createProxy([{ name: "root", mount: "/", routing: vercel(config) }], options);
  writeFileSync(config, "{");
  assert.throws(boot, /Site root.*vercel\.json/);
  file("vercel.json", null);
  assert.throws(boot, /Site root.*JSON object.*vercel\.json/);
  file("vercel.json", { version: 3, routes: [{ handle: "miss" }] });
  assert.throws(boot, /Site root.*unsupported phase miss/);
  file("vercel.json", {});
  const manifest = file("routes-manifest.json", []);
  assert.throws(
    () =>
      createProxy(
        [{ name: "root", mount: "/", routing: vercel(config, { nextjs: manifest }) }],
        options,
      ),
    /Site root.*JSON object.*routes-manifest\.json/,
  );
  rmSync(config);
  assert.throws(boot, /Site root.*vercel\.json.*ENOENT/);
});

test("provider compilation and diagnostics run once per proxy instance", async () => {
  let boots = 0;
  const diagnostic: Diagnostic = {
    site: "root",
    provider: "example",
    code: "notice",
    message: "boot",
  };
  const site: SiteDefinition = {
    name: "root",
    mount: "/",
    routing: {
      name: "example",
      compile: () => {
        boots++;
        return { routes: [], diagnostics: [diagnostic] };
      },
    },
  };
  const diagnostics: Diagnostic[] = [];
  const handler = createProxy([site], {
    ...options,
    onDiagnostic: (item) => diagnostics.push(item),
  });
  await handler(request("/one"));
  await handler(request("/two"));
  assert.equal(boots, 1);
  assert.deepEqual(diagnostics, [diagnostic]);
});
