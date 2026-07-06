"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@prisma/eclipse";
import { BunMark } from "./bun-mark";
import { PrismaMark } from "./prisma-mark";
import styles from "./stack.module.css";
import { frameworks } from "./stack-data";

const accentPPG = {
  "--accent": "var(--color-foreground-ppg)",
} as CSSProperties;
const accentViolet = {
  "--accent": "var(--color-foreground-violet)",
} as CSSProperties;

/** Orthogonal connectors drawn between diagram nodes. */
const FLOW_LINKS: [string, string][] = [
  ["n-frontend", "n-compute"],
  ["n-backend", "n-compute"],
  ["n-orm", "n-postgres"],
  ["n-compute", "n-fimage"],
  ["n-compute", "n-ffile"],
  ["n-compute", "n-fredis"],
  ["n-compute", "n-fmore"],
  ["n-postgres", "n-pgvector"],
  ["n-postgres", "n-pgsearch"],
  ["n-postgres", "n-pgstat"],
  ["n-postgres", "n-pgmore"],
];

function Leaf({ id, name, role }: { id: string; name: string; role: string }) {
  return (
    <div className={`${styles.node} ${styles.leaf}`} data-node={id} style={accentPPG}>
      <div className={styles["node-title"]}>
        {name} <span className={styles["leaf-dim"]}>{role}</span>
      </div>
    </div>
  );
}

export function StackDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [swapping, setSwapping] = useState(false);

  const fw = frameworks[idx];

  const drawFlow = useCallback(() => {
    const flow = flowRef.current;
    const svg = svgRef.current;
    const root = rootRef.current;
    if (!flow || !svg || !root) return;

    // measure in the diagram's natural (unscaled) coordinate space
    flow.style.transform = "none";
    flow.style.marginBottom = "";
    const W = flow.offsetWidth;
    const H = flow.offsetHeight;

    // offset geometry (relative to #flow) is immune to the scale transform
    // applied below, unlike getBoundingClientRect
    const rel = (id: string) => {
      const el = root.querySelector<HTMLElement>(`[data-node="${id}"]`);
      if (!el) return null;
      let x = 0;
      let y = 0;
      let n: HTMLElement | null = el;
      while (n && n !== flow) {
        x += n.offsetLeft;
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      return {
        left: x,
        right: x + w,
        top: y,
        bottom: y + h,
        cx: x + w / 2,
        cy: y + h / 2,
      };
    };
    const elbow = (a: string, b: string) => {
      const s = rel(a);
      const t = rel(b);
      if (!s || !t) return "";
      const mx = (s.right + t.left) / 2;
      return `M ${s.right} ${s.cy} H ${mx} V ${t.cy} H ${t.left}`;
    };

    let paths = FLOW_LINKS.map((l) => {
      const d = elbow(l[0], l[1]);
      return d
        ? `<path d="${d}" class="${styles["flow-path"]}" marker-end="url(#flowArrow)" />`
        : "";
    }).join("");

    // dashed sub-ms latency link between Compute and Postgres
    const c = rel("n-compute");
    const p = rel("n-postgres");
    if (c && p) {
      const lx = c.cx;
      paths += `<path d="M ${lx} ${c.bottom} V ${p.top}" class="${styles["flow-path"]} ${styles.dashed}" marker-start="url(#flowArrow)" marker-end="url(#flowArrow)" />`;
      const badge = badgeRef.current;
      if (badge) {
        badge.style.left = `${lx}px`;
        badge.style.top = `${(c.bottom + p.top) / 2}px`;
      }
    }

    svg.setAttribute("width", String(W));
    svg.setAttribute("height", String(H));
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.innerHTML =
      `<defs><marker id="flowArrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-foreground-neutral-weaker)" /></marker></defs>` +
      paths;

    // scale the diagram down to fit its container so it never needs
    // horizontal scrolling on narrower viewports
    const scroller = flow.parentElement;
    if (!scroller) return;
    const cs = getComputedStyle(scroller);
    const avail = scroller.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const scale = Math.min(1, avail / W);
    if (scale < 1) {
      const tx = (avail - W * scale) / 2;
      flow.style.transformOrigin = "top left";
      flow.style.transform = `translateX(${tx}px) scale(${scale})`;
      flow.style.marginBottom = `${-(1 - scale) * H}px`;
    }
  }, []);

  // cycle the frontend framework in the header + diagram node
  useEffect(() => {
    let swapTimeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setSwapping(true);
      swapTimeout = setTimeout(() => {
        setIdx((i) => (i + 1) % frameworks.length);
        setSwapping(false);
      }, 240);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(swapTimeout);
    };
  }, []);

  // redraw connectors after the frontend node width changes
  useEffect(() => {
    drawFlow();
  }, [idx, drawFlow]);

  // draw on mount, on resize, and once fonts are ready
  useEffect(() => {
    // rAF-batch resize so a drag-resize doesn't thrash layout on every event
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(drawFlow);
    };
    drawFlow();
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(drawFlow);
    const t1 = setTimeout(drawFlow, 300);
    const t2 = setTimeout(drawFlow, 900);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [drawFlow]);

  return (
    <div ref={rootRef}>
      <h2
        className={`${styles["stack-simplified"]} text-2xl md:text-3xl text-foreground-neutral ${
          swapping ? styles.swapping : ""
        }`}
      >
        <span>The stack simplified:</span>
        <span className={styles["ss-eq"]}>
          <span className={styles["ss-leftcol"]}>
            <span className={styles["ss-brand"]}>Prisma</span>
            <span className={styles["ss-includes"]}>
              <span className={styles["ss-inc"]}>Bun</span>
              <span className={styles["ss-inc"]}>Postgres</span>
            </span>
          </span>
          <span className={styles["ss-plus"]}>+</span>
          <span className={styles["ss-fw"]}>{fw.name}</span>
        </span>
      </h2>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Button asChild variant="ppg" size="2xl">
          <a href="https://console.prisma.io" className="flex items-center gap-2">
            Start building
            <i className="fa-regular fa-arrow-right" aria-hidden />
          </a>
        </Button>
        <p className="m-0 text-sm text-foreground-neutral-weaker">
          <code className="font-mono text-foreground-ppg-strong">npx create-prisma</code> and you
          have compute, a database, and a runtime.
        </p>
      </div>

      <div className={`${styles["flow-scroll"]} mt-10`}>
        <div className={styles.flow} ref={flowRef}>
          {/* Column 1: everything you write, grouped under TypeScript */}
          <div className={styles["ts-group"]}>
            <div className={styles["ts-sub"]}>
              <div
                className={`${styles.node} ${styles["n-frontend"]} ${swapping ? styles.swapping : ""}`}
                data-node="n-frontend"
                style={accentViolet}
              >
                <div className={styles["node-eyebrow"]}>Frontend</div>
                <div className={styles["node-title"]}>
                  <span className={styles["mono-badge"]}>{fw.mono}</span>
                  <span>{fw.name}</span>
                </div>
                <span className={`${styles.pill} ${styles.open}`}>Fully open</span>
              </div>
              <div className={styles.node} data-node="n-backend" style={accentPPG}>
                <div className={styles["node-eyebrow"]}>Backend</div>
                <div className={styles["node-title"]}>
                  <span className={styles["node-icon"]}>
                    <BunMark className="size-[15px]" />
                  </span>
                  Bun
                </div>
                <div className={styles["node-sub"]}>test · build</div>
              </div>
            </div>
            <div className={styles["ts-sub"]}>
              <div className={styles.node} data-node="n-orm" style={accentPPG}>
                <div className={styles["node-eyebrow"]}>Data access</div>
                <div className={styles["node-title"]}>
                  <span className={styles["node-icon"]}>
                    <PrismaMark className="size-[14px]" />
                  </span>
                  Prisma ORM
                </div>
                <div className={styles["node-sub"]}>type-safety · query · migrations</div>
              </div>
            </div>
            <div className={styles["ts-label"]}>TypeScript</div>
          </div>

          {/* Column 2: managed platform */}
          <div
            className={`${styles.node} ${styles.root} ${styles["n-compute"]}`}
            data-node="n-compute"
            style={accentPPG}
          >
            <div className={styles["node-title"]}>
              <span className={styles["node-icon"]}>
                <i className="fa-regular fa-microchip" aria-hidden />
              </span>
              Prisma Compute
            </div>
            <div className={styles["node-sub"]}>
              <BunMark className="size-[13px] text-foreground-ppg" /> Bun runtime
            </div>
          </div>
          <div
            className={`${styles.node} ${styles.root} ${styles["n-postgres"]}`}
            data-node="n-postgres"
            style={accentPPG}
          >
            <div className={styles["node-title"]}>
              <span className={styles["node-icon"]}>
                <i className="fa-regular fa-database" aria-hidden />
              </span>
              Prisma Postgres
            </div>
            <div className={styles["node-sub"]}>
              <i className="fa-regular fa-server" aria-hidden /> Managed Postgres
            </div>
          </div>

          {/* Column 3: Compute's Bun features + Postgres extensions */}
          <div className={styles["feat-stack"]}>
            <Leaf id="n-fimage" name="Bun.image" role="images" />
            <Leaf id="n-ffile" name="Bun.file" role="file I/O" />
            <Leaf id="n-fredis" name="Bun.redis" role="cache" />
            <div
              className={`${styles.node} ${styles.leaf} ${styles["dots-leaf"]}`}
              data-node="n-fmore"
              style={accentPPG}
            >
              <div className={styles["node-title"]}>...</div>
            </div>
          </div>
          <div className={styles["ext-stack"]}>
            <Leaf id="n-pgvector" name="pgvector" role="AI retrieval" />
            <Leaf id="n-pgsearch" name="pg_search" role="full text search" />
            <Leaf id="n-pgstat" name="pg_stat_statements" role="performance tuning" />
            <div
              className={`${styles.node} ${styles.leaf} ${styles["dots-leaf"]}`}
              data-node="n-pgmore"
              style={accentPPG}
            >
              <div className={styles["node-title"]}>...</div>
            </div>
          </div>

          <svg className={styles["flow-svg"]} ref={svgRef} aria-hidden />
          <div className={styles["flow-badge"]} ref={badgeRef}>
            <i className="fa-regular fa-bolt" aria-hidden /> sub-ms latency
          </div>
        </div>
      </div>
    </div>
  );
}
