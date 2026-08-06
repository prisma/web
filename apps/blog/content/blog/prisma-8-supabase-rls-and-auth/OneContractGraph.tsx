import { highlight, Pre, type HighlightedCode } from "codehike/code";

const BEFORE = `supabase/migrations/
  20250514_add_policy.sql
  20250602_update_policy.sql
  20250618_fix_policy.sql  // current?
dashboard                  // edits outside git`;

const AFTER = `contract.prisma   // models
                  // auth.users references
                  // RLS policies`;

async function hl(value: string): Promise<HighlightedCode> {
  return (await highlight({ value, lang: "prisma", meta: "" }, "github-from-css")) as HighlightedCode;
}

export async function OneContractGraph() {
  const [before, after] = await Promise.all([hl(BEFORE), hl(AFTER)]);
  return (
    <div className="contract-graph not-prose">
      <div className="contract-graph-cols">
        <div className="contract-graph-col">
          <span className="contract-graph-tag">Supabase today</span>
          <div className="contract-graph-card">
            <Pre code={before} />
          </div>
        </div>
        <div className="contract-graph-col" data-after="true">
          <span className="contract-graph-tag">With Prisma 8</span>
          <div className="contract-graph-card">
            <Pre code={after} />
          </div>
        </div>
      </div>
      <div className="contract-graph-footer">One contract to manage, migrate and review.</div>
    </div>
  );
}
