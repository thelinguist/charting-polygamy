import { useState } from "react"
import { Group } from "@visx/group"
import { Bar } from "@visx/shape"
import { scaleLinear, scaleBand } from "@visx/scale"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { AXIS_COLOR, BG, GRID_COLOR, WIFE_BROWN } from "../shared/colors"
import { CHART_HEIGHT, MARGIN, TICK_LABEL_PROPS_LEFT } from "../shared/chartConstants"
import { SvgTooltip } from "../shared/SvgTooltip"
import { OrderBucket } from "../types"

interface Props {
    avgAgeByOrder: OrderBucket[]
    width: number
    fill?: string
}

export function WifeAgeByOrderChart({ avgAgeByOrder, width, fill = WIFE_BROWN }: Props) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; bucket: OrderBucket } | null>(null)

    const height = CHART_HEIGHT
    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
    const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom)

    const positions = avgAgeByOrder.map(b => b.position)
    const maxAge = Math.max(...avgAgeByOrder.map(b => b.avgAge), 40)

    const xScale = scaleBand({
        domain: positions,
        range: [0, innerWidth],
        padding: 0.25,
    })
    const yScale = scaleLinear({ domain: [0, maxAge + 5], range: [innerHeight, 0], nice: true })

    if (avgAgeByOrder.length === 0) return null

    return (
        <svg width={width} height={height} overflow="visible">
            <rect width={width} height={height} fill={BG} />
            <Group left={MARGIN.left} top={MARGIN.top}>
                <GridRows scale={yScale} width={innerWidth} stroke={GRID_COLOR} numTicks={4} />
                {avgAgeByOrder.map(b => {
                    const x = xScale(b.position) ?? 0
                    const barWidth = xScale.bandwidth()
                    const barY = yScale(b.avgAge) ?? innerHeight
                    const barH = innerHeight - barY
                    if (barWidth <= 0 || barH <= 0) return null
                    const cx = x + barWidth / 2
                    return (
                        <g key={b.position}>
                            <Bar
                                x={x}
                                y={barY}
                                width={barWidth}
                                height={barH}
                                fill={fill}
                                style={{ pointerEvents: "none" }}
                            />
                            {/* avg age label on top of bar */}
                            <text
                                x={cx}
                                y={barY - 3}
                                fill={AXIS_COLOR}
                                fontSize={10}
                                fontFamily="monospace"
                                textAnchor="middle"
                                style={{ pointerEvents: "none" }}
                            >
                                {b.avgAge.toFixed(0)}
                            </text>
                            {/* count label below x-axis tick */}
                            <text
                                x={cx}
                                y={innerHeight + 29}
                                fill={AXIS_COLOR}
                                fontSize={9}
                                fontFamily="monospace"
                                textAnchor="middle"
                                style={{ pointerEvents: "none" }}
                            >
                                n={b.count}
                            </text>
                            {/* hit area */}
                            <rect
                                x={x}
                                y={0}
                                width={barWidth}
                                height={innerHeight}
                                fill="transparent"
                                style={{ cursor: "default" }}
                                onMouseEnter={() => setTooltip({ x: cx, y: barY, bucket: b })}
                                onMouseLeave={() => setTooltip(null)}
                                onTouchStart={e => {
                                    e.preventDefault()
                                    setTooltip({ x: cx, y: barY, bucket: b })
                                }}
                                onTouchEnd={() => setTooltip(null)}
                            />
                        </g>
                    )
                })}
                <AxisBottom
                    scale={xScale}
                    top={innerHeight}
                    stroke={AXIS_COLOR}
                    tickStroke={AXIS_COLOR}
                    tickLabelProps={{ fill: AXIS_COLOR, fontSize: 11, fontFamily: "monospace", textAnchor: "middle" }}
                />
                <AxisLeft
                    scale={yScale}
                    stroke={AXIS_COLOR}
                    tickStroke={AXIS_COLOR}
                    tickLabelProps={TICK_LABEL_PROPS_LEFT}
                    numTicks={4}
                />
                <text
                    x={innerWidth / 2}
                    y={innerHeight + MARGIN.bottom - 6}
                    fill={AXIS_COLOR}
                    fontSize={10}
                    fontFamily="monospace"
                    textAnchor="middle"
                >
                    wife ordinal position
                </text>
                {tooltip && (
                    <SvgTooltip
                        x={tooltip.x}
                        y={tooltip.y}
                        lines={[
                            { text: tooltip.bucket.position },
                            { text: `avg age: ${tooltip.bucket.avgAge.toFixed(1)}` },
                            { text: `n = ${tooltip.bucket.count}` },
                        ]}
                    />
                )}
            </Group>
        </svg>
    )
}
