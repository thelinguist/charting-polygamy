import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"

import { PatriarchTimeline, Timeline } from "lib/src/types"
import {
    barWidth,
    labelMarginStart,
    patriarchColor,
    patriarchMarriedColor,
    strokeColor,
    strokeWidth,
} from "./constants"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { scaleLinear } from "@visx/scale"
import { MarriageLabel } from "./MarriageLabel"
import { BirthLabel } from "./BirthLabel"

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
        <g>
            <AreaClosed
                id={`patriarch-${patriarchTimeline.name}`}
                data={[
                    { x: xScale(patriarchTimeline.birth), y: 0 },
                    { x: xScale(patriarchTimeline.death), y: 0 },
                    { x: xScale(patriarchTimeline.death), y: barWidth },
                    { x: xScale(patriarchTimeline.birth), y: barWidth },
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
            {patriarchTimeline.marriages.map((marriage, i) => {
                const color = sizeColorScale(i + 1)
                const end = Math.min(marriage.end?.getTime() || Infinity, patriarchTimeline.death.getTime())
                return (
                    <>
                        <AreaClosed
                            key={marriage.start?.getTime()}
                            id={`patriarch-marriage-${patriarchTimeline.name}`}
                            data={[
                                { x: xScale(marriage.start!), y: 0 },
                                { x: xScale(new Date(end)), y: 0 },
                                { x: xScale(new Date(end)), y: barWidth },
                                { x: xScale(marriage.start!), y: barWidth },
                            ]}
                            x={d => d.x}
                            y={d => d.y}
                            yScale={yScale}
                            fill={color}
                            stroke={strokeColor}
                            strokeWidth={strokeWidth}
                        />
                        <MarriageLabel
                            xStart={xScale(marriage.start!) + labelMarginStart}
                            yStart={0}
                            year={marriage.start!.getFullYear()}
                            age={marriage.age || marriage.start!.getFullYear() - patriarchTimeline.birth.getFullYear()}
                        />
                    </>
                )
            })}
        </g>
    )
}
