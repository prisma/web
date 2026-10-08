import { highlight, type HighlightedCode } from "codehike/code";
import { RlsFlowDemoClient } from "./RlsFlowDemoClient";
import { highlightPrisma8 } from "./highlight-prisma8";

const SNIPPETS: { value: string; lang: string }[] = [
  {
    lang: "typescript",
    value: `app.get('/notes', async (c) => {
  const auth = c.req.header('authorization');
  const jwt = auth?.startsWith('Bearer ')
    ? auth.slice(7)
    : undefined;
});`,
  },
  {
    lang: "typescript",
    value: `app.get('/notes', async (c) => {
  const auth = c.req.header('authorization');
  const jwt = auth?.startsWith('Bearer ')
    ? auth.slice(7)
    : undefined;

  const db = await getDb();
  const bound = await db.asUser(jwt);
});`,
  },
  {
    lang: "typescript",
    value: `app.get('/notes', async (c) => {
  const auth = c.req.header('authorization');
  const jwt = auth?.startsWith('Bearer ')
    ? auth.slice(7)
    : undefined;

  const db = await getDb();
  const bound = await db.asUser(jwt);

  const notes = await bound.orm.public.Note
    .select('id', 'title', 'body')
    .all()
    .toArray();

  return c.json({ notes });
});`,
  },
];

// The policy Postgres enforces in step 4, as it appears in the Prisma schema.
const POLICY = `policy_select note_owner_read {
  target = Note
  roles  = [authenticated]
  using  = "\\"userId\\"::uuid = auth.uid()"
}`;

export async function RlsFlowDemo() {
  const highlighted = (await Promise.all(
    SNIPPETS.map(({ value, lang }) => highlight({ value, lang, meta: "" }, "github-from-css")),
  )) as HighlightedCode[];
  const policyHtml = await highlightPrisma8(POLICY);
  return <RlsFlowDemoClient snippets={highlighted} policyHtml={policyHtml} />;
}
