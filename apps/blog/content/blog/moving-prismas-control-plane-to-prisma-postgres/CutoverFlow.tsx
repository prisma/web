"use client";

import { Scrolly } from "./Scrolly";

const SERVICES = [
  "Console",
  "Auth",
  "Management API",
  "Marketplaces",
  "MCP server",
  "GitHub webhook",
  "Console on Compute",
];

type Stream = "forward" | "none" | "reverse";

type Frame = {
  moved: number; // how many services sit on Prisma Postgres
  stream: Stream;
  bookmark: boolean;
  rdsStopped: boolean;
  caption: string;
  streamLabel?: string;
};

const FRAMES: Frame[] = [
  {
    moved: 0,
    stream: "forward",
    bookmark: false,
    rdsStopped: false,
    caption: "Every service on RDS. Logical replication keeps Prisma Postgres in sync.",
    streamLabel: "forward replication",
  },
  {
    moved: 0,
    stream: "forward",
    bookmark: true,
    rdsStopped: false,
    caption:
      "Minutes before the merge: a replication slot on Prisma Postgres starts retaining WAL.",
    streamLabel: "forward replication",
  },
  {
    moved: SERVICES.length,
    stream: "forward",
    bookmark: true,
    rdsStopped: false,
    caption:
      "One merge. Each deploy moves one service. Writes that still land on RDS keep flowing.",
    streamLabel: "forward replication, errors must stay 0",
  },
  {
    moved: SERVICES.length,
    stream: "none",
    bookmark: true,
    rdsStopped: false,
    caption: "RDS has gone quiet. Forward replication is dropped.",
  },
  {
    moved: SERVICES.length,
    stream: "reverse",
    bookmark: true,
    rdsStopped: false,
    caption:
      "RDS subscribes to Prisma Postgres from the rollback slot. Rollback is now a config revert.",
    streamLabel: "reverse replication, origin = none",
  },
  {
    moved: SERVICES.length,
    stream: "none",
    bookmark: false,
    rdsStopped: true,
    caption: "A week later: reverse stream dropped, RDS stopped.",
  },
];

function Flow({ step }: { step: number }) {
  const f = FRAMES[step];
  return (
    <figure className="cp-flow-figure">
      <div className="cp-flow" data-stream={f.stream} role="img" aria-label={f.caption}>
        <div className="cp-flow-col" data-stopped={f.rdsStopped ? "true" : undefined}>
          <span className="cp-flow-col-label">RDS</span>
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
        Every service reads and writes RDS. Prisma Postgres is a live replica that has been catching
        up for days. Nothing in production references it yet, so nothing can go wrong yet either.
      </p>
    ),
  },
  {
    id: "bookmark",
    title: "Create the rollback slot",
    body: (
      <p>
        A logical replication slot on the new database, created minutes before the merge and not
        earlier. From this moment it retains every write, so the rollback covers the whole cutover
        window. Creating it earlier would only have pinned WAL for nothing, at roughly a gigabyte an
        hour.
      </p>
    ),
  },
  {
    id: "merge",
    title: "Merge once, deploy seven times",
    body: (
      <p>
        The merge carries the new connection binding and the new secrets together, so within a
        service both database paths switch in the same deployment. Between services there is a skew
        of a few minutes while the deploy jobs run. The forward stream stays up through that window
        and carries the last RDS writes across. The one thing that could go wrong was a row created
        on the new side whose key then arrived from the old side. The apply error counter stayed at
        zero.
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
        RDS. Then we dropped the forward subscription.
      </p>
    ),
  },
  {
    id: "reverse",
    title: "Reverse the stream",
    body: (
      <p>
        RDS now subscribes to Prisma Postgres from the rollback slot, without copying data, since it
        already holds every row. Both databases run Postgres 17, so the subscription can skip rows
        that arrived through replication and send back only what the application wrote. The two
        directions never ran at the same time.
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
        stopped the RDS instances. After that point there is no rollback that keeps data, which is
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
