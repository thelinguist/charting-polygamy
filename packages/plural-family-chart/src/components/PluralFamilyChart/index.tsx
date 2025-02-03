import React from "react"
import { coerceNumber, scaleLinear, scaleUtc } from "@visx/scale"
import { Axis, AxisScale, Orientation, SharedAxisProps } from "@visx/axis"
import { GridRows } from "@visx/grid"
import { AnimatedAxis, AnimatedGridRows } from "@visx/react-spring"
import { timeFormat } from "@visx/vendor/d3-time-format"
import { GridRowsProps } from "@visx/grid/lib/grids/GridRows"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { Background } from "./Background.tsx"
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.ts"
import { Patriarch } from "./Patriarch.tsx"
import { listDecades } from "../../utils.ts"
import { BadData } from "./BadData.tsx"
import { checkPersonDetails, getChartEndDate, getChartStartDate } from "./utils.ts"
import { Spouse } from "./Spouse.tsx"

export const backgroundColor = "#f3d3ff"
const axisColor = "#000"
const tickLabelColor = "#000"

const margin = {
    top: 40,
    right: 150,
    bottom: 20,
    left: 50,
}

const tickLabelProps = {
    fill: tickLabelColor,
    fontSize: 12,
    fontFamily: "sans-serif",
    textAnchor: "middle",
} as const

const getMinMax = (vals: (number | { valueOf(): number })[]) => {
    const numericVals = vals.map(coerceNumber)
    return [Math.min(...numericVals), Math.max(...numericVals)]
}

export type Props = {
    width: number
    height: number
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
}

type AnimationTrajectory = "outside" | "center" | "min" | "max" | undefined

type AxisComponentType = React.FC<
    SharedAxisProps<AxisScale> & {
        animationTrajectory: AnimationTrajectory
    }
>
type GridRowsComponentType = React.FC<
    GridRowsProps<AxisScale> & {
        animationTrajectory: AnimationTrajectory
    }
>

export const PluralFamilyChart: React.FC<Props> = ({
    width: outerWidth = 800,
    height: outerHeight = 800,
    patriarchTimeline,
    timelines,
}) => {
    const useAnimatedComponents = usePrefersReducedMotion()
    const dataErrors = checkPersonDetails(patriarchTimeline)
    if (dataErrors) return <BadData />

    // in svg, margin is subtracted from total width/height
    const width = outerWidth - margin.left - margin.right
    const height = outerHeight - margin.top - margin.bottom
    const animationTrajectory = "min"

    const AxisComponent: AxisComponentType = !useAnimatedComponents ? AnimatedAxis : Axis
    const GridRowsComponent: GridRowsComponentType = useAnimatedComponents ? AnimatedGridRows : GridRows

    const timeValues = [getChartStartDate(patriarchTimeline, timelines), getChartEndDate(patriarchTimeline, timelines)]

    const scale = scaleUtc({
        domain: getMinMax(timeValues),
        range: [0, width],
    })
    const tickFormat = (v: Date, i: number) => (width > 400 || i % 2 === 0 ? timeFormat("%Y")(v) : "")

    if (width < 10) return null

    const scalePadding = 40
    const scaleHeight = height / 4 - scalePadding

    const yScale = scaleLinear({
        domain: [100, 0],
        range: [scaleHeight, 0],
    })

    const tickValues = listDecades(timeValues[0], timeValues[1])

    return (
        <svg width={outerWidth} height={outerHeight}>
            <Background backgroundColor={backgroundColor} outerWidth={outerWidth} outerHeight={outerHeight} />
            <g transform={`translate(${margin.left},${margin.top})`}>
                <GridRowsComponent
                    scale={yScale}
                    width={width}
                    numTicks={4}
                    animationTrajectory={animationTrajectory}
                />
                <AxisComponent
                    orientation={Orientation.top}
                    top={0}
                    scale={scale}
                    tickFormat={tickFormat}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={tickLabelProps}
                    tickValues={tickValues}
                    animationTrajectory={animationTrajectory}
                />
                <Patriarch
                    timelines={timelines}
                    patriarchTimeline={patriarchTimeline}
                    scaleHeight={scaleHeight}
                    yScale={yScale}
                    scale={scale}
                />
                {timelines.map(timeline => (
                    <Spouse
                        key={timeline.name}
                        patriarchTimeline={patriarchTimeline}
                        timeline={timeline}
                        yScale={yScale}
                        scale={scale}
                        scaleHeight={scaleHeight}
                    />
                ))}
            </g>
        </svg>
    )
}
