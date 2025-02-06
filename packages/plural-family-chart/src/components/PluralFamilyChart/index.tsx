import { PatriarchTimeline, Timeline } from "lib/src/types"
import { Group } from "@visx/group"
import { AxisLeft } from "@visx/axis"
import { axisColor, barWidth } from "./constants"
import { scaleOrdinal, scaleUtc } from "@visx/scale"
import { getMinMax } from "../../utils"
import { checkPersonDetails, getChartEndDate, getChartStartDate } from "./utils"
import React from "react"
import { Patriarch } from "./Patriarch"
import { Spouse } from "./Spouse"
// import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"
import { BadData } from "./BadData"
import { TooSmall } from "./TooSmall"
import { TimelineAxis } from "./TimelineAxis"

interface Props {
    width?: number
    height?: number
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    margin?: { top: number; right: number; bottom: number; left: number }
}

const defaultMargin = { top: 40, left: 100, right: 40, bottom: 100 }
export const background = "#eaedff"

export const PluralFamilyChart: React.FC<Props> = ({
    width = 800,
    height = 600,
    patriarchTimeline,
    timelines,
    margin = defaultMargin,
}) => {
    // const useAnimatedComponents = usePrefersReducedMotion()
    const dataErrors = checkPersonDetails(patriarchTimeline)
    if (dataErrors) return <BadData />

    const chartWidth = width - margin.left - margin.right
    if (chartWidth < 200) return <TooSmall />
    // const chartHeight = height - margin.top - margin.bottom // todo make this adaptive if more than 6 rows of timelines
    const timeValues = [getChartStartDate(patriarchTimeline, timelines), getChartEndDate(patriarchTimeline, timelines)]

    const xScale = scaleUtc({
        domain: getMinMax(timeValues),
        range: [0, chartWidth],
    })
    // const scaleHeight = 50
    // const scalePadding = 40
    // const scaleHeight = chartHeight - scalePadding

    const names = [patriarchTimeline.name, ...timelines.map(timeline => timeline.name)]
    const ranges = names.map((_name, i) => i * barWidth)
    const yScale = scaleOrdinal({
        domain: names,
        range: ranges,
    })

    return (
        <svg width={width} height={height}>
            <rect width={width} height={height} fill={background} rx={14} />
            <Group top={margin.top} left={margin.left}>
                <TimelineAxis xScale={xScale} chartWidth={chartWidth} timeValues={timeValues as [Date, Date]} />
                <AxisLeft
                    scale={yScale}
                    stroke={axisColor}
                    tickStroke={axisColor}
                    tickValues={names}
                    tickLabelProps={{
                        verticalAnchor: "start",
                        fontSize: 14,
                    }}
                    // animationTrajectory={animationTrajectory}
                />
                <Patriarch
                    patriarchTimeline={patriarchTimeline}
                    timelines={timelines}
                    yScale={yScale}
                    xScale={xScale}
                />
                {timelines.map(timeline => (
                    <Spouse
                        key={timeline.name}
                        patriarchTimeline={patriarchTimeline}
                        timeline={timeline}
                        yScale={yScale}
                        xScale={xScale}
                    />
                ))}
            </Group>
        </svg>
    )
}
