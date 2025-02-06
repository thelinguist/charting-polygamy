import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barWidth, spouseColor, spouseMarriedColor, strokeColor, strokeWidth } from "./constants.ts"
import { PositionScale } from "@visx/shape/lib/types"

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

    return (
        <>
            <AreaClosed
                id={`spouse-${timeline.name}`}
                data={lifeBounds}
                x={d => d.x}
                y={d => d.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                yScale={yScale}
                fill={spouseColor}
            />
            <AreaClosed
                data={marriageBounds}
                x={d => d.x}
                y={d => d.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                yScale={yScale}
                fill={spouseMarriedColor}
            />
        </>
    )
}
