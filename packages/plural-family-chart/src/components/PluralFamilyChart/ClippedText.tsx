import { Text, TextProps } from "@visx/text"
import { labelMarginStart, timelineAnnotationProps } from "./constants"

interface Props {
    xStart: number
    xEnd: number
    y: number
}
export const ClippedText: React.FC<TextProps & Props> = ({ xStart, xEnd, y, children, ...rest }) => {
    return (
        <Text
            {...(timelineAnnotationProps as Partial<TextProps>)}
            x={xStart + labelMarginStart}
            width={xEnd - xStart}
            y={y}
            verticalAnchor="start"
            textAnchor="start"
            {...rest}
        >
            {children}
        </Text>
    )
}
