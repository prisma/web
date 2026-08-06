"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRightBold,
  Bot,
  Code,
  Database,
  Repeat,
  Server,
  Swap,
} from "@/components/icons/forma";
import { cn } from "@/lib/utils";

// The interactive half of the platform section.
//
// Two earlier attempts failed the same way: they listed each layer's
// alternatives as equal-weight rows, which read as a comparison table and gave
// no reason to touch anything. This one is built around a single mechanic —
// every layer has one slot, and you swap what's in it. Click an alternative and
// it physically flies up into the slot while the current occupant drops into
// its place, on a shared-layout tween. The motion IS the affordance: things
// move where you clicked, so the thing looks clickable.
//
// The message rides on the mechanic. Each slot holding its Prisma option glows
// in that product's brand hue and the pipeline between them flows; swap one out
// and that stretch of the pipeline goes grey and still. The path dims, it never
// breaks — which is exactly "best together, swappable when needed".
//
// Layers run cyan → yellow → red: the canonical product-accent order (icons.ts)
// and the order you'd build in — schema, data, deploy.

type Option = {
  name: string;
  /** The Prisma option. Exactly one per layer, and always listed first. */
  prisma?: boolean;
  /** What this choice buys you, or costs you. Shown under the pipeline. */
  note: string;
};

type Layer = {
  key: string;
  label: string;
  Icon: typeof Database;
  /** Brand hue for this layer, applied while its Prisma option is in the slot. */
  lit: { text: string; bg: string; border: string; glow: string };
  /** Gradient for the pipe leaving this layer. Absent on the last one. */
  pipe?: string;
  options: Option[];
};

const LAYERS: Layer[] = [
  {
    key: "orm",
    label: "ORM",
    Icon: Code,
    lit: {
      text: "text-prism-cyan-800",
      bg: "bg-prism-cyan-50",
      border: "border-prism-cyan-300",
      glow: "shadow-[0_0_0_4px_rgba(1,215,228,0.09),0_14px_32px_-16px_rgba(1,215,228,0.5)]",
    },
    pipe: "from-prism-cyan-400 to-prism-yellow-400",
    options: [
      {
        name: "Prisma ORM",
        prisma: true,
        note: "One schema generates your client, your migrations and your types — and every other layer reads that same file.",
      },
      {
        name: "Drizzle",
        note: "Still works. Prisma Postgres is standard Postgres, so any client connects — you just give up the generated client and the migration guardrails.",
      },
      {
        name: "Kysely",
        note: "Still works over a standard connection. You define your own types and own your migrations.",
      },
      {
        name: "raw SQL",
        note: "Still works — none of this requires an ORM at all. You trade type-safety at the query layer for full control.",
      },
    ],
  },
  {
    key: "database",
    label: "Database",
    Icon: Database,
    lit: {
      text: "text-prism-yellow-800",
      bg: "bg-prism-yellow-50",
      border: "border-prism-yellow-300",
      glow: "shadow-[0_0_0_4px_rgba(243,195,6,0.1),0_14px_32px_-16px_rgba(243,195,6,0.55)]",
    },
    pipe: "from-prism-yellow-400 to-prism-red-500",
    options: [
      {
        name: "Prisma Postgres",
        prisma: true,
        note: "Branches with your app per PR, one config declares both halves, and it's standard Postgres underneath.",
      },
      {
        name: "Supabase",
        note: "Still works — Prisma ORM targets any Postgres. You wire the connection yourself, and branching stops travelling with your deploys.",
      },
      {
        name: "Neon",
        note: "Still works. Point the datasource at Neon and your schema and client are unchanged; branching becomes two systems to keep in step.",
      },
      {
        name: "Amazon RDS",
        note: "Still works — it's a standard connection string. Capacity planning and backups come back to you.",
      },
    ],
  },
  {
    key: "hosting",
    label: "Hosting",
    Icon: Server,
    lit: {
      text: "text-prism-red-800",
      bg: "bg-prism-red-50",
      border: "border-prism-red-300",
      glow: "shadow-[0_0_0_4px_rgba(244,53,49,0.08),0_14px_32px_-16px_rgba(244,53,49,0.5)]",
    },
    options: [
      {
        name: "Prisma Compute",
        prisma: true,
        note: "App and database branch and deploy as one unit, co-located, with no cross-vendor hop between them.",
      },
      {
        name: "Vercel",
        note: "Still works — Prisma Postgres is reachable over a standard connection string. Your queries now cross a network boundary Compute doesn't have.",
      },
      {
        name: "Railway",
        note: "Still works. Deploy anywhere that runs Node or Bun; app and database stop branching together.",
      },
      {
        name: "your own host",
        note: "Still works — nothing here is tied to our runtime. Deploys and database environments go back to being separate concerns.",
      },
    ],
  },
];

const AGENTS = ["Claude Code", "Codex", "Cursor", "Windsurf"];

const GOLDEN_NOTE =
  "Everything wired for you: one config, per-PR branching across app and database, and no network hop between them.";

/** Seconds the agent row holds each name. */
const AGENT_HOLD = 2.2;

// Drag is a mouse enhancement only. On touch, framer would capture the gesture
// and the page would stop scrolling wherever the bench is under your thumb.
const FINE_POINTER = "(pointer: fine)";

const SWAP_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

// The slot exchange. Deliberately NOT a `layoutId` flight from the bench up
// into the slot: the two nodes sit in very different parents, and framer treats
// that pairing as a crossfade — measured, it drove the incoming element to
// opacity 0 at the OLD position and held it there for about a second before
// snapping into place, which read as the whole control freezing on click.
//
// Directional slides get the same reading for free and are deterministic: the
// bench is below the slot, so an incoming pick rises from below and the outgoing
// one drops toward the bench it's about to join.
const RISE = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
const SLOT_EXIT = { opacity: 0, y: 12 };
const SLOT_TWEEN = { duration: 0.26, ease: [0.22, 1, 0.36, 1] } as const;

function PrismaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76.817 76.817" className={className} aria-hidden>
      <path d="M15.5417 0V0.0303339L0 15.5671V43.6548L43.6729 0H15.5417Z" fill="#04D5E7" />
      <path d="M76.817 0H47.7408L0 47.721V76.817H29.0473L76.817 29.0657V0Z" fill="#FE4352" />
      <path d="M33.1143 76.8175H61.2454L76.8175 61.2504V33.1309L33.1143 76.8175Z" fill="#FEBE29" />
    </svg>
  );
}

/**
 * The stretch of pipeline between two slots. Flows only while the layers on
 * both sides are still Prisma — so breaking the path dims exactly the reach it
 * affects, rather than the whole diagram.
 */
function Pipe({
  live,
  gradient,
  reduce,
}: {
  live: boolean;
  gradient: string;
  reduce: boolean | null;
}) {
  return (
    <div
      aria-hidden
      // mt lands the pipe on the slot's vertical centre: the label row, its
      // margin, and half the slot's 3.75rem height
      className="relative mt-[3.4rem] hidden h-1 w-10 shrink-0 self-start overflow-hidden md:block"
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r transition-opacity duration-500",
          gradient,
          live ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-0 top-[1px] h-[2px] rounded-full bg-black/[0.09] transition-opacity duration-500",
          live ? "opacity-0" : "opacity-100",
        )}
      />
      {live && !reduce && (
        <motion.span
          className="absolute top-0 size-1 rounded-full bg-white shadow-[0_0_0_1px_rgba(21,21,21,0.15)]"
          initial={{ left: "-12%" }}
          animate={{ left: "112%" }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}

export function PlatformStack() {
  const reduce = useReducedMotion();
  // index into each layer's options; 0 is always the Prisma one
  const [picked, setPicked] = useState<number[]>(() => LAYERS.map(() => 0));
  const [note, setNote] = useState<string | null>(null);
  // layers swapped away from Prisma, oldest first — the queue the floor rule
  // below draws from
  const [swapOrder, setSwapOrder] = useState<number[]>([]);
  // set briefly when the floor rule pulls a layer back, so the slot can pop
  const [restored, setRestored] = useState<number | null>(null);
  const [agent, setAgent] = useState(0);
  const [agentDriven, setAgentDriven] = useState(false);
  // which layer is being dragged over, so its slot can advertise the drop
  const [dragging, setDragging] = useState<number | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** True between a drag release and the next pointerdown — see the bench. */
  const didDrag = useRef(false);

  const isGolden = picked.every((i) => i === 0);

  // Subscribed rather than set from an effect: it's external state, the server
  // snapshot is a plain `false` so hydration matches, and it keeps up if the
  // pointer type changes under us (a tablet gaining a trackpad).
  const canDrag = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(FINE_POINTER);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );

  useEffect(() => {
    if (reduce || agentDriven) return;
    const t = setInterval(() => setAgent((a) => (a + 1) % AGENTS.length), AGENT_HOLD * 1000);
    return () => clearInterval(t);
  }, [reduce, agentDriven]);

  // clear the pop so restoring the same layer twice re-triggers it
  useEffect(() => {
    if (restored === null) return;
    const t = setTimeout(() => setRestored(null), 700);
    return () => clearTimeout(t);
  }, [restored]);

  const choose = (layer: number, option: number) => {
    const next = picked.map((v, i) => (i === layer ? option : v));
    // queue the layer if it just left Prisma, drop it if it just came back
    let order = swapOrder.filter((i) => i !== layer);
    if (option !== 0) order = [...order, layer];

    // The floor: never let the stack reach zero Prisma layers. Swapping the
    // last one out gets the longest-ago swap pulled back instead — never the
    // layer just clicked, which would read as the control refusing the input.
    let pulledBack: number | null = null;
    if (next.every((v) => v !== 0)) {
      pulledBack = order.find((i) => i !== layer) ?? next.findIndex((_, i) => i !== layer);
      next[pulledBack] = 0;
      order = order.filter((i) => i !== pulledBack);
    }

    setPicked(next);
    setSwapOrder(order);
    setRestored(pulledBack);
    setNote(
      pulledBack === null
        ? LAYERS[layer].options[option].note
        : // Said plainly rather than dressed up as a technical constraint —
          // a control that quietly overrides you is worse than one that owns it.
          `${LAYERS[pulledBack].options[0].name} slid back in — we'll swap out any layer, just not all of them at once.`,
    );
  };

  return (
    <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.04),0_24px_64px_-32px_rgba(21,21,21,0.2)]">
      <div className="flex items-center gap-4 border-b border-black/[0.06] px-6 py-4 sm:px-8">
        <p className="text-[0.8125rem] font-semibold text-foreground">
          Swap any layer. <span className="font-normal text-muted-foreground">It still works.</span>
        </p>
        <div className="ml-auto flex items-center gap-2">
          {!isGolden && (
            <button
              type="button"
              onClick={() => {
                setPicked(LAYERS.map(() => 0));
                setSwapOrder([]);
                setRestored(null);
                setNote(null);
              }}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.8125rem] font-semibold text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              <Repeat className="size-3.5" aria-hidden />
              Reset
            </button>
          )}
          {/* the scoreboard — the thing you're trying not to lose, which is what
              makes swapping a layer feel like it costs something */}
          <span
            className={cn(
              "relative flex items-center gap-2 overflow-hidden rounded-full border px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-500",
              isGolden
                ? "border-black/[0.08] text-foreground"
                : "border-transparent text-muted-foreground",
            )}
          >
            {isGolden && (
              <span
                aria-hidden
                className="absolute inset-0 opacity-25"
                style={{
                  background:
                    "linear-gradient(85deg, #01d7e4 0%, #f3c306 35%, #f37a03 60%, #f43531 100%)",
                }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {isGolden ? <PrismaMark className="size-3.5" /> : null}
              {isGolden ? "Golden path" : "Custom stack"}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 md:flex-row md:gap-0">
        {LAYERS.map((layer, li) => {
          const current = layer.options[picked[li]];
          const lit = picked[li] === 0;
          const { Icon } = layer;
          const nextLit = li < LAYERS.length - 1 && lit && picked[li + 1] === 0;
          return [
            <div key={layer.key} className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                <Icon
                  className={cn(
                    "size-3 transition-colors duration-500",
                    lit ? layer.lit.text : "text-muted-foreground/50",
                  )}
                  aria-hidden
                />
                {layer.label}
              </p>

              {/* the slot. One per layer, and the only thing here at full size.
                  It pops when the floor rule pulls this layer back, so the
                  change never happens somewhere the eye isn't looking. */}
              <motion.div
                ref={(el) => {
                  slotRefs.current[li] = el;
                }}
                animate={restored === li && !reduce ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "mt-2 flex h-[3.75rem] items-center rounded-xl border px-4 transition-shadow duration-500",
                  lit
                    ? cn(layer.lit.border, layer.lit.bg, layer.lit.glow)
                    : "border-black/[0.12] bg-muted/40",
                  // advertise the target the moment a drag starts, so the
                  // gesture has somewhere obvious to land
                  dragging === li &&
                    "outline outline-2 outline-offset-2 outline-dashed outline-foreground/30",
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={current.name}
                    initial={reduce ? false : RISE.initial}
                    animate={RISE.animate}
                    exit={reduce ? undefined : SLOT_EXIT}
                    transition={reduce ? { duration: 0 } : SLOT_TWEEN}
                    className={cn(
                      "flex items-center gap-2 text-[0.9375rem] font-semibold",
                      lit ? layer.lit.text : "text-foreground",
                    )}
                  >
                    {current.prisma ? <PrismaMark className="size-4" /> : null}
                    {current.name}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              <p className="mt-4 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
                <Swap className="size-3" aria-hidden />
                Swap for
              </p>

              {/* The bench. Click promotes into the slot above; so does
                  dragging one up onto it, which is the reflex most people
                  reach for first. Click stays the primary path — it's the
                  keyboard-reachable one, and the only one on touch. */}
              <div className="mt-2 flex flex-col gap-1.5">
                <AnimatePresence initial={false}>
                  {layer.options.map((option, oi) =>
                    oi === picked[li] ? null : (
                      <motion.button
                        key={option.name}
                        // `layout` is deliberately absent: combining it with
                        // `drag` on one element makes framer fight itself over
                        // the transform, and the exit is quick enough that the
                        // remaining rows closing up reads fine without it.
                        initial={reduce ? false : { opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                        transition={reduce ? { duration: 0 } : SWAP_SPRING}
                        drag={canDrag}
                        dragSnapToOrigin
                        dragMomentum={false}
                        dragElastic={0.18}
                        whileDrag={{ scale: 1.04, zIndex: 40 }}
                        onDragStart={() => {
                          setDragging(li);
                          // Framer does NOT swallow the click a drag release
                          // fires, and the element has travelled under the
                          // cursor, so releasing anywhere lands a click on it —
                          // measured, dropping on empty space swapped the layer
                          // anyway. The flag has to be raised on drag START:
                          // onDragEnd runs AFTER the click, so setting it there
                          // was already too late. Cleared on the next
                          // pointerdown, which is deterministic and survives
                          // this button unmounting after a successful drop.
                          didDrag.current = true;
                        }}
                        onDragEnd={(event) => {
                          setDragging(null);
                          const slot = slotRefs.current[li];
                          const p = event as PointerEvent;
                          if (!slot || p.clientX == null) return;
                          const r = slot.getBoundingClientRect();
                          const hit =
                            p.clientX >= r.left &&
                            p.clientX <= r.right &&
                            p.clientY >= r.top &&
                            p.clientY <= r.bottom;
                          if (!hit) return;
                          choose(li, oi);
                        }}
                        type="button"
                        // every fresh gesture clears the flag, so a drag can
                        // only ever suppress its own trailing click
                        onPointerDown={() => {
                          didDrag.current = false;
                        }}
                        onClick={() => {
                          if (didDrag.current) return;
                          choose(li, oi);
                        }}
                        className={cn(
                          "group relative flex items-center gap-2 rounded-lg border border-black/[0.09] bg-white px-3 py-2 text-left text-[0.875rem] font-medium text-muted-foreground transition-colors duration-200 hover:border-black/20 hover:text-foreground",
                          canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                        )}
                      >
                        {option.prisma ? <PrismaMark className="size-3.5" /> : null}
                        {option.name}
                        {/* faintly present at rest so the row reads as a
                            control, not a list item; it firms up on hover */}
                        <ArrowRightBold
                          className="ml-auto size-3.5 -rotate-90 text-foreground/20 transition-colors duration-200 group-hover:text-foreground/60"
                          aria-hidden
                        />
                      </motion.button>
                    ),
                  )}
                </AnimatePresence>
              </div>
            </div>,
            layer.pipe ? (
              <Pipe
                key={`${layer.key}-pipe`}
                live={nextLit}
                gradient={layer.pipe}
                reduce={reduce}
              />
            ) : null,
          ];
        })}
      </div>

      {/* The consequence of whatever you just picked. The honest half, and the
          place the best-together argument actually gets made — every swap says
          what still works and what you now own yourself. */}
      <div className="border-t border-black/[0.06] bg-muted/25 px-6 py-5 sm:px-8">
        <motion.p
          key={isGolden ? "golden" : note}
          initial={reduce ? undefined : { opacity: 0, y: 4 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="min-h-[2.75rem] text-[0.9375rem] leading-relaxed text-muted-foreground"
        >
          {isGolden ? GOLDEN_NOTE : note}
        </motion.p>
      </div>

      {/* The agent row sits outside the pipeline on purpose: there is no Prisma
          option to pick here, every agent is equally supported, and a highlight
          that cycles on its own says that faster than four more controls. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-black/[0.06] px-6 py-4 sm:px-8">
        <span className="flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
          <Bot className="size-3" aria-hidden />
          Driven by
        </span>
        {AGENTS.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setAgent(i);
              setAgentDriven(true);
            }}
            className={cn(
              "relative rounded-lg px-2.5 py-1 text-[0.8125rem] font-semibold transition-colors duration-300 cursor-pointer",
              i === agent ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {i === agent && (
              <motion.span
                layoutId="pick-agent"
                aria-hidden
                className="absolute inset-0 rounded-lg border border-black/[0.14] bg-muted/70"
                transition={reduce ? { duration: 0 } : SWAP_SPRING}
              />
            )}
            <span className="relative">{name}</span>
          </button>
        ))}
        <span className="text-[0.8125rem] text-muted-foreground max-lg:w-full">
          — all equally supported.
        </span>
      </div>
    </div>
  );
}
