"use client"

import { useEffect, useState } from "react"
import { CheckBold, GitBranch, Table } from "@/components/icons/forma"
import { PrismButton, PrismButtonOutline } from "@/components/brand/prism-button"
import { PrismRay } from "@/components/brand/prism-ray"
import { Texture } from "@/components/brand/texture"
import { cn } from "@/lib/utils"

// Two-card closing row (reference: bounti.ai) — left card auto-cycles three
// product abstractions (full-bleed panels in the site's illustration idiom:
// photography frame, 32px padding, panel fills the rest), right card carries
// the pitch on the wrapped prismatic panel.

// Tri-color checks, mirroring the hero's proof row.
const CHECKS = [
  { label: "Built for how your agent ships now", color: "text-prism-cyan-500" },
  { label: "Postgres and hosting when you need them", color: "text-prism-yellow-400" },
  { label: "Type-safe ORM, free and always will be", color: "text-prism-red-500" },
] as const

// Skeleton line — same idiom as the other abstractions: key labels stay
// real, supporting copy becomes bars.
function Bar({ className }: { className?: string }) {
  return <span className={cn("inline-block h-1.5 rounded-full bg-foreground/10", className)} />
}

const PANEL_SHADOW = "shadow-[0_12px_32px_-14px_rgba(21,21,21,0.18)]"

// TODO: reserved square for the product's 3D asset — intentionally left as a
// placeholder until the right renders are produced; do not drop an object in.
function AssetSlot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "aspect-square w-full rounded-xl border-2 border-dashed border-foreground/15 bg-muted/40",
        className,
      )}
    />
  )
}

// Prisma Postgres — the database console: table rows mid-query, branches
// beside the reserved database slot, the ray passing through it.
function PostgresAbstraction() {
  return (
    <div
      aria-hidden
      className="h-full select-none bg-[url('/brand/feature-postgres.jpg')] bg-cover bg-[position:50%_55%] p-8"
    >
      <div className={cn("relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card", PANEL_SHADOW)}>
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3 font-mono text-[0.6875rem] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Table className="size-3.5" />
            users · 1,204 rows
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span className="size-1.5 rounded-full bg-prism-yellow-400" />
            Live
          </span>
        </div>

        <div className="flex min-h-0 flex-1 gap-6 px-5 py-4">
          {/* the table itself: real column keys, skeleton values */}
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-4 border-b border-border/70 pb-2.5 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-muted-foreground">
              <span className="w-8">id</span>
              <span>email</span>
              <span className="ml-auto">plan</span>
            </div>
            <div className="flex flex-1 flex-col justify-evenly font-mono text-[0.6875rem] text-muted-foreground">
              {[
                ["1042", "w-32", "pro"],
                ["1043", "w-24", "free"],
                ["1044", "w-28", "team"],
                ["1045", "w-20", "pro"],
                ["1046", "w-32", "free"],
                ["1047", "w-24", "pro"],
                ["1048", "w-28", "free"],
              ].map(([id, w, plan]) => (
                <p key={id} className="flex items-center gap-4">
                  <span className="w-8">{id}</span>
                  <Bar className={w} />
                  <span className="ml-auto text-foreground/60">{plan}</span>
                </p>
              ))}
            </div>
          </div>

          {/* the database slot on its own beam + branches + backup */}
          <div className="flex w-[36%] shrink-0 flex-col gap-4">
            <div className="relative grid flex-1 place-items-center">
              {/* the ray lives with the slot: centered on it, soft-fading
                  ends, never touching the table */}
              <PrismRay
                angle={0}
                className="left-1/2 top-1/2 h-9 w-[15rem] -translate-x-1/2 -translate-y-1/2"
              />
              <AssetSlot className="relative max-w-[10rem]" />
            </div>
            <div className="flex flex-col gap-2 font-mono text-[0.625rem] text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <GitBranch className="size-3 text-prism-yellow-500" />
                main
                <span className="ml-auto text-foreground/70">live</span>
              </p>
              <p className="flex items-center gap-1.5">
                <GitBranch className="size-3 text-prism-yellow-500" />
                preview/pr-214
                <span className="ml-auto text-foreground/70">ready</span>
              </p>
              <p className="flex items-center gap-1.5">
                backups · hourly
                <CheckBold className="ml-auto size-3 text-prism-yellow-500" />
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border/70 px-5 py-3 font-mono text-[0.625rem] text-muted-foreground">
          <span className="text-prism-yellow-600">$</span>
          prisma db pull
          <Bar className="ml-auto w-16" />
        </div>
      </div>
    </div>
  )
}

// Prisma Compute — deployments shipping while traffic scales: versions on
// the left, the reserved chip slot on the ray, the autoscale chart below.
function ComputeAbstraction() {
  return (
    <div
      aria-hidden
      className="h-full select-none bg-[url('/brand/feature-compute.jpg')] bg-cover bg-[position:20%_90%] p-8"
    >
      <div className={cn("relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card", PANEL_SHADOW)}>
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-3 font-mono text-[0.6875rem] text-muted-foreground">
          <span>Deployments</span>
          <span className="flex items-center gap-1.5 rounded-full bg-prism-red-50 px-2 py-0.5 text-[0.625rem] font-semibold text-prism-red-700">
            <span className="size-1 rounded-full bg-prism-red-500" />
            12 instances
          </span>
        </div>

        <div className="flex min-h-0 flex-1 gap-6 px-5 py-4">
          {/* version history, stretched to fill the column */}
          <div className="flex flex-1 flex-col justify-between font-mono text-[0.6875rem] text-foreground/80">
            <p className="flex items-center gap-2.5">
              v12
              <Bar className="w-20" />
              <span className="ml-auto flex items-center gap-1.5 text-prism-red-600">
                <span className="size-1.5 rounded-full bg-prism-red-500" />
                live
              </span>
            </p>
            <p className="flex items-center gap-2.5 text-muted-foreground">
              v11
              <Bar className="w-24" />
              <span className="ml-auto text-[0.625rem] text-muted-foreground/70">2d</span>
            </p>
            <p className="flex items-center gap-2.5 text-muted-foreground">
              v10
              <Bar className="w-14" />
              <span className="ml-auto text-[0.625rem] text-muted-foreground/70">1w</span>
            </p>
            <p className="flex items-center gap-2.5 text-muted-foreground">
              v9
              <Bar className="w-16" />
              <span className="ml-auto text-[0.625rem] text-muted-foreground/70">3w</span>
            </p>
            <p className="flex items-center gap-3 text-[0.625rem] text-muted-foreground/80">
              <span>
                boot <span className="text-foreground/70">7ms</span>
              </span>
              <span>
                p50 <span className="text-foreground/70">3.8ms</span>
              </span>
              <Bar className="ml-auto w-10" />
            </p>
          </div>

          {/* the compute slot on its own beam + live meters */}
          <div className="flex w-[36%] shrink-0 flex-col gap-4">
            <div className="relative grid flex-1 place-items-center">
              {/* the ray lives with the slot: centered on it, soft-fading
                  ends, never touching the version list */}
              <PrismRay
                angle={0}
                className="left-1/2 top-1/2 h-9 w-[15rem] -translate-x-1/2 -translate-y-1/2"
              />
              <AssetSlot className="relative max-w-[9rem]" />
            </div>
            <div className="flex flex-col gap-2 font-mono text-[0.625rem] text-muted-foreground">
              <p className="flex items-center gap-2">
                cpu <Bar className="w-12" />
                <span className="ml-auto text-foreground/70">42%</span>
              </p>
              <p className="flex items-center gap-2">
                mem <Bar className="w-16" />
                <span className="ml-auto text-foreground/70">63%</span>
              </p>
              <p className="flex items-center gap-2">
                region
                <span className="ml-auto text-foreground/70">us-west-1</span>
              </p>
            </div>
          </div>
        </div>

        {/* traffic scaling to meet the newest deploy */}
        <div className="flex items-end gap-1.5 px-5 pb-4">
          {[5, 8, 6, 10, 14, 11, 16, 20, 17, 24, 28, 22, 30, 34, 31, 36].map((h, i) => (
            <span
              key={i}
              style={{ height: `${h * 1.6}px` }}
              className={cn("flex-1 rounded-sm", i >= 13 ? "bg-prism-red-400/80" : "bg-foreground/10")}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border/70 px-5 py-3 font-mono text-[0.625rem] text-muted-foreground">
          <span className="text-prism-red-600">$</span>
          git push
          <Bar className="ml-auto w-14" />
        </div>
      </div>
    </div>
  )
}

// Prisma ORM — the schema as source of truth: models on the left, the
// reserved client slot on the ray, generate confirmed below.
function OrmAbstraction() {
  return (
    <div
      aria-hidden
      className="h-full select-none bg-[url('/brand/feature-orm.jpg')] bg-cover bg-[position:0%_65%] p-8"
    >
      <div className={cn("relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card", PANEL_SHADOW)}>
        <div className="flex items-center gap-2 border-b border-border/70 px-5 py-3">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="ml-1.5 font-mono text-[0.6875rem] text-muted-foreground">
            schema.prisma
          </span>
        </div>

        <div className="flex min-h-0 flex-1 gap-6 px-5 py-4">
          {/* the schema, stretched to fill the column */}
          <div className="flex flex-1 flex-col justify-between font-mono text-xs leading-none text-foreground/80">
            <p className="text-muted-foreground">
              <span className="text-prism-cyan-600">datasource</span> db {"{"} provider{" "}
              <span className="text-foreground/70">&quot;postgresql&quot;</span> {"}"}
            </p>
            <p className="pt-1">
              <span className="text-prism-cyan-600">model</span> User {"{"}
            </p>
            <p className="ml-4 flex items-center gap-2">
              id <span className="text-prism-cyan-600">Int</span> <Bar className="w-14" />
            </p>
            <p className="ml-4 flex items-center gap-2">
              email <span className="text-prism-cyan-600">String</span> <Bar className="w-9" />
            </p>
            <p className="ml-4 flex items-center gap-2">
              posts <span className="text-prism-cyan-600">Post[]</span> <Bar className="w-11" />
            </p>
            <p>{"}"}</p>
            <p className="pt-1">
              <span className="text-prism-cyan-600">model</span> Post {"{"}
            </p>
            <p className="ml-4 flex items-center gap-2">
              id <span className="text-prism-cyan-600">Int</span> <Bar className="w-12" />
            </p>
            <p className="ml-4 flex items-center gap-2">
              title <span className="text-prism-cyan-600">String</span> <Bar className="w-10" />
            </p>
            <p className="ml-4 flex items-center gap-2">
              author <span className="text-prism-cyan-600">User</span> <Bar className="w-16" />
            </p>
            <p>{"}"}</p>
          </div>

          {/* the generated-client slot on its own beam + type inventory */}
          <div className="flex w-[36%] shrink-0 flex-col gap-4">
            <div className="relative grid flex-1 place-items-center">
              {/* the ray lives with the slot: centered on it, soft-fading
                  ends, never touching the schema */}
              <PrismRay
                angle={0}
                className="left-1/2 top-1/2 h-9 w-[15rem] -translate-x-1/2 -translate-y-1/2"
              />
              <AssetSlot className="relative max-w-[10rem]" />
            </div>
            <div className="flex flex-col gap-2 font-mono text-[0.625rem] text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-prism-cyan-600">type</span> User
                <Bar className="ml-auto w-10" />
              </p>
              <p className="flex items-center gap-2">
                <span className="text-prism-cyan-600">type</span> Post
                <Bar className="ml-auto w-8" />
              </p>
              <p className="flex items-center gap-2">
                @prisma/client
                <CheckBold className="ml-auto size-3 text-prism-cyan-500" />
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border/70 px-5 py-3 font-mono text-[0.625rem] text-muted-foreground">
          <span className="text-prism-cyan-600">$</span>
          prisma generate
          <span className="text-foreground/70">· types in sync</span>
          <Bar className="ml-auto w-14" />
        </div>
      </div>
    </div>
  )
}

const PRODUCTS = [
  { key: "postgres", Abstraction: PostgresAbstraction },
  { key: "compute", Abstraction: ComputeAbstraction },
  { key: "orm", Abstraction: OrmAbstraction },
] as const

const INTERVAL = 3600

// The left card: the product abstractions cycling inside one frame — no
// pager, no labels, it just breathes.
function ProductShowcase() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % PRODUCTS.length)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [])

  return (
    <figure className="relative h-[24rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] sm:h-[28rem] lg:h-auto">
      {PRODUCTS.map(({ key, Abstraction }, i) => (
        <div
          key={key}
          aria-hidden={i !== active}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out motion-reduce:transition-none",
            i === active
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0",
          )}
        >
          <Abstraction />
        </div>
      ))}
    </figure>
  )
}

export function CtaSplit() {
  return (
    <section className="bg-white px-3 pb-3 pt-24 sm:px-4 sm:pt-32">
      <div className="mx-auto grid max-w-[96rem] gap-3 lg:h-[34rem] lg:grid-cols-[1.55fr_1fr]">
        <ProductShowcase />

        {/* the pitch on the wrapped prismatic panel */}
        <div className="relative overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          {/* prismatic backdrop — spectral wash + beam fan rising from below */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -bottom-1/3 left-1/2 h-[130%] w-[170%] -translate-x-1/2"
              style={{
                background: [
                  "radial-gradient(56% 44% at 26% 100%, color-mix(in srgb, var(--color-prism-cyan-400) 34%, transparent), transparent 68%)",
                  "radial-gradient(48% 40% at 52% 100%, color-mix(in srgb, var(--color-prism-yellow-300) 26%, transparent), transparent 66%)",
                  "radial-gradient(46% 34% at 78% 100%, color-mix(in srgb, var(--color-prism-red-400) 28%, transparent), transparent 68%)",
                ].join(","),
              }}
            />
            <div className="absolute bottom-[-18rem] left-[12%] h-[44rem] w-24 origin-bottom rotate-[-28deg] bg-prism-cyan-300/50 blur-[56px]" />
            <div className="absolute bottom-[-20rem] left-1/2 h-[46rem] w-28 origin-bottom -translate-x-1/2 rotate-[5deg] bg-prism-yellow-200/60 blur-[64px]" />
            <div className="absolute bottom-[-21rem] right-[10%] h-[44rem] w-24 origin-bottom rotate-[28deg] bg-prism-red-300/50 blur-[56px]" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-t from-transparent via-white/60 to-white" />
          </div>
          <Texture opacity={0.06} blend="multiply" />

          <div className="relative flex h-full flex-col justify-center p-7 sm:p-9 lg:p-10">
            <h2 className="max-w-[16ch] text-balance text-[clamp(1.75rem,2.6vw,2.375rem)] leading-[1.1]">
              Ready to let your agent run the full loop?
            </h2>

            <p className="mt-4 max-w-[44ch] text-pretty leading-relaxed text-muted-foreground">
              The TypeScript stack 500K+ developers trust. Start with the free
              ORM, and add the rest of the platform when you need it.
            </p>

            <ul className="mt-7 flex flex-col gap-3">
              {CHECKS.map(({ label, color }) => (
                <li
                  key={label}
                  className="flex items-start gap-2.5 text-[15px] font-semibold text-foreground"
                >
                  <CheckBold className={cn("mt-0.5 size-4 shrink-0", color)} aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <PrismButton href="https://console.prisma.io">Get started free</PrismButton>
              <PrismButtonOutline href="/pricing">See pricing</PrismButtonOutline>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
