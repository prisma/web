import { highlight, type HighlightedCode } from "codehike/code";
import { RlsFlowDemoClient } from "./RlsFlowDemoClient";

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
  {
    lang: "sql",
    value: `-- applied by Postgres, not by your code
CREATE POLICY note_owner_read ON note
  FOR SELECT TO authenticated
  USING ("userId"::uuid = auth.uid());`,
  },
];

export async function RlsFlowDemo() {
  const highlighted = (await Promise.all(
    SNIPPETS.map(({ value, lang }) => highlight({ value, lang, meta: "" }, "github-from-css")),
  )) as HighlightedCode[];
  return <RlsFlowDemoClient snippets={highlighted} />;
}
