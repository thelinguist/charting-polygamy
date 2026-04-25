import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barHeight, patriarchColor, patriarchMarriedColor } from "../constants"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { scaleLinear } from "@visx/scale"
import { interpolateHcl } from "@visx/vendor/d3-interpolate"
import { Marriage } from "../Marriage"
import { PersonTimeline } from "../PersonTimeline"
import { useMarriageExpansion } from "../hooks/useMarriageExpansion"
import { getExpandedXEnd } from "../utils/getExpandedXEnd"
import { getConcurrentCounts } from "./getConcurrentCounts"

type PatriarchMarriage = PatriarchTimeline["marriages"][number]

interface Props {
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    yScale: PositionScale
    xScale: (date: Date) => number
}

export const Patriarch: React.FC<Props> = ({ patriarchTimeline, timelines, yScale, xScale }) => {
    const { expandedIndex, handleClick, setHoveredIndex } = useMarriageExpansion()

    const concurrentCounts = getConcurrentCounts(patriarchTimeline, timelines)

    const maxConcurrent = Math.max(...concurrentCounts, 1)
    const sizeColorScale = scaleLinear({
        domain: [0, maxConcurrent],
        range: [patriarchColor, patriarchMarriedColor],
    }).interpolate(interpolateHcl)

    const getMarriageEnd = (marriage: PatriarchMarriage) =>
        Math.min(marriage.end?.getTime() ?? Infinity, patriarchTimeline.death?.getTime() ?? Infinity)

    const getMarriageAge = (marriage: PatriarchMarriage) =>
        marriage.age || (marriage.start && patriarchTimeline.birth
            ? marriage.start.getFullYear() - patriarchTimeline.birth.getFullYear()
            : 0)

    const getBounds = (marriage: PatriarchMarriage, xEndOverride?: number) => {
        const x0 = xScale(marriage.start!)
        const xEnd = xEndOverride ?? xScale(new Date(getMarriageEnd(marriage)))
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
        const text2 = `${getMarriageAge(marriage)} years old`
        return getExpandedXEnd(xScale(marriage.start), text1, text2, xScale(new Date(getMarriageEnd(marriage))))
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
                {marriages.map((marriage, i) => (
                    <Marriage
                        key={i}
                        bounds={getBounds(marriage)}
                        fillColor={sizeColorScale(concurrentCounts[i])}
                        text1={marriage.start!.getFullYear().toString()}
                        text2={`${getMarriageAge(marriage)} years old`}
                        onClick={() => handleClick(i)}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                ))}
                {expandedIndex !== null && marriages[expandedIndex]?.start && (
                    <Marriage
                        key="overlay"
                        bounds={getBounds(marriages[expandedIndex], overlayXEnd ?? undefined)}
                        fillColor={sizeColorScale(concurrentCounts[expandedIndex])}
                        text1={marriages[expandedIndex].start!.getFullYear().toString()}
                        text2={`${getMarriageAge(marriages[expandedIndex])} years old`}
                        isExpanded
                        fillOpacity={0.85}
                        onClick={() => handleClick(expandedIndex)}
                        onMouseEnter={() => setHoveredIndex(expandedIndex)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                )}
            </>
        </PersonTimeline>
    )
}
