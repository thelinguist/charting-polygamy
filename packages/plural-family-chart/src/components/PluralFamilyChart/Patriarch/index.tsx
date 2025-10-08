import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"

import { PatriarchTimeline, Timeline } from "lib/src/types"
import { barHeight, patriarchColor, patriarchMarriedColor, strokeColor, strokeWidth } from "../constants.ts"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { scaleLinear } from "@visx/scale"
import { PatriarchMarriage } from "./PatriarchMarriage"
import { HoverContextProvider } from "../../../hooks/HoverContext.tsx"
import { BirthLabel } from "../BirthLabel.tsx"

interface Props {
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
    yScale: PositionScale
    xScale: (date: Date) => number
}
export const Patriarch: React.FC<Props> = ({ patriarchTimeline, yScale, xScale }) => {
    // todo the color should be based on concurrent marriages, not number of marriages
    // I can calculate this by the following code
    // const concurrentMarriages = patriarchTimeline.marriages.reduce((acc, marriage) => {
    //     const start = marriage.start!.getTime()
    //     const end = marriage.end!.getTime()
    //     return acc + timelines.filter(timeline => {
    //         return timeline.linkedMarriage.start!.getTime() <= end && timeline.linkedMarriage.end!.getTime() >= start
    //     }).length
    // }, 0)

    const sizeColorScale = scaleLinear({
        domain: [0, patriarchTimeline.marriages.length],
        range: [patriarchColor, patriarchMarriedColor],
    })

    return (
        <HoverContextProvider>
            <g>
                <AreaClosed
                    id={`patriarch-${patriarchTimeline.name}`}
                    data={[
                        { x: xScale(patriarchTimeline.birth), y: 0 },
                        { x: xScale(patriarchTimeline.death), y: 0 },
                        { x: xScale(patriarchTimeline.death), y: barHeight },
                        { x: xScale(patriarchTimeline.birth), y: barHeight },
                    ]}
                    x={d => d.x}
                    y={d => d.y}
                    yScale={yScale}
                    fill={patriarchColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                />
                <BirthLabel
                    xStart={xScale(patriarchTimeline.birth)}
                    yStart={0}
                    year={patriarchTimeline.birth.getFullYear()}
                />
                {patriarchTimeline.marriages.map((marriage, i) => (
                    <PatriarchMarriage
                        key={i}
                        xScale={xScale}
                        fillColor={sizeColorScale(i + 1)}
                        patriarchTimeline={patriarchTimeline}
                        marriage={marriage}
                    />
                ))}
            </g>
        </HoverContextProvider>
    )
}
