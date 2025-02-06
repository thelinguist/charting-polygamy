import { Text, TextProps } from "@visx/text"
import { barWidth, labelMarginStart, timelineAnnotationProps } from "./constants"

interface Props {
    xStart: number
    yStart: number
    year: number
}

export const BirthLabel: React.FC<Props> = ({ xStart, yStart, year }) => {
    return (
        <Text
            {...(timelineAnnotationProps as Partial<TextProps>)}
            x={xStart + labelMarginStart}
            y={yStart + barWidth / 2}
        >
            {year}
        </Text>
    )
}
