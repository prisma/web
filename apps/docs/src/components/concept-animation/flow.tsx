"use client";

import type { CSSProperties } from "react";
import type {
  FlowEdge,
  FlowNode,
  FlowRow,
  FlowScene,
  FlowVariant,
  RowOrigin,
  Side,
} from "./flow-presets";
import { PlayerShell } from "./shell";

const EDGE_COLOR = "var(--color-fd-muted-foreground)";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

/** Box styling per role. Tailwind `fill-*`/`stroke-*` utilities, theme-aware. */
const BOX: Record<FlowVariant, { rect: string; label: string; sub: string; ring: string }> = {
  project: {
    rect: "fill-amber-100 stroke-amber-300 dark:fill-amber-400/15 dark:stroke-amber-400/40",
    label: "fill-amber-950 dark:fill-amber-50",
    sub: "fill-amber-700 dark:fill-amber-200/70",
    ring: "stroke-amber-400 dark:stroke-amber-300",
  },
  branch: {
    rect: "fill-amber-100 stroke-amber-300 dark:fill-amber-400/15 dark:stroke-amber-400/40",
    label: "fill-amber-950 dark:fill-amber-50",
    sub: "fill-amber-700 dark:fill-amber-200/70",
    ring: "stroke-amber-400 dark:stroke-amber-300",
  },
  vars: {
    rect: "fill-emerald-100 stroke-emerald-300 dark:fill-emerald-400/15 dark:stroke-emerald-400/40",
    label: "fill-emerald-950 dark:fill-emerald-50",
    sub: "fill-emerald-700 dark:fill-emerald-200/70",
    ring: "stroke-emerald-400 dark:stroke-emerald-300",
  },
  source: {
    rect: "fill-emerald-100 stroke-emerald-300 dark:fill-emerald-400/15 dark:stroke-emerald-400/40",
    label: "fill-emerald-950 dark:fill-emerald-50",
    sub: "fill-emerald-700 dark:fill-emerald-200/70",
    ring: "stroke-emerald-400 dark:stroke-emerald-300",
  },
  production: {
    rect: "fill-teal-100 stroke-teal-300 dark:fill-teal-400/15 dark:stroke-teal-400/40",
    label: "fill-teal-950 dark:fill-teal-50",
    sub: "fill-teal-700 dark:fill-teal-200/70",
    ring: "stroke-teal-400 dark:stroke-teal-300",
  },
  scope: {
    rect: "fill-violet-100 stroke-violet-300 dark:fill-violet-400/15 dark:stroke-violet-400/40",
    label: "fill-violet-950 dark:fill-violet-50",
    sub: "fill-violet-700 dark:fill-violet-200/70",
    ring: "stroke-violet-400 dark:stroke-violet-300",
  },
  resolved: {
    rect: "fill-fd-card stroke-stroke-neutral-strong",
    label: "fill-fd-foreground",
    sub: "fill-fd-muted-foreground",
    ring: "stroke-teal-400 dark:stroke-teal-300",
  },
  infra: {
    rect: "fill-transparent stroke-stroke-neutral-strong",
    label: "fill-fd-foreground",
    sub: "fill-fd-muted-foreground",
    ring: "stroke-amber-400 dark:stroke-amber-300",
  },
  neutral: {
    rect: "fill-fd-muted stroke-stroke-neutral-strong",
    label: "fill-fd-foreground",
    sub: "fill-fd-muted-foreground",
    ring: "stroke-fd-foreground/40",
  },
};

type ChipKind = "vars" | "scope" | "production";
const CHIP: Record<ChipKind, string> = {
  vars: "fill-emerald-100 stroke-emerald-300 dark:fill-emerald-400/20 dark:stroke-emerald-400/40",
  scope: "fill-violet-100 stroke-violet-300 dark:fill-violet-400/20 dark:stroke-violet-400/40",
  production: "fill-teal-100 stroke-teal-300 dark:fill-teal-400/20 dark:stroke-teal-400/40",
};
const CHIP_TEXT: Record<ChipKind, string> = {
  vars: "fill-emerald-950 dark:fill-emerald-50",
  scope: "fill-violet-950 dark:fill-violet-50",
  production: "fill-teal-950 dark:fill-teal-50",
};
function chipKind(variant: string): ChipKind {
  if (variant === "vars") return "vars";
  if (variant === "production") return "production";
  return "scope";
}

/** Colored bar drawn beside a variable row, by where its value came from. */
const ORIGIN_BAR: Record<RowOrigin, string> = {
  production: "fill-teal-500 dark:fill-teal-400",
  preview: "fill-emerald-500 dark:fill-emerald-400",
  override: "fill-amber-500 dark:fill-amber-400",
};
const ORIGIN_TEXT: Record<RowOrigin, string> = {
  production: "fill-teal-700 dark:fill-teal-300",
  preview: "fill-emerald-700 dark:fill-emerald-300",
  override: "fill-amber-700 dark:fill-amber-300",
};

const ROW_H = 23;
const ROW_TOP = 34;

interface Point {
  x: number;
  y: number;
}

function anchor(n: FlowNode, side: Side, dy = 0): Point {
  switch (side) {
    case "l":
      return { x: n.x, y: n.y + n.h / 2 + dy };
    case "r":
      return { x: n.x + n.w, y: n.y + n.h / 2 + dy };
    case "t":
      return { x: n.x + n.w / 2, y: n.y };
    case "b":
      return { x: n.x + n.w / 2, y: n.y + n.h };
  }
}

/** Orthogonal waypoints between two anchors, based on which side each exits. */
function routePoints(a: Point, fromSide: Side, b: Point, toSide: Side, bendX?: number): Point[] {
  const horizFrom = fromSide === "l" || fromSide === "r";
  const horizTo = toSide === "l" || toSide === "r";
  if (horizFrom && horizTo) {
    const midX = bendX ?? (a.x + b.x) / 2;
    return [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b];
  }
  if (horizFrom && !horizTo) return [a, { x: b.x, y: a.y }, b];
  if (!horizFrom && horizTo) return [a, { x: a.x, y: b.y }, b];
  const midY = (a.y + b.y) / 2;
  return [a, { x: a.x, y: midY }, { x: b.x, y: midY }, b];
}

/** Polyline with rounded corners. */
function roundedPath(pts: Point[], r = 9): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const len1 = Math.hypot(p1.x - p0.x, p1.y - p0.y) || 1;
    const len2 = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1;
    const rr = Math.min(r, len1 / 2, len2 / 2);
    const s = { x: p1.x - ((p1.x - p0.x) / len1) * rr, y: p1.y - ((p1.y - p0.y) / len1) * rr };
    const e = { x: p1.x + ((p2.x - p1.x) / len2) * rr, y: p1.y + ((p2.y - p1.y) / len2) * rr };
    d += ` L ${s.x} ${s.y} Q ${p1.x} ${p1.y} ${e.x} ${e.y}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

function Edge({
  edge,
  byId,
  visible,
}: {
  edge: FlowEdge;
  byId: Map<string, FlowNode>;
  visible: boolean;
}) {
  const from = byId.get(edge.from);
  const to = byId.get(edge.to);
  if (!from || !to) return null;
  const pts = routePoints(
    anchor(from, edge.fromSide, edge.fromDy ?? 0),
    edge.fromSide,
    anchor(to, edge.toSide, edge.toDy ?? 0),
    edge.toSide,
    edge.bendX,
  );
  const d = roundedPath(pts);

  const mid = Math.floor((pts.length - 1) / 2);
  const lx = (pts[mid].x + pts[mid + 1].x) / 2;
  const ly = (pts[mid].y + pts[mid + 1].y) / 2;
  const labelW = edge.label ? edge.label.length * 6 + 12 : 0;

  return (
    <g
      className="transition-opacity duration-[450ms] motion-reduce:transition-none"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <path
        d={d}
        fill="none"
        stroke={EDGE_COLOR}
        strokeWidth={1.5}
        strokeOpacity={0.75}
        strokeLinecap="round"
        markerEnd="url(#flow-arrow)"
        pathLength={edge.dashed ? undefined : 1}
        strokeDasharray={edge.dashed ? "5 4" : 1}
        strokeDashoffset={edge.dashed ? undefined : visible ? 0 : 1}
        className={
          edge.dashed
            ? undefined
            : "transition-[stroke-dashoffset] duration-[650ms] ease-out motion-reduce:transition-none"
        }
      />
      {edge.label ? (
        <g>
          <rect
            x={lx - labelW / 2}
            y={ly - 9}
            width={labelW}
            height={18}
            rx={5}
            className="fill-fd-card stroke-stroke-neutral"
            strokeWidth={1}
          />
          <text
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={10.5}
            fontWeight={500}
            className="fill-fd-muted-foreground"
          >
            {edge.label}
          </text>
        </g>
      ) : null}
    </g>
  );
}

function Rows({ node, rows }: { node: FlowNode; rows: FlowRow[] }) {
  const rowTop = node.subBelow ? ROW_TOP + 12 : ROW_TOP;
  return (
    <>
      {rows.map((row, i) => {
        const y0 = node.y + rowTop + i * ROW_H;
        const cy = y0 + ROW_H / 2;
        return (
          <g key={`${node.id}-${row.key}`}>
            <rect
              x={node.x + 12}
              y={y0 + 3}
              width={3}
              height={ROW_H - 6}
              rx={1.5}
              className={ORIGIN_BAR[row.origin]}
            />
            <text
              x={node.x + 22}
              y={cy}
              dominantBaseline="central"
              fontSize={11}
              fontFamily={MONO}
              className="fill-fd-foreground"
            >
              {row.key}
            </text>
            <text
              x={node.x + node.w - 12}
              y={cy}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={11}
              fontFamily={MONO}
              className="fill-fd-muted-foreground"
            >
              {row.value}
            </text>
          </g>
        );
      })}
    </>
  );
}

function Chips({ node }: { node: FlowNode }) {
  const chips = node.chips ?? [];
  const gap = 8;
  const padX = 12;
  const chipH = 34;
  const widths = chips.map((c) => Math.max(38, c.label.length * 6.6 + 18));
  const total = widths.reduce((a, b) => a + b, 0) + gap * (chips.length - 1);
  let x = node.x + Math.max(padX, (node.w - total) / 2);
  const y = node.y + (node.h - chipH) / 2;
  return (
    <>
      {chips.map((chip, i) => {
        const w = widths[i];
        const kind = chipKind(chip.variant);
        const cell = (
          <g key={chip.label}>
            <rect
              x={x}
              y={y}
              width={w}
              height={chipH}
              rx={7}
              strokeWidth={1.25}
              className={CHIP[kind]}
            />
            <text
              x={x + w / 2}
              y={y + chipH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight={500}
              className={CHIP_TEXT[kind]}
            >
              {chip.label}
            </text>
          </g>
        );
        x += w + gap;
        return cell;
      })}
    </>
  );
}

function Node({
  node,
  rows,
  visible,
  emphasized,
}: {
  node: FlowNode;
  rows?: FlowRow[];
  visible: boolean;
  emphasized: boolean;
}) {
  const style = BOX[node.variant];
  const cx = node.x + node.w / 2;
  const cy = node.y + node.h / 2;
  const hasRows = rows != null && rows.length > 0;
  // Row boxes get a left-aligned header; chip and plain boxes don't.
  const titled = hasRows;
  const groupStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "scale(1)" : "scale(0.96)",
    transformBox: "fill-box",
    transformOrigin: "center",
  };

  return (
    <g
      className="transition duration-[450ms] ease-out motion-reduce:transition-none"
      style={groupStyle}
    >
      {/* Emphasis ring: brightens the box that changed this step. */}
      <rect
        x={node.x - 3}
        y={node.y - 3}
        width={node.w + 6}
        height={node.h + 6}
        rx={13}
        fill="none"
        strokeWidth={2}
        className={`${style.ring} transition-opacity duration-[450ms] motion-reduce:transition-none`}
        style={{ opacity: emphasized ? 1 : 0 }}
      />
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={node.h}
        rx={10}
        strokeWidth={1.5}
        strokeDasharray={node.variant === "infra" ? "4 4" : undefined}
        className={style.rect}
      />

      {node.chips ? <Chips node={node} /> : null}

      {titled ? (
        <>
          {/* Header: title left; sub either on its own line below (scope
              boxes, avoids overflow) or to the right (resolved boxes). */}
          <text
            x={node.x + 14}
            y={node.y + (node.subBelow ? 17 : 19)}
            dominantBaseline="central"
            fontSize={12.5}
            fontWeight={600}
            className={style.label}
          >
            {node.label}
          </text>
          {node.sub ? (
            <text
              x={node.subBelow ? node.x + 14 : node.x + node.w - 12}
              y={node.y + (node.subBelow ? 33 : 19)}
              textAnchor={node.subBelow ? "start" : "end"}
              dominantBaseline="central"
              fontSize={10}
              fontFamily={node.subBelow ? MONO : undefined}
              className={node.subOrigin ? ORIGIN_TEXT[node.subOrigin] : style.sub}
            >
              {node.sub}
            </text>
          ) : null}
          {hasRows ? <Rows node={node} rows={rows} /> : null}
        </>
      ) : node.chips ? null : (
        <>
          <text
            x={cx}
            y={node.sub ? cy - 7 : cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={14}
            fontWeight={600}
            className={style.label}
          >
            {node.label}
          </text>
          {node.sub ? (
            <text
              x={cx}
              y={cy + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={10.5}
              className={style.sub}
            >
              {node.sub}
            </text>
          ) : null}
        </>
      )}
    </g>
  );
}

function Legend({ scene }: { scene: FlowScene }) {
  const items = scene.legend ?? [];
  if (items.length === 0) return null;
  const widths = items.map((it) => 16 + it.label.length * 5.6 + 22);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = (scene.width - total) / 2;
  const y = scene.height - 16;
  return (
    <>
      {items.map((it, i) => {
        const startX = x;
        x += widths[i];
        return (
          <g key={it.origin}>
            <rect
              x={startX}
              y={y - 5}
              width={10}
              height={10}
              rx={2.5}
              className={ORIGIN_BAR[it.origin]}
            />
            <text
              x={startX + 16}
              y={y}
              dominantBaseline="central"
              fontSize={10.5}
              className="fill-fd-muted-foreground"
            >
              {it.label}
            </text>
          </g>
        );
      })}
    </>
  );
}

function FlowDiagram({ scene, active }: { scene: FlowScene; active: number }) {
  const step = scene.steps[active];
  const byId = new Map(scene.nodes.map((n) => [n.id, n]));
  const visibleNodes = new Set(step.nodes);
  const visibleEdges = new Set(step.edges);
  const emphasized = new Set(step.emphasize ?? []);

  return (
    <div className="overflow-x-auto px-4 py-5">
      <svg
        viewBox={`0 0 ${scene.width} ${scene.height}`}
        className="mx-auto block h-auto w-full max-w-[760px]"
        role="img"
        aria-label={scene.label}
      >
        <defs>
          <marker
            id="flow-arrow"
            viewBox="0 0 10 10"
            refX={8.5}
            refY={5}
            markerWidth={6.5}
            markerHeight={6.5}
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill={EDGE_COLOR} />
          </marker>
        </defs>

        {scene.groupLabels?.map((g) => (
          <text
            key={g.text}
            x={g.x}
            y={g.y}
            fontSize={11}
            fontWeight={600}
            className="fill-fd-muted-foreground"
            style={{ letterSpacing: "0.04em" }}
          >
            {g.text}
          </text>
        ))}

        {scene.edges.map((edge) => (
          <Edge key={edge.id} edge={edge} byId={byId} visible={visibleEdges.has(edge.id)} />
        ))}
        {scene.nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            rows={step.rowOverrides?.[node.id] ?? node.rows}
            visible={visibleNodes.has(node.id)}
            emphasized={emphasized.has(node.id)}
          />
        ))}

        <Legend scene={scene} />
      </svg>
    </div>
  );
}

/** Player for the visual box-and-arrow flow scenes. */
export function FlowPlayer({ scene }: { scene: FlowScene }) {
  const steps = scene.steps.map((s) => ({ title: s.title, caption: s.caption }));
  return (
    <PlayerShell label={scene.label} steps={steps}>
      {(active) => <FlowDiagram scene={scene} active={active} />}
    </PlayerShell>
  );
}
