const LOOP_STEPS = ["intent", "change", "test", "preview", "retry"];
const WORK_METERS = ["Requests", "Memory", "Active CPU", "Outbound data"];

function labelLines(label: string) {
  const parts = label.split(" ");

  if (parts.length <= 1) return [label];

  return [parts.slice(0, -1).join(" "), parts.at(-1) ?? ""];
}

function Box({
  x,
  y,
  width,
  label,
  dashed = false,
  variant = "default",
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  dashed?: boolean;
  variant?: "default" | "meter";
}) {
  const lines = labelLines(label);
  const meterStyle =
    variant === "meter"
      ? {
          fill: "color-mix(in srgb, #6754e8 58%, var(--color-background-default))",
          stroke: "color-mix(in srgb, #a99cff 80%, transparent)",
        }
      : undefined;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={42}
        rx={7}
        className="seq-box"
        strokeDasharray={dashed ? "5 4" : undefined}
        style={meterStyle}
      />
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + width / 2}
          y={y + 21 + (i - (lines.length - 1) / 2) * 12}
          textAnchor="middle"
          dominantBaseline="central"
          className="seq-box-text"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({ d, dashed = false }: { d: string; dashed?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      markerEnd="url(#work-pricing-arrow)"
      className={`seq-arrow${dashed ? " seq-arrow-dashed" : ""}`}
    />
  );
}

export function WorkPricingDiagram() {
  return (
    <figure className="seq-diagram not-prose">
      <svg
        viewBox="0 0 760 372"
        width="100%"
        aria-label="The loop is not the bill. The work is. An agent-assisted loop can repeat many times, while observable application work becomes the bill."
        role="img"
      >
        <defs>
          <marker
            id="work-pricing-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" className="seq-arr-fill" />
          </marker>
        </defs>

        <text x="18" y="28" className="seq-box-text" style={{ fontSize: 16, fontWeight: 700 }}>
          The loop is not the bill. The work is.
        </text>

        <rect
          x="18"
          y="52"
          width="724"
          height="142"
          rx="10"
          className="seq-box"
          strokeDasharray="5 4"
        />

        <text x="42" y="82" className="seq-box-text" style={{ fontSize: 13, fontWeight: 700 }}>
          Agent-assisted loop
        </text>
        <text x="380" y="108" textAnchor="middle" className="seq-label">
          can repeat many times
        </text>

        {LOOP_STEPS.map((label, i) => (
          <Box key={label} x={52 + i * 136} y={126} width={100} label={label} dashed />
        ))}

        {LOOP_STEPS.slice(0, -1).map((label, i) => {
          const start = 152 + i * 136;
          const end = 188 + i * 136;

          return <Arrow key={label} d={`M${start} 147 L${end} 147`} />;
        })}

        <Arrow d="M616 124 C 566 84, 194 84, 152 124" dashed />

        <Arrow d="M380 194 L380 234" dashed />
        <text x="402" y="218" className="seq-label">
          observable application work becomes the bill
        </text>

        <text x="18" y="272" className="seq-box-text" style={{ fontSize: 13, fontWeight: 700 }}>
          The bill, what the app actually did
        </text>

        {WORK_METERS.map((label, i) => (
          <Box key={label} x={18 + i * 185} y={292} width={150} label={label} variant="meter" />
        ))}

        <text x="18" y="354" className="seq-label">
          Run the loop once or a thousand times, the bill counts the same four things.
        </text>
      </svg>
    </figure>
  );
}
