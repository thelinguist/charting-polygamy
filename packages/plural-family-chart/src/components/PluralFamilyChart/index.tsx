import { PatriarchTimeline, Timeline } from "lib/src/types"
import { Group } from "@visx/group"
import { AxisLeft } from "@visx/axis"
import { barHeight } from "./constants"
import { scaleOrdinal, scaleUtc } from "@visx/scale"
import { getMinMax } from "../../utils"
import { checkPersonDetails, getChartEndDate, getChartStartDate } from "./utils"
import React, { useState } from "react"
import { Patriarch } from "./Patriarch"
import { Spouse } from "./Spouse"
// import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"
import { BadData } from "./BadData"
import { TooSmall } from "./TooSmall"
import { TimelineAxis } from "./TimelineAxis"
import { useMarriageExpansion } from "./hooks/useMarriageExpansion"
import { BrushOverview } from "./BrushOverview"

interface Props {
    width?: number
    minHeight?: number
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    margin?: { top: number; right: number; bottom: number; left: number }
}

const defaultMargin = { top: 40, left: 125, right: 40, bottom: 100 }
export const background = "#eaedff"

export const PluralFamilyChart: React.FC<Props> = ({
    width = 800,
    minHeight = 600,
    patriarchTimeline,
    timelines,
    margin = defaultMargin,
}) => {
    // const useAnimatedComponents = usePrefersReducedMotion()
    const { expandedIndex, handleClick, setHoveredIndex } = useMarriageExpansion()
    const [brushDomain, setBrushDomain] = useState<[Date, Date] | null>(null)

    const dataErrors = checkPersonDetails(patriarchTimeline)
    if (dataErrors) return <BadData />

    const names = [patriarchTimeline.name, ...timelines.map(timeline => timeline.name)]

    const largestName = names.reduce((acc, name) => (name.length > acc ? name.length : acc), 0)
    const marginLeft = largestName * 9 // todo I should find a way to get the div width (i vs w)

    const chartWidth = width - marginLeft - margin.right
    if (chartWidth < 200) return <TooSmall />

    const mainHeight = Math.max(timelines.length * barHeight + margin.top + margin.bottom, minHeight)
    const overviewHeight = 50
    const overviewMargin = 12
    const actualHeight = mainHeight + overviewMargin + overviewHeight

    const timeValues = [getChartStartDate(patriarchTimeline, timelines), getChartEndDate(patriarchTimeline, timelines)]

    const brushXScale = scaleUtc({
        domain: getMinMax(timeValues),
        range: [0, chartWidth],
    })

    const xScale = scaleUtc({
        domain: brushDomain ?? getMinMax(timeValues),
        range: [0, chartWidth],
    })

    const ranges = names.map((_name, i) => i * barHeight)
    const yScale = scaleOrdinal({
        domain: names,
        range: ranges,
    })

    const clipId = `chart-clip-${patriarchTimeline.name.replace(/\s+/g, "-")}`

    return (
        <svg width={width} height={actualHeight}>
            <defs>
                <clipPath id={clipId}>
                    <rect x={0} y={-margin.top} width={chartWidth} height={mainHeight} />
                </clipPath>
            </defs>
            <rect width={width} height={actualHeight} fill={background} rx={14} />
            <Group top={margin.top} left={marginLeft}>
                <AxisLeft
                    scale={yScale}
                    hideTicks
                    tickTransform={`translate(0,${barHeight / 2})`}
                    hideAxisLine
                    tickValues={names}
                    tickLabelProps={{
                        verticalAnchor: "middle",
                        fontSize: 14,
                    }}
                    // animationTrajectory={animationTrajectory}
                />
                <Group clipPath={`url(#${clipId})`}>
                    <TimelineAxis
                        xScale={xScale}
                        chartWidth={chartWidth}
                        timeValues={(brushDomain ?? timeValues) as [Date, Date]}
                    />
                    <Patriarch
                        patriarchTimeline={patriarchTimeline}
                        timelines={timelines}
                        yScale={yScale}
                        xScale={xScale}
                        expandedIndex={expandedIndex}
                        handleClick={handleClick}
                        setHoveredIndex={setHoveredIndex}
                    />
                    {timelines.map((timeline, index) => (
                        <Spouse
                            key={timeline.name}
                            patriarchTimeline={patriarchTimeline}
                            timeline={timeline}
                            yScale={yScale}
                            xScale={xScale}
                            dim={expandedIndex !== null && expandedIndex !== index}
                        />
                    ))}
                </Group>
            </Group>
            <Group top={mainHeight + overviewMargin} left={marginLeft}>
                <BrushOverview
                    xScale={brushXScale}
                    width={chartWidth}
                    height={overviewHeight}
                    patriarchTimeline={patriarchTimeline}
                    timelines={timelines}
                    onChange={setBrushDomain}
                />
            </Group>
        </svg>
    )
}
