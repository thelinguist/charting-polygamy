import AreaClosed from "@visx/shape/lib/shapes/AreaClosed"
import {
    barHeight,
    labelMarginStart,
    patriarchColor,
    spouseColor,
    strokeColor,
    strokeWidth,
    timelineAnnotationProps,
} from "../constants"
import React from "react"
import { PositionScale } from "@visx/shape/lib/types"
import { HoverContextProvider } from "../../../hooks/HoverContextProvider"
import { Text, TextProps } from "@visx/text"
import { Area } from "@visx/shape"

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
    const yEnd = yStart + barHeight
    const lifeBounds = [
        { x: xScale(birth), y: yStart },
        { x: xScale(death), y: yStart },
        { x: xScale(death), y: yEnd },
        { x: xScale(birth), y: yEnd },
    ]
    return (
        <HoverContextProvider>
            <g>
                {isPatriarch ? (
                    <AreaClosed // there's a bug where the spouse box will start at x,0 when it's area closed
                        id={`patriarch-${name}`}
                        data={lifeBounds}
                        x={d => d.x}
                        y={d => d.y}
                        yScale={yScale!}
                        fill={patriarchColor}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                    />
                ) : (
                    <Area
                        id={`spouse-${name}`}
                        data={lifeBounds}
                        x0={lifeBounds[0].x + 0.000001}
                        x1={lifeBounds[1].x}
                        y={d => d.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        fill={spouseColor}
                    />
                )}
                <Text
                    {...(timelineAnnotationProps as Partial<TextProps>)}
                    x={xScale(birth) + labelMarginStart}
                    y={yStart + barHeight / 2}
                >
                    {birth.getFullYear()}
                </Text>
                {children}
            </g>
        </HoverContextProvider>
    )
}
