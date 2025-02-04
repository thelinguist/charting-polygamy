import { PatriarchTimeline, Timeline } from "lib/src/types"
import { Group } from "@visx/group"
import { AxisLeft, AxisTop, Orientation } from "@visx/axis"
import { axisColor, barWidth, tickLabelProps } from "./constants.ts"
import { scaleLinear, scaleOrdinal, scaleUtc } from "@visx/scale"
import { getMinMax, listDecades } from "../../utils.ts"
import { checkPersonDetails, getChartEndDate, getChartStartDate } from "./utils.ts"
import React from "react"
import { timeFormat } from "@visx/vendor/d3-time-format"
import { Patriarch } from "./Patriarch.tsx"
import { Spouse } from "./Spouse.tsx"
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.ts"
import { BadData } from "./BadData.tsx"
import { TooSmall } from "./TooSmall.tsx"

interface Props {
    width?: number
    height?: number
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    margin?: { top: number; right: number; bottom: number; left: number }
}

const defaultMargin = { top: 40, left: 70, right: 40, bottom: 100 }
export const background = "#eaedff"

export const PluralFamilyChart: React.FC<Props> = ({
    width = 800,
    height = 600,
    patriarchTimeline,
    timelines,
    margin = defaultMargin,
}) => {
    const useAnimatedComponents = usePrefersReducedMotion()
    const dataErrors = checkPersonDetails(patriarchTimeline)
    if (dataErrors) return <BadData />

    const chartWidth = width - margin.left - margin.right
    if (chartWidth < 200) return <TooSmall />
    const chartHeight = height - margin.top - margin.bottom // todo make this adaptive if more than 6 rows of timelines
    const timeValues = [getChartStartDate(patriarchTimeline, timelines), getChartEndDate(patriarchTimeline, timelines)]

    const xScale = scaleUtc({
        domain: getMinMax(timeValues),
        range: [0, chartWidth],
    })
    const tickFormat = (v: Date, i: number) => (chartWidth > 400 || i % 2 === 0 ? timeFormat("%Y")(v) : "")

    // const scaleHeight = 50
    const scalePadding = 40
    const scaleHeight = chartHeight - scalePadding

    // const yScale = scaleLinear({
    //     domain: [100, 0],
    //     range: [scaleHeight, 0], // flipped range to start graph at top
    // })
    const yScale = scaleOrdinal({
        domain: timelines.map(timeline => timeline.name),
        range: [barWidth * (timelines.length + 1), 0],
    })
    const xTickValues = listDecades(timeValues[0], timeValues[1])

    const yTickValues = [patriarchTimeline.name, ...timelines.map(timeline => timeline.name)]
    return (
        <svg width={width} height={height}>
            <rect width={width} height={height} fill={background} rx={14} />
            <Group top={margin.top} left={margin.left}>
                <AxisTop
                    scale={xScale}
                    tickFormat={tickFormat}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickLabelProps={tickLabelProps}
                    tickValues={xTickValues}
                    // animationTrajectory={animationTrajectory}
                />
                <AxisLeft
                    scale={yScale}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickValues={yTickValues}
                    // animationTrajectory={animationTrajectory}
                />
                <Patriarch patriarchTimeline={patriarchTimeline} yScale={yScale} xScale={xScale} />
                {timelines.map((timeline, i) => (
                    <Spouse
                        key={i}
                        patriarchTimeline={patriarchTimeline}
                        timeline={timeline}
                        yScale={yScale}
                        xScale={xScale}
                        yOffset={40*(i+1)}
                    />
                ))}
            </Group>
        </svg>
    )
}
