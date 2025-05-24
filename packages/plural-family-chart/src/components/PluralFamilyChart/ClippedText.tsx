import { Text, TextProps } from "@visx/text"
import { labelMarginStart, timelineAnnotationProps } from "./constants"
import React from "react"
import { Group } from "@visx/group"

interface Props {
    xStart: number
    xEnd: number
    y: number
}
export const ClippedText: React.FC<TextProps & Props> = ({ xStart, xEnd, y, children, ...rest }) => {
    const textX = xStart + labelMarginStart
    const availableWidthForText = xEnd - textX
    // Ensure clipRectWidth is not negative, as a negative width is invalid for a rect.
    const clipRectWidth = Math.max(0, availableWidthForText)

    const clipPathId = React.useId()

    return (
        <Group>
            <defs>
                <clipPath id={clipPathId}>
                    <rect
                        x={textX}
                        y={y}
                        width={clipRectWidth}
                        height={timelineAnnotationProps.fontSize} // Clip height should match font size
                    />
                </clipPath>
            </defs>
            <Text
                {...(timelineAnnotationProps as Partial<TextProps>)}
                x={xStart + labelMarginStart}
                width={xEnd - xStart}
                y={y}
                verticalAnchor="start"
                textAnchor="start"
                {...rest}
                clipPath={`url(#${clipPathId})`}
            >
                {children}
            </Text>
        </Group>
    )
}
