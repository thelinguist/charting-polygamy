import { Text, TextProps } from "@visx/text"
import { barWidth, labelMarginStart, timelineAnnotationProps } from "./constants.ts"
import { Group } from "@visx/group"
import React from "react"

interface Props {
    xStart: number
    xEnd: number
    yStart: number
    year: number
    name: string
}

export const OtherMarriageLabel: React.FC<Props> = ({ xStart, yStart, xEnd, year, name }) => {
    const textX = xStart + labelMarginStart
    const availableWidthForText = xEnd - textX
    // Ensure clipRectWidth is not negative, as a negative width is invalid for a rect.
    const clipRectWidth = Math.max(0, availableWidthForText)

    const yearClipPathId = React.useId()
    const nameClipPathId = React.useId()

    const rectYOffset = -timelineAnnotationProps.fontSize! / 2

    const yearTextY = yStart + barWidth / 3
    const nameTextY = yStart + (barWidth * 2) / 3

    // The y-coordinate for the <rect> in the clipPath.
    const yearClipRectY = yearTextY + rectYOffset
    const nameClipRectY = nameTextY + rectYOffset

    return (
        <Group>
            <defs>
                <clipPath id={yearClipPathId}>
                    <rect
                        x={textX}
                        y={yearClipRectY}
                        width={clipRectWidth}
                        height={timelineAnnotationProps.fontSize} // Clip height should match font size
                    />
                </clipPath>
                <clipPath id={nameClipPathId}>
                    <rect
                        x={textX}
                        y={nameClipRectY}
                        width={clipRectWidth}
                        height={timelineAnnotationProps.fontSize} // Clip height should match font size
                    />
                </clipPath>
            </defs>
            <Text
                {...timelineAnnotationProps as Partial<TextProps>}
                x={textX}
                y={yearTextY}
                clipPath={`url(#${yearClipPathId})`}
            >
                {year}
            </Text>
            <Text
                {...timelineAnnotationProps as Partial<TextProps>}
                x={textX}
                y={nameTextY}
                clipPath={`url(#${nameClipPathId})`}
            >
                {name}
            </Text>
        </Group>
    )
}