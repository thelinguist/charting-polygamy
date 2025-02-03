import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { patriarchColor, strokeColor, strokeWidth } from "./constants.ts"
import React from "react"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    scaleHeight: number
    yScale: any
    scale: any
}
export const Patriarch: React.FC<Props> = ({ patriarchTimeline, scaleHeight, yScale, scale }) => {
    const start = patriarchTimeline.birth
    const end = patriarchTimeline.death
    const height = scaleHeight / 2
    const marriageColors = ["#431abc"] // todo do gradient from patriarchColor to this dark purple with steps based on number of marriages

    return (
        <>
            <AreaClosed
                data={[
                    { x: scale(start), y: 0 },
                    { x: scale(end), y: 0 },
                    { x: scale(end), y: height },
                    { x: scale(start), y: height },
                ]}
                x={d => d.x}
                y={d => d.y}
                yScale={yScale}
                fill={patriarchColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
            <AreaClosed
                data={[
                    { x: scale(patriarchTimeline.marriages[0].start), y: 0 },
                    { x: scale(end), y: 0 },
                    { x: scale(end), y: height },
                    { x: scale(patriarchTimeline.marriages[0].start), y: height },
                ]}
                x={d => d.x}
                y={d => d.y}
                yScale={yScale}
                fill={marriageColors[0]}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
        </>
    )
}
