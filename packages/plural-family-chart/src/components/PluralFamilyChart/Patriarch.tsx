import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"
import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barWidth, patriarchColor, patriarchMarriedColor, strokeColor, strokeWidth } from "./constants.ts"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { scaleLinear } from "@visx/scale"

interface Props {
    patriarchTimeline: PatriarchTimeline
    // timelines: Timeline[]
    yScale: PositionScale
    xScale: (date: Date) => number
}
export const Patriarch: React.FC<Props> = ({ patriarchTimeline, yScale, xScale }) => {
    const start = patriarchTimeline.birth
    const end = patriarchTimeline.death

    const sizeColorScale = scaleLinear({
        domain: [0, patriarchTimeline.marriages.length],
        range: [patriarchColor, patriarchMarriedColor],
    })
    return (
        <g>
            <AreaClosed
                id={`patriarch-${patriarchTimeline.name}`}
                data={[
                    { x: xScale(start), y: 0 },
                    { x: xScale(end), y: 0 },
                    { x: xScale(end), y: barWidth },
                    { x: xScale(start), y: barWidth },
                ]}
                x={d => d.x}
                y={d => d.y}
                yScale={yScale}
                fill={patriarchColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
            {patriarchTimeline.marriages.map((marriage, i) => {
                const color = sizeColorScale(i + 1)
                return (
                    <AreaClosed
                        key={marriage.start?.getTime()}
                        id={`patriarch-marriage-${patriarchTimeline.name}`}
                        data={[
                            { x: xScale(marriage.start!), y: 0 },
                            { x: xScale(end), y: 0 },
                            { x: xScale(end), y: barWidth },
                            { x: xScale(marriage.start!), y: barWidth },
                        ]}
                        x={d => d.x}
                        y={d => d.y}
                        yScale={yScale}
                        fill={color}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                    />
                )
            })}
        </g>
    )
}
