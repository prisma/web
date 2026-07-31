import { CheckBold } from "@/components/icons/forma";
import { ThreeDSlot } from "@/components/brand/three-d-slot";
import { Bar, CardChrome } from "./parts";

// The hero's [schema code sample]: schema.prisma as the one file the whole
// stack reads. Real Prisma syntax — model/relation keywords, scalar types and
// the attributes that carry the meaning — with field names and provider values
// collapsed to skeleton lines. Calm on purpose; the hero copy leads.

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-600">{children}</span>;
}

function Attr({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-red-500">{children}</span>;
}

function Type({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-yellow-600">{children}</span>;
}

export function SchemaFile() {
  return (
    <div
      role="img"
      aria-label="Illustration of a Prisma schema file: a User model and a Post model with typed fields and a relation between them"
      className="pointer-events-none relative flex h-full select-none flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_1px_2px_rgba(21,21,21,0.04),0_8px_16px_-4px_rgba(21,21,21,0.06),0_32px_64px_-16px_rgba(21,21,21,0.14)]"
    >
      <CardChrome file="schema.prisma" />

      <div className="flex flex-1 flex-col justify-between gap-6 px-5 py-5 font-mono text-[0.6875rem] leading-none text-foreground sm:text-xs">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <p className="flex items-center gap-2">
              <Kw>generator</Kw> client {"{"}
            </p>
            <p className="flex items-center gap-2 pl-4">
              provider = <Bar className="w-20 bg-prism-cyan-100" />
            </p>
            <p>{"}"}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="flex items-center gap-2">
              <Kw>model</Kw> User {"{"}
            </p>
            <p className="flex items-center gap-2 pl-4">
              id <Type>String</Type> <Attr>@id</Attr> <Attr>@default(cuid())</Attr>
            </p>
            <p className="flex items-center gap-2 pl-4">
              email <Type>String</Type> <Attr>@unique</Attr>
            </p>
            <p className="flex items-center gap-2 pl-4">
              <Bar className="w-10" /> <Type>DateTime</Type> <Bar className="w-14" />
            </p>
            <p className="flex items-center gap-2 pl-4">
              posts <Type>Post[]</Type>
            </p>
            <p>{"}"}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="flex items-center gap-2">
              <Kw>model</Kw> Post {"{"}
            </p>
            <p className="flex items-center gap-2 pl-4">
              <Bar className="w-8" /> <Type>String</Type> <Attr>@id</Attr>
            </p>
            <p className="flex items-center gap-2 pl-4">
              author <Type>User</Type> <Attr>@relation</Attr>
            </p>
            <p className="flex items-center gap-2 pl-4">
              <Bar className="w-12" /> <Bar className="w-16 bg-prism-yellow-100" />
            </p>
            <p>{"}"}</p>
          </div>
        </div>

        <p className="flex items-center gap-2 border-t border-border/60 pt-3.5 text-[0.6875rem] text-muted-foreground">
          <CheckBold className="size-3 shrink-0 text-prism-cyan-500" />
          <span className="text-foreground">Schema valid</span>
          <Bar className="ml-auto w-16" />
        </p>
      </div>

      {/* the 3D element floats over the file's lower-right, homepage idiom */}
      <ThreeDSlot
        src="/brand/cards-3d.png"
        className="absolute bottom-5 right-4 h-32 w-44 max-md:hidden"
      />
    </div>
  );
}
