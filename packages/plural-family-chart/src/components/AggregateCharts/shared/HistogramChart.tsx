import { Group } from "@visx/group"
import { Bar } from "@visx/shape"
import { scaleLinear } from "@visx/scale"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { AXIS_COLOR, BG, GRID_COLOR, WIFE_BROWN } from "./colors"
import { CHART_HEIGHT, MARGIN, TICK_LABEL_PROPS, TICK_LABEL_PROPS_LEFT } from "./chartConstants"
import { SvgTooltip } from "./SvgTooltip"
import { useChartTooltip } from "../../../hooks/useChartTooltip"
import { Bin } from "../types"

export interface ReferenceLineConfig {
    x: number
    label: string
}

export interface HistogramChartProps {
    bins: Bin[]
    domain: [number, number]
    maxCount: number
    width: number
    height?: number
    fill?: string
    getFill?: (bin: Bin) => string
    xLabel?: string
    sampleN?: number
    tickValues?: number[]
    tickFormat?: (value: { valueOf(): number }) => string
    referenceLines?: ReferenceLineConfig[]
}

export function HistogramChart({
    bins,
    domain,
    maxCount,
    width,
    height = CHART_HEIGHT,
    fill = WIFE_BROWN,
    getFill,
    xLabel,
    sampleN,
    tickValues,
    tickFormat,
    referenceLines,
}: HistogramChartProps) {
    const { tooltip, tooltipHandlers } = useChartTooltip<Bin>()

    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
    const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom)

    const xScale = scaleLinear({ domain, range: [0, innerWidth] })
    const yScale = scaleLinear({ domain: [0, maxCount], range: [innerHeight, 0], nice: true })

    return (
        <svg width={width} height={height} overflow="visible">
            <rect width={width} height={height} fill={BG} />
            <Group left={MARGIN.left} top={MARGIN.top}>
                <GridRows scale={yScale} width={innerWidth} stroke={GRID_COLOR} numTicks={4} />
                {bins.map(b => {
                    const x = xScale(b.x0) ?? 0
                    const x1 = xScale(b.x1) ?? 0
                    const barWidth = Math.max(0, x1 - x - 1)
                    const barY = yScale(b.count) ?? innerHeight
                    const barH = innerHeight - barY
                    if (barWidth <= 0) return null
                    const cx = x + barWidth / 2
                    return (
                        <g key={b.x0}>
                            {barH > 0 && (
                                <Bar
                                    x={x}
                                    y={barY}
                                    width={barWidth}
                                    height={barH}
                                    fill={getFill ? getFill(b) : fill}
                                    style={{ pointerEvents: "none" }}
                                />
                            )}
                            {/* invisible hit area covering full column height */}
                            <rect
                                x={x}
                                y={0}
                                width={barWidth}
                                height={innerHeight}
                                fill="transparent"
                                style={{ cursor: "default" }}
                                {...tooltipHandlers(cx, barH > 0 ? barY : innerHeight, b)}
                            />
                        </g>
                    )
                })}
                {referenceLines?.map(({ x, label }) => {
                    const lx = xScale(x) ?? 0
                    return (
                        <g key={x}>
                            <line
                                x1={lx}
                                x2={lx}
                                y1={0}
                                y2={innerHeight}
                                stroke={AXIS_COLOR}
                                strokeWidth={1}
                                strokeDasharray="3 3"
                                opacity={0.6}
                            />
                            <text x={lx + 3} y={6} fill={AXIS_COLOR} fontSize={8} fontFamily="monospace" opacity={0.8}>
                                {label}
                            </text>
                        </g>
                    )
                })}
                <AxisBottom
                    scale={xScale}
                    top={innerHeight}
                    stroke={AXIS_COLOR}
                    tickStroke={AXIS_COLOR}
                    tickLabelProps={TICK_LABEL_PROPS}
                    {...(tickValues ? { tickValues } : { numTicks: 6 })}
                    {...(tickFormat ? { tickFormat } : {})}
                />
                <AxisLeft
                    scale={yScale}
                    stroke={AXIS_COLOR}
                    tickStroke={AXIS_COLOR}
                    tickLabelProps={TICK_LABEL_PROPS_LEFT}
                    numTicks={4}
                />
                {xLabel && (
                    <text
                        x={innerWidth / 2}
                        y={innerHeight + MARGIN.bottom - 6}
                        fill={AXIS_COLOR}
                        fontSize={10}
                        fontFamily="monospace"
                        textAnchor="middle"
                    >
                        {xLabel}
                    </text>
                )}
                {sampleN !== undefined && (
                    <text x={innerWidth} y={-8} fill={AXIS_COLOR} fontSize={10} fontFamily="monospace" textAnchor="end">
                        n = {sampleN}
                    </text>
                )}
                {tooltip && (
                    <SvgTooltip
                        x={tooltip.x}
                        y={tooltip.y}
                        lines={[
                            { text: `${tooltip.data.x0}–${tooltip.data.x1}` },
                            { text: `n = ${tooltip.data.count}` },
                        ]}
                    />
                )}
            </Group>
        </svg>
    )
}
