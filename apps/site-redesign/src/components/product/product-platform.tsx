"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swap } from "@/components/icons/forma";
import { IconTile } from "@/components/brand/icon-tile";
import { LearnMore } from "@/components/brand/learn-more";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { PRODUCT_ICONS } from "./icons";
import type { ProductPageContent } from "./types";

// Seconds each layer stays highlighted before the pulse moves on.
const HOLD = 3.4;

// The line the whole section exists to land. Client review: the diagram read as
// "you must use all of Prisma together", so the openness has to be stated in
// words rather than left for the visitor to infer from the cards.
const SWAP_LINE = "Best together — and every layer is standard, so you can swap any of it out.";

// Node y inside the canvas, and where the mark sits above them.
const NODE_Y = 192;
const MARK_Y = 44;

/** Node centres spread evenly across the 1152-wide canvas. */
function nodeX(i: number, count: number) {
  return (1152 * (i + 0.5)) / count;
}

/** The mark's feed down to node i, bowing outward before it lands. */
function curve(i: number, count: number) {
  const x = nodeX(i, count);
  if (Math.abs(x - 576) < 1) return `M576,${MARK_Y} L576,${NODE_Y}`;
  return `M576,${MARK_Y} C576,132 ${x},104 ${x},${NODE_Y}`;
}

function PrismaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76.817 76.817" className={className} aria-hidden>
      <path d="M15.5417 0V0.0303339L0 15.5671V43.6548L43.6729 0H15.5417Z" fill="#04D5E7" />
      <path d="M76.817 0H47.7408L0 47.721V76.817H29.0473L76.817 29.0657V0Z" fill="#FE4352" />
      <path d="M33.1143 76.8175H61.2454L76.8175 61.2504V33.1309L33.1143 76.8175Z" fill="#FEBE29" />
    </svg>
  );
}

// The cross-sell as one connected system that is also openly replaceable: a
// full-bleed rail carries a traveling prism shimmer, the layers sit on the rail
// above their cards, and the Prisma mark above feeds each of them in turn.
//
// The swap half is what the 2026-08-06 review added. Each layer now shows what
// it replaces with, and the active layer's node grows a second, dashed feed
// dropping past the rail — the golden path drawn solid, the exits drawn open.
// Hovering or clicking a node or a card drives it, and doing so stops the
// auto-advance for good.
export function ProductPlatform({ platform }: Pick<ProductPageContent, "platform">) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [driving, setDriving] = useState(false);
  const paused = useRef(false);
  const count = platform.integrations.length;

  useEffect(() => {
    if (reduce || driving) return;
    const t = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % count);
    }, HOLD * 1000);
    return () => clearInterval(t);
  }, [reduce, driving, count]);

  const drive = (i: number) => {
    setActive(i);
    setDriving(true);
  };

  return (
    <section
      className="relative overflow-hidden bg-white px-4 py-24 sm:px-8 sm:py-32"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl text-center max-md:text-left">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
              Built to work with the rest of Prisma
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {platform.body}
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-pretty font-semibold leading-relaxed text-foreground">
              {SWAP_LINE}
            </p>
          </Reveal>
        </div>

        {/* the connection canvas — hidden on mobile, where the cards alone
            carry the section */}
        <Reveal className="relative mt-6 hidden h-60 md:block">
          {/* full-bleed rail through the layer nodes, shimmering with a
              traveling band of spectrum */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[80%] h-px w-screen -translate-x-1/2 overflow-visible bg-black/[0.08]"
          >
            {!reduce && (
              <motion.span
                className="absolute -top-px h-[3px] w-48 rounded-full opacity-70 blur-[1px]"
                style={{
                  background:
                    "linear-gradient(to right, transparent, var(--color-prism-cyan-400), var(--color-prism-yellow-300), var(--color-prism-red-500), transparent)",
                }}
                initial={{ left: "-15%" }}
                animate={{ left: "115%" }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>

          {/* curves from the mark down to each layer */}
          <svg
            aria-hidden
            className="absolute inset-0 size-full"
            viewBox="0 0 1152 240"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="platform-prism" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-prism-cyan-400)" />
                <stop offset="55%" stopColor="var(--color-prism-yellow-300)" />
                <stop offset="100%" stopColor="var(--color-prism-red-500)" />
              </linearGradient>
            </defs>
            {platform.integrations.map((_, i) => (
              <path
                key={i}
                d={curve(i, count)}
                stroke="var(--color-border)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* the active layer's exit: a dashed stub dropping past the rail,
                the visual counterpart of the "swaps for" row on its card */}
            <motion.path
              key={`exit-${active}`}
              d={`M${nodeX(active, count)},${NODE_Y} L${nodeX(active, count)},236`}
              stroke="var(--color-border)"
              strokeWidth="1"
              strokeDasharray="3 4"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? undefined : { pathLength: 0 }}
              animate={reduce ? undefined : { pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.25 }}
            />
            {/* active connection draws in with the spectrum */}
            {!reduce && (
              <motion.path
                key={active}
                d={curve(active, count)}
                stroke="url(#platform-prism)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </svg>

          {/* the Prisma mark — the source every layer connects through */}
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2">
            <IconTile className="size-14 rounded-2xl">
              <PrismaMark className="size-6" />
            </IconTile>
          </div>

          {/* layer nodes on the rail */}
          {platform.integrations.map(({ icon, product }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            const isActive = reduce || i === active;
            return (
              <motion.button
                key={i}
                type="button"
                aria-label={`Show what ${product} works with, and what it swaps for`}
                onClick={() => drive(i)}
                onMouseEnter={() => drive(i)}
                className="absolute top-[80%] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${(nodeX(i, count) / 1152) * 100}%` }}
                animate={{ opacity: isActive ? 1 : 0.45, scale: isActive ? 1.08 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <IconTile>
                  <Icon className="size-5 text-foreground" />
                </IconTile>
              </motion.button>
            );
          })}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 max-md:mt-14 sm:grid-cols-2 md:mt-8 lg:grid-cols-4">
          {platform.integrations.map(({ icon, product, benefit, alternatives, href }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            const isActive = reduce || i === active;
            return (
              <Reveal key={i} delay={(i % 4) * 0.08} className="h-full">
                <div
                  onMouseEnter={() => drive(i)}
                  className={cn(
                    "flex h-full flex-col items-start gap-4 rounded-xl border bg-white p-6 transition-colors duration-500",
                    isActive ? "border-black/[0.14]" : "border-black/[0.06]",
                  )}
                >
                  <IconTile className="lg:hidden">
                    <Icon className="size-5 text-foreground" />
                  </IconTile>
                  <div className="grow">
                    <h3 className="text-lg">Works with {product}</h3>
                    <p className="mt-2 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                      {benefit}
                    </p>
                  </div>

                  {/* the anti-lock-in half. Always legible rather than hidden
                      behind the interaction — the point is that a visitor who
                      never clicks anything still sees the exits. */}
                  <div className="w-full border-t border-black/[0.06] pt-4">
                    <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/70">
                      <Swap className="size-3" aria-hidden />
                      Swaps for
                    </p>
                    {/* two chip rows' worth of height whatever the count, so
                        the "Swaps for" rules line up across the row instead of
                        stepping with each card's chip count */}
                    <ul className="mt-2.5 flex min-h-[4rem] flex-wrap content-start gap-1.5">
                      {alternatives.map((alt) => (
                        <li
                          key={alt}
                          className={cn(
                            "rounded-md border px-2 py-1 text-[0.75rem] font-medium transition-colors duration-500",
                            isActive
                              ? "border-black/[0.1] bg-card text-foreground"
                              : "border-black/[0.05] bg-card text-muted-foreground",
                          )}
                        >
                          {alt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {href ? <LearnMore href={href} product={product} className="mt-0" /> : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
