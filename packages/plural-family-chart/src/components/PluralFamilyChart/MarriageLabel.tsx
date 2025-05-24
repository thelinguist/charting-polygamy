import { barHeight, labelMarginStart } from "./constants.ts"
import { ClippedText } from "./ClippedText.tsx"

interface Props {
    xStart: number
    xEnd: number
    yStart: number
    year: number
    age: number
}
export const MarriageLabel: React.FC<Props> = ({ xStart, xEnd, yStart, year, age }) => {
    return (
        <>
            <ClippedText
                xStart={xStart + labelMarginStart}
                xEnd={xEnd}
                y={yStart + barHeight / 3}
            >
                {year}
            </ClippedText>
            <ClippedText
                xStart={xStart + labelMarginStart}
                xEnd={xEnd}
                y={yStart + (barHeight * 2) / 3}
            >
                {`${age.toString()} years old`}
            </ClippedText>
        </>
    )
}
