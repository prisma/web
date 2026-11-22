import assert from "node:assert/strict";
import test from "node:test";
import {
  APP_PROFILES,
  computeCost,
  computeUsage,
  estimate,
  itemize,
  PLANS,
  priceAllPlans,
  type AppProfileId,
} from "./calc";

const plan = (id: string) => PLANS.find((p) => p.id === id)!;
const profile = (id: AppProfileId) => APP_PROFILES.find((p) => p.id === id)!;
const close = (actual: number, expected: number) =>
  assert.ok(Math.abs(actual - expected) < 0.0001, `${actual} != ${expected}`);

// The docs' worked examples price every meter from zero; on a paid plan the
// included requests cover the request line, so compare memory + CPU + bandwidth.
test("app profiles reproduce the Compute pricing docs' worked examples", () => {
  const agent = computeCost(
    plan("starter"),
    computeUsage({ requests: 10_000, profile: profile("agent") }),
  );
  close(agent.memory, 0.5);
  close(agent.cpu, 0.5333);
  close(agent.bandwidth, 0.125);
  close(agent.requests, 0);

  const files = computeCost(
    plan("starter"),
    computeUsage({ requests: 50_000, profile: profile("files") }),
  );
  close(files.memory + files.cpu + files.bandwidth, 0.025 + 0.0267 + 5);

  const api = computeCost(
    plan("starter"),
    computeUsage({ requests: 10_000, profile: profile("api") }),
  );
  close(api.memory + api.cpu + api.bandwidth, 0.005 + 0.0107 + 0.0063);
});

test("requests beyond the plan's allowance bill at $1 per million", () => {
  const usage = computeUsage({ requests: 7_000_000, profile: profile("api") });
  close(computeCost(plan("starter"), usage).requests, 2); // 5M included
  close(computeCost(plan("pro"), usage).requests, 0); // 20M included
});

test("Free has no Compute charges and goes unavailable above its limits", () => {
  const small = computeUsage({ requests: 100_000, profile: profile("api") });
  const free = estimate(plan("free"), 200_000, 0.5, small);
  assert.equal(free.eligible, true);
  assert.equal(free.total, 0);

  // 300K API requests = 5 vCPU-hours, over Free's 4.
  const over = computeUsage({ requests: 300_000, profile: profile("api") });
  assert.equal(estimate(plan("free"), 200_000, 0.5, over).eligible, false);
});

test("database only leaves the Postgres-only estimate unchanged", () => {
  const none = computeUsage({ requests: 5_000_000, profile: profile("none") });
  for (const p of PLANS) {
    assert.equal(estimate(p, 3_000_000, 12, none).total, estimate(p, 3_000_000, 12).total);
  }
});

test("each plan's total is its Postgres total plus its Compute total", () => {
  const usage = computeUsage({ requests: 2_000_000, profile: profile("agent") });
  for (const e of priceAllPlans(3_000_000, 12, usage)) {
    close(e.total, e.postgresTotal + e.compute.total);
  }
});

test("the bill itemizes each meter, and on Free flags the limits it exceeds", () => {
  const usage = computeUsage({ requests: 300_000, profile: profile("api") });

  const starter = itemize(plan("starter"), 2_000_000, 8, usage);
  assert.deepEqual(
    starter.compute.map((l) => [l.label, l.status]),
    [
      ["Requests", "included"],
      ["Memory", "charged"],
      ["CPU", "charged"],
      ["Bandwidth", "charged"],
    ],
  );
  assert.equal(starter.compute[0].detail, "300K of 5M included");
  assert.equal(starter.postgres[0].detail, "1M extra × $8 per million");
  close(starter.postgres[0].amount, 8);
  assert.equal(starter.postgres[1].detail, "8 GB of 10 GB included");

  // 300K API requests = 5 vCPU-hours, over Free's 4; 2M ops is over its 200K.
  const free = itemize(plan("free"), 2_000_000, 1, usage);
  assert.deepEqual(
    [...free.compute, ...free.postgres]
      .filter((l) => l.status === "over-limit")
      .map((l) => l.label),
    ["CPU", "Operations"],
  );
});
