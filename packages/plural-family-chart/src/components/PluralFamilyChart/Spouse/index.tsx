import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barHeight, otherMarriageColor, spouseColor, spouseMarriedColor, strokeColor, strokeWidth } from "../constants"
import { Area } from "@visx/shape"
import React from "react"
import { BirthLabel } from "../BirthLabel.tsx"
import { Marriage } from "../Marriage"
import { HoverContextProvider } from "../../../hooks/HoverContext"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timeline: Timeline
    yScale: (name: string) => number
    xScale: (date: Date) => number
}
export const Spouse: React.FC<Props> = ({ patriarchTimeline, timeline, xScale, yScale }) => {
    const marriageEnd = Math.min(
        timeline.death.getTime(),
        timeline.linkedMarriage.end?.getTime() || Infinity,
        patriarchTimeline.death.getTime()
    )
    const yStart = yScale(timeline.name)

    const lifeBounds = [
        { x: xScale(timeline.birth), y: yStart },
        { x: xScale(timeline.death), y: yStart },
        { x: xScale(timeline.death), y: yStart + barHeight },
        { x: xScale(timeline.birth), y: yStart + barHeight },
    ]

    const marriageBounds = [
        { x: xScale(timeline.linkedMarriage.start), y: yStart },
        { x: xScale(new Date(marriageEnd)), y: yStart },
        { x: xScale(new Date(marriageEnd)), y: yStart + barHeight },
        { x: xScale(timeline.linkedMarriage.start), y: yStart + barHeight },
    ]

    const otherMarriageBounds = timeline.otherMarriages.map(marriage => {
        return [
            { x: xScale(marriage.start), y: yStart },
            { x: xScale(marriage.end), y: yStart },
            { x: xScale(marriage.end), y: yStart + barHeight },
            { x: xScale(marriage.start), y: yStart + barHeight },
        ]
    })

    const marriageAge = `${(
        timeline.linkedMarriage.start.getFullYear() - timeline.birth.getFullYear()
    ).toString()} years old`

    return (
        <HoverContextProvider>
            <Area
                id={`spouse-${timeline.name}`}
                data={lifeBounds}
                x0={lifeBounds[0].x + 0.000001}
                x1={lifeBounds[1].x}
                y={d => d.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={spouseColor}
            />
            <BirthLabel xStart={xScale(timeline.birth)} yStart={yStart} year={timeline.birth.getFullYear()} />
            <Marriage
                bounds={marriageBounds}
                fillColor={spouseMarriedColor}
                text1={timeline.linkedMarriage.start.getFullYear()}
                text2={marriageAge}
            />
            {otherMarriageBounds.map((bounds, i) => (
                <Marriage
                    key={timeline.otherMarriages[i].spouse || i}
                    bounds={bounds}
                    fillColor={otherMarriageColor}
                    text1={timeline.otherMarriages[i].start.getFullYear()}
                    text2={timeline.otherMarriages[i].spouse}
                />
            ))}
        </HoverContextProvider>
    )
}
