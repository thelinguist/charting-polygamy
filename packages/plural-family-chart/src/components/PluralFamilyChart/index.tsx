import { PatriarchTimeline, Timeline } from "lib/src/types"
import { Group } from "@visx/group"
import { AxisLeft } from "@visx/axis"
import { barHeight } from "./constants"
import { scaleOrdinal, scaleUtc } from "@visx/scale"
import { getMinMax } from "../../utils"
import { checkPersonDetails, getChartEndDate, getChartStartDate, getMarriageDomain } from "./utils"
import React, { useState } from "react"
import { Patriarch } from "./Patriarch"
import { Spouse } from "./Spouse"
// import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion"
import { BadData } from "./BadData"
import { TooSmall } from "./TooSmall"
import { TimelineAxis } from "./TimelineAxis"
import { useMarriageExpansion } from "../../hooks/useMarriageExpansion.ts"
import { BrushOverview } from "./BrushOverview"

interface Props {
    width?: number
    minHeight?: number
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    margin?: { top: number; right: number; bottom: number; left: number }
}

const defaultMargin = { top: 40, left: 125, right: 40, bottom: 100 }
export const background = "#f1ead8"

export const PluralFamilyChart: React.FC<Props> = ({
    width = 800,
    minHeight = 300,
    patriarchTimeline,
    timelines,
    margin = defaultMargin,
}) => {
    // const useAnimatedComponents = usePrefersReducedMotion()
    const { expandedIndex, handleClick, setHoveredIndex, resetPin } = useMarriageExpansion()
    const {
        expandedIndex: expandedSpouseIndex,
        handleClick: handleSpouseClick,
        setHoveredIndex: setHoveredSpouseIndex,
        resetPin: resetSpousePin,
    } = useMarriageExpansion()
    const [brushDomain, setBrushDomain] = useState<[Date, Date] | null>(
        () => getMarriageDomain(patriarchTimeline, timelines)
    )

    const dataErrors = checkPersonDetails(patriarchTimeline)
    if (dataErrors) return <BadData />

    const names = [patriarchTimeline.name, ...timelines.map(timeline => timeline.name)]
    const personDates = new Map<string, { birth: Date; death: Date }>([
        [patriarchTimeline.name, { birth: patriarchTimeline.birth, death: patriarchTimeline.death }],
        ...timelines.map(t => [t.name, { birth: t.birth, death: t.death }] as [string, { birth: Date; death: Date }]),
    ])

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
        <svg
            width={width}
            height={actualHeight}
            onClick={() => {
                resetPin()
                resetSpousePin()
            }}
        >
            <defs>
                <pattern
                    id="other-marriage-hatch"
                    patternUnits="userSpaceOnUse"
                    width="6"
                    height="6"
                    patternTransform="rotate(45)"
                >
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#b0a794" strokeWidth="1.5" strokeOpacity="0.5" />
                </pattern>
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
                    tickComponent={({ x, y, formattedValue }) => {
                        const dates = personDates.get(formattedValue ?? "")
                        return (
                            <text
                                textAnchor="end"
                                style={{ fontFamily: "var(--font-serif-text, Georgia, serif)" }}
                            >
                                <tspan x={x} y={y} dy="-0.35em" fontSize={14}>
                                    {formattedValue}
                                </tspan>
                                {dates && (
                                    <tspan x={x} dy="1.3em" fontSize={11} fill="#666">
                                        {dates.birth.getFullYear()} – {dates.death.getFullYear()}
                                    </tspan>
                                )}
                            </text>
                        )
                    }}
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
                        expandedIndex={
                            expandedIndex ??
                            (() => {
                                if (expandedSpouseIndex === null) return null
                                const start = timelines[expandedSpouseIndex].linkedMarriage.start
                                const idx = patriarchTimeline.marriages
                                    .filter(m => m.start)
                                    .findIndex(m => m.start!.getTime() === start.getTime())
                                return idx === -1 ? null : idx
                            })()
                        }
                        handleClick={handleClick}
                        setHoveredIndex={setHoveredIndex}
                        highlightedMarriageStart={
                            expandedSpouseIndex !== null
                                ? timelines[expandedSpouseIndex].linkedMarriage.start
                                : undefined
                        }
                    />
                    {timelines.map((timeline, index) => (
                        <Spouse
                            key={timeline.name}
                            patriarchTimeline={patriarchTimeline}
                            timeline={timeline}
                            yScale={yScale}
                            xScale={xScale}
                            colorIndex={index}
                            dim={
                                (expandedIndex !== null && expandedIndex !== index) ||
                                (expandedSpouseIndex !== null && expandedSpouseIndex !== index)
                            }
                            onLinkedMarriageHover={active => setHoveredSpouseIndex(active ? index : null)}
                            onLinkedMarriageClick={() => handleSpouseClick(index)}
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
                    initialDomain={brushDomain}
                    onChange={setBrushDomain}
                />
            </Group>
        </svg>
    )
}
