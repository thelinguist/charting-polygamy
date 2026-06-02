import { Pie } from "@visx/shape"
import { Group } from "@visx/group"
import { AXIS_COLOR, BG, PATRIARCH_DARK, SPOUSE_TAN } from "../shared/colors"
import type { MarriageOutcomes } from "../types"

interface Props {
    marriageOutcomes: MarriageOutcomes
    width: number
    colorStayed?: string
    colorLeft?: string
}

const PIE_HEIGHT = 220

export function MarriageOutcomesPie({
    marriageOutcomes,
    width,
    colorStayed = PATRIARCH_DARK,
    colorLeft = SPOUSE_TAN,
}: Props) {
    const { stayed, left } = marriageOutcomes
    const total = stayed + left
    if (total === 0) return "missing data"

    const radius = Math.min(width / 2, PIE_HEIGHT / 2) - 24
    const cx = width / 2
    const cy = PIE_HEIGHT / 2

    const stayedPct = Math.round((stayed / total) * 100)
    const leftPct = 100 - stayedPct

    const pieData = [
        { label: "Remained", value: stayed, color: colorStayed, pct: stayedPct },
        { label: "Left / dissolved", value: left, color: colorLeft, pct: leftPct },
    ]

    return (
        <svg width={width} height={PIE_HEIGHT}>
            <rect width={width} height={PIE_HEIGHT} fill={BG} />
            <Group left={cx} top={cy}>
                <Pie
                    data={pieData}
                    pieValue={d => d.value}
                    outerRadius={radius}
                    innerRadius={radius * 0.55}
                    padAngle={0.02}
                >
                    {pie =>
                        pie.arcs.map(arc => {
                            const [mx, my] = pie.path.centroid(arc)
                            const hasRoom = arc.endAngle - arc.startAngle > 0.4
                            return (
                                <g key={arc.data.label}>
                                    <path d={pie.path(arc) ?? ""} fill={arc.data.color} fillOpacity={0.88} />
                                    {hasRoom && (
                                        <text
                                            x={mx}
                                            y={my}
                                            dy="0.35em"
                                            textAnchor="middle"
                                            fill="#fff"
                                            fontSize={11}
                                            fontFamily="monospace"
                                        >
                                            {arc.data.pct}%
                                        </text>
                                    )}
                                </g>
                            )
                        })
                    }
                </Pie>

                {/* Center label */}
                <text
                    textAnchor="middle"
                    dy="-0.4em"
                    fill={AXIS_COLOR}
                    fontSize={14}
                    fontFamily="monospace"
                    fontWeight="bold"
                >
                    {total}
                </text>
                <text textAnchor="middle" dy="1em" fill={AXIS_COLOR} fontSize={9} fontFamily="monospace">
                    marriages
                </text>
            </Group>

            {/* Legend */}
            <g transform={`translate(${width - 160}, ${PIE_HEIGHT - 44})`}>
                {pieData.map((item, i) => (
                    <g key={item.label} transform={`translate(0, ${i * 18})`}>
                        <rect width={10} height={10} y={-1} fill={item.color} fillOpacity={0.88} />
                        <text x={14} y={8} fill={AXIS_COLOR} fontSize={10} fontFamily="monospace">
                            {item.label} ({item.value})
                        </text>
                    </g>
                ))}
            </g>
        </svg>
    )
}
