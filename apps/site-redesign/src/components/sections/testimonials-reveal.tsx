"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "@/components/icons/forma"
import { cn } from "@/lib/utils"

// Horizontal testimonial queue (canopyservicing.com "Trusted by modern
// lending teams"): three cards visible — one open, two collapsed into
// blurred strips (the "+" blurs with them, like the reference). Selecting a
// strip promotes it to the open slot, the row slides left, and a fresh strip
// enters from the right. Arrows/dots page through all of them.
// Quotes sourced verbatim (trimmed) from prisma.io customer case studies:
// Bucket, Solin, Grover, Invisible, Poppy, Pearly Plan.
// Card media uses the soft-light editorial set (/brand/testimonial-light-1..5)
// under a white overlay — light mode, like the rest of the site. Five photos
// for six quotes: Invisible reuses 1, placed three positions from Bucket so
// the same photo never shows twice in one 3-card window.
// Client logos are the real brand marks (/logos/customers/*.png).

type Testimonial = {
  quote: string
  name: string
  role: string
  company: string
  photo: string
  logo?: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    photo: "/brand/testimonial-light-1.jpg",
    quote:
      "Prisma makes database management incredibly easy. Prisma's built-in type safety helps us avoid mistakes that happen with manual setups.",
    name: "Ron Cohen",
    role: "Co-founder & CTO",
    company: "Bucket",
  },
  {
    photo: "/brand/testimonial-light-2.jpg",
    quote:
      "We are able to take advantage of caching to speed up queries and reduce latency, making them lightning fast.",
    name: "Blake Carroll",
    role: "CTO",
    company: "Solin",
    logo: "/logos/customers/solin.png",
  },
  {
    photo: "/brand/testimonial-light-3.jpg",
    quote:
      "Prisma has a low learning curve. Productivity becomes higher because it gets combined with end-to-end type-safety using TypeScript.",
    name: "Ricardo Almeida",
    role: "Software Engineer",
    company: "Grover",
    logo: "/logos/customers/grover.png",
  },
  {
    photo: "/brand/testimonial-light-1.jpg",
    quote:
      "Prisma's approach to type-safe ORM is next-level. It provides full type-safety without any codegen or messy types and interfaces to write and maintain.",
    name: "Pieter Venter",
    role: "Sr. Software Engineer",
    company: "Invisible",
    logo: "/logos/customers/invisible.png",
  },
  {
    photo: "/brand/testimonial-light-4.jpg",
    quote:
      "The combination of Prisma, TypeScript and our pretty thorough coverage with integration tests gives us the confidence to refactor critical parts of our code.",
    name: "Thibaut Nguyen",
    role: "CTO",
    company: "Poppy",
    logo: "/logos/customers/poppy.png",
  },
  {
    photo: "/brand/testimonial-light-5.jpg",
    quote:
      "This is the fastest I've ever developed in my life, by far. The tooling has dramatically cut down on the amount of time I've had to spend.",
    name: "Sean Emmer",
    role: "CTO & Co-Founder",
    company: "Pearly Plan",
    logo: "/logos/customers/pearly.png",
  },
]

const VISIBLE = 3
const EASE = [0.32, 0.72, 0, 1] as const

function Media({ t }: { t: Testimonial }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={t.photo}
      alt=""
      loading="lazy"
      draggable={false}
      className="absolute inset-0 size-full object-cover"
    />
  )
}

export function TestimonialsReveal() {
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const count = TESTIMONIALS.length
  const visible = Array.from({ length: VISIBLE }, (_, k) => (active + k) % count)

  return (
    <section className="bg-white px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          Real teams, real builds
        </h2>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* spacing lives on each card as an animated marginLeft (not a flex
              gap): the exiting card's margin collapses in step with its
              width, so nothing snaps when it finally unmounts */}
          <div className="mt-14 flex md:h-[30rem]">
            <AnimatePresence initial={false}>
              {visible.map((idx, pos) => {
                const t = TESTIMONIALS[idx]
                const isOpen = pos === 0
                return (
                  <motion.article
                    key={t.company}
                    initial={reduceMotion ? false : { flexGrow: 0.001, marginLeft: 0 }}
                    animate={{ flexGrow: isOpen ? 3 : 1, opacity: 1, marginLeft: pos === 0 ? 0 : 12 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { flexGrow: 0.001, marginLeft: 0, opacity: 0 }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.65,
                      ease: EASE,
                      // fade trails the collapse: stays near-opaque while the
                      // width shrinks, dropping out in the final stretch
                      opacity: { duration: reduceMotion ? 0 : 0.65, ease: "easeIn" },
                    }}
                    style={{ flexBasis: 0 }}
                    className={cn(
                      "relative min-w-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-white",
                      !isOpen && "max-md:hidden",
                    )}
                  >
                    {/* full-bleed media behind everything */}
                    <Media t={t} />

                    {/* open card — very dark overlay, quote across the card */}
                    <div
                      aria-hidden={!isOpen || undefined}
                      className={cn(
                        "relative transition-opacity duration-300 md:h-full",
                        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                      )}
                    >
                      <div aria-hidden className="absolute inset-0 bg-white/65 backdrop-blur-[2px]" />
                      <figure className="relative flex h-full min-h-[26rem] flex-col p-6 sm:p-8 md:min-w-[36rem] md:p-10">
                        <div className="flex items-center gap-2.5">
                          {t.logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={t.logo}
                              alt=""
                              loading="lazy"
                              draggable={false}
                              className="size-8 shrink-0 rounded-lg object-cover ring-1 ring-black/[0.08]"
                            />
                          )}
                          <span className="text-sm font-semibold text-foreground">{t.company}</span>
                        </div>
                        {/* quote centered; right-to-left clip wipe synced with
                            the card's expansion */}
                        <blockquote
                          className={cn(
                            "my-auto max-w-[44ch] py-8 text-pretty text-xl font-medium leading-snug text-foreground transition-[clip-path] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none sm:text-2xl",
                            isOpen
                              ? "[clip-path:inset(0)]"
                              : "[clip-path:inset(0_100%_0_0)]",
                          )}
                        >
                          &ldquo;{t.quote}&rdquo;
                        </blockquote>
                        {/* attribution pinned to the bottom, same wipe a beat later */}
                        <figcaption
                          className={cn(
                            "transition-[clip-path] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                            isOpen
                              ? "[clip-path:inset(0)] [transition-delay:120ms]"
                              : "[clip-path:inset(0_100%_0_0)]",
                          )}
                        >
                          <p className="text-sm font-semibold text-foreground">{t.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t.role}, {t.company}
                          </p>
                        </figcaption>
                      </figure>
                    </div>

                    {/* collapsed strip — everything blurred, including the "+" */}
                    <div
                      aria-hidden={isOpen || undefined}
                      className={cn(
                        "group/strip absolute inset-0 hidden transition-opacity duration-500 md:block",
                        isOpen ? "pointer-events-none opacity-0" : "opacity-100 md:delay-100",
                      )}
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        {/* media blurs hard; the plus only gets a soft glass
                            blur so it still reads as an affordance */}
                        <div className="absolute inset-0 scale-110 blur-[10px] transition-[filter] duration-300 group-hover/strip:blur-[6px] motion-reduce:transition-none">
                          <Media t={t} />
                        </div>
                        <div className="absolute inset-0 bg-white/40" />
                        <span
                          aria-hidden
                          className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-prism-yellow-300 text-2xl font-medium leading-none text-black blur-[1.5px] transition-[filter,scale] duration-300 group-hover/strip:scale-110 group-hover/strip:blur-0 motion-reduce:transition-none"
                        >
                          +
                        </span>
                      </div>
                      {!isOpen && (
                        <button
                          type="button"
                          aria-label={`Show ${t.company} testimonial`}
                          onClick={() => setActive(idx)}
                          className="absolute inset-0 cursor-pointer focus-visible:outline-none"
                        />
                      )}
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </div>

          {/* pager — spectrum dot + prism arrows, echoing the "+" affordance */}
          <div className="mt-7 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.company}
                  type="button"
                  aria-label={`Go to ${t.company} testimonial`}
                  aria-current={i === active || undefined}
                  onClick={() => setActive(i)}
                  className={cn(
                    "size-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                    i === active
                      ? "scale-110 bg-foreground"
                      : "bg-foreground/15 hover:scale-125 hover:bg-foreground/35",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => setActive((a) => (a - 1 + count) % count)}
                className="spectrum-border grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.06)] transition-[border-color,scale] duration-500 hover:border-transparent active:scale-95 motion-reduce:transition-none"
              >
                <ArrowRight className="size-4 rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => setActive((a) => (a + 1) % count)}
                className="spectrum-border grid size-11 place-items-center rounded-full border border-black/[0.08] bg-white text-foreground shadow-[0_1px_2px_rgba(21,21,21,0.06)] transition-[border-color,scale] duration-500 hover:border-transparent active:scale-95 motion-reduce:transition-none"
              >
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
