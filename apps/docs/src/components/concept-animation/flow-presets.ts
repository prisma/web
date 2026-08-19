/**
 * A flow scene is a fixed box-and-arrow diagram drawn in a viewBox. Every node
 * and edge is laid out once; each step only chooses which of them are visible
 * and which are emphasized. Because the SVG keeps the same viewBox across
 * steps, the diagram scales with its container and never shifts the layout as
 * a reader steps through it.
 *
 * Coordinates are in viewBox units (roughly pixels at full width).
 */

/** Color role for a box. Mapped to theme-aware classes in flow.tsx. */
export type FlowVariant =
  | "project"
  | "branch"
  | "vars"
  | "infra"
  | "source"
  | "scope"
  | "neutral"
  | "production"
  | "resolved";

/** Where a resolved variable came from. Drives the colored bar on each row. */
export type RowOrigin = "production" | "preview" | "override";

/** One key=value line inside a node, color-coded by where the value came from. */
export interface FlowRow {
  key: string;
  value: string;
  origin: RowOrigin;
}

/** A small labelled pill rendered inside an `infra` node. */
export interface FlowChip {
  label: string;
  variant: FlowVariant;
}

export interface FlowNode {
  id: string;
  label: string;
  /** Smaller secondary line under the label. */
  sub?: string;
  /** Render the sub on its own line under the title instead of to the right. */
  subBelow?: boolean;
  /** Tint the sub line to a scope color (used by the resolved branch boxes). */
  subOrigin?: RowOrigin;
  variant: FlowVariant;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Chips laid out in a row inside the box (used for the infrastructure box). */
  chips?: FlowChip[];
  /** Variable rows rendered inside the box. */
  rows?: FlowRow[];
  /** Row slots to reserve, so per-step row changes never resize the box. */
  maxRows?: number;
}

export type Side = "l" | "r" | "t" | "b";

export interface FlowEdge {
  id: string;
  from: string;
  fromSide: Side;
  to: string;
  toSide: Side;
  /** Nudge the start/end anchor along the box edge, to fan out parallel edges. */
  fromDy?: number;
  toDy?: number;
  /** Override the x of the vertical bend, so parallel edges don't share a lane. */
  bendX?: number;
  /** Dashed lines read as "applies to" / "wires into" rather than "contains". */
  dashed?: boolean;
  /** Optional label drawn on the edge. */
  label?: string;
}

export interface FlowStep {
  title: string;
  caption: string;
  /** Node ids visible in this step. */
  nodes: string[];
  /** Edge ids visible in this step. */
  edges: string[];
  /** Node ids drawn brighter, to pull the eye to what changed. */
  emphasize?: string[];
  /** Replace a node's rows for this step (used to compose the resolved set). */
  rowOverrides?: Record<string, FlowRow[]>;
}

export interface FlowScene {
  label: string;
  /** viewBox width / height. */
  width: number;
  height: number;
  /** Column captions, e.g. "Branch", "Infrastructure". */
  groupLabels?: { text: string; x: number; y: number }[];
  /** Color key for row origins, drawn along the bottom. */
  legend?: { origin: RowOrigin; label: string }[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  steps: FlowStep[];
}

// Shared three-row band used by the model scene.
const ROW = [30, 116, 202];
const BOX_H = 64;

const computeModel: FlowScene = {
  label: "How Compute organizes resources and isolates branches",
  width: 712,
  height: 286,
  groupLabels: [
    { text: "Branch", x: 200, y: 18 },
    { text: "Infrastructure", x: 404, y: 18 },
  ],
  nodes: [
    {
      id: "project",
      label: "Project",
      sub: "my-app",
      variant: "project",
      x: 16,
      y: 116,
      w: 92,
      h: 64,
    },

    {
      id: "b-main",
      label: "main",
      sub: "default · production",
      variant: "branch",
      x: 200,
      y: ROW[0],
      w: 160,
      h: BOX_H,
    },
    {
      id: "b-feature",
      label: "feature/new-feature",
      sub: "preview",
      variant: "branch",
      x: 200,
      y: ROW[1],
      w: 160,
      h: BOX_H,
    },
    {
      id: "b-bug",
      label: "bug/fix-issue",
      sub: "preview",
      variant: "branch",
      x: 200,
      y: ROW[2],
      w: 160,
      h: BOX_H,
    },

    {
      id: "i-main",
      label: "",
      variant: "infra",
      x: 404,
      y: ROW[0],
      w: 292,
      h: BOX_H,
      // Variables follow a scope (production here); App and DB are isolated per branch.
      chips: [
        { label: "Variables · production", variant: "production" },
        { label: "App", variant: "scope" },
        { label: "DB", variant: "scope" },
      ],
    },
    {
      id: "i-feature",
      label: "",
      variant: "infra",
      x: 404,
      y: ROW[1],
      w: 292,
      h: BOX_H,
      chips: [
        { label: "Variables · preview", variant: "vars" },
        { label: "App", variant: "scope" },
        { label: "DB", variant: "scope" },
      ],
    },
    {
      id: "i-bug",
      label: "",
      variant: "infra",
      x: 404,
      y: ROW[2],
      w: 292,
      h: BOX_H,
      chips: [
        { label: "Variables · preview", variant: "vars" },
        { label: "App", variant: "scope" },
        { label: "DB", variant: "scope" },
      ],
    },
  ],
  edges: [
    { id: "e-main", from: "project", fromSide: "r", to: "b-main", toSide: "l" },
    { id: "e-feature", from: "project", fromSide: "r", to: "b-feature", toSide: "l" },
    { id: "e-bug", from: "project", fromSide: "r", to: "b-bug", toSide: "l" },
    { id: "c-main", from: "b-main", fromSide: "r", to: "i-main", toSide: "l" },
    { id: "c-feature", from: "b-feature", fromSide: "r", to: "i-feature", toSide: "l" },
    { id: "c-bug", from: "b-bug", fromSide: "r", to: "i-bug", toSide: "l" },
  ],
  steps: [
    {
      title: "1. First deploy",
      caption:
        "Your first deploy creates the project, its default production branch, and the infrastructure that runs it: an app, a database, and its production-scoped variables.",
      nodes: ["project", "b-main", "i-main"],
      edges: ["e-main", "c-main"],
      emphasize: ["b-main", "i-main"],
    },
    {
      title: "2. Branch off",
      caption:
        "Deploy a new branch name and Compute provisions a full, isolated copy: its own app and database. Its variables resolve from the shared preview scope, so a new preview branch picks up the preview set automatically.",
      nodes: ["project", "b-main", "i-main", "b-feature", "i-feature"],
      edges: ["e-main", "c-main", "e-feature", "c-feature"],
      emphasize: ["b-feature", "i-feature"],
    },
    {
      title: "3. Many branches",
      caption:
        "Every branch is its own environment under one project. App and database are isolated per branch; variables follow their scope (production for the default branch, preview for the rest), so a new branch is configured the moment it deploys. Run features and fixes in parallel without collisions.",
      nodes: ["project", "b-main", "i-main", "b-feature", "i-feature", "b-bug", "i-bug"],
      edges: ["e-main", "c-main", "e-feature", "c-feature", "e-bug", "c-bug"],
      emphasize: ["b-bug", "i-bug"],
    },
  ],
};

// Resolved-set rows reused across env steps, so the composition is explicit:
// each row carries the scope it resolved from.
const PROD_DB: FlowRow = { key: "DATABASE_URL", value: "…/prod", origin: "production" };
const PREVIEW_DB: FlowRow = { key: "DATABASE_URL", value: "…/preview", origin: "preview" };
const PREVIEW_STRIPE: FlowRow = { key: "STRIPE_KEY", value: "sk_test_…", origin: "preview" };
const OVERRIDE_DB: FlowRow = { key: "DATABASE_URL", value: "…/branch-db", origin: "override" };
const OVERRIDE_FLAG: FlowRow = { key: "FEATURE_FLAG", value: "on", origin: "override" };

const envLayers: FlowScene = {
  label: "How a deploy composes its environment variables",
  width: 730,
  height: 404,
  groupLabels: [
    { text: "What you set, by scope", x: 16, y: 26 },
    { text: "What each branch resolves to", x: 448, y: 26 },
  ],
  legend: [
    { origin: "production", label: "from production" },
    { origin: "preview", label: "from preview" },
    { origin: "override", label: "from branch override" },
  ],
  nodes: [
    // Left: the scopes you write to. Sub on its own line so long flags fit.
    {
      id: "s-prod",
      label: "Production",
      sub: "--role production",
      subBelow: true,
      variant: "production",
      x: 16,
      y: 50,
      w: 224,
      h: 78,
      rows: [PROD_DB],
    },
    {
      id: "s-preview",
      label: "Preview",
      sub: "--role preview",
      subBelow: true,
      variant: "source",
      x: 16,
      y: 150,
      w: 224,
      h: 102,
      rows: [PREVIEW_DB, PREVIEW_STRIPE],
    },
    {
      id: "s-override",
      label: "Branch override",
      sub: "--branch feature/search",
      subBelow: true,
      variant: "branch",
      x: 16,
      y: 274,
      w: 224,
      h: 102,
      rows: [OVERRIDE_DB, OVERRIDE_FLAG],
    },

    // Right: the set each branch actually deploys with.
    {
      id: "r-main",
      label: "main",
      sub: "production deploy",
      subOrigin: "production",
      variant: "resolved",
      x: 448,
      y: 50,
      w: 266,
      h: 64,
      rows: [PROD_DB],
      maxRows: 1,
    },
    {
      id: "r-feature",
      label: "feature/search",
      sub: "preview deploy",
      subOrigin: "preview",
      variant: "resolved",
      x: 448,
      y: 140,
      w: 266,
      h: 112,
      rows: [OVERRIDE_DB, PREVIEW_STRIPE, OVERRIDE_FLAG],
      maxRows: 3,
    },
    {
      id: "r-bug",
      label: "bug/fix-issue",
      sub: "preview deploy",
      subOrigin: "preview",
      variant: "resolved",
      x: 448,
      y: 274,
      w: 266,
      h: 90,
      rows: [PREVIEW_DB, PREVIEW_STRIPE],
      maxRows: 2,
    },
  ],
  edges: [
    { id: "d-prod", from: "s-prod", fromSide: "r", to: "r-main", toSide: "l", dashed: true },
    {
      id: "d-preview-f",
      from: "s-preview",
      fromSide: "r",
      to: "r-feature",
      toSide: "l",
      dashed: true,
      fromDy: -16,
      toDy: -22,
      bendX: 384,
    },
    {
      id: "d-preview-b",
      from: "s-preview",
      fromSide: "r",
      to: "r-bug",
      toSide: "l",
      dashed: true,
      fromDy: 16,
      bendX: 304,
    },
    {
      id: "d-override",
      from: "s-override",
      fromSide: "r",
      to: "r-feature",
      toSide: "l",
      dashed: true,
      toDy: 22,
    },
  ],
  steps: [
    {
      title: "1. Production",
      caption:
        "Your default branch deploys as production, and resolves to the production variables only. Nothing else is mixed in.",
      nodes: ["s-prod", "r-main"],
      edges: ["d-prod"],
      emphasize: ["s-prod", "r-main"],
    },
    {
      title: "2. Preview is the default",
      caption:
        "Here's the default that surprises people: every preview branch automatically inherits the shared preview set. You don't configure feature/search or bug/fix-issue, they both just resolve to preview. Production variables are never included.",
      nodes: ["s-prod", "r-main", "s-preview", "r-feature", "r-bug"],
      edges: ["d-prod", "d-preview-f", "d-preview-b"],
      emphasize: ["s-preview", "r-feature", "r-bug"],
      rowOverrides: { "r-feature": [PREVIEW_DB, PREVIEW_STRIPE] },
    },
    {
      title: "3. Override layers on top",
      caption:
        "A branch override composes key by key on top of that default, for one branch only: feature/search replaces DATABASE_URL and adds FEATURE_FLAG, while STRIPE_KEY still flows through from preview. bug/fix-issue has no override, so it stays on the plain preview defaults.",
      nodes: ["s-prod", "r-main", "s-preview", "r-feature", "r-bug", "s-override"],
      edges: ["d-prod", "d-preview-f", "d-preview-b", "d-override"],
      emphasize: ["s-override", "r-feature"],
    },
  ],
};

const githubConnection: FlowScene = {
  label: "How a GitHub connection deploys on push",
  width: 668,
  height: 256,
  groupLabels: [
    { text: "Workspace level", x: 24, y: 22 },
    { text: "Project level", x: 24, y: 132 },
  ],
  nodes: [
    {
      id: "workspace",
      label: "Workspace",
      sub: "your org",
      variant: "neutral",
      x: 24,
      y: 40,
      w: 160,
      h: 62,
    },
    {
      id: "ghapp",
      label: "Prisma GitHub App",
      sub: "installed",
      variant: "source",
      x: 250,
      y: 40,
      w: 178,
      h: 62,
    },

    {
      id: "project",
      label: "Project",
      sub: "my-app",
      variant: "project",
      x: 24,
      y: 150,
      w: 160,
      h: 62,
    },
    {
      id: "repo",
      label: "Repository",
      sub: "acme/shop",
      variant: "neutral",
      x: 250,
      y: 150,
      w: 178,
      h: 62,
    },
    {
      id: "deploy",
      label: "Preview deploy",
      sub: "feature/login",
      variant: "scope",
      x: 494,
      y: 150,
      w: 150,
      h: 62,
    },
  ],
  edges: [
    {
      id: "e-install",
      from: "workspace",
      fromSide: "r",
      to: "ghapp",
      toSide: "l",
      label: "installs",
    },
    {
      id: "e-connect",
      from: "project",
      fromSide: "r",
      to: "repo",
      toSide: "l",
      label: "git connect",
    },
    {
      id: "e-push",
      from: "repo",
      fromSide: "r",
      to: "deploy",
      toSide: "l",
      dashed: true,
      label: "push",
    },
  ],
  steps: [
    {
      title: "1. Install the app",
      caption:
        "The connection has two levels. First, your workspace installs the Prisma GitHub App once. That installation is what lets Prisma see your repositories.",
      nodes: ["workspace", "ghapp"],
      edges: ["e-install"],
      emphasize: ["workspace", "ghapp"],
    },
    {
      title: "2. Connect a repo",
      caption:
        "Then each project connects to a single repository with git connect. Connecting wires up automation for future events; it doesn't deploy anything on its own.",
      nodes: ["workspace", "ghapp", "project", "repo"],
      edges: ["e-install", "e-connect"],
      emphasize: ["project", "repo"],
    },
    {
      title: "3. Push to deploy",
      caption:
        "After that, a push builds the pushed commit and deploys the matching branch, so a push to feature/login deploys that preview. Production stays deliberate: you promote a deployment when you're ready.",
      nodes: ["workspace", "ghapp", "project", "repo", "deploy"],
      edges: ["e-install", "e-connect", "e-push"],
      emphasize: ["deploy"],
    },
  ],
};

// One query's round trip: app → middleware chain → driver, and back out.
// The app and database boxes span both lanes so the return edge (and the
// cache's short-circuit) can run through the clear band under the chain.
const middlewarePipeline: FlowScene = {
  label: "How a query moves through middleware",
  width: 660,
  height: 220,
  nodes: [
    {
      id: "app",
      label: "Your app",
      variant: "neutral",
      x: 24,
      y: 48,
      w: 150,
      h: 124,
    },
    {
      id: "mw",
      label: "Middleware",
      sub: "cache · lints · budgets",
      variant: "source",
      x: 240,
      y: 78,
      w: 190,
      h: 64,
    },
    {
      id: "db",
      label: "Database",
      variant: "project",
      x: 496,
      y: 48,
      w: 140,
      h: 124,
    },
  ],
  edges: [
    { id: "fwd1", from: "app", fromSide: "r", to: "mw", toSide: "l" },
    { id: "fwd2", from: "mw", fromSide: "r", to: "db", toSide: "l" },
    {
      id: "ret",
      from: "db",
      fromSide: "l",
      to: "app",
      toSide: "r",
      fromDy: 44,
      toDy: 44,
      label: "results",
    },
    {
      id: "hit",
      from: "mw",
      fromSide: "b",
      to: "app",
      toSide: "r",
      toDy: 44,
      dashed: true,
      label: "cached rows",
    },
  ],
  steps: [
    {
      title: "1. In the middle",
      caption: "Every query passes through your middleware on its way to the database.",
      nodes: ["app", "mw", "db"],
      edges: ["fwd1", "fwd2"],
      emphasize: ["mw"],
    },
    {
      title: "2. Block",
      caption:
        "Middleware can stop a query before it reaches the database. This is how lints blocks a DELETE without WHERE.",
      nodes: ["app", "mw", "db"],
      edges: ["fwd1"],
      emphasize: ["mw"],
    },
    {
      title: "3. Answer",
      caption:
        "Middleware can answer a query itself. On a cache hit, the database is skipped entirely.",
      nodes: ["app", "mw", "db"],
      edges: ["fwd1", "hit"],
      emphasize: ["mw"],
    },
    {
      title: "4. Observe",
      caption:
        "Results flow back through the middleware, which sees every row and the final timing.",
      nodes: ["app", "mw", "db"],
      edges: ["fwd1", "fwd2", "ret"],
      emphasize: ["app"],
    },
  ],
};

// Five hooks in execution order; the driver runs between intercept and onRow.
const middlewareLifecycle: FlowScene = {
  label: "The five hooks, in the order they run",
  width: 700,
  height: 150,
  nodes: [
    {
      id: "bc",
      label: "beforeCompile",
      sub: "rewrite",
      variant: "source",
      x: 16,
      y: 40,
      w: 128,
      h: 64,
    },
    {
      id: "be",
      label: "beforeExecute",
      sub: "guard",
      variant: "scope",
      x: 156,
      y: 40,
      w: 128,
      h: 64,
    },
    {
      id: "ic",
      label: "intercept",
      sub: "answer early",
      variant: "production",
      x: 296,
      y: 40,
      w: 122,
      h: 64,
    },
    { id: "or", label: "onRow", sub: "each row", variant: "vars", x: 470, y: 40, w: 100, h: 64 },
    {
      id: "ae",
      label: "afterExecute",
      sub: "observe",
      variant: "branch",
      x: 582,
      y: 40,
      w: 112,
      h: 64,
    },
  ],
  edges: [
    { id: "e1", from: "bc", fromSide: "r", to: "be", toSide: "l" },
    { id: "e2", from: "be", fromSide: "r", to: "ic", toSide: "l" },
    { id: "e3", from: "ic", fromSide: "r", to: "or", toSide: "l", label: "driver" },
    { id: "e4", from: "or", fromSide: "r", to: "ae", toSide: "l" },
  ],
  steps: [
    {
      title: "1. Rewrite",
      caption: "beforeCompile can change the query while it is still a typed AST.",
      nodes: ["bc", "be", "ic", "or", "ae"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["bc"],
    },
    {
      title: "2. Guard",
      caption: "beforeExecute sees the final SQL. Throw here to block the query.",
      nodes: ["bc", "be", "ic", "or", "ae"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["be"],
    },
    {
      title: "3. Answer early",
      caption: "intercept can return rows itself; if it does, the driver never runs.",
      nodes: ["bc", "be", "ic", "or", "ae"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["ic"],
    },
    {
      title: "4. Watch and close",
      caption:
        "The driver runs, onRow fires per streamed row, and afterExecute closes with row count and latency.",
      nodes: ["bc", "be", "ic", "or", "ae"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["or", "ae"],
    },
  ],
};

// One extension package, registered on two planes, converging on the database.
const extensionPlanes: FlowScene = {
  label: "One extension package, two registrations, one database",
  width: 680,
  height: 250,
  nodes: [
    {
      id: "pkg",
      label: "pgvector",
      sub: "one npm package",
      variant: "neutral",
      x: 16,
      y: 93,
      w: 170,
      h: 64,
    },
    {
      id: "cfg",
      label: "prisma-next.config.ts",
      sub: "migrations",
      variant: "source",
      x: 260,
      y: 24,
      w: 200,
      h: 64,
    },
    {
      id: "rt",
      label: "db.ts",
      sub: "queries",
      variant: "scope",
      x: 260,
      y: 162,
      w: 200,
      h: 64,
    },
    {
      id: "pg",
      label: "PostgreSQL",
      variant: "project",
      x: 524,
      y: 93,
      w: 140,
      h: 64,
    },
  ],
  edges: [
    { id: "p-cfg", from: "pkg", fromSide: "r", to: "cfg", toSide: "l" },
    { id: "p-rt", from: "pkg", fromSide: "r", to: "rt", toSide: "l" },
    { id: "cfg-pg", from: "cfg", fromSide: "r", to: "pg", toSide: "l", label: "db init" },
    { id: "rt-pg", from: "rt", fromSide: "r", to: "pg", toSide: "l", label: "queries" },
  ],
  steps: [
    {
      title: "1. Install",
      caption: "One package brings everything the extension needs.",
      nodes: ["pkg"],
      edges: [],
      emphasize: ["pkg"],
    },
    {
      title: "2. Config side",
      caption:
        "Registered in the config, the extension adds its schema types and its migration (CREATE EXTENSION).",
      nodes: ["pkg", "cfg"],
      edges: ["p-cfg"],
      emphasize: ["cfg"],
    },
    {
      title: "3. Client side",
      caption: "Registered in db.ts, it adds the query operations your code calls.",
      nodes: ["pkg", "cfg", "rt"],
      edges: ["p-cfg", "p-rt"],
      emphasize: ["rt"],
    },
    {
      title: "4. The database",
      caption: "db init installs the feature; your queries then use it.",
      nodes: ["pkg", "cfg", "rt", "pg"],
      edges: ["p-cfg", "p-rt", "cfg-pg", "rt-pg"],
      emphasize: ["pg"],
    },
  ],
};

const RELATION_LEGEND: { origin: RowOrigin; label: string }[] = [
  { origin: "production", label: "primary key" },
  { origin: "override", label: "foreign key" },
];

const relationOneToOne: FlowScene = {
  label: "One-to-one: a profile belongs to exactly one user",
  width: 680,
  height: 220,
  legend: RELATION_LEGEND,
  nodes: [
    {
      id: "user",
      label: "User",
      sub: "one record",
      subBelow: true,
      variant: "project",
      x: 40,
      y: 48,
      w: 240,
      h: 104,
      rows: [
        { key: "id", value: "u_01", origin: "production" },
        { key: "email", value: "alice@prisma.io", origin: "preview" },
      ],
    },
    {
      id: "profile",
      label: "Profile",
      sub: "at most one per user",
      subBelow: true,
      variant: "scope",
      x: 400,
      y: 40,
      w: 240,
      h: 128,
      rows: [
        { key: "id", value: "p_01", origin: "production" },
        { key: "userId", value: "u_01 · unique", origin: "override" },
        { key: "bio", value: "Writes about…", origin: "preview" },
      ],
    },
  ],
  edges: [
    {
      id: "fk",
      from: "profile",
      fromSide: "l",
      to: "user",
      toSide: "r",
      label: "userId → id",
    },
  ],
  steps: [
    {
      title: "1. Two models",
      caption:
        "A profile stores extra data about one user, in its own table or collection. On its own, nothing connects the two records yet.",
      nodes: ["user", "profile"],
      edges: [],
    },
    {
      title: "2. A unique foreign key",
      caption:
        "Profile.userId holds the id of its user: that is the foreign key. Marking it unique is what makes the relationship one-to-one, because two profiles can never point at the same user.",
      nodes: ["user", "profile"],
      edges: ["fk"],
      emphasize: ["profile"],
    },
    {
      title: "3. Query from the profile",
      caption:
        'The model that holds the foreign key declares the relation, so you query from that side: Profile.include("user") follows userId and attaches the matching user to the result.',
      nodes: ["user", "profile"],
      edges: ["fk"],
      emphasize: ["user"],
    },
  ],
};

const relationOneToMany: FlowScene = {
  label: "One-to-many: one user has many posts",
  width: 680,
  height: 300,
  legend: RELATION_LEGEND,
  nodes: [
    {
      id: "user",
      label: "User",
      sub: "the one side",
      subBelow: true,
      variant: "project",
      x: 40,
      y: 98,
      w: 220,
      h: 104,
      rows: [
        { key: "id", value: "u_01", origin: "production" },
        { key: "email", value: "alice@prisma.io", origin: "preview" },
      ],
    },
    {
      id: "p1",
      label: "Post",
      sub: "authorId = u_01",
      variant: "branch",
      x: 420,
      y: 24,
      w: 220,
      h: 64,
    },
    {
      id: "p2",
      label: "Post",
      sub: "authorId = u_01",
      variant: "branch",
      x: 420,
      y: 118,
      w: 220,
      h: 64,
    },
    {
      id: "p3",
      label: "Post",
      sub: "authorId = u_01",
      variant: "branch",
      x: 420,
      y: 212,
      w: 220,
      h: 64,
    },
  ],
  edges: [
    { id: "e1", from: "p1", fromSide: "l", to: "user", toSide: "r", toDy: -24 },
    { id: "e2", from: "p2", fromSide: "l", to: "user", toSide: "r" },
    { id: "e3", from: "p3", fromSide: "l", to: "user", toSide: "r", toDy: 24 },
  ],
  steps: [
    {
      title: "1. The foreign key",
      caption:
        "Each post stores the id of its author in authorId. One post always has exactly one author.",
      nodes: ["user", "p1"],
      edges: ["e1"],
      emphasize: ["p1"],
    },
    {
      title: "2. Many rows, same key",
      caption:
        "Nothing stops many posts from carrying the same authorId. That is the whole mechanism: one-to-many is many child records pointing at one parent.",
      nodes: ["user", "p1", "p2", "p3"],
      edges: ["e1", "e2", "e3"],
      emphasize: ["p2", "p3"],
    },
    {
      title: "3. Query either direction",
      caption:
        'User.include("posts") gathers every post with a matching authorId into an array on the user. Post.include("author") follows the key the other way and attaches one user to each post.',
      nodes: ["user", "p1", "p2", "p3"],
      edges: ["e1", "e2", "e3"],
      emphasize: ["user"],
    },
  ],
};

const relationManyToMany: FlowScene = {
  label: "Many-to-many: posts and tags connect through a junction model",
  width: 700,
  height: 300,
  groupLabels: [{ text: "Junction model", x: 280, y: 18 }],
  legend: RELATION_LEGEND,
  nodes: [
    {
      id: "post1",
      label: "Post",
      sub: "Hello Prisma 8",
      variant: "project",
      x: 24,
      y: 46,
      w: 190,
      h: 64,
    },
    {
      id: "post2",
      label: "Post",
      sub: "Typed queries",
      variant: "project",
      x: 24,
      y: 196,
      w: 190,
      h: 64,
    },
    {
      id: "pt1",
      label: "PostTag",
      sub: "postId + tagId",
      variant: "neutral",
      x: 280,
      y: 34,
      w: 150,
      h: 56,
    },
    {
      id: "pt2",
      label: "PostTag",
      sub: "postId + tagId",
      variant: "neutral",
      x: 280,
      y: 126,
      w: 150,
      h: 56,
    },
    {
      id: "pt3",
      label: "PostTag",
      sub: "postId + tagId",
      variant: "neutral",
      x: 280,
      y: 218,
      w: 150,
      h: 56,
    },
    {
      id: "tag1",
      label: "Tag",
      sub: "typescript",
      variant: "source",
      x: 496,
      y: 46,
      w: 180,
      h: 64,
    },
    {
      id: "tag2",
      label: "Tag",
      sub: "databases",
      variant: "source",
      x: 496,
      y: 196,
      w: 180,
      h: 64,
    },
  ],
  edges: [
    { id: "a1", from: "pt1", fromSide: "l", to: "post1", toSide: "r" },
    { id: "b1", from: "pt1", fromSide: "r", to: "tag1", toSide: "l" },
    { id: "a2", from: "pt2", fromSide: "l", to: "post1", toSide: "r", toDy: 18 },
    { id: "b2", from: "pt2", fromSide: "r", to: "tag2", toSide: "l", toDy: -18 },
    { id: "a3", from: "pt3", fromSide: "l", to: "post2", toSide: "r" },
    { id: "b3", from: "pt3", fromSide: "r", to: "tag1", toSide: "l", toDy: 18 },
  ],
  steps: [
    {
      title: "1. Both sides need many",
      caption:
        "A post can carry many tags, and a tag appears on many posts. Neither table can hold the other's foreign key without losing one of those directions.",
      nodes: ["post1", "post2", "tag1", "tag2"],
      edges: [],
    },
    {
      title: "2. The junction model",
      caption:
        "A junction model solves it: each PostTag record links one post to one tag. Three link records here connect two posts and two tags in every combination the data needs.",
      nodes: ["post1", "post2", "pt1", "pt2", "pt3", "tag1", "tag2"],
      edges: ["a1", "b1", "a2", "b2", "a3", "b3"],
      emphasize: ["pt1", "pt2", "pt3"],
    },
    {
      title: "3. Traverse in two hops",
      caption:
        'Queries follow the same two hops: Post.include("tags") fetches the link records, and nesting include("tag") inside it attaches each tag. One query, both hops.',
      nodes: ["post1", "post2", "pt1", "pt2", "pt3", "tag1", "tag2"],
      edges: ["a1", "b1", "a2", "b2", "a3", "b3"],
      emphasize: ["post1", "tag1", "tag2"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Migration scenes. Each teaches exactly one concept.
// ---------------------------------------------------------------------------

const migrationLoop: FlowScene = {
  label: "The migration loop",
  width: 620,
  height: 236,
  nodes: [
    {
      id: "contract",
      label: "Change the contract",
      sub: "your schema",
      variant: "source",
      x: 24,
      y: 24,
      w: 240,
      h: 64,
    },
    {
      id: "plan",
      label: "Plan",
      sub: "writes migration files",
      variant: "scope",
      x: 356,
      y: 24,
      w: 240,
      h: 64,
    },
    {
      id: "review",
      label: "Review",
      sub: "read it, edit if needed",
      variant: "vars",
      x: 356,
      y: 148,
      w: 240,
      h: 64,
    },
    {
      id: "apply",
      label: "Apply",
      sub: "runs against the database",
      variant: "project",
      x: 24,
      y: 148,
      w: 240,
      h: 64,
    },
  ],
  edges: [
    { id: "e1", from: "contract", fromSide: "r", to: "plan", toSide: "l" },
    { id: "e2", from: "plan", fromSide: "b", to: "review", toSide: "t" },
    { id: "e3", from: "review", fromSide: "l", to: "apply", toSide: "r" },
    {
      id: "e4",
      from: "apply",
      fromSide: "t",
      to: "contract",
      toSide: "b",
      dashed: true,
      label: "next change",
    },
  ],
  steps: [
    {
      title: "1. Change",
      caption:
        "Edit your schema, then emit it. The contract is what every migration command reads.",
      nodes: ["contract", "plan", "review", "apply"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["contract"],
    },
    {
      title: "2. Plan",
      caption:
        "The planner diffs your contract against history and writes migration files. No database needed.",
      nodes: ["contract", "plan", "review", "apply"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["plan"],
    },
    {
      title: "3. Review",
      caption:
        "Read the TypeScript and the SQL preview. Edit the migration when a change needs a data step.",
      nodes: ["contract", "plan", "review", "apply"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["review"],
    },
    {
      title: "4. Apply",
      caption:
        "migrate runs the pending migrations. Then the loop starts again with your next change.",
      nodes: ["contract", "plan", "review", "apply"],
      edges: ["e1", "e2", "e3", "e4"],
      emphasize: ["apply"],
    },
  ],
};

// One concept: schema states are nodes, migrations are the edges between them.
const migrationGraph: FlowScene = {
  label: "States are nodes, migrations are edges",
  width: 700,
  height: 250,
  nodes: [
    {
      id: "s0",
      label: "empty",
      sub: "new database",
      variant: "neutral",
      x: 16,
      y: 93,
      w: 120,
      h: 64,
    },
    {
      id: "s1",
      label: "705b1a6",
      sub: "after init",
      variant: "source",
      x: 190,
      y: 93,
      w: 130,
      h: 64,
    },
    {
      id: "sa",
      label: "93be6c2",
      sub: "Alice's branch",
      variant: "scope",
      x: 386,
      y: 20,
      w: 130,
      h: 64,
    },
    {
      id: "sb",
      label: "7e3fa7f",
      sub: "Bob's branch",
      variant: "vars",
      x: 386,
      y: 166,
      w: 130,
      h: 64,
    },
    { id: "sm", label: "f9a41d7", sub: "merged", variant: "project", x: 560, y: 93, w: 124, h: 64 },
  ],
  edges: [
    { id: "e0", from: "s0", fromSide: "r", to: "s1", toSide: "l", label: "init" },
    { id: "ea", from: "s1", fromSide: "r", to: "sa", toSide: "l", label: "alice_phone" },
    { id: "eb", from: "s1", fromSide: "r", to: "sb", toSide: "l", label: "bob_avatar" },
    { id: "ma", from: "sa", fromSide: "r", to: "sm", toSide: "l", label: "merge" },
    { id: "mb", from: "sb", fromSide: "r", to: "sm", toSide: "l", label: "merge" },
  ],
  steps: [
    {
      title: "1. States and edges",
      caption:
        "Every emitted contract hashes to an identifier for that exact schema state. A migration is an edge from one state to the next.",
      nodes: ["s0", "s1"],
      edges: ["e0"],
      emphasize: ["s1"],
    },
    {
      title: "2. Branches",
      caption:
        "Alice and Bob each plan a migration from the same state. Both edges are valid; there are no timestamps to fight over.",
      nodes: ["s0", "s1", "sa", "sb"],
      edges: ["e0", "ea", "eb"],
      emphasize: ["sa", "sb"],
    },
    {
      title: "3. Merge",
      caption:
        "After the git merge, each branch gets a small merge migration into the combined state. Every database finds its own path.",
      nodes: ["s0", "s1", "sa", "sb", "sm"],
      edges: ["e0", "ea", "eb", "ma", "mb"],
      emphasize: ["sm"],
    },
  ],
};

// One concept: a rollback is a new forward edge back to a state you have been in.
const migrationRollback: FlowScene = {
  label: "A rollback is a new migration, not rewritten history",
  width: 640,
  height: 220,
  nodes: [
    {
      id: "before",
      label: "705b1a6",
      sub: "before the change",
      variant: "source",
      x: 24,
      y: 48,
      w: 200,
      h: 124,
    },
    {
      id: "after",
      label: "e6b5c28",
      sub: "after add_display_name",
      variant: "project",
      x: 416,
      y: 48,
      w: 200,
      h: 124,
    },
  ],
  edges: [
    {
      id: "fwd",
      from: "before",
      fromSide: "r",
      to: "after",
      toSide: "l",
      fromDy: -30,
      toDy: -30,
      label: "add_display_name",
    },
    {
      id: "back",
      from: "after",
      fromSide: "l",
      to: "before",
      toSide: "r",
      fromDy: 30,
      toDy: 30,
      dashed: true,
      label: "rollback (a new migration)",
    },
  ],
  steps: [
    {
      title: "1. A change ships",
      caption:
        "add_display_name applies cleanly and the database sits at the new state. Then the team decides the change was wrong.",
      nodes: ["before", "after"],
      edges: ["fwd"],
      emphasize: ["after"],
    },
    {
      title: "2. Plan the way back",
      caption:
        "Planning to the previous state writes a real migration that undoes the change, with a data-loss warning where one applies.",
      nodes: ["before", "after"],
      edges: ["fwd", "back"],
      emphasize: ["before"],
    },
    {
      title: "3. History grows",
      caption:
        "Applying it moves the database back, and the ledger records the round trip. Like git revert, never git reset.",
      nodes: ["before", "after"],
      edges: ["fwd", "back"],
      emphasize: ["before"],
    },
  ],
};

// ---------------------------------------------------------------------------
// Composer scenes.
// ---------------------------------------------------------------------------

// What a Composer application is made of: services, the contracts between
// them, and the resources they depend on. Teaches composition before syntax.
const composerAppGraph: FlowScene = {
  label: "A Prisma App: services, contracts, and resources",
  width: 700,
  height: 300,
  groupLabels: [
    { text: "Prisma App · store", x: 24, y: 18 },
    { text: "Resources", x: 520, y: 18 },
  ],
  nodes: [
    {
      id: "storefront",
      label: "storefront",
      sub: "Next.js service",
      variant: "scope",
      x: 24,
      y: 110,
      w: 170,
      h: 64,
    },
    {
      id: "orders",
      label: "orders",
      sub: "service",
      variant: "source",
      x: 274,
      y: 36,
      w: 160,
      h: 64,
    },
    {
      id: "catalog",
      label: "catalog",
      sub: "service",
      variant: "source",
      x: 274,
      y: 196,
      w: 160,
      h: 64,
    },
    {
      id: "orders-db",
      label: "Prisma Postgres",
      sub: "orders database",
      variant: "project",
      x: 512,
      y: 36,
      w: 170,
      h: 64,
    },
    {
      id: "catalog-db",
      label: "Prisma Postgres",
      sub: "catalog database",
      variant: "project",
      x: 512,
      y: 196,
      w: 170,
      h: 64,
    },
  ],
  edges: [
    {
      id: "sf-orders",
      from: "storefront",
      fromSide: "r",
      to: "orders",
      toSide: "l",
      label: "orders contract",
    },
    {
      id: "sf-catalog",
      from: "storefront",
      fromSide: "r",
      to: "catalog",
      toSide: "l",
      label: "catalog contract",
    },
    {
      id: "orders-catalog",
      from: "orders",
      fromSide: "b",
      to: "catalog",
      toSide: "t",
      dashed: true,
      label: "catalog contract",
    },
    { id: "orders-pg", from: "orders", fromSide: "r", to: "orders-db", toSide: "l" },
    { id: "catalog-pg", from: "catalog", fromSide: "r", to: "catalog-db", toSide: "l" },
  ],
  steps: [
    {
      title: "1. Services",
      caption:
        "An application is one or more services. Each service is a process that Composer builds a declaration for: what it is called, how it is built, and what it depends on.",
      nodes: ["storefront", "orders", "catalog"],
      edges: [],
      emphasize: ["storefront", "orders", "catalog"],
    },
    {
      title: "2. Contracts connect services",
      caption:
        "A service that other services call exposes a contract: its API described as schemas. A consumer declares a dependency on that contract and receives a typed client. TypeScript checks that every declared dependency matches a contract some service exposes.",
      nodes: ["storefront", "orders", "catalog"],
      edges: ["sf-orders", "sf-catalog", "orders-catalog"],
      emphasize: ["storefront"],
    },
    {
      title: "3. Resources attach to services",
      caption:
        "A resource is something a service depends on that is not a service: a Prisma Postgres database, an object-store bucket, a secret. Each service declares its own resources, so the orders and catalog services each get their own database.",
      nodes: ["storefront", "orders", "catalog", "orders-db", "catalog-db"],
      edges: ["sf-orders", "sf-catalog", "orders-catalog", "orders-pg", "catalog-pg"],
      emphasize: ["orders-db", "catalog-db"],
    },
  ],
};

// From declaration to running infrastructure, and how app code receives its
// dependencies at runtime.
const composerDeployFlow: FlowScene = {
  label: "From declarations to running services",
  width: 700,
  height: 286,
  groupLabels: [
    { text: "You write", x: 24, y: 18 },
    { text: "composer deploy provisions", x: 470, y: 18 },
  ],
  nodes: [
    {
      id: "decl",
      label: "Service declarations",
      sub: "compute({ name, deps, build })",
      subBelow: true,
      variant: "source",
      x: 24,
      y: 36,
      w: 220,
      h: 78,
    },
    {
      id: "root",
      label: "Root module",
      sub: "module.ts wires deps",
      subBelow: true,
      variant: "scope",
      x: 24,
      y: 176,
      w: 220,
      h: 78,
    },
    {
      id: "deploy",
      label: "composer deploy",
      sub: "diffs against stored state",
      subBelow: true,
      variant: "neutral",
      x: 320,
      y: 106,
      w: 190,
      h: 78,
    },
    {
      id: "compute",
      label: "Prisma Compute",
      sub: "one service each",
      variant: "vars",
      x: 546,
      y: 36,
      w: 148,
      h: 64,
    },
    {
      id: "postgres",
      label: "Prisma Postgres",
      sub: "one database each",
      variant: "project",
      x: 546,
      y: 126,
      w: 148,
      h: 64,
    },
    {
      id: "load",
      label: "service.load()",
      sub: "typed clients at runtime",
      variant: "resolved",
      x: 546,
      y: 216,
      w: 148,
      h: 56,
    },
  ],
  edges: [
    { id: "d-root", from: "decl", fromSide: "b", to: "root", toSide: "t" },
    { id: "root-deploy", from: "root", fromSide: "r", to: "deploy", toSide: "l" },
    { id: "deploy-compute", from: "deploy", fromSide: "r", to: "compute", toSide: "l" },
    { id: "deploy-pg", from: "deploy", fromSide: "r", to: "postgres", toSide: "l" },
    {
      id: "deploy-load",
      from: "deploy",
      fromSide: "b",
      to: "load",
      toSide: "l",
      dashed: true,
      label: "injected env",
    },
  ],
  steps: [
    {
      title: "1. Declare",
      caption:
        "Each service is declared as data: its name, its dependencies, and how it is built. The root module provisions the services and wires each dependency to the service or resource that provides it.",
      nodes: ["decl", "root"],
      edges: ["d-root"],
      emphasize: ["decl", "root"],
    },
    {
      title: "2. Deploy",
      caption:
        "composer deploy loads the root module, compares the declared application against the deploy state stored on the platform for that environment, and creates or updates the services on Prisma Compute and the databases on Prisma Postgres. Re-running a deploy applies only the difference; unchanged resources are not recreated.",
      nodes: ["decl", "root", "deploy", "compute", "postgres"],
      edges: ["d-root", "root-deploy", "deploy-compute", "deploy-pg"],
      emphasize: ["deploy", "compute", "postgres"],
    },
    {
      title: "3. Run",
      caption:
        "At runtime, each service calls service.load() once and receives its dependencies as typed values: an RPC client for each contract dependency, a connection for each database. The values come from environment variables Composer wrote at deploy time; your code never reads process.env itself.",
      nodes: ["decl", "root", "deploy", "compute", "postgres", "load"],
      edges: ["d-root", "root-deploy", "deploy-compute", "deploy-pg", "deploy-load"],
      emphasize: ["load"],
    },
  ],
};

/**
 * Names that render as visual flow diagrams. Any name not listed here falls
 * back to the Code Hike token animation in presets.ts.
 */
export const FLOW_SCENES = {
  "compute-model": computeModel,
  "composer-app-graph": composerAppGraph,
  "composer-deploy-flow": composerDeployFlow,
  "env-layers": envLayers,
  "github-connection": githubConnection,
  "relation-one-to-one": relationOneToOne,
  "relation-one-to-many": relationOneToMany,
  "relation-many-to-many": relationManyToMany,
  "middleware-pipeline": middlewarePipeline,
  "middleware-lifecycle": middlewareLifecycle,
  "extension-planes": extensionPlanes,
  "migration-loop": migrationLoop,
  "migration-graph": migrationGraph,
  "migration-rollback": migrationRollback,
} satisfies Record<string, FlowScene>;

export type FlowName = keyof typeof FLOW_SCENES;
