import { highlightPrisma8 } from "./highlight-prisma8";

const BEFORE = `supabase/migrations/
├── 20250514_add_notes_policy.sql
├── 20250602_update_notes_policy.sql
└── 20250618_fix_notes_policy.sql

+ dashboard edits outside git`;

const AFTER = `namespace public {
  model Note {
    userId Uuid
    user   supabase:auth.AuthUser @relation(fields: [userId], references: [id])

    @@rls
  }

  policy_select note_owner_read {
    roles = [authenticated]
    using = "\\"userId\\"::uuid = auth.uid()"
  }
}`;

export async function OneContractGraph() {
  const after = await highlightPrisma8(AFTER);
  return (
    <div className="contract-graph not-prose">
      <div className="contract-graph-cols">
        <div className="contract-graph-col">
          <span className="contract-graph-tag">RLS with SQL migrations</span>
          <div className="contract-graph-card">
            <pre className="contract-graph-plain">{BEFORE}</pre>
          </div>
        </div>
        <div className="contract-graph-col" data-after="true">
          <span className="contract-graph-tag">RLS in the Prisma schema</span>
          {/* Highlighted with the same extended prisma grammar the MDX code
              fences use; colors resolve through the --ch-N variables. */}
          <div className="contract-graph-card" dangerouslySetInnerHTML={{ __html: after }} />
        </div>
      </div>
      <div className="contract-graph-footer">One file to edit, migrate, and review.</div>
    </div>
  );
}
