"use client";

import { useMemo, useRef, useState } from "react";

type Movie = {
  title: string;
  short: string;
  // [action, romance] — two of the four axes from the post, so we can draw them.
  vec: [number, number];
};

const MOVIES: Movie[] = [
  { title: "Alien", short: "Alien", vec: [0.6, 0.05] },
  { title: "The Terminator", short: "Terminator", vec: [0.9, 0.15] },
  { title: "Notting Hill", short: "Notting Hill", vec: [0.05, 0.95] },
  { title: "Hot Fuzz", short: "Hot Fuzz", vec: [0.75, 0.1] },
  { title: "Her", short: "Her", vec: [0.05, 0.85] },
  { title: "Mad Max: Fury Road", short: "Mad Max", vec: [0.98, 0.1] },
];

const SIZE = 340;
const PAD = 34;
const PLOT = SIZE - PAD * 2;

function toSvg([x, y]: [number, number]): [number, number] {
  return [PAD + x * PLOT, SIZE - PAD - y * PLOT];
}

function cosineSimilarity(a: [number, number], b: [number, number]): number {
  const dot = a[0] * b[0] + a[1] * b[1];
  const magA = Math.hypot(a[0], a[1]);
  const magB = Math.hypot(b[0], b[1]);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

export function VectorSpaceDemo() {
  const [query, setQuery] = useState<[number, number]>([0.9, 0.2]);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const ranking = useMemo(
    () =>
      MOVIES.map((m) => ({ ...m, similarity: cosineSimilarity(query, m.vec) })).sort(
        (a, b) => b.similarity - a.similarity,
      ),
    [query],
  );
  const top = ranking[0];

  function setFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * SIZE;
    const y = ((event.clientY - rect.top) / rect.height) * SIZE;
    const vx = Math.min(1, Math.max(0.02, (x - PAD) / PLOT));
    const vy = Math.min(1, Math.max(0.02, (SIZE - PAD - y) / PLOT));
    setQuery([Number(vx.toFixed(2)), Number(vy.toFixed(2))]);
  }

  const [qx, qy] = toSvg(query);
  const origin = toSvg([0, 0]);

  return (
    <div className="vector-demo not-prose">
      <div className="vector-demo-header">
        <span className="vector-demo-title">Cosine similarity, drawn</span>
        <span className="vector-demo-query">
          query = [action: {query[0].toFixed(2)}, romance: {query[1].toFixed(2)}]
        </span>
      </div>
      <div className="vector-demo-body">
        <svg
          ref={svgRef}
          className="vector-demo-plane"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Movies plotted on action and romance axes; drag the query point to reorder the ranking"
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture?.(e.pointerId);
            setDragging(true);
            setFromPointer(e);
          }}
          onPointerMove={(e) => dragging && setFromPointer(e)}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
        >
          {/* axes */}
          <line
            className="vector-demo-axis"
            x1={origin[0]}
            y1={origin[1]}
            x2={SIZE - PAD + 14}
            y2={origin[1]}
          />
          <line
            className="vector-demo-axis"
            x1={origin[0]}
            y1={origin[1]}
            x2={origin[0]}
            y2={PAD - 14}
          />
          <text className="vector-demo-axis-label" x={SIZE - PAD} y={origin[1] + 22}>
            action →
          </text>
          <text className="vector-demo-axis-label" x={origin[0] - 10} y={PAD - 4} textAnchor="end">
            romance ↑
          </text>

          {/* movie rays + points */}
          {MOVIES.map((m) => {
            const [mx, my] = toSvg(m.vec);
            const isTop = m.title === top.title;
            return (
              <g key={m.title} data-top={isTop ? "true" : undefined}>
                <line className="vector-demo-ray" x1={origin[0]} y1={origin[1]} x2={mx} y2={my} />
                <circle className="vector-demo-point" cx={mx} cy={my} r={isTop ? 7 : 5} />
                <text
                  className="vector-demo-point-label"
                  x={mx + (m.vec[0] > 0.8 ? -8 : 9)}
                  y={my - 8}
                  textAnchor={m.vec[0] > 0.8 ? "end" : "start"}
                >
                  {m.short}
                </text>
              </g>
            );
          })}

          {/* query ray + point */}
          <line className="vector-demo-query-ray" x1={origin[0]} y1={origin[1]} x2={qx} y2={qy} />
          <circle className="vector-demo-query-point" cx={qx} cy={qy} r={9} />
          <text className="vector-demo-query-label" x={qx + 12} y={qy + 4}>
            query
          </text>
        </svg>

        <div className="vector-demo-ranking">
          <div className="vector-demo-ranking-head">ORDER BY embedding &lt;=&gt; query</div>
          <ol className="vector-demo-ranking-list">
            {ranking.map((m, i) => (
              <li
                key={m.title}
                className="vector-demo-rank"
                data-top={i === 0 ? "true" : undefined}
              >
                <span className="vector-demo-rank-title">{m.title}</span>
                <span className="vector-demo-rank-bar-track">
                  <span
                    className="vector-demo-rank-bar"
                    style={{ width: `${Math.max(2, m.similarity * 100)}%` }}
                  />
                </span>
                <span className="vector-demo-rank-value">{m.similarity.toFixed(3)}</span>
              </li>
            ))}
          </ol>
          <div className="vector-demo-caption">
            Drag the query point. Similarity is the cosine of the angle between rays, so only
            direction matters: a point halfway along the same ray ranks exactly the same.
          </div>
        </div>
      </div>
    </div>
  );
}
