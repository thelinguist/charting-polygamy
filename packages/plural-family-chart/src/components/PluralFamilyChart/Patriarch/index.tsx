import { PatriarchTimeline, Timeline } from "lib/src/types"
import { patriarchColor, patriarchMarriedColor } from "../constants"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { scaleLinear } from "@visx/scale"
import { PatriarchMarriage } from "./PatriarchMarriage"
import { PersonTimeline } from "../PersonTimeline"

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
        <PersonTimeline
            name={patriarchTimeline.name}
            birth={patriarchTimeline.birth}
            death={patriarchTimeline.death}
            xScale={xScale}
            yScale={yScale}
            isPatriarch
        >
            {patriarchTimeline.marriages.map((marriage, i) => (
                <PatriarchMarriage
                    key={i}
                    xScale={xScale}
                    fillColor={sizeColorScale(i + 1)}
                    patriarchTimeline={patriarchTimeline}
                    marriage={marriage}
                />
            ))}
        </PersonTimeline>
    )
}
