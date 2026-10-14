import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// A small TypeScript app on the Prisma stack, end to end: the model, the
// query, the deploy. The code is the full-stack tutorial's (apps/docs
// (index)/full-stack-tutorial.mdx), trimmed to the lines that carry the
// point, and the deploy output has the shape the CLI prints. Hand-tokenised
// so the section stays a static server component with no highlighter in the
// bundle; the illustrations use the same idiom.

const MONO = "font-[ui-monospace,SFMono-Regular,Menlo,Consolas,monospace]";

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-cyan-700">{children}</span>;
}
function Ty({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-yellow-700">{children}</span>;
}
function At({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-red-600">{children}</span>;
}
function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-prism-yellow-700">{children}</span>;
}
function Dim({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground">{children}</span>;
}

function Pane({
  step,
  title,
  file,
  accent,
  children,
}: {
  step: string;
  title: string;
  file: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04),0_16px_40px_-24px_rgba(21,21,21,0.2)]">
      <div className="flex items-center gap-2 border-b border-border/70 bg-muted/40 px-4 py-3">
        <span className={cn("size-2 rounded-full", accent)} aria-hidden />
        <span className="text-sm font-semibold text-foreground">
          {step}. {title}
        </span>
        <span className={cn("ml-auto text-xs text-muted-foreground", MONO)}>{file}</span>
      </div>
      <pre
        className={cn(
          "flex-1 overflow-x-auto px-4 py-4 text-[0.8125rem] leading-[1.6] text-foreground",
          MONO,
        )}
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function LandingExample() {
  return (
    <section className="bg-white px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-site">
        <Reveal className="max-w-3xl">
          <h2 className="text-balance text-[clamp(1.875rem,3vw,2.5rem)] leading-[1.1]">
            What it looks like: a small API, from model to live URL
          </h2>
          <p className="mt-5 max-w-[62ch] text-pretty text-lg leading-relaxed text-muted-foreground">
            One schema file, one typed query, and one command that deploys the app and its database
            together. This is the full-stack tutorial&rsquo;s app, trimmed to the lines that matter.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid gap-5 lg:grid-cols-3">
          <Pane step="1" title="Model" file="src/prisma/contract.prisma" accent="bg-prism-cyan-400">
            <Kw>model</Kw> User {"{"}
            {"\n"}
            {"  "}id <Ty>Int</Ty> <At>@id</At> <At>@default</At>(autoincrement())
            {"\n"}
            {"  "}email <Ty>String</Ty> <At>@unique</At>
            {"\n"}
            {"  "}name <Ty>String?</Ty>
            {"\n"}
            {"  "}createdAt <Ty>TimestamptzString</Ty> <At>@default</At>(now())
            {"\n"}
            {"}"}
          </Pane>

          <Pane step="2" title="Query" file="src/index.ts" accent="bg-prism-yellow-400">
            app.<Kw>get</Kw>(<Str>&quot;/users&quot;</Str>, <Kw>async</Kw> (c) =&gt; {"{"}
            {"\n"}
            {"  "}
            <Kw>const</Kw> users = <Kw>await</Kw> db.orm.public.User
            {"\n"}
            {"    "}.select(<Str>&quot;id&quot;</Str>, <Str>&quot;email&quot;</Str>,{" "}
            <Str>&quot;name&quot;</Str>){"\n"}
            {"    "}.limit(<Ty>20</Ty>){"\n"}
            {"    "}.all();
            {"\n"}
            {"  "}
            <Kw>return</Kw> c.json(users);
            {"\n"}
            {"}"});
          </Pane>

          <Pane step="3" title="Deploy" file="terminal" accent="bg-prism-red-500">
            <Dim>$</Dim> npm run build
            {"\n"}
            <Dim>$</Dim> npx prisma deploy module.ts
            {"\n"}
            {"\n"}
            my-app
            {"\n"}
            <Dim>├─</Dim> database <Dim>postgres-database</Dim>
            {"\n"}
            <Dim>└─</Dim> app <Dim>compute-service</Dim>
            {"\n"}
            {"             "}
            <span className="text-prism-cyan-700">https://xyz.ewr.prisma.build</span>
          </Pane>
        </Reveal>

        <p className="mt-6 max-w-[80ch] text-sm leading-relaxed text-muted-foreground">
          The app is scaffolded by <span className={MONO}>npm create prisma@latest</span>, which
          writes the schema, the typed client and the deploy declaration for you. The deploy creates
          the database, applies your migrations and starts the app, and a preview for a feature
          branch gets a database of its own.
        </p>
      </div>
    </section>
  );
}
