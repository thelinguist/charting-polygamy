import { useMemo } from "react"
import { Group } from "@visx/group"
import { scaleLinear } from "@visx/scale"
import { GridColumns, GridRows } from "@visx/grid"
import { BG, COLOR_PREVIOUSLY_MARRIED, COLOR_SINGLE, GRID_COLOR } from "../shared/colors"
import { MARGIN } from "../shared/chartConstants"
import { SvgTooltip } from "../shared/SvgTooltip"
import type { ScatterPoint } from "../types"
import { Legend } from "./Legend"
import { Axes } from "./Axes"
import { DataPoint } from "./DataPoint"
import { AverageGapArea } from "./AverageGapArea"
import { EqualAgeIndicator } from "./EqualAgeIndicator"
import { useChartTooltip } from "../../../hooks/useChartTooltip"

interface Props {
    scatterPoints: ScatterPoint[]
    width: number
    colorSingle?: string
    colorPreviouslyMarried?: string
}

const SCATTER_HEIGHT = 320
const X_DOMAIN: [number, number] = [15, 72]
const Y_DOMAIN: [number, number] = [10, 65]

export function PatriarchWifeAgeScatter({
    scatterPoints,
    width,
    colorSingle = COLOR_SINGLE,
    colorPreviouslyMarried = COLOR_PREVIOUSLY_MARRIED,
}: Props) {
    const { tooltip, tooltipHandlers } = useChartTooltip()

    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
    const innerHeight = Math.max(0, SCATTER_HEIGHT - MARGIN.top - MARGIN.bottom)

    const xScale = scaleLinear({ domain: X_DOMAIN, range: [0, innerWidth] })
    const yScale = scaleLinear({ domain: Y_DOMAIN, range: [innerHeight, 0] })

    const { previouslyMarriedDatapoints, singleBeforehandDatapoints } = useMemo(
        () => ({
            previouslyMarriedDatapoints: scatterPoints.filter(p => p.previouslyMarried),
            singleBeforehandDatapoints: scatterPoints.filter(p => !p.previouslyMarried),
        }),
        [scatterPoints]
    )

    if (scatterPoints.length === 0) return null

    const legendItems = [
        { color: colorSingle, label: `No prior marriage (${singleBeforehandDatapoints.length})` },
        { color: colorPreviouslyMarried, label: `Previously married (${previouslyMarriedDatapoints.length})` },
    ]

    const renderDots = (points: ScatterPoint[], fill: string, keyPrefix: string) =>
        points.map((p, i) => (
            <DataPoint
                key={`${keyPrefix}-${i}`}
                xScale={xScale}
                yScale={yScale}
                point={p}
                fill={fill}
                generateTooltipHandler={tooltipHandlers}
            />
        ))

    return (
        <svg width={width} height={SCATTER_HEIGHT} overflow="visible">
            <rect width={width} height={SCATTER_HEIGHT} fill={BG} />
            <Group left={MARGIN.left} top={MARGIN.top}>
                <GridRows scale={yScale} width={innerWidth} stroke={GRID_COLOR} numTicks={6} />
                <GridColumns scale={xScale} height={innerHeight} stroke={GRID_COLOR} numTicks={6} />
                <AverageGapArea xScale={xScale} yScale={yScale} />

                <EqualAgeIndicator xScale={xScale} yScale={yScale} xDomain={X_DOMAIN} yDomain={Y_DOMAIN} />

                {renderDots(singleBeforehandDatapoints, colorSingle, "s")}
                {renderDots(previouslyMarriedDatapoints, colorPreviouslyMarried, "p")}
                <Axes xScale={xScale} yScale={yScale} innerWidth={innerWidth} innerHeight={innerHeight} />

                <Legend legendItems={legendItems} innerWidth={innerWidth} />
                {tooltip && (
                    <SvgTooltip
                        x={tooltip.x}
                        y={tooltip.y}
                        width={160}
                        lines={[
                            { text: (tooltip.data as ScatterPoint).wifeName },
                            { text: (tooltip.data as ScatterPoint).patriarchName, dim: true },
                        ]}
                    />
                )}
            </Group>
        </svg>
    )
}
