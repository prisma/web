import { Texture } from "@/components/brand/texture";
import { ArrowRightBold } from "@/components/icons/forma";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductHero } from "@/components/product/product-hero";
import type { ProductIllustrationName } from "@/components/product/illustrations";
import { CompareLinks } from "@/components/sections/compare-links";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { renderFaqAnswer } from "@/lib/faq-answer";
import { cn } from "@/lib/utils";
import {
  FREE_POSTGRES_HERO_SECONDARY_CTA,
  FREE_POSTGRES_COMPARE_INTRO,
  FREE_POSTGRES_COMPARE_LINKS,
  FREE_POSTGRES_FEATURE_ITEMS,
  FREE_POSTGRES_FEATURES_HEADLINE,
  FREE_POSTGRES_H1,
  FREE_POSTGRES_HERO_CHECKS,
  FREE_POSTGRES_HERO_PRIMARY_CTA,
  FREE_POSTGRES_INCLUDED_CARDS,
  FREE_POSTGRES_INCLUDED_NOTES,
  FREE_POSTGRES_INCLUDED_ROWS,
  FREE_POSTGRES_CASES,
  FREE_POSTGRES_LIMIT,
  FREE_POSTGRES_PROBLEM_HEADLINE,
  FREE_POSTGRES_SUBHEADLINE,
  FREE_POSTGRES_USE_HEADLINE,
} from "./_content";
import { FreePostgresTerminal } from "./_terminal";

function FreePostgresIncluded() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white text-left">
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {FREE_POSTGRES_INCLUDED_CARDS.map((card, index) => (
          <Card
            key={card.title}
            className={cn(
              "h-full gap-0 rounded-none border-0 bg-transparent py-0 shadow-none",
              index < FREE_POSTGRES_INCLUDED_CARDS.length - 1 &&
                "border-b border-black/[0.06] sm:border-r sm:border-b-0",
            )}
          >
            <CardHeader className="gap-3 px-6 py-8 sm:px-8 sm:py-10">
              <CardTitle className="text-[clamp(2.25rem,3vw,2.75rem)] font-semibold leading-none tabular-nums text-foreground">
                {renderFaqAnswer(card.title)}
                {card.note ? (
                  <a href={`#free-postgres-note-${card.note}`} className="ml-0.5">
                    <sup className="text-sm font-medium">{card.note}</sup>
                  </a>
                ) : null}
              </CardTitle>
              <CardDescription className="max-w-[32ch] text-pretty text-[0.9375rem] font-normal leading-relaxed">
                {renderFaqAnswer(card.detail)}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="border-t border-black/[0.06]">
        <Table>
          <TableHeader>
            <TableRow className="border-black/[0.06] hover:bg-transparent">
              <TableHead className="h-auto w-44 px-6 py-3 text-sm font-medium text-muted-foreground sm:px-8">
                Feature
              </TableHead>
              <TableHead className="h-auto px-6 py-3 text-sm font-medium text-muted-foreground sm:px-8">
                Included
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {FREE_POSTGRES_INCLUDED_ROWS.map((row) => (
              <TableRow key={row.label} className="border-black/[0.06] hover:bg-transparent">
                <TableCell className="px-6 py-4 font-medium whitespace-normal text-foreground sm:px-8">
                  {row.label}
                </TableCell>
                <TableCell className="px-6 py-4 leading-relaxed whitespace-normal text-foreground sm:px-8">
                  {renderFaqAnswer(row.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div
        id="free-postgres-notes"
        className="flex flex-col gap-1.5 border-t border-black/[0.06] px-6 py-5 text-sm leading-relaxed text-muted-foreground sm:px-8"
      >
        {FREE_POSTGRES_INCLUDED_NOTES.map((note) => (
          <p key={note.n} id={`free-postgres-note-${note.n}`}>
            <sup>{note.n}</sup> {note.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function FreePostgresSubtitle() {
  return (
    <>
      A free PostgreSQL database with{" "}
      <strong className="font-semibold text-foreground">2 GB</strong> of storage,{" "}
      <strong className="font-semibold text-foreground">200,000 operations</strong> a month (one
      query each), and <strong className="font-semibold text-foreground">50 databases</strong>.
      Prisma Postgres works with any Postgres client.
    </>
  );
}

function LimitFigure({ figure, label }: { figure: string; label: string }) {
  return (
    <div>
      <p className="whitespace-nowrap text-[clamp(1.75rem,2.5vw,2.25rem)] font-semibold tabular-nums leading-none text-foreground">
        {figure}
      </p>
      <p className="mt-2 text-sm leading-snug text-muted-foreground">{label}</p>
    </div>
  );
}

// Two columns on the grain: what a query counts as, then what idle and the
// cap do. The business cards are the next section. Free-page only.
function FreeLimit() {
  return (
    <section
      id="limits"
      className="scroll-mt-28 bg-white px-4 pt-24 pb-8 sm:px-8 sm:pt-32 sm:pb-10"
    >
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
            {FREE_POSTGRES_PROBLEM_HEADLINE}
          </h2>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.05} blend="multiply" />
          <div className="relative grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
            <div className="border-b border-black/[0.06] p-6 sm:p-8 lg:border-r lg:border-b-0">
              <h3 className="text-xl">{FREE_POSTGRES_LIMIT.countsTitle}</h3>
              <p className="mt-2 max-w-[36ch] text-pretty text-lg leading-snug text-foreground">
                {FREE_POSTGRES_LIMIT.countsLead}
              </p>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <LimitFigure
                  figure={FREE_POSTGRES_LIMIT.monthFigure}
                  label={FREE_POSTGRES_LIMIT.monthLabel}
                />
                <LimitFigure
                  figure={FREE_POSTGRES_LIMIT.dayFigure}
                  label={FREE_POSTGRES_LIMIT.dayLabel}
                />
              </div>
              <p className="mt-6 text-sm font-medium text-foreground">
                {FREE_POSTGRES_LIMIT.idleNotBilled}
              </p>
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-prism-cyan-500" />
                <div>
                  <h3 className="text-xl leading-snug">{FREE_POSTGRES_LIMIT.idleTitle}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                    {FREE_POSTGRES_LIMIT.idleBody}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-prism-red-500" />
                <div>
                  <h3 className="text-xl leading-snug">{FREE_POSTGRES_LIMIT.capTitle}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-pretty text-sm leading-relaxed text-foreground">
                    {FREE_POSTGRES_LIMIT.capBody}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-2 size-2 shrink-0 rounded-full bg-prism-yellow-400"
                />
                <div>
                  <h3 className="text-xl leading-snug">{FREE_POSTGRES_LIMIT.restoreTitle}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                    {FREE_POSTGRES_LIMIT.restoreBody}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative border-t border-black/[0.06] px-6 py-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:px-8">
            {renderFaqAnswer(FREE_POSTGRES_LIMIT.paid)}
          </p>
        </div>
      </div>
    </section>
  );
}

function FreeLimitCases() {
  return (
    <section className="bg-white px-4 pb-24 sm:px-8 sm:pb-32">
      <ul className="mx-auto grid max-w-site grid-cols-1 gap-3 lg:grid-cols-3">
        {FREE_POSTGRES_CASES.map((item) => {
          const card = (
            <>
              <div className="flex h-32 items-center justify-center bg-[#f3f3f3]">
                <img src={item.image} alt={item.imageAlt} className="h-full w-auto" />
              </div>
              <div className="px-4 py-3">
                <h3 className="text-base leading-snug">{item.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                <p className="mt-3 text-sm font-semibold tabular-nums text-foreground">
                  {item.count}
                </p>
                <p className="mt-0.5 text-sm text-foreground">{item.plan}</p>
                {item.linkLabel ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-black/25 underline-offset-4 group-hover:decoration-foreground">
                    {item.linkLabel}
                    <ArrowRightBold className="size-3.5 shrink-0" aria-hidden />
                  </p>
                ) : null}
              </div>
            </>
          );
          return (
            <li key={item.name}>
              {item.href ? (
                <a
                  href={item.href}
                  className="group block overflow-hidden rounded-xl border border-black/[0.06] bg-white text-inherit no-underline outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  {card}
                </a>
              ) : (
                <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white">
                  {card}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// Same sections as /postgres, with the free-plan contents directly under the
// hero. The limit panel comes next, then the two cards.
export function FreePostgresPage() {
  return (
    <>
      <ProductHero
        name="Prisma Postgres"
        accent="postgres"
        visual={<FreePostgresTerminal />}
        visualAspect={false}
        hero={{
          headline: FREE_POSTGRES_H1,
          subheadline: FREE_POSTGRES_SUBHEADLINE,
          primaryCta: FREE_POSTGRES_HERO_PRIMARY_CTA,
          secondaryCta: FREE_POSTGRES_HERO_SECONDARY_CTA,
        }}
        subheadline={<FreePostgresSubtitle />}
        checks={FREE_POSTGRES_HERO_CHECKS}
      />
      <section className="bg-white px-4 pt-16 pb-4 sm:px-8 sm:pt-24">
        <div className="mx-auto max-w-site">
          <div className="mx-auto max-w-3xl text-center max-md:text-left">
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              {FREE_POSTGRES_FEATURES_HEADLINE}
            </h2>
          </div>
          <div className="mt-8">
            <FreePostgresIncluded />
          </div>
        </div>
      </section>
      <FreeLimit />
      <FreeLimitCases />
      <ProductFeatures
        features={{
          headline: FREE_POSTGRES_USE_HEADLINE,
          bridge: "",
          items: FREE_POSTGRES_FEATURE_ITEMS.map((item) => ({
            ...item,
            illustration: item.illustration as ProductIllustrationName,
          })),
        }}
      />
      <CompareLinks intro={FREE_POSTGRES_COMPARE_INTRO} links={FREE_POSTGRES_COMPARE_LINKS} />
    </>
  );
}
