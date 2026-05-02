import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barHeight, MarriageKind } from "../constants"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { Marriage } from "../Marriage"
import { PersonTimeline } from "../PersonTimeline"
import { getExpandedXEnd } from "../utils/getExpandedXEnd"
import { getConcurrentCounts } from "./getConcurrentCounts"
import { getMarriageAge, getMarriageEnd } from "./utils"

type PatriarchMarriage = PatriarchTimeline["marriages"][number]

interface Props {
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    yScale: PositionScale
    xScale: (date: Date) => number
    expandedIndex: number | null
    handleClick: (index: number) => void
    setHoveredIndex: (index: number | null) => void
    highlightedMarriageStart?: Date
}

export const Patriarch: React.FC<Props> = ({
    patriarchTimeline,
    timelines,
    yScale,
    xScale,
    expandedIndex,
    handleClick,
    setHoveredIndex,
    highlightedMarriageStart,
}) => {
    const concurrentCounts = getConcurrentCounts(patriarchTimeline, timelines)

    const getBounds = (marriage: PatriarchMarriage, xEndOverride?: number) => {
        const x0 = xScale(marriage.start!)
        const xEnd = xEndOverride ?? xScale(new Date(getMarriageEnd(marriage, patriarchTimeline)))
        return [
            { x: x0, y: 0 },
            { x: xEnd, y: 0 },
            { x: xEnd, y: barHeight },
            { x: x0, y: barHeight },
        ]
    }

    const marriages = patriarchTimeline.marriages.filter(m => m.start)

    const overlayXEnd = React.useMemo(() => {
        if (expandedIndex === null) return null
        const marriage = marriages[expandedIndex]
        if (!marriage?.start) return null
        const text1 = marriage.start.getFullYear().toString()
        const text2 = `${getMarriageAge(marriage, patriarchTimeline)} years old`
        return getExpandedXEnd(
            xScale(marriage.start),
            text1,
            text2,
            xScale(new Date(getMarriageEnd(marriage, patriarchTimeline)))
        )
        // eslint-disable-next-line
    }, [expandedIndex, patriarchTimeline, xScale])

    return (
        <PersonTimeline
            name={patriarchTimeline.name}
            birth={patriarchTimeline.birth}
            death={patriarchTimeline.death}
            xScale={xScale}
            yScale={yScale}
            isPatriarch
        >
            <>
                {marriages.map((marriage, i) => {
                    const dim =
                        highlightedMarriageStart !== undefined &&
                        marriage.start?.getTime() !== highlightedMarriageStart.getTime()
                    return (
                        <g key={i} opacity={dim ? 0.15 : 1} style={{ transition: "opacity 0.15s ease" }}>
                            <Marriage
                                kind={MarriageKind.Patriarch}
                                colorIndex={concurrentCounts[i]}
                                bounds={getBounds(marriage)}
                                text1={marriage.start!.getFullYear().toString()}
                                text2={`${getMarriageAge(marriage, patriarchTimeline)} years old`}
                                onClick={() => handleClick(i)}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        </g>
                    )
                })}
                {expandedIndex !== null && marriages[expandedIndex]?.start && (
                    <Marriage
                        key="overlay"
                        kind={MarriageKind.Patriarch}
                        colorIndex={concurrentCounts[expandedIndex]}
                        bounds={getBounds(marriages[expandedIndex], overlayXEnd ?? undefined)}
                        text1={marriages[expandedIndex].start!.getFullYear().toString()}
                        text2={`${getMarriageAge(marriages[expandedIndex], patriarchTimeline)} years old`}
                        isExpanded
                        fillOpacity={0.9}
                        onClick={() => handleClick(expandedIndex)}
                        onMouseEnter={() => setHoveredIndex(expandedIndex)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                )}
            </>
        </PersonTimeline>
    )
}
