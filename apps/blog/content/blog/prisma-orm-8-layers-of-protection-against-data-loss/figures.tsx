import type { ReactNode } from "react";
import { highlight, type HighlightedCode } from "codehike/code";
import {
  GuardFigure,
  type DbState,
  type GuardStep,
  type TermLine,
  type TrackItem,
} from "./GuardFigure";
import { LayerMap, type Layer } from "./LayerMap";
import { TRACK_STATE_TEXT } from "./trackState";

/* ---------------------------------------------------------------------------
   Interactive figures for this post. Every terminal line below is output from
   a disposable PostgreSQL 17 database (CLI 8.0.0-rc.34, toolchain
   8.0.0-rc.24-dev.34), shortened with […] where a line runs long. The database
   tables are schematic: three rows stand in for the real data.
--------------------------------------------------------------------------- */

type Mark = { line: number; tone?: "add" | "focus" | "stop" };

type StepSource = Omit<GuardStep, "code"> & {
  source?: string;
  lang?: string;
  marks?: Mark[];
};

async function toCode(source: string, lang: string, marks: Mark[] = []): Promise<HighlightedCode> {
  const code = (await highlight(
    { value: source, lang, meta: "" },
    "github-from-css",
  )) as HighlightedCode;
  return {
    ...code,
    annotations: marks.map((m) => ({
      name: "mark",
      query: m.tone ?? "focus",
      fromLineNumber: m.line,
      toLineNumber: m.line,
    })),
  };
}

async function toSteps(sources: StepSource[]): Promise<GuardStep[]> {
  return Promise.all(
    sources.map(async ({ source, lang, marks, ...step }) => ({
      ...step,
      code: source && lang ? await toCode(source, lang, marks) : undefined,
    })),
  );
}

// Each static fallback hides the interactive figures itself, so it never
// depends on another figure being on the page.
const HIDE_INTERACTIVE = `.guard, .layers { display: none; }`;

// Without JavaScript the figure cannot change step, so the same steps are
// listed in full instead.
function StaticSteps({ label, steps }: { label: string; steps: StepSource[] }) {
  return (
    <noscript>
      <style>{HIDE_INTERACTIVE}</style>
      <figure className="guard-static not-prose" aria-label={label}>
        <ol>
          {steps.map((s) => (
            <li key={s.title}>
              <p>
                <strong>{s.title}.</strong> <em>{s.verdictLabel}.</em> {s.caption}
              </p>
              {s.source && <pre>{s.source}</pre>}
              {s.terminal && (
                <pre>
                  {s.terminal.map((l) => (l.kind === "cmd" ? `$ ${l.text}` : l.text)).join("\n")}
                </pre>
              )}
              {s.track && (
                <ul>
                  {s.track.map((item) => (
                    <li key={item.label}>
                      {item.label}: {TRACK_STATE_TEXT[item.state]}
                    </li>
                  ))}
                </ul>
              )}
              {s.db && (
                <table>
                  <caption>
                    {s.db.table}: {s.db.note}
                  </caption>
                  <thead>
                    <tr>
                      {s.db.columns.map((col) => (
                        <th key={col.name} scope="col">
                          {col.name}
                          {col.state ? ` (${col.state})` : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.db.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, n) => (
                          <td key={n}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </li>
          ))}
        </ol>
      </figure>
    </noscript>
  );
}

async function Figure({
  label,
  steps,
  mode,
}: {
  label: string;
  steps: StepSource[];
  mode?: "steps" | "cases";
}) {
  return (
    <>
      <GuardFigure label={label} steps={await toSteps(steps)} mode={mode} />
      <StaticSteps label={label} steps={steps} />
    </>
  );
}

const c = (text: string): ReactNode => <code>{text}</code>;

/* ---------------------------------------------------------------------------
   1. Where each check sits
--------------------------------------------------------------------------- */

const LAYERS: Layer[] = [
  {
    name: "Commands",
    heading: "The reset commands are gone",
    risk: "A reset, or a shadow database pointed at live data, empties every table.",
    check:
      "Nothing to check. No migration command resets or drops a database you connect to, and Prisma 7 commands stop with CLI.V7_COMMAND.",
    setup: "Automatic",
    effect: "Not available",
    remains: "Raw SQL, the Prisma 7 CLI, and anything else that holds the connection string.",
  },
  {
    name: "Plan",
    heading: "Data loss needs a named decision",
    risk: "A renamed field is planned as a dropped column and a new, empty one.",
    check:
      "Whether every change that could lose data has been resolved by name, with --rename, --delete or --convert. --yes cannot answer.",
    setup: "Automatic",
    effect: "Blocks",
    remains: "Who makes the decision. An agent can pass --delete itself.",
  },
  {
    name: "Review",
    heading: "Destructive operations are labeled",
    risk: "A dropped column hides among the other changes in a pull request.",
    check:
      "Each operation carries a class. migration show and the dry run mark the destructive ones.",
    setup: "Automatic",
    effect: "Warns",
    remains: "Reading it. An approved deletion still runs, and db migrate does not ask again.",
  },
  {
    name: "Integrity",
    heading: "The reviewed migration is the one that runs",
    risk: "A migration is edited after it was reviewed.",
    check:
      "migration check and db migrate recompute the hash of the compiled migration and compare it with the recorded one.",
    setup: "Automatic",
    effect: "Blocks",
    remains: "The source migration.ts is not hashed. Review the compiled result after a recompile.",
  },
  {
    name: "Policy",
    heading: "The database refuses what it shouldn't accept",
    risk: "A development command, or a migration that drops data, reaches production.",
    check:
      "The policies recorded in the database: which commands may change it, and whether it may lose data at all.",
    setup: "Declare a policy",
    effect: "Blocks",
    remains:
      "Direct SQL access, and hand-written SQL steps that carry the wrong class. The CLI enforces this, not the database.",
  },
  {
    name: "Apply",
    heading: "Assumptions are checked before each operation",
    risk: "The database is no longer in the state the migration was written for.",
    check:
      "The recorded schema state, then a precheck and a postcheck around every operation. On PostgreSQL the run is one transaction.",
    setup: "Automatic",
    effect: "Blocks",
    remains: "Application instances still reading the old schema. That takes a staged rollout.",
  },
];

export function ProtectionLayers() {
  return (
    <>
      <LayerMap
        label="Where each check sits between a schema edit and the database"
        layers={LAYERS}
      />
      <noscript>
        <style>{HIDE_INTERACTIVE}</style>
        <figure className="guard-static not-prose">
          <ol>
            {LAYERS.map((l) => (
              <li key={l.name}>
                <p>
                  <strong>{l.heading}.</strong>{" "}
                  <em>
                    {l.setup}, {l.effect.toLowerCase()}.
                  </em>{" "}
                  {l.risk} {l.check} What it leaves to you: {l.remains}
                </p>
              </li>
            ))}
          </ol>
        </figure>
      </noscript>
    </>
  );
}

/* ---------------------------------------------------------------------------
   2. An agent tries to reset the database
--------------------------------------------------------------------------- */

const USERS = [
  ["1", "ada@example.com", "ada"],
  ["2", "lin@example.com", "lin"],
  ["3", "sam@example.com", "sam"],
];

const usersIntact = (note: string, tone: DbState["tone"] = "info"): DbState => ({
  table: "User",
  note,
  tone,
  columns: [{ name: "id" }, { name: "email" }, { name: "username" }],
  rows: USERS,
});

const RESET_CMD: TermLine = { kind: "cmd", text: "npx prisma migrate reset --force" };
const RESET_ERROR: TermLine[] = [
  {
    kind: "err",
    text: "✘ [CLI.V7_COMMAND] `prisma migrate reset` is a Prisma 7 command and is not available in Prisma 8",
  },
  {
    kind: "why",
    text: "  why: Prisma 8 has no reset: `db update` moves the database to the contract without a reset and asks before losing data […]",
  },
];
const RESET_NEXT: TermLine[] = [
  { kind: "next", text: "→ Use the replacement: prisma db update" },
  { kind: "next", text: "→ Read its help: prisma db update --help" },
];

const resetTrack = (states: TrackItem["state"][]): TrackItem[] =>
  [
    "Agent proposes a reset",
    "Prisma reads the command",
    "Command refused, exit code 2",
    "Database unchanged",
  ].map((label, i) => ({ label, state: states[i] }));

const RESET_STEPS: StepSource[] = [
  {
    title: "Agent proposes",
    verdict: "info",
    verdictLabel: "Proposed",
    caption: (
      <>
        A migration failed, and the agent reaches for a clean slate. On Prisma ORM 7 this command
        drops the database and replays every migration into empty tables. {c("--force")} skips the
        confirmation.
      </>
    ),
    terminal: [
      { kind: "note", text: "# agent: the migration history has drifted, resetting to recover" },
      RESET_CMD,
    ],
    track: resetTrack(["now", "todo", "todo", "todo"]),
    db: usersIntact("3 rows"),
  },
  {
    title: "Prisma refuses",
    verdict: "blocked",
    verdictLabel: "Not available",
    caption: (
      <>
        Prisma ORM 8 has no reset to run. The command exits with code 2 and the rows are as they
        were. This needs no setup.
      </>
    ),
    terminal: [
      RESET_CMD,
      ...RESET_ERROR,
      ...RESET_NEXT.map((l) => ({ ...l, kind: "dim" as const })),
    ],
    track: resetTrack(["done", "done", "stop", "done"]),
    db: usersIntact("3 rows, unchanged", "allowed"),
  },
  {
    title: "The way forward",
    verdict: "allowed",
    verdictLabel: "Next step",
    caption: (
      <>
        The error offers a repair, not a reset. {c("db update")} moves the database to match the
        schema and asks before any change that would lose data. An agent that follows the error ends
        up on the safe path.
      </>
    ),
    terminal: [
      RESET_CMD,
      ...RESET_ERROR.map((l) => ({ ...l, kind: "dim" as const })),
      ...RESET_NEXT,
    ],
    track: resetTrack(["done", "done", "stop", "done"]),
    db: usersIntact("3 rows, unchanged", "allowed"),
  },
  {
    title: "What gets through",
    verdict: "gap",
    verdictLabel: "Not covered",
    caption: (
      <>
        Prisma only sees Prisma commands. An agent that holds the connection string can still run
        SQL directly, or install the Prisma 7 CLI and reset there. Keeping production credentials
        out of the agent's environment is what closes this.
      </>
    ),
    terminal: [
      { kind: "cmd", text: `psql "$DATABASE_URL" -c 'DROP TABLE "User"'` },
      { text: "DROP TABLE" },
    ],
    track: [
      { label: "Agent runs SQL directly", state: "done" },
      { label: "Prisma is not involved", state: "skip" },
      { label: "Table dropped", state: "lost" },
    ],
    db: {
      table: "User",
      note: "dropped",
      tone: "blocked",
      columns: [
        { name: "id", state: "lost" },
        { name: "email", state: "lost" },
        { name: "username", state: "lost" },
      ],
      rows: USERS,
    },
  },
];

export function ResetAttempt() {
  return <Figure label="An agent tries to reset the database" steps={RESET_STEPS} />;
}

/* ---------------------------------------------------------------------------
   3. A rename, from schema edit to planned migration
--------------------------------------------------------------------------- */

const SCHEMA_BEFORE = `model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  username String
}`;

const SCHEMA_AFTER = `model User {
  id     Int    @id @default(autoincrement())
  email  String @unique
  handle String
}`;

const RENAME_STEPS: StepSource[] = [
  {
    title: "Start",
    verdict: "info",
    verdictLabel: "Starting point",
    caption: <>A {c("User")} table with three rows. Every row has a username.</>,
    filename: "contract.prisma",
    source: SCHEMA_BEFORE,
    lang: "prisma",
    marks: [{ line: 4 }],
    terminal: [{ kind: "note", text: "# nothing has run yet" }],
    db: usersIntact("3 rows"),
  },
  {
    title: "Rename the field",
    verdict: "info",
    verdictLabel: "Schema edited",
    caption: (
      <>
        The schema now says {c("handle")}. The database still has {c("username")}. To a diff, that
        is one column gone and one column new.
      </>
    ),
    filename: "contract.prisma",
    source: SCHEMA_AFTER,
    lang: "prisma",
    marks: [{ line: 4, tone: "add" }],
    terminal: [
      { kind: "cmd", text: "npx prisma contract emit" },
      { kind: "ok", text: "✔ Emitted contract.json and contract.d.ts" },
    ],
    db: usersIntact("3 rows"),
  },
  {
    title: "Preview",
    verdict: "warned",
    verdictLabel: "Warns",
    caption: (
      <>
        The dry run changes nothing. It shows the plan a diff produces: drop the column that holds
        the data, then add a new one with a temporary value in every row.
      </>
    ),
    filename: "contract.prisma",
    source: SCHEMA_AFTER,
    lang: "prisma",
    marks: [{ line: 4, tone: "add" }],
    terminal: [
      { kind: "cmd", text: "npx prisma db update --dry-run" },
      { kind: "warn", text: '├─ ⚠ Drop column "username" from "User"' },
      { text: "└─ Add column handle to User" },
      { text: "" },
      {
        kind: "warn",
        text: "⚠ This migration contains destructive operations that may cause data loss.",
      },
    ],
    db: {
      table: "User",
      note: "preview only",
      tone: "warned",
      columns: [
        { name: "id" },
        { name: "email" },
        { name: "username", state: "lost" },
        { name: "handle", state: "new" },
      ],
      rows: USERS.map((r) => [...r, "''"]),
    },
  },
  {
    title: "Apply anyway",
    verdict: "blocked",
    verdictLabel: "Blocks",
    caption: (
      <>
        {c("--yes")} cannot answer a question about data loss. The command stops and the rows are
        untouched. This check is automatic.
      </>
    ),
    filename: "contract.prisma",
    source: SCHEMA_AFTER,
    lang: "prisma",
    marks: [{ line: 4, tone: "stop" }],
    terminal: [
      { kind: "cmd", text: "npx prisma db update --yes" },
      {
        kind: "err",
        text: '✘ [CLI.CONSENT_REQUIRED] "User.username" needs a statement, which --yes cannot give.',
      },
      {
        kind: "why",
        text: '  why: Drop column "username" from "User" would lose the values of field "User.username".',
      },
      { kind: "next", text: "→ Run the command again with --rename User.username:User.handle" },
      { kind: "next", text: "→ Run the command again with --delete User.username" },
    ],
    db: usersIntact("3 rows, unchanged", "allowed"),
  },
  {
    title: "State the rename",
    verdict: "allowed",
    verdictLabel: "Allowed",
    caption: (
      <>
        With the rename stated, the plan is a single {c("RENAME COLUMN")} and the values stay. An
        agent could have passed {c("--delete")} here instead, so the flag in the command is the
        thing to review.
      </>
    ),
    filename: "contract.prisma",
    source: SCHEMA_AFTER,
    lang: "prisma",
    marks: [{ line: 4, tone: "add" }],
    terminal: [
      {
        kind: "cmd",
        text: "npx prisma migration plan --name rename_username_to_handle --rename User.username:User.handle",
      },
      { kind: "ok", text: "✔ Planned 1 operation(s)" },
      { text: '└─ Rename column "User"."username" to "handle"' },
      { text: "" },
      { kind: "why", text: "ℹ DDL preview" },
      { text: 'ALTER TABLE "public"."User" RENAME COLUMN "username" TO "handle";' },
    ],
    db: {
      table: "User",
      note: "after db migrate",
      tone: "allowed",
      columns: [{ name: "id" }, { name: "email" }, { name: "handle", state: "new" }],
      rows: USERS,
    },
  },
];

export function RenameWalkthrough() {
  return <Figure label="A rename, from schema edit to planned migration" steps={RENAME_STEPS} />;
}

/* ---------------------------------------------------------------------------
   4. What a database with policies accepts
--------------------------------------------------------------------------- */

const REF = `{
  "hash": "8106…7666",
  "invariants": [],
  "policies": {
    "change": ["migrate"],
    "dataProtection": {
      "dataLoss": "data-loss-forbidden"
    }
  }
}`;

const REF_LOOSENED = `{
  "hash": "8106…7666",
  "invariants": [],
  "policies": {
    "change": ["migrate", "reconcile"],
    "dataProtection": {
      "dataLoss": "data-loss-forbidden"
    }
  }
}`;

const RAW_STEP = `rawSql({
  id: 'raw.dropBio',
  label: 'Tidy up User table',
  operationClass: 'additive',
  // […]
  execute: [{
    description: 'drop bio',
    sql: 'ALTER TABLE "public"."User" DROP COLUMN "bio"',
  }],
})`;

const PROFILES = [
  ["1", "ada", "Climber"],
  ["2", "lin", "Baker"],
  ["3", "sam", "Sailor"],
];

const production = (note: string, tone: DbState["tone"], bioLost = false): DbState => ({
  table: "User (production)",
  note,
  tone,
  columns: [
    { name: "id" },
    { name: "handle" },
    { name: "bio", state: bioLost ? "lost" : undefined },
  ],
  rows: PROFILES,
});

const POLICY_STEPS: StepSource[] = [
  {
    title: "Record policies",
    verdict: "allowed",
    verdictLabel: "Owner applies",
    caption: (
      <>
        The ref file declares the policies. Whoever owns the database applies them once, and they
        are stored in the database itself. From then on every Prisma ORM 8 command checks them, from
        any checkout. The Prisma 7 CLI and direct SQL do not.
      </>
    ),
    filename: "migrations/app/refs/production.json",
    source: REF,
    lang: "json",
    marks: [{ line: 5 }, { line: 7 }],
    terminal: [
      {
        kind: "cmd",
        text: 'npx prisma db migrate --to production --db "$PRODUCTION_DATABASE_URL" --permit-policy-change',
      },
      { kind: "ok", text: "✔ Policies updated: dataProtection.dataLoss: data-loss-forbidden" },
      { text: "" },
      { text: "App space" },
      { text: "├─ (no operations)" },
    ],
    db: production("policies recorded", "info"),
  },
  {
    title: "Direct update",
    verdict: "blocked",
    verdictLabel: "Blocks",
    caption: (
      <>
        {c("db update")} is the development command. The change policy permits only migrations, so
        an agent holding the production URL cannot push a schema straight to it.
      </>
    ),
    filename: "migrations/app/refs/production.json",
    source: REF,
    lang: "json",
    marks: [{ line: 5, tone: "stop" }],
    terminal: [
      { kind: "cmd", text: 'npx prisma db update --db "$PRODUCTION_DATABASE_URL"' },
      {
        kind: "err",
        text: "✘ [MIGRATION.CHANGE_POLICY_FORBIDS] This database's change policy permits only migrations",
      },
      {
        kind: "why",
        text: "  why: The marker records change: migrate, so db update may not move it.",
      },
      {
        kind: "next",
        text: "→ Author a migration with prisma migration plan, then apply it with prisma db migrate --db <url>.",
      },
    ],
    db: production("unchanged", "allowed"),
  },
  {
    title: "Drop a column",
    verdict: "blocked",
    verdictLabel: "Blocks",
    caption: (
      <>
        This migration was planned with {c("--delete User.bio")} and passed review. The data
        protection policy still refuses it, because this database must not lose data.
      </>
    ),
    filename: "migrations/app/refs/production.json",
    source: REF,
    lang: "json",
    marks: [{ line: 7, tone: "stop" }],
    terminal: [
      { kind: "cmd", text: 'npx prisma db migrate --db "$PRODUCTION_DATABASE_URL"' },
      {
        kind: "err",
        text: "✘ [MIGRATION.DATA_PROTECTION_FORBIDS] This database's data protection policy forbids data loss",
      },
      {
        kind: "why",
        text: '  why: The marker records dataLoss: data-loss-forbidden. Drop column "bio" from "User" (public.User.bio), in migration 20261120T1113_drop_bio of contract space "app".',
      },
      {
        kind: "next",
        text: "→ […] To do it anyway, whoever owns the database must first change its data protection policy.",
      },
    ],
    db: production("unchanged", "allowed"),
  },
  {
    title: "Loosen the ref",
    verdict: "blocked",
    verdictLabel: "Blocks",
    caption: (
      <>
        Editing the file does not change the database. The deploy stops because the two disagree,
        and the error does not name the flag that would override it. An agent can still type that
        flag, so forbid it in your agent instructions.
      </>
    ),
    filename: "migrations/app/refs/production.json",
    source: REF_LOOSENED,
    lang: "json",
    marks: [{ line: 5, tone: "stop" }],
    terminal: [
      {
        kind: "cmd",
        text: 'npx prisma db migrate --to production --db "$PRODUCTION_DATABASE_URL"',
      },
      {
        kind: "err",
        text: "✘ [MIGRATION.POLICY_MISMATCH] The ref's policies differ from the database's",
      },
      {
        kind: "why",
        text: "  why: production declares change: migrate, reconcile; the database has change: migrate.",
      },
      {
        kind: "next",
        text: "→ Make the ref match the database, or have whoever owns the database apply the ref's policies.",
      },
    ],
    db: production("unchanged", "allowed"),
  },
  {
    title: "Mislabeled SQL",
    verdict: "gap",
    verdictLabel: "Not covered",
    caption: (
      <>
        Data loss is judged by the class each operation records. Prisma classifies the operations it
        plans, but a hand-written SQL step carries the class its author gave it. This one says{" "}
        {c("additive")}, so it ran and the column is gone.
      </>
    ),
    filename: "migrations/app/20261120T1116_raw_drop/migration.ts",
    source: RAW_STEP,
    lang: "typescript",
    marks: [
      { line: 4, tone: "stop" },
      { line: 8, tone: "stop" },
    ],
    terminal: [
      { kind: "cmd", text: 'npx prisma db migrate --db "$PRODUCTION_DATABASE_URL"' },
      { kind: "ok", text: "✔ Applied 1 migration(s) (1 operation(s)) across 1 contract space(s)" },
      { text: "" },
      { text: "App space" },
      { text: "├─ Tidy up User table" },
    ],
    db: production("bio dropped", "blocked", true),
  },
];

export function PolicyOutcomes() {
  return (
    <Figure
      label="What a database with policies accepts and refuses"
      steps={POLICY_STEPS}
      mode="cases"
    />
  );
}

/* ---------------------------------------------------------------------------
   5. What happens when a migration is applied
--------------------------------------------------------------------------- */

const APPLY_STEPS: StepSource[] = [
  {
    title: "Database as expected",
    verdict: "allowed",
    verdictLabel: "Applies",
    caption: (
      <>
        Each operation is wrapped in two checks. The rename runs only after Prisma has confirmed the
        column it expects is there, and the new state is recorded only after the result has been
        verified.
      </>
    ),
    terminal: [
      { kind: "cmd", text: 'npx prisma db migrate --db "$STAGING_DATABASE_URL"' },
      { kind: "ok", text: "✔ Applied 1 migration(s) (1 operation(s)) across 1 contract space(s)" },
      { text: "" },
      { text: "App space" },
      { text: '├─ Rename column "User"."username" to "handle"' },
      { text: "└─ marker 8106e4ee…7666" },
    ],
    track: [
      { label: "Recorded state matches the history", state: "done" },
      { label: 'Precheck: column "username" exists', state: "done" },
      { label: "Run: rename column", state: "done" },
      { label: 'Postcheck: column "handle" exists', state: "done" },
      { label: "Record the new state", state: "done" },
    ],
    db: {
      table: "User (staging)",
      note: "values kept",
      tone: "allowed",
      columns: [{ name: "id" }, { name: "email" }, { name: "handle", state: "new" }],
      rows: USERS,
    },
  },
  {
    title: "Database has drifted",
    verdict: "blocked",
    verdictLabel: "Blocks",
    caption: (
      <>
        Someone renamed the column by hand to {c("login")}. The precheck fails before any SQL from
        the migration runs, and the error says the apply changed nothing.
      </>
    ),
    terminal: [
      { kind: "cmd", text: 'npx prisma db migrate --db "$STAGING_DATABASE_URL"' },
      {
        kind: "err",
        text: '✘ [MIGRATION.PRECHECK_FAILED] Operation renameColumn.User.username failed during precheck: ensure column "username" exists',
      },
      {
        kind: "why",
        text: '  why: […] the database has no column "username" on "User". The failed apply changed nothing.',
      },
      {
        kind: "next",
        text: "→ The database has drifted from its migration history […] See how it differs from the contract with `prisma db verify --db <url>` […]",
      },
    ],
    track: [
      { label: "Recorded state matches the history", state: "done" },
      { label: 'Precheck: column "username" exists', state: "stop" },
      { label: "Run: rename column", state: "skip" },
      { label: 'Postcheck: column "handle" exists', state: "skip" },
      { label: "Record the new state", state: "skip" },
    ],
    db: {
      table: "User (staging)",
      note: "unchanged",
      tone: "allowed",
      columns: [{ name: "id" }, { name: "email" }, { name: "login" }],
      rows: USERS,
    },
  },
  {
    title: "Failure halfway",
    verdict: "blocked",
    verdictLabel: "Rolls back",
    caption: (
      <>
        This migration adds a column, then a unique constraint that two existing rows violate. The
        second operation fails, and on PostgreSQL the whole run is one transaction, so the first
        operation is undone as well.
      </>
    ),
    terminal: [
      { kind: "cmd", text: 'npx prisma db migrate --db "$STAGING_DATABASE_URL"' },
      {
        kind: "err",
        text: '✘ [MIGRATION.EXECUTION_FAILED] Operation unique.User.User_handle_key failed during execution: add unique constraint "User_handle_key"',
      },
      {
        kind: "why",
        text: '  why: could not create unique index "User_handle_key". The failed apply changed nothing.',
      },
      {
        kind: "next",
        text: "→ Resolve the cause the failure names, then re-run `prisma db migrate --db <url>`",
      },
    ],
    track: [
      { label: "Recorded state matches the history", state: "done" },
      { label: 'Run: add column "nickname"', state: "done" },
      { label: "Run: add unique constraint on handle", state: "stop" },
      { label: "Transaction rolled back", state: "done" },
      { label: "Record the new state", state: "skip" },
    ],
    db: {
      table: "User (staging)",
      note: "unchanged, no nickname column",
      tone: "allowed",
      columns: [{ name: "id" }, { name: "email" }, { name: "handle" }],
      rows: [
        ["1", "ada@example.com", "ada"],
        ["2", "lin@example.com", "lin"],
        ["3", "ada2@example.com", "ada"],
      ],
    },
  },
];

export function ApplyRun() {
  return (
    <Figure label="What happens when a migration is applied" steps={APPLY_STEPS} mode="cases" />
  );
}
