import { barHeight } from "../constants"
import React from "react"
import { Marriage } from "../Marriage"
import { PatriarchTimeline } from "lib/src/types"

interface Props {
    marriage:
        | {
              start: Date | null
              end?: Date | null
              age?: number
          }
        | any
    patriarchTimeline: PatriarchTimeline
    fillColor: string
    xScale: (date: Date) => number
}

export const PatriarchMarriage: React.FC<Props> = ({ marriage, patriarchTimeline, xScale, fillColor }) => {
    const x0 = xScale(marriage.start!)
    const patriarchEnd = Math.min(marriage.end?.getTime() || Infinity, patriarchTimeline.death.getTime())
    const marriageAge = marriage.age || marriage.start!.getFullYear() - patriarchTimeline.birth.getFullYear()

    const bounds = [
        { x: x0, y: 0 },
        { x: xScale(new Date(patriarchEnd)), y: 0 },
        { x: xScale(new Date(patriarchEnd)), y: barHeight },
        { x: x0, y: barHeight },
    ]
    return (
        <Marriage
            bounds={bounds}
            fillColor={fillColor}
            text1={marriage.start!.getFullYear()}
            text2={`${marriageAge.toString()} years old`}
        />
    )
}
