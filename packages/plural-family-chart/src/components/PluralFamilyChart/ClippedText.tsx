import { Text, TextProps } from "@visx/text"
import { labelMarginStart, timelineAnnotationProps } from "./constants"
import React from "react"
import { Group } from "@visx/group"
import { useOnHoverOrTap } from "../../hooks/useOnHoverOrTap"

interface Props {
    xStart: number
    xEnd: number
    y: number
}

export const ClippedText: React.FC<TextProps & Props> = ({ xStart, xEnd, y, children, ...rest }) => {
    const { handlers, isActive } = useOnHoverOrTap()
    const textX = xStart + labelMarginStart
    const availableWidthForText = xEnd - textX
    const clipRectWidth = Math.max(0, availableWidthForText)

    const clipPathId = React.useId()

    return (
        <Group
            {...handlers}
            style={{ cursor: "pointer" }}
        >
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
                x={textX}
                y={y}
                verticalAnchor="start"
                textAnchor="start"
                {...rest}
                clipPath={isActive ? undefined : `url(#${clipPathId})`}
            >
                {children}
            </Text>
        </Group>
    )
}
