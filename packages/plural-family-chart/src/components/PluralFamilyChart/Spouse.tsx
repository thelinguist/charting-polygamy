import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barWidth, spouseColor, spouseMarriedColor, strokeColor, strokeWidth } from "./constants"
import { Area } from "@visx/shape"
import React from "react"
import { MarriageLabel } from "./MarriageLabel"
import { BirthLabel } from "./BirthLabel"
import { OtherMarriage } from "./OtherMarriage"

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
        { x: xScale(timeline.death), y: yStart + barWidth },
        { x: xScale(timeline.birth), y: yStart + barWidth },
    ]

    const marriageBounds = [
        { x: xScale(timeline.linkedMarriage.start), y: yStart },
        { x: xScale(new Date(marriageEnd)), y: yStart },
        { x: xScale(new Date(marriageEnd)), y: yStart + barWidth },
        { x: xScale(timeline.linkedMarriage.start), y: yStart + barWidth },
    ]

    const otherMarriageBounds = timeline.otherMarriages.map(marriage => {
        return [
            { x: xScale(marriage.start), y: yStart },
            { x: xScale(marriage.end), y: yStart },
            { x: xScale(marriage.end), y: yStart + barWidth },
            { x: xScale(marriage.start), y: yStart + barWidth },
        ]
    })

    return (
        <>
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
            <Area
                data={marriageBounds}
                x0={marriageBounds[0].x}
                x1={marriageBounds[1].x}
                y={d => d.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={spouseMarriedColor}
            />
            <MarriageLabel
                xStart={xScale(timeline.linkedMarriage.start)}
                xEnd={xScale(new Date(marriageEnd))}
                yStart={yStart}
                year={timeline.linkedMarriage.start.getFullYear()}
                age={timeline.linkedMarriage.start.getFullYear() - timeline.birth.getFullYear()} // get actual age
            />
            {otherMarriageBounds.map((bounds, i) => (
                <OtherMarriage
                    key={timeline.otherMarriages[i].spouse || i}
                    otherMarriage={timeline.otherMarriages[i]}
                    bounds={bounds}
                    yStart={yStart}
                />
            ))}
        </>
    )
}
