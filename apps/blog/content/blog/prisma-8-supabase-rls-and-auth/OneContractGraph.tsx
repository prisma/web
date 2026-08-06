import { highlight, Pre, type HighlightedCode } from "codehike/code";

const BEFORE = `schema.prisma      // models only
migrations/*.sql   // RLS policies, written by hand
dashboard          // policy edits, unreviewed`;

const AFTER = `contract.prisma    // models
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
          <span className="contract-graph-tag">Before</span>
          <div className="contract-graph-card">
            <Pre code={before} />
          </div>
        </div>
        <div className="contract-graph-col" data-after="true">
          <span className="contract-graph-tag">After</span>
          <div className="contract-graph-card">
            <Pre code={after} />
          </div>
        </div>
      </div>
      <div className="contract-graph-footer">One contract to manage, migrate and review.</div>
    </div>
  );
}
