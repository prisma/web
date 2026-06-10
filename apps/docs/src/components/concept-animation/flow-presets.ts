import type { ConceptName } from "./presets";

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

/**
 * Names that render as visual flow diagrams. Any name not listed here falls
 * back to the Code Hike token animation in presets.ts.
 */
export const FLOW_SCENES = {
  "compute-model": computeModel,
  "env-layers": envLayers,
  "github-connection": githubConnection,
} satisfies Partial<Record<ConceptName, FlowScene>>;
