import { Bar, CardChrome, SurfaceCard } from "./parts";

// "Declarative schema" — one dense, machine-readable file. Numbered lines and
// tight leading carry the density the copy claims; real model/type/attribute
// tokens stay, field names collapse to skeletons.

const LINES: React.ReactNode[] = [
  <>
    <span className="text-prism-cyan-600">model</span> User <span>{"{"}</span>
  </>,
  <>
    id <span className="text-prism-yellow-600">String</span>{" "}
    <span className="text-prism-red-500">@id</span>
  </>,
  <>
    email <span className="text-prism-yellow-600">String</span>{" "}
    <span className="text-prism-red-500">@unique</span>
  </>,
  <>
    posts <span className="text-prism-yellow-600">Post[]</span>
  </>,
  <>{"}"}</>,
  <>
    <span className="text-prism-cyan-600">model</span> Post <span>{"{"}</span>
  </>,
  <>
    id <span className="text-prism-yellow-600">String</span>{" "}
    <span className="text-prism-red-500">@id</span>
  </>,
  <>
    author <span className="text-prism-yellow-600">User</span>{" "}
    <span className="text-prism-red-500">@relation</span>
  </>,
  <>
    <Bar className="w-10" /> <span className="text-prism-yellow-600">Boolean</span>
  </>,
  <>{"}"}</>,
];

export function DenseSchema() {
  return (
    <SurfaceCard label="Illustration of a Prisma schema file: two models with typed fields on ten numbered lines">
      <CardChrome file="schema.prisma" />
      <div className="flex flex-1 flex-col justify-center gap-[0.22rem] px-4 py-3 font-mono text-[0.625rem] leading-none text-foreground">
        {LINES.map((line, i) => (
          <p key={i} className="flex items-center gap-1.5">
            <span className="w-3 shrink-0 text-right text-muted-foreground/40">{i + 1}</span>
            <span className="flex items-center gap-1.5">{line}</span>
          </p>
        ))}
      </div>
    </SurfaceCard>
  );
}
