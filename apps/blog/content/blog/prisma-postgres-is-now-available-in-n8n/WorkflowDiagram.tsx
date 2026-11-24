import { Bot, Clock, MessageSquare, MousePointerClick, Webhook } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { withBlogBasePathForImageSrc } from "@/lib/url";

const LOGO_DIR = "/prisma-postgres-is-now-available-in-n8n/imgs/logos";

type Icon =
  | "prisma"
  | "postgres"
  | "notion"
  | "gmail"
  | "openai"
  | "gemini"
  | "manual"
  | "webhook"
  | "schedule"
  | "chat"
  | "agent";

/** `prisma` is the Prisma Postgres community node; `builtin` ships with n8n. */
type Kind = "prisma" | "builtin";

type FlowNode = {
  name: string;
  action: string;
  icon: Icon;
  kind?: Kind;
  /** Sub-nodes an AI Agent node calls, shown as chips under its label. */
  uses?: { label: string; icon: Icon }[];
};

type Row = { label?: string; nodes: FlowNode[] };

type Diagram = { caption: string; rows: Row[] };

const DIAGRAMS = {
  overview: {
    caption:
      "The Prisma Postgres node creates the database and its connection details. n8n's Postgres node then reads and writes the data.",
    rows: [
      {
        nodes: [
          { name: "Trigger", action: "Any n8n trigger", icon: "manual" },
          { name: "Prisma Postgres", action: "Project: Create", icon: "prisma", kind: "prisma" },
          { name: "Prisma Postgres", action: "Connection: Create", icon: "prisma", kind: "prisma" },
          { name: "Postgres", action: "Execute Query", icon: "postgres" },
        ],
      },
    ],
  },
  memory: {
    caption:
      "Setup creates the database and loads your notes once. After that, the agent searches them on every email.",
    rows: [
      {
        label: "Run once",
        nodes: [
          { name: "Prisma Postgres", action: "Project: Create", icon: "prisma", kind: "prisma" },
          { name: "Prisma Postgres", action: "Connection: Create", icon: "prisma", kind: "prisma" },
          { name: "Postgres", action: "Create tables", icon: "postgres" },
          { name: "PGVector Store", action: "Insert notes", icon: "postgres" },
        ],
      },
      {
        label: "Every new email",
        nodes: [
          { name: "Gmail Trigger", action: "New email", icon: "gmail" },
          {
            name: "AI Agent",
            action: "Analyze email",
            icon: "agent",
            uses: [
              { label: "Gemini", icon: "gemini" },
              { label: "PGVector Store", icon: "postgres" },
            ],
          },
          { name: "Postgres", action: "Save suggestion", icon: "postgres" },
        ],
      },
    ],
  },
  tenant: {
    caption:
      "Each signup gets its own database inside one project. The Postgres node connects with the details the connection step returns.",
    rows: [
      {
        nodes: [
          { name: "Webhook", action: "Customer signs up", icon: "webhook" },
          { name: "Prisma Postgres", action: "Database: Create", icon: "prisma", kind: "prisma" },
          { name: "Prisma Postgres", action: "Connection: Create", icon: "prisma", kind: "prisma" },
          { name: "Postgres", action: "Create schema", icon: "postgres" },
        ],
      },
    ],
  },
  knowledge: {
    caption:
      "The Prisma Postgres node creates the database once. Syncing and searching then run on nodes that ship with n8n.",
    rows: [
      {
        label: "Run once",
        nodes: [
          { name: "Prisma Postgres", action: "Project: Create", icon: "prisma", kind: "prisma" },
          { name: "Prisma Postgres", action: "Connection: Create", icon: "prisma", kind: "prisma" },
        ],
      },
      {
        label: "Every night",
        nodes: [
          { name: "Schedule Trigger", action: "2 am", icon: "schedule" },
          { name: "Notion", action: "Get policy pages", icon: "notion" },
          {
            name: "PGVector Store",
            action: "Insert documents",
            icon: "postgres",
            uses: [{ label: "OpenAI embeddings", icon: "openai" }],
          },
        ],
      },
      {
        label: "Every question",
        nodes: [
          { name: "Chat Trigger", action: "New message", icon: "chat" },
          {
            name: "AI Agent",
            action: "Answer from policies",
            icon: "agent",
            uses: [
              { label: "OpenAI", icon: "openai" },
              { label: "PGVector Store", icon: "postgres" },
            ],
          },
        ],
      },
    ],
  },
} satisfies Record<string, Diagram>;

export type WorkflowDiagramName = keyof typeof DIAGRAMS;

const LUCIDE: Partial<Record<Icon, ReactNode>> = {
  manual: <MousePointerClick aria-hidden />,
  webhook: <Webhook aria-hidden />,
  schedule: <Clock aria-hidden />,
  chat: <MessageSquare aria-hidden />,
  agent: <Bot aria-hidden />,
};

function IconGlyph({ icon }: { icon: Icon }) {
  const glyph = LUCIDE[icon];
  if (glyph) return glyph;
  return (
    <img
      src={withBlogBasePathForImageSrc(`${LOGO_DIR}/${icon}.svg`)}
      alt=""
      width={28}
      height={28}
      loading="lazy"
      decoding="async"
    />
  );
}

/**
 * A compact picture of an n8n workflow: one node per step, read left to right
 * (top to bottom on narrow screens). Nodes that belong to the Prisma Postgres
 * community node carry a "Prisma node" tag and the accent outline, so readers
 * can tell them apart from the nodes that ship with n8n without relying on
 * colour alone. The markup is an ordered list, so it reads in order with CSS
 * off, and the travelling dot on each connector stops under
 * `prefers-reduced-motion`.
 */
export function WorkflowDiagram({ name }: { name: WorkflowDiagramName }) {
  const diagram: Diagram = DIAGRAMS[name];
  return (
    <figure className="n8n-flow not-prose">
      <div className="n8n-flow-rows">
        {diagram.rows.map((row, r) => (
          <div className="n8n-flow-row" key={row.label ?? r}>
            {row.label ? <p className="n8n-flow-row-label">{row.label}</p> : null}
            <ol className="n8n-flow-track">
              {row.nodes.map((node, i) => (
                <li
                  className="n8n-flow-node"
                  data-kind={node.kind ?? "builtin"}
                  key={`${node.name}-${node.action}`}
                >
                  {i > 0 ? (
                    <span
                      className="n8n-flow-link"
                      style={{ "--n8n-flow-i": i } as CSSProperties}
                      aria-hidden
                    />
                  ) : null}
                  <span className="n8n-flow-icon">
                    <IconGlyph icon={node.icon} />
                  </span>
                  <span className="n8n-flow-text">
                    {node.kind === "prisma" ? (
                      <span className="n8n-flow-tag">Prisma node</span>
                    ) : null}
                    <span className="n8n-flow-name">{node.name}</span>
                    <span className="n8n-flow-action">{node.action}</span>
                    {node.uses ? (
                      <span className="n8n-flow-uses">
                        <span className="n8n-flow-uses-label">uses</span>
                        {node.uses.map((use) => (
                          <span className="n8n-flow-chip" key={use.label}>
                            <IconGlyph icon={use.icon} />
                            {use.label}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <figcaption className="n8n-flow-caption">{diagram.caption}</figcaption>
    </figure>
  );
}
