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
    onClick?: () => void
    isHiding?: boolean
    isExpanded?: boolean
    labelOnly?: boolean
    expandedXEnd?: number
    fillOpacity?: number
}

export const PatriarchMarriage: React.FC<Props> = ({ onClick, isHiding, isExpanded, labelOnly, expandedXEnd, fillOpacity, marriage, patriarchTimeline, xScale, fillColor }) => {
    const x0 = xScale(marriage.start!)
    const patriarchEnd = Math.min(marriage.end?.getTime() || Infinity, patriarchTimeline.death.getTime())
    const marriageAge = marriage.age || marriage.start!.getFullYear() - patriarchTimeline.birth.getFullYear()
    const xEnd = expandedXEnd ?? xScale(new Date(patriarchEnd))

    const bounds = [
        { x: x0, y: 0 },
        { x: xEnd, y: 0 },
        { x: xEnd, y: barHeight },
        { x: x0, y: barHeight },
    ]
    return (
        <Marriage
            isHiding={isHiding}
            isExpanded={isExpanded}
            labelOnly={labelOnly}
            fillOpacity={fillOpacity}
            onClick={onClick}
            bounds={bounds}
            fillColor={fillColor}
            text1={marriage.start!.getFullYear()}
            text2={`${marriageAge.toString()} years old`}
        />
    )
}
