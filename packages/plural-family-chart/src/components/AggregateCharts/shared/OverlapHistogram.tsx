import { Group } from "@visx/group"
import { Bar } from "@visx/shape"
import { scaleLinear } from "@visx/scale"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { AXIS_COLOR, BG, GRID_COLOR } from "./colors"
import { CHART_HEIGHT, MARGIN, TICK_LABEL_PROPS, TICK_LABEL_PROPS_LEFT } from "./chartConstants"
import { SvgTooltip } from "./SvgTooltip"
import { useChartTooltip } from "../../../hooks/useChartTooltip"
import { Bin } from "../types"

interface BinKey {
    x0: number
    x1: number
}

export interface OverlapHistogramProps {
    binsA: Bin[]
    fillA: string
    labelA: string
    binsB: Bin[]
    fillB: string
    labelB: string
    domain: [number, number]
    maxCount: number
    width: number
    height?: number
    xLabel?: string
    sampleNA?: number
    sampleNB?: number
    tickValues?: number[]
}

export function OverlapHistogram({
    binsA,
    fillA,
    labelA,
    binsB,
    fillB,
    labelB,
    domain,
    maxCount,
    width,
    height = CHART_HEIGHT,
    xLabel,
    sampleNA,
    sampleNB,
    tickValues,
}: OverlapHistogramProps) {
    const { tooltip, tooltipHandlers } = useChartTooltip<BinKey>()

    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
    const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom)

    const xScale = scaleLinear({ domain, range: [0, innerWidth] })
    const yScale = scaleLinear({ domain: [0, maxCount], range: [innerHeight, 0], nice: true })

    const renderSeries = (bins: Bin[], fill: string) =>
        bins.map(b => {
            const x = xScale(b.x0) ?? 0
            const x1 = xScale(b.x1) ?? 0
            const barWidth = Math.max(0, x1 - x - 1)
            const barY = yScale(b.count) ?? innerHeight
            const barH = innerHeight - barY
            if (barWidth <= 0 || barH <= 0) return null
            return (
                <Bar
                    key={b.x0}
                    x={x}
                    y={barY}
                    width={barWidth}
                    height={barH}
                    fill={fill}
                    fillOpacity={0.75}
                    style={{ mixBlendMode: "multiply", pointerEvents: "none" }}
                />
            )
        })

    // Build a union of all x0 values across both series for hit areas
    const allX0s = Array.from(new Set([...binsA.map(b => b.x0), ...binsB.map(b => b.x0)])).sort((a, b) => a - b)

    // Legend dimensions
    const legendY = -16
    const swatchSize = 9
    const legendGap = 100

    return (
        <svg width={width} height={height} overflow="visible">
            <rect width={width} height={height} fill={BG} />
            <Group left={MARGIN.left} top={MARGIN.top}>
                <GridRows scale={yScale} width={innerWidth} stroke={GRID_COLOR} numTicks={4} />
                {/* Render B first so A overlays it */}
                {renderSeries(binsB, fillB)}
                {renderSeries(binsA, fillA)}

                {/* Invisible hit areas spanning full column height */}
                {allX0s.map(x0 => {
                    const binA = binsA.find(b => b.x0 === x0)
                    const binB = binsB.find(b => b.x0 === x0)
                    const x1val = (binA ?? binB)!.x1
                    const lx = xScale(x0) ?? 0
                    const rx = xScale(x1val) ?? 0
                    const barWidth = Math.max(0, rx - lx - 1)
                    if (barWidth <= 0) return null
                    const cx = lx + barWidth / 2
                    const topY = Math.min(
                        binA ? (yScale(binA.count) ?? innerHeight) : innerHeight,
                        binB ? (yScale(binB.count) ?? innerHeight) : innerHeight
                    )
                    return (
                        <rect
                            key={x0}
                            x={lx}
                            y={0}
                            width={barWidth}
                            height={innerHeight}
                            fill="transparent"
                            style={{ cursor: "default" }}
                            {...tooltipHandlers(cx, topY, { x0, x1: x1val })}
                        />
                    )
                })}

                <AxisBottom
                    scale={xScale}
                    top={innerHeight}
                    stroke={AXIS_COLOR}
                    tickStroke={AXIS_COLOR}
                    tickLabelProps={TICK_LABEL_PROPS}
                    {...(tickValues ? { tickValues } : { numTicks: 6 })}
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
                {/* Legend */}
                <g transform={`translate(${innerWidth - legendGap * 2 + 12}, ${legendY})`}>
                    <rect width={swatchSize} height={swatchSize} fill={fillA} fillOpacity={0.75} />
                    <text x={swatchSize + 4} y={swatchSize - 1} fill={AXIS_COLOR} fontSize={10} fontFamily="monospace">
                        {labelA}
                        {sampleNA !== undefined ? ` (${sampleNA})` : ""}
                    </text>
                </g>
                <g transform={`translate(${innerWidth - legendGap + 12}, ${legendY})`}>
                    <rect width={swatchSize} height={swatchSize} fill={fillB} fillOpacity={0.75} />
                    <text x={swatchSize + 4} y={swatchSize - 1} fill={AXIS_COLOR} fontSize={10} fontFamily="monospace">
                        {labelB}
                        {sampleNB !== undefined ? ` (${sampleNB})` : ""}
                    </text>
                </g>
                {tooltip &&
                    (() => {
                        const binA = binsA.find(b => b.x0 === tooltip.data.x0)
                        const binB = binsB.find(b => b.x0 === tooltip.data.x0)
                        return (
                            <SvgTooltip
                                x={tooltip.x}
                                y={tooltip.y}
                                width={130}
                                lines={[
                                    { text: `${tooltip.data.x0}–${tooltip.data.x1}` },
                                    { text: `${labelA}: ${binA?.count ?? 0}` },
                                    { text: `${labelB}: ${binB?.count ?? 0}` },
                                ]}
                            />
                        )
                    })()}
            </Group>
        </svg>
    )
}
