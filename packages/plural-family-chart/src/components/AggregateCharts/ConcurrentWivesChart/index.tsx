import { Group } from "@visx/group"
import { AreaClosed, LinePath } from "@visx/shape"
import { scaleLinear } from "@visx/scale"
import { AxisBottom, AxisLeft } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { curveMonotoneX } from "@visx/curve"
import { AXIS_COLOR, BG, GRID_COLOR, PATRIARCH_DARK, PATRIARCH_LIGHT } from "../shared/colors"
import { CHART_HEIGHT, MARGIN, TICK_LABEL_PROPS, TICK_LABEL_PROPS_LEFT } from "../shared/chartConstants"
import type { ConcurrentPoint } from "../types"

interface Props {
    points: ConcurrentPoint[]
    width: number
    fillArea?: string
    strokeLine?: string
}

export function ConcurrentWivesChart({
    points,
    width,
    fillArea = PATRIARCH_LIGHT,
    strokeLine = PATRIARCH_DARK,
}: Props) {
    const height = CHART_HEIGHT
    const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right)
    const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom)

    if (points.length === 0) return null

    const maxConcurrent = Math.max(...points.map(p => p.avgConcurrent), 1)

    const xScale = scaleLinear({ domain: [18, 76], range: [0, innerWidth] })
    const yScale = scaleLinear({ domain: [0, maxConcurrent * 1.1], range: [innerHeight, 0], nice: true })

    const getX = (p: ConcurrentPoint) => xScale(p.age) ?? 0
    const getY = (p: ConcurrentPoint) => yScale(p.avgConcurrent) ?? innerHeight

    return (
        <svg width={width} height={height}>
            <rect width={width} height={height} fill={BG} />
            <Group left={MARGIN.left} top={MARGIN.top}>
                <GridRows scale={yScale} width={innerWidth} stroke={GRID_COLOR} numTicks={4} />
                <AreaClosed
                    data={points}
                    x={getX}
                    y={getY}
                    yScale={yScale}
                    fill={fillArea}
                    fillOpacity={0.3}
                    curve={curveMonotoneX}
                />
                <LinePath
                    data={points}
                    x={getX}
                    y={getY}
                    stroke={strokeLine}
                    strokeWidth={1.5}
                    curve={curveMonotoneX}
                />
                <AxisBottom
                    scale={xScale}
                    top={innerHeight}
                    stroke={AXIS_COLOR}
                    tickStroke={AXIS_COLOR}
                    tickLabelProps={TICK_LABEL_PROPS}
                    numTicks={6}
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
                    patriarch age
                </text>
            </Group>
        </svg>
    )
}
