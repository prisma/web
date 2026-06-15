const W = 750
const BOX_W = 124
const BOX_H = 34
const BOX_R = 7
const BOX_Y = 12
const LIFE_Y0 = BOX_Y + BOX_H + 2
const STEP_Y0 = LIFE_Y0 + 38
const STEP_DY = 52
const LOOP_W = 44

const PARTICIPANTS = ["User", "DNS provider", "Prisma Compute", "Certificate authority"]
const PX = [76, 249, 430, 618]

type Step = { from: number; to: number; label: string; dashed?: boolean }

const STEPS: Step[] = [
  { from: 0, to: 2, label: "Add custom domain" },
  { from: 2, to: 0, label: "Return CNAME target", dashed: true },
  { from: 0, to: 1, label: "Create CNAME record" },
  { from: 2, to: 3, label: "Request certificate" },
  { from: 3, to: 2, label: "Return http-01 challenge", dashed: true },
  { from: 3, to: 2, label: "Check HTTP challenge path" },
  { from: 2, to: 3, label: "Serve challenge response", dashed: true },
  { from: 3, to: 2, label: "Issue TLS certificate", dashed: true },
  { from: 2, to: 2, label: "Encrypt and store certificate material" },
]

const H = STEP_Y0 + STEPS.length * STEP_DY + 24

export function SequenceDiagram() {
  return (
    <figure className="seq-diagram not-prose">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        aria-label="TLS certificate provisioning sequence diagram"
        role="img"
      >
        <defs>
          <marker
            id="seq-arr"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" className="seq-arr-fill" />
          </marker>
          <marker
            id="seq-arr-d"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" className="seq-arr-d-fill" />
          </marker>
        </defs>

        {/* participant boxes */}
        {PARTICIPANTS.map((name, i) => (
          <g key={name}>
            <rect
              x={PX[i] - BOX_W / 2}
              y={BOX_Y}
              width={BOX_W}
              height={BOX_H}
              rx={BOX_R}
              className="seq-box"
            />
            <text
              x={PX[i]}
              y={BOX_Y + BOX_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              className="seq-box-text"
            >
              {name}
            </text>
          </g>
        ))}

        {/* lifelines */}
        {PARTICIPANTS.map((_, i) => (
          <line
            key={i}
            x1={PX[i]}
            y1={LIFE_Y0}
            x2={PX[i]}
            y2={H - 8}
            strokeDasharray="3 5"
            className="seq-lifeline"
          />
        ))}

        {/* steps */}
        {STEPS.map((step, idx) => {
          const y = STEP_Y0 + idx * STEP_DY
          const isSelf = step.from === step.to
          const mid = isSelf
            ? PX[step.from] + LOOP_W + 8
            : (PX[step.from] + PX[step.to]) / 2
          const markerId = `url(#seq-arr${step.dashed ? "-d" : ""})`
          const arrowClass = `seq-arrow${step.dashed ? " seq-arrow-dashed" : ""}`

          return (
            <g key={idx}>
              <circle cx={16} cy={y} r={9} className="seq-num-bg" />
              <text
                x={16}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="seq-num-text"
              >
                {idx + 1}
              </text>

              {isSelf ? (
                <path
                  d={`M${PX[step.from]},${y - 8} H${PX[step.from] + LOOP_W} V${y + 8} H${PX[step.from]}`}
                  fill="none"
                  markerEnd={markerId}
                  className={arrowClass}
                />
              ) : (
                <line
                  x1={PX[step.from]}
                  y1={y}
                  x2={PX[step.to]}
                  y2={y}
                  markerEnd={markerId}
                  className={arrowClass}
                />
              )}

              <text
                x={mid}
                y={y - 11}
                textAnchor={isSelf ? "start" : "middle"}
                className="seq-label"
              >
                {step.label}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
