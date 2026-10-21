import assert from "node:assert/strict";
import { test } from "node:test";
import { Load } from "@prisma/composer";
import app from "../module.ts";

test("the actual web module declares all five website HTTP connections", () => {
  const graph = Load(app);
  const upstreams = ["site", "docs", "blog", "handbook", "eclipse"];
  const services = graph.nodes.filter(({ node }) => node.kind === "service");
  assert.equal(services.length, upstreams.length + 1);
  assert.equal(graph.authoredEdges.length, upstreams.length);
  assert.equal(graph.ports.length, upstreams.length * 2);

  for (const name of upstreams) {
    assert.ok(
      graph.authoredEdges.some(
        ({ from, to }) =>
          from.node === name &&
          from.direction === "out" &&
          from.name === "http" &&
          to.node === "gateway" &&
          to.direction === "in" &&
          to.name === name,
      ),
      `${name}: missing authored HTTP connection`,
    );
    for (const port of [
      { node: name, direction: "out", name: "http", contractKind: "http" },
      { node: "gateway", direction: "in", name, contractKind: "http" },
    ]) {
      assert.ok(
        graph.ports.some(
          ({ node, direction, name, contractKind }) =>
            node === port.node &&
            direction === port.direction &&
            name === port.name &&
            contractKind === port.contractKind,
        ),
      );
    }
  }

  // Console infers Internet entrypoints from services that provide no dependency edge.
  const providers = new Set(graph.authoredEdges.map(({ from }) => from.node));
  assert.deepEqual(
    services.filter(({ id }) => !providers.has(id)).map(({ id }) => id),
    ["gateway"],
  );
});
