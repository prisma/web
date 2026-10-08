"use client";

import { Scrolly } from "./Scrolly";

const SERVICES = [
  "Console",
  "Auth",
  "Management API",
  "Marketplaces",
  "MCP server",
  "GitHub webhook",
];

type Stream = "forward" | "none" | "reverse";

type Frame = {
  moved: number; // how many services sit on Prisma Postgres
  stream: Stream;
  bookmark: boolean;
  rdsStopped: boolean;
  caption: string;
  streamLabel?: string;
  rdsNote?: string;
};

const FRAMES: Frame[] = [
  {
    moved: 0,
    stream: "forward",
    bookmark: false,
    rdsStopped: false,
    caption: "Every service writes to RDS, and logical replication keeps Prisma Postgres in sync.",
    streamLabel: "forward replication",
  },
  {
    moved: 0,
    stream: "forward",
    bookmark: true,
    rdsStopped: false,
    caption: "Minutes before the merge, a rollback slot on Prisma Postgres starts retaining WAL.",
    streamLabel: "forward replication",
  },
  {
    moved: SERVICES.length,
    stream: "forward",
    bookmark: true,
    rdsStopped: false,
    caption:
      "One merge, six deploys. Writes that still land on RDS keep flowing across the stream.",
    streamLabel: "forward replication, apply errors stay at 0",
  },
  {
    moved: SERVICES.length,
    stream: "none",
    bookmark: true,
    rdsStopped: false,
    caption: "RDS has gone quiet, so the forward subscription is dropped.",
    rdsNote: "no application traffic",
  },
  {
    moved: SERVICES.length,
    stream: "reverse",
    bookmark: true,
    rdsStopped: false,
    caption:
      "RDS now subscribes to Prisma Postgres from the rollback slot, so rollback is a config revert.",
    streamLabel: "reverse replication, origin = none",
    rdsNote: "live replica, ready for rollback",
  },
  {
    moved: SERVICES.length,
    stream: "none",
    bookmark: false,
    rdsStopped: true,
    caption: "A week later the reverse stream is dropped and RDS is stopped.",
    rdsNote: "final snapshot taken",
  },
];

function Flow({ step }: { step: number }) {
  const f = FRAMES[step];
  return (
    <figure className="cp-flow-figure">
      <div className="cp-flow" data-stream={f.stream} role="img" aria-label={f.caption}>
        <div className="cp-flow-col" data-stopped={f.rdsStopped ? "true" : undefined}>
          <span className="cp-flow-col-label">RDS</span>
          {f.rdsNote ? <span className="cp-flow-col-note">{f.rdsNote}</span> : null}
        </div>
        <div className="cp-flow-col cp-flow-col-target">
          <span className="cp-flow-col-label">Prisma Postgres</span>
          <span className="cp-flow-bookmark" data-on={f.bookmark ? "true" : undefined}>
            rollback slot
          </span>
        </div>
        <div className="cp-flow-stream" aria-hidden="true">
          <span className="cp-flow-arrow" />
        </div>
        <ul className="cp-flow-services">
          {SERVICES.map((name, i) => (
            <li
              key={name}
              className="cp-flow-service"
              data-side={i < f.moved ? "ppg" : "rds"}
              style={{ transitionDelay: step === 2 ? `${i * 140}ms` : "0ms" }}
            >
              {name}
            </li>
          ))}
        </ul>
        <span className="cp-flow-stream-label" aria-hidden="true">
          {f.streamLabel ?? ""}
        </span>
      </div>
      <figcaption className="cp-grid-caption">
        <span>{f.caption}</span>
      </figcaption>
    </figure>
  );
}

const STEPS = [
  {
    id: "before",
    title: "Before the merge",
    body: (
      <p>
        Every service reads and writes RDS while Prisma Postgres follows along as a live replica.
        Nothing in production references the new database yet, so a problem on the new side cannot
        reach a user.
      </p>
    ),
  },
  {
    id: "bookmark",
    title: "Create the rollback slot",
    body: (
      <p>
        Minutes before the merge we create a logical replication slot on the new database. From this
        moment it retains every write, so the rollback covers the whole cutover window. Creating it
        any earlier would have pinned WAL for nothing, at roughly a gigabyte an hour.
      </p>
    ),
  },
  {
    id: "merge",
    title: "Merge once, deploy six services",
    body: (
      <p>
        The merge carries the new connection binding and the new secrets together, so within each
        service both database paths switch in the same deployment. Between services there is a skew
        of a few minutes while the deploy jobs run, and the forward stream stays up through that
        window to carry the last RDS writes across. The apply error counter, which would have caught
        a key collision, stayed at zero.
      </p>
    ),
  },
  {
    id: "quiet",
    title: "Wait for RDS to go quiet",
    body: (
      <p>
        We watched the number of active application sessions on RDS fall to zero and the newest row
        timestamps stop advancing there. Seven minutes after the merge the last statement ran on
        RDS, a later sixty-second sample of its write counters showed nothing, and only then did we
        drop the forward subscription.
      </p>
    ),
  },
  {
    id: "reverse",
    title: "Reverse the stream",
    body: (
      <p>
        RDS now subscribes to Prisma Postgres from the rollback slot without copying data, since it
        already holds every row. With <code>origin = none</code> the subscription skips the rows
        that arrived through forward replication and sends back only what the application wrote, and
        the two directions never run at the same time.
      </p>
    ),
  },
  {
    id: "week",
    title: "Hold for a week, then let go",
    body: (
      <p>
        For a week, rollback meant reverting one commit and a handful of secrets. After a final
        parity check on the key tables we dropped the reverse subscription, took a snapshot, and
        stopped the RDS instances. Past that point there is no rollback that keeps data, so that is
        the moment to be sure.
      </p>
    ),
  },
];

export function CutoverFlow() {
  return (
    <Scrolly
      label="How the cutover and rollback window worked"
      steps={STEPS}
      visual={(active) => <Flow step={active} />}
    />
  );
}
