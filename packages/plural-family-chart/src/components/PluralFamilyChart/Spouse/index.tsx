import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barHeight, otherMarriageColor, spouseMarriedColor, timelineAnnotationProps } from "../constants"
import React from "react"
import { Marriage } from "../Marriage"
import { PersonTimeline } from "../PersonTimeline"
import { PositionScale } from "@visx/shape/lib/types"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timeline: Timeline
    yScale: PositionScale
    xScale: (date: Date) => number
}
export const Spouse: React.FC<Props> = ({ patriarchTimeline, timeline, xScale, yScale }) => {
    const [pinnedIndex, setPinnedIndex] = React.useState<number | null>(null)
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const expandedIndex = hoveredIndex ?? pinnedIndex

    const handleClick = (index: number) => {
        setPinnedIndex(prev => (prev === index ? null : index))
    }
    const marriageEnd = Math.min(
        timeline.death.getTime(),
        timeline.linkedMarriage.end?.getTime() || Infinity,
        patriarchTimeline.death.getTime()
    )
    // @ts-expect-error idk what the type should be for ordinal scales
    const yStart = yScale(timeline.name)
    const yEnd = yStart + barHeight

    const marriageBounds = [
        { x: xScale(timeline.linkedMarriage.start), y: yStart },
        { x: xScale(new Date(marriageEnd)), y: yStart },
        { x: xScale(new Date(marriageEnd)), y: yEnd },
        { x: xScale(timeline.linkedMarriage.start), y: yEnd },
    ]

    const otherMarriageBounds = timeline.otherMarriages.map(marriage => {
        return [
            { x: xScale(marriage.start), y: yStart },
            { x: xScale(marriage.end), y: yStart },
            { x: xScale(marriage.end), y: yEnd },
            { x: xScale(marriage.start), y: yEnd },
        ]
    })

    const marriageAge = `${(
        timeline.linkedMarriage.start.getFullYear() - timeline.birth.getFullYear()
    ).toString()} years old`

    const overlayProps = React.useMemo(() => {
        if (expandedIndex === null) return null
        const charWidth = timelineAnnotationProps.fontSize * 0.65

        if (expandedIndex === 0) {
            const text1 = timeline.linkedMarriage.start.getFullYear().toString()
            const text2 = marriageAge
            const xStart = xScale(timeline.linkedMarriage.start)
            const textXEnd = xStart + Math.max(text1.length, text2.length) * charWidth + 16
            const expandedXEnd = Math.max(textXEnd, marriageBounds[1].x)
            return {
                bounds: [
                    { x: xStart, y: yStart },
                    { x: expandedXEnd, y: yStart },
                    { x: expandedXEnd, y: yEnd },
                    { x: xStart, y: yEnd },
                ],
                fillColor: spouseMarriedColor,
                text1,
                text2,
            }
        }

        const i = expandedIndex - 1
        const otherMarriage = timeline.otherMarriages[i]
        const text1 = otherMarriage.start.getFullYear().toString()
        const text2 = otherMarriage.spouse || ''
        const xStart = xScale(otherMarriage.start)
        const textXEnd = xStart + Math.max(text1.length, text2.length) * charWidth + 16
        const expandedXEnd = Math.max(textXEnd, otherMarriageBounds[i][1].x)
        return {
            bounds: [
                { x: xStart, y: yStart },
                { x: expandedXEnd, y: yStart },
                { x: expandedXEnd, y: yEnd },
                { x: xStart, y: yEnd },
            ],
            fillColor: otherMarriageColor,
            text1,
            text2,
        }
    }, [expandedIndex, timeline, xScale, yStart, yEnd, marriageAge])

    // TODO sort all marriages by start

    return (
        <PersonTimeline
            name={timeline.name}
            yScale={yScale}
            xScale={xScale}
            birth={timeline.birth}
            death={timeline.death}
        >
            <>
                <Marriage
                    bounds={marriageBounds}
                    fillColor={spouseMarriedColor}
                    text1={timeline.linkedMarriage.start.getFullYear().toString()}
                    text2={marriageAge}
                    onClick={() => handleClick(0)}
                    onMouseEnter={() => setHoveredIndex(0)}
                    onMouseLeave={() => setHoveredIndex(null)}
                />
                {otherMarriageBounds.map((bounds, i) => (
                    <Marriage
                        key={timeline.otherMarriages[i].spouse || i}
                        bounds={bounds}
                        fillColor={otherMarriageColor}
                        text1={timeline.otherMarriages[i].start.getFullYear().toString()}
                        text2={timeline.otherMarriages[i].spouse}
                        onClick={() => handleClick(i + 1)}
                        onMouseEnter={() => setHoveredIndex(i + 1)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                ))}
                {overlayProps && (
                    <Marriage
                        key="overlay"
                        bounds={overlayProps.bounds}
                        fillColor={overlayProps.fillColor}
                        text1={overlayProps.text1}
                        text2={overlayProps.text2}
                        isExpanded
                        fillOpacity={0.85}
                        onClick={() => handleClick(expandedIndex!)}
                        onMouseEnter={() => setHoveredIndex(expandedIndex!)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    />
                )}
            </>
        </PersonTimeline>
    )
}
