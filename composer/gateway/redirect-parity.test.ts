import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { stringify } from "node:querystring";
import site from "../../apps/site/vercel.json" with { type: "json" };
import docs from "../../apps/docs/vercel.json" with { type: "json" };
import { createProxy } from "@prisma/proxy";
import { vercel, type VercelConfig } from "@prisma/proxy/vercel";
import { gatewaySites } from "./config.ts";
type Redirect = NonNullable<VercelConfig["redirects"]>[number];

// Compare against the framework's real path/condition/destination compiler,
// rather than deriving expected destinations with the gateway implementation.
const require = createRequire(new URL("../../apps/site/package.json", import.meta.url));
const { getPathMatch } = require("next/dist/shared/lib/router/utils/path-match");
const { prepareDestination } = require("next/dist/shared/lib/router/utils/prepare-destination");

function queryValues(url: URL) {
  return Object.fromEntries(
    [...new Set(url.searchParams.keys())].sort().map((key) => [key, url.searchParams.getAll(key)]),
  );
}

test("every imported Vercel redirect agrees with Next's destination compiler", async () => {
  const fetch = async () => new Response("no redirect");
  const origins = Object.fromEntries(
    ["site", "docs", "blog", "handbook", "eclipse", "test"].map((name) => [
      name,
      `http://${name}.test`,
    ]),
  );
  const aggregateProxy = createProxy(
    gatewaySites(new URL("../../apps/", import.meta.url), {}, []),
    {
      origins,
      fetch,
    },
  );
  const rules: Redirect[] = [...site.redirects, ...docs.redirects];
  const compiled = rules.map((rule) => {
    // These two rules are aliases relative to the docs project's mount; the
    // rest of that table already contains full public paths and destinations.
    const mounted =
      docs.redirects.includes(rule as (typeof docs.redirects)[number]) &&
      !rule.source.startsWith("/docs")
        ? { ...rule, source: `/docs${rule.source}`, destination: `/docs${rule.destination}` }
        : rule;
    return { rule, mounted, matches: getPathMatch(mounted.source) };
  });
  let fragments = 0;
  for (const { rule, mounted, matches } of compiled) {
    const pathname = mounted.source
      .replace(/:([A-Za-z0-9_]+)([*+?]?)/g, (_, name: string, modifier: string) =>
        modifier === "*" || modifier === "+" ? "legacy/nested" : name === "page" ? "2" : "legacy",
      )
      .replace("(fullstack)", "fullstack");
    for (const query of ["", "?ref=one&ref=two&value=a%2Fb&empty="]) {
      const url = new URL(`https://web.example${pathname}${query}`);
      const params = matches(url.pathname);
      if (mounted.source.includes("#")) {
        // Fragments never reach an HTTP server. Preserve these pre-existing
        // rules without pretending they can match browser requests.
        assert.equal(params, false, rule.source);
        const isolated = createProxy(
          [{ name: "test", mount: "/", routing: vercel({ redirects: [mounted] }) }],
          { origins, fetch },
        );
        assert.equal((await isolated(new Request(url))).status, 200, rule.source);
        continue;
      }
      assert.ok(params, `fixture must exercise ${rule.source}`);
      const inputQuery = Object.fromEntries(
        [...new Set(url.searchParams.keys())].map((key) => [key, url.searchParams.getAll(key)]),
      );
      const { parsedDestination } = prepareDestination({
        appendParamsToQuery: false,
        destination: mounted.destination,
        params,
        query: inputQuery,
      });
      const expected = new URL(
        `${parsedDestination.pathname}?${stringify(parsedDestination.query)}${parsedDestination.hash ?? ""}`,
        parsedDestination.origin ?? url.origin,
      );
      const isolated = createProxy(
        [{ name: "test", mount: "/", routing: vercel({ redirects: [mounted] }) }],
        { origins, fetch },
      );
      const actual = await isolated(new Request(url));
      assert.ok(actual.headers.get("location"), `gateway must match ${rule.source}`);
      const location = new URL(actual.headers.get("location")!);
      assert.equal(location.origin, expected.origin, rule.source);
      assert.equal(location.pathname, expected.pathname, rule.source);
      assert.equal(location.hash, expected.hash, rule.source);
      assert.deepEqual(queryValues(location), queryValues(expected), rule.source);
      assert.equal(actual.status, rule.statusCode ?? (rule.permanent ? 308 : 307), rule.source);
      // Exercise the complete tables too: overlapping wildcard rules must
      // retain their original first-match precedence.
      const first = compiled.find((candidate) => candidate.matches(url.pathname));
      assert.ok(first);
      const firstDestination = prepareDestination({
        appendParamsToQuery: false,
        destination: first.mounted.destination,
        params: first.matches(url.pathname),
        query: inputQuery,
      }).parsedDestination;
      const expectedFirst = new URL(
        `${firstDestination.pathname}?${stringify(firstDestination.query)}${firstDestination.hash ?? ""}`,
        firstDestination.origin ?? url.origin,
      );
      const aggregate = await aggregateProxy(new Request(url));
      assert.ok(aggregate.headers.get("location"), rule.source);
      const aggregateLocation = new URL(aggregate.headers.get("location")!);
      assert.equal(
        aggregateLocation.origin + aggregateLocation.pathname + aggregateLocation.hash,
        expectedFirst.origin + expectedFirst.pathname + expectedFirst.hash,
        rule.source,
      );
      assert.deepEqual(queryValues(aggregateLocation), queryValues(expectedFirst), rule.source);
      assert.equal(
        aggregate.status,
        first.rule.statusCode ?? (first.rule.permanent ? 308 : 307),
        rule.source,
      );
    }
    if (mounted.source.includes("#")) fragments++;
  }
  console.log(
    `Verified ${rules.length - fragments} reachable Vercel redirect rules and ${fragments} unreachable fragment sources`,
  );
});
