import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"
import { barHeight, strokeColor, strokeWidth } from "../constants.ts"
import { MarriageLabel } from "../MarriageLabel.tsx"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"

interface Props {
    marriage: {
        start: Date | null
        end?: Date | null
        age?: number
    } | any
    color: string
    id: string
    nextMarriage?: { end?: Date | null }
    death: Date
    birth: Date
    yScale: PositionScale
    xScale: (date: Date) => number
}

export const PatriarchMarriage: React.FC<Props> = ({
    marriage,
    color,
    id,
    nextMarriage,
    death,
    birth,
    xScale,
    yScale,
}) => {
    const patriarchEnd = Math.min(marriage.end?.getTime() || Infinity, death.getTime())
    return (
        <>
            <AreaClosed
                key={marriage.start?.getTime()}
                id={id}
                data={[
                    { x: xScale(marriage.start!), y: 0 },
                    { x: xScale(new Date(patriarchEnd)), y: 0 },
                    { x: xScale(new Date(patriarchEnd)), y: barHeight },
                    { x: xScale(marriage.start!), y: barHeight },
                ]}
                x={d => d.x}
                y={d => d.y}
                yScale={yScale}
                fill={color}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
            <MarriageLabel
                xStart={xScale(marriage.start!)}
                xEnd={xScale(marriage.end ?? nextMarriage?.end ?? death)}
                yStart={0}
                year={marriage.start!.getFullYear()}
                age={marriage.age || marriage.start!.getFullYear() - birth.getFullYear()}
            />
        </>
    )
}
