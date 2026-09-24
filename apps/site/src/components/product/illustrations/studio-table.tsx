import { Plus, Search, Table } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { Bar, CardChrome, HeroPanel, SectionLabel, StatRow } from "./parts";

// A /postgres hero stop: Prisma Studio, browsing and editing the data itself in
// the browser. Real: the model names, the `User` column names, cuid-shaped ids
// and the relation count — the point is that this is the actual data, not a
// diagram of it. One cell carries a focus ring and a caret so the grid reads as
// editable rather than as a read-only report. Abstracted: the rows the grid
// would scroll to, and the search query.

const MODELS = [
  { name: "User", active: true },
  { name: "Post", active: false },
  { name: "Comment", active: false },
];

const COLUMNS = ["id", "email", "name", "createdAt", "posts"];

type Row = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  posts: string;
  /** The one cell in the grid that is mid-edit. */
  editing: boolean;
};

/** Shown at every width. */
const ROWS: Row[] = [
  {
    id: "clx7f9a2…",
    email: "ada@lovelace.dev",
    name: "Ada Lovelace",
    createdAt: "2026-07-12",
    posts: "12",
    editing: false,
  },
  {
    id: "clx7g2m8…",
    email: "grace@hopper.dev",
    name: "Grace Hopper",
    createdAt: "2026-07-11",
    posts: "8",
    editing: false,
  },
  {
    id: "clx7h4d1…",
    email: "alan@turing.dev",
    name: "Alan Turing",
    createdAt: "2026-07-09",
    posts: "3",
    editing: true,
  },
  {
    id: "clx7k8s5…",
    email: "linus@torvalds.dev",
    name: "Linus Torvalds",
    createdAt: "2026-07-05",
    posts: "4",
    editing: false,
  },
  {
    id: "clx7m3w0…",
    email: "barbara@liskov.dev",
    name: "Barbara Liskov",
    createdAt: "2026-07-02",
    posts: "9",
    editing: false,
  },
];

// Seven rows rather than five from md up: this panel shares its height with the
// tour's tallest stop (database-panel), and five left a visible void between
// the grid and the footer that read as a half-loaded table. Held to five below
// md, where the column is narrow enough that five already fills the frame.
//
// The tour frame sizes itself to its tallest stop rather than to a fixed
// height (see product-tour.tsx), so more rows would not clip — seven is a
// composition choice, not a ceiling. Adding rows here grows every stop on the
// page, so check the other two before you do.
const WIDE_ROWS: Row[] = [
  {
    id: "clx7p1v4…",
    email: "katherine@johnson.dev",
    name: "Katherine Johnson",
    createdAt: "2026-06-28",
    posts: "6",
    editing: false,
  },
  {
    id: "clx7q8b7…",
    email: "margaret@hamilton.dev",
    name: "Margaret Hamilton",
    createdAt: "2026-06-24",
    posts: "15",
    editing: false,
  },
];

/** One grid line — the header and every body row share this track layout. */
const COLS = "grid grid-cols-[3.25rem_1fr_5rem_4.5rem_2rem] items-center gap-2";

/** One record in the grid — the `name` cell of one row is mid-edit. */
function BodyRow({ row: { id, email, name, createdAt, posts, editing } }: { row: Row }) {
  return (
    <div className={cn(COLS, "border-t border-border/50 px-2.5 py-[0.25rem]")}>
      <span className="truncate font-mono text-[0.5625rem] text-muted-foreground/70">{id}</span>
      <span className="truncate font-mono text-[0.5625rem] text-foreground">{email}</span>
      {editing ? (
        <span className="-mx-1 flex items-center gap-1 rounded-[0.2rem] border border-prism-cyan-400 bg-card px-1 py-[0.1rem] ring-2 ring-prism-cyan-400/25">
          <span className="truncate text-[0.5625rem] text-foreground">{name}</span>
          <span
            aria-hidden
            className="inline-block h-2.5 w-[0.1rem] shrink-0 animate-caret-blink bg-prism-cyan-500 motion-reduce:animate-none"
          />
        </span>
      ) : (
        <span className="truncate text-[0.5625rem] text-foreground">{name}</span>
      )}
      <span className="font-mono text-[0.5625rem] text-muted-foreground">{createdAt}</span>
      <span className="justify-self-end rounded border border-border/80 bg-muted/40 px-1 py-[0.05rem] font-mono text-[0.5625rem] text-muted-foreground">
        {posts}
      </span>
    </div>
  );
}

export function StudioTable() {
  return (
    <HeroPanel label="Illustration of Prisma Studio: the User model open as a data grid of real rows in the browser, with one cell mid-edit and the change ready to save">
      <CardChrome
        file="studio"
        right={
          <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold text-prism-cyan-700">
            <span className="size-1.5 animate-status-pulse rounded-full bg-prism-cyan-400 motion-reduce:animate-none" />
            connected
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-5 px-5 py-5">
        <div className="flex gap-4">
          {/* the model switcher, User selected */}
          <div className="flex w-28 shrink-0 flex-col gap-2">
            <SectionLabel>Models</SectionLabel>
            {MODELS.map(({ name, active }) => (
              <div
                key={name}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[0.625rem] font-semibold",
                  active
                    ? "border border-prism-cyan-200 bg-prism-cyan-50 text-prism-cyan-900"
                    : "border border-transparent text-muted-foreground",
                )}
              >
                <Table
                  className={cn(
                    "size-3 shrink-0",
                    active ? "text-prism-cyan-600" : "text-foreground/40",
                  )}
                />
                {name}
              </div>
            ))}
            <span className="flex flex-col gap-2 px-2 pt-1">
              <Bar className="h-1 w-12" />
              <Bar className="h-1 w-9" />
            </span>
          </div>

          {/* the data grid itself */}
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border/80 bg-muted/30 px-2 py-1">
                <Search className="size-2.5 shrink-0 text-muted-foreground/60" />
                <Bar className="h-1 w-14" />
              </span>
              <span className="flex shrink-0 items-center gap-1 rounded-md border border-border/80 bg-card px-2 py-1 text-[0.5625rem] font-semibold text-muted-foreground">
                <Plus className="size-2.5" />
                Add record
              </span>
            </div>

            <div className="overflow-hidden rounded-lg border border-border/80">
              <div
                className={cn(
                  COLS,
                  "bg-muted/40 px-2.5 py-1.5 font-mono text-[0.5625rem] font-semibold text-muted-foreground",
                )}
              >
                {COLUMNS.map((column) => (
                  <span
                    key={column}
                    className={cn("truncate", column === "posts" && "justify-self-end")}
                  >
                    {column}
                  </span>
                ))}
              </div>

              {ROWS.map((row) => (
                <BodyRow key={row.id} row={row} />
              ))}
              <div className="max-md:hidden">
                {WIDE_ROWS.map((row) => (
                  <BodyRow key={row.id} row={row} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* what the grid is holding, and the write back to the database */}
        <div className="flex flex-col">
          <StatRow label="User" value="1,284 rows" />
          <div className="flex items-center gap-2 border-t border-border/60 pt-3.5">
            <span className="font-mono text-[0.625rem] font-semibold text-prism-cyan-700">
              1 unsaved edit
            </span>
            <span className="ml-auto rounded-full border border-border/80 px-2.5 py-1 text-[0.5625rem] font-semibold text-muted-foreground">
              Discard
            </span>
            <span className="rounded-full bg-primary px-2.5 py-1 text-[0.5625rem] font-semibold text-primary-foreground">
              Save changes
            </span>
          </div>
        </div>
      </div>
    </HeroPanel>
  );
}
