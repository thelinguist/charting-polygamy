import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barHeight, otherMarriageColor, spouseMarriedColor } from "../constants"
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

    return (
        <PersonTimeline name={timeline.name} yScale={yScale} xScale={xScale} birth={timeline.birth} death={timeline.death}>
            <>
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
            </>
        </PersonTimeline>
    )
}
