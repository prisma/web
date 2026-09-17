import { Database, Upload } from "@/components/icons/forma";
import { Bar, CardChrome, SectionLabel, SurfaceCard } from "./parts";

// "S3-compatible file storage built in" — a bucket is a resource inside the
// project, next to the database. Real: the create endpoint, the ready status,
// and the read/read_write key roles the storage layer enforces. Abstracted:
// resource names and the client configuration.

export function ObjectStore() {
  return (
    <SurfaceCard label="Illustration of an Object Store bucket provisioned next to the project's database, with S3 access keys minted in read and read-write roles">
      <CardChrome file="project resources" />
      <div className="flex flex-1 flex-col justify-center gap-2.5 px-4 py-3 text-[0.625rem] leading-none">
        {/* one project: the database and the bucket side by side */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/80 bg-muted/30 p-2">
          <SectionLabel>One project</SectionLabel>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="flex items-center gap-1 rounded border border-border bg-card px-1.5 py-0.5 text-muted-foreground">
              <Database className="size-2.5" />
              db
            </span>
            <span className="flex items-center gap-1 rounded border border-prism-cyan-200 bg-card px-1.5 py-0.5 text-prism-cyan-800">
              <Upload className="size-2.5" />
              uploads
            </span>
            <span className="ml-auto font-semibold text-prism-cyan-700">ready</span>
          </div>
          <p className="font-mono text-[0.5625rem] text-muted-foreground/80">POST /v1/buckets</p>
        </div>

        {/* the credential handoff: a few fields into any S3 client */}
        <div className="flex flex-col gap-1.5 rounded-lg border border-prism-cyan-200 bg-prism-cyan-50/40 p-2">
          <SectionLabel>Any S3 client</SectionLabel>
          <div className="flex items-center gap-1.5 font-mono text-muted-foreground">
            <span className="text-prism-cyan-600">endpoint</span>
            <Bar className="w-10" />
            <span className="text-prism-cyan-600">secret</span>
            <Bar className="w-8" />
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="rounded border border-border bg-card px-1 py-0.5 text-muted-foreground">
              read
            </span>
            <span className="rounded border border-prism-cyan-200 bg-card px-1 py-0.5 text-prism-cyan-800">
              read_write
            </span>
            <span className="ml-auto text-[0.5625rem] text-prism-cyan-700/80">
              roles enforced per key
            </span>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
