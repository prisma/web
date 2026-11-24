import { highlight, InnerLine, Pre, type AnnotationHandler } from "codehike/code";
import { withBlogBasePathForImageSrc } from "@/lib/url";

const LOGO_DIR = "/prisma-postgres-is-now-available-in-n8n/imgs/logos";

type Step = {
  node: "prisma" | "postgres";
  /** Node name, then resource and operation. */
  title: string;
  /** Where in the node the snippet lives. */
  where: string;
  lang: string;
  code: string;
  /** 1-based line numbers that carry over to the next step. */
  marks?: number[];
  note: string;
};

const STEPS: Step[] = [
  {
    node: "prisma",
    title: "Prisma Postgres · Project: Create",
    where: "Output",
    lang: "json",
    code: `{
  "id": "proj_...",
  "name": "n8n-quickstart",
  "database": {
    "id": "db_...",
    "name": "n8n-quickstart",
    "status": "ready"
  }
}`,
    marks: [5],
    note: "Output shortened. The node returns once the new database accepts connections, and the next node needs the database ID.",
  },
  {
    node: "prisma",
    title: "Prisma Postgres · Connection: Create",
    where: "Database field (By ID)",
    lang: "js",
    code: `{{ $json.database.id }}`,
    marks: [1],
    note: "An expression reads the ID from the previous node's output.",
  },
  {
    node: "prisma",
    title: "Prisma Postgres · Connection: Create",
    where: "Output",
    lang: "json",
    code: `{
  "endpointType": "pooled",
  "host": "pooled.db.prisma.io",
  "port": 5432,
  "database": "postgres",
  "user": "...",
  "password": "...",
  "ssl": "require"
}`,
    marks: [3, 4, 5, 6, 7],
    note: "Output shortened. By default, this is the only operation that returns a password. The marked fields are the ones the Postgres credential asks for.",
  },
  {
    node: "postgres",
    title: "Postgres credential",
    where: "Fields, as expressions",
    lang: "js",
    code: `Host      {{ $json.host }}
Database  {{ $json.database }}
User      {{ $json.user }}
Password  {{ $json.password }}
Port      {{ $json.port }}
SSL       Require`,
    marks: [1, 2, 3, 4, 5],
    note: "The credential reads its values from the incoming item, so the Postgres node connects to the database that this run created.",
  },
];

const mark: AnnotationHandler = {
  name: "mark",
  AnnotatedLine: ({ annotation: _annotation, ...props }) => (
    <InnerLine merge={props} data-mark="true" />
  ),
};

async function highlightStep(step: Step) {
  const code = await highlight({ value: step.code, lang: step.lang, meta: "" }, "github-from-css");
  return {
    ...code,
    annotations: [
      ...code.annotations,
      ...(step.marks ?? []).map((line) => ({
        name: "mark",
        query: "",
        fromLineNumber: line,
        toLineNumber: line,
      })),
    ],
  };
}

/**
 * Follows one value through the quick start: what the first node returns, how
 * the second node reads it, what comes back, and how the Postgres credential
 * picks those values up. Code Hike highlights each snippet on the server and marks the
 * lines that the next step consumes. There is no client JavaScript and no
 * animation, so the figure reads the same with motion reduced or scripts off.
 */
export async function DataHandoff() {
  const codes = await Promise.all(STEPS.map(highlightStep));
  return (
    <ol className="n8n-handoff not-prose" aria-label="How data moves through the quick start">
      {STEPS.map((step, i) => (
        <li className="n8n-handoff-step" data-node={step.node} key={`${step.title}-${step.where}`}>
          <div className="n8n-handoff-head">
            <img
              src={withBlogBasePathForImageSrc(`${LOGO_DIR}/${step.node}.svg`)}
              alt=""
              width={18}
              height={18}
              loading="lazy"
              decoding="async"
            />
            <span className="n8n-handoff-title">{step.title}</span>
            <span className="n8n-handoff-where">{step.where}</span>
          </div>
          <div className="n8n-handoff-code">
            <Pre code={codes[i]} handlers={[mark]} />
          </div>
          <p className="n8n-handoff-note">{step.note}</p>
        </li>
      ))}
    </ol>
  );
}
