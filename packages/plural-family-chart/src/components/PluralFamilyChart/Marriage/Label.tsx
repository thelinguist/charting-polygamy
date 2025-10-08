import { ClippedText } from "../ClippedText"
import { barHeight, labelMarginStart } from "../constants"

interface Props {
    xStart: number
    xEnd: number
    yStart: number
    isActive?: boolean
    text1: string
    text2: string
}
export const Label: React.FC<Props> = ({ xStart, xEnd, yStart, isActive, text1, text2 }) => {
    // const { activeX } = useHoverContext()
    // const isActive = activeX === xStart
    // if (!!activeX && !isActive) return null
    return (
        <>
            <ClippedText
                disableClip={isActive}
                xStart={xStart + labelMarginStart}
                xEnd={xEnd}
                y={yStart + barHeight / 3}
            >
                {text1}
            </ClippedText>
            <ClippedText
                disableClip={isActive}
                xStart={xStart + labelMarginStart}
                xEnd={xEnd}
                y={yStart + (barHeight * 2) / 3}
            >
                {text2}
            </ClippedText>
        </>
    )
}
