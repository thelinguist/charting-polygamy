import { PatriarchTimeline, Timeline } from "lib/src/types"
import { patriarchColor, patriarchMarriedColor, timelineAnnotationProps } from "../constants"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { scaleLinear } from "@visx/scale"
import { interpolateHcl } from "@visx/vendor/d3-interpolate"
import { PatriarchMarriage } from "./PatriarchMarriage"
import { PersonTimeline } from "../PersonTimeline"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    yScale: PositionScale
    xScale: (date: Date) => number
}
export const Patriarch: React.FC<Props> = ({ patriarchTimeline, timelines, yScale, xScale }) => {
    const [pinnedIndex, setPinnedIndex] = React.useState<number | null>(null)
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const expandedIndex = hoveredIndex ?? pinnedIndex

    const handleClick = (index: number) => {
        setPinnedIndex(prev => (prev === index ? null : index))
    }

    const concurrentCounts = patriarchTimeline.marriages.map(marriage => {
        const mStart = marriage.start!.getTime()
        return timelines.filter(timeline => {
            const spouseStart = timeline.linkedMarriage.start.getTime()
            const spouseEnd = Math.min(
                timeline.linkedMarriage.end?.getTime() ?? Infinity,
                timeline.death.getTime(),
                patriarchTimeline.death.getTime()
            )
            return spouseStart <= mStart && spouseEnd >= mStart
        }).length
    })

    const maxConcurrent = Math.max(...concurrentCounts, 1)
    const sizeColorScale = scaleLinear({
        domain: [0, maxConcurrent],
        range: [patriarchColor, patriarchMarriedColor],
    }).interpolate(interpolateHcl)

    const expandedXEnd = React.useMemo(() => {
        if (expandedIndex === null) return null
        const marriage = patriarchTimeline.marriages[expandedIndex]
        const marriageAge = marriage.age || marriage.start!.getFullYear() - patriarchTimeline.birth.getFullYear()
        const longestText = `${marriageAge} years old`
        const charWidth = timelineAnnotationProps.fontSize * 0.65
        const textXEnd = xScale(marriage.start!) + longestText.length * charWidth + 16
        const originalXEnd = xScale(new Date(Math.min(marriage.end?.getTime() ?? Infinity, patriarchTimeline.death.getTime())))
        return Math.max(textXEnd, originalXEnd)
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
                {patriarchTimeline.marriages.map((marriage, i) => (
                    <PatriarchMarriage
                        key={i}
                        xScale={xScale}
                        fillColor={sizeColorScale(concurrentCounts[i])}
                        patriarchTimeline={patriarchTimeline}
                        marriage={marriage}
                        onClick={() => handleClick(i)}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                ))}
                {expandedIndex !== null && (
                    <PatriarchMarriage
                        key="overlay"
                        xScale={xScale}
                        fillColor={sizeColorScale(concurrentCounts[expandedIndex])}
                        patriarchTimeline={patriarchTimeline}
                        marriage={patriarchTimeline.marriages[expandedIndex]}
                        isExpanded
                        expandedXEnd={expandedXEnd!}
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
