import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barWidth, otherMarriageColor, spouseColor, spouseMarriedColor, strokeColor, strokeWidth } from "./constants.ts"
import { PositionScale } from "@visx/shape/lib/types"
import { Area } from "@visx/shape"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timeline: Timeline
    yScale: PositionScale
    xScale: (date: Date) => number
}
export const Spouse: React.FC<Props> = ({ patriarchTimeline, timeline, xScale, yScale }) => {
    const end = Math.min(
        timeline.death.getTime(),
        timeline.linkedMarriage.end?.getTime() || Infinity,
        patriarchTimeline.death.getTime()
    )
    const yStart = yScale(timeline.name)!

    const lifeBounds = [
        { x: xScale(timeline.birth), y: yStart },
        { x: xScale(timeline.death), y: yStart },
        { x: xScale(timeline.death), y: yStart + barWidth },
        { x: xScale(timeline.birth), y: yStart + barWidth },
    ]

    const marriageBounds = [
        { x: xScale(timeline.linkedMarriage.start), y: yStart },
        { x: xScale(new Date(end)), y: yStart },
        { x: xScale(new Date(end)), y: yStart + barWidth },
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
            <Area
                data={marriageBounds}
                x0={marriageBounds[0].x}
                x1={marriageBounds[1].x}
                y={d => d.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill={spouseMarriedColor}
            />
            {otherMarriageBounds.map((bounds, i) => (
                <Area
                    key={i}
                    data={bounds}
                    x0={bounds[0].x}
                    x1={bounds[1].x}
                    y={d => d.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill={otherMarriageColor}
                />
            ))}
        </>
    )
}
