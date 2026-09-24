import { XCircle } from "@/components/icons/forma";
import { cn } from "@/lib/utils";
import { CardChrome, HeroPanel, StatRow } from "./parts";

// The /orm tour's second stop, after schema-file: the client Prisma generates
// from that schema, doing the thing it exists to do. Review feedback was that
// the page reached for agents before it established the core ORM value, so this
// panel is deliberately unglamorous — a real editor, a real query, the model's
// own field names and types in the completion list, and the inferred return
// type spelled out underneath.
//
// The mistyped `createdA` is the point: the type system is shown working, not
// merely described. Same syntax-colour convention as schema-file.tsx — cyan for
// keywords, yellow for types, red reserved here for the invalid thing.

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-600">{children}</span>;
}

// The User model's own fields, as the generated client offers them.
const FIELDS = [
  { name: "email", type: "String", selected: true },
  { name: "emailVerified", type: "Boolean" },
  { name: "createdAt", type: "DateTime" },
  { name: "posts", type: "Post[]", relation: true },
];

export function ClientAutocomplete() {
  return (
    <HeroPanel label="Illustration of the generated Prisma Client in an editor: an autocomplete menu listing the User model's own fields and their types over a findMany query, a mistyped field underlined as a type error, and the inferred return type shown below">
      <CardChrome
        file="app.ts"
        right={
          <span className="flex items-center gap-1.5 text-[0.625rem] font-semibold text-prism-red-600">
            <span className="size-1.5 rounded-full bg-prism-red-500" />1 problem
          </span>
        }
      />

      <div className="flex flex-1 flex-col justify-between gap-3 px-5 py-5 font-mono text-[0.6875rem] leading-none text-foreground">
        <div className="flex flex-col gap-2.5">
          <p>
            <Kw>const</Kw> users = <Kw>await</Kw> db.user.findMany({"{"}
          </p>

          <p className="flex items-center pl-4">
            where: {"{"}&nbsp;
            <span
              aria-hidden
              className="inline-block h-3 w-px animate-status-pulse bg-prism-cyan-500 motion-reduce:animate-none"
            />
          </p>

          {/* the completion list, first row selected — real field names with
              their scalar and relation types beside them */}
          <div className="ml-8 w-56 rounded-lg border border-border bg-card py-1 shadow-[0_12px_28px_-10px_rgba(21,21,21,0.22)] sm:w-64">
            <p className="flex items-center gap-1.5 border-b border-border/60 px-2.5 pb-1.5 pt-1 text-[0.5625rem]">
              <Kw>model</Kw>
              <span className="text-foreground">User</span>
              <span className="ml-auto text-muted-foreground/70">4 of 12</span>
            </p>
            {FIELDS.map(({ name, type, selected, relation }) => (
              <p
                key={name}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1",
                  selected && "bg-prism-cyan-50",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-[2px] border",
                    relation ? "border-prism-cyan-300 bg-prism-cyan-100" : "border-border bg-muted",
                  )}
                />
                <span className={selected ? "text-foreground" : "text-muted-foreground"}>
                  {name}
                </span>
                <span className="ml-auto text-prism-yellow-600">{type}</span>
              </p>
            ))}
          </div>

          <p className="pl-4">{"}"},</p>
          <p className="pl-4">
            include: {"{"} posts: <Kw>true</Kw> {"}"},
          </p>
          <p className="pl-4">
            orderBy: {"{"}{" "}
            <span className="underline decoration-prism-red-500 decoration-wavy underline-offset-[3px]">
              createdA
            </span>
            : &quot;desc&quot; {"}"},
          </p>

          {/* the diagnostic the editor puts under it */}
          <p className="ml-4 flex items-start gap-1.5 rounded-md border border-prism-red-200 bg-prism-red-50/70 px-2 py-1.5 text-[0.625rem] leading-relaxed text-prism-red-700">
            <XCircle className="mt-[0.1rem] size-3 shrink-0" />
            <span>
              createdA does not exist on UserOrderByInput. Did you mean createdAt?
              <span className="ml-1.5 text-prism-red-500/80">ts(2561)</span>
            </span>
          </p>

          <p>{"}"})</p>
        </div>

        <div className="flex flex-col">
          <StatRow label="inferred" value="(User & { posts: Post[] })[]" accent />
          <StatRow label="type check" value="1 error, 0 queries sent" />
        </div>
      </div>
    </HeroPanel>
  );
}
