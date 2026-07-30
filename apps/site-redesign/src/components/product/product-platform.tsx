"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IconTile } from "@/components/brand/icon-tile";
import { LearnMore } from "@/components/brand/learn-more";
import { Reveal } from "@/components/motion/reveal";
import { PRODUCT_ICONS } from "./icons";
import type { ProductPageContent } from "./types";

// Seconds each product stays highlighted before the pulse moves on.
const HOLD = 2.8;

// Node x-positions inside the 1152-wide canvas — the centers of the three
// card columns below (1/6, 1/2, 5/6).
const XS = [192, 576, 960];
const CURVES = [
  "M576,44 C576,132 192,104 192,192",
  "M576,44 L576,192",
  "M576,44 C576,132 960,104 960,192",
];

function PrismaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76.817 76.817" className={className} aria-hidden>
      <path d="M15.5417 0V0.0303339L0 15.5671V43.6548L43.6729 0H15.5417Z" fill="#04D5E7" />
      <path d="M76.817 0H47.7408L0 47.721V76.817H29.0473L76.817 29.0657V0Z" fill="#FE4352" />
      <path d="M33.1143 76.8175H61.2454L76.8175 61.2504V33.1309L33.1143 76.8175Z" fill="#FEBE29" />
    </svg>
  );
}

// The cross-sell as one connected system: a full-bleed rail carries a
// traveling prism shimmer, the three products sit on the rail above their
// cards, and the Prisma mark above feeds each of them in turn — the active
// connection draws in, its node and card light up together.
export function ProductPlatform({ platform }: Pick<ProductPageContent, "platform">) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = platform.integrations.length;

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), HOLD * 1000);
    return () => clearInterval(t);
  }, [reduce, count]);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
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
        </div>

        {/* the connection canvas — hidden on mobile, where the cards alone
            carry the section */}
        <Reveal className="relative mt-4 hidden h-60 md:block">
          {/* full-bleed rail through the product nodes, shimmering with a
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

          {/* curves from the mark down to each product node */}
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
            {CURVES.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="var(--color-border)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {/* active connection draws in with the spectrum */}
            {!reduce && (
              <motion.path
                key={active}
                d={CURVES[active % CURVES.length]}
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

          {/* the Prisma mark — the source every product connects through */}
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2">
            <IconTile className="size-14 rounded-2xl">
              <PrismaMark className="size-6" />
            </IconTile>
          </div>

          {/* product nodes on the rail */}
          {platform.integrations.map(({ icon }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            const isActive = reduce || i === active;
            return (
              <motion.div
                key={i}
                className="absolute top-[80%] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(XS[i % XS.length] / 1152) * 100}%` }}
                animate={{ opacity: isActive ? 1 : 0.45, scale: isActive ? 1.08 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <IconTile>
                  <Icon className="size-5 text-foreground" />
                </IconTile>
              </motion.div>
            );
          })}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 max-md:mt-14 md:grid-cols-3">
          {platform.integrations.map(({ icon, product, benefit, href }, i) => {
            const Icon = PRODUCT_ICONS[icon];
            return (
              <Reveal key={i} delay={i * 0.1} className="h-full">
                <div className="flex h-full flex-col items-start gap-4 rounded-xl border border-black/[0.06] bg-white p-7">
                  <IconTile className="md:hidden">
                    <Icon className="size-5 text-foreground" />
                  </IconTile>
                  <div className="grow">
                    <h3 className="text-lg">Works with {product}</h3>
                    <p className="mt-2 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                      {benefit}
                    </p>
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
