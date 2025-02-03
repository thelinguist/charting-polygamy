import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { spouseColor, spouseMarriedColor, strokeColor, strokeWidth } from "./constants.ts"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timeline: Timeline
    scaleHeight: number
    yScale: any
    scale: any
}
export const Spouse: React.FC<Props> = ({ patriarchTimeline, timeline, scale, scaleHeight, yScale }) => {
    const end = Math.min(
        timeline.death.getTime(),
        timeline.linkedMarriage.end?.getTime() || Infinity,
        patriarchTimeline.death.getTime()
    )
    return (
        <>
            <AreaClosed
                data={[
                    { x: scale(timeline.birth), y: scaleHeight },
                    { x: scale(timeline.death), y: scaleHeight },
                    { x: scale(timeline.death), y: scaleHeight / 2 },
                    { x: scale(timeline.birth), y: scaleHeight / 2 },
                ]}
                x={d => d.x}
                y={d => d.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                yScale={yScale}
                fill={spouseColor}
            />
            <AreaClosed
                data={[
                    { x: scale(timeline.linkedMarriage.start), y: scaleHeight },
                    { x: scale(end), y: scaleHeight },
                    { x: scale(end), y: scaleHeight / 2 },
                    { x: scale(timeline.linkedMarriage.start), y: scaleHeight / 2 },
                ]}
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
