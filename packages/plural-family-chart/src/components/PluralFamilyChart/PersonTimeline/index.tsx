import { barHeight, patriarchColor, spouseColor, strokeColor, strokeWidth } from "../constants"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { HoverContextProvider } from "../../../hooks/HoverContextProvider"

const capHeight = barHeight * 0.5
const whiskerStrokeWidth = 2

interface Props {
    name: string
    birth: Date
    death: Date
    isPatriarch?: boolean
    yScale?: PositionScale // actually ordinal scale
    xScale: (date: Date) => number
    children?: React.ReactElement | React.ReactElement[]
}

export const PersonTimeline: React.FC<Props> = ({ birth, death, name, isPatriarch, yScale, xScale, children }) => {
    // @ts-expect-error idk what the type should be for ordinal scales
    const yStart: number = yScale(name) ?? 0
    const yMid = yStart + barHeight / 2
    const capTop = yMid - capHeight / 2
    const capBottom = yMid + capHeight / 2

    const x0 = xScale(birth)
    const x1 = xScale(death)
    const color = isPatriarch ? patriarchColor : spouseColor

    return (
        <HoverContextProvider>
            <g>
                <g id={isPatriarch ? `patriarch-${name}` : `spouse-${name}`}>
                    {/* whisker line */}
                    <line
                        x1={x0}
                        y1={yMid}
                        x2={x1}
                        y2={yMid}
                        stroke={color}
                        strokeWidth={isPatriarch ? whiskerStrokeWidth + 1 : whiskerStrokeWidth}
                    />
                    {/* birth cap */}
                    <line x1={x0} y1={capTop} x2={x0} y2={capBottom} stroke={strokeColor} strokeWidth={strokeWidth} />
                    {/* death cap */}
                    <line x1={x1} y1={capTop} x2={x1} y2={capBottom} stroke={strokeColor} strokeWidth={strokeWidth} />
                </g>
                {children}
            </g>
        </HoverContextProvider>
    )
}
