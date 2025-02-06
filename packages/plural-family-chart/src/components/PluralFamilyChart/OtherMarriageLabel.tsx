import { Text, TextProps } from "@visx/text"
import { barWidth, labelMarginStart, timelineAnnotationProps } from "./constants.ts"

interface Props {
    xStart: number
    yStart: number
    year: number
    name: string
}
export const OtherMarriageLabel: React.FC<Props> = ({ xStart, yStart, year, name }) => {
    return (
        <>
            <Text
                {...(timelineAnnotationProps as Partial<TextProps>)}
                x={xStart + labelMarginStart}
                y={yStart + barWidth / 3}
            >
                {year}
            </Text>
            <Text
                {...(timelineAnnotationProps as Partial<TextProps>)}
                x={xStart + labelMarginStart}
                y={yStart + (barWidth * 2) / 3}
            >
                {name}
            </Text>
        </>
    )
}
