import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barHeight, MarriageKind } from "../constants"
import React from "react"
import { Marriage } from "../Marriage"
import { PersonTimeline } from "../PersonTimeline"
import { PositionScale } from "@visx/shape/lib/types"
import { useMarriageExpansion } from "../../../hooks/useMarriageExpansion"
import { getExpandedXEnd } from "../utils/getExpandedXEnd"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timeline: Timeline
    yScale: PositionScale
    xScale: (date: Date) => number
    dim?: boolean
    colorIndex?: number
    onLinkedMarriageHover?: (active: boolean) => void
    onLinkedMarriageClick?: () => void
}

export const Spouse: React.FC<Props> = ({
    patriarchTimeline,
    timeline,
    xScale,
    yScale,
    dim,
    colorIndex = 0,
    onLinkedMarriageHover,
    onLinkedMarriageClick,
}) => {
    const { expandedIndex, handleClick, setHoveredIndex } = useMarriageExpansion()

    const linkedStart = timeline.linkedMarriage.start

    // @ts-expect-error idk what the type should be for ordinal scales
    const yStart: number = yScale(timeline.name) ?? 0
    const yEnd = yStart + barHeight

    const marriageBounds = linkedStart
        ? (() => {
              const marriageEnd = Math.min(
                  timeline.death?.getTime() ?? Infinity,
                  timeline.linkedMarriage.end?.getTime() ?? Infinity,
                  patriarchTimeline.death?.getTime() ?? Infinity
              )
              return [
                  { x: xScale(linkedStart), y: yStart },
                  { x: xScale(new Date(marriageEnd)), y: yStart },
                  { x: xScale(new Date(marriageEnd)), y: yEnd },
                  { x: xScale(linkedStart), y: yEnd },
              ]
          })()
        : null

    const otherMarriageBounds = timeline.otherMarriages.map(marriage => [
        { x: xScale(marriage.start), y: yStart },
        { x: xScale(marriage.end), y: yStart },
        { x: xScale(marriage.end), y: yEnd },
        { x: xScale(marriage.start), y: yEnd },
    ])

    const marriageAge =
        linkedStart && timeline.birth
            ? `${(linkedStart.getFullYear() - timeline.birth.getFullYear()).toString()} years old`
            : ""

    const overlayProps = React.useMemo(() => {
        if (expandedIndex === null) return null

        if (expandedIndex === 0) {
            if (!linkedStart || !marriageBounds) return null
            const text1 = linkedStart.getFullYear().toString()
            const text2 = marriageAge
            const xStart = xScale(linkedStart)
            const xEnd = getExpandedXEnd(xStart, text1, text2, marriageBounds[1].x)
            return {
                kind: MarriageKind.Spouse as const,
                colorIndex,
                bounds: [
                    { x: xStart, y: yStart },
                    { x: xEnd, y: yStart },
                    { x: xEnd, y: yEnd },
                    { x: xStart, y: yEnd },
                ],
                text1,
                text2,
            }
        }

        const i = expandedIndex - 1
        const other = timeline.otherMarriages[i]
        if (!other) return null
        const text1 = other.start.getFullYear().toString()
        const text2 = other.spouse || ""
        const xStart = xScale(other.start)
        const xEnd = getExpandedXEnd(xStart, text1, text2, otherMarriageBounds[i][1].x)
        return {
            kind: MarriageKind.Other as const,
            colorIndex: i,
            bounds: [
                { x: xStart, y: yStart },
                { x: xEnd, y: yStart },
                { x: xEnd, y: yEnd },
                { x: xStart, y: yEnd },
            ],
            text1,
            text2,
        }
    }, [
        expandedIndex,
        timeline,
        xScale,
        yStart,
        yEnd,
        marriageAge,
        linkedStart,
        marriageBounds,
        otherMarriageBounds,
        colorIndex,
    ])

    return (
        <g opacity={dim ? 0.15 : 1} style={{ transition: "opacity 0.15s ease" }}>
            <PersonTimeline
                name={timeline.name}
                yScale={yScale}
                xScale={xScale}
                birth={timeline.birth}
                death={timeline.death}
            >
                <>
                    {linkedStart && marriageBounds && (
                        <Marriage
                            kind={MarriageKind.Spouse}
                            colorIndex={colorIndex}
                            bounds={marriageBounds}
                            text1={linkedStart.getFullYear().toString()}
                            text2={marriageAge}
                            onClick={() => {
                                handleClick(0)
                                onLinkedMarriageClick?.()
                            }}
                            onMouseEnter={() => {
                                setHoveredIndex(0)
                                onLinkedMarriageHover?.(true)
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null)
                                onLinkedMarriageHover?.(false)
                            }}
                        />
                    )}
                    {otherMarriageBounds.map((bounds, i) => (
                        <Marriage
                            key={timeline.otherMarriages[i].spouse || i}
                            kind={MarriageKind.Other}
                            colorIndex={i}
                            bounds={bounds}
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
                            kind={overlayProps.kind}
                            colorIndex={overlayProps.colorIndex}
                            bounds={overlayProps.bounds}
                            text1={overlayProps.text1}
                            text2={overlayProps.text2}
                            isExpanded
                            fillOpacity={0.9}
                            onClick={() => {
                                handleClick(expandedIndex!)
                                if (expandedIndex === 0) onLinkedMarriageClick?.()
                            }}
                            onMouseEnter={() => {
                                setHoveredIndex(expandedIndex!)
                                if (expandedIndex === 0) onLinkedMarriageHover?.(true)
                            }}
                            onMouseLeave={() => {
                                setHoveredIndex(null)
                                if (expandedIndex === 0) onLinkedMarriageHover?.(false)
                            }}
                        />
                    )}
                </>
            </PersonTimeline>
        </g>
    )
}
